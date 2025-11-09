#!/usr/bin/env node
/* eslint-disable no-console */
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.join(__dirname, "..");

const rootDataDir = path.join(repoRoot, "data", "maps");
const dashboardPublicDir = path.join(repoRoot, "dashboard", "public", "maps");

async function ensureDirs() {
  [rootDataDir, dashboardPublicDir].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });
}

async function writeJsonBoth(relName, obj) {
  const rootPath = path.join(rootDataDir, relName);
  const publicPath = path.join(dashboardPublicDir, relName);
  fs.writeFileSync(rootPath, JSON.stringify(obj, null, 2));
  fs.writeFileSync(publicPath, JSON.stringify(obj, null, 2));
}

async function main() {
  await ensureDirs();

  const ORCH_URL = process.env.ORCHESTRATOR_URL || "https://ops-orchestrator.onrender.com";
  const ORCH_KEY = process.env.ORCHESTRATOR_API_KEY || process.env.OPENAI_API_KEY || "";

  // Load current environments if exists
  let currentEnvs = {};
  try {
    const existing = fs.readFileSync(path.join(rootDataDir, "environments.json"), "utf8");
    currentEnvs = JSON.parse(existing);
  } catch {}

  const newEnvs = {
    "sparky-hq": {
      "staging": {
        url: "https://staging.sparky-hq.com",
        provider: "Render",
        status: "Unknown"
      },
      "production": {
        url: "https://sparky-hq.com",
        provider: "Cloudways",
        status: "Unknown"
      }
    },
    "hezlep-inc": {
      "staging": {
        url: "https://staging.hezlepinc.com",
        provider: "Render",
        status: "Unknown"
      },
      "production": {
        url: "https://hezlepinc.com",
        provider: "Cloudways",
        status: "Unknown"
      }
    }
  };

  // Attempt to enrich with Render API
  if (process.env.RENDER_API_KEY) {
    try {
      const services = await fetch("https://api.render.com/v1/services", {
        headers: { Authorization: `Bearer ${process.env.RENDER_API_KEY}` }
      }).then(r => r.json());

      // Try to find a static service for dashboard and any staging sites
      const byName = Object.fromEntries((services || []).map(s => [s.service.name || s.name, s]));

      for (const [siteKey, envs] of Object.entries(newEnvs)) {
        const staging = envs["staging"];
        // heuristics: if a Render service shares name with dashboard or site, attach last deploy
        const svc = byName["ops-dashboard"] || byName[siteKey] || null;
        if (svc) {
          staging.status = "Live";
          staging.render_service_id = svc.service?.id || svc.id;
          try {
            const depUrl = `https://api.render.com/v1/services/${staging.render_service_id}/deploys`;
            const deploys = await fetch(depUrl, {
              headers: { Authorization: `Bearer ${process.env.RENDER_API_KEY}` }
            }).then(r => r.json());
            const last = Array.isArray(deploys) ? deploys[0] : null;
            if (last) {
              staging.build_id = last.id;
              staging.last_deploy = last.finishedAt || last.updatedAt || last.createdAt || null;
            }
          } catch {}
        }
      }
    } catch (e) {
      console.warn("⚠️ Render API enrich failed:", e.message);
    }
  }

  // Attempt to enrich with Cloudways API (OAuth via email/api key)
  if (process.env.CW_EMAIL && process.env.CW_API_KEY) {
    try {
      const tokenRes = await fetch("https://api.cloudways.com/api/v1/oauth/access_token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `email=${encodeURIComponent(process.env.CW_EMAIL)}&api_key=${encodeURIComponent(process.env.CW_API_KEY)}`
      });
      const tokenData = await tokenRes.json();
      const token = tokenData.access_token;
      if (token) {
        const apps = await fetch("https://api.cloudways.com/api/v1/app", {
          headers: { Authorization: `Bearer ${token}` }
        }).then(r => r.json());
        // Heuristic: attach an app_id to production envs if domain matches
        for (const [siteKey, envs] of Object.entries(newEnvs)) {
          const prod = envs["production"];
          const match = (apps?.apps || apps || []).find(a => (a?.app_url || a?.appUrl || "").includes(new URL(prod.url).hostname));
          if (match) {
            prod.status = "Healthy";
            prod.app_id = match.id || match.app_id;
            prod.last_sync = new Date().toISOString();
          }
        }
      }
    } catch (e) {
      console.warn("⚠️ Cloudways API enrich failed:", e.message);
    }
  }

  // Update sites.json from WordPress (Sparky as example)
  try {
    const pages = await fetch("https://staging.sparky-hq.com/wp-json/wp/v2/pages?per_page=100").then((r) => r.json());
    const siteData = {
      "Sparky-HQ": pages.reduce((acc, p) => {
        acc[p.slug] = p.link;
        return acc;
      }, {})
    };
    await writeJsonBoth("sites.json", siteData);
    console.log("✅ Updated sites.json");
  } catch (e) {
    console.warn("⚠️ Failed to update sites.json:", e.message);
  }

  // Build connections.json snapshot
  try {
    const results = [];
    // Orchestrator root health (no auth)
    try {
      const ping = await fetch(`${ORCH_URL}/`).then(r => ({ ok: r.ok, status: r.status }));
      results.push({ component: "Orchestrator", check: "root", status: ping.ok ? "ok" : `err:${ping.status}` });
    } catch (e) {
      results.push({ component: "Orchestrator", check: "root", status: "err" });
    }
    // Orchestrator status (auth)
    try {
      if (ORCH_KEY) {
        const st = await fetch(`${ORCH_URL}/ai/status`, { headers: { "x-api-key": ORCH_KEY } }).then(r => ({ ok: r.ok, status: r.status }));
        results.push({ component: "Orchestrator", check: "status", status: st.ok ? "ok" : `err:${st.status}` });
      } else {
        results.push({ component: "Orchestrator", check: "status", status: "unknown" });
      }
    } catch {
      results.push({ component: "Orchestrator", check: "status", status: "err" });
    }
    // Render API
    try {
      if (process.env.RENDER_API_KEY) {
        const services = await fetch("https://api.render.com/v1/services", {
          headers: { Authorization: `Bearer ${process.env.RENDER_API_KEY}` }
        }).then(r => r.json());
        results.push({ component: "Render", check: "services", status: Array.isArray(services) ? "ok" : "err" });
      } else {
        results.push({ component: "Render", check: "services", status: "unknown" });
      }
    } catch {
      results.push({ component: "Render", check: "services", status: "err" });
    }
    // Cloudways
    try {
      if (process.env.CW_EMAIL && process.env.CW_API_KEY) {
        const tokenRes = await fetch("https://api.cloudways.com/api/v1/oauth/access_token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `email=${encodeURIComponent(process.env.CW_EMAIL)}&api_key=${encodeURIComponent(process.env.CW_API_KEY)}`
        });
        const ok = tokenRes.ok;
        results.push({ component: "Cloudways", check: "oauth", status: ok ? "ok" : `err:${tokenRes.status}` });
      } else {
        results.push({ component: "Cloudways", check: "oauth", status: "unknown" });
      }
    } catch {
      results.push({ component: "Cloudways", check: "oauth", status: "err" });
    }
    // WordPress (Sparky staging)
    try {
      const wp = await fetch("https://staging.sparky-hq.com/wp-json/").then(r => ({ ok: r.ok, status: r.status }));
      results.push({ component: "WordPress (sparky-hq staging)", check: "wp-json", status: wp.ok ? "ok" : `err:${wp.status}` });
    } catch {
      results.push({ component: "WordPress (sparky-hq staging)", check: "wp-json", status: "err" });
    }
    await writeJsonBoth("connections.json", { timestamp: new Date().toISOString(), results });
    console.log("✅ connections.json written");
  } catch (e) {
    console.warn("⚠️ Failed to write connections.json:", e.message);
  }

  // Suggestions (from orchestrator)
  try {
    if (ORCH_KEY) {
      const sug = await fetch(`${ORCH_URL}/ai/suggestions/daily`, { headers: { "x-api-key": ORCH_KEY } }).then(r => r.json());
      await writeJsonBoth("suggestions.json", { timestamp: new Date().toISOString(), suggestions: sug?.suggestions || [] });
      console.log("✅ suggestions.json written");
    } else {
      console.log("ℹ️ ORCHESTRATOR_API_KEY not set; skipping suggestions.json");
    }
  } catch (e) {
    console.warn("⚠️ Failed to write suggestions.json:", e.message);
  }

  // Environments (merge with existing and write)
  try {
    const envs = { ...currentEnvs, ...newEnvs };
    await writeJsonBoth("environments.json", envs);
    console.log("✅ Environments updated");
  } catch (e) {
    console.warn("⚠️ Failed to write environments.json:", e.message);
  }
}

main().catch((e) => {
  console.error("update-maps failed:", e);
  process.exit(1);
});


