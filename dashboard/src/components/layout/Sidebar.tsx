import Link from "next/link";
import { useRouter } from "next/router";

const NAV = [
  { href: "/maps", label: "System Map" },
  { href: "/environments", label: "Environments" },
  { href: "/pages", label: "Pages" },
  { href: "/seo", label: "SEO" },
  { href: "/settings", label: "Settings" }
];

export default function Sidebar() {
  const { pathname } = useRouter();
  return (
    <aside className="hidden md:flex md:flex-col w-60 border-r border-zinc-100 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/60 backdrop-blur">
      <div className="h-16 px-4 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800">
        <img src="/logo.png" alt="Logo" className="h-7 w-auto dark:hidden" />
        <img src="/logo-dark.png" alt="Logo" className="h-7 w-auto hidden dark:inline" />
      </div>
      <nav className="p-3 space-y-1">
        {NAV.map(({ href, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`block px-3 py-2 rounded-lg text-sm ${
                active
                  ? "bg-brand text-white"
                  : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto p-3 text-xs text-zinc-500 dark:text-zinc-400">
        v0.1 • Hezlep OpsCloud
      </div>
    </aside>
  );
}


