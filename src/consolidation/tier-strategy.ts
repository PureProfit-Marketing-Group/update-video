import type { UpdateRecord } from "./types";

export type Tier = 1 | 2 | 3;

/** Determine the video tier based on deduped update count */
export function determineTier(dedupedCount: number): Tier {
  if (dedupedCount < 3) return 1;
  if (dedupedCount <= 10) return 2;
  return 3;
}

/** Duration in frames at 30fps for each category per tier */
const DURATION_MAP: Record<Tier, Record<string, number>> = {
  1: {
    breaking_change: 150, // 5s
    new_feature: 135, // 4.5s
    ui_change: 120, // 4s
    bug_fix: 105, // 3.5s
  },
  2: {
    breaking_change: 150,
    new_feature: 135,
    ui_change: 105, // 3.5s (compressed)
    bug_fix: 90, // 3s (batched)
  },
  3: {
    breaking_change: 150,
    new_feature: 120, // 4s (compressed)
    ui_change: 105,
    bug_fix: 90,
  },
};

/** Max number of scenes per category for each tier */
const LIMITS: Record<Tier, Record<string, number>> = {
  1: { breaking_change: Infinity, new_feature: Infinity, ui_change: Infinity, bug_fix: Infinity },
  2: { breaking_change: Infinity, new_feature: Infinity, ui_change: Infinity, bug_fix: 1 },
  3: { breaking_change: Infinity, new_feature: 3, ui_change: 2, bug_fix: 1 },
};

export interface TierAllocation {
  tier: Tier;
  included: UpdateRecord[];
  excluded: UpdateRecord[];
  getDuration: (category: string) => number;
}

/**
 * Apply the tier strategy: determine which updates get shown and which
 * get rolled into a "and N more" count.
 */
export function applyTierStrategy(
  updates: UpdateRecord[],
  tier: Tier
): TierAllocation {
  const limits = LIMITS[tier];

  // Sort by priority (highest first), then by date (newest first)
  const sorted = [...updates].sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  // Group by category
  const groups: Record<string, UpdateRecord[]> = {};
  for (const update of sorted) {
    const cat = update.category;
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(update);
  }

  const included: UpdateRecord[] = [];
  const excluded: UpdateRecord[] = [];

  // Category display order: breaking first, then features, UI, bug fixes
  const ORDER: string[] = [
    "breaking_change",
    "new_feature",
    "ui_change",
    "bug_fix",
  ];

  for (const cat of ORDER) {
    const items = groups[cat] ?? [];
    const limit = limits[cat] ?? Infinity;
    included.push(...items.slice(0, limit));
    excluded.push(...items.slice(limit));
  }

  return {
    tier,
    included,
    excluded,
    getDuration: (category: string) =>
      DURATION_MAP[tier][category] ?? DURATION_MAP[tier].bug_fix,
  };
}
