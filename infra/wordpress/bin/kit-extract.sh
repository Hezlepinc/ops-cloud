#!/usr/bin/env bash
# Usage: infra/wordpress/bin/kit-extract.sh <kit-zip> <dest-dir>
# Example: infra/wordpress/bin/kit-extract.sh infra/wordpress/brands/hezlep-inc/elementor/hezlep_template.zip infra/wordpress/brands/hezlep-inc/elementor/src
set -euo pipefail

KIT_ZIP="${1:-}"; DEST_DIR="${2:-}"
if [[ -z "${KIT_ZIP}" || -z "${DEST_DIR}" ]]; then
  echo "Usage: kit-extract.sh <kit-zip> <dest-dir>" >&2
  exit 2
fi
if [[ ! -f "${KIT_ZIP}" ]]; then
  echo "Kit zip not found: ${KIT_ZIP}" >&2
  exit 1
fi
mkdir -p "${DEST_DIR}"
unzip -o -q "${KIT_ZIP}" -d "${DEST_DIR}"
echo "Extracted to ${DEST_DIR}"


