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

echo "▶ Applying Astra pages for brand: $BRAND (via wp eval)"
# Use wp eval with inline PHP to pass brand reliably
# Note: require_once path is relative to APP_ROOT (WordPress root)
wp eval "
define('BRAND_SLUG', '$BRAND');
if (file_exists('infra/wordpress/bin/apply-astra-pages.php')) {
    require_once('infra/wordpress/bin/apply-astra-pages.php');
} else {
    WP_CLI::error('Script not found: infra/wordpress/bin/apply-astra-pages.php');
}
" --allow-root || echo "⚠️  Astra page apply script exited non-zero (non-blocking)"

echo "▶ Ensuring Home page exists and is front page"
# Extract first numeric ID (strip any BOM or non-digit chars just in case).
HOME_ID="$(wp post list --post_type=page --name=home --field=ID --allow-root 2>/dev/null | tr -cd '0-9\n' | head -n1 || true)"
if [ -z "$HOME_ID" ]; then
  echo "⚠️  No Home page found; creating basic Home page"
  HOME_ID="$(wp post create \
    --post_type=page \
    --post_status=publish \
    --post_name=home \
    --post_title='Home' \
    --post_content='<h1>Home</h1><p>Placeholder Astra home page created by bootstrap.</p>' \
    --porcelain \
    --allow-root)"
else
  echo "▶ Home page already exists (ID=$HOME_ID); leaving content as-is"
fi

echo "▶ Setting page_on_front to ID=$HOME_ID"
wp option update show_on_front page --allow-root >/dev/null
wp option update page_on_front "$HOME_ID" --allow-root >/dev/null

echo "✅ Bootstrap complete for $BRAND ($DEPLOY_ENV) (Astra-first + pages)"
