import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function EnvTree() {
  const { data } = useSWR("/maps/environments.json", fetcher);
  if (!data) return <p>Loading environments…</p>;

  return (
    <div style={{ paddingLeft: 8 }}>
      {Object.entries<any>(data).map(([site, envs]) => (
        <div key={site} style={{ marginBottom: 12 }}>
          <h2 style={{ fontWeight: 600 }}>{site}</h2>
          <ul style={{ marginLeft: 16 }}>
            {Object.entries(envs as Record<string, any>).map(([env, info]) => {
              const url = typeof info === "string" ? info : info?.url || "";
              const provider = typeof info === "object" ? (info?.provider || "") : "";
              const status = typeof info === "object" ? (info?.status || "") : "";
              return (
                <li key={env}>
                  {url ? (
                    <a href={url} target="_blank" rel="noreferrer" style={{ color: "#2563eb", textDecoration: "underline" }}>
                      {env.toUpperCase()} – {url}
                    </a>
                  ) : (
                    <span>{env.toUpperCase()}</span>
                  )}
                  <span style={{ marginLeft: 8, color: "#6b7280", fontSize: 12 }}>
                    {provider ? `(${provider})` : ""} {status ? `• ${status}` : ""}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}


