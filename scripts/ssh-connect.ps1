# PowerShell script to connect to Cloudways via SSH
# Usage: .\scripts\ssh-connect.ps1

Write-Host "🔐 Cloudways SSH Connection Helper" -ForegroundColor Cyan
Write-Host ""

# Check if SSH key exists
$sshKeyPath = "$env:USERPROFILE\.ssh\cloudways_key"
if (-not (Test-Path $sshKeyPath)) {
    Write-Host "❌ SSH key not found at: $sshKeyPath" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please create the key file first:" -ForegroundColor Yellow
    Write-Host "1. Go to GitHub → Repo → Settings → Secrets → Actions" -ForegroundColor Yellow
    Write-Host "2. Copy the CLOUDWAYS_SSH_KEY secret value" -ForegroundColor Yellow
    Write-Host "3. Save it to: $sshKeyPath" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "You can create it with:" -ForegroundColor Yellow
    Write-Host "  notepad $sshKeyPath" -ForegroundColor Cyan
    Write-Host "  (Then paste the key content and save)" -ForegroundColor Yellow
    exit 1
}

# Prompt for connection details
Write-Host "Enter your Cloudways connection details:" -ForegroundColor Yellow
Write-Host "(You can find these in GitHub Secrets: CLOUDWAYS_HOST, CLOUDWAYS_USER)" -ForegroundColor Gray
Write-Host ""

$host = Read-Host "Host (e.g., 1540390.cloudwaysapps.com)"
$user = Read-Host "User (e.g., cloudways_user)"

if ([string]::IsNullOrWhiteSpace($host) -or [string]::IsNullOrWhiteSpace($user)) {
    Write-Host "❌ Host and user are required" -ForegroundColor Red
    exit 1
}

# Set key permissions
Write-Host ""
Write-Host "▶ Setting SSH key permissions..." -ForegroundColor Cyan
try {
    icacls $sshKeyPath /inheritance:r 2>$null
    icacls $sshKeyPath /grant:r "$env:USERNAME:(R)" 2>$null
    Write-Host "✅ Permissions set" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Could not set permissions (may need admin): $($_.Exception.Message)" -ForegroundColor Yellow
}

# Connect
Write-Host ""
Write-Host "▶ Connecting to $user@$host..." -ForegroundColor Cyan
Write-Host ""

ssh -i $sshKeyPath $user@$host

