# Hezlep Operations Playbook

Centralized daily, weekly, and monthly procedures for the Hezlep Ops Orchestrator and supporting AI systems.
Use this file each morning before development begins.

## 🧭 Overview

| Environment          | URL                                    |
| -------------------- | -------------------------------------- |
| Staging Orchestrator | https://ops-orchestrator.onrender.com  |
| Future Production    | https://ops.hezlepinc.com              |
| GitHub Repo          | https://github.com/Hezlepinc/ops-cloud |
| Cloudways Dashboard  | https://platform.cloudways.com         |
| WordPress (Sparky)   | https://staging.sparky-hq.com          |
| WordPress (Hezlep)   | https://staging.hezlepinc.com          |

## 🗓️ Daily Routine

### 🔹 1. Pre-Dev-Day Sync (inside Cursor)

Run once before coding:

- Cursor command palette: `pre-dev-day sync` (or `daily` alias), or
- Terminal: `npm run daily`

Outputs

- Orchestrator status JSON
- WordPress connection test
- Local Git branch info

### 🔹 2. Orchestrator Health Check

```powershell
curl.exe -H "x-api-key:$env:OPENAI_API_KEY" https://ops-orchestrator.onrender.com/ai/status
```

If you need a live refresh:

```powershell
curl.exe -H "x-api-key:$env:OPENAI_API_KEY" "https://ops-orchestrator.onrender.com/ai/status?forceRefresh=true"
```

Use forceRefresh sparingly to avoid Cloudways rate limits.

### 🔹 3. Prompt-Driven Updates (GPT-5)

In ChatGPT → Hezlep Ops Assistant, try:

- Check orchestrator health and list any Cloudways errors.
- Deploy latest commit to staging.
- Restart PHP if necessary.

### 🔹 4. Deploy or Purge (manual approval)

```powershell
# Deploy staging
curl -X POST -H "x-api-key:$env:OPENAI_API_KEY" -H "Content-Type: application/json" `
     -d '{\"app_id\":12345}' https://ops-orchestrator.onrender.com/ai/cloudways/deploy

# Purge cache
curl -X POST -H "x-api-key:$env:OPENAI_API_KEY" -H "Content-Type: application/json" `
     -d '{\"app_id\":12345}' https://ops-orchestrator.onrender.com/ai/cloudways/purge

# Restart PHP
curl -X POST -H "x-api-key:$env:OPENAI_API_KEY" -H "Content-Type: application/json" `
     -d '{\"server_id\":67890}' https://ops-orchestrator.onrender.com/ai/cloudways/restart
```

### 🔹 5. Verify WordPress / Elementor

```powershell
curl -H "x-api-key:$env:OPENAI_API_KEY" https://ops-orchestrator.onrender.com/ai/wordpress/sparky-hq
curl -H "x-api-key:$env:OPENAI_API_KEY" https://ops-orchestrator.onrender.com/ai/elementor/sparky-hq
```

## 📅 Weekly Routine

| Task                   | Command / Prompt                                                        | Purpose                       |
| ---------------------- | ----------------------------------------------------------------------- | ----------------------------- |
| Render Deploy Check    | Review Render logs → last build successful                              | Ensure orchestrator uptime    |
| GitHub Alignment       | `git pull origin develop`                                               | Sync local + staging          |
| Cloudways Audit        | “Hezlep Ops Assistant, summarize Cloudways apps and flag any failures.” | Spot stale caches or errors   |
| WordPress Theme Review | GET `/ai/wordpress/{brand}`                                             | Confirm template kits applied |
| Documentation Touch-Up | Update this file + README links                                         | Keep commands current         |

## 🗓️ Monthly Maintenance

### Verify Environment Variables (Render)

- `OPENAI_API_KEY`
- `CW_EMAIL`
- `CW_API_KEY`
- `GITHUB_REPO`
- `GITHUB_TOKEN`

### Update Dependencies

```bash
cd orchestrator
npm outdated
npm update
git commit -am "Monthly dependency refresh"
git push origin develop
```

### Review Audit Log

```powershell
curl -H "x-api-key:$env:OPENAI_API_KEY" https://ops-orchestrator.onrender.com/ai/audit
```

### Validate GPT-5 Actions

Open ChatGPT → Hezlep Ops Assistant → Actions tab

Confirm all endpoints still pass tests.

## 💬 GPT-5 Prompt Examples

| Intent             | Example                                                     |
| ------------------ | ----------------------------------------------------------- |
| Check orchestrator | “Hezlep Ops Assistant, show current orchestrator status.”   |
| Force refresh      | “Refresh live Cloudways data.”                              |
| Deploy             | “Deploy latest code to staging.”                            |
| Restart            | “Restart PHP on the staging server.”                        |
| Purge cache        | “Clear cache for Sparky-HQ.”                                |
| Summarize          | “Summarize current system health and suggest next actions.” |
| Verify templates   | “Check Elementor kits for Sparky and Hezlep.”               |

## 🧰 Troubleshooting Quick List

| Issue                          | Fix                                                                            |
| ------------------------------ | ------------------------------------------------------------------------------ |
| Unauthorized                   | Key mismatch — confirm `OPENAI_API_KEY` in Render and GPT Authorization header |
| You have reached Cloudways API | Wait 1–2 min; use cached mode; reduce refresh frequency                        |
| Git commit unknown             | Add `GITHUB_TOKEN` + `GITHUB_REPO` to Render env                               |
| 500 Internal Server Error      | Check Render logs → likely missing env var or JSON parse error                 |
| GPT-5 not calling API          | Re-upload `openapi.yaml` in GPT → Actions tab                                  |

## 🔒 Best Practices

- Stay Prompt-Driven in Staging. Always approve GPT-5’s deploy suggestions before it acts.
- Use Cache Mode Daily. Force refresh only for post-deploy validation.
- Limit Merge Frequency. Promote to main after full week stability.
- Keep Keys Synchronized. The same `OPENAI_API_KEY` must exist in Render, Cursor, and ChatGPT.
- Record Major Actions. Append entries to `/ai/audit` after deploys for traceability.

## 🧭 Quick Navigation

| Doc                  | Description                          |
| -------------------- | ------------------------------------ |
| README.md            | Overview & project setup             |
| docs/DEV_CYCLE.md    | This playbook (daily/weekly/monthly) |
| docs/orchestrator.md | API and architecture details         |
| docs/roadmap.md      | Long-term development plan           |

## ✅ End-Goal

By following this playbook you keep:

- AI (GPT-5, Cursor) and infrastructure (Cloudways, WordPress, GitHub) in sync.
- Every day starts with one command: `> pre-dev-day sync`.
- Every deploy is tracked, auditable, and approved by you.
