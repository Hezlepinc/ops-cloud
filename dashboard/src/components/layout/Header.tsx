import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const navItems = [
    { name: "Home", href: "/" },
    { name: "Maps", href: "/maps" },
    { name: "Clients", href: "/clients" },
    { name: "SEO", href: "/seo" },
    { name: "Analytics", href: "/analytics" },
    { name: "Orchestrator", href: "/orchestrator" },
    { name: "Settings", href: "/settings" }
  ];

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="h-16 flex items-center justify-between px-6 bg-white dark:bg-zinc-950">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Ops Cloud Logo" className="h-8 w-auto dark:hidden" />
          <img src="/logo-dark.png" alt="Ops Cloud Logo" className="h-8 w-auto hidden dark:block" />
          <span className="font-semibold text-lg text-zinc-700 dark:text-zinc-200">Ops Cloud</span>
        </div>
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
          {navItems.map((n) => (
            <Link key={n.href} href={n.href} className="text-zinc-700 dark:text-zinc-300 hover:text-brand">
              {n.name}
            </Link>
          ))}
        </nav>
        <ThemeToggle />
      </div>
      <div className="h-2 bg-brand"></div>
    </header>
  );
}


