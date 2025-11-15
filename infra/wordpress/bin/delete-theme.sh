#!/usr/bin/env bash
# Delete a WordPress theme by slug
# Usage: ./infra/wordpress/bin/delete-theme.sh <theme-slug>

set -euo pipefail

THEME_SLUG="${1:-}"
if [ -z "$THEME_SLUG" ]; then
  echo "❌ Theme slug required"
  echo "Usage: ./infra/wordpress/bin/delete-theme.sh <theme-slug>"
  exit 1
fi

echo "▶ Checking if theme '$THEME_SLUG' is installed..."
if ! wp theme is-installed "$THEME_SLUG" --allow-root >/dev/null 2>&1; then
  echo "⚠️  Theme '$THEME_SLUG' is not installed"
  exit 0
fi

# Check if theme is active
ACTIVE_THEME="$(wp theme list --status=active --field=name --allow-root 2>/dev/null | head -n1 || true)"
if [ "$ACTIVE_THEME" = "$THEME_SLUG" ]; then
  echo "❌ Cannot delete active theme: $THEME_SLUG"
  echo "   Please activate a different theme first"
  exit 1
fi

echo "▶ Deleting theme: $THEME_SLUG"
wp theme delete "$THEME_SLUG" --allow-root

if wp theme is-installed "$THEME_SLUG" --allow-root >/dev/null 2>&1; then
  echo "❌ Failed to delete theme: $THEME_SLUG"
  exit 1
else
  echo "✅ Successfully deleted theme: $THEME_SLUG"
fi

