import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/:brand", async (req, res) => {
	const brand = req.params.brand;
	const url = brand === "sparky-hq" ? "https://staging.sparky-hq.com" : "https://staging.hezlepinc.com";
	try {
		const r = await fetch(`${url}/wp-json/wp/v2/elementor-kit`);
		if (!r.ok) throw new Error(`HTTP ${r.status}`);
		const kits = await r.json();
		res.json({ brand, count: Array.isArray(kits) ? kits.length : 0, kits });
	} catch (err) {
		res.status(500).json({ brand, error: err?.message || "request failed" });
	}
});

export default router;


