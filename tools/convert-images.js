#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');
let sharp;
try { sharp = require('sharp'); } catch (e) { /* handled later */ }

const ROOT = process.cwd();
const args = process.argv.slice(2);
const START_DIRS = args.length ? args : ['assets', 'public', 'images'];

const IGNORED_DIRS = ['node_modules', '.git', 'dist', 'build'];
const SUPPORTED_EXTS = ['.png', '.jpg', '.jpeg', '.webp'];
const CODE_EXTS = ['.php', '.html', '.css', '.js', '.ts', '.tsx', '.jsx', '.json'];

const manifest = [];

function isIgnored(fullPath) {
  return IGNORED_DIRS.some(d => fullPath.split(path.sep).includes(d));
}

async function walk(dir, cb) {
  let entries;
  try { entries = await fs.readdir(dir, { withFileTypes: true }); } catch (err) { return; }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (isIgnored(full)) continue;
      await walk(full, cb);
    } else if (entry.isFile()) {
      await cb(full);
    }
  }
}

async function convertFile(file) {
  const ext = path.extname(file).toLowerCase();
  if (!SUPPORTED_EXTS.includes(ext)) return;
  const avifPath = file.replace(/\.[^/.]+$/, '.avif');
  try {
    const avifStat = await fs.stat(avifPath).catch(() => null);
    if (avifStat) {
      const origStat = await fs.stat(file).catch(() => null);
      if (origStat && avifStat.mtimeMs >= origStat.mtimeMs) {
        manifest.push({ from: path.relative(ROOT, file).replace(/\\/g, '/'), to: path.relative(ROOT, avifPath).replace(/\\/g, '/') });
        console.log('Up-to-date, skipping:', path.relative(ROOT, file));
        return;
      }
    }
    if (!sharp) throw new Error('sharp not installed');
    await sharp(file).avif({ quality: 60 }).toFile(avifPath);
    manifest.push({ from: path.relative(ROOT, file).replace(/\\/g, '/'), to: path.relative(ROOT, avifPath).replace(/\\/g, '/') });
    console.log('Converted:', path.relative(ROOT, file), '->', path.relative(ROOT, avifPath));
  } catch (err) {
    console.error('Failed to convert', file, '-', err.message);
  }
}

async function updateLinks() {
  const filesToPatch = [];
  async function collect(file) {
    const ext = path.extname(file).toLowerCase();
    if (CODE_EXTS.includes(ext)) filesToPatch.push(file);
  }
  await walk(ROOT, collect);

  const updatedFiles = [];
  for (const file of filesToPatch) {
    let content;
    try { content = await fs.readFile(file, 'utf8'); } catch (e) { continue; }
    let updated = content;
    for (const m of manifest) {
      const from = m.from.replace(/\\/g, '/');
      const to = m.to.replace(/\\/g, '/');
      const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // replace full relative path
      updated = updated.replace(new RegExp(esc(from), 'g'), to);
      // replace basename
      const baseFrom = path.posix.basename(from);
      const baseTo = path.posix.basename(to);
      updated = updated.replace(new RegExp(esc(baseFrom), 'g'), baseTo);
    }
    if (updated !== content) {
      await fs.writeFile(file, updated, 'utf8');
      updatedFiles.push(path.relative(ROOT, file).replace(/\\/g, '/'));
      console.log('Patched:', path.relative(ROOT, file));
    }
  }
  return updatedFiles;
}

async function main() {
  console.log('Starting AVIF conversion; scanning:', START_DIRS.join(', '));
  for (const d of START_DIRS) {
    const full = path.join(ROOT, d);
    await walk(full, async (file) => {
      try { await convertFile(file); } catch (e) { console.error('convert error', e.message); }
    });
  }

  const manifestPath = path.join('tools', 'avif-manifest.json');
  await fs.mkdir(path.dirname(manifestPath), { recursive: true });
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log('Wrote manifest:', manifestPath);

  console.log('Updating references in code files...');
  const patched = await updateLinks();
  console.log('Updated', patched.length, 'files.');
  console.log('Done. See', manifestPath);
}

main().catch(err => { console.error(err); process.exit(1); });
