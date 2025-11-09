import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
	try {
		const baseUrl = process.env.ORCH_URL;
		const apiKey = process.env.ORCH_API_KEY;
		if (!baseUrl || !apiKey) {
			return res.status(500).json({ error: "Server env not configured (ORCH_URL, ORCH_API_KEY)" });
		}
		const r = await fetch(`${baseUrl.replace(/\/$/, "")}/ai/status`, {
			headers: {
				"accept": "application/json",
				"x-api-key": apiKey
			}
		});
		const data = await r.json().catch(() => ({}));
		return res.status(r.status).json(data);
	} catch (e: any) {
		return res.status(500).json({ error: e?.message || "failed" });
	}
}


