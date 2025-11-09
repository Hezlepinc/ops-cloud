#!/usr/bin/env bash
set -euo pipefail

# Load local secrets if present
if [ -f ".cursor/cursor.env" ]; then
  # shellcheck disable=SC1091
  source ".cursor/cursor.env"
fi

ORCH_URL="${ORCHESTRATOR_URL:-https://ops-orchestrator.onrender.com}"
API_KEY_HEADER=""
if [ -n "${OPENAI_API_KEY:-}" ]; then
  API_KEY_HEADER="-H x-api-key:${OPENAI_API_KEY}"
fi

echo "== Orchestrator status =="
curl -sS ${API_KEY_HEADER} "${ORCH_URL}/ai/status" | jq .
echo

echo "== WordPress (sparky-hq) =="
curl -sS ${API_KEY_HEADER} "${ORCH_URL}/ai/wordpress/sparky-hq" | jq .
echo

echo "== WordPress (hezlep-inc) =="
curl -sS ${API_KEY_HEADER} "${ORCH_URL}/ai/wordpress/hezlep-inc" | jq .
echo

echo "== Git status =="
git status -sb
echo "== Last commit =="
git log -1 --oneline
echo

echo "== Daily suggestions (if available) =="
set +e
curl -sS ${API_KEY_HEADER} "${ORCH_URL}/ai/suggestions/daily" | jq .
set -e


