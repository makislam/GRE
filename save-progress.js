#!/usr/bin/env node
/* Save exported progress to GitHub.
     node save-progress.js              merge the newest progress*.json in Downloads into data/progress.json, commit, push
     node save-progress.js <file>       use that export instead
     node save-progress.js --no-push    commit only
   In the site: Save & load progress -> Export progress first. Merging follows js/progress-merge.js, so tests
   already in the repo are kept even if the export doesn't have them. No dependencies; needs git on PATH. */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { mergeSnapshots } = require('./js/progress-merge.js');

const ROOT = __dirname;
const REL = 'data/progress.json';
const FILE = path.join(ROOT, REL);
const args = process.argv.slice(2);
const push = !args.includes('--no-push');
const fail = msg => { console.error(msg); process.exit(1); };
const git = (...a) => execFileSync('git', a, { cwd: ROOT, stdio: ['ignore', 'pipe', 'inherit'] }).toString();

function newestExport() {
  const dir = path.join(os.homedir(), 'Downloads');
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => /^progress.*\.json$/i.test(f)) : [];
  if (!files.length) fail(`No progress*.json in ${dir}. Export your progress from the site first, or pass the file path.`);
  return files.map(f => path.join(dir, f)).sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0];
}

const src = args.find(a => !a.startsWith('--')) || newestExport();
let incoming;
try { incoming = JSON.parse(fs.readFileSync(src, 'utf8')); } catch (e) { fail(`Can't read ${src}: ${e.message}`); }
if (!incoming || !incoming.ts || !incoming.data) fail(`${src} is not a GRE progress file.`);

let current = { ts: {}, data: {} };
try { current = JSON.parse(fs.readFileSync(FILE, 'utf8')); } catch (e) { /* first save */ }
const merged = mergeSnapshots(current, { ts: incoming.ts, data: incoming.data });
fs.writeFileSync(FILE, JSON.stringify(merged, null, 1) + '\n');

const tests = (merged.data['gre.history'] || []).length;
console.log(`Merged ${src}${incoming.exported ? ` (exported ${incoming.exported})` : ''} into ${REL}: ${tests} test${tests === 1 ? '' : 's'} in history.`);

git('add', '--', REL);
try { git('diff', '--cached', '--quiet', '--', REL); console.log('No new progress to commit.'); }
catch (e) { git('commit', '-m', 'Update GRE progress', '--', REL); console.log('Committed.'); }

if (push) {
  try { git('push'); console.log('Pushed to GitHub.'); } catch (e) { fail('git push failed (see above).'); }
}
