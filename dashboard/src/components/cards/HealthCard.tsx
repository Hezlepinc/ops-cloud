import StatusLight from "../ui/StatusLight";
import useSWR from "swr";
import { fetchSystemHealth } from "@/lib/api/orchestrator";

export default function HealthCard() {
  const { data, error } = useSWR("health", fetchSystemHealth, { refreshInterval: 30000 });
  const status = data?.overall || "offline";
  return (
    <div className="app-card p-4 flex flex-col justify-between">
      <h3 className="font-semibold text-lg mb-1 flex items-center gap-2">
        System Health <StatusLight status={status} />
      </h3>
      <p className="text-sm text-zinc-500">
        {error ? "Error fetching health" : data ? data.message : "Checking..."}
      </p>
    </div>
  );
}
