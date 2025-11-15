#!/usr/bin/env node
/**
 * Generate theme.json for Ops Astra Child from brand design tokens.
 *
 * Usage:
 *   node scripts/design/generate-theme-json.mjs --brand=hezlep-inc
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
const tokensPath = path.join(
  repoRoot,
  "infra",
  "wordpress",
  "brands",
  brand,
  "tokens",
  "design-tokens.json",
);
const themePath = path.join(
  repoRoot,
  "infra",
  "wordpress",
  "themes",
  "astra-child",
  "theme.json",
);

if (!fs.existsSync(tokensPath)) {
  console.error(`❌ Tokens not found for brand=${brand}: ${tokensPath}`);
  process.exit(1);
}

const tokens = JSON.parse(fs.readFileSync(tokensPath, "utf8"));

const theme = {
  $schema: "https://schemas.wp.org/trunk/theme.json",
  version: 2,
  settings: {
    color: {
      palette: [
        { slug: "primary", color: tokens.palette.primary, name: "Primary" },
        { slug: "accent", color: tokens.palette.accent, name: "Accent" },
        { slug: "background", color: tokens.palette.background, name: "Background" },
        { slug: "surface", color: tokens.palette.surface, name: "Surface" },
        { slug: "text", color: tokens.palette.text, name: "Text" },
        { slug: "muted", color: tokens.palette.muted, name: "Muted" },
      ],
    },
    typography: {
      fontFamilies: [
        {
          slug: "heading",
          fontFamily: `${tokens.typography.headingFont}, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
          name: "Heading",
        },
        {
          slug: "body",
          fontFamily: `${tokens.typography.bodyFont}, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
          name: "Body",
        },
      ],
    },
  },
};

fs.writeFileSync(themePath, JSON.stringify(theme, null, 2));
console.log(`✅ Generated theme.json for brand=${brand} -> ${themePath}`);


