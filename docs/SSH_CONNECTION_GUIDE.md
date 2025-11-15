# SSH Connection Guide for Cloudways

**Last Updated:** 2025-11-15

## Quick Connection

### Step 1: Get Your Connection Details

You need three pieces of information (stored in GitHub Secrets):

1. **Host:** `CLOUDWAYS_HOST` (e.g., `1540390.cloudwaysapps.com`)
2. **User:** `CLOUDWAYS_USER` (e.g., `cloudways_user`)
3. **SSH Key:** `CLOUDWAYS_SSH_KEY` (private key content)

**To find these:**
- Go to GitHub → Your Repo → Settings → Secrets and variables → Actions
- Look for `CLOUDWAYS_HOST`, `CLOUDWAYS_USER`, `CLOUDWAYS_SSH_KEY`

### Step 2: Save Your SSH Key Locally

1. Copy the `CLOUDWAYS_SSH_KEY` secret value (the entire private key)
2. Save it to a file on your computer:
   ```bash
   # Windows (PowerShell)
   # Create the file and paste the key content
   notepad ~/.ssh/cloudways_key
   
   # Or use this command (replace YOUR_KEY_CONTENT with actual key):
   $CLOUDWAYS_KEY = "YOUR_KEY_CONTENT"
   $CLOUDWAYS_KEY | Out-File -FilePath ~/.ssh/cloudways_key -Encoding utf8
   ```

3. Set permissions (important for security):
   ```bash
   # Windows (PowerShell as Admin)
   icacls $env:USERPROFILE\.ssh\cloudways_key /inheritance:r
   icacls $env:USERPROFILE\.ssh\cloudways_key /grant:r "$env:USERNAME:(R)"
   ```

### Step 3: Connect via SSH

**Windows (PowerShell):**
```powershell
# Replace with your actual values
$HOST = "1540390.cloudwaysapps.com"  # From CLOUDWAYS_HOST secret
$USER = "your_cloudways_user"         # From CLOUDWAYS_USER secret
$KEY = "$env:USERPROFILE\.ssh\cloudways_key"

ssh -i $KEY $USER@$HOST
```

**Mac/Linux:**
```bash
# Replace with your actual values
HOST="1540390.cloudwaysapps.com"  # From CLOUDWAYS_HOST secret
USER="your_cloudways_user"         # From CLOUDWAYS_USER secret
KEY="$HOME/.ssh/cloudways_key"

chmod 600 $KEY
ssh -i $KEY $USER@$HOST
```

### Step 4: Navigate to Your App Root

Once connected, navigate to your WordPress installation:

```bash
# For Hezlep staging (replace with your actual path from APP_ROOT_HEZLEP_STAGING secret)
cd /home/1540390.cloudwaysapps.com/your_app_dir/public_html

# Verify you're in the right place
pwd
ls -la
```

## Common Commands

### Delete the astra-child Theme

```bash
# Make sure you're in the app root
cd /path/to/your/app/public_html

# Run the deletion script
bash infra/wordpress/bin/delete-theme.sh astra-child

# Or delete directly via WP-CLI
wp theme delete astra-child --allow-root
```

### Check Active Theme

```bash
wp theme list --status=active --allow-root
```

### List All Themes

```bash
wp theme list --allow-root
```

### Check WordPress Status

```bash
wp core version --allow-root
wp plugin list --allow-root
```

## Troubleshooting

### "Permission denied (publickey)"
- **Fix:** Make sure your SSH key file has correct permissions (600)
- **Windows:** Use `icacls` command above
- **Mac/Linux:** Use `chmod 600 ~/.ssh/cloudways_key`

### "Host key verification failed"
- **Fix:** Add host to known_hosts:
  ```bash
  ssh-keyscan -H your-host.cloudwaysapps.com >> ~/.ssh/known_hosts
  ```

### "Could not resolve hostname"
- **Fix:** Verify `CLOUDWAYS_HOST` is correct (should be like `1540390.cloudwaysapps.com`)

### "Connection timed out"
- **Fix:** 
  - Verify the host is correct
  - Check if your IP is whitelisted in Cloudways
  - Try using the server IP instead of hostname

## Alternative: Use Cloudways Platform SSH

If direct SSH doesn't work, you can also:

1. Log into Cloudways Platform: https://platform.cloudways.com
2. Go to your Server → Master Credentials
3. Use the SSH credentials provided there
4. Or use the "SSH Terminal" feature in Cloudways dashboard

---

**See Also:**
- [Workflow Secrets](WORKFLOW_SECRETS.md) - All GitHub secrets reference
- [Deployment Guide](04_DEPLOYMENT.md) - Full deployment documentation

