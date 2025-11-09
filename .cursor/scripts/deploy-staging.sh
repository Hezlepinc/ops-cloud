#!/usr/bin/env bash
set -euo pipefail

if [ -f ".cursor/cursor.env" ]; then
  # shellcheck disable=SC1091
  source ".cursor/cursor.env"
fi

ORCH_URL="${ORCHESTRATOR_URL:-https://ops-orchestrator.onrender.com}"
BRAND="${1:-sparky-hq}"
ENVIRONMENT="${2:-staging}"

if [ -z "${OPENAI_API_KEY:-}" ]; then
  echo "Missing OPENAI_API_KEY in .cursor/cursor.env (required for x-api-key)."
  exit 1
fi

echo "Triggering deploy: brand=${BRAND}, env=${ENVIRONMENT}"
curl -sS -X POST \
  -H "x-api-key:${OPENAI_API_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"brand\":\"${BRAND}\",\"environment\":\"${ENVIRONMENT}\"}" \
  "${ORCH_URL}/ai/deploy" | jq .


