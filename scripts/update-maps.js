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

  // Environments (idempotent copy from existing or defaults)
  try {
    let envs = {
      "sparky-hq": {
        "staging": "https://staging.sparky-hq.com",
        "production": "https://sparky-hq.com"
      },
      "hezlep-inc": {
        "staging": "https://staging.hezlepinc.com",
        "production": "https://hezlepinc.com"
      }
    };
    await writeJsonBoth("environments.json", envs);
    console.log("✅ Ensured environments.json");
  } catch (e) {
    console.warn("⚠️ Failed to write environments.json:", e.message);
  }
}

main().catch((e) => {
  console.error("update-maps failed:", e);
  process.exit(1);
});


