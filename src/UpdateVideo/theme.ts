import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import type { UpdateCategory } from "./types";

export const { fontFamily: interFont } = loadInter("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const { fontFamily: headingFont } = loadSpaceGrotesk("normal", {
  weights: ["500", "600", "700"],
  subsets: ["latin"],
});

export const colors = {
  bg: "#0f172a",
  bgLight: "#1e293b",
  textPrimary: "#fafafa",
  textSecondary: "#a1a1aa",
  textMuted: "#71717a",
};

export const categoryColors: Record<
  UpdateCategory,
  { primary: string; glow: string; label: string }
> = {
  breaking_change: {
    primary: "#f97316",
    glow: "#f9731640",
    label: "Breaking Change",
  },
  new_feature: {
    primary: "#22d3ee",
    glow: "#22d3ee40",
    label: "New Feature",
  },
  ui_change: {
    primary: "#a78bfa",
    glow: "#a78bfa40",
    label: "UI Update",
  },
  bug_fix: {
    primary: "#34d399",
    glow: "#34d39940",
    label: "Bug Fix",
  },
};

export const TRANSITION_FRAMES = 15;
