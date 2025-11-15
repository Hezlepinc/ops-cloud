# Deployment & Secrets Reference

**WordPress theme deploys, GitHub Actions, secrets table.**

## WordPress Theme Deployment
- **Source:** `infra/wordpress/themes/astra-child/` (Astra) or `hello-child/` (legacy)
- **Deployed to:** `${APP_ROOT}/wp-content/themes/`
- **Workflow:** `.github/workflows/deploy-theme.yml` (matrix: sparky, hezlepinc)
- **Steps:** rsync theme → activate → apply pages → clear cache

## Design Pipeline
- `scripts/design/generate-theme-json.mjs` - Tokens → theme.json
- `scripts/design/generate-cursor-css.mjs` - Tokens → cursor.css
- `scripts/design/buildpages.mjs` - Patterns → pages (HTML/JSON)

## Secrets Reference
- `CLOUDWAYS_HOST`, `CLOUDWAYS_USER`, `CLOUDWAYS_SSH_KEY` - SSH access
- `APP_ROOT_SPARKY_STAGING`, `APP_ROOT_HEZLEP_STAGING` - App paths
- `OPENAI_API_KEY` - Orchestrator auth (also used by Cursor)
- `GITHUB_TOKEN`, `GITHUB_REPO` - GitHub API access

**See:** [ROADMAP.md](ROADMAP.md) for deployment roadmap.
