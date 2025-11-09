# Orchestrator Roadmap (Phases 3 → 7)

- [x] Phase 3 – GPT‑5 + Cursor Integration
  - `/ai/test/openai` added; GPT‑5 summary; Cursor command
- [x] Phase 4 – Cloudways Actions
  - `/ai/cloudways/:action` for deploy/purge/restart; Cursor command
- [x] Phase 5 – WordPress / Elementor Insight
  - `/ai/wordpress/:brand`, `/ai/elementor/:brand` live
- [x] Phase 6 – Monitoring & Alerts (base)
  - Cache/throttle, `/ai/live`, `/ai/metrics`, `/ai/audit` added
  - [ ] Optional: Slack/webhook alerts
- [ ] Phase 7 – Docs & DX
  - [x] `docs/orchestrator.md` and OpenAPI spec
  - [ ] Expand README and add developer onboarding

## Remaining TODOs

1) Add Slack/webhook notifier for errors in `/ai/status` (Phase 6 optional)
2) Expand root `README.md` with new routes and Render URL (Phase 7)
3) Provide allowlist/guardrails for `/ai/cloudways/:action` (optional hardening)
4) Add Cursor commands for metrics/audit (see below) (Phase 7 convenience)

## Suggested Cursor Commands

```json
{
  "name": "get metrics",
  "run": ["curl -s -H 'x-api-key:$OPENAI_API_KEY' https://ops-orchestrator.onrender.com/ai/metrics | jq"]
},
{
  "name": "append audit event",
  "run": ["curl -s -X POST -H 'x-api-key:$OPENAI_API_KEY' -H 'Content-Type: application/json' -d '{\"event\":\"hourly_health\",\"data\":{}}' https://ops-orchestrator.onrender.com/ai/audit | jq"]
},
{
  "name": "read audit log",
  "run": ["curl -s -H 'x-api-key:$OPENAI_API_KEY' https://ops-orchestrator.onrender.com/ai/audit | jq"]
}
```

# ⚡️ Tech Websites Ops Cloud – Full Implementation Roadmap

### (Sparky-HQ Pilot → Marketing Site → Trades & Service Packages)

---

## 🧭 Overview

**Program codename:** Tech Websites Ops Cloud  
**Goal:** Create a repeatable pipeline to design, deploy, and operate WordPress sites with AI assistance.

**Initial Sites**

1. **Sparky-HQ** – Hobby/test ground providing trade knowledge.
2. **Main Marketing Site** – (Business name TBD) markets website, SEO, social, and automation services for small/medium service businesses.

**Later Layers**

- Current status (staging):
  - Hello Child theme in repo and deploying via Actions
  - Matrix deploy for `sparky` and `hezlepinc` using per-site APP_ROOT secrets
  - Post-deploy script activates theme; cache clearing tolerant
  - SSH tests and host key management in CI

- Trades & Services support (consulting, automation)
- SaaS integration with SoloStack, LaunchPad, ArchitectCore, etc.

---

## ⚙️ Architecture

### Repositories

| Repo            | Purpose                               |
| --------------- | ------------------------------------- |
| `ops-cloud`     | WordPress themes, CI/CD, automations  |
| `saas-monorepo` | APIs, calculators, CRM connectors     |
| `brand-assets`  | Logos, color tokens, social templates |

**Integration Model:** Hybrid Linked Repos  
Each repo runs its own pipeline. The SaaS emits dispatch events to trigger WordPress rebuilds when widgets or APIs change.
