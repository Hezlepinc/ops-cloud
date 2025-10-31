# Ops-Cloud Project Map

## Repository Structure (high-level)

```
apps/
  marketing-site/
  sparky-hq/

infra/
  wordpress/
    brands/
      sparky-hq/
        theme/                 # optional brand-specific child theme files
        elementor/
          cursor-sitekit.zip   # Elementor SiteKit archive
      hezlep-inc/
        theme/
        elementor/
          cursor-sitekit.zip
    themes/
      hello-child/             # assembled at deploy time
    mu-plugins/
    wp-bootstrap.sh            # bootstraps a WP site via WP-CLI

config/
  projects.json                # site keys → domains/app ids (for scripts)

scripts/
  deploy.sh                    # deploy helper (legacy/utility)
  build-cursor-theme.js        # optional brand assets builder

.github/
  workflows/
    deploy-theme.yml           # single consolidated workflow (staging + prod)

docs/
  template-instructions/       # brand design/process docs
    sparky-hq.template.md
    hezlep-inc.template.md
  docker-compose.yml           # local WP
  playbook.md
  roadmap.md
  turbo.json

tools/
  cloudflare-dns.sh

package.json
pnpm-lock.yaml
pnpm-workspace.yaml
README.md
```

## Brands and Content

- Brand roots live under `infra/wordpress/brands/<brand>/`:
  - `theme/` (optional): brand-specific child theme files that are copied into `hello-child/` at deploy
  - `elementor/cursor-sitekit.zip`: the SiteKit zip to import via WP-CLI
- Current brands:
  - `sparky-hq`
  - `hezlep-inc`

## Deployment (single workflow)

- Workflow: `.github/workflows/deploy-theme.yml`
- Triggers:
  - `push` to `staging` → deploys to staging apps
  - `push` to `main` → deploys to production apps
  - `workflow_dispatch` (manual)
- Matrix:
  - Staging: `sparky-hq`, `hezlep-inc`
  - Production: `sparky-hq`, `hezlep-inc`
- Steps (per brand/env):
  1) Assemble `infra/wordpress/themes/hello-child/` from `infra/wordpress/brands/<brand>/theme/` (fallback to brand root if `theme/` missing)
  2) rsync `hello-child/` to `${APP_ROOT}/wp-content/themes/hello-child/`
  3) Upload `cursor-sitekit.zip` to `${APP_ROOT}/cursor-sitekit.zip`
  4) Activate `hello-child`, import the kit, flush/purge cache
  5) Verify remote theme directory

## Cloudways Secrets (GitHub → Settings → Secrets and variables → Actions)

- Common (both envs):
  - `CLOUDWAYS_HOST`           (server IP)
  - `CLOUDWAYS_USER`           (SSH username, e.g., `johnhezlep`)
  - `CLOUDWAYS_SSH_KEY`        (private key PEM; no passphrase)
- App roots (copy from Cloudways → Application → Access Details → Application Path):
  - Staging
    - `APP_ROOT_SPARKY_STAGING` = `/home/<account>.cloudwaysapps.com/xpzgjptrwn/public_html`
    - `APP_ROOT_HEZLEP_STAGING` = `/home/<account>.cloudwaysapps.com/dmzbmaweun/public_html`
  - Production
    - `APP_ROOT_SPARKY_PROD`   = `/home/<account>.cloudwaysapps.com/tgmbbcupen/public_html`
    - `APP_ROOT_HEZLEP_PROD`   = `/home/<account>.cloudwaysapps.com/umnwppxmaj/public_html`

Notes:
- `<account>` is your Cloudways account prefix (e.g., `1540390`).
- Ensure the public key that pairs with `CLOUDWAYS_SSH_KEY` is installed for `CLOUDWAYS_USER` on the server.
- If SSH/IP is restricted, whitelist the GitHub runner IP (printed at run start).

## Site Keys → Brands

- `sparky` → brand `sparky-hq`
- `hezlep` → brand `hezlep-inc`

## Manual Checks (useful for troubleshooting)

- Quick SSH test (local):
  - `ssh -i key.pem -o IdentitiesOnly=yes -o StrictHostKeyChecking=no <user>@<host> true`
- Validate app path and writability:
  - `ssh -i key.pem <user>@<host> "ls -ld '<APP_ROOT>' '<APP_ROOT>/wp-content' && touch '<APP_ROOT>/.preflight' && rm -f '<APP_ROOT>/.preflight' && echo write OK"`

## Typical Update Flow

1) Commit brand theme changes into `infra/wordpress/brands/<brand>/theme/` or update `cursor-sitekit.zip`.
2) Push to `staging`.
3) GitHub Actions runs `deploy-theme.yml` for both staging apps.
4) Verify:
   - Theme present/active at `${APP_ROOT}/wp-content/themes/hello-child/`
   - Kit imported; site shows design tokens and layout.

## Conventions

- Keep `hello-child/` brand-agnostic; brand layout and tokens come from brand folders and the Elementor kit.
- Use hyphenated brand slugs in the repo (`sparky-hq`, `hezlep-inc`).
- Use site keys in matrix (`sparky`, `hezlep`).
