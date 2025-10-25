# Ops Cloud

This repository contains the WordPress operations monorepo for Tech Websites Ops Cloud. It focuses on WordPress themes/content, local development, CI/CD, and infra. SaaS services live in a separate repo.

## Scope
- WordPress dev via Docker Compose
- Themes in infra/wordpress/themes
- CI: formatting check and compose validation
- No SaaS code in this repo

## Quickstart
1. Install pnpm: corepack enable && corepack prepare pnpm@9.11.0 --activate
2. Install deps: pnpm install
3. Start WordPress: docker compose up -d
4. Visit: http://localhost:8081

## Structure
- pps/ â€“ placeholders for site-level tasks
- infra/wordpress/ â€“ mapped to wp-content (themes, mu-plugins)
- .github/workflows/ â€“ CI
- docs/ â€“ roadmap and docs

## Future
- GitHub Actions deploys to staging/prod
- repository_dispatch from external SaaS to trigger rebuilds
