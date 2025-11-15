# Observability (Sentry + Logging)

**Standardized error tracking and logging for Dashboard and Orchestrator.**

## Environment Variables
- `SENTRY_DSN_FRONTEND` (dashboard) / `SENTRY_DSN_ORCHESTRATOR` (orchestrator)
- `SENTRY_ENVIRONMENT` = dev | staging | prod
- `SENTRY_RELEASE` = app@version+`<shortSHA>`

## Dashboard (Next.js)
Files: `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`  
Config: DSN, environment, release, tracesSampleRate: 0.1, profilesSampleRate: 0.05

## Orchestrator (Node/Express)
Files: `src/sentry.js`, imported in `src/index.js`  
Config: DSN, environment, release, tracesSampleRate: 0.05

## Usage
```ts
import { withSpan, logger } from "@/lib/sentry";
withSpan("ui.click", "Deploy Site", () => {
  logger.info("Deploy clicked", { branch: "staging" });
});
```

**CI:** Inject `SENTRY_RELEASE` as short commit SHA.
