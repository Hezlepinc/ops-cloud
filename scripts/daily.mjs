#!/usr/bin/env node
/* eslint-disable no-console */
import { execSync } from "node:child_process";

const ORCH_URL = process.env.ORCH_URL || "https://ops-orchestrator.onrender.com";
const API_KEY = process.env.OPENAI_API_KEY || process.env.AI_KEY || "";

function header() {
  return API_KEY ? { "x-api-key": API_KEY } : {};
}

async function getJson(url) {
  const res = await fetch(url, { headers: header() });
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text, status: res.status };
  }
}

async function main() {
  try {
    console.log("== Orchestrator status ==");
    const status = await getJson(`${ORCH_URL}/ai/status`);
    console.log(JSON.stringify(status, null, 2));

    console.log("\n== WordPress (sparky-hq) ==");
    const wpSparky = await getJson(`${ORCH_URL}/ai/wordpress/sparky-hq`);
    console.log(JSON.stringify(wpSparky, null, 2));

    console.log("\n== WordPress (hezlep-inc) ==");
    const wpHezlep = await getJson(`${ORCH_URL}/ai/wordpress/hezlep-inc`);
    console.log(JSON.stringify(wpHezlep, null, 2));

    console.log("\n== Git status ==");
    try {
      const st = execSync("git status -sb", { stdio: ["ignore", "pipe", "pipe"] }).toString().trim();
      console.log(st);
      console.log("== Last commit ==");
      const last = execSync("git log -1 --oneline", { stdio: ["ignore", "pipe", "pipe"] }).toString().trim();
      console.log(last);
    } catch (e) {
      console.log("Git unavailable:", e?.message || e);
    }
  } catch (e) {
    console.error("daily failed:", e?.message || e);
    process.exitCode = 1;
  }
}

main();


