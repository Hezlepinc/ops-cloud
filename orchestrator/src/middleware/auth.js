// orchestrator/src/middleware/auth.js
export default function (req, res, next) {
	const headerKey = (req.headers["x-api-key"] || "").toString().trim();
	// Primary: OPENAI_API_KEY; Fallback: AI_KEY (for legacy envs)
	const envKey = ((process.env.OPENAI_API_KEY || process.env.AI_KEY) || "").toString().trim();

	// Require server-side API key to be configured and to match header
	if (!envKey || headerKey !== envKey) {
		console.warn("❌ Unauthorized request: invalid or missing x-api-key (or OPENAI_API_KEY not set)");
    return res.sendStatus(401);
  }

  next();
}