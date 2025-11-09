import useSWR from "swr";
import { fetchAISuggestion } from "@/lib/api/orchestrator";

export default function AISuggestionCard() {
  const { data, error } = useSWR("aiSuggestion", fetchAISuggestion, { refreshInterval: 3600000 });
  return (
    <div className="app-card p-4">
      <h3 className="font-semibold text-lg mb-2">AI Suggestion of the Day</h3>
      {error && <p className="text-sm text-danger">Unable to load suggestion.</p>}
      {data ? (
        <p className="text-sm text-zinc-700 dark:text-zinc-300">{data.suggestion}</p>
      ) : (
        <p className="text-sm text-zinc-500">Loading...</p>
      )}
    </div>
  );
}
