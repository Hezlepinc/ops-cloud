import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
	try {
		const repo = process.env.GITHUB_REPO;
		const token = process.env.GITHUB_TOKEN;
		if (!repo || !token) {
			// Return a simple placeholder if not configured
			return res.status(200).json({
				configured: false,
				runs: [],
				notice: "Set GITHUB_REPO and GITHUB_TOKEN to enable GitHub status."
			});
		}
		const r = await fetch(`https://api.github.com/repos/${repo}/actions/runs?per_page=5`, {
			headers: {
				"accept": "application/vnd.github+json",
				"authorization": `Bearer ${token}`,
				"x-github-api-version": "2022-11-28",
				"user-agent": "ops-cloud-dashboard"
			}
		});
		const data = await r.json();
		return res.status(r.status).json({ configured: true, ...data });
	} catch (e: any) {
		return res.status(500).json({ error: e?.message || "failed" });
	}
}


