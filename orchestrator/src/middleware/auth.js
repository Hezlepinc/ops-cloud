// orchestrator/src/middleware/auth.js
export default function (req, res, next) {
  const headerKey = req.headers["x-api-key"] || "";
	const envKey = process.env.OPENAI_API_KEY;

	// Require server-side API key to be configured and to match header
	if (!envKey || headerKey !== envKey) {
		console.warn("❌ Unauthorized request: invalid or missing x-api-key (or OPENAI_API_KEY not set)");
    return res.sendStatus(401);
  }

  next();
}