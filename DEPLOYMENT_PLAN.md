# Template Deployment Plan - Proof of Life
**Date:** 2025-01-09  
**Goal:** Full deployment of templates to sparky-hq and hezlep-inc via orchestrator

## Current State

### ✅ What Exists
- Orchestrator API with Cloudways integration
- GitHub Actions workflow for theme deployment (`.github/workflows/deploy-theme.yml`)
- Brand templates for both sites:
  - `infra/wordpress/brands/sparky-hq/` (elementor template zip + theme files)
  - `infra/wordpress/brands/hezlep-inc/` (elementor template zip + theme files)
- Config file: `config/projects.json` with both sites configured
- Bootstrap script: `infra/wordpress/wp-bootstrap.sh`
- Kit import script: `infra/wordpress/bin/import-kits.sh`

### ⚠️ What Needs Fixing
- Deploy workflow triggers on `develop` branch (should be `staging`)
- Orchestrator deploy endpoint needs to trigger correct workflow event
- Need to verify all required secrets are set in GitHub

## Deployment Flow

```
Orchestrator API
  ↓ POST /ai/deploy { brand, environment }
  ↓ Triggers GitHub repository_dispatch
GitHub Actions
  ↓ Workflow: deploy-theme.yml
  ↓ Matrix strategy (sparky, hezlepinc)
  ↓ Rsync themes + templates
  ↓ Run bootstrap script
  ↓ Import Elementor kits
Cloudways WordPress Sites
  ↓ Templates deployed and activated
```

## Steps to Deploy

### 1. Update Workflow (✅ Done)
- [x] Change trigger from `develop` to `staging`
- [x] Add `repository_dispatch` trigger
- [x] Update matrix builder to handle dispatch payload

### 2. Update Orchestrator Endpoint (✅ Done)
- [x] Update `/ai/deploy` to trigger `deploy-templates` event
- [x] Add `/ai/deploy/all` for bulk deployment
- [x] Validate brand and environment parameters

### 3. Verify GitHub Secrets
Required secrets in GitHub repo:
- `CLOUDWAYS_HOST` - Cloudways server IP/hostname
- `CLOUDWAYS_USER` - SSH user
- `CLOUDWAYS_SSH_KEY` - Private SSH key (PEM format)
- `APP_ROOT_SPARKY_STAGING` - Full path to Sparky staging app root
- `APP_ROOT_HEZLEP_STAGING` - Full path to Hezlep staging app root

### 4. Test Deployment

#### Test Single Brand (Sparky)
```bash
# Via Orchestrator API
curl -X POST \
  -H "x-api-key: YOUR_ORCHESTRATOR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"brand": "sparky", "environment": "staging"}' \
  https://ops-orchestrator.onrender.com/ai/deploy
```

#### Test Single Brand (Hezlep)
```bash
curl -X POST \
  -H "x-api-key: YOUR_ORCHESTRATOR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"brand": "hezlepinc", "environment": "staging"}' \
  https://ops-orchestrator.onrender.com/ai/deploy
```

#### Test All Brands
```bash
curl -X POST \
  -H "x-api-key: YOUR_ORCHESTRATOR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"environment": "staging"}' \
  https://ops-orchestrator.onrender.com/ai/deploy/all
```

### 5. Verify Deployment

After deployment completes:

1. **Check GitHub Actions:**
   - Go to Actions tab
   - Find "Deploy WP Themes & Kits" workflow run
   - Verify all steps completed successfully

2. **Check WordPress Sites:**
   - Visit `https://staging.sparky-hq.com`
   - Visit `https://staging.hezlepinc.com`
   - Verify themes are active
   - Check Elementor → Templates to see imported kits

3. **Check via Orchestrator:**
   ```bash
   # Check WordPress health
   curl -H "x-api-key: YOUR_KEY" \
     https://ops-orchestrator.onrender.com/ai/wordpress/sparky-hq
   
   curl -H "x-api-key: YOUR_KEY" \
     https://ops-orchestrator.onrender.com/ai/wordpress/hezlep-inc
   
   # Check Elementor kits
   curl -H "x-api-key: YOUR_KEY" \
     https://ops-orchestrator.onrender.com/ai/elementor/sparky-hq
   
   curl -H "x-api-key: YOUR_KEY" \
     https://ops-orchestrator.onrender.com/ai/elementor/hezlep-inc
   ```

## Expected Results

### Sparky-HQ Staging
- ✅ Theme activated (overlay theme from projects.json)
- ✅ Elementor kit imported (`sparky_template.zip`)
- ✅ Site accessible at `https://staging.sparky-hq.com`
- ✅ Header/Footer templates present in Elementor library

### Hezlep-Inc Staging
- ✅ Theme activated (overlay theme from projects.json)
- ✅ Elementor kit imported (`hezlep_template.zip`)
- ✅ Site accessible at `https://staging.hezlepinc.com`
- ✅ Header/Footer templates present in Elementor library

## Troubleshooting

### If deployment fails:

1. **Check GitHub Actions logs:**
   - Look for SSH connection errors
   - Verify APP_ROOT paths are correct
   - Check rsync errors

2. **Verify SSH access:**
   ```bash
   ssh -i ~/.ssh/cloudways_key CLOUDWAYS_USER@CLOUDWAYS_HOST
   ```

3. **Check Cloudways API:**
   ```bash
   curl -X POST \
     -H "x-api-key: YOUR_KEY" \
     -H "Content-Type: application/json" \
     -d '{"app_id": 5952134}' \
     https://ops-orchestrator.onrender.com/ai/cloudways/purge
   ```

4. **Verify templates exist:**
   ```bash
   ls -la infra/wordpress/brands/sparky-hq/elementor/
   ls -la infra/wordpress/brands/hezlep-inc/elementor/
   ```

## Next Steps After Successful Deployment

1. ✅ Verify templates render correctly on staging
2. ✅ Test theme functionality
3. ✅ Check Elementor kit import success
4. ✅ Document any issues found
5. ✅ Plan production deployment (when ready)

---

**Status:** Ready to test  
**Next Action:** Run test deployment via orchestrator API

