import express from "express";
import { getAccessToken, getServers, getApps, getServersFromCache, getAppsFromCache } from "../integrations/cloudways.js";
import { getRepoStatus } from "../integrations/github.js";

const router = express.Router();

router.get("/", async (req, res) => {
  console.log("🔹 [AI/Status] Request received");

  const result = {
    timestamp: new Date().toISOString(),
    errors: []
  };

  const forceRefresh = String(req.query?.forceRefresh || "").toLowerCase() === "true";

  // ---- Cloudways Section ----
  try {
    if (process.env.CW_EMAIL && process.env.CW_API_KEY) {
      // Prefer cache first to avoid rate limit
      const cachedServers = getServersFromCache(true);
      const cachedApps = getAppsFromCache(true);
      if (cachedServers && cachedApps && !forceRefresh) {
        result.cloudways = { servers: cachedServers, apps: cachedApps };
        result.notice = "Using cached Cloudways data (10 min TTL)";
      } else if (!forceRefresh) {
        // Cache is cold and we are not forcing a refresh: avoid API call to prevent rate limit
        result.notice = "Cloudways cache cold; skipping refresh to avoid rate limit (add ?forceRefresh=true to bypass)";
      } else {
        console.log("🔹 [Cloudways] Credentials detected, requesting access token...");
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
    // On Cloudways fetch failure (including rate limit non‑JSON 200), try to serve cached data
    const cachedServers = getServersFromCache(true);
    const cachedApps = getAppsFromCache(true);
    if (cachedServers && cachedApps) {
      result.cloudways = { servers: cachedServers, apps: cachedApps };
      result.notice = "Using cached Cloudways data (rate limited; 10 min TTL)";
      console.warn("⚠️ Cloudways API limited; served cached results");
    } else {
      const msg = `Cloudways error: ${e?.message || "failed"}`;
      console.error("❌", msg);
      result.errors.push(msg);
    }
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