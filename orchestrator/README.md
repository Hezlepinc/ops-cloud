Ops Orchestrator

Local development

1) From repo root:

cd orchestrator
npm install
npm run dev

2) Environment variables:

PORT=3000
CW_EMAIL=...
CW_API_KEY=...
GITHUB_REPO=YourOrg/ops-cloud
GITHUB_TOKEN=ghp_xxx
AI_KEY=supersecretkey

3) Endpoints:

- GET / -> health
- GET /ai/status -> Cloudways servers/apps + GitHub branch status (requires x-api-key)
- POST /ai/deploy { brand, environment } -> trigger repo dispatch (requires x-api-key)
- GET /ai/wordpress/:brand -> basic WP REST health for brand (requires x-api-key)
- GET /ai/live -> merged cached Cloudways + GitHub snapshot (requires x-api-key)
- GET /ai/elementor/:brand -> Elementor kit list via WP REST (requires x-api-key)

Deploy

- Push changes under orchestrator/ to trigger .github/workflows/deploy-orchestrator.yml or deploy via your platform (Render/Vercel). 

