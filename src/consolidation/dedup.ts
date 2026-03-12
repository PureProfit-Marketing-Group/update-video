import type { UpdateRecord } from "./types";

/**
 * Deduplicate updates by feature area + category.
 * When the same feature area has multiple updates of the same category,
 * keep only the most recent one (latest-state-wins).
 */
export function deduplicate(updates: UpdateRecord[]): UpdateRecord[] {
  // Sort newest first so the first one we encounter per group is the keeper
  const sorted = [...updates].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  const seen = new Set<string>();
  const result: UpdateRecord[] = [];

  for (const update of sorted) {
    const key = `${update.featureArea}:${update.category}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(update);
    }
  }

  return result;
}
