# Ops Cloud - Master Roadmaps

**Last Updated:** 2025-01-09
**Status:** Active Development

This file is the single source of truth for all roadmaps. When work completes, update the roadmap here instead of creating new `.md` files.

---

## 1️⃣ Roadmap 1 – Astra Client Site Deployment (Multi-Brand)

**Goal:** Ship a repeatable Astra + Gutenberg website deployment pipeline for multiple client brands (different professions/industries) using a single codebase.

> **Migration Note:** System now supports hybrid file structures. New brands should use preferred structure (see [Brand Structure Alignment](BRAND_STRUCTURE_ALIGNMENT.md)). Full migration path documented for gradual transition.

### Completed

- [x] Orchestrator online and healthy (`/healthz` returns `{ ok: true }`)
- [x] Render environment consistent across deployments
- [x] Basic Cloudways deploy workflow proven (Hello Child + Elementor)
- [x] Astra child theme scaffolded: `infra/wordpress/themes/astra-child/`
- [x] Brand token files created for `hezlep-inc` and `sparky-hq`
- [x] Design scripts added:
  - [x] `scripts/design/generate-theme-json.mjs`
  - [x] `scripts/design/generate-cursor-css.mjs`
  - [x] `scripts/design/buildpages.mjs` (scaffold)

### In Progress

- [ ] **Hezlep Inc – Astra Staging Site**
  - [ ] Add Astra child theme to Cloudways deploy workflow (rsync + `wp theme activate astra-child`)
  - [ ] Create initial block templates (`block-templates/front-page.html`, `page.html`, etc.)
  - [ ] Create header/footer template parts (`block-template-parts/header.html`, `footer.html`)
  - [ ] Create brand patterns under `infra/wordpress/brands/hezlep-inc/patterns/` (hero, services, CTA)
  - [ ] Evolve `buildpages.mjs` to assemble a real Home page from patterns + placeholder copy
  - [ ] Wire a dedicated `deploy-wp-design` workflow for Hezlep staging using the design scripts

- [ ] **Sparky HQ – Astra Staging Site**
  - [ ] Add Sparky tokens and patterns
  - [ ] Reuse the same Astra child theme + design pipeline

### Next Steps

- [ ] Expand sitemap support (Home, Services, About, Contact, Blog) via `sitemap.json` per brand
- [ ] Support multiple industries by standardizing pattern names and page models
- [ ] Add WP-CLI commands in CI to create/update pages from generated content
- [ ] Document “How to onboard a new brand” in `docs/05_BRANDS_MAP.md`

**Success Criteria:**
- A PR to `staging` that touches `infra/wordpress/**` for a given brand regenerates tokens, theme.json, cursor.css, and page content, then deploys a working Astra-based staging site for that brand.

---

## 2️⃣ Roadmap 2 – Orchestrator & Dashboard Health

**Goal:** Reliable, observable health status across Orchestrator, GitHub, and OpenAI, surfaced in the dashboard.

### Completed

- [x] Status API implemented in dashboard (`/api/ai/status`)
- [x] Orchestrator `/healthz` endpoint implemented with API key auth
- [x] Sentry initialized and tied to commit hash for Orchestrator

### In Progress

- [ ] Fix Dashboard Status Probe (hanging `/api/ai/status`)
  - [ ] Add detailed logging around each probe (Orchestrator → GitHub → OpenAI)
  - [ ] Identify which probe is hanging
  - [ ] Patch the hanging probe
  - [ ] Add 5s timeout for each probe
  - [ ] Surface errors cleanly in dashboard UI

- [ ] Standardize Status Interfaces
  - [ ] Create shared `@hezlep/types/status` in `packages/`
  - [ ] Standardize shape of all health responses
  - [ ] Add proper error handling + 5s timeout for each probe

**Success Criteria:**
- Dashboard AI Status card always shows a timely, accurate health summary with clear error states.

---

## 3️⃣ Roadmap 3 – Observability & Alerts

**Goal:** Make failures obvious and traceable across Orchestrator, Dashboard, and WordPress.

### In Progress

- [ ] Add Sentry to dashboard
- [ ] Add request logging inside Orchestrator probes
- [ ] Add log breadcrumbs (e.g., “GitHub probe start → success/timeout”)
- [ ] Optional: Slack/webhook alerts for critical failures

