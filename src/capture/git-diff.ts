import { execSync } from "child_process";
import type { DiffFile, DiffSummary } from "./types";

/**
 * Extract a structured diff summary between two git refs.
 */
export function getGitDiff(fromRef: string, toRef = "HEAD"): DiffSummary {
  const files = parseDiffStat(fromRef, toRef);
  const withPatches = files.map((file) => ({
    ...file,
    patch: getFilePatch(fromRef, toRef, file.path),
  }));

  return {
    files: withPatches,
    totalAdditions: withPatches.reduce((sum, f) => sum + f.additions, 0),
    totalDeletions: withPatches.reduce((sum, f) => sum + f.deletions, 0),
    fromRef,
    toRef,
  };
}

/**
 * Parse `git diff --numstat` to get file-level stats.
 */
function parseDiffStat(fromRef: string, toRef: string): DiffFile[] {
  const numstat = execSync(
    `git diff --numstat ${fromRef}..${toRef}`,
    { encoding: "utf-8" },
  ).trim();

  if (!numstat) return [];

  const statusOutput = execSync(
    `git diff --name-status ${fromRef}..${toRef}`,
    { encoding: "utf-8" },
  ).trim();

  const statusMap = new Map<string, DiffFile["status"]>();
  for (const line of statusOutput.split("\n")) {
    const [statusChar, ...pathParts] = line.split("\t");
    const path = pathParts[pathParts.length - 1] ?? "";
    statusMap.set(path, parseStatusChar(statusChar));
  }

  return numstat.split("\n").map((line) => {
    const [add, del, path] = line.split("\t");
    return {
      path,
      status: statusMap.get(path) ?? "modified",
      additions: add === "-" ? 0 : parseInt(add, 10),
      deletions: del === "-" ? 0 : parseInt(del, 10),
      patch: "",
    };
  });
}

function parseStatusChar(char: string): DiffFile["status"] {
  switch (char[0]) {
    case "A":
      return "added";
    case "D":
      return "deleted";
    case "R":
      return "renamed";
    default:
      return "modified";
  }
}

/**
 * Get the patch (unified diff) for a single file.
 * Truncates very large patches to keep Claude context manageable.
 */
function getFilePatch(
  fromRef: string,
  toRef: string,
  filePath: string,
): string {
  try {
    const patch = execSync(
      `git diff ${fromRef}..${toRef} -- "${filePath}"`,
      { encoding: "utf-8", maxBuffer: 1024 * 1024 },
    );

    const MAX_PATCH_LENGTH = 3000;
    if (patch.length > MAX_PATCH_LENGTH) {
      return (
        patch.slice(0, MAX_PATCH_LENGTH) +
        `\n... (truncated, ${patch.length - MAX_PATCH_LENGTH} more chars)`
      );
    }
    return patch;
  } catch {
    return "(binary or unreadable file)";
  }
}

/**
 * Get the list of git tags sorted by date (most recent first).
 * Useful for finding the previous deploy ref.
 */
export function getRecentTags(count = 5): string[] {
  try {
    const output = execSync(
      `git tag --sort=-creatordate | head -n ${count}`,
      { encoding: "utf-8" },
    ).trim();
    return output ? output.split("\n") : [];
  } catch {
    return [];
  }
}

/**
 * Get the commit hash of the previous deploy.
 * Tries: last tag → HEAD~1 as fallback.
 */
export function getPreviousDeployRef(): string {
  const tags = getRecentTags(1);
  if (tags.length > 0) return tags[0];

  return execSync("git rev-parse HEAD~1", { encoding: "utf-8" }).trim();
}
