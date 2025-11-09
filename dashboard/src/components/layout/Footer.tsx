import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70">
      {/* Quick links row */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-3">
        <nav className="flex flex-wrap gap-2">
          <Link href="/maps" className="app-btn">Open System Map</Link>
          <Link href="/maps" className="app-btn-ghost">Environments & Pages</Link>
          <Link href="/seo" className="app-btn-ghost">SEO (Coming Soon)</Link>
          <Link href="/settings" className="app-btn-ghost">Social Media (Coming Soon)</Link>
        </nav>
      </div>
      {/* Copyright row */}
      <div className="h-10 flex items-center justify-center text-xs text-zinc-500 dark:text-zinc-400">
        © 2025 Hezlep Inc. All rights reserved • Ops Cloud v0.1
      </div>
    </footer>
  );
}


