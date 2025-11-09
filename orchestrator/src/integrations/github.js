import fetch from "node-fetch";

export async function getRepoStatus(repo, branch = "staging") {
	const res = await fetch(`https://api.github.com/repos/${repo}/branches/${branch}`, {
		headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN || ""}` }
	});
	const data = await res.json();
	return {
		branch,
		commit: data?.commit?.sha || "unknown",
		author: data?.commit?.commit?.author?.name || "unknown"
	};
}


