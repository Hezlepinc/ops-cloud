#!/usr/bin/env node
/* eslint-disable no-console */
import fs from "fs";
import path from "path";

function safeReadJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return null;
  }
}

const repoRoot = process.cwd();
const connectionsPath = path.join(repoRoot, "dashboard", "public", "maps", "connections.json");
const suggestionsPath = path.join(repoRoot, "dashboard", "public", "maps", "suggestions.json");

const connections = safeReadJson(connectionsPath);
const suggestions = safeReadJson(suggestionsPath);

console.log("== Connectivity quick summary ==");
if (!connections) {
  console.log("No connections.json found.");
} else {
  const bad = (connections.results || []).filter(r => String(r.status).startsWith("err"));
  console.log(`Total checks: ${(connections.results || []).length}, Errors: ${bad.length}`);
  bad.forEach(b => console.log(` - ${b.component} / ${b.check}: ${b.status}`));
}
console.log();

console.log("== AI suggestions (top lines) ==");
if (!suggestions || !Array.isArray(suggestions.suggestions)) {
  console.log("No suggestions.json found.");
} else {
  suggestions.suggestions.slice(0, 5).forEach((s, i) => console.log(`${i + 1}. ${s}`));
}


