import type { ScreenshotResult } from "./types";

/**
 * Capture before/after screenshots for the given routes.
 *
 * Requires Playwright to be installed: `npx playwright install chromium`
 *
 * @param routes - URL paths to capture (e.g., ["/dashboard", "/settings"])
 * @param options.prodUrl - Base URL for "before" screenshots (production)
 * @param options.stagingUrl - Base URL for "after" screenshots (staging/preview)
 * @param options.outputDir - Directory to save screenshots (default: .capture/screenshots)
 */
export async function captureScreenshots(
  routes: string[],
  options: {
    prodUrl?: string;
    stagingUrl?: string;
    outputDir?: string;
  },
): Promise<ScreenshotResult[]> {
  if (routes.length === 0) return [];
  if (!options.prodUrl && !options.stagingUrl) {
    console.warn("No URLs provided for screenshots, skipping capture.");
    return [];
  }

  // Dynamic import — Playwright is optional and heavy
  const { chromium } = await import("playwright");
  const { mkdirSync } = await import("fs");
  const { join } = await import("path");

  const outputDir = options.outputDir ?? ".capture/screenshots";
  mkdirSync(outputDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const results: ScreenshotResult[] = [];

  try {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
    });

    for (const route of routes) {
      const safeName = route.replace(/\//g, "_").replace(/^_/, "") || "root";
      const result: ScreenshotResult = { route };

      // Before screenshot (production)
      if (options.prodUrl) {
        try {
          const page = await context.newPage();
          await page.goto(`${options.prodUrl}${route}`, {
            waitUntil: "networkidle",
            timeout: 15000,
          });
          const path = join(outputDir, `${safeName}_before.png`);
          await page.screenshot({ path, fullPage: false });
          result.beforePath = path;
          await page.close();
        } catch (err) {
          console.warn(`Failed to capture before screenshot for ${route}:`, err);
        }
      }

      // After screenshot (staging)
      if (options.stagingUrl) {
        try {
          const page = await context.newPage();
          await page.goto(`${options.stagingUrl}${route}`, {
            waitUntil: "networkidle",
            timeout: 15000,
          });
          const path = join(outputDir, `${safeName}_after.png`);
          await page.screenshot({ path, fullPage: false });
          result.afterPath = path;
          await page.close();
        } catch (err) {
          console.warn(`Failed to capture after screenshot for ${route}:`, err);
        }
      }

      results.push(result);
    }
  } finally {
    await browser.close();
  }

  return results;
}
