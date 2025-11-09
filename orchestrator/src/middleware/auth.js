export default function (req, res, next) {
	if ((req.headers["x-api-key"] || "") !== (process.env.AI_KEY || "")) return res.sendStatus(401);
	next();
}


