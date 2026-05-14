# T-Card Frontend

Production-ready React + TypeScript + Tailwind frontend for T-Card — a digital gift-card storefront with bilingual EN/FA + RTL support, light/dark theme, persistent cart, and full checkout flow.

## Stack

- **React 18** + **TypeScript** (Vite 5)
- **Tailwind CSS v3** (Tailwind-first; tokens via CSS variables)
- **react-router-dom v6** with `HashRouter` (`#/shop`, `#/product/:id`, …)
- **localStorage** persistence for theme, language, cart, orders
- No backend required

## Develop

```bash
npm install
npm run dev
```

Opens at <http://localhost:5173>.

## Build

```bash
npm run build      # type-check + production bundle to dist/
npm run preview    # serve the production bundle locally
```

## Docker

```bash
docker compose up --build
```

Opens at <http://localhost:8080>. The image is multi-stage (Node build → nginx serve).

## Tests

Two layers:

```bash
npm test          # vitest — 25 integration tests, runs in ~1.5s (no browser)
npm run test:e2e  # playwright — real-browser e2e (requires a browser binary)
```

**Vitest** (`tests/*.test.tsx`) — boots the full app in happy-dom + MemoryRouter, walks every route, exercises theme toggle, language switch (EN ↔ FA + RTL flip), localStorage persistence, cart add/remove, shop filters, FAQ accordion, and checkout empty state. Fast smoke net for any React crash regression.

**Playwright** (`tests/e2e/*.spec.ts`) — real browser, hits every hash route + runs the cart→checkout flow. If `npx playwright install chromium` fails on your distro (Ubuntu 26.04 was unsupported at the time of writing), point Chromium at any Chromium-family browser:

```bash
export PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/snap/brave/current/opt/brave.com/brave/brave
npm run test:e2e
```

## Routes

| Path | Page |
|---|---|
| `/` | Home |
| `/shop` | Shop catalog (filters, sort, search) |
| `/shop?cat=gaming` | Pre-filtered shop |
| `/product/:id` | Product detail |
| `/cart` | Opens cart drawer over Home |
| `/checkout` | 3-step checkout wizard |
| `/confirmation/:id` | Order confirmation |
| `/about`, `/faq`, `/contact`, `/how`, `/account` | Misc pages |
| `/terms`, `/privacy`, `/cookies` | Legal pages |
| any other | 404 |

## Folder Layout

```
src/
├── main.tsx              # Bootstraps app + HashRouter + AppProvider
├── App.tsx               # Routes + layout
├── context/AppContext.tsx
├── data/                 # brands, categories, i18n, testimonials, faqs, format
├── components/
│   ├── layout/           # Header, Footer, CartDrawer
│   ├── ui/               # Icon, Logo, Reveal, Toast
│   └── product/          # GCard, CardPattern, ProductTile
├── hooks/                # useLocalStorage, useReveal, useT
├── pages/                # Home, Shop, Product, Checkout, …
└── styles/index.css      # tokens + Tailwind layers + component CSS
```

## Persistence Keys

- `tcard.theme` — `light | dark`
- `tcard.lang` — `en | fa`
- `tcard.cart` — JSON array of cart items
- `tcard.orders` — JSON array of placed orders
