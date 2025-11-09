---
title: 2025Q4 — Stay-Ahead Initialization
owner: john
status: in-progress
priority: high
tags: [ops, orchestrator, wp, cloudways, reliability]
---

## Outcomes

- OpsScript v0.1 implemented with WP‑CLI and Cloudways drivers.
- CI pipeline with dry‑run + approval for structural changes.
- Basic eval harness (routes, forms, schema.org).
- Dashboard panels for DLT, change latency, eval pass rate.

## Tasks

- [ ] Define OpsScript schema & JSON Schema validation.
- [ ] Build `drivers/wp_cli` + `drivers/cloudways`.
- [ ] CI templates: dry‑run, plan, apply; Slack notifications.
- [ ] Eval harness: 20 core checks; store results per deployment.
- [ ] Dashboards: latency, errors, pass rate; set SLOs.
- [ ] Template pack v1 (Electrician/Generator).
- [ ] Approvals: require human approval for plugin/theme structural ops.
- [ ] Backups: automatic pre‑deploy snapshot + 1‑click rollback.


