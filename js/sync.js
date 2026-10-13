/* Progress backup through a file in the repo (no token, no server).
   Export downloads progress.json; commit it as data/progress.json and every device that opens the
   deployed site merges it in on load. Import also accepts a file picked by hand.
   Every localStorage key starting "gre." is mirrored and merged per key, newest change winning. */
(function () {
  'use strict';
  const P = 'gre.', TS_KEY = 'gre._ts', URL = 'data/progress.json';
  const ls = window.localStorage, rawSet = Storage.prototype.setItem, rawDel = Storage.prototype.removeItem;
  const tracked = k => k.indexOf(P) === 0 && k !== TS_KEY;
  const j = (s, d) => { try { return s == null ? d : JSON.parse(s); } catch (e) { return d; } };
  const getTs = () => j(ls.getItem(TS_KEY), {});
  const setTs = t => rawSet.call(ls, TS_KEY, JSON.stringify(t));

  function touch(k) { const t = getTs(); t[k] = Date.now(); setTs(t); saveSoon(); }
  Storage.prototype.setItem = function (k, v) { rawSet.call(this, k, v); if (this === ls && tracked(k)) touch(k); };
  Storage.prototype.removeItem = function (k) { rawDel.call(this, k); if (this === ls && tracked(k)) touch(k); };

  /* {ts, data}: data has an entry (null for deleted keys) for every timestamped key, so deletions merge too */
  function snapshot() {
    const ts = getTs(), data = {};
    Object.keys(ls).filter(tracked).forEach(k => { if (!ts[k]) ts[k] = 1; });
    Object.keys(ts).forEach(k => { const v = ls.getItem(k); data[k] = v == null ? null : j(v, null); });
    return { ts, data };
  }

  /* Merge a snapshot into local storage; returns true if anything local changed. */
  function merge(remote) {
    if (!remote || typeof remote !== 'object' || !remote.ts || !remote.data) throw new Error('Not a GRE progress file');
    const local = snapshot(), ts = Object.assign({}, local.ts);
    let changed = false;
    Object.keys(remote.ts).forEach(k => {
      if (!tracked(k) || (remote.ts[k] || 0) <= (local.ts[k] || 0)) return;
      if (remote.data[k] != null) rawSet.call(ls, k, JSON.stringify(remote.data[k])); else rawDel.call(ls, k);
      ts[k] = remote.ts[k]; changed = true;
    });
    setTs(ts);
    return changed;
  }

  function exportFile() {
    const blob = new Blob([JSON.stringify(Object.assign({ exported: new Date().toISOString() }, snapshot()))], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL_.createObjectURL(blob); a.download = 'progress.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL_.revokeObjectURL(a.href), 1000);
  }
  const URL_ = window.URL;

  /* When served by server.js, push every change to /api/progress (it writes and commits data/progress.json).
     On GitHub Pages or file:// this quietly does nothing. */
  let saveTimer = null, serverOk = true;
  function saveSoon() {
    if (!serverOk || !/^https?:$/.test(location.protocol)) return;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      fetch('/api/progress', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(snapshot()) })
        .then(r => { if (!r.ok) serverOk = false; }).catch(() => { serverOk = false; });
    }, 1500);
  }
  window.addEventListener('pagehide', () => {
    if (serverOk && saveTimer && navigator.sendBeacon) navigator.sendBeacon('/api/progress', new Blob([JSON.stringify(snapshot())], { type: 'application/json' }));
  });

  const inTest = () => !!document.querySelector('.tbtns');

  function open() {
    const ov = document.createElement('div');
    ov.className = 'modal-ov';
    ov.innerHTML = `<div class="modal"><div class="modal-h">Save &amp; load progress</div><div class="modal-b">
      <p>If you started the site with <code>node server.js</code>, progress is saved to <code>data/progress.json</code> and committed automatically. Otherwise it lives in this browser only. To move it by hand:</p>
      <ol class="small"><li>Click <b>Export progress</b> to download <code>progress.json</code>.</li>
        <li>Put it in the repo as <code>data/progress.json</code>, then commit and push.</li>
        <li>The deployed site loads it automatically on every device (newest change per item wins).</li></ol>
      <p class="small muted">No GitHub token is involved. Progress is only as fresh as your last export, and anyone who can see the repo can read this file, so keep the repo private if you don't want your scores public. You can also <b>Import</b> a file by hand, for example one sent to your phone.</p>
      <p id="sync-msg" class="small"></p></div>
      <div class="modal-f"><button class="btn" id="sync-imp">Import file…</button><button class="btn primary" id="sync-exp">Export progress</button><button class="btn" id="sync-x">Close</button></div>
      <input type="file" id="sync-file" accept=".json,application/json" hidden></div>`;
    document.body.appendChild(ov);
    const q = id => ov.querySelector('#' + id), msg = t => { q('sync-msg').textContent = t; };
    q('sync-x').onclick = () => ov.remove();
    q('sync-exp').onclick = () => { exportFile(); msg('Downloaded progress.json. Commit it to data/progress.json.'); };
    q('sync-imp').onclick = () => q('sync-file').click();
    q('sync-file').onchange = e => {
      const f = e.target.files[0]; if (!f) return;
      f.text().then(t => {
        const changed = merge(JSON.parse(t));
        if (changed && !inTest()) location.reload(); else msg(changed ? 'Imported. Reload the page to see it.' : 'Nothing newer in that file.');
      }).catch(err => msg('Import failed: ' + err.message));
    };
  }

  window.GRESync = { open, exportFile };

  /* On load, merge the committed data/progress.json if the site is served over http(s). */
  if (/^https?:$/.test(location.protocol)) {
    fetch(URL + '?t=' + Date.now(), { cache: 'no-store' })
      .then(r => (r.ok ? r.json() : null))
      .then(r => { if (r && merge(r) && !inTest()) location.reload(); })
      .catch(() => { /* no file yet, or invalid: ignore */ });
  }
})();
