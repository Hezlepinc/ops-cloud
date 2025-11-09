import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import statusRoute from "./routes/status.js";
import deployRoute from "./routes/deploy.js";
import wordpressRoute from "./routes/wordpress.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Ops Orchestrator API Running ✅"));

app.use("/ai/status", statusRoute);
app.use("/ai/deploy", deployRoute);
app.use("/ai/wordpress", wordpressRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Orchestrator listening on port ${PORT}`);
});


