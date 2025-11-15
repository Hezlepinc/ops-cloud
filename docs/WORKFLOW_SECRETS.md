# GitHub Actions Secrets Reference

**Last Updated:** 2025-01-09
**Status:** Active

## Required Secrets for Workflows

### Core Deployment Secrets

| Secret Name | Purpose | Required For | Example Value |
|-------------|---------|--------------|----------------|
| `CLOUDWAYS_HOST` | Cloudways server IP/hostname | All Cloudways deployments | `123.45.67.89` |
| `CLOUDWAYS_USER` | SSH user for Cloudways | All Cloudways deployments | `cloudways_user` |
| `CLOUDWAYS_SSH_KEY` | Private SSH key (PEM format, no passphrase) | All Cloudways deployments | `-----BEGIN RSA PRIVATE KEY-----...` |
| `APP_ROOT_SPARKY_STAGING` | Full app root path for Sparky staging | Sparky deployments | `/home/1540390.cloudwaysapps.com/xpzgjptrwn/public_html` |
| `APP_ROOT_HEZLEP_STAGING` | Full app root path for Hezlep staging | Hezlep deployments | `/home/1540390.cloudwaysapps.com/.../public_html` |
| `APP_ROOT_SPARKY_PROD` | Full app root path for Sparky production | Sparky prod deployments | `/home/1540390.cloudwaysapps.com/.../public_html` |
| `APP_ROOT_HEZLEP_PROD` | Full app root path for Hezlep production | Hezlep prod deployments | `/home/1540390.cloudwaysapps.com/.../public_html` |

### Orchestrator & API Secrets

| Secret Name | Purpose | Required For | Fallback | Example Value |
|-------------|---------|--------------|----------|---------------|
| `ORCHESTRATOR_URL` | Orchestrator API base URL | Live snapshot, status checks | None | `https://ops-orchestrator.onrender.com` |
| `OPENAI_API_KEY` | **Primary** API key for Orchestrator `/ai/*` routes | Live snapshot, API calls | `AI_KEY` | `sk-...` |
| `AI_KEY` | **Legacy** API key (fallback only) | Live snapshot (if OPENAI_API_KEY not set) | None | `sk-...` |

**Note:** The orchestrator uses `OPENAI_API_KEY` as the primary authentication key. `AI_KEY` is supported for legacy compatibility but `OPENAI_API_KEY` is preferred.

### Optional Secrets

| Secret Name | Purpose | Required For | Example Value |
|-------------|---------|--------------|---------------|
| `GITHUB_TOKEN` | GitHub API token (for repo status) | Status checks, map updates | `ghp_...` |
| `GITHUB_REPO` | Owner/repo for status calls | Status checks | `owner/repo` |
| `RENDER_API_KEY` | Render.com API key | Map updates | `rnd_...` |
| `CW_EMAIL` | Cloudways account email | Map updates | `user@example.com` |
| `CW_API_KEY` | Cloudways API key | Map updates | `...` |
| `OPS_BOT_TOKEN` | GitHub PAT for bot commits | Map updates (auto-commit) | `ghp_...` |

## Workflow-Specific Requirements

### `.github/workflows/deploy-theme.yml`
**Required:**
- `CLOUDWAYS_HOST`
- `CLOUDWAYS_USER`
- `CLOUDWAYS_SSH_KEY`
- `APP_ROOT_<BRAND>_<ENV>` (per brand/environment)

**Optional:**
- None

### `.github/workflows/orchestrator-live-cron.yml`
**Required:**
- None (workflow will skip gracefully if secrets missing)

**Optional (but recommended):**
- `ORCHESTRATOR_URL` - Orchestrator API URL
- `OPENAI_API_KEY` - API key (preferred)
- `AI_KEY` - Legacy API key (fallback if OPENAI_API_KEY not set)

**Behavior:**
- If secrets are missing, workflow creates empty artifact and exits successfully
- This prevents workflow failures while allowing optional monitoring

### `.github/workflows/update-maps.yml`
**Required:**
- None (workflow will skip steps if secrets missing)

**Optional:**
- `ORCHESTRATOR_URL` - For orchestrator status
- `ORCHESTRATOR_API_KEY` or `OPENAI_API_KEY` - For orchestrator auth
- `RENDER_API_KEY` - For Render.com status
- `CW_EMAIL` / `CW_API_KEY` - For Cloudways status
- `OPS_BOT_TOKEN` - For auto-committing map updates

### `.github/workflows/run-bootstrap.yml`
**Required:**
- `CLOUDWAYS_HOST`
- `CLOUDWAYS_USER`
- `CLOUDWAYS_SSH_KEY`

**Optional:**
- None

## Setting Secrets in GitHub

1. Go to repository → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Enter the secret name and value
4. Click **Add secret**

## Troubleshooting

### Workflow fails with "secrets are required"
- **Fixed:** The `orchestrator-live-cron.yml` workflow now gracefully skips if secrets are missing
- **Action:** Set `ORCHESTRATOR_URL` and `OPENAI_API_KEY` if you want live snapshots to work

### 401 Unauthorized on Orchestrator API calls
- **Cause:** API key mismatch or missing
- **Fix:** Ensure `OPENAI_API_KEY` secret matches the `OPENAI_API_KEY` environment variable in Render (orchestrator service)
- **Check:** Verify orchestrator is using the same key: `orchestrator/src/middleware/auth.js`

### Deployment fails with SSH errors
- **Cause:** SSH key format or permissions issue
- **Fix:**
  - Ensure SSH key is PEM format (starts with `-----BEGIN RSA PRIVATE KEY-----`)
  - Ensure no passphrase on key
  - Verify `CLOUDWAYS_HOST` and `CLOUDWAYS_USER` are correct

### APP_ROOT path errors
- **Cause:** Incorrect app root path in secret
- **Fix:** Get exact path from Cloudways app settings:
  1. Cloudways dashboard → Your App → Application Management
  2. Note the full path shown (e.g., `/home/1540390.cloudwaysapps.com/xpzgjptrwn/public_html`)
  3. Set this exact path in the `APP_ROOT_<BRAND>_<ENV>` secret

## Secret Naming Convention

- **Cloudways paths:** `APP_ROOT_<BRAND>_<ENV>` (e.g., `APP_ROOT_SPARKY_STAGING`)
- **API keys:** Use descriptive names (`OPENAI_API_KEY`, `RENDER_API_KEY`)
- **Service URLs:** Use `_URL` suffix (`ORCHESTRATOR_URL`)

## Migration Notes

**From `AI_KEY` to `OPENAI_API_KEY`:**
- Old workflows may reference `AI_KEY`
- New standard is `OPENAI_API_KEY` (matches orchestrator auth)
- `AI_KEY` is still supported as fallback for legacy compatibility
- **Recommendation:** Set `OPENAI_API_KEY` and remove `AI_KEY` once all workflows updated

---

**See Also:**
- [Deployment Guide](04_DEPLOYMENT.md) - Full deployment documentation
- [Orchestrator API](03_ORCHESTRATOR.md) - API authentication details

