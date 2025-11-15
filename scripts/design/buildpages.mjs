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

fs.mkdirSync(contentDir, { recursive: true });

if (!fs.existsSync(path.join(brandRoot, "sitemap.json"))) {
  const sampleSitemap = {
    home: {
      title: "Home",
      slug: "/",
      type: "page",
      patterns: ["hero-basic", "services-grid", "cta-banner"],
    },
  };
  fs.writeFileSync(
    path.join(brandRoot, "sitemap.json"),
    JSON.stringify(sampleSitemap, null, 2),
  );
}

// Placeholder home.json so the pipeline has something to work with.
const homeJsonPath = path.join(contentDir, "home.json");
if (!fs.existsSync(homeJsonPath)) {
  const placeholder = {
    blocks: [
      {
        blockName: "core/paragraph",
        attrs: { className: "section-surface" },
        innerHTML:
          "This is a placeholder Home page for brand '" + brand + "'. The Astra pipeline is wired, but content generation is not implemented yet.",
      },
    ],
  };
  fs.writeFileSync(homeJsonPath, JSON.stringify(placeholder, null, 2));
}

console.log(
  `✅ Ensured page content scaffolding for brand=${brand} at ${contentDir}`,
);


