#!/usr/bin/env bash
set -euo pipefail

echo "== Pull latest docs =="
git pull --rebase || true

echo "== Build GPT docs bundle (if present) =="
if [ -f "scripts/docs/build-gpt-bundle.js" ]; then
  node scripts/docs/build-gpt-bundle.js || true
fi

echo "== Docs files changed =="
git status --porcelain docs/ || true

echo "Done."


