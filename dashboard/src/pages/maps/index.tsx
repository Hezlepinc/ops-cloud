import { useState } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import MapViewer from "../../components/MapViewer";
import EnvTree from "../../components/EnvTree";
import PageGrid from "../../components/PageGrid";
import HistoryTimeline from "../../components/HistoryTimeline";

export default function MapsDashboard() {
  const [tab, setTab] = useState<"architecture" | "environments" | "pages" | "history">("architecture");
  return (
    <AppShell>
      <div style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600 }}>Ops-Cloud Project Maps</h1>
        <Link href="/" style={{ padding: "6px 10px", border: "1px solid #e5e7eb", borderRadius: 6, background: "#f9fafb" }}>Home</Link>
      </div>
      <div style={{ display: "inline-flex", gap: 8, marginBottom: 16 }}>
        <button onClick={() => setTab("architecture")} style={{ padding: "6px 10px", background: tab==="architecture"?"#eef":"#f5f5f5" }}>Architecture</button>
        <button onClick={() => setTab("environments")} style={{ padding: "6px 10px", background: tab==="environments"?"#eef":"#f5f5f5" }}>Environments</button>
        <button onClick={() => setTab("pages")} style={{ padding: "6px 10px", background: tab==="pages"?"#eef":"#f5f5f5" }}>Pages</button>
        <button onClick={() => setTab("history")} style={{ padding: "6px 10px", background: tab==="history"?"#eef":"#f5f5f5" }}>History</button>
      </div>
      {tab === "architecture" && <MapViewer />}
      {tab === "environments" && <EnvTree />}
      {tab === "pages" && <PageGrid />}
      {tab === "history" && <HistoryTimeline />}
      </div>
    </AppShell>
  );
}


