import StatusLight from "../ui/StatusLight";
import useSWR from "swr";
import { fetchSystemHealth } from "@/lib/api/orchestrator";

export default function HealthCard() {
  const { data, error } = useSWR("health", fetchSystemHealth, { refreshInterval: 30000 });
  const status = data?.overall || "offline";
  return (
    <div className="app-card flex flex-col justify-between">
      <div className="app-card-header flex items-center justify-between">
        <span>System Health</span>
        <StatusLight status={status} />
      </div>
      <div className="app-card-body">
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          {error ? "Error fetching health" : data ? data.message : "Checking..."}
        </p>
      </div>
    </div>
  );
}
