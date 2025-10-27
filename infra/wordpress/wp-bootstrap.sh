#!/usr/bin/env bash
set -euo pipefail

# Read from env vars; fall back to .env file if present
if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  . ./.env
  set +a
fi

SITE_NAME="${SITE_NAME:-${WP_SITE_NAME:-WordPress Site}}"
DOMAIN="${DOMAIN:-${WP_DOMAIN:-example.com}}"
ADMIN_EMAIL="${ADMIN_EMAIL:-admin@${DOMAIN}}"
THEME_SLUG="${THEME_SLUG:-hello-child}"
PLUGINS_CSV="${PLUGINS:-}" # comma-separated list

wp option update blogname "${SITE_NAME}"
wp option update siteurl "https://${DOMAIN}"
wp option update home "https://${DOMAIN}"
wp user update 1 --user_email="${ADMIN_EMAIL}" || true

IFS=',' read -r -a PLUGINS_ARR <<< "${PLUGINS_CSV}"
for plugin_slug in "${PLUGINS_ARR[@]}"; do
  if [ -n "${plugin_slug}" ]; then
    wp plugin activate "${plugin_slug}" || true
  fi
done

# Activate theme
wp theme activate "${THEME_SLUG}" || true

# Ensure Hello Elementor parent is installed when using our child themes
if [ "${THEME_SLUG}" = "hello-child" ] || [ "${THEME_SLUG}" = "marketing" ]; then
  wp theme is-installed hello-elementor || wp theme install hello-elementor --quiet
fi

# === BRAND / KIT IMPORT (Cursor) ===
BRAND_PATH="./brand/${DEPLOY_SITE:-}"
KIT_PATH_JSON="${BRAND_PATH}/elementor/cursor-sitekit.json"
KIT_PATH_ZIP="${BRAND_PATH}/elementor/cursor-sitekit.zip"
BRAND_CSS_SRC="${BRAND_PATH}/assets/css/cursor.css"
THEME_CSS_DST="./wp-content/themes/${THEME_SLUG}/assets/css/cursor.css"

echo "Running Cursor kit import for ${DEPLOY_SITE:-unset}..."

# 1) Ensure Elementor installed/active; Elementor Pro activation is manual one-time
wp plugin is-installed elementor || wp plugin install elementor --activate
wp plugin activate elementor-pro || echo "Elementor Pro not found (upload once manually)."

# 2) Copy brand cursor.css into child theme tokens path
if [ -f "$BRAND_CSS_SRC" ]; then
  mkdir -p "$(dirname "$THEME_CSS_DST")"
  cp "$BRAND_CSS_SRC" "$THEME_CSS_DST"
else
  echo "No brand cursor.css at $BRAND_CSS_SRC"
fi

# 3) Import Elementor Site Kit if present (.zip preferred, fallback to .json)
if [ -f "$KIT_PATH_ZIP" ]; then
  wp elementor kit import "$KIT_PATH_ZIP" || echo "Kit import failed or requires Elementor Pro."
elif [ -f "$KIT_PATH_JSON" ]; then
  wp elementor kit import "$KIT_PATH_JSON" || echo "Kit import failed or requires Elementor Pro."
else
  echo "Kit not found at $KIT_PATH_ZIP or $KIT_PATH_JSON"
fi

# 4) Disable Elementor default schemes
wp option update elementor_disable_color_schemes "yes"
wp option update elementor_disable_typography_schemes "yes"

# Create starter pages if missing
create_page_if_missing() {
  local title="$1"
  local slug="$2"
  local content="$3"
  if ! wp post list --post_type=page --name="$slug" --field=ID | grep -qE '^[0-9]+$'; then
    wp post create --post_type=page --post_title="$title" --post_name="$slug" --post_status=publish --post_content="$content" >/dev/null
  fi
}

create_page_if_missing "Home" "home" "Welcome to ${SITE_NAME}."
create_page_if_missing "Resources" "resources" "Resources page."
create_page_if_missing "Tools" "tools" "Tools page."
create_page_if_missing "About" "about" "About us."
create_page_if_missing "Contact" "contact" "Contact page."

# Assign Home as front page
HOME_ID=$(wp post list --post_type=page --name=home --field=ID)
if [ -n "$HOME_ID" ]; then
  wp option update show_on_front page
  wp option update page_on_front "$HOME_ID"
fi

# Ensure primary menu exists and assigned
if ! wp menu list --fields=slug | grep -q '^primary$'; then
  wp menu create primary >/dev/null
fi
wp menu location assign primary primary || true

# Permalinks
wp rewrite structure '/%postname%/' --hard
wp option update blogdescription 'Modern electrical tools & content'
