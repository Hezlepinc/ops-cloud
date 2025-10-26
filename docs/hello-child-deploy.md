# Cursor Instructional: Automated Hello-Child Theme Deployment

## Goal

- Scaffold Hello-Child theme
- Auto-deploy to Cloudways on push to `staging`
- Bootstrap WordPress on first activation
- Load brand CSS from `assets/css/cursor.css`

## Prerequisites

- Repo connected to Cloudways app via SSH
- Repo secrets: `CLOUDWAYS_HOST`, `CLOUDWAYS_USER`, `CLOUDWAYS_SSH_KEY`, `APP_ROOT_*`
- Hello Elementor parent theme available

## Folder Structure

```
infra/wordpress/themes/hello-child/
  ├─ style.css
  ├─ functions.php
  ├─ assets/css/cursor.css
  └─ readme.md
```

## Deploy Workflow

- Staging workflow: `.github/workflows/deploy-staging.yml`
- Matrix sites: `sparky`, `hezlepinc`
- Set secrets:
  - `APP_ROOT_SPARKY_STAGING`
  - `APP_ROOT_HEZLEP_STAGING`

Push to `staging` to trigger deploy, then activate Hello Child in WP Admin (first run bootstraps content).
