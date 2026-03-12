import type { SceneConfig } from "../UpdateVideo/types";
import type { TierAllocation } from "./tier-strategy";

/**
 * Build an array of SceneConfig objects from the tier allocation.
 * Groups bug fixes into a single batch scene.
 */
export function buildSceneConfigs(
  allocation: TierAllocation
): SceneConfig[] {
  const scenes: SceneConfig[] = [];
  const bugFixes: string[] = [];

  for (const update of allocation.included) {
    if (update.category === "bug_fix") {
      bugFixes.push(update.title);
      continue;
    }

    const sceneType = update.category as SceneConfig["type"];
    scenes.push({
      type: sceneType,
      durationInFrames: allocation.getDuration(update.category),
      data: {
        title: update.title,
        description: update.description,
        beforeImage: update.visuals?.beforeScreenshot,
        afterImage: update.visuals?.afterScreenshot,
      },
    });
  }

  // Batch all bug fixes into one scene
  if (bugFixes.length > 0) {
    const excludedBugFixes = allocation.excluded.filter(
      (u) => u.category === "bug_fix"
    );
    scenes.push({
      type: "bug_fixes_batch",
      durationInFrames: allocation.getDuration("bug_fix"),
      data: {
        title: "Bug Fixes",
        description: `${bugFixes.length} issues resolved`,
        items: bugFixes,
        moreCount: excludedBugFixes.length,
      },
    });
  }

  return scenes;
}
