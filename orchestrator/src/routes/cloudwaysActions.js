import express from "express";
import fetch from "node-fetch";
import { getAccessToken } from "../integrations/cloudways.js";

const router = express.Router();

router.post("/:action", async (req, res) => {
	try {
		const { action } = req.params;
		const { app_id: appId, server_id: serverId } = req.body || {};
		const token = await getAccessToken();
		const headers = {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json"
		};
		const BASE = "https://api.cloudways.com/api/v1";
		let url = null;
		let payload = null;

		switch (action) {
			case "deploy":
				if (!appId) return res.status(400).json({ error: "app_id required" });
				url = `${BASE}/app/manage/git/pull`;
				payload = { app_id: appId };
				break;
			case "purge":
				if (!appId) return res.status(400).json({ error: "app_id required" });
				url = `${BASE}/app/manage/varnish`;
				payload = { app_id: appId };
				break;
			case "restart":
				if (!serverId) return res.status(400).json({ error: "server_id required" });
				url = `${BASE}/server/manage/service`;
				payload = { server_id: serverId, service: "phpfpm", action: "restart" };
				break;
			default:
				return res.status(400).json({ error: "Invalid action" });
		}

		const resp = await fetch(url, { method: "POST", headers, body: JSON.stringify(payload) });
		const contentType = resp.headers.get("content-type") || "";
		const text = await resp.text();
		if (!resp.ok) {
			return res.status(resp.status).json({ error: text.slice(0, 500) });
		}
		if (contentType.toLowerCase().includes("application/json")) {
			try {
				return res.json(JSON.parse(text));
			} catch {
				return res.json({ ok: true, body: text });
			}
		}
		return res.json({ ok: true, body: text });
	} catch (e) {
		return res.status(500).json({ error: e?.message || "failed" });
	}
});

export default router;


