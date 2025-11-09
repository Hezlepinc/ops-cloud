# Orchestrator — API & Environment

Endpoints (x-api-key):
- GET /ai/status — Cached Cloudways + GitHub status (`?forceRefresh=true` to bypass cache)
- GET /ai/live — Merged cached snapshot
- GET /ai/metrics — Cache metrics
- GET /ai/wordpress/:brand — WordPress health
- GET /ai/elementor/:brand — Elementor kits
- POST /ai/cloudways/:action — deploy | purge | restart
- GET /ai/test/openai — GPT‑5 status summary
- GET/POST /ai/audit — read/append audit entries
- GET /ai/suggestions/daily — AI suggestions feed

Base URL: https://ops-orchestrator.onrender.com  
Header: x-api-key: $OPENAI_API_KEY

Environment:
- OPENAI_API_KEY (required)
- CW_EMAIL, CW_API_KEY (optional; enables Cloudways live)
- GITHUB_REPO, GITHUB_TOKEN (optional; enables GitHub)

Notes:
- Cloudways OAuth token cached ~55 minutes
- Servers/apps cached on disk 10 minutes (/tmp)
- /ai/status is cache-first to avoid rate limits


