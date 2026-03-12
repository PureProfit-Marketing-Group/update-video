# update-video

Auto-generated "What's New" videos for your app — powered by [Remotion](https://remotion.dev) and Claude AI.

When your users come back after missing a few deploys, show them a polished video walkthrough of what changed instead of a static changelog.

## How it works

```
Deploy → GitHub Action → Claude analyzes git diff → screenshots captured
  → Updates stored via API → User opens app → Modal plays personalized video
```

1. **Capture** — On each deploy, a CI pipeline analyzes your git diff with Claude AI, identifies user-facing changes, and optionally captures before/after screenshots with Playwright.
2. **Store** — Update records are ingested into a lightweight API server with user-level "last seen" tracking.
3. **Consolidate** — When a user has missed multiple updates, the consolidation engine deduplicates, prioritizes, and tiers them into a digestible video (short for 1-2 updates, summarized for 10+).
4. **Play** — A React modal with an embedded Remotion player shows the video in-app. When dismissed, it marks updates as seen.

## Install

```bash
npm install update-video
```

Peer dependencies (install in your project if not already present):

```bash
npm install react react-dom remotion zod
```

For the client SDK modal, also install:

```bash
npm install @remotion/player
```

## Quick start

### 1. Start the API server

The server stores update records and serves video configs to your client app.

```ts
import { createUpdateServer } from "update-video/server";

createUpdateServer({
  port: 3123,
  storage: "./.data", // JSON file storage (or "memory" for dev)
});
```

Or run it directly:

```bash
npx tsx node_modules/update-video/src/api/server.ts --port=3123 --storage=./.data
```

### 2. Add the modal to your app

```tsx
import { useWhatsNew, WhatsNewModal } from "update-video";

function App() {
  const whatsNew = useWhatsNew({
    apiBaseUrl: "http://localhost:3123",
    projectId: "my-app",
    userId: currentUser.id,
  });

  return (
    <>
      <YourApp />
      <WhatsNewModal {...whatsNew} />
    </>
  );
}
```

The modal auto-shows after 1.5s when there are unseen updates, and marks them as seen when dismissed.

### 3. Ingest some test data

```bash
curl -X POST http://localhost:3123/api/updates/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "updates": [
      {
        "id": "test-1",
        "projectId": "my-app",
        "deployId": "abc123",
        "createdAt": "2025-01-15T00:00:00Z",
        "category": "new_feature",
        "priority": 2,
        "featureArea": "Dashboard",
        "affectedComponents": ["DashboardPage"],
        "title": "Real-Time Activity Feed",
        "description": "Your dashboard now shows a live feed of recent activity, updating every 30 seconds."
      },
      {
        "id": "test-2",
        "projectId": "my-app",
        "deployId": "abc123",
        "createdAt": "2025-01-15T00:00:00Z",
        "category": "ui_change",
        "priority": 3,
        "featureArea": "Settings",
        "affectedComponents": ["SettingsPage"],
        "title": "Redesigned Settings Page",
        "description": "Settings are now organized into tabs for easier navigation."
      }
    ]
  }'
```

Refresh your app — the "What's New" modal should appear.

### 4. Set up automated capture (CI/CD)

Add the `ANTHROPIC_API_KEY` secret to your GitHub repo, then the included GitHub Action captures updates on every version tag:

```bash
git tag v1.0.0
git push --tags
```

The action at `.github/workflows/capture-updates.yml`:
- Diffs between the current and previous tag
- Sends the diff to Claude for analysis
- Outputs structured `UpdateRecord[]` as a build artifact

You can also run the capture pipeline locally:

```bash
ANTHROPIC_API_KEY=sk-... npx tsx node_modules/update-video/src/capture/pipeline.ts \
  --project-id=my-app \
  --from=HEAD~5 \
  --skip-screenshots
```

## Entry points

| Import | Purpose |
|--------|---------|
| `update-video` | Client SDK — `useWhatsNew()` hook + `<WhatsNewModal />` |
| `update-video/server` | Store adapters + API server |
| `update-video/capture` | Capture pipeline for CI/CD |
| `update-video/compositions` | Remotion compositions for custom rendering |
| `update-video/consolidation` | Standalone consolidation engine |

## API reference

### Client SDK

```tsx
import { useWhatsNew, WhatsNewModal } from "update-video";
```

#### `useWhatsNew(config)`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiBaseUrl` | `string` | — | Base URL of your update-video API |
| `projectId` | `string` | — | Project identifier |
| `userId` | `string` | — | Current user's ID |
| `autoShow` | `boolean` | `true` | Auto-show modal when unseen updates exist |
| `autoShowDelay` | `number` | `1500` | Delay in ms before auto-showing |
| `markSeenOnDismiss` | `boolean` | `true` | Mark updates as seen when modal is closed |
| `onShow` | `() => void` | — | Callback when modal opens |
| `onDismiss` | `() => void` | — | Callback when modal closes |

Returns:

| Property | Type | Description |
|----------|------|-------------|
| `hasUpdates` | `boolean` | Whether unseen updates exist |
| `config` | `ConsolidatedVideoConfig \| null` | Video configuration |
| `isVisible` | `boolean` | Modal visibility state |
| `isLoading` | `boolean` | Whether config is being fetched |
| `error` | `string \| null` | Error message if fetch failed |
| `show()` | `() => void` | Manually show the modal |
| `dismiss()` | `() => void` | Dismiss the modal |
| `markSeen()` | `() => Promise<void>` | Manually mark updates as seen |
| `refresh()` | `() => Promise<void>` | Re-fetch the config |

#### `<WhatsNewModal />`

Spread the `useWhatsNew()` return value as props:

```tsx
<WhatsNewModal {...whatsNew} width={960} height={540} />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `number` | `960` | Player width in pixels |
| `height` | `number` | `540` | Player height in pixels |

### Server

```ts
import { createUpdateServer } from "update-video/server";
import { FileUpdateStore, FileUserStateStore } from "update-video/server";
```

#### API endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/updates/ingest` | Ingest update records from capture pipeline |
| `GET` | `/api/updates/:projectId` | List all updates for a project |
| `GET` | `/api/updates/:projectId/video-config?userId=X` | Get consolidated video config for a user |
| `POST` | `/api/updates/:projectId/seen` | Mark updates as seen (`{ userId, deployId? }`) |
| `GET` | `/api/projects` | List all projects |

#### Storage adapters

- **`MemoryUpdateStore` / `MemoryUserStateStore`** — In-memory, for development
- **`FileUpdateStore` / `FileUserStateStore`** — JSON file-based, for simple deployments

Implement the `UpdateStore` and `UserStateStore` interfaces for your own database (Postgres, SQLite, etc.).

### Capture pipeline

```ts
import { runCapturePipeline } from "update-video/capture";

const result = await runCapturePipeline({
  projectId: "my-app",
  projectName: "My App",
  fromRef: "v1.0.0",
  toRef: "HEAD",
  skipScreenshots: true,
  // Optional: provide URLs for before/after screenshots
  // prodUrl: "https://myapp.com",
  // stagingUrl: "https://staging.myapp.com",
  // screenshotRoutes: ["/dashboard", "/settings"],
});

// result.updates — UpdateRecord[] ready for ingest
// result.screenshots — ScreenshotResult[]
// result.diff — DiffSummary
```

### Consolidation engine

The consolidation engine can be used standalone to convert raw update records into a video config:

```ts
import { consolidate } from "update-video/consolidation";

const config = consolidate({
  projectName: "My App",
  updates: myUpdates,
});

// config.tier — 1 (few updates), 2 (moderate), or 3 (many)
// config.scenes — SceneConfig[] ready for Remotion
```

**Tiering strategy:**
- **Tier 1** (1-2 updates) — Full detail for every change
- **Tier 2** (3-10 updates) — Grouped with batched bug fixes
- **Tier 3** (10+ updates) — Highlights only, top features + summary

## Scene types

The video composition includes 6 scene templates:

| Scene | Used for | Visual style |
|-------|----------|-------------|
| Overview | Opening — shows project name + update count badges | Animated entrance with category pills |
| Breaking Change | Critical changes that affect workflows | Orange accent, warning icon, pulse animation |
| New Feature | New capabilities | Cyan accent, optional screenshot |
| UI Change | Visual/layout updates | Purple accent, before/after comparison |
| Bug Fixes Batch | Multiple bug fixes grouped into one scene | Green accent, scrolling checklist |
| Wrap Up | Closing — summary + "and N more" count | Fade out with project branding |

## GitHub Action

The included workflow at `.github/workflows/capture-updates.yml` triggers on version tags. Configure it with these repo variables and secrets:

| Name | Type | Description |
|------|------|-------------|
| `ANTHROPIC_API_KEY` | Secret | Claude API key for diff analysis |
| `UPDATE_VIDEO_PROJECT_ID` | Variable | Your project identifier |
| `UPDATE_VIDEO_PROJECT_NAME` | Variable | Display name for the video |
| `UPDATE_VIDEO_PROD_URL` | Variable | Production URL (for before screenshots) |
| `UPDATE_VIDEO_STAGING_URL` | Variable | Staging URL (for after screenshots) |

## Development

```bash
# Preview compositions in Remotion Studio
npm run dev

# Type-check
npm run typecheck

# Build the library
npm run build
```

## License

MIT
