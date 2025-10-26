# Ops Cloud

This repository contains the WordPress operations monorepo for Tech Websites Ops Cloud. It focuses
on WordPress themes/content, local development, CI/CD, and infra. SaaS services live in a separate
repo.

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

## Setting Up a New WordPress Site (Staging + Production)

1. Create two Cloudways apps (production and staging). Note each app's App ID and public IP.
2. Set up DNS A records for `@` and `staging` pointing to the Cloudways IP.
3. Enable SSL for both domains in Cloudways (Let's Encrypt).
4. Update `config/projects.json`:

```
"clientname": {
  "production": { "domain": "clientname.com", "app_id": "YOUR_PROD_APP_ID" },
  "staging": { "domain": "staging.clientname.com", "app_id": "YOUR_STAGING_APP_ID" }
}
```

5. Add/Update GitHub Secrets:

- `CLOUDWAYS_HOST` – Cloudways server IP/hostname
- `CLOUDWAYS_USER` – SSH user
- `CLOUDWAYS_SSH_KEY` – Private key (PEM)
- `ADMIN_EMAIL` – Default admin email for WP
- `DEPLOY_SITE` – Site key from `config/projects.json` (e.g., `hezlepinc`, `sparky`)

6. Deploy:

- Push to `staging` → deploys to staging domain
- Push to `main` → deploys to production domain

## Promotion Flow (Git-driven)

- Develop on feature branches → merge into `staging`.
- Verify staging deployment (auto from `staging` pushes).
- Manually promote to production using GitHub Actions → Promote Staging to Production (merges `staging` → `main`).
- Production deploy runs automatically from `main` push.

## Structure

- pps/ â€“ placeholders for site-level tasks
- infra/wordpress/ â€“ mapped to wp-content (themes, mu-plugins)
- .github/workflows/ â€“ CI
- docs/ â€“ roadmap and docs

## Future

- GitHub Actions deploys to staging/prod
- repository_dispatch from external SaaS to trigger rebuilds
