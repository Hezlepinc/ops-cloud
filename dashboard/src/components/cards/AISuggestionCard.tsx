import useSWR from "swr";
import { fetchAISuggestion } from "@/lib/api/orchestrator";

export default function AISuggestionCard() {
  const { data, error } = useSWR("aiSuggestion", fetchAISuggestion, { refreshInterval: 3600000 });
  return (
    <div className="app-card">
      <div className="app-card-header">AI Suggestion of the Day</div>
      <div className="app-card-body">
        {error && <p className="text-sm text-danger">Unable to load suggestion.</p>}
        {data ? (
          <p className="text-sm text-zinc-700 dark:text-zinc-300">{data.suggestion}</p>
        ) : (
          <p className="text-sm text-zinc-500">Loading...</p>
        )}
      </div>
    </div>
  );
}
