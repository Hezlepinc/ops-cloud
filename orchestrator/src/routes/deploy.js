import express from "express";
import fetch from "node-fetch";

const router = express.Router();

/**
 * POST /ai/deploy
 * Trigger template deployment via GitHub Actions
 * 
 * Body: { brand: "sparky" | "hezlepinc", environment: "staging" | "production" }
 * 
 * Triggers repository_dispatch event "deploy-templates" which runs
 * .github/workflows/deploy-theme.yml
 */
router.post("/", async (req, res) => {
	try {
		const { brand, environment = "staging" } = req.body || {};
		
		// Validate brand
		const validBrands = ["sparky", "hezlepinc"];
		if (!brand || !validBrands.includes(brand)) {
			return res.status(400).json({ 
				error: "Invalid brand", 
				valid_brands: validBrands 
			});
		}
		
		// Validate environment
		const validEnvs = ["staging", "production"];
		if (!validEnvs.includes(environment)) {
			return res.status(400).json({ 
				error: "Invalid environment", 
				valid_environments: validEnvs 
			});
		}
		
		const repo = process.env.GITHUB_REPO;
		const token = process.env.GITHUB_TOKEN;
		
		if (!repo || !token) {
			return res.status(500).json({ 
				error: "GITHUB_REPO and GITHUB_TOKEN must be set on the server" 
			});
		}
		
		// Trigger GitHub Actions workflow via repository_dispatch
		const action = {
			event_type: "deploy-templates",
			client_payload: { 
				brand, 
				environment,
				triggered_by: "orchestrator",
				timestamp: new Date().toISOString()
			}
		};
		
		const resp = await fetch(`https://api.github.com/repos/${repo}/dispatches`, {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${token}`,
				"Accept": "application/vnd.github+json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify(action)
		});
		
		if (!resp.ok) {
			const txt = await resp.text();
			let errorBody = {};
			try {
				errorBody = JSON.parse(txt);
			} catch {
				errorBody = { message: txt };
			}
			return res.status(resp.status).json({ 
				error: "dispatch_failed", 
				details: errorBody 
			});
		}
		
		res.json({ 
			status: "triggered", 
			brand, 
			environment,
			message: `Deployment triggered for ${brand} (${environment}). Check GitHub Actions for progress.`,
			workflow: "Deploy WP Themes & Kits"
		});
	} catch (err) {
		res.status(500).json({ error: err?.message || "unknown error" });
	}
});

/**
 * POST /ai/deploy/all
 * Deploy templates to all brands in an environment
 * 
 * Body: { environment: "staging" | "production" }
 */
router.post("/all", async (req, res) => {
	try {
		const { environment = "staging" } = req.body || {};
		
		const validEnvs = ["staging", "production"];
		if (!validEnvs.includes(environment)) {
			return res.status(400).json({ 
				error: "Invalid environment", 
				valid_environments: validEnvs 
			});
		}
		
		const brands = ["sparky", "hezlepinc"];
		const results = [];
		
		for (const brand of brands) {
			try {
				// Trigger deployment for each brand
				const action = {
					event_type: "deploy-templates",
					client_payload: { 
						brand, 
						environment,
						triggered_by: "orchestrator",
						timestamp: new Date().toISOString()
					}
				};
				
				const repo = process.env.GITHUB_REPO;
				const token = process.env.GITHUB_TOKEN;
				
				const resp = await fetch(`https://api.github.com/repos/${repo}/dispatches`, {
					method: "POST",
					headers: {
						"Authorization": `Bearer ${token}`,
						"Accept": "application/vnd.github+json",
						"Content-Type": "application/json"
					},
					body: JSON.stringify(action)
				});
				
				results.push({
					brand,
					status: resp.ok ? "triggered" : "failed",
					status_code: resp.status
				});
			} catch (err) {
				results.push({
					brand,
					status: "error",
					error: err.message
				});
			}
		}
		
		res.json({
			status: "triggered",
			environment,
			results,
			message: `Deployments triggered for all brands in ${environment}. Check GitHub Actions for progress.`
		});
	} catch (err) {
		res.status(500).json({ error: err?.message || "unknown error" });
	}
});

export default router;


