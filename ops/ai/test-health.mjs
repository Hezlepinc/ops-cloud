// --- ops/ai/test-health.mjs ---
// Quick health check script for local development
// Uses native fetch (Node 18+)

async function check(label, url, headers = {}) {
  try {
    const start = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(url, { headers, signal: controller.signal });
    clearTimeout(timeoutId);

    const json = await res.json();
    const latency = Date.now() - start;
    const ok = json.ok !== false && res.ok;
    console.log(`✅ ${label}: OK (${latency}ms)`, ok ? '' : JSON.stringify(json).slice(0, 100));
    return { ok, latency, data: json };
  } catch (err) {
    console.log(`❌ ${label}: FAIL`, err.message);
    return { ok: false, error: err.message };
  }
}

console.log('=== Health Check ===\n');

// Read orchestrator API key from .env if present
let apiKey = null;
try {
  const fs = await import('fs');
  const path = await import('path');
  const { fileURLToPath } = await import('url');
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const envPath = path.resolve(__dirname, '../../orchestrator/.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const match = content.match(/ORCHESTRATOR_API_KEY\s*=\s*(.+)/);
    if (match) apiKey = match[1].trim();
  }
} catch {}

const orchHeaders = apiKey ? { 'x-api-key': apiKey } : {};

await check('Orchestrator', 'http://localhost:3000/healthz', orchHeaders);
await check('Dashboard Status', 'http://localhost:5120/api/ai/status');

console.log('\n=== Done ===');

