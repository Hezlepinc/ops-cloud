#!/usr/bin/env bash
set -euo pipefail

# Usage: deploy.sh --site=<key> [--env=staging|production]

SITE=""
DEPLOY_ENV="${DEPLOY_ENV:-}"

for arg in "$@"; do
  case "$arg" in
    --site=*) SITE="${arg#*=}" ;;
    --env=*) DEPLOY_ENV="${arg#*=}" ;;
  esac
done

if [[ -z "$SITE" ]]; then
  echo "Missing --site. Example: --site=hezlepinc" >&2
  exit 1
fi

if [[ -z "$DEPLOY_ENV" ]]; then
  DEPLOY_ENV="${DEPLOY_ENV:-staging}"
fi

PROJECTS_JSON="$(dirname "$0")/../config/projects.json"
if [[ ! -f "$PROJECTS_JSON" ]]; then
  echo "Missing config/projects.json" >&2
  exit 1
fi

APP_ID=$(jq -r --arg s "$SITE" --arg e "$DEPLOY_ENV" '.[$s][$e].app_id' "$PROJECTS_JSON")
# Allow override via env (useful for manual workflows where app_id is provided)
if [[ -n "${CLOUDWAYS_APP_ID:-}" && "${CLOUDWAYS_APP_ID}" != "null" ]]; then
  APP_ID="${CLOUDWAYS_APP_ID}"
fi
DOMAIN=$(jq -r --arg s "$SITE" --arg e "$DEPLOY_ENV" '.[$s][$e].domain' "$PROJECTS_JSON")
APP_DIR=$(jq -r --arg s "$SITE" --arg e "$DEPLOY_ENV" '.[$s][$e].app_dir // ""' "$PROJECTS_JSON")

if [[ -z "$APP_ID" || "$APP_ID" == "null" ]]; then
  echo "Unknown site: $SITE" >&2
  exit 1
fi

TARGET_DOMAIN="$DOMAIN"

echo "Deploying site=$SITE env=$DEPLOY_ENV app_id=$APP_ID domain=$TARGET_DOMAIN"

# Compute Cloudways application root
# Build remote app root using remote $HOME to avoid hardcoding username/home
if [[ -n "$APP_DIR" && "$APP_DIR" != "null" ]]; then
  APP_ROOT="\$HOME/applications/$APP_DIR/public_html"
else
  APP_ROOT="\$HOME/applications/$APP_ID/public_html"
fi

THEME_SLUG="marketing"
if [[ "$SITE" == "sparky" ]]; then
  THEME_SLUG="sparky-hq"
fi

# Ensure remote directories exist
ssh -o StrictHostKeyChecking=no "$CLOUDWAYS_USER@$CLOUDWAYS_HOST" \
  "mkdir -p $APP_ROOT/wp-content/themes/$THEME_SLUG && \
   mkdir -p $APP_ROOT/brand/$SITE"

# Rsync theme
rsync -az --delete \
  -e "ssh -o StrictHostKeyChecking=no" \
  "$(dirname "$0")/../infra/wordpress/themes/$THEME_SLUG/" \
  "$CLOUDWAYS_USER@$CLOUDWAYS_HOST:$APP_ROOT/wp-content/themes/$THEME_SLUG/"

# Determine brand directory name (repo uses 'sparkyhq')
BRAND_DIR="$SITE"
if [[ "$SITE" == "sparky" ]]; then
  BRAND_DIR="sparkyhq"
fi

# Rsync brand kit (JSON + CSS) for this site into app root under ./brand/<site>/
rsync -az \
  -e "ssh -o StrictHostKeyChecking=no" \
  "$(dirname "$0")/../infra/wordpress/brands/${BRAND_DIR}/" \
  "$CLOUDWAYS_USER@$CLOUDWAYS_HOST:$APP_ROOT/brand/${SITE}/"

# Upload bootstrap and run it
scp -o StrictHostKeyChecking=no "$(dirname "$0")/../infra/wordpress/wp-bootstrap.sh" \
  "$CLOUDWAYS_USER@$CLOUDWAYS_HOST:$APP_ROOT/wp-bootstrap.sh"

ssh -o StrictHostKeyChecking=no "$CLOUDWAYS_USER@$CLOUDWAYS_HOST" \
  "chmod +x $APP_ROOT/wp-bootstrap.sh && \
   cd $APP_ROOT && \
   SITE_NAME='$SITE' DOMAIN='$TARGET_DOMAIN' ADMIN_EMAIL='admin@$TARGET_DOMAIN' THEME_SLUG='$THEME_SLUG' DEPLOY_SITE='$SITE' PLUGINS='${PLUGINS:-}' bash wp-bootstrap.sh"


