# Cursor Guide

**Turn Cursor into ops console with commands mapped to Orchestrator.**

## Setup
1. Copy `.cursor/cursor.env.sample` → `.cursor/cursor.env`
2. Edit env file: `OPENAI_API_KEY`, `ORCHESTRATOR_URL`, `GITHUB_TOKEN`

## Commands (Command Palette)
- `daily` → runs `.cursor/scripts/daily.sh` (status + WP + git)
- `status` → one-shot `/ai/status` snapshot
- `daily suggestions` → `/ai/suggestions/daily`
- `deploy staging` → `.cursor/scripts/deploy-staging.sh <brand> staging`
- `update docs` → pulls latest docs and rebuilds bundles

## Scripts
- `.cursor/scripts/daily.sh` - Loads env, calls orchestrator endpoints
- `.cursor/scripts/deploy-staging.sh` - Triggers Orchestrator deploy
- `.cursor/scripts/update-docs.sh` - Pulls and builds GPT bundle

**Tips:** Keep secrets in `.cursor/cursor.env` (git-ignored), use "pre-dev-day sync" each morning.

**See:** [02_DEV_CYCLE.md](02_DEV_CYCLE.md) for daily workflow.
