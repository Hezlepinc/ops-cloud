#!/usr/bin/env bash
set -euo pipefail

SITE_NAME=
DOMAIN=
ADMIN_EMAIL=
PLUGINS=

wp option update blogname ""
wp option update siteurl "http://"
wp option update home "http://"
wp user update 1 --user_email=""
for p in ; do
  wp plugin activate "" || true
done
