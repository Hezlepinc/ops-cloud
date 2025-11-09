import express from "express";
import { getAccessToken, getServers, getApps } from "../integrations/cloudways.js";
import { getRepoStatus } from "../integrations/github.js";

const router = express.Router();

router.get("/", async (req, res) => {
	try {
		const token = await getAccessToken();
		const [servers, apps, git] = await Promise.all([
			getServers(token),
			getApps(token),
			getRepoStatus(process.env.GITHUB_REPO || "")
		]);
		res.json({
			cloudways: { servers, apps },
			git,
			timestamp: new Date().toISOString()
		});
	} catch (err) {
		res.status(500).json({ error: err?.message || "unknown error" });
	}
});

export default router;


