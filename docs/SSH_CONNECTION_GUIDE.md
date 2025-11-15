# SSH Connection Guide for Cloudways

**Quick connection steps for Cloudways SSH access.**

## Get Connection Details
From GitHub Secrets: `CLOUDWAYS_HOST`, `CLOUDWAYS_USER`, `CLOUDWAYS_SSH_KEY`

## Save SSH Key
**Windows:** Save key to `~/.ssh/cloudways_key`, set permissions via `icacls`  
**Mac/Linux:** Save key to `~/.ssh/cloudways_key`, run `chmod 600`

## Connect
**Windows:** `ssh -i ~/.ssh/cloudways_key $USER@$HOST`  
**Mac/Linux:** `ssh -i ~/.ssh/cloudways_key $USER@$HOST`

## Navigate to App
`cd /home/1540390.cloudwaysapps.com/<app_dir>/public_html`

## Common Commands
- `wp theme list --allow-root` - List themes
- `wp theme delete astra-child --allow-root` - Delete theme
- `wp post list --post_type=page --allow-root` - List pages

**See:** [APP_DIRECTORIES.md](APP_DIRECTORIES.md) for app paths.