**Success Criteria:**
- Errors show up in Sentry with enough context to debug quickly; optional Slack alerts for high‑severity issues.

---

## 4️⃣ Roadmap 4 – CI/CD & Environment Governance

**Goal:** Safe, predictable promotion from `dev` → `staging` → `main` with guardrails.

### Planned

- [ ] Complete CI/CD setup
  - [ ] GitHub Actions for `dev` → `staging` PRs (lint, typecheck, build)
  - [ ] Required status checks and branch protection rules

- [ ] Consolidate Environment Variables
  - [ ] Move all env keys into `packages/config/env.ts`
  - [ ] Define Orchestrator env schema
  - [ ] Define Dashboard env schema
  - [ ] Add safe defaults + validation
  - [ ] Remove deprecated legacy envs

**Success Criteria:**
- Every deploy is traceable to a commit and passes a consistent CI gate; env misconfigurations are rare and obvious.

---

## 5️⃣ Roadmap 5 – AI-Assisted Design & Content

**Goal:** Move from hand-built patterns to AI-generated design and content that stays deterministic and Git‑friendly.

### Planned

- [ ] Define brand spec + site spec format (`brand.json`, `sitemap.json`)
- [ ] Teach AI to output `design-tokens.json`, `sitemap.json`, and pattern copy
- [ ] Extend `buildpages.mjs` to assemble full block trees from patterns + AI copy
- [ ] Optionally add a CLI/Orchestrator endpoint to trigger “regenerate design” for a brand

**Success Criteria:**
- Given a structured brand brief, AI can generate a new site design that deploys through the Astra pipeline without manual markup edits.

---

## 6️⃣ Roadmap 6 – Dashboard UX & Insights

**Goal:** Dashboard becomes the single pane of glass for system status, deployments, and site health.

### Planned

- [ ] Real-time status dashboard
  - [ ] Live status updates
  - [ ] Historical status timeline

- [ ] Deployment management UI
  - [ ] Trigger design + infra deploys from the dashboard
  - [ ] View deployment history and logs

---

## 7️⃣ Roadmap 7 – Multi-Brand, Multi-Industry Library

**Goal:** Reusable design and content patterns that can be re-skinned for different professions and industries.

### Planned

- [ ] Define industry archetypes (e.g., trades, professional services, SaaS)
- [ ] Create shared pattern library per archetype
- [ ] Parameterize copy hooks so AI can localize for each brand

**Success Criteria:**
- Onboarding a new client in an existing industry is primarily a configuration + copy exercise, not a from-scratch design build.

---

## 8️⃣–🔟 Future Roadmaps (Placeholders)

- 8️⃣ Marketing automation & CRM integration
- 9️⃣ Analytics dashboards & KPIs (linking ops-cloud to ops/amd docs)
- 🔟 Self-service client portal for site management

## 📝 Documentation Status

### Active Documentation
- `docs/01_OVERVIEW.md` - Project overview
- `docs/02_DEV_CYCLE.md` - Daily development workflow
- `docs/03_ORCHESTRATOR.md` - Orchestrator API documentation
- `docs/04_DEPLOYMENT.md` - Deployment guide
- `docs/BRANCHING.md` - Git branching strategy
- `docs/observability.md` - Observability setup

### Template Instructions
- `docs/template-instructions/hezlep-inc.template.md` - Hezlep legacy Elementor template spec
- `docs/template-instructions/sparky-hq.template.md` - Sparky legacy Elementor template spec

> Note: New work should follow the Astra + Gutenberg pipeline described in `docs/TEMPLATE_BUILDER_DECISION.md`.

## 📊 Progress Tracking

### This Week
- [x] Template deployment proof of life
- [ ] Page cleanup and template application
- [ ] Dashboard status probe fix

### This Month
- [ ] Standardize status interfaces
- [ ] Consolidate environment variables
- [ ] Expand observability

### Next Month
- [ ] Auto-apply templates
- [ ] Dashboard enhancements
- [ ] Enhanced CI/CD

## 🔗 Related Documents

- [Deployment Guide](04_DEPLOYMENT.md)
- [Orchestrator API](03_ORCHESTRATOR.md)
- [Development Workflow](02_DEV_CYCLE.md)
- [Branching Strategy](BRANCHING.md)

