# Cloudways App Directory Reference

**Last Updated:** 2025-11-15

## App Root Paths

The app root paths are stored in GitHub Secrets. Here's what we know:

### Hezlep Inc

**Staging:**
- **Secret Name:** `APP_ROOT_HEZLEP_STAGING`
- **Domain:** `staging.hezlepinc.com`
- **App ID:** `5952133` (from `config/projects.json`)
- **Format:** `/home/1540390.cloudwaysapps.com/<hezlep_app_dir>/public_html`
- **Actual Path:** Check GitHub Secrets → `APP_ROOT_HEZLEP_STAGING`

**Production:**
- **Secret Name:** `APP_ROOT_HEZLEP_PROD`
- **Domain:** `hezlepinc.com`
- **App ID:** `5951972` (from `config/projects.json`)
- **Format:** `/home/1540390.cloudwaysapps.com/<hezlep_app_dir>/public_html`
- **Actual Path:** Check GitHub Secrets → `APP_ROOT_HEZLEP_PROD`

### Sparky HQ

**Staging:**
- **Secret Name:** `APP_ROOT_SPARKY_STAGING`
- **Domain:** `staging.sparky-hq.com`
- **App ID:** `5952134` (from `config/projects.json`)
- **App Dir:** `xpzgjptrwn` (from `config/projects.json`)
- **Format:** `/home/1540390.cloudwaysapps.com/xpzgjptrwn/public_html`
- **Actual Path:** Check GitHub Secrets → `APP_ROOT_SPARKY_STAGING`

**Production:**
- **Secret Name:** `APP_ROOT_SPARKY_PROD`
- **Domain:** `sparky-hq.com`
- **App ID:** `5952041` (from `config/projects.json`)
- **Format:** `/home/1540390.cloudwaysapps.com/<sparky_app_dir>/public_html`
- **Actual Path:** Check GitHub Secrets → `APP_ROOT_SPARKY_PROD`

## How to Find Your Actual App Root Path

### Method 1: From GitHub Secrets (Recommended)

1. Go to: GitHub → Your Repo → Settings → Secrets and variables → Actions
2. Look for:
   - `APP_ROOT_HEZLEP_STAGING`
   - `APP_ROOT_SPARKY_STAGING`
   - `APP_ROOT_HEZLEP_PROD`
   - `APP_ROOT_SPARKY_PROD`

### Method 2: From Cloudways Dashboard

1. Log into Cloudways: https://platform.cloudways.com
2. Go to your Server → Your App
3. Click **Application Management**
4. Look for **Application URL** or **Application Path**
5. The path will be something like: `/home/1540390.cloudwaysapps.com/xpzgjptrwn/public_html`

### Method 3: Via SSH (Once Connected)

```bash
# Once SSH'd into Cloudways, run:
pwd
# This will show your current directory

# Or check WordPress root:
wp eval 'echo ABSPATH;' --allow-root

# Or find the app directory:
ls -la /home/1540390.cloudwaysapps.com/
```

## Typical Cloudways Directory Structure

Once you're in the app root (`public_html`), you'll see:

```
public_html/
├── wp-admin/
├── wp-content/
│   ├── themes/
│   │   ├── astra/                    # Parent theme
│   │   ├── astra-child/              # Cursor-created theme (to be deleted)
│   │   └── hezlep-child-theme/      # Your downloaded theme (active)
│   ├── plugins/
│   └── mu-plugins/                   # Must-use plugins
│       └── ops-status.php            # Our status endpoint
├── wp-includes/
├── infra/                            # Our deployment files
│   └── wordpress/
│       ├── bin/                      # Scripts (apply-astra-pages.php, etc.)
│       ├── brands/                   # Brand-specific files
│       │   ├── hezlep-inc/
│       │   │   ├── pages/            # HTML pages (preferred)
│       │   │   ├── content/pages/    # JSON pages (current)
│       │   │   ├── patterns/          # Pattern HTML files
│       │   │   ├── theme.json        # Brand theme config
│       │   │   └── cursor.css        # Brand CSS
│       │   └── sparky-hq/
│       └── config/
│           └── projects.json         # Brand configuration
│       └── wp-bootstrap.sh           # Bootstrap script
├── index.php
└── wp-config.php
```

## Quick Commands Once Connected

```bash
# Navigate to app root (replace with your actual path)
cd /home/1540390.cloudwaysapps.com/your_app_dir/public_html

# Check current directory
pwd

# List files
ls -la

# Check WordPress root
wp eval 'echo ABSPATH;' --allow-root

# List themes
wp theme list --allow-root

# List pages
wp post list --post_type=page --allow-root

# Check status endpoint
curl https://staging.hezlepinc.com/wp-json/ops/v1/status
```

---

**See Also:**
- [SSH Connection Guide](SSH_CONNECTION_GUIDE.md) - How to connect via SSH
- [Workflow Secrets](WORKFLOW_SECRETS.md) - All GitHub secrets reference

