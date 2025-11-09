import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import MapViewer from "../../components/MapViewer";
import EnvTree from "../../components/EnvTree";
import PageGrid from "../../components/PageGrid";
import HistoryTimeline from "../../components/HistoryTimeline";

export default function MapsDashboard() {
  const [tab, setTab] = useState<"architecture" | "environments" | "pages" | "history">("architecture");
  return (
    <AppShell>
      <div className="max-w-6xl mx-auto">
        <div className="mb-3">
          <h1 className="text-2xl font-semibold">Ops-Cloud Project Maps</h1>
        </div>
        <div className="inline-flex gap-2 mb-4">
          <button onClick={() => setTab("architecture")} className={`app-btn-ghost ${tab==="architecture" ? "bg-zinc-100 dark:bg-zinc-800" : ""}`}>Architecture</button>
          <button onClick={() => setTab("environments")} className={`app-btn-ghost ${tab==="environments" ? "bg-zinc-100 dark:bg-zinc-800" : ""}`}>Environments</button>
          <button onClick={() => setTab("pages")} className={`app-btn-ghost ${tab==="pages" ? "bg-zinc-100 dark:bg-zinc-800" : ""}`}>Pages</button>
          <button onClick={() => setTab("history")} className={`app-btn-ghost ${tab==="history" ? "bg-zinc-100 dark:bg-zinc-800" : ""}`}>History</button>
        </div>
      {tab === "architecture" && <MapViewer />}
      {tab === "environments" && <EnvTree />}
      {tab === "pages" && <PageGrid />}
      {tab === "history" && <HistoryTimeline />}
      </div>
    </AppShell>
  );
}


