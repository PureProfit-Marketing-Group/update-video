import type { UpdateRecord } from "../consolidation/types";

// --- Pipeline configuration ---

export interface CaptureConfig {
  projectId: string;
  projectName: string;
  /** Git ref to diff from (e.g., previous deploy tag) */
  fromRef: string;
  /** Git ref to diff to (defaults to HEAD) */
  toRef?: string;
  /** Production URL for "before" screenshots */
  prodUrl?: string;
  /** Staging/preview URL for "after" screenshots */
  stagingUrl?: string;
  /** Specific routes to screenshot (e.g., ["/dashboard", "/settings"]) */
  screenshotRoutes?: string[];
  /** Anthropic API key (falls back to ANTHROPIC_API_KEY env var) */
  anthropicApiKey?: string;
  /** Skip screenshot capture */
  skipScreenshots?: boolean;
}

// --- Git diff types ---

export interface DiffFile {
  path: string;
  status: "added" | "modified" | "deleted" | "renamed";
  additions: number;
  deletions: number;
  patch: string;
}

export interface DiffSummary {
  files: DiffFile[];
  totalAdditions: number;
  totalDeletions: number;
  fromRef: string;
  toRef: string;
}

// --- Screenshot types ---

export interface ScreenshotResult {
  route: string;
  beforePath?: string;
  afterPath?: string;
}

// --- Pipeline output ---

export interface CaptureResult {
  updates: UpdateRecord[];
  screenshots: ScreenshotResult[];
  diff: DiffSummary;
}
