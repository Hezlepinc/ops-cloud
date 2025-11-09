#!/usr/bin/env bash
# Usage: ./infra/wordpress/wp-bootstrap.sh <brand-slug> <env>
# env: staging | prod
set -euo pipefail
BRAND="${1:-}"; DEPLOY_ENV="${2:-staging}"
if [ -z "$BRAND" ]; then echo "brand slug required"; exit 1; fi
if [[ "$DEPLOY_ENV" != "staging" && "$DEPLOY_ENV" != "prod" ]]; then echo "env must be staging|prod"; exit 1; fi

APP_ROOT="$(pwd)"
cd "$APP_ROOT"

echo "▶ APP_ROOT = $APP_ROOT"
echo "▶ Skipping Elementor plugin management (handled manually)"

echo "▶ Activating overlay based on projects.json and importing kits"

# Determine overlay theme from projects.json
OVERLAY=$(php -r '
  $p = json_decode(file_get_contents("infra/wordpress/config/projects.json"), true);
  $b = $p["'$BRAND'"] ?? null;
  echo $b["overlay_theme"] ?? "";
')
if [ -z "$OVERLAY" ]; then echo "No overlay in projects.json for $BRAND"; exit 1; fi

echo "▶ Activating overlay theme: $OVERLAY"
wp theme activate "$OVERLAY" --allow-root || true

echo "▶ Importing kits for $BRAND ($DEPLOY_ENV)"
bash infra/wordpress/bin/import-kits.sh "$BRAND" "$DEPLOY_ENV"

echo "✅ Bootstrap complete for $BRAND ($DEPLOY_ENV)"
