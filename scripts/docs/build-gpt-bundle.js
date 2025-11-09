#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const SRC  = path.join(ROOT, 'Documents', 'gpt');
const OUT  = path.join(ROOT, 'Documents', 'gpt-bundle.md');

const order = [
  'INDEX.md','Roadmap.md','Project-Map.md','Playbook.md',
  'Orchestrator-API.md','Kit-Workflow.md','Elementor-Kit-Pipeline.md',
  'CI-CD.md','WP-CLI-Recipes.md','Template-Manifest.example.md','Prompts.md'
];

const banner = n => `\n\n---\n# ${n}\n---\n\n`;

let out = `# Hezlep Ops — GPT Docs Bundle\n_Generated: ${new Date().toISOString()}_\n`;
if (!fs.existsSync(SRC)) {
  console.error(`Missing source folder: ${SRC}`);
  process.exit(1);
}

order.forEach(f => {
  const p = path.join(SRC, f);
  if (fs.existsSync(p)) {
    out += banner(f) + fs.readFileSync(p, 'utf8').trim() + '\n';
  }
});
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, out);
console.log(`Wrote ${OUT}`);


