## Cursor Setup — OpsCloud Orchestrator Integration

This guide wires Cursor to your Orchestrator for daily checks, deployments, and insights.

### 1) Prereqs

- Orchestrator deployed (Render): `https://ops-orchestrator.onrender.com`
- Orchestrator `OPENAI_API_KEY` set (used as `x-api-key` guard)
- In Cursor terminal: export your API key for commands

```bash
export OPENAI_API_KEY=sk-...   # same value as orchestrator's OPENAI_API_KEY
```

Optional overrides:

```bash
export ORCHESTRATOR_URL=https://ops-orchestrator.onrender.com
```

### 2) Commands

Open `.cursor/commands.json` — already populated with:

- `show live ops`, `check orchestrator status`, `get metrics`
- `check wordpress health`, `check elementor kits`
- `deploy staging` (GitHub dispatch via orchestrator)
- `pre-dev-day sync`, `daily`
- `daily suggestions` (AI improvement ideas)

Run from Cursor’s Command Palette:

- “pre-dev-day sync” or “daily” for a quick morning snapshot
- “daily suggestions” to get 3–5 improvement ideas

### 3) Daily Flow

1. Run “daily” (status + WP health + last commit)
2. Run “daily suggestions” (AI actionables)
3. If needed, “deploy staging”
4. Log any decisions via “append audit event”

### 4) Security Notes

- All `/ai/*` endpoints require `x-api-key` which is the same value as `OPENAI_API_KEY` in Render.
- The dashboard reads static JSON from `dashboard/public/maps/*`; a GitHub Action writes these files using secrets (no secrets in the browser).

### 5) Optional Customization

- Change orchestrator base URL in commands: replace the default with `$ORCHESTRATOR_URL`
- Add more commands to `.cursor/commands.json` as needed

### 6) Troubleshooting

- 401 Unauthorized: ensure `OPENAI_API_KEY` matches Render’s value
- Cloudways rate-limit: `/ai/status` is cache-first; use `?forceRefresh=true` only when necessary
- Dashboard “Connections” empty: wait for the scheduled “Auto Update Maps” workflow to run or trigger it via GitHub Actions → Workflows → “Auto Update Maps” → Run


