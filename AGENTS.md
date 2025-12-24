# GoToolkit Agent Instructions

Brief, repo-root reference for any AI/copilot contributor who wants to tinker with GoToolkit.

- **Project shape.** GoToolkit is a collection of static HTML modules under `public/` plus one React/Excalidraw bridge under `src/connect`. The public folder is the deployable artifact; `npm run build` only produces `public/js/connect.bundle*.js` (plus the loaders for fonts/images) while everything else is handwritten HTML+JS/CSS. Keep in mind that each module is independent but shares globals for IA and Excalidraw wiring.

- **Key entry points.** The launcher at `public/index.html` links to the four feature modules (`canvas.html`, `grid.html`, `draw.html`, `timeline.html`). All of them load `public/js/prompt.js` plus the appropriate module scripts and expect the `?v=2025.12.25` query string on module links to bust caches when static assets change.

- **React / Excalidraw bridge (`src/connect/index.tsx`).** This file renders Excalidraw inside a host container and exposes the imperative bridge via `window.GoToolkitExcalidraw`. External callers can `initialize(container)`, `applyScene(scene)`, `convertMermaid(code)` and pull the raw Excalidraw API. Scene application reuses the current app state, enforces a light palette, and ensures exported files are re-attached when provided. Mermaid conversion feeds through `@excalidraw/mermaid-to-excalidraw`, normalizes the elements, and applies stroke/roundness defaults before returning the payload.

- **Globals & cross-module contracts.** Only the `public/js/*.js` scripts attach globals on `window`. Key ones to keep stable:
  - `GoToolkitExcalidraw` (see above).
  - `GoToolkitIAClient`, `GoToolkitOpenAI` (alias), and `GoToolkitIA` defined in `public/js/ia-client.js`. They are the entry points for launching chats/outputs, building request headers, and streaming responses.
  - Supporting globals `GoToolkitIAConfig` (proxy URLs + other config bits), `GoToolkitAIBackend` (with `getBackend`), and `GoToolkitWebLLM` (local WebLLM helper). Other pages expect these objects to exist when wiring prompts or backend switches.

- **AI/backends & streaming conventions.** `public/js/ia-client.js` handles every backend (`webllm`, `ollama`, `openai`, plus the auto-routing helpers). It uses `consumeStream`/`consumeNdjsonStream` to read `text/event-stream` or NDJSON payloads, normalizes each chunk with `normalizeChunk`, and concatenates the final string. Normalization also translates `choices`, `delta`, `content`, `output_text`, etc. `GoToolkitIA.chatCompletion` and related helpers rely on this normalized stream, so if you change the shape of chunks, keep `normalizeChunk` in sync with the consumer behavior.

- **Template metadata.** `public/js/prompt.js` defines every built-in template for the canvas/grid modules (roadmaps, comparisons, data grids, etc.). When you add or change a template, edit this script so the launcher, template modals and the hero/title metadata continue to load the same IDs and descriptions. The script is always loaded with `?v=2025.12.25` to force clients to fetch a fresh copy.

- **Workers & proxies.** Any backend or share features that need a server live under `workers/`:
  - `workers/openai-proxy` handles CORS, rate limits, and forwards OpenAI requests after quotas/IP filtering.
  - `workers/share-proxy` signs Firebase requests, enforces write quotas, and exposes `/v1/shares/<collection>/<id>`.
  - `workers/feedback-proxy` (and the others) each have `wrangler.toml`: examine those when you modify environment bindings, KV namespaces, or the Cloudflare deployment settings. Worker code must stay compatible with the Cloudflare runtime (no Node-specific APIs unless already in use).

- **Build / dev / test workflow.**
  1. `npm run build` (runs `esbuild` on `src/connect/index.tsx` with iife/browser target, minification, loaders for fonts/images, and outputs to `public/js`).
  2. `npm start` serves `public/` on port 5000 via `npx serve public -l 5000`.
  3. Playwright tests live in `tests/*.spec.ts` (`@playwright/test` dependency) and run with `npx playwright test` or `npm run test:playwright`.
  4. No other build steps exist; the HTML is edited by hand, so any JS/CSS changes in `public/` are considered the source-of-truth when reviewing behavior.

- **Testing & debugging tips.** The existing Playwright spec (`tests/grid-mock.spec.ts`) drives the Grid module through real DOM interactions and expects template scripts to populate data tables. If you touch the templates or grid UI, rerun `npx playwright test` and inspect `test-results/` when a test fails. For runtime debugging, open the browser console on any module page and inspect `window.GoToolkit*` objects to check available methods/state.

- **Cache/version reminders.** All launcher links and in-page navigation append `?v=2025.12.25` to their module URLs and `js/prompt.js`, so updating static assets means bumping that query string across templates, navigation, and the hero/version badge if you display it. Keep the `2025.12.25` value consistent until you change the static bundle.

Let me know which part you want to expand (IA, workers, templates, tests) and I can drill into concrete files or suggested commands.
