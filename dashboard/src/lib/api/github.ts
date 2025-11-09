export async function fetchGitStatus() {
  const res = await fetch("/api/github/status"); // your internal proxy endpoint
  return res.json();
}
