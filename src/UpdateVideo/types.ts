import type { z } from "zod";
import type { updateVideoSchema } from "./schemas";

export type UpdateCategory =
  | "ui_change"
  | "new_feature"
  | "bug_fix"
  | "breaking_change";

export type SceneType =
  | "overview"
  | "breaking_change"
  | "new_feature"
  | "ui_change"
  | "bug_fixes_batch"
  | "wrapup";

export interface SceneConfig {
  type: SceneType;
  durationInFrames: number;
  data: {
    title: string;
    description: string;
    beforeImage?: string;
    afterImage?: string;
    items?: string[];
    totalUpdates?: number;
    moreCount?: number;
  };
}

export type ConsolidatedVideoConfig = z.infer<typeof updateVideoSchema>;
