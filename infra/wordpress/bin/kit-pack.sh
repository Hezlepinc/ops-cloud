#!/usr/bin/env bash
# Usage: infra/wordpress/bin/kit-pack.sh <src-dir> <output-zip>
# Example: infra/wordpress/bin/kit-pack.sh infra/wordpress/brands/hezlep-inc/elementor/src infra/wordpress/brands/hezlep-inc/elementor/hezlep_template.zip
set -euo pipefail

SRC_DIR="${1:-}"; OUT_ZIP="${2:-}"
if [[ -z "${SRC_DIR}" || -z "${OUT_ZIP}" ]]; then
  echo "Usage: kit-pack.sh <src-dir> <output-zip>" >&2
  exit 2
fi
if [[ ! -d "${SRC_DIR}" ]]; then
  echo "Source dir not found: ${SRC_DIR}" >&2
  exit 1
fi
mkdir -p "$(dirname "${OUT_ZIP}")"
pushd "${SRC_DIR}" >/dev/null
zip -r -q "${OUT_ZIP}" .
popd >/dev/null
echo "Packed kit -> ${OUT_ZIP}"


