import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function HistoryTimeline() {
  const { data } = useSWR("/maps/history.json", fetcher);
  if (!data) return <p>Loading history…</p>;
  return (
    <div style={{ paddingLeft: 8 }}>
      {data.map((item: any, idx: number) => (
        <div key={idx} style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 600 }}>{new Date(item.timestamp).toLocaleString()}</div>
          <div style={{ fontSize: 12, color: "#6b7280" }}>by {item.by}</div>
          <ul style={{ marginLeft: 16 }}>
            {(item.updated || []).map((u: string, i: number) => <li key={i}>{u}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}


