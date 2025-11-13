#!/bin/bash
# Test deployment script - Proof of Life
# Usage: ./test-deployment.sh [sparky|hezlepinc|all]

set -e

ORCH_URL="${ORCHESTRATOR_URL:-https://ops-orchestrator.onrender.com}"
API_KEY="${ORCHESTRATOR_API_KEY:-}"

if [ -z "$API_KEY" ]; then
  echo "❌ Error: ORCHESTRATOR_API_KEY environment variable not set"
  echo "   Set it with: export ORCHESTRATOR_API_KEY=your_key"
  exit 1
fi

BRAND="${1:-all}"
ENV="${2:-staging}"

echo "🚀 Testing Template Deployment"
echo "================================"
echo "Orchestrator: $ORCH_URL"
echo "Brand: $BRAND"
echo "Environment: $ENV"
echo ""

if [ "$BRAND" = "all" ]; then
  echo "📦 Deploying all brands to $ENV..."
  curl -X POST \
    -H "x-api-key: $API_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"environment\": \"$ENV\"}" \
    "$ORCH_URL/ai/deploy/all" | jq '.'
else
  echo "📦 Deploying $BRAND to $ENV..."
  curl -X POST \
    -H "x-api-key: $API_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"brand\": \"$BRAND\", \"environment\": \"$ENV\"}" \
    "$ORCH_URL/ai/deploy" | jq '.'
fi

echo ""
echo "✅ Deployment triggered!"
echo "📊 Check GitHub Actions: https://github.com/Hezlepinc/ops-cloud/actions"
echo "🌐 Check sites:"
echo "   - Sparky: https://staging.sparky-hq.com"
echo "   - Hezlep: https://staging.hezlepinc.com"

