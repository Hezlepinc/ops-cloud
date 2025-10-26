#!/bin/bash
set -e

echo "Activating Hello Child theme and clearing cache..."

# Activate Hello Child theme
wp theme activate hello-child --allow-root

# Clear cache if using Cloudways Breeze
if wp plugin is-active breeze --allow-root; then
  wp breeze clear_all_cache --allow-root
fi

echo "✅ Deployment complete!"


