import { z } from "zod";

const sceneConfigSchema = z.object({
  type: z.enum([
    "overview",
    "breaking_change",
    "new_feature",
    "ui_change",
    "bug_fixes_batch",
    "wrapup",
  ]),
  durationInFrames: z.number(),
  data: z.object({
    title: z.string(),
    description: z.string(),
    beforeImage: z.string().optional(),
    afterImage: z.string().optional(),
    items: z.array(z.string()).optional(),
    totalUpdates: z.number().optional(),
    moreCount: z.number().optional(),
  }),
});

export const updateVideoSchema = z.object({
  projectName: z.string(),
  projectLogo: z.string().optional(),
  tier: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  totalMissedUpdates: z.number(),
  scenes: z.array(sceneConfigSchema),
});
