#!/usr/bin/env node
/**
 * Generate assets/css/cursor.css from brand design tokens.
 *
 * Usage:
 *   node scripts/design/generate-cursor-css.mjs --brand=hezlep-inc
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
const cssPath = path.join(
  repoRoot,
  "infra",
  "wordpress",
  "themes",
  "astra-child",
  "assets",
  "css",
  "cursor.css",
);

if (!fs.existsSync(tokensPath)) {
  console.error(`❌ Tokens not found for brand=${brand}: ${tokensPath}`);
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

fs.writeFileSync(cssPath, css);
console.log(`✅ Generated cursor.css for brand=${brand} -> ${cssPath}`);


