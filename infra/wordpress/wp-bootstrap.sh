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
