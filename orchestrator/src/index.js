// --- Load envs early (explicitly support .env.local for dev) ---
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Prefer .env.local if present; fallback to .env
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localEnvPath = path.resolve(__dirname, '../.env.local');
const baseEnvPath = path.resolve(__dirname, '../.env');

if (fs.existsSync(localEnvPath)) {
  dotenv.config({ path: localEnvPath });
  console.log('✅ Loaded .env.local');
} else {
  dotenv.config({ path: baseEnvPath });
  console.log('✅ Loaded .env');
}

// --- Compute Git SHA for version/release ---
try {
  if (!process.env.SENTRY_RELEASE || process.env.SENTRY_RELEASE.includes('git rev-parse')) {
    const shortSha = execSync('git rev-parse --short HEAD').toString().trim();
    process.env.SENTRY_RELEASE = shortSha;
    console.log('🧩 Computed SENTRY_RELEASE:', shortSha);
  }
} catch {
  console.warn('⚠️  Could not compute Git SHA for SENTRY_RELEASE');
}

// --- Imports ---
import express from 'express';
import cors from 'cors';

import statusRoute from './routes/status.js';
import deployRoute from './routes/deploy.js';
import wordpressRoute from './routes/wordpress.js';
import liveRoute from './routes/live.js';
import elementorRoute from './routes/elementor.js';
import testOpenAI from './routes/testOpenAI.js';
import cloudwaysActions from './routes/cloudwaysActions.js';
import metricsRoute from './routes/metrics.js';
import auditRoute from './routes/audit.js';
import githubActionRoute from './routes/githubAction.js';
import suggestionsRoute from './routes/suggestions.js';
import auth from './middleware/auth.js';
import { syncCloudways } from './jobs/syncCloudways.js';
import { syncGitHub } from './jobs/syncGitHub.js';

import { getOpenAI } from './integrations/openai.js';
import * as Sentry from '@sentry/node';

// --- Initialize Sentry ---
if (process.env.SENTRY_DSN_ORCHESTRATOR) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN_ORCHESTRATOR,
    environment: process.env.SENTRY_ENVIRONMENT || 'dev',
    release: process.env.SENTRY_RELEASE,
    tracesSampleRate: 0.05,
    sendDefaultPii: true,
  });
  console.log('✅ Sentry initialized');
} else {
  console.warn('⚠️  Sentry DSN not found; skipping Sentry initialization');
}

// --- Express setup ---
const app = express();
app.use(cors());
app.use(express.json());

// Attach Sentry handlers early
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// --- Root route ---
app.get('/', (req, res) => res.send('Ops Orchestrator API Running ✅'));

// --- Auth-protected AI routes ---
app.use('/ai', auth);

// --- Simple request logger ---
try {
  const logsDir = path.resolve(__dirname, '../logs');
  fs.mkdirSync(logsDir, { recursive: true });
  const logFile = path.join(logsDir, 'orchestrator.log');

  const log = (msg) => {
    try {
      fs.appendFileSync(logFile, `${new Date().toISOString()} ${msg}\n`);
    } catch {}
  };

  app.use((req, _res, next) => {
    log(`${req.method} ${req.url}`);
    next();
  });
} catch {}

// --- Routes ---
app.use('/ai/status', statusRoute);
app.use('/ai/deploy', deployRoute);
app.use('/ai/wordpress', wordpressRoute);
app.use('/ai/live', liveRoute);
app.use('/ai/elementor', elementorRoute);
app.use('/ai/test/openai', testOpenAI);
app.use('/ai/cloudways', cloudwaysActions);
app.use('/ai/metrics', metricsRoute);
app.use('/ai/audit', auditRoute);
app.use('/ai/github', githubActionRoute);
app.use('/ai/suggestions', suggestionsRoute);

// --- Health check ---
app.get('/healthz', (req, res) => {
  try {
    const apiKey = req.header('x-api-key');
    const expected = process.env.ORCHESTRATOR_API_KEY;
    if (!expected || apiKey !== expected) {
      return res.status(401).json({ ok: false, reason: 'unauthorized' });
    }
    return res.json({
      ok: true,
      version: process.env.SENTRY_RELEASE || 'dev',
      uptime_s: Math.floor(process.uptime()),
    });
  } catch (e) {
    Sentry.captureException(e);
    return res.status(500).json({ ok: false, reason: e.message });
  }
});

// --- Sentry error handler (must be last) ---
app.use(Sentry.Handlers.errorHandler());

// --- Start server ---
console.log("=== ORCHESTRATOR SERVER: starting ===");
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("=== ORCHESTRATOR SERVER: boot complete, waiting for requests ===");
  console.log(`✅ Orchestrator listening on port ${PORT}`);
});

// --- Background sync jobs ---
setInterval(syncCloudways, 1000 * 60 * 10); // every 10 minutes
setInterval(syncGitHub, 1000 * 60 * 5); // every 5 minutes

// --- Optional: Safe OpenAI model check ---
(async () => {
  try {
    const oc = getOpenAI();
    const list = await oc.models.list();
    const anyModel = (list?.data || []).find((m) => String(m?.id || '').includes('gpt-'));
    console.log('🔹 OpenAI connected:', anyModel?.id || 'no models listed');
  } catch (err) {
    console.warn('⚠️  OpenAI model check skipped/failed:', err.message);
  }
})();
