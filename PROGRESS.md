# Progress Log

## Session: 2026-03-12

### What was done
- **Planned the Update Video System** — a feature that creates tutorial-style "What's New" videos for client apps using Remotion, with intelligent consolidation when users miss multiple updates
- **Built Phase 1: Remotion Compositions** (`src/UpdateVideo/`)
  - 6 scene templates: Overview, BreakingChange, NewFeature, UIChange, BugFixesBatch, WrapUp
  - Dynamic composition with TransitionSeries, animated backgrounds, spring animations
  - Zod schema validation for input props
  - 3 preview compositions registered (Tier 1, 2, 3) with mock data
- **Built Phase 2: Consolidation Engine** (`src/consolidation/`)
  - Deduplication: latest-state-wins per feature area + category
  - Tiered strategy: <3 updates = full detail, 3-10 = grouped, 10+ = highlights only
  - Scene builder: converts allocated updates into Remotion SceneConfig objects
  - Pipeline: `dedup → tier → allocate → build scenes`
- All code compiles cleanly (`npx tsc --noEmit` passes)

### Session 2 (continued)
- **Built Phase 3: Capture Pipeline** (`src/capture/`)
  - `git-diff.ts`: Extracts structured diffs (numstat + patches, auto-truncated)
  - `prompt.ts`: Claude analysis prompt — identifies user-facing updates, skips internals
  - `analyze-diff.ts`: Sends diff to Claude API → `UpdateRecord[]` with suggested screenshot routes
  - `capture-screenshots.ts`: Playwright before/after screenshot capture (prod vs staging URLs)
  - `pipeline.ts`: Orchestrator with CLI entry point
  - `.github/workflows/capture-updates.yml`: GitHub Action triggered on version tags
- **Built Phase 4: Store + API** (`src/store/`, `src/api/`)
  - Storage interface with two adapters: in-memory (dev) and JSON file-based (simple deploys)
  - User state tracking (last-seen deploy per user per project)
  - Framework-agnostic API handlers + standalone HTTP server (Node built-in, zero deps)
  - 5 endpoints: ingest, list updates, video-config, mark seen, list projects
  - Key flow: `GET /video-config` → fetch unseen → run consolidation engine → return config
- **Built Phase 5: Client SDK** (`src/sdk/`)
  - `useWhatsNew()` hook: fetches config, manages visibility, auto-show with delay
  - `<WhatsNewModal />`: dark-themed modal overlay with `@remotion/player`
  - `UpdateVideoClient`: lightweight API client
  - Auto-marks seen on dismiss, supports manual control
- All 5 phases compile cleanly (`npx tsc --noEmit` passes)

### Session 3 (continued)
- **Packaged as npm library** (`update-video@0.1.1`)
  - 5 entry points: `.` (SDK), `./server`, `./capture`, `./compositions`, `./consolidation`
  - tsup build: ESM + CJS dual output with TypeScript declarations
  - React/Remotion/zod as peer deps, Anthropic SDK + Playwright as optional deps
  - `prepublishOnly` hook for automatic builds on publish
- **Created GitHub repo** — https://github.com/ehoyos007/update-video
- **Published to npm** — https://www.npmjs.com/package/update-video
- **Wrote comprehensive README** — Quick Start guide, full API reference, scene types, GitHub Action config

### Where we left off
- **Library is published and live.** All 5 phases built, packaged, and distributed.
- Potential next steps: integration test in a real client app, add database adapter (Postgres/SQLite), add auth to API, server-side MP4 rendering via `@remotion/renderer`

### Key decisions made
- **Data source:** AI-generated from git diffs (Claude API)
- **Visuals:** Hybrid — auto-capture screenshots via Playwright, fall back to animated descriptions
- **Consolidation:** Tiered system with latest-state-wins deduplication
- **Delivery:** Embedded in-app modal using `@remotion/player`
- **Context:** Building update videos for client apps
