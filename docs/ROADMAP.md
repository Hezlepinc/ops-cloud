# Ops Cloud - Master Roadmaps

**Last Updated:** 2025-01-09 | **Status:** Active Development

## 1️⃣ Astra Client Site Deployment (Multi-Brand)
**Goal:** Ship repeatable Astra + Gutenberg deployment pipeline for multiple brands.

**Completed:** ✅ Orchestrator online, Astra child theme scaffolded, design scripts added, brand tokens created, pattern assembly working, pages deploying.

**In Progress:** ⚠️ Menu automation, media handling, content merge strategy.

**Next:** Expand sitemap support, add WP-CLI page creation, document brand onboarding.

## 2️⃣ Orchestrator & Dashboard Health
**Goal:** Reliable health status across Orchestrator, GitHub, OpenAI.

**Completed:** ✅ Status API, healthz endpoint, Sentry initialized.

**In Progress:** ⚠️ Fix dashboard status probe (hanging), standardize status interfaces.

## 3️⃣ Observability & Alerts
**Goal:** Make failures obvious and traceable.

**In Progress:** ⚠️ Add Sentry to dashboard, request logging, log breadcrumbs.

## 4️⃣ CI/CD & Environment Governance
**Goal:** Safe promotion dev → staging → main with guardrails.

**Planned:** Complete CI/CD setup, consolidate environment variables.

## 5️⃣ AI-Assisted Design & Content
**Goal:** AI-generated design/content that stays deterministic and Git-friendly.

**Planned:** Define brand spec format, teach AI to output tokens/patterns, extend buildpages.mjs.

**See:** [AUTOMATION_REVIEW.md](AUTOMATION_REVIEW.md) for full automation status.
