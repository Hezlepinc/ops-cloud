import Link from "next/link";
import SEOPanel from "../components/SEOPanel";
import SocialPanel from "../components/SocialPanel";

export default function Home() {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 12 }}>Ops-Cloud Dashboard</h1>
      <p style={{ color: "#4b5563", marginBottom: 16 }}>
        Welcome. Use these quick links to navigate key areas.
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link href="/maps" style={{ padding: "10px 14px", border: "1px solid #e5e7eb", borderRadius: 8, background: "#f9fafb" }}>
          Open Architecture Maps
        </Link>
        <Link href="/maps" style={{ padding: "10px 14px", border: "1px solid #e5e7eb", borderRadius: 8, background: "#f9fafb" }}>
          Environments & Pages
        </Link>
      </div>
      <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <SEOPanel />
        <SocialPanel />
      </div>
    </div>
  );
}


