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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
        <div className="flex gap-3 flex-wrap justify-center">
          <Link href="/maps" className="app-btn">Open System Map</Link>
          <Link href="/maps" className="app-btn-ghost">Environments & Pages</Link>
          <Link href="/seo" className="app-btn-ghost">SEO (Coming Soon)</Link>
          <Link href="/settings" className="app-btn-ghost">Social Media (Coming Soon)</Link>
        </div>
      </div>
    </AppShell>
  );
}


