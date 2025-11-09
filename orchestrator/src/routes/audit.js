import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const auditFile = path.join(process.cwd(), "orchestrator", "logs", "ai_audit.json");

router.post("/", (req, res) => {
	try {
		const entry = {
			time: new Date().toISOString(),
			event: req.body?.event || "unknown",
			data: req.body?.data || {}
		};
		let arr = [];
		try {
			if (fs.existsSync(auditFile)) {
				arr = JSON.parse(fs.readFileSync(auditFile, "utf8")) || [];
			}
		} catch {}
		arr.push(entry);
		fs.mkdirSync(path.dirname(auditFile), { recursive: true });
		fs.writeFileSync(auditFile, JSON.stringify(arr, null, 2));
		return res.json({ ok: true });
	} catch (e) {
		return res.status(500).json({ error: e?.message || "failed" });
	}
});

router.get("/", (_req, res) => {
	try {
		if (fs.existsSync(auditFile)) {
			return res.json(JSON.parse(fs.readFileSync(auditFile, "utf8")));
		}
		return res.json([]);
	} catch (e) {
		return res.status(500).json({ error: e?.message || "failed" });
	}
});

export default router;


