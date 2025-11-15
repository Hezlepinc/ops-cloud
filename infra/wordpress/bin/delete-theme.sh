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

# Try WP-CLI delete first
if wp theme delete "$THEME_SLUG" --allow-root 2>/dev/null; then
  echo "✅ Theme deleted via WP-CLI"
else
  echo "⚠️  WP-CLI delete failed, attempting manual removal..."
  
  # Get WordPress root
  WP_ROOT="$(wp eval 'echo ABSPATH;' --allow-root 2>/dev/null || pwd)"
  THEME_DIR="$WP_ROOT/wp-content/themes/$THEME_SLUG"
  
  if [ -d "$THEME_DIR" ]; then
    echo "▶ Removing theme directory: $THEME_DIR"
    rm -rf "$THEME_DIR"
    
    if [ -d "$THEME_DIR" ]; then
      echo "❌ Failed to remove directory. You may need to delete manually via FTP/SSH:"
      echo "   rm -rf $THEME_DIR"
      exit 1
    else
      echo "✅ Theme directory removed manually"
    fi
  else
    echo "⚠️  Theme directory not found: $THEME_DIR"
  fi
fi

# Verify deletion
if wp theme is-installed "$THEME_SLUG" --allow-root >/dev/null 2>&1; then
  echo "❌ Theme still appears to be installed: $THEME_SLUG"
  echo "   You may need to delete manually via FTP/SSH"
  exit 1
else
  echo "✅ Successfully deleted theme: $THEME_SLUG"
fi

