import type { DiffSummary } from "./types";

/**
 * Build the prompt for Claude to analyze a git diff
 * and produce structured update records.
 */
export function buildAnalysisPrompt(diff: DiffSummary): string {
  const fileList = diff.files
    .map(
      (f) =>
        `${f.status.toUpperCase()} ${f.path} (+${f.additions}/-${f.deletions})`,
    )
    .join("\n");

  const patches = diff.files
    .filter((f) => f.patch && f.patch !== "(binary or unreadable file)")
    .map((f) => `--- ${f.path} ---\n${f.patch}`)
    .join("\n\n");

  return `You are analyzing a git diff for a software product. Your job is to identify **user-facing updates** and categorize them into structured records for a "What's New" video.

## Files Changed
${fileList}

## Patches
${patches}

## Instructions

For each meaningful, user-facing change, produce a JSON object with these fields:

- **category**: one of "ui_change", "new_feature", "bug_fix", "breaking_change"
- **priority**: 1 (critical) to 5 (minor)
- **featureArea**: the product area affected (e.g., "Dashboard", "Authentication", "Settings")
- **affectedComponents**: array of specific UI components or pages affected
- **title**: short, user-friendly title (e.g., "New Dark Mode Toggle")
- **description**: 1-2 sentence description written for end users, not developers
- **suggestedRoutes**: array of URL routes where this change is visible (e.g., ["/dashboard", "/settings/appearance"]) — used for automated screenshots

## Rules

1. **Skip non-user-facing changes**: internal refactoring, test files, CI config, documentation, type-only changes, dev tooling
2. **Group related file changes** into a single update (e.g., if 5 files changed for one feature, that's 1 update)
3. **Use clear, non-technical language** in titles and descriptions
4. **Priority guidelines**:
   - Breaking changes: 1-2
   - New features: 2-3
   - UI changes: 2-4
   - Bug fixes: 3-4
5. If there are NO user-facing changes, return an empty array

## Response Format

Return ONLY a JSON array, no markdown fences, no explanation:

[
  {
    "category": "new_feature",
    "priority": 2,
    "featureArea": "Dashboard",
    "affectedComponents": ["DashboardPage", "MetricsCard"],
    "title": "Real-Time Activity Feed",
    "description": "Your dashboard now shows a live feed of recent activity, updating every 30 seconds without needing to refresh.",
    "suggestedRoutes": ["/dashboard"]
  }
]`;
}
