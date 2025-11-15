#!/usr/bin/env node
/**
 * Assemble pages from patterns defined in sitemap.json.
 *
 * Reads sitemap.json → loads pattern HTML files → combines into page content.
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
const patternsDir = path.join(brandRoot, "patterns");
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

// Read sitemap
const sitemap = JSON.parse(fs.readFileSync(sitemapPath, "utf8"));

/**
 * Load a pattern HTML file and return its content.
 */
function loadPattern(patternName) {
  const patternPath = path.join(patternsDir, `${patternName}.html`);
  if (!fs.existsSync(patternPath)) {
    console.warn(`⚠️  Pattern not found: ${patternName}.html (skipping)`);
    return "";
  }
  return fs.readFileSync(patternPath, "utf8").trim();
}

/**
 * Assemble page content from patterns.
 */
function assemblePageContent(page, brandSlug) {
  const patterns = Array.isArray(page.patterns) ? page.patterns : [];
  
  if (patterns.length === 0) {
    // No patterns defined, use placeholder
    const title = page.title || "Page";
    return {
      title: page.title || "Page",
      content: `<h1>${title}</h1><p>This is a placeholder page for ${brandSlug}.</p>`,
    };
  }

  // Load and combine all patterns
  const patternContents = [];
  for (const patternName of patterns) {
    const patternHtml = loadPattern(patternName);
    if (patternHtml) {
      patternContents.push(patternHtml);
    }
  }

  if (patternContents.length === 0) {
    // Patterns listed but none found, use placeholder
    const title = page.title || "Page";
    return {
      title: page.title || "Page",
      content: `<h1>${title}</h1><p>This is a placeholder page for ${brandSlug}. Patterns listed but not found: ${patterns.join(", ")}</p>`,
    };
  }

  // Combine patterns with spacing
  const combinedContent = patternContents.join("\n\n");

  return {
    title: page.title || "Page",
    content: combinedContent,
  };
}

// Process each page in sitemap
let pagesCreated = 0;
let pagesUpdated = 0;

for (const [key, page] of Object.entries(sitemap)) {
  if (page.type === "archive") {
    // Archives use block templates; no per-page JSON needed.
    continue;
  }

  const slug = key === "home" ? "home" : key;
  const targetPath = path.join(contentDir, `${slug}.json`);

  // Assemble content from patterns
  const { title, content } = assemblePageContent(page, brand);

  // Read existing file if it exists to preserve manual edits (if content field exists)
  let existingData = {};
  if (fs.existsSync(targetPath)) {
    try {
      existingData = JSON.parse(fs.readFileSync(targetPath, "utf8"));
    } catch (e) {
      // Invalid JSON, will overwrite
    }
  }

  // If existing file has manual content and no "auto_update" flag, preserve it
  if (existingData.content && !existingData.auto_update) {
    console.log(`   ⏭️  Skipping ${slug}.json (has manual content, set "auto_update": true to override)`);
    continue;
  }

  // Write assembled page JSON
  const pageData = {
    title,
    content, // Gutenberg block HTML
    auto_update: true, // Flag to allow automated updates
    patterns: page.patterns || [],
  };

  fs.writeFileSync(targetPath, JSON.stringify(pageData, null, 2));

  if (existingData.content) {
    pagesUpdated++;
  } else {
    pagesCreated++;
  }
}

console.log(
  `✅ Assembled pages for brand=${brand} from sitemap:`,
);
console.log(`   Created: ${pagesCreated}, Updated: ${pagesUpdated}`);
console.log(`   Output: ${contentDir}`);
