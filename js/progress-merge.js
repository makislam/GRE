/* Merge rules for progress snapshots ({ts, data}), shared by sync.js (browser), server.js and save-progress.js.
   Most keys: newest change wins. Test history and seen questions are combined instead, so loading an older
   or partial save never drops tests that only one side has. */
(function (root) {
  'use strict';
  const isObj = v => v && typeof v === 'object' && !Array.isArray(v);
  const UNION = {
    'gre.history': (a, b) => {
      if (!Array.isArray(a) || !Array.isArray(b)) return null;
      const ids = new Set();
      return a.concat(b).filter(t => t && !ids.has(t.id) && ids.add(t.id)).sort((x, y) => (y.date || 0) - (x.date || 0));
    },
    'gre.seen': (a, b) => (isObj(a) && isObj(b) ? Object.assign({}, b, a) : null)
  };

  /* Merge one key: a/ta is the current side, b/tb the incoming one. Returns [value, ts]. */
  function mergeKey(k, a, ta, b, tb) {
    ta = ta || 0; tb = tb || 0;
    const newer = tb > ta ? [b, tb] : [a, ta];
    if (UNION[k] && a != null && b != null) {
      const u = UNION[k](newer[0] === a ? a : b, newer[0] === a ? b : a);
      if (u) return [u, Math.max(ta, tb)];
    }
    return newer;
  }

  /* Merge snapshot b into snapshot a; returns a new snapshot. */
  function mergeSnapshots(a, b) {
    const out = { ts: Object.assign({}, a.ts), data: Object.assign({}, a.data) };
    Object.keys(b.ts).forEach(k => {
      const [v, t] = mergeKey(k, out.data[k], out.ts[k], b.data[k] == null ? null : b.data[k], b.ts[k]);
      out.data[k] = v == null ? null : v; out.ts[k] = t;
    });
    return out;
  }

  const api = { mergeKey, mergeSnapshots };
  if (typeof module === 'object' && module.exports) module.exports = api; else root.GREMerge = api;
})(this);
