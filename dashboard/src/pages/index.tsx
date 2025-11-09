import Link from "next/link";
import AppShell from "@/components/layout/AppShell";

export default function Home() {
  return (
    <AppShell>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold mb-3">Ops-Cloud Dashboard</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
          Welcome. Use these quick links to navigate key areas.
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link href="/maps" className="app-btn">Open Architecture Maps</Link>
          <Link href="/maps" className="app-btn-ghost">Environments & Pages</Link>
          <Link href="/seo" className="app-btn-ghost">SEO (Coming Soon)</Link>
          <Link href="/settings" className="app-btn-ghost">Social Media (Coming Soon)</Link>
        </div>
      </div>
    </AppShell>
  );
}


