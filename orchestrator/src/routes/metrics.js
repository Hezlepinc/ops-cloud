import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

function cacheInfo(file) {
	try {
		const stat = fs.statSync(file);
		const ageMs = Date.now() - stat.mtimeMs;
		const ageMin = Math.round(ageMs / 600) / 100; // 2 dec
		const data = JSON.parse(fs.readFileSync(file, "utf8"));
		return { present: true, age_min: ageMin, size_bytes: stat.size, keys: Object.keys(data || {}) };
	} catch {
		return { present: false };
	}
}

router.get("/", (_req, res) => {
	const serversFile = path.join("/tmp", "cloudways-servers.json");
	const appsFile = path.join("/tmp", "cloudways-apps.json");
	const metrics = {
		time: new Date().toISOString(),
		cache: {
			cloudways_servers: cacheInfo(serversFile),
			cloudways_apps: cacheInfo(appsFile)
		}
	};
	res.json(metrics);
});

export default router;


