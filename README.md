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

## What's live now (staging CI/CD)

- Hello Child theme (`infra/wordpress/themes/hello-child`) deployed to Cloudways via GitHub Actions
  - Workflow: `.github/workflows/deploy-staging.yml`
  - Matrix deploys for `sparky` and `hezlepinc`
  - Post-deploy script activates the theme and clears cache gracefully: `deploy/post-deploy.sh`
- SSH connectivity validated in `.github/workflows/test-cloudways.yml`
- Secrets use per-site app roots instead of IDs

Required repo secrets (staging):
- `CLOUDWAYS_HOST`, `CLOUDWAYS_USER`, `CLOUDWAYS_SSH_KEY`
- `APP_ROOT_SPARKY_STAGING` → e.g., `/home/1540390.cloudwaysapps.com/xpzgjptrwn/public_html`
- `APP_ROOT_HEZLEP_STAGING` → e.g., `/home/1540390.cloudwaysapps.com/<hezlepinc_app_dir>/public_html`

Optional repo secrets (production, when enabling prod workflow):
- `APP_ROOT_SPARKY_PROD`, `APP_ROOT_HEZLEP_PROD`

Triggering a deploy:
- Push to `staging` → runs “Deploy to Staging (Hello Child)” for both sites

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

- Push to `staging` → deploys Hello Child to staging apps for configured sites
- Push to `main` → deploys to production (when production workflow/secrets are configured)

### Duplicate this setup for a new brand/site

1) Cloudways: create staging (and later prod) apps; get each app's full app root path: `/home/<cw_account>.cloudwaysapps.com/<app_dir>/public_html`.

2) GitHub Secrets: add `APP_ROOT_<BRAND>_STAGING` (and `APP_ROOT_<BRAND>_PROD` when ready) with the full app root.

3) Workflow Matrix: in `.github/workflows/deploy-staging.yml`, add the brand key to `matrix.site: [sparky, hezlepinc, <brand>]` and map its secret name if it differs from the convention.

4) Push to `staging` and watch Actions. The job rsyncs `infra/wordpress/themes/hello-child/` and runs `deploy/post-deploy.sh` to activate the theme.

5) Verify in WP Admin → Appearance → Themes, or via CLI (`wp theme list --status=active --allow-root`).

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

- Child theme path: `infra/wordpress/themes/hello-child/` (Hello Elementor child)
- The child theme enqueues parent Hello Elementor CSS and its own stylesheet.

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
6. Verify on staging (Site Settings reflect changes; front-end tokens present), then promote
   `staging → main` using the Promote workflow to deploy to production.

## Structure

- pps/ â€“ placeholders for site-level tasks
- infra/wordpress/ â€“ mapped to wp-content (themes, mu-plugins)
- .github/workflows/ â€“ CI
- docs/ â€“ roadmap and docs

## Future

- GitHub Actions deploys to staging/prod
- repository_dispatch from external SaaS to trigger rebuilds
