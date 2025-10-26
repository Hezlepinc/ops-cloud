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
- Manually promote to production using GitHub Actions → Promote Staging to Production (merges
  `staging` → `main`).
- Production deploy runs automatically from `main` push.

## Cursor Design System: Build + Deploy

This repo enforces the design system (Cursor tokens) across brands with a Hello Elementor child
theme and brand kits.

### Repo layout for brand kits

- `infra/brands/<brand>/elementor/cursor-sitekit.json`
- `infra/brands/<brand>/assets/css/cursor.css`

Examples:

- `infra/brands/sparkyhq/elementor/cursor-sitekit.json`
- `infra/brands/hezlepinc/elementor/cursor-sitekit.json`

### Theme expectations

- Child theme: `infra/wordpress/themes/marketing/` (Hello Elementor child)
- Tokens CSS expected at: `infra/wordpress/themes/marketing/assets/css/cursor.css`
- The child theme enqueues:
  - Parent CSS: Hello Elementor
  - Tokens CSS: `assets/css/cursor.css`

### Build the brand kit artifacts

- Script: `pnpm run build-cursor`
  - Generates brand assets into `infra/brands/<brand>/assets/css/cursor.css` and/or site kit JSON as
    needed.

### Deploy workflow (GitHub Actions)

- On push to `staging` or `main`, `.github/workflows/deploy-cloudways.yml`:
  - Determines env from branch
  - Calls `scripts/deploy.sh` with `DEPLOY_SITE` and env
  - Rsyncs theme and uploads `wp-bootstrap.sh`
  - Bootstrap script activates theme, creates pages/menu, sets permalinks
  - Plugins list is passed via `PLUGINS` env (free repo slugs only)

### Bootstrap script brand integration (summary)

`infra/wordpress/wp-bootstrap.sh`:

- Installs Hello Elementor if needed (for the child theme)
- Activates the correct theme (`THEME_SLUG` passed by deploy script)
- Creates pages (Home, About, Resources, Tools, Contact) and sets Home as front page
- Assigns primary menu and sets permalinks to `/%postname%/`
- Installs/activates plugins listed in `PLUGINS` (free repo)
- Optional (if present): copies brand tokens CSS and imports Elementor Kit

## Manual steps required (one-time per environment)

- Cloudways
  - Create two apps per site (production + staging); note each App ID.
  - Set primary domains and enable SSL (Let’s Encrypt) for both domains.
  - Verify SSH access for the GitHub Action user/key.

- DNS
  - Point A records for root and `staging.` to the Cloudways IP.

- GitHub (secrets)
  - `CLOUDWAYS_HOST`, `CLOUDWAYS_USER`, `CLOUDWAYS_SSH_KEY`
  - `ADMIN_EMAIL` (optional; default WP email used by bootstrap)
  - `DEPLOY_SITE` (e.g., `hezlepinc` or `sparky`)

- Repo config
  - Fill `config/projects.json` with correct `app_id` and `domain` for both `production` and
    `staging`.

- Elementor Pro (if used)
  - Upload and activate the Elementor Pro plugin once per environment via WP Admin (license
    required). The bootstrap can then activate it on subsequent runs.

## Local testing (recommended before staging)

- Start WP locally:
  - `docker compose -f docs/docker-compose.yml up -d`
  - Visit `http://localhost:8081`
- Activate the child theme (`marketing`) and sanity-check pages render.

## Troubleshooting checklist

- Tokens not applied on front-end:
  - Confirm `infra/wordpress/themes/marketing/assets/css/cursor.css` exists on the server.
  - Clear caches (Breeze/Varnish).
- Elementor defaults override kit:
  - Ensure Elementor defaults are disabled in Site Settings or via WP-CLI.
- Deploy didn’t run:
  - Verify branch and `paths` filters in the workflow and that `DEPLOY_SITE` is set.

## Brand kit update process

1. In WP Admin (staging), adjust Elementor → Site Settings (colors, fonts, etc.).
2. Export the kit: Elementor → Tools → Import/Export Kit → Export. Download `cursor-sitekit.json`.
3. Replace the repo file for the brand:

   - `infra/brands/<brand>/elementor/cursor-sitekit.json`

4. If your process generates brand CSS, run locally:

   - `pnpm run build-cursor`

   This should update:

   - `infra/brands/<brand>/assets/css/cursor.css`

5. Commit and push to `staging` to deploy and re-import the kit on staging automatically.
6. Verify on staging (Site Settings reflect changes; front-end tokens present), then promote `staging → main` using the Promote workflow to deploy to production.

## Structure

- pps/ â€“ placeholders for site-level tasks
- infra/wordpress/ â€“ mapped to wp-content (themes, mu-plugins)
- .github/workflows/ â€“ CI
- docs/ â€“ roadmap and docs

## Future

- GitHub Actions deploys to staging/prod
- repository_dispatch from external SaaS to trigger rebuilds
