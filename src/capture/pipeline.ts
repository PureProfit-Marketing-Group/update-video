import type { CaptureConfig, CaptureResult } from "./types";
import { getGitDiff, getPreviousDeployRef } from "./git-diff";
import { analyzeDiff } from "./analyze-diff";
import { captureScreenshots } from "./capture-screenshots";

/**
 * Run the full capture pipeline:
 *
 * 1. Extract git diff between refs
 * 2. Send diff to Claude for analysis → UpdateRecord[]
 * 3. Capture before/after screenshots (optional)
 * 4. Attach screenshot paths to matching updates
 *
 * Returns a CaptureResult ready for storage (Phase 4).
 */
export async function runCapturePipeline(
  config: CaptureConfig,
): Promise<CaptureResult> {
  const fromRef = config.fromRef || getPreviousDeployRef();
  const toRef = config.toRef ?? "HEAD";

  console.log(`[capture] Diffing ${fromRef}..${toRef}`);

  // Step 1: Get the diff
  const diff = getGitDiff(fromRef, toRef);
  console.log(
    `[capture] Found ${diff.files.length} changed files (+${diff.totalAdditions}/-${diff.totalDeletions})`,
  );

  if (diff.files.length === 0) {
    console.log("[capture] No changes found, skipping.");
    return { updates: [], screenshots: [], diff };
  }

  // Step 2: Analyze with Claude
  console.log("[capture] Analyzing diff with Claude...");
  const { updates, suggestedRoutes } = await analyzeDiff(diff, {
    projectId: config.projectId,
    deployId: toRef.slice(0, 8),
    apiKey: config.anthropicApiKey,
  });
  console.log(`[capture] Claude identified ${updates.length} user-facing updates`);

  // Step 3: Capture screenshots (optional)
  let screenshots: CaptureResult["screenshots"] = [];

  if (!config.skipScreenshots) {
    const routes = config.screenshotRoutes ?? suggestedRoutes;
    if (routes.length > 0 && (config.prodUrl || config.stagingUrl)) {
      console.log(`[capture] Capturing screenshots for ${routes.length} routes...`);
      screenshots = await captureScreenshots(routes, {
        prodUrl: config.prodUrl,
        stagingUrl: config.stagingUrl,
      });
      console.log(`[capture] Captured ${screenshots.length} screenshot sets`);

      // Attach screenshots to matching updates
      attachScreenshots(updates, screenshots);
    }
  }

  console.log("[capture] Pipeline complete.");
  return { updates, screenshots, diff };
}

/**
 * Match screenshots to updates based on route → affectedComponents overlap.
 */
function attachScreenshots(
  updates: CaptureResult["updates"],
  screenshots: CaptureResult["screenshots"],
): void {
  for (const screenshot of screenshots) {
    // Find updates whose affected components relate to this route
    const routeName = screenshot.route.replace(/\//g, "").toLowerCase();

    for (const update of updates) {
      const matchesRoute = update.affectedComponents.some((comp) =>
        comp.toLowerCase().includes(routeName),
      );
      const matchesArea = update.featureArea.toLowerCase().includes(routeName);

      if (matchesRoute || matchesArea) {
        update.visuals = {
          beforeScreenshot: screenshot.beforePath,
          afterScreenshot: screenshot.afterPath,
        };
      }
    }
  }
}

/**
 * CLI entry point — run the capture pipeline from the command line.
 *
 * Usage:
 *   npx tsx src/capture/pipeline.ts --project-id=my-app --from=v1.0.0
 */
async function main() {
  const args = process.argv.slice(2);
  const getArg = (name: string) =>
    args.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];

  const config: CaptureConfig = {
    projectId: getArg("project-id") ?? "default",
    projectName: getArg("project-name") ?? "My Project",
    fromRef: getArg("from") ?? getPreviousDeployRef(),
    toRef: getArg("to") ?? "HEAD",
    prodUrl: getArg("prod-url"),
    stagingUrl: getArg("staging-url"),
    skipScreenshots: args.includes("--skip-screenshots"),
    anthropicApiKey: getArg("api-key"),
  };

  const result = await runCapturePipeline(config);

  // Output as JSON for piping to Phase 4
  console.log("\n--- CAPTURE RESULT ---");
  console.log(
    JSON.stringify(
      {
        updates: result.updates,
        screenshots: result.screenshots,
        fileCount: result.diff.files.length,
        additions: result.diff.totalAdditions,
        deletions: result.diff.totalDeletions,
      },
      null,
      2,
    ),
  );
}

// Run if invoked directly
const isDirectRun =
  process.argv[1]?.includes("capture/pipeline") ?? false;
if (isDirectRun) {
  main().catch((err) => {
    console.error("[capture] Pipeline failed:", err);
    process.exit(1);
  });
}
