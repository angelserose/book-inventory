#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Very conservative transformer: only renames declarations whose identifier is exactly "Angel"
// to unique names like Angel_1, Angel_2, etc.
// - Targets only var/let/const, function, and class declarations named exactly "Angel"
// - Skips identifiers that appear in import/export statements in the same file
// - Avoids changing import/export lines; best-effort skip for strings/comments
// - Creates a backup of src/ before editing and logs processed files to scripts/prefixAngel.log
// WARNING: This is still a text-based transform. Review changes before committing.

const ROOT = path.join(__dirname, '..', 'src');
const LOG_FILE = path.join(__dirname, 'prefixAngel.log');
let counter = 1;
const DRY = process.argv.includes('--dry') || process.argv.includes('-d');
const dryResults = []; // collect { file, replacementsCount, sampleReplacements }
const supportedExt = /\.(js|jsx|ts|tsx)$/i;

function walk(dir, cb) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir, { withFileTypes: true }).forEach(d => {
    const full = path.join(dir, d.name);
    if (d.isDirectory()) walk(full, cb);
    else if (supportedExt.test(d.name)) cb(full);
  });
}

function stripStringsAndComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '')
    .replace(/(['"`])(?:\\.|(?!\1).)*\1/g, '');
}

function backupSrc() {
  if (DRY) return null; // don't create backups during dry-run
  if (!fs.existsSync(ROOT)) return null;
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const dest = path.join(path.dirname(ROOT), `src_backup_before_angel_${timestamp}`);
  // copy recursively (simple implementation)
  function copyRecursive(src, dst) {
    if (!fs.existsSync(dst)) fs.mkdirSync(dst, { recursive: true });
    fs.readdirSync(src, { withFileTypes: true }).forEach(entry => {
      const s = path.join(src, entry.name);
      const d = path.join(dst, entry.name);
      if (entry.isDirectory()) copyRecursive(s, d);
      else fs.copyFileSync(s, d);
    });
  }
  copyRecursive(ROOT, dest);
  return dest;
}

function log(msg) {
  fs.appendFileSync(LOG_FILE, msg + '\n', 'utf8');
}

function processFile(file) {
  let src = fs.readFileSync(file, 'utf8');
  const srcSanitized = stripStringsAndComments(src);

  // Collect names that appear in import or export statements - we will NOT rename these
  const exclude = new Set();
  const importRegex = /import\s+([\s\S]+?)\s+from\s+['\"][^'\"]+['\"]/g;
  let m;
  while ((m = importRegex.exec(srcSanitized)) !== null) {
    const spec = m[1].trim();
    if (spec.startsWith('{')) {
      const names = spec.replace(/[{}]/g, '').split(',').map(s => s.split(' as ')[1] ? s.split(' as ')[1].trim() : s.split(' as ')[0].trim());
      names.forEach(n => n && exclude.add(n));
    } else if (spec.startsWith('* as')) {
      const name = spec.split('as')[1].trim();
      exclude.add(name);
    } else {
      exclude.add(spec.split(',')[0].trim());
    }
  }

  const exportRegex = /export\s+(?:\{([^}]*)\}|default\s+([A-Za-z_$][\w$]*)|const\s+([A-Za-z_$][\w$]*)|let\s+([A-Za-z_$][\w$]*)|var\s+([A-Za-z_$][\w$]*)|function\s+([A-Za-z_$][\w$]*)|class\s+([A-Za-z_$][\w$]*))/g;
  while ((m = exportRegex.exec(srcSanitized)) !== null) {
    for (let i = 1; i < m.length; i++) {
      if (m[i]) {
        if (i === 1) {
          m[i].split(',').map(s => s.split(' as ')[1] ? s.split(' as ')[1].trim() : s.split(' as ')[0].trim()).forEach(n => n && exclude.add(n));
        } else {
          exclude.add(m[i].trim());
        }
      }
    }
  }

  // Find declarations for identifiers named exactly 'Angel'
  const declRegex = /\b(?:const|let|var)\s+(Angel)\b/g;
  const funcRegex = /\bfunction\s+(Angel)\b/g;
  const classRegex = /\bclass\s+(Angel)\b/g;

  const occurrences = new Set();
  function collect(regex) {
    let mm;
    while ((mm = regex.exec(srcSanitized)) !== null) {
      const name = mm[1];
      if (name && !exclude.has(name)) occurrences.add(name);
    }
  }
  collect(declRegex);
  collect(funcRegex);
  collect(classRegex);

  if (occurrences.size === 0) return;

  const map = {};
  occurrences.forEach(orig => {
    if (orig === 'Angel') map[orig] = `Angel_${counter++}`;
  });

  if (Object.keys(map).length === 0) return;

  const lines = src.split(/\r?\n/);
  const changedLines = [];
  const importExportLineRegex = /^\s*(?:import|export)\b/;

  let anyChange = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (importExportLineRegex.test(line)) { changedLines.push(line); continue; }
    let newLine = line;
    for (const [orig, repl] of Object.entries(map)) {
      const r = new RegExp('\\b' + orig + '\\b', 'g');
      if (r.test(newLine)) anyChange = true;
      newLine = newLine.replace(r, repl);
    }
    changedLines.push(newLine);
  }

  if (anyChange) {
    const newSrc = changedLines.join('\n');
    if (DRY) {
      // collect summary info instead of writing
      const sample = [];
      for (let i = 0; i < Math.min(5, changedLines.length); i++) {
        if (lines[i] !== changedLines[i]) sample.push({ line: i + 1, before: lines[i], after: changedLines[i] });
      }
      dryResults.push({ file, replacementsCount: Object.keys(map).length, sampleReplacements: sample });
      console.log('[dry] Would process:', file);
      log('[dry] Would process: ' + file);
    } else {
      fs.writeFileSync(file, newSrc, 'utf8');
      console.log('Processed:', file);
      log('Processed: ' + file);
    }
  }
}

// Clear or create log file
fs.writeFileSync(LOG_FILE, 'prefixAngel run at ' + new Date().toISOString() + (DRY ? ' (dry-run)' : '') + '\n', 'utf8');

// Make backup unless dry
const backupPath = backupSrc();
if (backupPath) console.log('Backup created at', backupPath) && log('Backup created at ' + backupPath);

walk(ROOT, processFile);

if (DRY) {
  console.log('\nDry-run summary:');
  if (dryResults.length === 0) console.log('  No files would be changed.');
  dryResults.forEach(r => {
    console.log(`  Would change: ${r.file} — replacements: ${r.replacementsCount}`);
    if (r.sampleReplacements && r.sampleReplacements.length) {
      console.log('    Sample replacements:');
      r.sampleReplacements.forEach(s => console.log(`      line ${s.line}: "${s.before}" => "${s.after}"`));
    }
  });
  log('Dry-run completed. ' + (dryResults.length) + ' files would be changed.');
} else {
  console.log('Prefixing complete. Please review changes and run your tests.');
  log('Prefixing complete.');
}
