#!/usr/bin/env node
const fs = require('fs');
const p = process.argv[2] || 'templates/template.manifest.json';
if (!fs.existsSync(p)) {
  console.error('Manifest not found:', p);
  process.exit(1);
}
const m = JSON.parse(fs.readFileSync(p,'utf8'));
const req = ['brand','version','include','mappings'];
const miss = req.filter(k => !(k in m));
if (miss.length) { console.error('Missing keys:', miss.join(', ')); process.exit(1); }
if (!Array.isArray(m.mappings) || !m.mappings.length) { console.error('No mappings'); process.exit(1); }
console.log('Manifest OK:', m.brand, m.version, `${m.mappings.length} items`);


