import express from "express";
import fs from "fs";

const router = express.Router();

router.get("/", (req, res) => {
	try {
		const cw = JSON.parse(fs.readFileSync("/tmp/cloudways-cache.json", "utf8"));
		const gh = JSON.parse(fs.readFileSync("/tmp/github-cache.json", "utf8"));
		res.json({ cloudways: cw, github: gh });
	} catch {
		res.status(500).json({ error: "No cached data yet" });
	}
});

export default router;


