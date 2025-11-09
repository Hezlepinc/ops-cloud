import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.post("/", async (req, res) => {
	try {
		const { brand, environment } = req.body || {};
		const action = {
			event_type: "deploy-orchestrator",
			client_payload: { brand, environment }
		};
		const resp = await fetch(`https://api.github.com/repos/${process.env.GITHUB_REPO}/dispatches`, {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${process.env.GITHUB_TOKEN}`,
				"Accept": "application/vnd.github.everest-preview+json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify(action)
		});
		if (!resp.ok) {
			const txt = await resp.text();
			return res.status(resp.status).json({ error: "dispatch_failed", body: txt });
		}
		res.json({ status: "triggered", brand, environment });
	} catch (err) {
		res.status(500).json({ error: err?.message || "unknown error" });
	}
});

export default router;


