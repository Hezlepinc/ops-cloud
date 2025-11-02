#!/usr/bin/env bash
# Usage: ./infra/wordpress/bin/check-plugins.sh <expected-csv>
# Example expected list: elementor,elementor-pro,breeze,seo-by-rank-math,wp-mail-smtp
set -euo pipefail

EXPECT_CSV="${1:-}"
if [ -z "$EXPECT_CSV" ]; then
  echo "Expected CSV of plugin slugs required (e.g., elementor,elementor-pro,breeze)" >&2
  exit 2
fi

IFS=',' read -r -a EXPECT <<< "$EXPECT_CSV"
ACTIVE=( $(wp plugin list --status=active --field=name --allow-root) )

missing=()
for slug in "${EXPECT[@]}"; do
  found=false
  for a in "${ACTIVE[@]}"; do
    if [ "$a" = "$slug" ]; then found=true; break; fi
  done
  if [ "$found" = false ]; then missing+=("$slug"); fi
done

if [ ${#missing[@]} -gt 0 ]; then
  echo "Missing required plugins: ${missing[*]}" >&2
  exit 1
fi

echo "All required plugins active."


