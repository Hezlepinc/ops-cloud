export default function Home() {
  return (
    <main style={{ padding: 32 }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 12 }}>Ops-Cloud Dashboard</h1>
      <p style={{ color: '#555', marginBottom: 16 }}>
        Welcome. Open the maps interface to view architecture, environments, and pages.
      </p>
      <a href="/maps" style={{ color: '#2563eb', textDecoration: 'underline' }}>Go to Maps</a>
    </main>
  );
}


