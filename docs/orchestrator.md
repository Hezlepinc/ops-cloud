# Ops Orchestrator

## Endpoints

- `GET /ai/status` (x-api-key): Cached Cloudways + GitHub status. Optional `?forceRefresh=true`.
- `GET /ai/live` (x-api-key): Merged cached snapshot.
- `GET /ai/metrics` (x-api-key): Cache metrics.
- `GET /ai/wordpress/:brand` (x-api-key): WP REST health (brand: `sparky-hq` | `hezlep-inc`).
- `GET /ai/elementor/:brand` (x-api-key): Elementor kits listing.
- `POST /ai/cloudways/:action` (x-api-key): `deploy` | `purge` | `restart`.
- `GET /ai/test/openai` (x-api-key): GPT‑5 summary of orchestrator snapshot.
- `GET/POST /ai/audit` (x-api-key): read/append audit entries.

Base URL (Render): `https://ops-orchestrator.onrender.com`

Headers: `x-api-key: $OPENAI_API_KEY`

## Environment

- `OPENAI_API_KEY` (required)
- `CW_EMAIL`, `CW_API_KEY` (optional; needed for Cloudways API)
- `GITHUB_REPO`, `GITHUB_TOKEN` (optional; enables GitHub section)

## Usage

```bash
curl -s -H "x-api-key: $OPENAI_API_KEY" https://ops-orchestrator.onrender.com/ai/status | jq
```

GPT‑5 test:

```bash
curl -s -H "x-api-key: $OPENAI_API_KEY" https://ops-orchestrator.onrender.com/ai/test/openai | jq
```

Cloudways action (example purge; replace `app_id`):

```bash
curl -s -X POST -H "x-api-key: $OPENAI_API_KEY" -H "Content-Type: application/json" \
  -d '{"app_id":12345}' https://ops-orchestrator.onrender.com/ai/cloudways/purge | jq
```

## Notes

- Cloudways token cached in memory for ~55 minutes.
- Cloudways servers/apps cached on disk for 10 minutes under `/tmp`.
- `/ai/status` is cache‑first to avoid rate limits; use `?forceRefresh=true` sparingly.


