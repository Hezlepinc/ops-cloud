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

  echo "▶ Syncing page slug=$slug title=\"$title\" from $file"

  # Extract basic HTML content from JSON (concatenate innerHTML fields).
  CONTENT="$(php -r '
    $path = $argv[1] ?? null;
    if (!$path || !file_exists($path)) { exit(0); }
    $data = json_decode(file_get_contents($path), true);
    if (!is_array($data) || empty($data["blocks"])) { exit(0); }
    $out = "";
    foreach ($data["blocks"] as $b) {
      if (!empty($b["innerHTML"])) {
        $out .= $b["innerHTML"] . "\n\n";
      }
    }
    echo $out;
  ' "$file")"

  # Fallback content if JSON has no innerHTML
  if [ -z "$CONTENT" ]; then
    CONTENT="<h1>${title}</h1>\n<p>This is a placeholder page for ${BRAND} (${slug}).</p>"
  fi

  # Write content to a temp file so wp-cli can read it safely (avoids issues with
  # special characters/newlines being interpreted as file paths).
  TMP_FILE="$(mktemp)"
  printf '%b\n' "$CONTENT" > "$TMP_FILE"

  PAGE_ID="$(get_page_id "$slug")"

  if [ -n "$PAGE_ID" ]; then
    wp post update "$PAGE_ID" \
      --post_title="$title" \
      --post_content="@$TMP_FILE" \
      --allow-root >/dev/null
  else
    PAGE_ID="$(wp post create \
      --post_type=page \
      --post_status=publish \
      --post_name="$slug" \
      --post_title="$title" \
      --post_content="@$TMP_FILE" \
      --porcelain \
      --allow-root)"
  fi

  rm -f "$TMP_FILE"

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


