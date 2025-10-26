#!/bin/bash
set -e

echo "Activating Hello Child theme and clearing cache..."

# Ensure Hello Elementor parent is installed
if ! wp theme is-installed hello-elementor --allow-root; then
  wp theme install hello-elementor --allow-root
fi

# Activate Hello Child theme
wp theme activate hello-child --allow-root

# Clear cache if using Cloudways Breeze (try multiple commands, don't fail)
if wp plugin is-active breeze --allow-root; then
  wp breeze purge --all --allow-root || \
  wp breeze purge --allow-root || \
  wp breeze clear --allow-root || \
  wp cache flush --allow-root || true
else
  wp cache flush --allow-root || true
fi

echo "✅ Deployment complete!"


