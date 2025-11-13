# Deployment & Secrets Reference

This doc consolidates WordPress theme deploys, Elementor kit workflow, GitHub Actions, and the secrets table.

## 1) WordPress Theme Deployment (Hello Child)

- Source: `infra/wordpress/themes/hello-child/` (assembled from brand overlays)
- Deployed to: `${APP_ROOT}/wp-content/themes/hello-child/`
- Typical steps:
  1) Assemble brand overlays (if present) into `hello-child/`
  2) rsync to Cloudways via SSH
  3) Activate theme + purge cache

### 1.1 Quickstart (Hello‑Child)

Goal:
- Scaffold Hello‑Child theme
- Auto‑deploy to Cloudways on merge to `staging` branch
- Bootstrap WordPress on first activation
- Load brand CSS from `assets/css/cursor.css`

**Note:** Deployment triggers on merge to `staging` or `main` branches. Work on `dev` branch, then create PR `dev` → `staging` for testing.

Prereqs:
- Cloudways SSH wiring (host/user/key)
- Repo secrets: `CLOUDWAYS_HOST`, `CLOUDWAYS_USER`, `CLOUDWAYS_SSH_KEY`, `APP_ROOT_*`
- Hello Elementor parent theme available

Folder:
```
infra/wordpress/themes/hello-child/
  style.css
  functions.php
  assets/css/cursor.css
  readme.md
```

Deploy:
- Staging workflow: `.github/workflows/deploy-staging.yml`
- Matrix sites: `sparky`, `hezlepinc`
- Set secrets:
  - `APP_ROOT_SPARKY_STAGING`
  - `APP_ROOT_HEZLEP_STAGING`

## 2) Elementor Kit Workflow (Build → Import)

- Build kit from template JSON/manifest:
  - `scripts/wp/build-kit.js` and `scripts/wp/validate-manifest.js`
- Import kit into WP:
  - Via orchestrated WP-CLI on the server or using `infra/wordpress/bin/kit-import.php`

### 2.1 Extract/Pack Flow (per brand)

Layout:

```
infra/wordpress/brands/<brand>/elementor/
  <brand>_template.zip       # deploy artifact
  src/                       # editable JSON/templates (optional)
```

Extract a kit into `src/`:

```bash
bash infra/wordpress/bin/kit-extract.sh \
  infra/wordpress/brands/hezlep-inc/elementor/hezlep_template.zip \
  infra/wordpress/brands/hezlep-inc/elementor/src
```

Re-pack after edits:

```bash
bash infra/wordpress/bin/kit-pack.sh \
  infra/wordpress/brands/hezlep-inc/elementor/src \
  infra/wordpress/brands/hezlep-inc/elementor/hezlep_template.zip
```

Notes:
- Keep brand tokens in CSS: `infra/wordpress/brands/<brand>/assets/css/cursor.css`.
- Display conditions (Header/Footer) are applied in `import-kits.sh` during deploy.

## 3) GitHub Actions (Deploy)

- Matrix deploy for staging and production apps per brand
- Uses secrets for SSH and per-app paths (see below)

## 4) Secrets Reference (Examples)

| Secret | Purpose |
| --- | --- |
| CLOUDWAYS_HOST | Server IP |
| CLOUDWAYS_USER | SSH user |
| CLOUDWAYS_SSH_KEY | Private key (no passphrase) |
| APP_ROOT_SPARKY_STAGING | Full app root path for Sparky staging |
| APP_ROOT_HEZLEP_STAGING | Full app root path for Hezlep staging |
| APP_ROOT_SPARKY_PROD | Full app root path for Sparky prod |
| APP_ROOT_HEZLEP_PROD | Full app root path for Hezlep prod |
| OPENAI_API_KEY | Orchestrator x-api-key (also used by Cursor) |
| GITHUB_TOKEN | GitHub API access for repo status, if used |
| GITHUB_REPO | Owner/repo for status calls |
| RENDER_API_KEY | Render API (used by updater) |
| CW_EMAIL / CW_API_KEY | Cloudways API |

## 5) Orchestrator & Dashboard (Render)

- Orchestrator: Node.js web service; protect `/ai/*` with `x-api-key`
- Dashboard: Next.js static export; served via Render
- Set `NPM_CONFIG_PRODUCTION=false` for dashboard build to install TS devDeps

## 6) Troubleshooting

- “You have reached Cloudways API” → use cached `/ai/status` or wait/retry
- 401 on `/ai/*` → ensure `OPENAI_API_KEY` matches header
- Dashboard build: ensure TS devDeps and `output: 'export'` in Next config


