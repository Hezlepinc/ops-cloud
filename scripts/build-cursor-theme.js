import fs from "fs";

const brand = process.argv[2] || process.env.DEPLOY_SITE;
if (!brand) {
  console.error("❌  Usage: node scripts/build-cursor-theme.js <brand> or set DEPLOY_SITE");
  process.exit(1);
}

const path = `infra/wordpress/brands/${brand}/cursor.json`;
if (!fs.existsSync(path)) {
  console.error(`❌  Brand config not found: ${path}`);
  process.exit(1);
}
const data = JSON.parse(fs.readFileSync(path));

/* === Build cursor.css === */
const css = `:root {
  --color-primary: ${data.primary};
  --color-primary-600: ${data.primary600};
  --color-accent: ${data.accent};
  --color-bg: ${data.background};
  --color-surface: ${data.surface};
  --color-text: ${data.text};
  --color-muted: ${data.muted};
  --color-border: ${data.border};
  --font-display: "${data.fontDisplay}", sans-serif;
  --font-body: "${data.fontBody}", sans-serif;
  --radius: 12px;
  --shadow-sm: 0 1px 2px rgba(0,0,0,.06);
  --shadow-md: 0 4px 12px rgba(0,0,0,.08);
}`;

const cssOut = `infra/wordpress/brands/${brand}/assets/css/cursor.css`;
fs.mkdirSync(`infra/wordpress/brands/${brand}/assets/css`, { recursive: true });
fs.writeFileSync(cssOut, css);

/* === Build cursor-sitekit.json (Elementor) === */
const kit = {
  version: "3.0.0",
  title: `${brand} Cursor Kit`,
  settings: {
    global_colors: [
      { name: "Cursor Primary", value: data.primary },
      { name: "Cursor Primary Dark", value: data.primary600 },
      { name: "Cursor Accent", value: data.accent },
      { name: "Cursor Text", value: data.text },
      { name: "Cursor Muted", value: data.muted },
      { name: "Cursor Surface", value: data.surface },
      { name: "Cursor Border", value: data.border },
      { name: "Cursor Background", value: data.background }
    ],
    global_typography: {
      headings: { family: data.fontDisplay, weight: "600" },
      text: { family: data.fontBody, weight: "400" }
    }
  }
};
const kitOut = `infra/wordpress/brands/${brand}/elementor/cursor-sitekit.json`;
fs.mkdirSync(`infra/wordpress/brands/${brand}/elementor`, { recursive: true });
fs.writeFileSync(kitOut, JSON.stringify(kit, null, 2));

console.log(`✅ Built Cursor theme assets for ${brand}`);