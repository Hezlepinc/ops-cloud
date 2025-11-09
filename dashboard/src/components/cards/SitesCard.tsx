import StatusLight from "../ui/StatusLight";

export default function SitesCard() {
  const sites = [
    { name: "Sparky-HQ", status: "ok" },
    { name: "Hezlep Inc", status: "ok" }
  ];
  return (
    <div className="app-card">
      <div className="app-card-header">Client Environments</div>
      <div className="app-card-body">
        <ul className="text-sm">
          {sites.map((s) => (
            <li key={s.name} className="flex justify-between items-center py-1">
              <span>{s.name}</span>
              <StatusLight status={s.status as any} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
