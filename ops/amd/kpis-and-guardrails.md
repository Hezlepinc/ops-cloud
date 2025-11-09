---
title: KPIs & Guardrails
version: 1.0
---

# KPI Set

- Deployment Lead Time (DLT): p50/p95 from commit/command → prod.
- WP Change Latency: content/layout changes p50 time to visible.
- Automated Eval Coverage: % of checks (routes, forms, schema.org, SEO) passing.
- Availability: Orchestrator uptime (SLO 99.95%).
- Error Budget: monthly minutes of downtime allowed; gates new features when exhausted.
- Rollback Rate: rollbacks per month.
- Cost per Site per Month: hosting + LLM + CDN.
- MRR from Orchestrator SaaS (if externalized).

# Guardrails

- Change classes: content (auto), layout (review if large delta), structural/plugins (mandatory approval).
- Policy checks: no destructive ops without satisfying dependency tests and backup snapshots.
- SEO health gate: block deploy if Core Web Vitals degrade >10% or indexation warnings spike.


