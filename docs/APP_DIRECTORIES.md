# Cloudways App Directory Reference

**App root paths stored in GitHub Secrets.**

## Hezlep Inc
- **Staging:** `APP_ROOT_HEZLEP_STAGING` → `/home/1540390.cloudwaysapps.com/<dir>/public_html`
- **Production:** `APP_ROOT_HEZLEP_PROD` → `/home/1540390.cloudwaysapps.com/<dir>/public_html`

## Sparky HQ
- **Staging:** `APP_ROOT_SPARKY_STAGING` → `/home/1540390.cloudwaysapps.com/xpzgjptrwn/public_html`
- **Production:** `APP_ROOT_SPARKY_PROD` → `/home/1540390.cloudwaysapps.com/<dir>/public_html`

## Find App Root
1. **GitHub Secrets:** Settings → Secrets → Actions → `APP_ROOT_*`
2. **Cloudways Dashboard:** Server → App → Application Management → Application Path
3. **Via SSH:** `wp eval 'echo ABSPATH;' --allow-root`

**See:** [SSH_CONNECTION_GUIDE.md](SSH_CONNECTION_GUIDE.md) for SSH setup.
