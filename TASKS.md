# Tasks

## Update Video System

- [x] Plan system architecture (5 components)
- [x] Phase 1: Remotion Compositions — scene templates + dynamic composition
- [x] Phase 2: Consolidation Engine — dedup, tiering, scene building
- [x] Phase 3: Capture Pipeline — CI/CD hook, Playwright screenshots, Claude API diff analysis
- [x] Phase 4: Store + API — persistence layer, user tracking, API endpoints
- [x] Phase 5: Client SDK — `<WhatsNewModal />` component with `@remotion/player`

## Next Steps (when ready)

- [ ] Integration test: run full pipeline end-to-end (capture → ingest → serve → render)
- [ ] Package as npm library with proper entry points
- [ ] Add database adapter (Postgres/SQLite) for production storage
- [ ] Add authentication to API endpoints
- [ ] Server-side rendering: pre-render videos as MP4 via `@remotion/renderer`
