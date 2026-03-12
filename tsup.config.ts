import { defineConfig } from "tsup";

export default defineConfig([
  // Client SDK — the main entry point
  {
    entry: { sdk: "src/sdk/index.ts" },
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
    ],
    sourcemap: true,
    clean: true,
  },
  // Remotion compositions — for rendering or custom players
  {
    entry: { compositions: "src/UpdateVideo/index.tsx" },
    format: ["esm", "cjs"],
    dts: true,
    outDir: "dist",
    external: [
      "react",
      "react-dom",
      "remotion",
      "@remotion/transitions",
      "@remotion/google-fonts",
      "zod",
    ],
    sourcemap: true,
  },
  // Consolidation engine — can be used standalone
  {
    entry: { consolidation: "src/consolidation/engine.ts" },
    format: ["esm", "cjs"],
    dts: true,
    outDir: "dist",
    sourcemap: true,
  },
  // Server — store + API layer
  {
    entry: { server: "src/api/index.ts" },
    format: ["esm", "cjs"],
    dts: true,
    outDir: "dist",
    sourcemap: true,
  },
  // Capture pipeline — CI/CD tooling
  {
    entry: { capture: "src/capture/pipeline.ts" },
    format: ["esm", "cjs"],
    dts: true,
    outDir: "dist",
    external: ["@anthropic-ai/sdk", "playwright"],
    sourcemap: true,
  },
]);
