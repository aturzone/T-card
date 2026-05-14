# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repo layout

This is a small monorepo with two top-level directories:

- [frontend/](frontend/) — **the production app.** All real work happens here.
- [design/](design/) — original single-file React-via-Babel-standalone design spike plus a zipped snapshot (`frontend.zip`, `T-card.zip`). Reference only; do not edit.

There is no backend — the app is pure client-side with `localStorage` persistence.

## Commands

All commands run from [frontend/](frontend/).

```bash
npm run dev          # vite dev server → http://localhost:5173
npm run build        # tsc -b + vite build → dist/
npm run preview      # serve dist/ on :4173
npm run typecheck    # tsc --noEmit only

npm test             # vitest run — fast happy-dom integration suite
npm run test:watch   # vitest in watch mode
npm run test:e2e     # playwright — real browser e2e
```

Single vitest test: `npx vitest run tests/routes.test.tsx` (or pattern: `npx vitest run -t "shop filters"`).
Single playwright spec: `npx playwright test tests/e2e/<name>.spec.ts`.

Docker (multi-stage Node → nginx, SPA fallback): `docker compose up --build` from [frontend/](frontend/) → http://localhost:8080.

### Playwright on unsupported distros

The bundled Chromium build doesn't ship for every distro (Ubuntu 26.04 was unsupported at time of writing). If `npx playwright install chromium` fails, point at a local Chromium-family binary:

```bash
export PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/snap/brave/current/opt/brave.com/brave/brave
npm run test:e2e
```

See [frontend/playwright.config.ts](frontend/playwright.config.ts) — it auto-warns if neither path resolves.

## Architecture — the load-bearing bits

### Single global context, all state in `AppProvider`

Every piece of cross-cutting state lives in [src/context/AppContext.tsx](frontend/src/context/AppContext.tsx) and is consumed via `useApp()`: `theme`, `lang`, `cart`, `cartOpen`, `toast{Msg,Show}`, plus `t/fmtPrice/fmtNumber` formatters. There is no Redux/Zustand/Jotai — adding one would be net-negative.

Persistence is wired through [`useLocalStorage`](frontend/src/hooks/useLocalStorage.ts) using these exact keys (don't rename without a migration):

- `tcard.theme` — `light | dark`
- `tcard.lang` — `en | fa`
- `tcard.cart` — `CartItem[]`
- `tcard.orders` — order history

Theme + language are applied to `<html>` via effects that set `data-theme`, `data-lang`, `dir`, and `lang` attributes. CSS reads from there — don't toggle classes on `<body>` instead.

### Routing — HashRouter, on purpose

[main.tsx](frontend/src/main.tsx) wraps the app in `HashRouter` so deep links (`#/product/steam`, `#/shop?cat=gaming`) survive *any* host without server rewrites. Tests use `MemoryRouter`. Do not switch to `BrowserRouter` — the nginx + Docker deployment, GitHub Pages-style hosts, and direct-file usage all rely on the hash.

[App.tsx](frontend/src/App.tsx) has two non-obvious patterns worth preserving:

- `<div key={location.pathname}>` wraps `<Routes>` — forces page re-mount on navigation (cleaner state, simpler page components). Removing it will surface latent state-leak bugs across pages.
- `/cart` is a route stub (`CartRoute`) that calls `openCart()` and `navigate('/', { replace: true })` — it's the deep-link entry to the drawer, not a real page.

### Styling — Tailwind v3, **preflight disabled**

[tailwind.config.js](frontend/tailwind.config.js) sets `corePlugins: { preflight: false }`. The reset is intentionally off; baseline styles live in [src/styles/index.css](frontend/src/styles/index.css) (`@layer base` + `@layer components`). If you turn preflight back on, expect global regressions across legal pages, forms, and brand cards.

Every Tailwind token (`bg-bg`, `text-ink`, `font-display`, `rounded-lg`, `shadow`, `text-hero`, …) resolves to a CSS variable defined in `index.css` under `html[data-theme="light"]` / `html[data-theme="dark"]`. To add a color or size: add the CSS var first, then expose it in `tailwind.config.js`. Don't hardcode hex values in components.

`darkMode` is `['class', '[data-theme="dark"]']` — `dark:` variants gate on the `data-theme` attribute, not a `.dark` class.

[tailwindcss-rtl](https://www.npmjs.com/package/tailwindcss-rtl) is loaded. Persian/RTL is gated entirely on `[dir="rtl"]` (set by `AppProvider`), so prefer logical utilities (`ms-*`, `me-*`) over `ml-*`/`mr-*` in new code.

### i18n

Strings live in [src/data/i18n.ts](frontend/src/data/i18n.ts) as a flat `I18N` object keyed by string ID, each value `{ en, fa }`. Components call `const { t } = useT()` and render `t('nav_shop')`. The key type `I18NKey` is inferred from the object, so missing keys are compile errors — add the key to `I18N` before referencing it.

Numbers and prices go through `fmtPrice` / `fmtNumber` from `useT()` (Persian digits + Tomans for `fa`, USD for `en`). Don't `String(n)` directly.

### Brand icons

[src/data/brand-icons.ts](frontend/src/data/brand-icons.ts) imports individual glyphs from `simple-icons` (named imports so the bundler tree-shakes the rest). A few brands aren't in `simple-icons` for trademark reasons (Amazon, Xbox, Nintendo, Disney+) and intentionally fall back to the typographic monogram defined by `brand.initial` in [brands.ts](frontend/src/data/brands.ts). When adding a brand, follow this same fork: either wire a `simple-icons` glyph, or set `initial` and accept the fallback.

### Path alias

`@/*` → `frontend/src/*`, wired in both [vite.config.ts](frontend/vite.config.ts) and [vitest.config.ts](frontend/vitest.config.ts). Use it; `../../..` chains are not idiomatic in this codebase.

## Tests

[frontend/tests/](frontend/tests/) has two layers:

- **Vitest integration** (`tests/*.test.tsx`) — boots the full app in happy-dom + `MemoryRouter`, walks every route, exercises theme toggle, EN ↔ FA + RTL flip, `localStorage` persistence, cart add/remove, shop filters, FAQ accordion, checkout empty state. Sub-2s. The default smoke net — keep it green.
- **Playwright e2e** (`tests/e2e/*.spec.ts`) — real browser, hits every hash route + cart→checkout flow. Two projects: `chromium` desktop + `chromium-mobile` (Pixel 7).

`tests/setup.ts` is the vitest setup file; both Testing Library and `@testing-library/jest-dom` matchers are registered there.

## Docker / deploy notes

[frontend/Dockerfile](frontend/Dockerfile) is multi-stage (Node build → nginx serve). [frontend/nginx.conf](frontend/nginx.conf) provides:

- SPA fallback (`try_files $uri $uri/ /index.html`)
- 1y immutable cache on hashed assets
- `no-cache` on `index.html`

Because routing is hash-based, the SPA fallback is technically redundant but kept for safety. The deployment surface is the `dist/` output — no env vars, no runtime config.
