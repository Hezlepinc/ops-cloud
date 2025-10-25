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

APP_ID=$(jq -r --arg s "$SITE" '.[$s].app_id' "$PROJECTS_JSON")
DOMAIN=$(jq -r --arg s "$SITE" '.[$s].domain' "$PROJECTS_JSON")
STAGING_DOMAIN=$(jq -r --arg s "$SITE" '.[$s].staging' "$PROJECTS_JSON")

if [[ -z "$APP_ID" || "$APP_ID" == "null" ]]; then
  echo "Unknown site: $SITE" >&2
  exit 1
fi

if [[ "$DEPLOY_ENV" == "production" ]]; then
  TARGET_DOMAIN="$DOMAIN"
else
  TARGET_DOMAIN="$STAGING_DOMAIN"
fi

echo "Deploying site=$SITE env=$DEPLOY_ENV app_id=$APP_ID domain=$TARGET_DOMAIN"

# Rsync theme
rsync -az --delete \
  -e "ssh -o StrictHostKeyChecking=no" \
  "$(dirname "$0")/../infra/wordpress/themes/marketing/" \
  "$CLOUDWAYS_USER@$CLOUDWAYS_HOST:/home/master/applications/$APP_ID/public_html/wp-content/themes/marketing/"

# Upload bootstrap and run it
scp -o StrictHostKeyChecking=no "$(dirname "$0")/../infra/wordpress/wp-bootstrap.sh" \
  "$CLOUDWAYS_USER@$CLOUDWAYS_HOST:/home/master/applications/$APP_ID/public_html/wp-bootstrap.sh"
ssh -o StrictHostKeyChecking=no "$CLOUDWAYS_USER@$CLOUDWAYS_HOST" \
  "chmod +x /home/master/applications/$APP_ID/public_html/wp-bootstrap.sh && \
   cd /home/master/applications/$APP_ID/public_html && \
   SITE_NAME='$SITE' DOMAIN='$TARGET_DOMAIN' ADMIN_EMAIL='admin@$TARGET_DOMAIN' bash wp-bootstrap.sh"


