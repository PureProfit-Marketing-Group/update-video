import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { GradientBackground } from "./GradientBackground";
import { SceneOverview } from "./SceneOverview";
import { SceneWrapUp } from "./SceneWrapUp";
import { SceneRenderer } from "./SceneRenderer";
import { TRANSITION_FRAMES } from "./theme";
import type { ConsolidatedVideoConfig, SceneConfig } from "./types";

// Scene durations
const OVERVIEW_DURATION = 130; // ~4.3s
const WRAPUP_DURATION = 120; // 4s

/** Compute total duration including transitions */
export function calculateTotalDuration(scenes: SceneConfig[]): number {
  const sceneDurations = scenes.reduce(
    (sum, s) => sum + s.durationInFrames,
    0
  );
  const totalScenes = scenes.length + 2; // + overview + wrapup
  const transitions = (totalScenes - 1) * TRANSITION_FRAMES;
  return OVERVIEW_DURATION + sceneDurations + WRAPUP_DURATION - transitions;
}

/** Count updates per category for the overview badges */
function countCategories(scenes: SceneConfig[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const scene of scenes) {
    if (scene.type === "overview" || scene.type === "wrapup") continue;
    const key = scene.type === "bug_fixes_batch" ? "bug_fix" : scene.type;
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

/** Determine accent color from first content scene */
function getAccentColor(scenes: SceneConfig[]): string {
  const first = scenes[0];
  if (!first) return "#22d3ee";
  switch (first.type) {
    case "breaking_change":
      return "#f97316";
    case "new_feature":
      return "#22d3ee";
    case "ui_change":
      return "#a78bfa";
    case "bug_fixes_batch":
      return "#34d399";
    default:
      return "#22d3ee";
  }
}

/** Pick a transition style, alternating between fade and slide */
function getTransition(index: number) {
  if (index % 2 === 0) {
    return fade();
  }
  return slide({ direction: index % 4 === 1 ? "from-right" : "from-left" });
}

/** Compute total "more" count from wrapup scene data */
function getTotalMore(scenes: SceneConfig[]): number {
  return scenes.reduce((sum, s) => sum + (s.data.moreCount ?? 0), 0);
}

export const UpdateVideo: React.FC<ConsolidatedVideoConfig> = ({
  projectName,
  totalMissedUpdates,
  scenes,
}) => {
  const categoryCounts = countCategories(scenes);
  const accent = getAccentColor(scenes);
  const moreCount = getTotalMore(scenes);

  return (
    <AbsoluteFill>
      <GradientBackground accentColor={accent} />

      <TransitionSeries>
        {/* Overview */}
        <TransitionSeries.Sequence durationInFrames={OVERVIEW_DURATION}>
          <SceneOverview
            projectName={projectName}
            totalUpdates={totalMissedUpdates}
            categoryCounts={categoryCounts}
          />
        </TransitionSeries.Sequence>

        {/* Content scenes — flatten transitions and sequences */}
        {scenes.flatMap((scene, i) => [
          <TransitionSeries.Transition
            key={`t-${i}`}
            presentation={getTransition(i)}
            timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
          />,
          <TransitionSeries.Sequence
            key={`s-${i}`}
            durationInFrames={scene.durationInFrames}
          >
            <SceneRenderer scene={scene} />
          </TransitionSeries.Sequence>,
        ])}

        {/* Wrapup */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />
        <TransitionSeries.Sequence durationInFrames={WRAPUP_DURATION}>
          <SceneWrapUp
            projectName={projectName}
            totalUpdates={totalMissedUpdates}
            moreCount={moreCount}
          />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
