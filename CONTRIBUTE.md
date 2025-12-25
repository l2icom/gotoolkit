# Contributing: Create a New App Module

This file is a concise HOWTO for creating a new module. High-level architecture, worker requirements, and repo-wide notes live in `AGENTS.md` — read that first.

## Quick steps

1. Copy an existing module (example: `public/grid.html`) to `public/your-app.html`.
2. Define a `STORAGE_KEY` and implement `loadState()` / `persistState()` to store module state in `localStorage`.
3. Add app header and tabs consistent with existing modules. Reuse IDs for share UI: `shareBtn`, `shareMenu`, `shareLinkField`, `shareCreateBtn`, `shareUpdateBtn`, `shareMenuStatus`.
4. Implement share payload builders: `buildSharePayload()` and `buildSharePreview()` and wire `window.goToolkitShareWorker` for saving/fetching shares if needed.
5. Add local drafts via `window.goToolkitCapsuleDrafts` (IndexedDB helpers) when offline persistence is desired.
6. Create the context/sidebar UI (prompt input, `promptTemplateMeta`) and hook IA controls to `GoToolkitIAClient` using `public/js/ia-config.js` for routing.
7. Reuse `public/js/prompt.js` templates and optionally `public/js/template-criteria.js` for template selection.
8. Verify CORS/Authorization headers for any requests that include `Authorization` and ensure worker preflight allows them.
9. Bump cache-buster query strings (see `AGENTS.md` for the canonical value) and deploy workers with `npx wrangler publish` when ready.

## Checklist

- [ ] Copy base module and rename.
- [ ] Implement `loadState()` / `persistState()` and `STORAGE_KEY`.
- [ ] Implement share UI and `buildSharePayload()` / `buildSharePreview()`.
- [ ] Add capsule/draft save via `goToolkitCapsuleDrafts` when needed.
- [ ] Wire IA client (`GoToolkitIAClient`) and `ia-config`.
- [ ] Add prompt templates and optional `template-criteria` modal.
- [ ] Validate CORS and worker secrets, then `npx wrangler publish`.

If you want, I can scaffold `public/newmodule.html` with the common wiring. Tell me the name and required features (share, drafts, IA), and I'll create it.

***
Short reference: `AGENTS.md` covers repo architecture, workers, and global contracts.
