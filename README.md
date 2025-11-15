# Ops Cloud

**WordPress operations monorepo for multi-brand site deployment.**

## Quickstart
1. Install pnpm: `corepack enable && corepack prepare pnpm@9.11.0 --activate`
2. Install deps: `pnpm install`
3. Set env vars: Copy `.env.sample` → `.env.local` for each service
4. Start WordPress: `docker compose up -d` → http://localhost:8081
5. Start services: Orchestrator (port 3000), Dashboard (port 5120)
6. Health check: `node ops/ai/test-health.mjs`

## Docs
- [Overview](docs/01_OVERVIEW.md) - Project architecture
- [Daily Workflow](docs/02_DEV_CYCLE.md) - Development routine
- [Orchestrator API](docs/03_ORCHESTRATOR.md) - API reference
- [Deployment](docs/04_DEPLOYMENT.md) - Deploy guide & secrets
- [Roadmaps](docs/ROADMAP.md) - Master roadmap
- [Current Tasks](docs/CURRENT_TASKS.md) - Active work

## What's Live
- Astra child theme deployed to Cloudways via GitHub Actions
- Matrix deploys for `sparky` and `hezlepinc`
- Design pipeline: tokens → theme.json, cursor.css, pages

## Structure
- `infra/wordpress/brands/` - Brand tokens, patterns, pages
- `infra/wordpress/themes/astra-child/` - Shared Astra child theme
- `.github/workflows/` - CI/CD automation
- `scripts/design/` - Design generation scripts
