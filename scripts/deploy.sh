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

echo "Deploying site=$SITE env=$DEPLOY_ENV app_id=$APP_ID domain=$TARGET_DOMAIN app_dir=${APP_DIR:-unset}"

# Determine application root
if [[ -n "${APP_ROOT:-}" && "${APP_ROOT}" != "null" ]]; then
  : # use provided APP_ROOT
elif [[ -n "$APP_DIR" && "$APP_DIR" != "null" && -n "${CLOUDWAYS_ACCOUNT:-}" ]]; then
  APP_ROOT="/home/${CLOUDWAYS_ACCOUNT}/$APP_DIR/public_html"
else
  echo "Missing APP_ROOT or app_dir/CLOUDWAYS_ACCOUNT for $SITE $DEPLOY_ENV" >&2
  exit 1
fi

THEME_SLUG="hello-child"

SSH_OPTS="-i ~/.ssh/id_rsa -o StrictHostKeyChecking=no"
echo "Using APP_ROOT=$APP_ROOT"

# Verify remote app root exists
if ! ssh $SSH_OPTS "$CLOUDWAYS_USER@$CLOUDWAYS_HOST" "test -d '$APP_ROOT'"; then
  echo "Remote APP_ROOT does not exist: $APP_ROOT" >&2
  exit 1
fi

# Ensure remote directories exist
ssh $SSH_OPTS "$CLOUDWAYS_USER@$CLOUDWAYS_HOST" \
  "mkdir -p '$APP_ROOT/wp-content/themes/$THEME_SLUG' && \
   mkdir -p '$APP_ROOT/brand/$SITE'"

# Rsync theme
rsync -az --no-perms --no-times --omit-dir-times --delete \
  -e "ssh $SSH_OPTS" \
  "$(dirname "$0")/../infra/wordpress/themes/$THEME_SLUG/" \
  "$CLOUDWAYS_USER@$CLOUDWAYS_HOST:$APP_ROOT/wp-content/themes/$THEME_SLUG/"

# Determine brand directory name (map site keys to directory slugs)
BRAND_DIR="$SITE"
if [[ "$SITE" == "sparky" ]]; then
  BRAND_DIR="sparky-hq"
elif [[ "$SITE" == "hezlepinc" ]]; then
  BRAND_DIR="hezlep-inc"
fi

# Rsync brand kit (JSON + CSS) for this site into app root under ./brand/<site>/
rsync -az --no-perms --no-times --omit-dir-times \
  -e "ssh $SSH_OPTS" \
  "$(dirname "$0")/../infra/wordpress/brands/${BRAND_DIR}/" \
  "$CLOUDWAYS_USER@$CLOUDWAYS_HOST:$APP_ROOT/brand/${SITE}/"

# Upload bootstrap and run it
# Upload bootstrap script to /tmp first to avoid path issues, then move it
scp $SSH_OPTS "$(dirname "$0")/../infra/wordpress/wp-bootstrap.sh" \
  "$CLOUDWAYS_USER@$CLOUDWAYS_HOST:/tmp/wp-bootstrap.sh"

ssh $SSH_OPTS "$CLOUDWAYS_USER@$CLOUDWAYS_HOST" \
  "mkdir -p '$APP_ROOT/wp-content/themes/$THEME_SLUG' && \
   mv /tmp/wp-bootstrap.sh '$APP_ROOT/wp-content/themes/$THEME_SLUG/wp-bootstrap.sh' && \
   chmod +x '$APP_ROOT/wp-content/themes/$THEME_SLUG/wp-bootstrap.sh' && \
   cd '$APP_ROOT' && \
   SITE_NAME='$SITE' DOMAIN='$TARGET_DOMAIN' ADMIN_EMAIL='admin@$TARGET_DOMAIN' THEME_SLUG='$THEME_SLUG' DEPLOY_SITE='$SITE' PLUGINS='${PLUGINS:-}' bash 'wp-content/themes/$THEME_SLUG/wp-bootstrap.sh'"


