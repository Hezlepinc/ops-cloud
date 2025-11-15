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
echo "▶ Bootstrap mode: Astra-first (Elementor path deprecated)"

ASTRA_SLUG="astra-child"

echo "▶ Checking for Astra child theme: $ASTRA_SLUG"
if wp theme is-installed "$ASTRA_SLUG" --allow-root >/dev/null 2>&1; then
  echo "▶ Activating Astra child theme: $ASTRA_SLUG"
  wp theme activate "$ASTRA_SLUG" --allow-root || true
else
  echo "⚠️  Astra child theme not installed; falling back to overlay from projects.json"

  # Determine overlay theme from projects.json (legacy fallback)
  OVERLAY=$(php -r '
    $p = json_decode(file_get_contents("infra/wordpress/config/projects.json"), true);
    $b = $p["'$BRAND'"] ?? null;
    echo $b["overlay_theme"] ?? "";
  ')
  if [ -z "$OVERLAY" ]; then echo "No overlay in projects.json for $BRAND"; exit 1; fi

  echo "▶ Activating overlay theme (legacy): $OVERLAY"
  wp theme activate "$OVERLAY" --allow-root || true
fi

echo "▶ Applying Astra pages for brand: $BRAND"
bash infra/wordpress/bin/apply-astra-pages.sh "$BRAND" || echo "⚠️  Astra page apply script exited non-zero"

echo "✅ Bootstrap complete for $BRAND ($DEPLOY_ENV) (Astra-first + pages)"
