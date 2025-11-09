import AppShell from "@/components/layout/AppShell";
export default function Analytics() {
  return (
    <AppShell>
      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
          <h1 className="text-xl font-semibold">Analytics</h1>
          <p className="text-sm text-zinc-500">Stock demo metrics until GA4 wiring lands.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="app-card p-4">
            <div className="text-xs text-zinc-500">Traffic (7d)</div>
            <div className="text-2xl font-semibold mt-1">4,210</div>
            <div className="text-xs text-zinc-500 mt-2">+12% WoW</div>
          </div>
          <div className="app-card p-4">
            <div className="text-xs text-zinc-500">Conversions (7d)</div>
            <div className="text-2xl font-semibold mt-1">126</div>
            <div className="text-xs text-zinc-500 mt-2">Leads & contact forms</div>
          </div>
          <div className="app-card p-4">
            <div className="text-xs text-zinc-500">Avg LCP</div>
            <div className="text-2xl font-semibold mt-1">2.3s</div>
            <div className="text-xs text-zinc-500 mt-2">Core Web Vitals</div>
          </div>
          <div className="app-card p-4">
            <div className="text-xs text-zinc-500">Uptime (30d)</div>
            <div className="text-2xl font-semibold mt-1">99.95%</div>
            <div className="text-xs text-zinc-500 mt-2">Monitored endpoints</div>
          </div>
        </div>
        <section className="app-card p-6">
          <h2 className="text-lg font-semibold mb-2">Notes</h2>
          <p className="text-sm text-zinc-500">
            When connected, this page will load GA4 and CWV summaries per site and trend charts.
          </p>
        </section>
      </div>
    </AppShell>
  );
}


