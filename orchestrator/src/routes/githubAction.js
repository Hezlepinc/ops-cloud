import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.post("/dispatch", async (req, res) => {
	try {
		const { event_type, client_payload } = req.body || {};
		if (!event_type) {
			return res.status(400).json({ error: "event_type required" });
		}
		const repo = process.env.GITHUB_REPO;
		const token = process.env.GITHUB_TOKEN;
		if (!repo || !token) {
			return res.status(500).json({ error: "GITHUB_REPO and GITHUB_TOKEN must be set on the server" });
		}
		const resp = await fetch(`https://api.github.com/repos/${repo}/dispatches`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: "application/vnd.github+json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ event_type, client_payload })
		});
		const text = await resp.text();
		let body = {};
		try {
			body = text ? JSON.parse(text) : {};
		} catch {
			body = { message: text };
		}
		return res.status(resp.status).json(body);
	} catch (e) {
		return res.status(500).json({ error: e?.message || "failed" });
	}
});

export default router;


