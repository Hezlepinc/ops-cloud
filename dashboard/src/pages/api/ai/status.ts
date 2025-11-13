import type { NextApiRequest, NextApiResponse } from 'next';

type ProbeStatus = 'ok' | 'fail' | 'timeout';
type Probe = { status: ProbeStatus; latency_ms?: number; last_error?: string };
type StatusPayload = {
  updatedAt: string;
  overall: 'ok' | 'degraded' | 'down';
  probes: {
    orchestrator: Probe;
    github: Probe;
    openai: Probe;
  };
};

const TIMEOUT_MS = Number(process.env.OPENAI_REQUEST_TIMEOUT_MS ?? 2000);

// Utility: timeout wrapper with logging
const timeout = (promise: Promise<any>, ms = TIMEOUT_MS, label: string) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => {
        console.log(`status: ${label} probe timeout after ${ms}ms`);
        reject(new Error('timeout'));
      }, ms),
    ),
  ]);
};

async function timed<T>(
  fn: () => Promise<T>,
  label: string,
): Promise<[T | null, number, Error | null]> {
  const start = Date.now();
  console.log(`status: start ${label} probe`);
  try {
    const out = await fn();
    const latency = Date.now() - start;
    console.log(`status: end ${label} probe (${latency}ms)`);
    return [out, latency, null];
  } catch (e: any) {
    const latency = Date.now() - start;
    console.log(`status: ${label} probe failed (${latency}ms):`, e?.message || e);
    return [null, latency, e];
  }
}

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<StatusPayload | { error: string }>,
) {
  console.log('status: route entered');
  const O_URL = process.env.ORCHESTRATOR_BASE_URL || process.env.ORCHESTRATOR_URL;
  const O_KEY = process.env.ORCHESTRATOR_API_KEY;
  const GH_TOKEN = process.env.GITHUB_TOKEN;
  const GH_REPO = process.env.GITHUB_REPO;
  const OPENAI_KEY = process.env.OPENAI_API_KEY;
  const OPENAI_MODEL = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';

  const orchestratorProbe = (async (): Promise<Probe> => {
    if (!O_URL || !O_KEY) return { status: 'fail', last_error: 'orchestrator env missing' };
    const [_, latency, err] = await timed(async () => {
      const r = await timeout(
        fetch(`${O_URL.replace(/\/$/, '')}/healthz`, {
          headers: { 'x-api-key': O_KEY },
        }),
        TIMEOUT_MS,
        'orchestrator',
      );
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      await r.json().catch(() => ({}));
      return true as any;
    }, 'orchestrator');
    if (!err) return { status: 'ok', latency_ms: latency };
    if ((err as any).name === 'AbortError' || (err as any).message === 'timeout')
      return { status: 'timeout', latency_ms: latency, last_error: 'timeout' };
    return {
      status: 'fail',
      latency_ms: latency,
      last_error: String(err?.message ?? err),
    };
  })();

  const githubProbe = (async (): Promise<Probe> => {
    if (!GH_TOKEN || !GH_REPO) return { status: 'fail', last_error: 'github env missing' };
    const [owner, name] = GH_REPO.split('/');
    const [_, latency, err] = await timed(async () => {
      const r = await timeout(
        fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${GH_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query:
              'query($owner:String!,$name:String!){ repository(owner:$owner,name:$name){ id } }',
            variables: { owner, name },
          }),
        }),
        TIMEOUT_MS,
        'github',
      );
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      await r.json().catch(() => ({}));
      return true as any;
    }, 'github');
    if (!err) return { status: 'ok', latency_ms: latency };
    if ((err as any).name === 'AbortError' || (err as any).message === 'timeout')
      return { status: 'timeout', latency_ms: latency, last_error: 'timeout' };
    return {
      status: 'fail',
      latency_ms: latency,
      last_error: String(err?.message ?? err),
    };
  })();

  const openaiProbe = (async (): Promise<Probe> => {
    if (!OPENAI_KEY) return { status: 'fail', last_error: 'openai env missing' };
    const [_, latency, err] = await timed(async () => {
      const r = await timeout(
        fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${OPENAI_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: OPENAI_MODEL,
            messages: [{ role: 'user', content: 'ping' }],
            max_tokens: 1,
          }),
        }),
        TIMEOUT_MS,
        'openai',
      );
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      await r.json().catch(() => ({}));
      return true as any;
    }, 'openai');
    if (!err) return { status: 'ok', latency_ms: latency };
    if ((err as any).name === 'AbortError' || (err as any).message === 'timeout')
      return { status: 'timeout', latency_ms: latency, last_error: 'timeout' };
    return {
      status: 'fail',
      latency_ms: latency,
      last_error: String(err?.message ?? err),
    };
  })();

  const [o, gh, ai] = await Promise.all([orchestratorProbe, githubProbe, openaiProbe]);
  const failures = [o, gh, ai].filter((p) => p.status !== 'ok').length;
  const overall: StatusPayload['overall'] =
    failures === 0 ? 'ok' : failures === 1 ? 'degraded' : 'down';

  const payload: StatusPayload = {
    updatedAt: new Date().toISOString(),
    overall,
    probes: { orchestrator: o, github: gh, openai: ai },
  };

  console.log('status: route exit', { overall, failures });
  res.status(200).json(payload);
}
