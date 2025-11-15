# Project Overview

**Ops Cloud** - WordPress operations monorepo for multi-brand site deployment.

## Scope
- WordPress dev via Docker Compose
- Themes in `infra/wordpress/themes`
- CI: formatting check and compose validation
- No SaaS code in this repo

## Architecture
- **Orchestrator:** Central coordination API (Render)
- **Dashboard:** Frontend monitoring (Next.js)
- **WordPress:** Multi-brand Astra + Gutenberg sites (Cloudways)
- **CI/CD:** GitHub Actions → Cloudways deployment

## Key Components
- `infra/wordpress/brands/` - Brand-specific tokens, patterns, pages
- `infra/wordpress/themes/astra-child/` - Shared Astra child theme
- `.github/workflows/` - Deployment automation
- `scripts/design/` - Token → theme.json, cursor.css, page assembly

**See:** [02_DEV_CYCLE.md](02_DEV_CYCLE.md) for daily workflow.
