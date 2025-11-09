import Link from "next/link";

export default function Footer() {
  return (
    <footer className="h-10 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-xs text-zinc-500 dark:text-zinc-400 bg-white/80 dark:bg-zinc-900/70">
      © {new Date().getFullYear()} Hezlep Inc. All rights reserved • Ops Cloud v0.2
    </footer>
  );
}


