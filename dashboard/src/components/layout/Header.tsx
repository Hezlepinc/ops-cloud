import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="relative z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="h-16 px-4 md:px-6 flex items-center justify-between">
        {/* Left: Logo + primary nav with Home first */}
        <div className="flex items-center gap-4">
          {/* Only one logo shown depending on theme; reduced size by ~50% (h-4) */}
          <img src="/logo.png" alt="Hezlep Logo" className="h-4 w-auto dark:hidden" />
          <img src="/logo-dark.png" alt="Hezlep Logo (dark)" className="h-4 w-auto hidden dark:block" />
          <nav className="flex items-center gap-3 text-sm font-medium">
            <Link href="/" className="text-zinc-700 dark:text-zinc-200 hover:text-brand">Home</Link>
            <Link href="/maps" className="text-zinc-700 dark:text-zinc-200 hover:text-brand">Maps</Link>
            <Link href="/clients" className="text-zinc-700 dark:text-zinc-200 hover:text-brand">Clients</Link>
            <Link href="/pages" className="text-zinc-700 dark:text-zinc-200 hover:text-brand">Pages</Link>
            <Link href="/seo" className="text-zinc-700 dark:text-zinc-200 hover:text-brand">SEO</Link>
            <Link href="/orchestrator" className="text-zinc-700 dark:text-zinc-200 hover:text-brand">Orchestrator</Link>
            <Link href="/settings" className="text-zinc-700 dark:text-zinc-200 hover:text-brand">Settings</Link>
          </nav>
        </div>
        {/* Right: Theme toggle */}
        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </div>
      <div className="h-2 bg-brand" />
    </header>
  );
}


