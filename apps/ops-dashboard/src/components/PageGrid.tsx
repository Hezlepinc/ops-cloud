import useSWR from "swr";
import { useMemo, useState } from "react";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function PageGrid() {
  const [query, setQuery] = useState("");
  const { data } = useSWR("https://staging.sparky-hq.com/wp-json/wp/v2/pages?per_page=100", fetcher);
  const { data: templates } = useSWR("https://staging.sparky-hq.com/wp-json/elementor/v1/templates", fetcher);

  const pages = Array.isArray(data) ? data : [];
  const isLoading = !data;

  const filtered = useMemo(() => {
    const list = pages;
    if (!query) return list;
    const q = query.toLowerCase();
    return list.filter((p: any) => (p.title?.rendered || "").toLowerCase().includes(q) || (p.slug || "").toLowerCase().includes(q));
  }, [pages, query]);

  return (
    <div>
      <div style={{ marginBottom: 12, display: "flex", gap: 8, alignItems: "center" }}>
        <input
          placeholder="Search pages…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ border: "1px solid #d1d5db", borderRadius: 6, padding: "6px 10px", width: 280 }}
        />
        <span style={{ color: "#6b7280", fontSize: 12 }}>
          {isLoading ? "Loading…" : `${filtered.length} / ${pages.length} pages`} {templates ? `(templates: ${Array.isArray(templates) ? templates.length : 0})` : ""}
        </span>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #e5e7eb" }}>
        <thead>
          <tr style={{ background: "#f3f4f6" }}>
            <th style={{ padding: 8, textAlign: "left" }}>Page</th>
            <th style={{ padding: 8, textAlign: "left" }}>Slug</th>
            <th style={{ padding: 8, textAlign: "left" }}>Template</th>
            <th style={{ padding: 8, textAlign: "left" }}>Updated</th>
            <th style={{ padding: 8, textAlign: "left" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p: any) => (
            <tr key={p.id} style={{ borderTop: "1px solid #e5e7eb" }}>
              <td style={{ padding: 8 }} dangerouslySetInnerHTML={{ __html: p.title.rendered }} />
              <td style={{ padding: 8 }}>{p.slug}</td>
              <td style={{ padding: 8 }}>{p.template || "Default"}</td>
              <td style={{ padding: 8 }}>{new Date(p.modified).toLocaleDateString()}</td>
              <td style={{ padding: 8 }}>
                <a href={p.link} target="_blank" rel="noreferrer" style={{ color: "#2563eb", textDecoration: "underline" }}>
                  View
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


