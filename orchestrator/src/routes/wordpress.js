import express from "express";
import { getWPHealth } from "../integrations/wordpress.js";

const router = express.Router();

router.get("/:brand", async (req, res) => {
	const brand = req.params.brand;
	const url = brand === "sparky-hq" ? "https://staging.sparky-hq.com" : "https://staging.hezlepinc.com";
	const wpStatus = await getWPHealth(url);
	res.json({ brand, wpStatus, url });
});

export default router;


