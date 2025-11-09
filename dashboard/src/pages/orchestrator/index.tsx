import AppShell from "@/components/layout/AppShell";
export default function Orchestrator() {
  return (
    <AppShell>
      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
          <h1 className="text-xl font-semibold">Orchestrator</h1>
          <p className="text-sm text-zinc-500">Stock demo state until live status wiring lands.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="app-card">
            <div className="app-card-header">Jobs Queued</div>
            <div className="app-card-body">
              <div className="text-2xl font-semibold">3</div>
              <div className="text-xs text-zinc-500 mt-2">deploy • purge • metrics</div>
            </div>
          </div>
          <div className="app-card">
            <div className="app-card-header">Cloudways API</div>
            <div className="app-card-body">
              <div className="text-2xl font-semibold">healthy</div>
              <div className="text-xs text-zinc-500 mt-2">cache-first mode</div>
            </div>
          </div>
          <div className="app-card">
            <div className="app-card-header">GitHub Runs (24h)</div>
            <div className="app-card-body">
              <div className="text-2xl font-semibold">5</div>
              <div className="text-xs text-zinc-500 mt-2">0 failed</div>
            </div>
          </div>
          <div className="app-card">
            <div className="app-card-header">AI Suggestion</div>
            <div className="app-card-body">
              <div className="text-sm">Enable slack webhook alerts for /ai/status errors.</div>
            </div>
          </div>
        </div>
        <section className="app-card p-6">
          <h2 className="text-lg font-semibold mb-2">Notes</h2>
          <p className="text-sm text-zinc-500">
            This page will surface live orchestrator metrics, cache state, and the AI suggestion feed.
          </p>
        </section>
      </div>
    </AppShell>
  );
}


