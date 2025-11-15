# Orchestrator API Reference

**Base URL:** https://ops-orchestrator.onrender.com  
**Auth:** Header `x-api-key: $OPENAI_API_KEY`

## Endpoints
- `GET /ai/status` - Cached Cloudways + GitHub status (`?forceRefresh=true` bypasses cache)
- `GET /ai/live` - Merged cached snapshot
- `GET /ai/metrics` - Cache metrics
- `GET /ai/wordpress/:brand` - WordPress health
- `GET /ai/elementor/:brand` - Elementor kits
- `POST /ai/cloudways/:action` - deploy | purge | restart
- `GET /ai/test/openai` - GPT-5 status summary
- `GET/POST /ai/audit` - read/append audit entries
- `GET /ai/suggestions/daily` - AI suggestions feed

## Environment
- `OPENAI_API_KEY` (required)
- `CW_EMAIL`, `CW_API_KEY` (optional; enables Cloudways live)
- `GITHUB_REPO`, `GITHUB_TOKEN` (optional; enables GitHub)

**Notes:** Cloudways OAuth cached ~55min, servers/apps cached 10min, `/ai/status` is cache-first.

**See:** [04_DEPLOYMENT.md](04_DEPLOYMENT.md) for deployment details.
