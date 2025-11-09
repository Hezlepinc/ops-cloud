export async function fetchSystemHealth() {
  const res = await fetch(`/api/ai/status`);
  return res.json();
}

export async function fetchAISuggestion() {
  const res = await fetch(`/api/ai/suggestions/daily`);
  return res.json();
}
