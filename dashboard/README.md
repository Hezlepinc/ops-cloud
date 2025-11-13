# Ops-Cloud Dashboard

Canonical UI for OpsCloud: architecture maps, environments, pages, and future SEO/Settings.

## Dev

```bash
npm run dev        # from repo root: npm run dashboard:dev
```

Local URLs:
- Home: http://localhost:5120/
- Maps: http://localhost:5120/maps
- Health Check: http://localhost:5120/api/ai/status

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
- Sentry for error monitoring

## Environment Setup

1. Copy `.env.sample` to `.env.local`:
   ```bash
   cp .env.sample .env.local
   ```

2. Fill in required variables (see `.env.sample` for list)

3. Required variables:
   - `ORCHESTRATOR_URL` - Orchestrator API URL (default: http://localhost:3000)
   - `ORCHESTRATOR_API_KEY` - API key for orchestrator
   - `OPENAI_API_KEY` - OpenAI API key (for AI features)
   - `GITHUB_TOKEN` - GitHub token (optional, for GitHub status)
   - `GITHUB_REPO` - GitHub repo (format: owner/repo)
   - `SENTRY_DSN_FRONTEND` - Sentry DSN (optional, for error monitoring)

## Health Check

Run the project health check script from repo root:
```bash
node ops/ai/test-health.mjs
```

## Notes

- The map expands Cloudways → Server → Apps → Pages (double‑click app to toggle pages)
- Canvas is full-viewport with fit-to-view. Use mouse wheel to zoom; pan with mouse or space+drag.
- Health status endpoint: `/api/ai/status` (checks orchestrator, GitHub, OpenAI)


