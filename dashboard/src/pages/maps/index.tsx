import { useState } from "react";
import MapViewer from "../../components/MapViewer";
import EnvTree from "../../components/EnvTree";
import PageGrid from "../../components/PageGrid";
import HistoryTimeline from "../../components/HistoryTimeline";
import ConnectionsView from "../../components/ConnectionsView";
import SEOPanel from "../../components/SEOPanel";
import SocialPanel from "../../components/SocialPanel";

export default function MapsDashboard() {
  const [tab, setTab] = useState<"architecture" | "environments" | "pages" | "history" | "connections" | "seo" | "social">("architecture");
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>Ops-Cloud Project Maps</h1>
      <div style={{ display: "inline-flex", gap: 8, marginBottom: 16 }}>
        <button onClick={() => setTab("architecture")} style={{ padding: "6px 10px", background: tab==="architecture"?"#eef":"#f5f5f5" }}>Architecture</button>
        <button onClick={() => setTab("environments")} style={{ padding: "6px 10px", background: tab==="environments"?"#eef":"#f5f5f5" }}>Environments</button>
        <button onClick={() => setTab("pages")} style={{ padding: "6px 10px", background: tab==="pages"?"#eef":"#f5f5f5" }}>Pages</button>
        <button onClick={() => setTab("history")} style={{ padding: "6px 10px", background: tab==="history"?"#eef":"#f5f5f5" }}>History</button>
        <button onClick={() => setTab("connections")} style={{ padding: "6px 10px", background: tab==="connections"?"#eef":"#f5f5f5" }}>AI Connections</button>
        <button onClick={() => setTab("seo")} style={{ padding: "6px 10px", background: tab==="seo"?"#eef":"#f5f5f5" }}>SEO</button>
        <button onClick={() => setTab("social")} style={{ padding: "6px 10px", background: tab==="social"?"#eef":"#f5f5f5" }}>Social Media</button>
      </div>
      {tab === "architecture" && <MapViewer />}
      {tab === "environments" && <EnvTree />}
      {tab === "pages" && <PageGrid />}
      {tab === "history" && <HistoryTimeline />}
      {tab === "connections" && <ConnectionsView />}
      {tab === "seo" && <SEOPanel />}
      {tab === "social" && <SocialPanel />}
    </div>
  );
}


