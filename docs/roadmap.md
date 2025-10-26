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
