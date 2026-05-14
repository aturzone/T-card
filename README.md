# T-Card

Bilingual (EN / فا) digital gift-card storefront. Production-ready React + TypeScript + Tailwind, Dockerized.

This repository contains:

- **`frontend/`** — the production app (Vite + React 18 + TypeScript + Tailwind v3 + react-router-dom). Build with `npm run dev` / `npm run build`, or `docker compose up --build`. See [frontend/README.md](frontend/README.md).
- **`design/`** — the original design spike (single-file React + Babel-standalone prototype) plus the zipped production build (`design/frontend.zip`).

## Quick start

```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
```

## Docker

```bash
cd frontend
docker compose up --build   # http://localhost:8080
```

## Highlights

- React 18 + TypeScript + Vite 5
- Tailwind v3 — every design token routed through CSS variables (theme + language aware)
- `HashRouter` so deep links like `#/product/steam`, `#/shop?cat=gaming` survive any host
- Persistent state in `localStorage`: theme (light/dark), language (en/fa), cart, orders
- Persian via **Estedad** font + FA-specific type scale, RTL flip handled by `[dir="rtl"]` rules
- Brand icons from **Simple Icons** (tree-shaken) with blurred-glyph watermark on each gift-card art
- Multi-stage Docker (Node build → nginx serve, SPA fallback + immutable asset cache)

## Routes

`/`  ·  `/shop`  ·  `/product/:id`  ·  `/checkout`  ·  `/confirmation/:id`  ·  `/about`  ·  `/faq`  ·  `/contact`  ·  `/how`  ·  `/account`  ·  `/terms`  ·  `/privacy`  ·  `/cookies`
