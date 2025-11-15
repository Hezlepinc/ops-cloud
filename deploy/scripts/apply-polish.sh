#!/usr/bin/env bash
set -euo pipefail

# Expects per-site env in the CI job:
# CLOUDWAYS_HOST, CLOUDWAYS_USER, APP_ROOT
# Also expects brand to be passed as argument or env var

BRAND="${1:-${BRAND:-}}"
if [ -z "$BRAND" ]; then
    echo "Usage: $0 <brand> or set BRAND env var"
    echo "Brands: hezlep, sparky"
    exit 1
fi

# Map brand names
if [ "$BRAND" = "hezlep-inc" ] || [ "$BRAND" = "hezlepinc" ]; then
    BRAND="hezlep"
elif [ "$BRAND" = "sparky-hq" ]; then
    BRAND="sparky"
fi

if [ "$BRAND" != "hezlep" ] && [ "$BRAND" != "sparky" ]; then
    echo "Invalid brand: $BRAND (expected: hezlep or sparky)"
    exit 1
fi

HOST="${CLOUDWAYS_HOST}"
USER="${CLOUDWAYS_USER}"
ROOT="${APP_ROOT}"
KEY_FILE="${HOME}/.ssh/id_rsa"

echo "==> Sync theme/MU/brands ($BRAND)"
rsync -az --delete -e "ssh -i ${KEY_FILE} -o StrictHostKeyChecking=no" \
    infra/wordpress/themes/ops-astra-child/ \
    "${USER}@${HOST}:${ROOT}/wp-content/themes/ops-astra-child/"

rsync -az --delete -e "ssh -i ${KEY_FILE} -o StrictHostKeyChecking=no" \
    infra/wordpress/mu-plugins/ \
    "${USER}@${HOST}:${ROOT}/wp-content/mu-plugins/"

rsync -az --delete -e "ssh -i ${KEY_FILE} -o StrictHostKeyChecking=no" \
    infra/wordpress/ops/brands/ \
    "${USER}@${HOST}:${ROOT}/wp-content/ops/brands/"

rsync -az --delete -e "ssh -i ${KEY_FILE} -o StrictHostKeyChecking=no" \
    deploy/wp-cli/ \
    "${USER}@${HOST}:${ROOT}/deploy/wp-cli/"

echo "==> Activate Astra child ($BRAND)"
ssh -i "${KEY_FILE}" -o StrictHostKeyChecking=no "${USER}@${HOST}" "cd ${ROOT} && \
    (wp theme is-installed astra --allow-root || wp theme install astra --allow-root) && \
    wp theme activate ops-astra-child --allow-root"

echo "==> Ensure pages/menus/home ($BRAND)"
ssh -i "${KEY_FILE}" -o StrictHostKeyChecking=no "${USER}@${HOST}" \
    "cd ${ROOT} && wp eval-file deploy/wp-cli/polish_setup.php ${BRAND} --allow-root"

echo "==> Polish applied successfully for $BRAND"
