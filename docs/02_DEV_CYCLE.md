# Daily Development Workflow

**Centralized daily/weekly/monthly procedures for Ops Cloud.**

## 🗓️ Daily Routine
1. **Health Check:** `node ops/ai/test-health.mjs` (checks Orchestrator, Dashboard, services)
2. **Pre-Dev Sync:** Cursor command `pre-dev-day sync` or `npm run daily`
3. **Orchestrator Check:** `curl -H "x-api-key:$OPENAI_API_KEY" https://ops-orchestrator.onrender.com/ai/status`
4. **Deploy/Purge:** Manual approval via Orchestrator endpoints

## 📅 Weekly Routine
- Review Render logs, sync Git (`git pull origin dev`), audit Cloudways apps, review WordPress themes

## 🗓️ Monthly Maintenance
- Verify environment variables (Render), update dependencies, review audit log, validate GPT-5 actions

## 💬 GPT-5 Prompts
- "Show orchestrator status" | "Deploy latest to staging" | "Restart PHP" | "Purge cache"

**See:** [03_ORCHESTRATOR.md](03_ORCHESTRATOR.md) for API details.
