import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("ops-theme") : null;
    const isDark = saved ? saved === "dark" : typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", isDark);
    setDark(isDark);
  }, []);
  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("ops-theme", next ? "dark" : "light");
    setDark(next);
  };
  return (
    <button onClick={toggle} className="app-btn-ghost" aria-label="Toggle theme">
      {dark ? "🌙" : "☀️"} <span className="hidden md:inline">{dark ? "Dark" : "Light"}</span>
    </button>
  );
}


