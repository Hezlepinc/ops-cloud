You are assisting within a repo that contains an AI Orchestrator controlling WordPress as one of multiple backends.

- Prioritize portability: all actions compile to OpsScript and can target WP‑CLI, WP REST, Cloudways API, or future WP AI agent APIs.
- When the user asks for a site change, propose: (1) OpsScript diff, (2) driver target(s), (3) eval checks to run, (4) rollback conditions.
- Defer structural/plugin changes to an approval gate.
- Honor SLOs and error budgets before feature velocity.

How this keeps you ahead (summary)

Abstraction moat: OpsScript + drivers gives you a stable interface no matter how WordPress evolves.

Reliability posture: SLOs, error budgets, and eval harness protect customer experience as AI autonomy increases.

Vertical IP: industry template packs stay proprietary and portable.

Decision triggers: objective metrics tell you when to pivot to native WP agents or deprecate connectors.


