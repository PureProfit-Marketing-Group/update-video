import type { ConsolidatedVideoConfig } from "../UpdateVideo/types";
import type { UpdateRecord } from "./types";
import { deduplicate } from "./dedup";
import { determineTier, applyTierStrategy } from "./tier-strategy";
import { buildSceneConfigs } from "./scene-builder";

export interface ConsolidationInput {
  projectName: string;
  projectLogo?: string;
  updates: UpdateRecord[];
}

/**
 * Main consolidation pipeline.
 *
 * Takes raw update records and produces a video configuration:
 * 1. Deduplicate — latest-state-wins per feature area
 * 2. Determine tier based on deduped count
 * 3. Apply tier strategy — prioritize and trim to time budget
 * 4. Build scene configs for Remotion
 */
export function consolidate(
  input: ConsolidationInput
): ConsolidatedVideoConfig | null {
  if (input.updates.length === 0) return null;

  // Step 1: Deduplicate
  const deduped = deduplicate(input.updates);

  // Step 2: Determine tier
  const tier = determineTier(deduped.length);

  // Step 3: Apply tier strategy
  const allocation = applyTierStrategy(deduped, tier);

  // Step 4: Build scenes
  const scenes = buildSceneConfigs(allocation);

  if (scenes.length === 0) return null;

  return {
    projectName: input.projectName,
    projectLogo: input.projectLogo,
    tier,
    totalMissedUpdates: input.updates.length,
    scenes,
  };
}
