#!/usr/bin/env node
/* Local server for the GRE site: serves the files, saves progress to data/progress.json and commits it.
     node server.js                 http://localhost:8080, commit only
     PORT=3000 node server.js       other port
     HOST=0.0.0.0 node server.js    also reachable from your phone on the same Wi-Fi (no auth, trusted networks only)
     PUSH=1 node server.js          also `git push` after each commit
   No dependencies. Needs git on PATH and this folder to be a git repository. */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const ROOT = __dirname;
const FILE = path.join(ROOT, 'data', 'progress.json');
const REL = 'data/progress.json';
const PORT = +process.env.PORT || 8080;
const HOST = process.env.HOST || '127.0.0.1';
const PUSH = process.env.PUSH === '1';
const COMMIT_DELAY_MS = 30 * 1000; // wait for a quiet period so one session is one commit
const MAX_BODY = 5 * 1024 * 1024;
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.pdf': 'application/pdf', '.md': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' };

const readProgress = () => { try { return JSON.parse(fs.readFileSync(FILE, 'utf8')); } catch (e) { return { ts: {}, data: {} }; } };

/* Per-key newest-timestamp-wins merge, so several devices can save without clobbering each other. */
function merge(a, b) {
  const out = { ts: Object.assign({}, a.ts), data: Object.assign({}, a.data) };
  Object.keys(b.ts).forEach(k => {
    if ((b.ts[k] || 0) > (out.ts[k] || 0)) { out.ts[k] = b.ts[k]; out.data[k] = b.data[k] == null ? null : b.data[k]; }
  });
  return out;
}
const valid = o => o && typeof o === 'object' && o.ts && typeof o.ts === 'object' && o.data && typeof o.data === 'object';

const git = (args, cb) => execFile('git', args, { cwd: ROOT }, cb);
let timer = null, committing = false;
function scheduleCommit() {
  clearTimeout(timer);
  timer = setTimeout(commit, COMMIT_DELAY_MS);
}
function commit() {
  if (committing) return scheduleCommit();
  committing = true;
  // Only this file is staged/committed, so unrelated working-tree changes are left alone.
  git(['add', '--', REL], err => {
    if (err) { committing = false; return console.error('git add failed:', err.message); }
    git(['diff', '--cached', '--quiet', '--', REL], diffErr => {
      if (!diffErr) { committing = false; return; } // nothing changed
      git(['commit', '-m', 'Update GRE progress', '--', REL], (cErr, out) => {
        committing = false;
        if (cErr) return console.error('git commit failed:', cErr.message);
        console.log('Committed progress.');
        if (PUSH) git(['push'], pErr => console.log(pErr ? 'git push failed: ' + pErr.message : 'Pushed.'));
      });
    });
  });
}
// Don't lose the last few changes if the server is stopped during the quiet period.
function flushAndExit() { if (timer) { clearTimeout(timer); timer = null; commit(); setTimeout(() => process.exit(0), 1500); } else process.exit(0); }
process.on('SIGINT', flushAndExit);
process.on('SIGTERM', flushAndExit);

function handleApi(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'GET') { res.setHeader('Content-Type', 'application/json'); return res.end(JSON.stringify(readProgress())); }
  if (req.method !== 'POST') { res.statusCode = 405; return res.end(); }
  let size = 0; const chunks = [];
  req.on('data', c => { size += c.length; if (size > MAX_BODY) { res.statusCode = 413; res.end(); req.destroy(); } else chunks.push(c); });
  req.on('end', () => {
    let body;
    try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch (e) { body = null; }
    if (!valid(body)) { res.statusCode = 400; return res.end('bad progress file'); }
    const merged = merge(readProgress(), body);
    const text = JSON.stringify(merged, null, 1) + '\n';
    let before = ''; try { before = fs.readFileSync(FILE, 'utf8'); } catch (e) { /* first save */ }
    if (text !== before) { fs.writeFileSync(FILE, text); scheduleCommit(); }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: true }));
  });
}

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/api/progress') return handleApi(req, res);
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.statusCode = 405; return res.end(); }
  let p;
  try { p = decodeURIComponent(url.pathname); } catch (e) { res.statusCode = 400; return res.end(); }
  if (p.endsWith('/')) p += 'index.html';
  const file = path.normalize(path.join(ROOT, p));
  const rel = path.relative(ROOT, file);
  // stay inside the project and never serve git internals or the server itself
  if (rel.startsWith('..') || path.isAbsolute(rel) || /(^|[\\/])\.git([\\/]|$)/.test(rel) || rel === 'server.js') { res.statusCode = 404; return res.end('Not found'); }
  fs.readFile(file, (err, buf) => {
    if (err) { res.statusCode = 404; return res.end('Not found'); }
    res.setHeader('Content-Type', TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.end(req.method === 'HEAD' ? undefined : buf);
  });
}).listen(PORT, HOST, () => {
  console.log(`GRE practice running at http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
  console.log(`Progress saves to ${REL} and is committed ${COMMIT_DELAY_MS / 1000}s after the last change${PUSH ? ', then pushed' : ' (not pushed)'}.`);
});
