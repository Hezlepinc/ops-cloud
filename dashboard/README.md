# Ops-Cloud Dashboard

Canonical UI for OpsCloud: architecture maps, environments, pages, and future SEO/Settings.

## Dev

```bash
npm run dev        # from repo root: npm run dashboard:dev
```

Local URLs:
- Home: http://localhost:5000/
- Maps: http://localhost:5000/maps

## Build/Start

```bash
npm run build
npm run start
```

## Logo & Theme

Place brand assets in `public/`:
- `logo.svg` (light)
- `logo-dark.svg` (dark)
- `favicon.svg`

Dark/light logo auto-swaps via the theme toggle.

## Stack

- Next.js 14, React 18
- TailwindCSS + PostCSS
- ReactFlow (dagre layout) for the system map

## Notes

- The map expands Cloudways → Server → Apps → Pages (double‑click app to toggle pages)
- Canvas is full-viewport with fit-to-view. Use mouse wheel to zoom; pan with mouse or space+drag.


