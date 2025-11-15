#!/usr/bin/env node
/**
 * Generate assets/css/cursor.css from brand design tokens.
 *
 * Usage:
 *   node scripts/design/generate-cursor-css.mjs --brand=hezlep-inc
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

// Try preferred location first (root), fall back to nested (tokens/)
let tokensPath = path.join(brandRoot, "design-tokens.json");
if (!fs.existsSync(tokensPath)) {
  tokensPath = path.join(brandRoot, "tokens", "design-tokens.json");
}

if (!fs.existsSync(tokensPath)) {
  console.error(`❌ Tokens not found for brand=${brand}. Checked:`);
  console.error(`   - ${path.join(brandRoot, "design-tokens.json")}`);
  console.error(`   - ${path.join(brandRoot, "tokens", "design-tokens.json")}`);
  process.exit(1);
}

const tokens = JSON.parse(fs.readFileSync(tokensPath, "utf8"));

const css = `:root {
  --brand-primary: ${tokens.palette.primary};
  --brand-primary-alt: ${tokens.palette.primaryAlt};
  --brand-accent: ${tokens.palette.accent};
  --brand-background: ${tokens.palette.background};
  --brand-surface: ${tokens.palette.surface};
  --brand-text: ${tokens.palette.text};
  --brand-muted: ${tokens.palette.muted};

  --brand-radius-sm: ${tokens.radius.sm};
  --brand-radius-md: ${tokens.radius.md};
  --brand-radius-lg: ${tokens.radius.lg};

  --brand-spacing-sm: ${tokens.spacing.sm};
  --brand-spacing-md: ${tokens.spacing.md};
  --brand-spacing-lg: ${tokens.spacing.lg};
}

.btn-primary {
  background-color: var(--brand-primary);
  color: #fff;
  border-radius: var(--brand-radius-md);
  padding: 0.75rem 1.5rem;
}

.section-surface {
  background-color: var(--brand-surface);
}
`;

// Output to both locations (hybrid support):
// 1. Brand root (preferred structure)
const brandCssPath = path.join(brandRoot, "cursor.css");
fs.writeFileSync(brandCssPath, css);

// 2. Assets directory (current structure - for backward compatibility)
const assetsCssPath = path.join(brandRoot, "assets", "css", "cursor.css");
fs.mkdirSync(path.dirname(assetsCssPath), { recursive: true });
fs.writeFileSync(assetsCssPath, css);

// 3. Shared theme location (current structure - for backward compatibility)
const sharedCssPath = path.join(
  repoRoot,
  "infra",
  "wordpress",
  "themes",
  "astra-child",
  "assets",
  "css",
  "cursor.css",
);
fs.mkdirSync(path.dirname(sharedCssPath), { recursive: true });
fs.writeFileSync(sharedCssPath, css);

console.log(`✅ Generated cursor.css for brand=${brand}:`);
console.log(`   → ${brandCssPath} (preferred)`);
console.log(`   → ${assetsCssPath} (brand assets, backward compat)`);
console.log(`   → ${sharedCssPath} (shared theme, backward compat)`);


