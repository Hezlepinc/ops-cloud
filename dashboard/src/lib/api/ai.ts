export async function fetchAIStatus() {
  const res = await fetch("/api/ai/status"); // internal API route hitting orchestrator
  return res.json();
}
