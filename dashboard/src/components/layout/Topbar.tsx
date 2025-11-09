import ThemeToggle from "./ThemeToggle";

export default function Topbar() {
  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-zinc-100 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/60 backdrop-blur">
      <div className="flex items-center gap-3 md:hidden">
        <img src="/logo.svg" alt="Logo" className="h-7 w-auto" />
      </div>
      <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
        <span className="hidden sm:inline">Environment:</span>
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200">
          Local Dev
        </span>
        <span className="hidden sm:inline">• Build:</span>
        <span className="px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800">dev</span>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}


