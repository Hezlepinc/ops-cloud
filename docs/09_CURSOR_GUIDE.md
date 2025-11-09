## Cursor Guide

Turn Cursor into your ops console with commands mapped to the Orchestrator.

### Setup

1) Copy env sample:

```bash
cp .cursor/cursor.env.sample .cursor/cursor.env
```

2) Edit `.cursor/cursor.env`:

```
OPENAI_API_KEY=sk-...
ORCHESTRATOR_URL=https://ops-orchestrator.onrender.com
GITHUB_TOKEN=ghp_...
```

### Commands (Command Palette)

- daily → runs `.cursor/scripts/daily.sh` (status + WP + git)
- status → one-shot `/ai/status` snapshot
- daily suggestions → `/ai/suggestions/daily`
- deploy staging → `.cursor/scripts/deploy-staging.sh sparky-hq staging`
- update docs → pulls latest docs and rebuilds bundles

### Scripts

- `.cursor/scripts/daily.sh` loads `.cursor/cursor.env` and calls orchestrator endpoints
- `.cursor/scripts/deploy-staging.sh <brand> <env>` triggers Orchestrator deploy
- `.cursor/scripts/update-docs.sh` pulls and runs `scripts/docs/build-gpt-bundle.js` if present
- `.cursor/scripts/summarize-errors.js` prints quick connectivity and AI suggestion summaries

### Tips

- Keep secrets only in `.cursor/cursor.env` (git-ignored)
- If Render URL changes, update `ORCHESTRATOR_URL` in the env file
- Use “pre-dev-day sync” or “daily” each morning to warm caches and spot drift


