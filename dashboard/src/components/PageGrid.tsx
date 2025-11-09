import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function PageGrid() {
  const { data } = useSWR("https://staging.sparky-hq.com/wp-json/wp/v2/pages", fetcher);
  if (!data) return <p>Loading pages…</p>;

  return (
    <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #e5e7eb" }}>
      <thead>
        <tr style={{ background: "#f3f4f6" }}>
          <th style={{ padding: 8, textAlign: "left" }}>Page</th>
          <th style={{ padding: 8, textAlign: "left" }}>Slug</th>
          <th style={{ padding: 8, textAlign: "left" }}>Updated</th>
        </tr>
      </thead>
      <tbody>
        {data.map((p: any) => (
          <tr key={p.id} style={{ borderTop: "1px solid #e5e7eb" }}>
            <td style={{ padding: 8 }} dangerouslySetInnerHTML={{ __html: p.title.rendered }} />
            <td style={{ padding: 8 }}>{p.slug}</td>
            <td style={{ padding: 8 }}>{new Date(p.modified).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}


