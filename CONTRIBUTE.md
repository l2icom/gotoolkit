# Contributing: Create a New App Module

This doc describes the common structure and wiring for creating a new GoToolkit app module (public/*.html). Copy an existing module (canvas.html, grid.html, draw.html, timeline.html, voice.html) as a template and follow the checklist below.

**High-level**
- **Base file:** create `public/your-app.html` and include site-level assets (fonts, `styles/app-shell.css`) and `public/js/*` scripts used by other modules.
- **Copy app scaffold:** copy an existing module and remove unrelated bits; keep the header/nav and share UI patterns.

**Header & Tabs**
- **App header:** include the top app header (logo, page title, nav tabs). Use the same markup/IDs for consistency (e.g. `shareBtn`, `shareMenu`, `shareMenuStatus`).
- **Tabs behavior:** implement tab buttons (or reuse existing tab functions) tied to local storage keys and `STORAGE_KEY` pattern used across modules.

**Firestore sharing (private share worker)**
- **Share worker API:** integrate with `window.goToolkitShareWorker` if present. Use these helpers: `shareWorker.fetchSharePayload(collection, token)` and `shareWorker.saveSharePayload(collection, token, payload)`.
- **Share UI elements:** include `shareBtn`, `shareMenu`, `shareLinkField`, `shareCreateBtn`, `shareUpdateBtn`, and a status element `p.share-menu-status#shareMenuStatus` to show `formatRelativeTime`.
- **Collection name:** declare `const FIRESTORE_COLLECTION = "yourCollection"` and provide `buildSharePayload()` / `buildSharePreview()` functions.

**IndexedDB / Local saves (Capsules)**
- **Capsule API:** use `window.goToolkitCapsuleDrafts` where available. Common methods: `generateId()`, `upsertRecord(record)`, `getRecord(id)`, and `STORAGE_KEY` constant on the object.
- **Draft flow:** implement `saveDraft()` that calls `capsuleDrafts.upsertRecord({ id, app: 'yourApp', payload, title, description, updatedAt })`.

**Context sidebar: scenario & prompt**
- **Sidebar structure:** include a left-side context panel (same classes used in other modules). Provide a prompt input, `promptTemplateMeta`, and controls to open the IA modal.
- **State persistence:** store scenario/prompt in the module `STORAGE_KEY` JSON saved to `localStorage` (use `persistState()` / `loadState()` patterns).

**IA client integration**
- **Config & client:** use `public/js/ia-config.js` for storing user/back-end settings and `public/js/ia-client.js` (exposes `GoToolkitIAClient` or `window.GoToolkitIAClient`) to call `chatCompletion()`.
- **Usage:** construct request payloads with a system + user prompt and use `GoToolkitIAClient.chatCompletion({ model, messages, stream: true/false })` for streaming or non-streaming responses.

**Prompt templates (`public/js/prompt.js`)**
- **Templates:** reuse `prompt.js` templates to provide prefilled prompts. Provide UI to select or edit templates and to persist overrides into the module state.

**Template criteria (`public/js/template-criteria.js`)**
- **Purpose:** provide a modal to choose which fields/columns/criteria should be included when applying templates. Copy the modal markup and `template-criteria.js` usage from `grid.html`.

**OpenAI proxy & other workers**
- **OpenAI proxy:** the worker in `workers/openai-proxy` is used by IA backends. Modules should rely on `ia-config` to route requests through this proxy when configured.
- **Feedback proxy:** `workers/feedback-proxy` exposes a feedback API used by the UI (`/v1/feedback`). If your module needs feedback UI, follow the same markup and call paths as `public/index.html`'s feedback modal.

**CORS & Authorization**
- **Preflight:** ensure any client requests sending `Authorization` or custom headers are allowed by the worker preflight (OPTIONS) response. The worker must return `Access-Control-Allow-Headers: Content-Type, Authorization`.

**Common helper functions to include**
- `formatRelativeTime(isoString)` — human-friendly updated time used in share menus.
- `buildShareUrl(token)` — returns canonical share URL including `?share=` param.
- `persistState()` / `loadState()` — read/write `localStorage` under the module `STORAGE_KEY`.

**Files to inspect / copy-from**
- Example modules: [public/grid.html](public/grid.html), [public/canvas.html](public/canvas.html), [public/draw.html](public/draw.html), [public/timeline.html](public/timeline.html), [public/voice.html](public/voice.html).
- Share helper code and examples: see `share` related portions in the files above to replicate UI + wiring.

**Build, run, test**
- Local serve: `npm install` then `npm start` (or use the provided task `npx serve public -l 5000`).
- Lint / format: keep style consistent with `app-shell.css` and existing markup.

**Deployment notes**
- When updating public assets, bump the cache-buster query string (example: `?v=2025.12.25`) in links from `index.html` and other launcher pages.
- Worker deployment: use `npx wrangler publish` from the worker folder and ensure secrets are set (`OPENAI_API_KEY`, `FIREBASE_SERVICE_ACCOUNT`, `FIREBASE_PROJECT_ID`, `ADMIN_TOKEN`, etc.).

**Checklist for a new module**
- [ ] Copy an existing module as base and rename HTML/title.
- [ ] Define `STORAGE_KEY` and implement `loadState()` + `persistState()`.
- [ ] Implement share payload builders: `buildSharePayload()` and `buildSharePreview()`.
- [ ] Wire `shareBtn`, `shareCreateBtn`, `shareUpdateBtn`, and `shareMenuStatus` with `window.goToolkitShareWorker`.
- [ ] Add local draft save via `window.goToolkitCapsuleDrafts` if persistence required.
- [ ] Hook up IA controls to `GoToolkitIAClient` and `ia-config` UI patterns.
- [ ] Add prompt templates and optional `template-criteria` modal.
- [ ] Verify worker CORS + secrets and run `npx wrangler publish` for workers used.

If you want, I can generate a module skeleton `public/newmodule.html` that includes all the above wiring (header, share UI, persistence, IA hooks). Tell me the module name and whether it needs share/capsule/IA features, and I'll scaffold it.

***
Short reference: see [AGENTS.md](AGENTS.md) and [README.md](README.md) for repo-level notes about modules and workers.
