# Observability (Sentry + Structured Logging + Tracing)

This document standardizes how the Dashboard (Next.js) and Orchestrator (Node) emit errors, traces, and logs.

## Environment

Set in each service:

- `SENTRY_DSN_FRONTEND` (dashboard) / `SENTRY_DSN_ORCHESTRATOR` (orchestrator)
- `SENTRY_ENVIRONMENT` = dev | staging | prod
- `SENTRY_RELEASE` = app@version+`<shortSHA>` (CI can set `$(git rev-parse --short HEAD)`)

## Dashboard (Next.js)

Files:
- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `sentry.edge.config.ts`
- `src/lib/sentry.ts`

Key config (client/server/edge):
```ts
import * as Sentry from "@sentry/nextjs";
Sentry.init({
  dsn: process.env.SENTRY_DSN_FRONTEND,
  environment: process.env.SENTRY_ENVIRONMENT,
  release: process.env.SENTRY_RELEASE,
  tracesSampleRate: 0.1,
  profilesSampleRate: 0.05,
  sendDefaultPii: true,
  _experiments: { enableLogs: true },
  integrations: [Sentry.consoleLoggingIntegration({ levels: ["log","warn","error"] })],
});
```

Usage helpers:
```ts
import { withSpan, logger } from "@/lib/sentry";
withSpan("ui.click", "Deploy Site", () => {
  logger.info("Deploy clicked", { branch: "staging" });
});
```

## Orchestrator (Node/Express)

Files:
- `src/sentry.js`
- `src/index.js` (imports `./sentry.js` very early)

Key config:
```js
import * as Sentry from "@sentry/node";
Sentry.init({
  dsn: process.env.SENTRY_DSN_ORCHESTRATOR,
  environment: process.env.SENTRY_ENVIRONMENT,
  release: process.env.SENTRY_RELEASE,
  tracesSampleRate: 0.05,
  sendDefaultPii: true,
  _experiments: { enableLogs: true },
  integrations: [Sentry.consoleLoggingIntegration({ levels: ["warn","error"] })],
});
```

Example:
```js
import { Sentry, logger } from "./sentry.js";
app.get("/healthz", (req, res) => {
  try {
    logger.debug("healthz", { ip: req.ip });
    res.json({ ok: true });
  } catch (err) {
    Sentry.captureException(err);
    logger.error("healthz failed", { error: String(err?.message || err) });
    res.status(500).end();
  }
});
```

## CI Notes
- Inject `SENTRY_RELEASE` as the short commit SHA (or `app@version+sha`).
- Keep `tracesSampleRate` low in prod (0.02–0.1); raise temporarily to debug performance issues.


