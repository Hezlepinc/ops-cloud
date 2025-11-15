#!/usr/bin/env node
/**
 * Stub for page builder pipeline.
 *
 * For now this just ensures the directory structure exists and can later be
 * expanded to assemble Gutenberg JSON/HTML from patterns + AI copy.
 *
 * Usage:
 *   node scripts/design/buildpages.mjs --brand=hezlep-inc
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (const arg of args) {
    const [k, v] = arg.split("=");
    if (k && v) out[k.replace(/^--/, "")] = v;
  }
  return out;
}

const { brand = "hezlep-inc" } = parseArgs();

const repoRoot = path.resolve(__dirname, "..", "..");
const brandRoot = path.join(repoRoot, "infra", "wordpress", "brands", brand);
const contentDir = path.join(brandRoot, "content", "pages");
const sitemapPath = path.join(brandRoot, "sitemap.json");

fs.mkdirSync(contentDir, { recursive: true });

// If no sitemap exists yet, create a simple default.
if (!fs.existsSync(sitemapPath)) {
  const sampleSitemap = {
    home: {
      title: "Home",
      slug: "/",
      type: "page",
      patterns: ["hero-basic", "services-grid", "cta-banner"],
    },
  };
  fs.writeFileSync(sitemapPath, JSON.stringify(sampleSitemap, null, 2));
}

// Read sitemap and create a simple placeholder JSON file per page.
const sitemap = JSON.parse(fs.readFileSync(sitemapPath, "utf8"));

for (const [key, page] of Object.entries(sitemap)) {
  if (page.type === "archive") {
    // Archives use block templates; no per-page JSON needed.
    continue;
  }
  const slug = key === "home" ? "home" : key;
  const targetPath = path.join(contentDir, `${slug}.json`);

  if (fs.existsSync(targetPath)) continue;

  const title = page.title || slug;
  const patterns = Array.isArray(page.patterns) ? page.patterns.join(", ") : "";

  const placeholder = {
    blocks: [
      {
        blockName: "core/heading",
        attrs: { level: 1 },
        innerHTML: title,
      },
      {
        blockName: "core/paragraph",
        attrs: { className: "section-surface" },
        innerHTML: `This is a placeholder page for '${brand}' (${slug}). Patterns: ${patterns}`,
      },
    ],
  };

  fs.writeFileSync(targetPath, JSON.stringify(placeholder, null, 2));
}

console.log(
  `✅ Ensured page content scaffolding for brand=${brand} from sitemap at ${contentDir}`,
);


