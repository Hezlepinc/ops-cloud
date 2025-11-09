import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Topbar() {
  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-zinc-100 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/60 backdrop-blur">
      <div className="flex items-center gap-3">
        <Link href="/" className="inline-flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-8 w-8 dark:hidden" />
          <img src="/logo-dark.png" alt="Logo" className="h-8 w-8 hidden dark:inline" />
          <span className="sr-only">Home</span>
        </Link>
        <nav className="hidden md:flex items-center gap-3 text-sm">
          <Link href="/" className="app-btn-ghost">Home</Link>
          <Link href="/maps" className="app-btn-ghost">System Map</Link>
          <Link href="/environments" className="app-btn-ghost">Environments</Link>
          <Link href="/pages" className="app-btn-ghost">Pages</Link>
          <Link href="/seo" className="app-btn-ghost">SEO</Link>
          <Link href="/settings" className="app-btn-ghost">Settings</Link>
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}


