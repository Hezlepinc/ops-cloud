import Link from "next/link";

export default function Home() {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 12 }}>Ops-Cloud Dashboard</h1>
      <p>Use the maps to visualize architecture, environments, and site pages.</p>
      <ul style={{ marginTop: 16 }}>
        <li><Link href="/maps">Open Maps</Link></li>
      </ul>
    </div>
  );
}


