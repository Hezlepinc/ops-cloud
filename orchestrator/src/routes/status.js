import express from "express";
import { getAccessToken, getServers, getApps, getServersFromCache, getAppsFromCache } from "../integrations/cloudways.js";
import { getRepoStatus } from "../integrations/github.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  console.log("🔹 [AI/Status] Request received");

  const result = {
    timestamp: new Date().toISOString(),
    errors: []
  };

  // ---- Cloudways Section ----
  try {
    if (process.env.CW_EMAIL && process.env.CW_API_KEY) {
      console.log("🔹 [Cloudways] Credentials detected, requesting access token...");
      // Prefer cache first to avoid rate limit on cold start
      const cachedServers = getServersFromCache(true);
      const cachedApps = getAppsFromCache(true);
      if (cachedServers && cachedApps) {
        result.cloudways = { servers: cachedServers, apps: cachedApps };
        result.notice = "Using cached Cloudways data (10 min TTL)";
      } else {
        const token = await getAccessToken();
        console.log("🔹 [Cloudways] Token:", token ? "✅ received" : "❌ undefined");
        const [servers, apps] = await Promise.all([getServers(token), getApps(token)]);
        result.cloudways = { servers, apps };
        result.notice = "Using cached Cloudways data (10 min TTL)";
      }
    } else {
      const msg = "Cloudways credentials not set";
      console.warn("⚠️", msg);
      result.errors.push(msg);
    }
  } catch (e) {
    const msg = `Cloudways error: ${e?.message || "failed"}`;
    console.error("❌", msg);
    result.errors.push(msg);
  }

  // ---- GitHub Section ----
  try {
    if (process.env.GITHUB_REPO && process.env.GITHUB_TOKEN) {
      console.log("🔹 [GitHub] Checking repo status...");
      const git = await getRepoStatus(process.env.GITHUB_REPO);
      result.git = git;
    } else {
      const msg = "GitHub env not set";
      console.warn("⚠️", msg);
      result.errors.push(msg);
    }
  } catch (e) {
    const msg = `GitHub error: ${e?.message || "failed"}`;
    console.error("❌", msg);
    result.errors.push(msg);
  }

  // ---- Response ----
  res.json(result);
});

export default router;