import useSWR from "swr";
import { fetchAIStatus } from "@/lib/api/ai";
import StatusLight from "../ui/StatusLight";

export default function AIStatusCard() {
  const { data } = useSWR("aiStatus", fetchAIStatus, { refreshInterval: 60000 });
  const systems = data?.systems || [
    { name: "Cursor", status: "ok" },
    { name: "GitHub", status: "ok" },
    { name: "GPT", status: "ok" },
    { name: "Worker", status: "ok" }
  ];

  return (
    <div className="app-card p-4">
      <h3 className="font-semibold text-lg mb-2">AI Systems Connectivity</h3>
      <ul className="text-sm space-y-1">
        {systems.map((sys: any) => (
          <li key={sys.name} className="flex justify-between">
            <span>{sys.name}</span>
            <StatusLight status={sys.status} />
          </li>
        ))}
      </ul>
    </div>
  );
}
