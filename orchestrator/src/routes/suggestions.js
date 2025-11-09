import express from "express";
import { getServersFromCache, getAppsFromCache, getAccessToken, getServers, getApps } from "../integrations/cloudways.js";
import { getRepoStatus } from "../integrations/github.js";
import { generateDailySuggestions } from "../integrations/openai.js";

const router = express.Router();

router.get("/daily", async (_req, res) => {
	try {
		const snapshot = { timestamp: new Date().toISOString(), cloudways: {}, git: {} };

		// Prefer cached Cloudways
		const cachedServers = getServersFromCache(true);
		const cachedApps = getAppsFromCache(true);
		if (cachedServers && cachedApps) {
			snapshot.cloudways = { servers: cachedServers, apps: cachedApps, notice: "cached (10 min TTL)" };
		} else if (process.env.CW_EMAIL && process.env.CW_API_KEY) {
			const token = await getAccessToken();
			const [servers, apps] = await Promise.all([getServers(token), getApps(token)]);
			snapshot.cloudways = { servers, apps, notice: "live" };
		} else {
			snapshot.cloudways = { notice: "Cloudways env not set" };
		}

		if (process.env.GITHUB_REPO && process.env.GITHUB_TOKEN) {
			snapshot.git = await getRepoStatus(process.env.GITHUB_REPO);
		} else {
			snapshot.git = { notice: "GitHub env not set" };
		}

		const suggestions = await generateDailySuggestions(snapshot);
		res.json({ suggestions, snapshot });
	} catch (e) {
		res.status(500).json({ error: e?.message || "failed" });
	}
});

export default router;


