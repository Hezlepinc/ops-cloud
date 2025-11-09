#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const args = require('minimist')(process.argv.slice(2));

const manifestPath = path.resolve(args.manifest || 'templates/template.manifest.json');
const outPath = path.resolve(args.out || 'dist/kit.zip');

if (!fs.existsSync(manifestPath)) {
  console.error(`Manifest not found: ${manifestPath}`);
  process.exit(1);
}
const manifest = JSON.parse(fs.readFileSync(manifestPath,'utf8'));
if (!manifest.mappings || !Array.isArray(manifest.mappings)) {
  console.error('Invalid manifest: missing "mappings"');
  process.exit(1);
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
const output = fs.createWriteStream(outPath);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => console.log(`Built ${outPath} (${archive.pointer()} bytes)`));
archive.on('error', (err) => { throw err; });
archive.pipe(output);

// include manifest in the zip for server stamping
archive.append(JSON.stringify(manifest, null, 2), { name: 'template.manifest.json' });

for (const m of manifest.mappings) {
  const src = path.resolve(m.src);
  if (!fs.existsSync(src)) { console.error(`Missing: ${src}`); process.exit(1); }
  const baseDir = m.type === 'site-settings' ? 'site-settings' : (m.type || 'templates');
  const name = m.slug ? `${m.slug}.json` : path.basename(src);
  archive.file(src, { name: `${baseDir}/${name}` });
}

archive.finalize();


