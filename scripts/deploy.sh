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
DOMAIN=$(jq -r --arg s "$SITE" --arg e "$DEPLOY_ENV" '.[$s][$e].domain' "$PROJECTS_JSON")

if [[ -z "$APP_ID" || "$APP_ID" == "null" ]]; then
  echo "Unknown site: $SITE" >&2
  exit 1
fi

TARGET_DOMAIN="$DOMAIN"

echo "Deploying site=$SITE env=$DEPLOY_ENV app_id=$APP_ID domain=$TARGET_DOMAIN"

# Rsync theme
rsync -az --delete \
  -e "ssh -o StrictHostKeyChecking=no" \
  "$(dirname "$0")/../infra/wordpress/themes/marketing/" \
  "$CLOUDWAYS_USER@$CLOUDWAYS_HOST:/home/master/applications/$APP_ID/public_html/wp-content/themes/marketing/"

# Rsync brand kit (JSON + CSS) for this site into app root under ./brand/<site>/
rsync -az \
  -e "ssh -o StrictHostKeyChecking=no" \
  "$(dirname "$0")/../infra/brands/${SITE}/" \
  "$CLOUDWAYS_USER@$CLOUDWAYS_HOST:/home/master/applications/$APP_ID/public_html/brand/${SITE}/"

# Upload bootstrap and run it
scp -o StrictHostKeyChecking=no "$(dirname "$0")/../infra/wordpress/wp-bootstrap.sh" \
  "$CLOUDWAYS_USER@$CLOUDWAYS_HOST:/home/master/applications/$APP_ID/public_html/wp-bootstrap.sh"
THEME_SLUG="marketing"
if [[ "$SITE" == "sparky" ]]; then
  THEME_SLUG="sparky-hq"
fi

ssh -o StrictHostKeyChecking=no "$CLOUDWAYS_USER@$CLOUDWAYS_HOST" \
  "chmod +x /home/master/applications/$APP_ID/public_html/wp-bootstrap.sh && \
   cd /home/master/applications/$APP_ID/public_html && \
   SITE_NAME='$SITE' DOMAIN='$TARGET_DOMAIN' ADMIN_EMAIL='admin@$TARGET_DOMAIN' THEME_SLUG='$THEME_SLUG' DEPLOY_SITE='$SITE' PLUGINS='${PLUGINS:-}' bash wp-bootstrap.sh"


