import express from "express";
import { summarizeStatus } from "../integrations/openai.js";
import {
	getServersFromCache,
	getAppsFromCache,
	getAccessToken,
	getServers,
	getApps
} from "../integrations/cloudways.js";
import { getRepoStatus } from "../integrations/github.js";

const router = express.Router();

router.get("/", async (_req, res) => {
	try {
		const snapshot = { timestamp: new Date().toISOString(), cloudways: {}, git: {} };

		// Cloudways snapshot (prefer cache; fallback to live fetch if env present)
		const cachedServers = getServersFromCache(true);
		const cachedApps = getAppsFromCache(true);
		if (cachedServers && cachedApps) {
			snapshot.cloudways = { servers: cachedServers, apps: cachedApps, notice: "cached (10 min TTL)" };
		} else if (process.env.CW_EMAIL && process.env.CW_API_KEY) {
			const token = await getAccessToken();
			const [servers, apps] = await Promise.all([getServers(token), getApps(token)]);
			snapshot.cloudways = { servers, apps, notice: "live" };
		} else {
			snapshot.cloudways = { error: "Cloudways credentials not set" };
		}

		// GitHub snapshot if configured
		if (process.env.GITHUB_REPO && process.env.GITHUB_TOKEN) {
			snapshot.git = await getRepoStatus(process.env.GITHUB_REPO);
		} else {
			snapshot.git = { notice: "GitHub env not set" };
		}

		const summary = await summarizeStatus(snapshot);
		res.json({ summary, snapshot });
	} catch (e) {
		res.status(500).json({ error: e?.message || "failed" });
	}
});

export default router;


