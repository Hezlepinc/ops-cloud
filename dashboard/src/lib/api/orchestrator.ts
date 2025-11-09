export async function fetchSystemHealth() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_ORCH_URL}/ai/status`);
  return res.json();
}

export async function fetchAISuggestion() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_ORCH_URL}/ai/suggestions/daily`);
  return res.json();
}
