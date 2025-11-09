import Link from "next/link";
import AppShell from "@/components/layout/AppShell";

export default function Home() {
  return (
    <AppShell>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold">Ops Cloud</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Unified operations for sites, deployments, and optimization.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="app-card p-4">
            <div className="text-xs text-zinc-500">Active Sites</div>
            <div className="text-2xl font-semibold mt-1">2</div>
            <div className="text-xs text-zinc-500 mt-2">Sparky-HQ, Hezlep Inc</div>
          </div>
          <div className="app-card p-4">
            <div className="text-xs text-zinc-500">Last Deploy</div>
            <div className="text-2xl font-semibold mt-1">staging • ok</div>
            <div className="text-xs text-zinc-500 mt-2">Render logs clean</div>
          </div>
          <div className="app-card p-4">
            <div className="text-xs text-zinc-500">WP Health</div>
            <div className="text-2xl font-semibold mt-1">stable</div>
            <div className="text-xs text-zinc-500 mt-2">No critical issues</div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link href="/maps" className="app-card p-4 hover:shadow-lg transition">
            <div className="text-sm font-semibold mb-1">Open System Map</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">Architecture and live flow</div>
          </Link>
          <Link href="/maps" className="app-card p-4 hover:shadow-lg transition">
            <div className="text-sm font-semibold mb-1">Environments & Pages</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">WP inventory and links</div>
          </Link>
          <Link href="/seo" className="app-card p-4 hover:shadow-lg transition">
            <div className="text-sm font-semibold mb-1">SEO (Coming Soon)</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">GA4, CWV, indexing</div>
          </Link>
          <Link href="/settings" className="app-card p-4 hover:shadow-lg transition">
            <div className="text-sm font-semibold mb-1">Social Media (Coming Soon)</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">Channels & cadence</div>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}


