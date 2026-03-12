import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    sdk: "src/sdk/index.ts",
    compositions: "src/UpdateVideo/index.tsx",
    consolidation: "src/consolidation/engine.ts",
    server: "src/api/index.ts",
    capture: "src/capture/pipeline.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  outDir: "dist",
  external: [
    "react",
    "react-dom",
    "remotion",
    "@remotion/player",
    "@remotion/transitions",
    "@remotion/google-fonts",
    "@anthropic-ai/sdk",
    "playwright",
    "zod",
  ],
  sourcemap: true,
  clean: true,
});
