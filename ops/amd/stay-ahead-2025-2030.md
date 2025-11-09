---
title: Stay-Ahead Technology Plan (2025–2030)
owner: john
version: 1.0
last_review: 2025-11-09
targets:
  - orchestrator_mrr
  - deployment_lead_time
  - wp-change-latency
  - automated-coverage
assumptions:
  - WordPress adds progressively richer AI assistants for block/theme generation and in-place edits.
  - Multi-agent orchestration, eval harnesses, and guardrails become standard for production AI by 2027.
  - Hosting/API surfaces (Cloudways, WP-CLI, REST, GraphQL) remain available and scriptable.
north_star: "Operate an AI orchestration layer where WordPress is one programmable node; win on cross-system automation, reliability, and industry templates."
---

# 0. Strategy

**Playbook:** Use WordPress’ AI features as a generator, not the product. Our moat is orchestration, governance, integration, and vertical templates (electric trades, local services networks, affiliate content networks).

**Design rule:** All site operations compile to a portable command schema (see “OpsScript” below) that can target WP-CLI, WP REST, Cloudways API, or future native WP‑AI agents.

---

# 1. Capability Roadmap (2025 → 2030)

## 2025 (Q4)
- OpsScript v0.1 (portable op schema):
  - `ops.site.create`, `ops.site.clone`, `ops.theme.apply`, `ops.blocks.patch`, `ops.seo.configure`, `ops.crm.connect`, `ops.analytics.attach`
- Pipeline: Prompt → Git commit (site spec) → CI → Cloudways deploy → Post‑deploy checks.
- Observability: per‑site health (uptime, Core Web Vitals, SEO indexation, lead flow).
- Guardrails: basic evals (smoke tests for routes, forms, schema.org).

## 2026
- WP AI ↔ Orchestrator bridge: translate natural language → OpsScript → WP action. Round‑trip diffs back to Git.
- Multi‑tenant blue/green: parallel environments; <30m rollback SLA.
- Vertical template packs v1: Electrician, Generator, Solar; content+block kits versioned in Git.
- Auto‑quoting integration: CRM/Estimator GPT in release flow; data contracts formalized.
- Cost governance: per‑site cost budget with alerts (hosting, LLM tokens, CDN).

## 2027
- Self‑healing deployments: drift detection; auto‑reapply spec if WP admin edits diverge from Git.
- Agent governance: approvals for risky changes (NLP classifiers + policy).
- Graph data layer: customer/offers/locale graph feeding templated content generation.
- Perf SLOs: 95th pctl TTFB and LCP thresholds enforced per deployment; block BI for offenders.

## 2028
- Native WP AI orchestration (when available): adapter targets WordPress’ internal agent endpoints directly.
- Realtime change latency: prompt→prod ≤ 5 min for content; ≤ 30 min for layout/theme.
- Market exp: multi‑brand/region expansions automated; affiliate network pack v1.

## 2029–2030
- Cross‑platform parity: OpsScript targets WP, headless WP+Next, and alt CMS via drivers.
- Compliance-grade audit: immutable audit trail, change justification, and policy binding.
- Reliability: 99.95% orchestrator uptime; deployment lead time p50 < 10 min.

---

# 2. Architecture Notes

- OpsScript (IR): YAML/JSON intermediate representation of operations. Example:

```yaml
kind: ops.batch
version: v1
spec:
  - op: ops.site.create
    with: { brand: "Lenhart", region: "TX-Dallas", template: "electrician@v1.4" }
  - op: ops.theme.apply
    with: { slug: "lenhart-pro", variant: "generator-focus" }
  - op: ops.blocks.patch
    with:
      target: "home.hero"
      change: "replace"
      payload:
        heading: "Whole‑Home Generators Installed Right"
        cta: { text: "Get a Quote", href: "/quote" }
```

Drivers: drivers/wp_cli, drivers/wp_rest, drivers/wp_ai (future), drivers/cloudways.

GitOps: site spec and OpsScript live in repo; CI runs runners with dry‑run + approval gates.

Eval harness: pre‑merge and post‑deploy verifications (routes, forms, schema.org, SEO basics).

---

# 3. KPIs & Decision Triggers (see /ops/amd/kpis-and-guardrails.md)

WP change latency (content/layout): p50 ≤ 15m (2026), ≤ 5m (2028).

Deployment lead time: p50 ≤ 20m (2026), ≤ 10m (2029).

Automated coverage (eval cases passing): ≥ 85% (2026), ≥ 95% (2028).

Rollbacks/mo: ≤ 2 (2026), ≤ 1 (2028).

MTTR: ≤ 30m (2026), ≤ 10m (2029).

Triggers:
- If native WP AI exposes a stable agent API with >90% of our needed actions → shift default driver to wp_ai, keep wp_cli as fallback.
- If our eval fail rate >5% for 2 weeks → freeze new features; prioritize reliability sprint.

---

# 4. Investment Themes (2025–2030)

- Portability first: never couple to a single WP AI vendor path.
- Template IP: domain‑specific packs (electric trades) kept private; marketing content publicized to build authority.
- Observability: treat site fleet like services: SLOs, dashboards, error budgets.
- Policy & safety: require approvals for destructive ops; model guardrails for content claims.
- Cost curves: continuously benchmark LLM/provider cost/quality; support at least one open‑model path.

---

# 5. Risks (linked to /ops/amd/risk-register.md)

- WP AI API volatility → mitigate with driver abstraction + contract tests.
- Cloudways API limits → maintain alternative deployment path (containerized WP / Render / other).
- Hallucinated destructive ops → policy checks + human‑in‑the‑loop for structural changes.
- SEO regressions from AI edits → SEO evals + synthetic traffic checks pre‑prod.

---

# 6. Review Cadence

- Monthly: KPI review + reliability budget.
- Quarterly: architecture review, driver benchmarks, template pack releases.
- Annual: re‑baseline against market capabilities; retire bespoke work where commodity wins.


