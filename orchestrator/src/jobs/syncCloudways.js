import fs from "fs";
import { getAccessToken, getServers, getApps } from "../integrations/cloudways.js";

export async function syncCloudways() {
	try {
		const token = await getAccessToken();
		const [servers, apps] = await Promise.all([getServers(token), getApps(token)]);
		fs.writeFileSync("/tmp/cloudways-cache.json", JSON.stringify({ servers, apps, ts: Date.now() }));
		console.log("Cloudways cache updated");
	} catch (err) {
		console.error("Cloudways sync error:", err?.message || String(err));
	}
}


