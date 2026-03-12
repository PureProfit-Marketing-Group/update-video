import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { GradientBackground } from "./GradientBackground";
import { SceneIntro } from "./SceneIntro";
import { SceneProblem } from "./SceneProblem";
import { SceneMetrics } from "./SceneMetrics";
import { SceneGrowthStack } from "./SceneGrowthStack";
import { SceneCaseStudy } from "./SceneCaseStudy";
import { SceneCTA } from "./SceneCTA";

// Scene durations in frames (at 30fps)
const INTRO = 130; // ~4.3s
const PROBLEM = 130; // ~4.3s
const METRICS = 140; // ~4.7s
const GROWTH = 150; // ~5.0s
const CASE_STUDY = 160; // ~5.3s
const CTA = 130; // ~4.3s
const TRANSITION = 20;

export const SATORI_DURATION =
  INTRO + PROBLEM + METRICS + GROWTH + CASE_STUDY + CTA - 5 * TRANSITION;

export const SatoriShowcase: React.FC = () => {
  return (
    <AbsoluteFill>
      <GradientBackground />

      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={INTRO}>
          <SceneIntro />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        <TransitionSeries.Sequence durationInFrames={PROBLEM}>
          <SceneProblem />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        <TransitionSeries.Sequence durationInFrames={METRICS}>
          <SceneMetrics />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        <TransitionSeries.Sequence durationInFrames={GROWTH}>
          <SceneGrowthStack />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-left" })}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        <TransitionSeries.Sequence durationInFrames={CASE_STUDY}>
          <SceneCaseStudy />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        <TransitionSeries.Sequence durationInFrames={CTA}>
          <SceneCTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
