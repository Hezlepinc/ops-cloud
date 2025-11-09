import fs from "fs";
import { getRepoStatus } from "../integrations/github.js";

export async function syncGitHub() {
	try {
		const data = await getRepoStatus(process.env.GITHUB_REPO || "");
		fs.writeFileSync("/tmp/github-cache.json", JSON.stringify({ data, ts: Date.now() }));
		console.log("GitHub cache updated");
	} catch (err) {
		console.error("GitHub sync error:", err?.message || String(err));
	}
}


