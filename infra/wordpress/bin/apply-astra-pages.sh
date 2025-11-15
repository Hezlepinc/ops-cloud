#!/usr/bin/env bash
# Usage: infra/wordpress/bin/apply-astra-pages.sh <brand-slug>
set -euo pipefail

BRAND="${1:-}"
if [ -z "$BRAND" ]; then
  echo "brand slug required"
  exit 1
fi

CONTENT_DIR="infra/wordpress/brands/${BRAND}/content/pages"
SITEMAP_PATH="infra/wordpress/brands/${BRAND}/sitemap.json"

if [ ! -d "$CONTENT_DIR" ]; then
  echo "No content/pages directory for brand=$BRAND ($CONTENT_DIR), skipping Astra page apply"
  exit 0
fi

echo "▶ Applying Astra pages for brand=${BRAND}"

# Helper: get page ID by slug (if exists)
get_page_id() {
  local slug="$1"
  wp post list --post_type=page --name="$slug" --field=ID --allow-root 2>/dev/null || true
}

HOME_ID=""

for file in "$CONTENT_DIR"/*.json; do
  [ -e "$file" ] || continue

  slug="$(basename "$file" .json)"
  title="$(echo "$slug" | tr '-' ' ' | sed 's/.*/\u&/')"

  echo "▶ Syncing page slug=$slug title=\"$title\" (using placeholder Astra content)"

  # For now, ignore JSON block structure and use a simple, robust HTML placeholder.
  # This avoids WP-CLI @file parsing issues while still giving us automated page creation.
  CONTENT="<h1>${title}</h1> <p>This is a placeholder page for ${BRAND} (${slug}).</p>"

  PAGE_ID="$(get_page_id "$slug")"

  if [ -n "$PAGE_ID" ]; then
    wp post update "$PAGE_ID" \
      --post_title="$title" \
      --post_content="$CONTENT" \
      --allow-root >/dev/null
  else
    PAGE_ID="$(wp post create \
      --post_type=page \
      --post_status=publish \
      --post_name="$slug" \
      --post_title="$title" \
      --post_content="$CONTENT" \
      --porcelain \
      --allow-root)"
  fi

  if [ "$slug" = "home" ]; then
    HOME_ID="$PAGE_ID"
  fi
done

if [ -n "$HOME_ID" ]; then
  echo "▶ Setting page_on_front to ID=$HOME_ID"
  wp option update show_on_front page --allow-root >/dev/null
  wp option update page_on_front "$HOME_ID" --allow-root >/dev/null
fi

echo "✅ Astra pages applied for brand=${BRAND}"


