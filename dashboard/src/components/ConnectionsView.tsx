import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function ConnectionsView() {
  const { data: connections } = useSWR("/maps/connections.json", fetcher);
  const { data: suggestions } = useSWR("/maps/suggestions.json", fetcher);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
      <div>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Connectivity Status</h2>
        {!connections ? <p>Loading connections…</p> : (
          <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #e5e7eb" }}>
            <thead>
              <tr style={{ background: "#f3f4f6" }}>
                <th style={{ padding: 8, textAlign: "left" }}>Component</th>
                <th style={{ padding: 8, textAlign: "left" }}>Check</th>
                <th style={{ padding: 8, textAlign: "left" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {(connections.results || []).map((r: any, i: number) => {
                const color = r.status === "ok" ? "#065f46" : r.status.startsWith("err") ? "#991b1b" : "#92400e";
                return (
                  <tr key={i} style={{ borderTop: "1px solid #e5e7eb" }}>
                    <td style={{ padding: 8 }}>{r.component}</td>
                    <td style={{ padding: 8 }}>{r.check}</td>
                    <td style={{ padding: 8, color }}>{r.status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <div>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Daily AI Suggestions</h2>
        {!suggestions ? <p>Loading suggestions…</p> : (
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 12 }}>
            <ul style={{ marginLeft: 16 }}>
              {(suggestions.suggestions || []).map((s: string, i: number) => (
                <li key={i} style={{ marginBottom: 8 }}>{s}</li>
              ))}
            </ul>
            {!suggestions.suggestions?.length ? <div style={{ color: "#6b7280", fontSize: 12 }}>No suggestions available.</div> : null}
          </div>
        )}
        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>
          Updated: {connections?.timestamp || suggestions?.timestamp || "—"}
        </div>
      </div>
    </div>
  );
}


