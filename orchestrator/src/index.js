import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import statusRoute from "./routes/status.js";
import deployRoute from "./routes/deploy.js";
import wordpressRoute from "./routes/wordpress.js";
import liveRoute from "./routes/live.js";
import elementorRoute from "./routes/elementor.js";
import auth from "./middleware/auth.js";
import { syncCloudways } from "./jobs/syncCloudways.js";
import { syncGitHub } from "./jobs/syncGitHub.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Ops Orchestrator API Running ✅"));

// Protect AI endpoints with API key
app.use("/ai", auth);
// Simple request logger to file
try {
	const __dirname = path.dirname(fileURLToPath(import.meta.url));
	const logsDir = path.resolve(__dirname, "../logs");
	fs.mkdirSync(logsDir, { recursive: true });
	const logFile = path.join(logsDir, "orchestrator.log");
	const log = (msg) => {
		try {
			fs.appendFileSync(logFile, `${new Date().toISOString()} ${msg}\n`);
		} catch {}
	};
	app.use((req, _res, next) => {
		log(`${req.method} ${req.url}`);
		next();
	});
} catch {}

app.use("/ai/status", statusRoute);
app.use("/ai/deploy", deployRoute);
app.use("/ai/wordpress", wordpressRoute);
app.use("/ai/live", liveRoute);
app.use("/ai/elementor", elementorRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Orchestrator listening on port ${PORT}`);
});

// Background sync jobs
setInterval(syncCloudways, 1000 * 60 * 5);
setInterval(syncGitHub, 1000 * 60 * 2);


