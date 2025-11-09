import { useState } from "react";
import MapViewer from "../../components/MapViewer";
import EnvTree from "../../components/EnvTree";
import PageGrid from "../../components/PageGrid";

export default function MapsDashboard() {
  const [tab, setTab] = useState<"architecture" | "environments" | "pages">("architecture");
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>Ops-Cloud Project Maps</h1>
      <div style={{ display: "inline-flex", gap: 8, marginBottom: 16 }}>
        <button onClick={() => setTab("architecture")} style={{ padding: "6px 10px", background: tab==="architecture"?"#eef":"#f5f5f5" }}>Architecture</button>
        <button onClick={() => setTab("environments")} style={{ padding: "6px 10px", background: tab==="environments"?"#eef":"#f5f5f5" }}>Environments</button>
        <button onClick={() => setTab("pages")} style={{ padding: "6px 10px", background: tab==="pages"?"#eef":"#f5f5f5" }}>Pages</button>
      </div>
      {tab === "architecture" && <MapViewer />}
      {tab === "environments" && <EnvTree />}
      {tab === "pages" && <PageGrid />}
    </div>
  );
}


