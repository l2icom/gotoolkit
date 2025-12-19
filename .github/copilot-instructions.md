# Copilot / AI Agent Instructions — GoToolkit

Purpose: Concise, actionable guidance to help an AI coding agent be immediately productive in this repository.

- **Project shape:** Static frontend served from the `public/` folder. Small React bundle lives in `src/connect` and is compiled with `esbuild` into `public/js` via `npm run build`.

- **Key entry points:**
  - `public/index.html`, `public/draw.html`, `public/canvas.html`, `public/grid.html`, `public/timeline.html`, `public/tree.html` — vanilla HTML that loads scripts from `public/js/`.
  - `src/connect/index.tsx` — React/Excalidraw app entry. Build output becomes `public/js/connect.bundle*.js`.

- **How the app exposes services (important patterns):**
  - Globals are used as the cross-file integration surface. Look for `window.GoToolkit*` objects.
    - `GoToolkitExcalidraw` is defined in `src/connect/index.tsx` and exposes `initialize`, `convertMermaid`, `applyScene`, `getApi` for other pages to drive Excalidraw.
    - AI clients live in `public/js/ia-client.js` and expose `GoToolkitIAClient`, `GoToolkitOpenAI` (alias), and `GoToolkitIA` (auto backend). Use these globals when wiring AI features.
  - Configuration/provider globals: `GoToolkitIAConfig` (config values, proxy URLs), `GoToolkitAIBackend` (provider with `getBackend`) and `GoToolkitWebLLM` (local WebLLM engine).

- **AI/backends & proxying:**
  - The UI chooses a backend type: `webllm`, `ollama`, or `openai`. `public/js/ia-client.js` contains the routing logic and streaming handling (see `consumeStream` / `consumeNdjsonStream` / `normalizeChunk`).
  - Cloudflare worker proxies live under `workers/` — e.g. `workers/openai-proxy/index.js` implements CORS, rate-limits and forwards to OpenAI. When adding or modifying backends, inspect these workers and `wrangler.toml` files.

- **Streaming & normalization conventions:**
  - The client accepts both SSE (`text/event-stream`) and NDJSON. Code expects normalized text chunks via `normalizeChunk` before concatenation. Tests and UI rely on these normalized outputs, so preserve the normalization shape when changing streams.

- **Build / dev / test workflows:**
  - Build the connect bundle: `npm run build` (runs `esbuild src/connect/index.tsx ... --outdir=public/js`).
  - Serve the static site locally: `npm start` (runs `npx serve public -l 5000`).
  - Playwright tests are present (`@playwright/test` devDependency). Run them with `npx playwright test` (there is no npm test script).

- **Code organization conventions to follow:**
  - `public/js/*.js` are precompiled browser scripts that attach globals — treat them as the public API surface. Avoid breaking existing global names or call signatures.
  - `src/` contains code that is compiled into `public/js` (currently only `src/connect`). Keep ESBuild entry options (minify, iife, target) in mind when editing.
  - Worker code (under `workers/`) is intended for deployment on Cloudflare Workers; do not assume Node-only APIs unless the worker already uses them (check `wrangler.toml`).

- **Files to read first when changing behavior:**
  - [src/connect/index.tsx](src/connect/index.tsx) — Excalidraw bridge and global API.
  - [public/js/ia-client.js](public/js/ia-client.js) — AI routing, streaming, normalization, and backend fallbacks.
  - [workers/openai-proxy/index.js](workers/openai-proxy/index.js) — how upstream OpenAI calls are proxied, rate-limiting and CORS.
  - [package.json](package.json) — build and serve scripts.

- **Quick examples (use these exact globals):**
  - Initialize Excalidraw from another page: `await window.GoToolkitExcalidraw.initialize('my-container')` then `window.GoToolkitExcalidraw.applyScene(scene)`.
  - Ask the default AI stack for a response: `await window.GoToolkitIA.chatCompletion({ payload: { messages: [{ role: 'user', content: 'Explain X' }] } })`.

- **Testing & debugging tips:**
  - When testing AI streaming behavior, run `npx playwright test` locally; check `test-results/` for prior failure logs.
  - For debugging cross-file calls, inspect `window` for `GoToolkit*` objects in the browser console to confirm shape and methods.

If anything here is unclear or you want deeper examples (e.g. specific lines to change or suggested tests), tell me which area to expand. I can iterate on this guidance.
