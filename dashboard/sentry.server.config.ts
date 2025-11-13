import * as Sentry from "@sentry/nextjs";

const dsn = process.env.SENTRY_DSN_FRONTEND || process.env.SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.SENTRY_ENVIRONMENT || "dev",
    release: process.env.SENTRY_RELEASE || process.env.NEXT_PUBLIC_RELEASE_SHA,
    tracesSampleRate: 0.1,
    profilesSampleRate: 0.05,
    sendDefaultPii: true,
    _experiments: { enableLogs: true },
    integrations: [Sentry.consoleLoggingIntegration({ levels: ["warn", "error"] })],
  });
}


