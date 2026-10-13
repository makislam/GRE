/* GRE Practice — test engine, drills, vocabulary and history.
   Mirrors the current (post-Sept-2023) GRE General Test:
     Analytical Writing  1 "Analyze an Issue" task      30 min
     Verbal Reasoning    S1 12 q / 18 min, S2 15 q / 23 min
     Quantitative        S1 12 q / 21 min, S2 15 q / 26 min
   Second section of each measure is section-adaptive (difficulty set by S1 performance). */
(function () {
  'use strict';

  // ---------------------------------------------------------------- utilities
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const app = () => document.getElementById('app');
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const range = n => Array.from({ length: n }, (_, i) => i);
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const pad = n => String(n).padStart(2, '0');
  const clock = s => { s = Math.max(0, Math.ceil(s)); return pad(Math.floor(s / 3600)) + ':' + pad(Math.floor(s % 3600 / 60)) + ':' + pad(s % 60); };
  const mmss = s => { s = Math.max(0, Math.round(s || 0)); return Math.floor(s / 60) + ':' + pad(s % 60); };
  const LETTERS = 'ABCDEFGHIJ';
  const ROMAN = ['i', 'ii', 'iii'];
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const fmtDate = t => new Date(t).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });

  const store = {
    get(k, d) { try { const v = localStorage.getItem('gre.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('gre.' + k, JSON.stringify(v)); } catch (e) { /* storage full or blocked */ } },
    del(k) { try { localStorage.removeItem('gre.' + k); } catch (e) { /* ignore */ } }
  };

  // ---------------------------------------------------------------- data
  const D = {
    tc: window.VERBAL_TC || [], se: window.VERBAL_SE || [], passages: window.VERBAL_PASSAGES || [],
    quant: window.QUANT_BANK || [], sets: window.QUANT_SETS || [], gen: window.QUANT_GEN || null,
    vocab: window.VOCAB || [], study: window.MATH_STUDY || [], prompts: window.ISSUE_PROMPTS || [], rubric: window.ISSUE_RUBRIC || []
  };
  const PASSAGE = {}, QSET = {};
  D.passages.forEach(p => { PASSAGE[p.id] = p; });
  D.sets.forEach(s => { QSET[s.id] = s; });

  const MEASURE = { V: 'Verbal Reasoning', Q: 'Quantitative Reasoning', AW: 'Analytical Writing' };
  const SPEC = { V: [{ n: 12, min: 18 }, { n: 15, min: 23 }], Q: [{ n: 12, min: 21 }, { n: 15, min: 26 }], AW: { min: 30 } };
  const LEVEL_DIST = { 1: [0.6, 0.3, 0.1], 2: [0.25, 0.5, 0.25], 3: [0.1, 0.3, 0.6] };
  const LEVEL_NAME = { 1: 'Easier', 2: 'Medium', 3: 'Harder' };
  const DIFF_NAME = { 1: 'Easy', 2: 'Medium', 3: 'Hard' };
  const TYPE_NAME = {
    tc: 'Text Completion', se: 'Sentence Equivalence', 'rc-single': 'Reading Comp — single answer',
    'rc-multi': 'Reading Comp — select all', 'rc-select': 'Reading Comp — select in passage',
    qc: 'Quantitative Comparison', 'mc-single': 'Multiple Choice — one answer', 'mc-multi': 'Multiple Choice — one or more',
    numeric: 'Numeric Entry', fraction: 'Numeric Entry — fraction'
  };
  const QC_OPTS = ['Quantity A is greater.', 'Quantity B is greater.', 'The two quantities are equal.', 'The relationship cannot be determined from the information given.'];
  const MULTI = { se: 1, 'mc-multi': 1, 'rc-multi': 1 };
  const TOPIC_NAME = { arithmetic: 'Arithmetic', algebra: 'Algebra', geometry: 'Geometry', data: 'Data Analysis' };

  let SEEN = store.get('seen', {});
  const markSeen = items => { items.forEach(it => { SEEN[it.q.id] = (SEEN[it.q.id] || 0) + 1; }); store.set('seen', SEEN); };
  const settings = () => Object.assign({ timeMult: 1, untimed: false }, store.get('settings', {}));

  // ---------------------------------------------------------------- question selection
  function sampleDiff(level) {
    const d = LEVEL_DIST[level] || LEVEL_DIST[2], r = Math.random();
    return r < d[0] ? 1 : r < d[0] + d[1] ? 2 : 3;
  }

  // Lowest score wins: unseen first, then closeness to a sampled target difficulty, then topic balance.
  function pickOne(pool, level, used, filter, topicCount) {
    const target = level ? sampleDiff(level) : null;
    let best = null, bs = Infinity;
    for (const q of pool) {
      if (used.has(q.id) || (filter && !filter(q))) continue;
      let s = (SEEN[q.id] || 0) * 100 + Math.random() * 2;
      if (target) s += Math.abs((q.difficulty || 2) - target) * 3;
      if (topicCount && q.topic) s += (topicCount[q.topic] || 0) * 1.5;
      if (s < bs) { bs = s; best = q; }
    }
    if (best) used.add(best.id);
    return best;
  }

  function genQuant(types, difficulty, topics) {
    if (!D.gen || !D.gen.generate) return null;
    try {
      const out = D.gen.generate(1, { types, difficulty: difficulty || null, topics: topics && topics.length ? topics : undefined });
      const q = out && out[0];
      if (q && types.includes(q.type)) { q.generated = true; return q; }
    } catch (e) { console.warn('generator failed', e); }
    return null;
  }

  function buildVerbal(n, level) {
    const used = new Set();
    const cfg = n <= 12 ? { tc: [1, 2, 2, 3], se: 2, rc: n - 6 } : { tc: [1, 1, 2, 3, 3], se: 3, rc: n - 8 };
    const tc = cfg.tc.map(b => pickOne(D.tc, level, used, q => q.options.length === b) || pickOne(D.tc, level, used)).filter(Boolean).map(q => ({ q }));
    const se = range(cfg.se).map(() => pickOne(D.se, level, used)).filter(Boolean).map(q => ({ q }));
    const groups = pickRC(cfg.rc, level);
    return [...tc, ...(groups[0] || []), ...se, ...groups.slice(1).flat()];
  }

  function pickRC(n, level) {
    const groups = [], usedP = new Set();
    let rem = n;
    const pickPassage = kind => {
      const target = level ? sampleDiff(level) : null;
      let best = null, bs = Infinity;
      for (const p of D.passages) {
        if (usedP.has(p.id) || (kind && p.kind !== kind) || !p.questions.length) continue;
        let s = p.questions.reduce((a, q) => a + (SEEN[q.id] || 0), 0) / p.questions.length * 100 + Math.random() * 2;
        if (target) s += Math.abs((p.difficulty || 2) - target) * 3;
        if (p.questions.length > rem) s += 4;
        if (s < bs) { bs = s; best = p; }
      }
      return best;
    };
    const take = p => {
      usedP.add(p.id);
      const qs = p.questions.slice(0, rem);
      rem -= qs.length;
      groups.push(qs.map(q => ({ q, pid: p.id })));
    };
    for (const k of ['long', 'argument', 'short', 'short', 'argument', 'short']) {
      if (rem <= 0) break;
      if (k === 'long' && rem < 3) continue;
      const p = pickPassage(k);
      if (p) take(p);
    }
    while (rem > 0) { const p = pickPassage(null); if (!p) break; take(p); }
    return groups;
  }

  function buildQuant(n, level) {
    const used = new Set(), topics = {};
    const pick = types => {
      let q = pickOne(D.quant, level, used, x => types.includes(x.type), topics);
      if ((!q || SEEN[q.id]) && D.gen) { const g = genQuant(types, sampleDiff(level)); if (g) q = g; }
      if (!q) return null;
      topics[q.topic] = (topics[q.topic] || 0) + 1;
      return { q };
    };
    const small = n <= 12;
    const qcN = small ? 4 : 5;
    const otherTypes = small
      ? ['mc-single', 'mc-single', 'mc-single', 'mc-single', 'mc-multi', 'mc-multi', 'numeric', 'fraction|numeric']
      : ['mc-single', 'mc-single', 'mc-single', 'mc-single', 'mc-multi', 'numeric', 'fraction|numeric'];
    const qcs = range(qcN).map(() => pick(['qc'])).filter(Boolean);
    const others = shuffle(otherTypes).map(t => pick(t.split('|'))).filter(Boolean);
    let di = [];
    if (!small) {
      const target = sampleDiff(level);
      let best = null, bs = Infinity;
      for (const s of D.sets) {
        const sc = s.questions.reduce((a, q) => a + (SEEN[q.id] || 0), 0) * 100 + Math.abs((s.difficulty || 2) - target) * 3 + Math.random() * 2;
        if (sc < bs) { bs = sc; best = s; }
      }
      if (best) di = best.questions.slice(0, 3).map(q => ({ q, sid: best.id }));
      while (qcs.length + others.length + di.length < n) { const x = pick(['mc-single', 'numeric']); if (!x) break; others.push(x); }
    }
    return [...qcs, ...others.slice(0, 4), ...di, ...others.slice(4)];
  }

  function pickPrompt() {
    const seen = store.get('seenPrompts', {});
    const pool = D.prompts.slice().sort((a, b) => (seen[a.id] || 0) - (seen[b.id] || 0) || Math.random() - 0.5);
    const p = pool[0] || { id: 'none', prompt: 'No essay prompts are loaded.', instructions: '' };
    seen[p.id] = (seen[p.id] || 0) + 1;
    store.set('seenPrompts', seen);
    return p;
  }

  // ---------------------------------------------------------------- answers & scoring
  function parseNum(s) {
    s = String(s == null ? '' : s).trim().replace(/,/g, '');
    if (!/^-?(\d+\.?\d*|\.\d+)$/.test(s)) return null;
    return parseFloat(s);
  }
  function sameSet(a, b) {
    if (!Array.isArray(a) || a.length !== b.length) return false;
    const x = a.slice().sort((m, n) => m - n), y = b.slice().sort((m, n) => m - n);
    return x.every((v, i) => v === y[i]);
  }
  function isCorrect(q, a) {
    if (a == null) return false;
    switch (q.type) {
      case 'numeric': { const v = parseNum(a); return v != null && Math.abs(v - q.answer) <= 1e-9 * Math.max(1, Math.abs(q.answer)); }
      case 'fraction': {
        const n = parseNum(a.n), d = parseNum(a.d);
        if (n == null || d == null || d === 0) return false;
        return Math.abs(n / d - q.answer[0] / q.answer[1]) < 1e-9;
      }
      case 'tc': return Array.isArray(a) && a.length === q.answer.length && a.every((x, i) => x === q.answer[i]);
      default: return sameSet(a, q.answer);
    }
  }
  function status(q, a) {
    if (a == null) return 'not';
    switch (q.type) {
      case 'tc': { const k = a.filter(x => x != null).length; return k === 0 ? 'not' : k === a.length ? 'ans' : 'inc'; }
      case 'se': return a.length === 0 ? 'not' : a.length === 2 ? 'ans' : 'inc';
      case 'numeric': return String(a).trim() ? 'ans' : 'not';
      case 'fraction': { const k = (String(a.n || '').trim() ? 1 : 0) + (String(a.d || '').trim() ? 1 : 0); return k === 0 ? 'not' : k === 2 ? 'ans' : 'inc'; }
      default: return a.length ? 'ans' : 'not';
    }
  }
  const STATUS_TXT = { not: 'Not Answered', ans: 'Answered', inc: 'Incomplete' };
  const sectionCorrect = S => S.items.reduce((c, it, i) => c + (isCorrect(it.q, S.answers[i]) ? 1 : 0), 0);

  function scaled(s1, s2) {
    if (!s1) return null;
    const p1 = sectionCorrect(s1) / Math.max(1, s1.items.length);
    if (!s2) return clamp(Math.round(130 + 40 * p1 * 0.75), 130, 170);
    const p2 = sectionCorrect(s2) / Math.max(1, s2.items.length);
    const L = s2.level || 2;
    const adj = L === 3 ? 0.4 + 0.6 * p2 : L === 2 ? 0.25 + 0.65 * p2 : 0.6 * p2;
    return clamp(Math.round(130 + 40 * (0.35 * p1 + 0.65 * adj)), 130, 170);
  }

  function optText(q, i) { return q.type === 'qc' ? QC_OPTS[i] : (q.options || [])[i]; }
  function fmtAnswer(it, a, isKey) {
    const q = it.q;
    if (isKey) a = q.type === 'numeric' ? q.answer : q.type === 'fraction' ? { n: q.answer[0], d: q.answer[1] } : q.answer;
    if (a == null || status(q, a) === 'not') return '<span class="muted">—</span>';
    switch (q.type) {
      case 'tc': return a.map((x, b) => x == null ? '___' : q.options[b][x]).join(' · ');
      case 'numeric': return (q.before || '') + esc(a) + (q.after ? ' ' + q.after : '');
      case 'fraction': return esc(a.n) + '/' + esc(a.d);
      case 'rc-select': { const s = sentences(PASSAGE[it.pid])[a[0]]; return s ? '“' + s + '”' : 'sentence ' + (a[0] + 1); }
      default: return a.map(i => '(' + LETTERS[i] + ') ' + optText(q, i)).join('; ');
    }
  }
  const sentences = p => p ? p.paragraphs.flat() : [];

  // ---------------------------------------------------------------- question rendering
  const DIRECTIONS = {
    tc1: 'For the following question, select one entry for the blank. Fill the blank in the way that best completes the text.',
    tcN: 'For the following question, select one entry for each blank from the corresponding column of choices. Fill all blanks in the way that best completes the text.',
    se: 'For the following question, select the <b>two</b> answer choices that, when used to complete the sentence, fit the meaning of the sentence as a whole and produce completed sentences that are alike in meaning.',
    'rc-single': 'For the following question, select one answer choice.',
    'rc-multi': 'For the following question, consider each of the answer choices separately and select all that apply.',
    'rc-select': 'For the following question, select a sentence in the passage.',
    qc: 'Compare Quantity A and Quantity B, using additional information centered above the two quantities if such information is given. Select one of the following four answer choices.',
    'mc-single': 'For the following question, select one answer choice.',
    'mc-multi': 'For the following question, select one or more answer choices according to the specific question directions. If the question does not specify how many to select, select all that apply.',
    numeric: 'For the following question, enter your answer as an integer or a decimal in the answer box. Enter the exact answer unless the question asks you to round.',
    fraction: 'For the following question, enter your answer as a fraction. Fractions do not need to be reduced to lowest terms.'
  };
  const directionsFor = q => q.type === 'tc' ? (q.options.length > 1 ? DIRECTIONS.tcN : DIRECTIONS.tc1) : DIRECTIONS[q.type] || '';

  function groupRange(items, idx) {
    const key = it => it.pid ? 'p:' + it.pid : it.sid ? 's:' + it.sid : null;
    const k = key(items[idx]);
    if (!k) return null;
    let a = idx, b = idx;
    while (a > 0 && key(items[a - 1]) === k) a--;
    while (b < items.length - 1 && key(items[b + 1]) === k) b++;
    return [a + 1, b + 1];
  }
  const rangeText = (r, what) => r[0] === r[1] ? `Question ${r[0]} is based on the following ${what}.` : `Questions ${r[0]} to ${r[1]} are based on the following ${what}.`;

  // o = { review: bool (show key), range: [a,b] }
  function questionHTML(it, a, o) {
    const q = it.q;
    let left = null;
    if (it.pid && PASSAGE[it.pid]) left = passageHTML(PASSAGE[it.pid], q, a, o);
    else if (it.sid && QSET[it.sid]) left = `<div class="pane-h">${o.range ? rangeText(o.range, 'data') : ''}</div><div class="figure">${QSET[it.sid].figure}</div>`;
    const right = `<div class="dir">${directionsFor(q)}</div>${bodyHTML(it, a, o)}${o.review ? explHTML(it, a) : ''}`;
    if (left != null) return `<div class="split"><section class="pane pleft">${left}</section><section class="pane pright">${right}</section></div>`;
    return `<div class="single">${right}</div>`;
  }

  function passageHTML(p, q, a, o) {
    let k = 0;
    const isSel = q.type === 'rc-select';
    const paras = p.paragraphs.map(par => '<p>' + par.map(s => {
      const i = k++;
      let c = 'sent';
      if (isSel) {
        c += ' clickable';
        const sel = a && a[0] === i;
        if (o.review) { if (q.answer[0] === i) c += ' correct'; else if (sel) c += ' wrong'; } else if (sel) c += ' sel';
      }
      return `<span class="${c}" data-act="sent" data-k="${i}">${s}</span>`;
    }).join(' ') + '</p>').join('');
    return `<div class="pane-h">${o.range ? rangeText(o.range, 'passage') : ''}</div><div class="passage">${paras}</div>`;
  }

  function optClass(q, i, a, o) {
    let c = '';
    const sel = Array.isArray(a) && a.includes(i);
    if (o.review) { if (q.answer.includes(i)) c += ' correct'; if (sel) c += q.answer.includes(i) ? ' sel' : ' wrong sel'; } else if (sel) c += ' sel';
    return c;
  }
  function optsHTML(q, opts, a, o) {
    const shape = MULTI[q.type] ? 'sq' : 'ov';
    return '<div class="opts">' + opts.map((t, i) =>
      `<button type="button" class="opt ${shape}${optClass(q, i, a, o)}" data-act="opt" data-i="${i}" ${o.review ? 'tabindex="-1"' : ''}><span class="bub"></span><span class="otx">${t}</span></button>`
    ).join('') + '</div>';
  }
  const fig = q => q.figure ? `<div class="figure">${q.figure}</div>` : '';
  const blanked = (text, nb) => String(text).replace(/\{(\d)\}/g, (m, d) => `<span class="blank">${nb > 1 ? '(' + ROMAN[d - 1] + ')' : '&nbsp;'}</span>`);

  function bodyHTML(it, a, o) {
    const q = it.q;
    const dis = o.review ? 'disabled' : '';
    switch (q.type) {
      case 'tc': {
        const nb = q.options.length;
        const cols = q.options.map((col, b) => `<div class="tc-col">${nb > 1 ? `<div class="tc-h">Blank (${ROMAN[b]})</div>` : ''}${col.map((w, i) => {
          let c = 'tc-opt';
          const sel = a && a[b] === i;
          if (o.review) { if (q.answer[b] === i) c += ' correct'; else if (sel) c += ' wrong'; } else if (sel) c += ' sel';
          return `<button type="button" class="${c}" data-act="tc" data-b="${b}" data-i="${i}">${w}</button>`;
        }).join('')}</div>`).join('');
        return `<div class="stem">${blanked(q.text, nb)}</div><div class="tc-cols">${cols}</div>`;
      }
      case 'se':
        return `<div class="stem">${blanked(q.text, 1)}</div>${optsHTML(q, q.options, a, o)}`;
      case 'rc-single': case 'rc-multi':
        return `<div class="stem">${q.prompt}</div>${optsHTML(q, q.options, a, o)}`;
      case 'rc-select':
        return `<div class="stem">${q.prompt}</div><div class="hint">Click a sentence in the passage to select it.</div>` +
          (o.review ? '' : `<div class="hint" id="sel-echo">${a ? 'Selected: “' + (sentences(PASSAGE[it.pid])[a[0]] || '') + '”' : ''}</div>`);
      case 'qc':
        return `${fig(q)}${q.info ? `<div class="qc-info">${q.info}</div>` : ''}<div class="qc-grid"><div class="qc-col"><div class="qc-h">Quantity A</div><div class="qc-v">${q.quantityA}</div></div><div class="qc-col"><div class="qc-h">Quantity B</div><div class="qc-v">${q.quantityB}</div></div></div>${optsHTML(q, QC_OPTS, a, o)}`;
      case 'mc-single': case 'mc-multi':
        return `${fig(q)}<div class="stem">${q.prompt}</div>${optsHTML(q, q.options, a, o)}`;
      case 'numeric':
        return `${fig(q)}<div class="stem">${q.prompt}</div><div class="num-entry">${q.before ? `<span>${q.before}</span>` : ''}<input class="num-in" data-num="v" value="${esc(a || '')}" ${dis} autocomplete="off" inputmode="decimal" maxlength="12" aria-label="Answer">${q.after ? `<span>${q.after}</span>` : ''}</div>`;
      case 'fraction':
        return `${fig(q)}<div class="stem">${q.prompt}</div><div class="frac-entry"><input class="num-in" data-num="n" value="${esc(a ? a.n : '')}" ${dis} autocomplete="off" inputmode="numeric" maxlength="8" aria-label="Numerator"><div class="fbar"></div><input class="num-in" data-num="d" value="${esc(a ? a.d : '')}" ${dis} autocomplete="off" inputmode="numeric" maxlength="8" aria-label="Denominator"></div>`;
    }
    return '<p>Unknown question type.</p>';
  }

  function explHTML(it, a) {
    const q = it.q, ok = isCorrect(q, a), st = status(q, a);
    const verdict = ok ? '✓ Correct' : st === 'not' ? '— Not answered' : '✗ Incorrect';
    return `<div class="expl ${ok ? 'ok' : 'bad'}"><div class="verdict">${verdict}</div>
      <div><b>Your answer:</b> ${fmtAnswer(it, a)}</div><div><b>Correct answer:</b> ${fmtAnswer(it, null, true)}</div>
      ${q.explanation ? `<div style="margin-top:10px">${q.explanation}</div>` : ''}</div>`;
  }

  // ---------------------------------------------------------------- modal
  function modal(title, body, buttons) {
    return new Promise(res => {
      const ov = document.createElement('div');
      ov.className = 'modal-ov';
      ov.innerHTML = `<div class="modal" role="dialog" aria-modal="true"><div class="modal-h">${esc(title)}</div><div class="modal-b">${body}</div><div class="modal-f">${buttons.map((b, i) => `<button class="btn ${b.primary ? 'primary' : ''} ${b.danger ? 'danger' : ''}" data-i="${i}">${esc(b.label)}</button>`).join('')}</div></div>`;
      ov.addEventListener('click', e => {
        const b = e.target.closest('[data-i]');
        if (b) { ov.remove(); document.removeEventListener('keydown', onKey, true); res(buttons[+b.dataset.i].value); }
      });
      const onKey = e => {
        if (e.key === 'Escape') { e.stopPropagation(); ov.remove(); document.removeEventListener('keydown', onKey, true); res(buttons[0].value); }
      };
      document.addEventListener('keydown', onKey, true);
      document.body.appendChild(ov);
      const f = ov.querySelector('.primary') || ov.querySelector('button');
      if (f) f.focus();
    });
  }
  const confirmBox = (title, body, yes, no) => modal(title, body, [{ label: no || 'Cancel', value: false }, { label: yes || 'OK', value: true, primary: true }]);

  // ---------------------------------------------------------------- calculator
  const Calc = (function () {
    let el = null, tokens = [], entry = '0', fresh = true, hasEntry = false, mem = 0;
    const KEYS = [['MR', 'fn'], ['MC', 'fn'], ['M+', 'fn'], ['(', 'op'], [')', 'op'],
      ['7'], ['8'], ['9'], ['÷', 'op'], ['C', 'fn'],
      ['4'], ['5'], ['6'], ['×', 'op'], ['CE', 'fn'],
      ['1'], ['2'], ['3'], ['−', 'op'], ['√', 'op'],
      ['±', 'op'], ['0'], ['.'], ['+', 'op'], ['=', 'op']];
    const OPS = { '÷': '/', '×': '*', '−': '-', '+': '+' };
    const isOp = t => t === '+' || t === '-' || t === '*' || t === '/';
    function fmt(n) {
      if (!isFinite(n) || Math.abs(n) >= 1e8) return 'Error';
      let s = String(parseFloat(n.toPrecision(8)));
      if (s.includes('e')) s = n.toFixed(7).replace(/\.?0+$/, '');
      if (s.replace(/[-.]/g, '').length > 8) s = String(parseFloat(n.toFixed(Math.max(0, 8 - String(Math.trunc(Math.abs(n))).length))));
      return s;
    }
    function evalTokens(ts) {
      const out = [], st = [], prec = { '+': 1, '-': 1, '*': 2, '/': 2 };
      for (const t of ts) {
        if (typeof t === 'number') out.push(t);
        else if (t === '(') st.push(t);
        else if (t === ')') { while (st.length && st[st.length - 1] !== '(') out.push(st.pop()); st.pop(); }
        else { while (st.length && isOp(st[st.length - 1]) && prec[st[st.length - 1]] >= prec[t]) out.push(st.pop()); st.push(t); }
      }
      while (st.length) { const t = st.pop(); if (t !== '(') out.push(t); }
      const v = [];
      for (const t of out) {
        if (typeof t === 'number') { v.push(t); continue; }
        const b = v.pop(), a = v.pop();
        if (a === undefined || b === undefined) return NaN;
        v.push(t === '+' ? a + b : t === '-' ? a - b : t === '*' ? a * b : (b === 0 ? NaN : a / b));
      }
      return v.length === 1 ? v[0] : NaN;
    }
    const last = () => tokens[tokens.length - 1];
    function press(k) {
      if (entry === 'Error' && k !== 'C') { tokens = []; entry = '0'; fresh = true; hasEntry = false; if (!/[\d.]/.test(k)) { show(); return; } }
      if (/^[0-9]$/.test(k) || k === '.') {
        if (fresh) { entry = k === '.' ? '0.' : k; fresh = false; }
        else if (k === '.') { if (!entry.includes('.')) entry += '.'; }
        else if (entry.replace(/[-.]/g, '').length < 8) entry = entry === '0' ? k : entry === '-0' ? '-' + k : entry + k;
        hasEntry = true;
      } else if (OPS[k]) {
        const op = OPS[k];
        if (hasEntry) tokens.push(+entry);
        else if (isOp(last())) tokens.pop();
        else if (!tokens.length || last() === '(') tokens.push(+entry);
        tokens.push(op); hasEntry = false; fresh = true;
      } else if (k === '(') {
        if (hasEntry && tokens.length && !isOp(last()) && last() !== '(') return;
        tokens.push('('); hasEntry = false; fresh = true;
      } else if (k === ')') {
        const open = tokens.filter(t => t === '(').length - tokens.filter(t => t === ')').length;
        if (open <= 0) return;
        if (hasEntry) tokens.push(+entry); else if (isOp(last())) tokens.pop();
        tokens.push(')'); hasEntry = false; fresh = true;
        // show the value of the expression so far inside the closed group
        let depth = 0, i = tokens.length - 1;
        for (; i >= 0; i--) { if (tokens[i] === ')') depth++; else if (tokens[i] === '(' && --depth === 0) break; }
        const v = evalTokens(tokens.slice(i));
        if (!isNaN(v)) entry = fmt(v);
      } else if (k === '=') {
        if (hasEntry) tokens.push(+entry); else if (isOp(last())) tokens.pop(); else if (!tokens.length) tokens.push(+entry);
        let open = tokens.filter(t => t === '(').length - tokens.filter(t => t === ')').length;
        while (open-- > 0) tokens.push(')');
        entry = fmt(evalTokens(tokens)); tokens = []; hasEntry = entry !== 'Error'; fresh = true;
      } else if (k === '√') {
        const v = +entry; entry = v < 0 ? 'Error' : fmt(Math.sqrt(v)); hasEntry = entry !== 'Error'; fresh = true;
      } else if (k === '±') {
        if (!hasEntry) { entry = '0'; fresh = false; }
        entry = entry.startsWith('-') ? entry.slice(1) : '-' + entry; hasEntry = true;
      } else if (k === 'C') { tokens = []; entry = '0'; fresh = true; hasEntry = false; }
      else if (k === 'CE') { entry = '0'; fresh = true; hasEntry = false; }
      else if (k === 'MR') { entry = fmt(mem); hasEntry = true; fresh = true; }
      else if (k === 'MC') { mem = 0; }
      else if (k === 'M+') { const v = parseFloat(entry); if (!isNaN(v)) mem += v; }
      show();
    }
    function show() {
      if (!el) return;
      $('.calc-v', el).textContent = entry;
      $('.calc-m', el).hidden = !mem;
      const tgt = transferTarget();
      $('.calc-transfer', el).disabled = !tgt;
    }
    function transferTarget() {
      const inp = $$('#qarea .num-in[data-num="v"]');
      return inp.length === 1 && !inp[0].disabled ? inp[0] : null;
    }
    function build() {
      el = document.createElement('div');
      el.className = 'calc';
      el.innerHTML = `<div class="calc-h"><span>Calculator</span><button class="calc-x" title="Close calculator" aria-label="Close">×</button></div>
        <div class="calc-disp"><span class="calc-m" hidden>M</span><span class="calc-v">0</span></div>
        <button class="calc-transfer" disabled>Transfer Display</button>
        <div class="calc-keys">${KEYS.map(([k, c]) => `<button class="${c || ''}" data-k="${k}">${k}</button>`).join('')}</div>`;
      el.addEventListener('mousedown', e => { if (e.target.closest('button')) e.preventDefault(); });
      el.addEventListener('click', e => {
        const b = e.target.closest('button');
        if (!b) return;
        if (b.classList.contains('calc-x')) { close(); return; }
        if (b.classList.contains('calc-transfer')) {
          const t = transferTarget();
          if (t && entry !== 'Error') { t.value = entry.slice(0, 12); t.dispatchEvent(new Event('input', { bubbles: true })); }
          return;
        }
        if (b.dataset.k) press(b.dataset.k);
      });
      // drag by header
      const h = $('.calc-h', el);
      h.addEventListener('pointerdown', e => {
        if (e.target.closest('button')) return;
        const r = el.getBoundingClientRect(), dx = e.clientX - r.left, dy = e.clientY - r.top;
        const move = ev => { el.style.left = clamp(ev.clientX - dx, 0, innerWidth - 60) + 'px'; el.style.top = clamp(ev.clientY - dy, 0, innerHeight - 40) + 'px'; el.style.right = 'auto'; };
        const up = () => { removeEventListener('pointermove', move); removeEventListener('pointerup', up); };
        addEventListener('pointermove', move); addEventListener('pointerup', up);
      });
      document.body.appendChild(el);
    }
    function onKey(e) {
      if (!el || el.hidden) return;
      const t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
      const map = { '/': '÷', '*': '×', 'x': '×', '-': '−', '+': '+', 'Enter': '=', '=': '=', 'Escape': 'C', 'Delete': 'CE', '(': '(', ')': ')' };
      let k = /^[0-9.]$/.test(e.key) ? e.key : map[e.key];
      if (e.key === 'Backspace') {
        if (!fresh && entry.length > 1) { entry = entry.slice(0, -1); if (entry === '-') entry = '0'; } else { entry = '0'; fresh = true; }
        show(); e.preventDefault(); return;
      }
      if (k) { press(k); e.preventDefault(); }
    }
    document.addEventListener('keydown', onKey);
    function open() { if (!el) build(); el.hidden = false; show(); }
    function close() { if (el) el.hidden = true; syncBtn(); }
    function syncBtn() { const b = $('[data-cmd="calc"]'); if (b) b.classList.toggle('on', isOpen()); }
    const isOpen = () => !!el && !el.hidden;
    return { open, close, toggle() { isOpen() ? close() : open(); syncBtn(); }, refresh: show, isOpen, hide() { if (el) el.hidden = true; } };
  })();

  // ---------------------------------------------------------------- test session
  let T = null;          // active test/drill
  let timerId = null;
  let awHist = null;     // in-memory undo history for the essay editor
  let awClip = '';

  const cur = () => T && T.sections[T.si];
  function persist() {
    if (!T) return;
    store.set('active', T);
  }
  function stopTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }

  function newTest(mode) {
    const st = settings();
    let plan;
    if (mode === 'full') {
      const first = Math.random() < 0.5 ? 'V' : 'Q', second = first === 'V' ? 'Q' : 'V';
      plan = [{ measure: 'AW' }, { measure: first, idx: 1 }, { measure: second, idx: 1 }, { measure: first, idx: 2 }, { measure: second, idx: 2 }];
    } else if (mode === 'AW') plan = [{ measure: 'AW' }];
    else plan = [{ measure: mode, idx: 1 }, { measure: mode, idx: 2 }];
    T = { id: uid(), mode, plan, si: 0, sections: [], intro: true, started: Date.now(), settings: { timeMult: st.timeMult, untimed: st.untimed, hideTime: false } };
    persist();
    renderIntro();
  }

  function buildSection(p) {
    const mult = T.settings.timeMult || 1;
    const lim = min => T.settings.untimed ? null : Math.round(min * 60 * mult);
    if (p.measure === 'AW') {
      const pr = pickPrompt();
      return { measure: 'AW', title: MEASURE.AW, prompt: pr, essay: '', limit: lim(SPEC.AW.min), remaining: lim(SPEC.AW.min), elapsed: 0, items: [] };
    }
    const spec = SPEC[p.measure][p.idx - 1];
    let level = 2;
    if (p.idx === 2) {
      const s1 = T.sections.find(s => s.measure === p.measure && s.idx === 1);
      if (s1 && s1.items.length) { const pct = sectionCorrect(s1) / s1.items.length; level = pct >= 0.67 ? 3 : pct >= 0.4 ? 2 : 1; }
    }
    const items = p.measure === 'V' ? buildVerbal(spec.n, level) : buildQuant(spec.n, level);
    return newSectionState({ measure: p.measure, idx: p.idx, level, title: MEASURE[p.measure], items, limit: lim(spec.min) });
  }
  function newSectionState(o) {
    return Object.assign({ answers: o.items.map(() => null), marked: o.items.map(() => false), times: o.items.map(() => 0), checked: o.items.map(() => false), cur: 0, view: 'q', elapsed: 0, remaining: o.limit }, o);
  }

  // Section directions screen (shown before each section of a test).
  function renderIntro() {
    stopTimer(); Calc.hide();
    const p = T.plan[T.si];
    const n = T.plan.length;
    const mult = T.settings.timeMult || 1;
    let title, meta, body;
    if (p.measure === 'AW') {
      title = 'Analytical Writing — Analyze an Issue';
      meta = `1 task · ${T.settings.untimed ? 'untimed' : Math.round(30 * mult) + ' minutes'}`;
      body = `<p>You will be presented with a brief quotation that states or implies an issue of general interest and specific instructions on how to respond to that issue. You will have ${T.settings.untimed ? 'unlimited time' : Math.round(30 * mult) + ' minutes'} to plan and compose a response in which you develop a position on the issue according to the specific instructions.</p>
        <p>A response to any other issue will receive a score of zero. Make sure that you respond according to the specific instructions and support your position on the issue with reasons and examples drawn from such areas as your reading, experience, observation, and/or academic studies.</p>
        <p>Trained readers evaluate how well you: respond to the specific task instructions; consider the complexities of the issue; organize, develop, and express your ideas; support your ideas with relevant reasons and/or examples; and control the elements of standard written English.</p>
        <p>The editor provides Cut, Copy, Paste, Undo and Redo. There is no spell-checker or grammar checker. Plan before you write, and leave a few minutes to proofread.</p>`;
    } else {
      const spec = SPEC[p.measure][p.idx - 1];
      title = MEASURE[p.measure];
      meta = `${spec.n} questions · ${T.settings.untimed ? 'untimed' : Math.round(spec.min * mult) + ' minutes'}`;
      body = p.measure === 'V'
        ? `<p>For each question, indicate the best answer, using the directions given.</p>
           <p>Questions include Text Completion, Sentence Equivalence and Reading Comprehension. You may move back and forth among the questions in this section, change answers, <b>Mark</b> questions to return to later, and use <b>Review</b> to see which questions you have answered.</p>
           ${p.idx === 2 ? '<p class="muted small">This is the second Verbal section. Its difficulty depends on how you did in the first Verbal section.</p>' : ''}`
        : `<p>For each question, indicate the best answer, using the directions given. An on-screen <b>Calculator</b> is available.</p>
           <ul><li>All numbers used are real numbers.</li><li>All figures are assumed to lie in a plane unless otherwise indicated.</li>
           <li>Geometric figures, such as lines, circles, triangles, and quadrilaterals, are not necessarily drawn to scale. Do not assume lengths and angle measures are as they appear in a figure, though you can assume lines shown as straight are straight and points appear in the order shown.</li>
           <li>Coordinate systems, such as xy-planes and number lines, are drawn to scale. Graphical data presentations, such as bar graphs, circle graphs, and line graphs, are drawn to scale.</li></ul>
           ${p.idx === 2 ? '<p class="muted small">This is the second Quantitative section. Its difficulty depends on how you did in the first Quantitative section.</p>' : ''}`;
    }
    app().innerHTML = `<div class="runner">
      <header class="tbar"><div class="tleft"><span class="tlogo">GRE<span>practice</span></span><span class="tsec">Section ${T.si + 1} of ${n}</span></div>
        <nav class="tbtns"><button data-cmd="quit">Quit Test</button><button data-cmd="continue">Continue</button></nav></header>
      <div class="subbar"><div class="qn">Section ${T.si + 1} of ${n} — Directions</div><div></div></div>
      <main class="qarea"><div class="intro-body"><h1>${esc(title)}</h1><h2>${esc(meta)}</h2><div class="box">${body}</div>
        <p style="margin-top:22px"><button class="btn primary" data-cmd="continue">Continue — start section</button></p>
        <p class="muted small">The clock starts when you continue. Once you exit a section you cannot return to it.</p></div></main></div>`;
    app().onclick = async e => {
      const b = e.target.closest('[data-cmd]');
      if (!b) return;
      if (b.dataset.cmd === 'continue') {
        if (!T.sections[T.si]) T.sections[T.si] = buildSection(p);
        T.intro = false; persist(); renderRunner();
      } else if (b.dataset.cmd === 'quit') quitTest();
    };
  }

  function renderRunner() {
    const S = cur();
    const isQ = S.measure === 'Q', isAW = S.measure === 'AW', drill = T.mode === 'drill';
    const label = drill ? S.title : `Section ${T.si + 1} of ${T.plan.length} | ${MEASURE[S.measure]}`;
    app().innerHTML = `<div class="runner">
      <header class="tbar">
        <div class="tleft"><span class="tlogo">GRE<span>practice</span></span><span class="tsec">${esc(label)}</span></div>
        <nav class="tbtns">
          <button data-cmd="quit">${drill ? 'End Practice' : 'Quit Test'}</button>
          ${isAW ? '' : `<button data-cmd="exit">${drill ? 'Finish' : 'Exit Section'}</button><button data-cmd="review" id="b-review">Review</button><button data-cmd="mark" id="b-mark">Mark</button>`}
          <button data-cmd="help">Help</button>
          ${isQ ? '<button data-cmd="calc">Calculator</button>' : ''}
          <span class="sep"></span>
          ${isAW ? '' : '<button data-cmd="back" id="b-back">Back</button>'}
          <button data-cmd="next" id="b-next">Next</button>
        </nav>
      </header>
      <div class="subbar"><div class="qn" id="qnum"></div><div class="timer-wrap">${S.limit ? `<span id="timer"></span><button class="link" data-cmd="hidetime" id="b-hide"></button>` : (S.limit === null ? '<span class="muted small">Untimed</span>' : '')}</div></div>
      <main class="qarea" id="qarea"></main>
    </div>`;
    const root = app();
    root.onclick = onRunnerClick;
    root.oninput = onRunnerInput;
    if (!isQ) Calc.hide();
    showCurrent();
    startTimer();
  }

  function showCurrent() {
    const S = cur();
    const qa = $('#qarea');
    if (S.measure === 'AW') { renderWriting(qa, S); updateChrome(); return; }
    if (S.view === 'review') { renderReviewList(qa, S); updateChrome(); return; }
    const it = S.items[S.cur];
    const locked = T.feedback && S.checked[S.cur];
    // keep the passage/data pane scrolled where it was when moving within the same group
    const oldLeft = $('.pleft', qa), keep = oldLeft && qa.dataset.group && qa.dataset.group === (it.pid || it.sid) ? oldLeft.scrollTop : 0;
    qa.dataset.group = it.pid || it.sid || '';
    qa.innerHTML = questionHTML(it, S.answers[S.cur], { review: locked, range: groupRange(S.items, S.cur) });
    if (keep) $('.pleft', qa).scrollTop = keep;
    if (T.feedback && !locked) {
      const target = $('.pright', qa) || $('.single', qa);
      target.insertAdjacentHTML('beforeend', '<div class="check-row"><button class="btn primary" data-cmd="check">Check Answer</button></div>');
    }
    qa.scrollTop = 0;
    updateChrome();
    Calc.refresh();
  }

  function updateChrome() {
    const S = cur();
    const qn = $('#qnum');
    if (qn) qn.textContent = S.measure === 'AW' ? 'Analyze an Issue' : S.view === 'review' ? 'Review' : `Question ${S.cur + 1} of ${S.items.length}`;
    const mk = $('#b-mark');
    if (mk) { mk.classList.toggle('on', !!S.marked[S.cur] && S.view !== 'review'); mk.textContent = S.marked[S.cur] ? 'Unmark' : 'Mark'; mk.disabled = S.view === 'review'; }
    const bk = $('#b-back');
    if (bk) bk.disabled = S.view !== 'review' && S.cur === 0;
    const rv = $('#b-review');
    if (rv) rv.classList.toggle('on', S.view === 'review');
    const hb = $('#b-hide');
    if (hb) hb.textContent = T.settings.hideTime ? 'Show Time' : 'Hide Time';
    updateTimer();
  }

  function updateTimer() {
    const S = cur(), t = $('#timer');
    if (!t || !S || !S.limit) return;
    const warn = S.remaining <= 300;
    t.textContent = (T.settings.hideTime && !warn) ? '' : clock(S.remaining);
    t.classList.toggle('warn', warn);
  }

  function startTimer() {
    stopTimer();
    let last = Date.now(), n = 0;
    timerId = setInterval(() => {
      const S = cur();
      if (!S) return stopTimer();
      const now = Date.now(), dt = (now - last) / 1000;
      last = now;
      S.elapsed += dt;
      if (S.measure !== 'AW' && S.view === 'q') S.times[S.cur] = (S.times[S.cur] || 0) + dt;
      if (S.limit) {
        S.remaining -= dt;
        updateTimer();
        if (S.remaining <= 0) { S.remaining = 0; stopTimer(); timeUp(); return; }
      }
      if (++n % 10 === 0) persist();
    }, 500);
  }

  async function timeUp() {
    await modal('Time Expired', '<p>Time has expired for this section. Your answers have been saved.</p>', [{ label: 'Continue', value: true, primary: true }]);
    endSection();
  }

  async function onRunnerClick(e) {
    const S = cur();
    const cmdEl = e.target.closest('[data-cmd]');
    if (cmdEl) {
      const cmd = cmdEl.dataset.cmd;
      switch (cmd) {
        case 'next': return onNext();
        case 'back':
          if (S.view === 'review') { S.view = 'q'; showCurrent(); } else if (S.cur > 0) { S.cur--; showCurrent(); }
          return persist();
        case 'mark': S.marked[S.cur] = !S.marked[S.cur]; updateChrome(); return persist();
        case 'review': S.view = S.view === 'review' ? 'q' : 'review'; S.revPick = S.cur; showCurrent(); return persist();
        case 'goto': if (S.revPick != null) { S.cur = S.revPick; S.view = 'q'; showCurrent(); persist(); } return;
        case 'return': S.view = 'q'; showCurrent(); return;
        case 'help': return showHelp();
        case 'calc': return Calc.toggle();
        case 'hidetime': T.settings.hideTime = !T.settings.hideTime; updateChrome(); return persist();
        case 'exit': return onExit();
        case 'quit': return quitTest();
        case 'check': S.checked[S.cur] = true; showCurrent(); return persist();
      }
      return;
    }
    // review list row
    const row = e.target.closest('tr[data-row]');
    if (row) {
      const i = +row.dataset.row;
      if (S.revPick === i && e.detail >= 2) { S.cur = i; S.view = 'q'; showCurrent(); return persist(); }
      S.revPick = i; $$('tr[data-row]').forEach(r => r.classList.toggle('pick', +r.dataset.row === i));
      return;
    }
    // writing toolbar
    const ed = e.target.closest('[data-ed]');
    if (ed) return editorCmd(ed.dataset.ed);
    // answer selection
    const el = e.target.closest('[data-act]');
    if (!el || S.view !== 'q' || S.measure === 'AW') return;
    if (T.feedback && S.checked[S.cur]) return;
    const q = S.items[S.cur].q;
    let a = S.answers[S.cur];
    switch (el.dataset.act) {
      case 'opt': {
        const i = +el.dataset.i;
        if (MULTI[q.type]) { a = a ? a.slice() : []; const k = a.indexOf(i); if (k >= 0) a.splice(k, 1); else a.push(i); a.sort((x, y) => x - y); }
        else a = [i];
        break;
      }
      case 'tc': { const b = +el.dataset.b, i = +el.dataset.i; a = a ? a.slice() : q.options.map(() => null); a[b] = a[b] === i ? null : i; break; }
      case 'sent': if (q.type !== 'rc-select') return; { const k = +el.dataset.k; a = a && a[0] === k ? null : [k]; } break;
      default: return;
    }
    S.answers[S.cur] = a;
    paintSelection();
    persist();
  }

  function paintSelection() {
    const S = cur(), it = S.items[S.cur], a = S.answers[S.cur];
    $$('#qarea [data-act=opt]').forEach(b => b.classList.toggle('sel', !!a && a.includes(+b.dataset.i)));
    $$('#qarea [data-act=tc]').forEach(b => b.classList.toggle('sel', !!a && a[+b.dataset.b] === +b.dataset.i));
    if (it.q.type === 'rc-select') {
      $$('#qarea [data-act=sent]').forEach(s => s.classList.toggle('sel', !!a && a[0] === +s.dataset.k));
      const echo = $('#sel-echo');
      if (echo) echo.textContent = a ? 'Selected: “' + (sentences(PASSAGE[it.pid])[a[0]] || '').replace(/<[^>]+>/g, '') + '”' : '';
    }
  }

  function onRunnerInput(e) {
    const S = cur();
    const t = e.target;
    if (t.id === 'essay') { S.essay = t.value; pushHist(t.value); updateWordCount(); persist(); return; }
    if (!t.dataset || !t.dataset.num) return;
    const kind = t.dataset.num;
    const ok = kind === 'v' ? /^-?\d*\.?\d*$/ : /^-?\d*$/;
    if (!ok.test(t.value)) { t.value = t.dataset.prev || ''; return; }
    t.dataset.prev = t.value;
    if (kind === 'v') S.answers[S.cur] = t.value;
    else { const a = Object.assign({ n: '', d: '' }, S.answers[S.cur] || {}); a[kind] = t.value; S.answers[S.cur] = a; }
    persist();
  }

  async function onNext() {
    const S = cur();
    if (S.measure === 'AW') {
      const left = S.limit ? S.remaining : 1;
      if (left > 0 && !(await confirmBox('Exit Section', '<p>You still have time remaining. If you continue, you will <b>not</b> be able to return to your essay.</p><p>Are you sure you want to submit your response?</p>', 'Submit Essay', 'Return'))) return;
      return endSection();
    }
    if (S.view === 'review') { S.view = 'q'; showCurrent(); return; }
    if (S.cur < S.items.length - 1) { S.cur++; showCurrent(); persist(); return; }
    const unanswered = S.items.filter((it, i) => status(it.q, S.answers[i]) !== 'ans').length;
    const r = await modal('End of Section', `<p>You have reached the end of this section.${unanswered ? ` <b>${unanswered}</b> question${unanswered > 1 ? 's are' : ' is'} not fully answered.` : ''}</p><p>Select <b>Review</b> to see the status of every question, or <b>Exit Section</b> to move on. You will not be able to return to this section.</p>`,
      [{ label: 'Return', value: 'stay' }, { label: 'Review', value: 'review' }, { label: T.mode === 'drill' ? 'Finish' : 'Exit Section', value: 'exit', primary: true }]);
    if (r === 'review') { S.view = 'review'; S.revPick = S.cur; showCurrent(); }
    else if (r === 'exit') endSection();
  }

  async function onExit() {
    const S = cur();
    const unanswered = S.items.filter((it, i) => status(it.q, S.answers[i]) !== 'ans').length;
    const ok = await confirmBox(T.mode === 'drill' ? 'Finish Practice' : 'Exit Section',
      `<p>${unanswered ? `You have <b>${unanswered}</b> unanswered or incomplete question${unanswered > 1 ? 's' : ''}. ` : ''}${T.mode === 'drill' ? 'Finish and see your results?' : 'Once you exit this section you <b>cannot return</b> to it. Exit now?'}</p>`, T.mode === 'drill' ? 'Finish' : 'Exit Section', 'Return');
    if (ok) endSection();
  }

  async function quitTest() {
    const ok = await confirmBox(T.mode === 'drill' ? 'End Practice' : 'Quit Test',
      T.mode === 'drill' ? '<p>End this practice set and see results for what you have answered?</p>' : '<p>Quit the test? Completed sections will be scored and the rest discarded.</p>',
      T.mode === 'drill' ? 'End & Score' : 'Quit Test', 'Return');
    if (!ok) return;
    stopTimer(); Calc.hide();
    if (T.mode === 'drill') { finishTest(); return; }
    const S = cur();
    if (S && !T.intro && S.measure !== 'AW') { S.done = true; recordSection(S); }
    if (S && !T.intro && S.measure === 'AW' && S.essay.trim()) S.done = true;
    T.sections = T.sections.filter(s => s.done);
    if (!T.sections.length) { T = null; store.del('active'); renderHome(); return; }
    T.quit = true;
    finishTest();
  }

  function endSection() {
    stopTimer(); Calc.hide();
    const S = cur();
    S.done = true;
    if (S.measure !== 'AW') { recordSection(S); markSeen(S.items); }
    T.si++;
    if (T.si >= T.plan.length) { finishTest(); return; }
    T.intro = true;
    persist();
    renderIntro();
  }

  // Track per-type accuracy and the mistake bank.
  function recordSection(S) {
    const stats = store.get('stats', {});
    const mistakes = store.get('mistakes', {});
    S.items.forEach((it, i) => {
      const q = it.q, ok = isCorrect(q, S.answers[i]);
      if (status(q, S.answers[i]) === 'not' && T.mode === 'drill') return;
      const s = stats[q.type] || (stats[q.type] = { c: 0, t: 0 });
      s.t++; if (ok) s.c++;
      if (q.topic && TOPIC_NAME[q.topic]) { const k = 'topic:' + q.topic, st = stats[k] || (stats[k] = { c: 0, t: 0 }); st.t++; if (ok) st.c++; }
      if (ok) delete mistakes[q.id];
      else mistakes[q.id] = { q, pid: it.pid, sid: it.sid, t: Date.now() };
    });
    store.set('stats', stats);
    store.set('mistakes', mistakes);
  }

  function finishTest() {
    stopTimer(); Calc.hide();
    if (T.mode === 'drill') { const S = cur(); if (S && !S.done) { S.done = true; recordSection(S); markSeen(S.items); } }
    const entry = {
      id: T.id, mode: T.mode, title: T.title || modeTitle(T.mode), date: Date.now(), quit: !!T.quit,
      sections: T.sections.filter(Boolean).map(s => { const c = Object.assign({}, s); delete c.view; delete c.revPick; return c; })
    };
    entry.scores = computeScores(entry);
    const hist = store.get('history', []);
    hist.unshift(entry);
    store.set('history', hist.slice(0, 40));
    store.del('active');
    T = null;
    renderResults(entry.id);
  }

  function computeScores(entry) {
    const by = (m, i) => entry.sections.find(s => s.measure === m && s.idx === i);
    const res = {};
    if (entry.mode === 'drill') return res;
    ['V', 'Q'].forEach(m => { const v = scaled(by(m, 1), by(m, 2)); if (v != null) res[m] = v; });
    return res;
  }
  const modeTitle = m => ({ full: 'Full-Length Practice Test', V: 'Verbal Reasoning Test', Q: 'Quantitative Reasoning Test', AW: 'Analytical Writing Task', drill: 'Custom Practice' })[m] || 'Practice';

  // ---------------------------------------------------------------- review list (in-section)
  function renderReviewList(qa, S) {
    qa.innerHTML = `<div class="review-screen"><h2>Review</h2>
      <p class="small">Below is the list of questions in this section with their status. Click a row to highlight it and then select <b>Go to Question</b>, or double-click a row. Select <b>Return</b> to go back to the question you were on.</p>
      <table class="rev"><thead><tr><th>Question Number</th><th>Status</th><th>Marked</th></tr></thead><tbody>
      ${S.items.map((it, i) => { const st = status(it.q, S.answers[i]); return `<tr data-row="${i}" class="${i === S.cur ? 'cur' : ''} ${i === S.revPick ? 'pick' : ''}"><td>${i + 1}</td><td class="${st === 'ans' ? '' : 'na'}">${STATUS_TXT[st]}</td><td>${S.marked[i] ? '✓ Marked' : ''}</td></tr>`; }).join('')}
      </tbody></table>
      <div class="rev-actions"><button class="btn primary" data-cmd="goto">Go to Question</button><button class="btn" data-cmd="return">Return</button></div></div>`;
  }

  // ---------------------------------------------------------------- writing
  function renderWriting(qa, S) {
    const pr = S.prompt;
    qa.innerHTML = `<div class="aw">
      <section class="aw-prompt"><div class="dir">You have ${S.limit ? Math.round(S.limit / 60) + ' minutes' : 'unlimited time'} to plan and compose a response to the issue below. A response to any other issue will receive a score of zero. Make sure that you respond according to the specific instructions and support your position on the issue with reasons and examples drawn from such areas as your reading, experience, observation, and/or academic studies.</div>
        <div class="issue">${esc(pr.prompt)}</div><div class="instr">${esc(pr.instructions)}</div></section>
      <section class="aw-ed"><div class="aw-tools"><button data-ed="cut">Cut</button><button data-ed="copy">Copy</button><button data-ed="paste">Paste</button><button data-ed="undo">Undo</button><button data-ed="redo">Redo</button>
        <span class="wc"><span id="wc"></span> · <button class="link" data-ed="wc">${S.hideWc ? 'Show' : 'Hide'} Word Count</button></span></div>
        <textarea id="essay" spellcheck="false" autocorrect="off" autocapitalize="off" autocomplete="off" aria-label="Essay response">${esc(S.essay)}</textarea></section></div>`;
    awHist = { stack: [S.essay], pos: 0, t: 0 };
    updateWordCount();
  }
  const wordCount = s => (s.trim().match(/\S+/g) || []).length;
  function updateWordCount() {
    const S = cur(), w = $('#wc');
    if (w) w.textContent = S.hideWc ? '' : 'Word count: ' + wordCount(S.essay);
  }
  function pushHist(v) {
    if (!awHist) return;
    const now = Date.now();
    if (now - awHist.t < 600 && awHist.pos === awHist.stack.length - 1 && awHist.pos > 0) awHist.stack[awHist.pos] = v;
    else { awHist.stack = awHist.stack.slice(0, awHist.pos + 1); awHist.stack.push(v); awHist.pos++; }
    awHist.t = now;
  }
  function editorCmd(cmd) {
    const S = cur(), ta = $('#essay');
    if (cmd === 'wc') { S.hideWc = !S.hideWc; showCurrent(); return; }
    if (!ta) return;
    const s = ta.selectionStart, e = ta.selectionEnd, v = ta.value;
    const set = (nv, caret) => { ta.value = nv; S.essay = nv; ta.focus(); ta.setSelectionRange(caret, caret); updateWordCount(); persist(); };
    if (cmd === 'copy') { if (e > s) awClip = v.slice(s, e); ta.focus(); }
    else if (cmd === 'cut') { if (e > s) { awClip = v.slice(s, e); awHist.t = 0; set(v.slice(0, s) + v.slice(e), s); pushHist(ta.value); awHist.t = 0; } }
    else if (cmd === 'paste') { if (awClip) { awHist.t = 0; set(v.slice(0, s) + awClip + v.slice(e), s + awClip.length); pushHist(ta.value); awHist.t = 0; } }
    else if (cmd === 'undo') { if (awHist.pos > 0) { awHist.pos--; set(awHist.stack[awHist.pos], awHist.stack[awHist.pos].length); awHist.t = 0; } }
    else if (cmd === 'redo') { if (awHist.pos < awHist.stack.length - 1) { awHist.pos++; set(awHist.stack[awHist.pos], awHist.stack[awHist.pos].length); awHist.t = 0; } }
  }

  function showHelp() {
    const S = cur();
    let body = '';
    if (S.measure === 'AW') body = '<h4>Analyze an Issue</h4><p>Take a position on the issue and develop it according to the specific instructions. Use the toolbar for Cut, Copy, Paste, Undo and Redo. Select <b>Next</b> to submit your essay.</p>';
    else {
      const q = S.items[S.cur] && S.items[S.cur].q;
      body = `<h4>This question</h4><p><b>${esc(TYPE_NAME[q.type] || '')}</b> — ${directionsFor(q)}</p>
        <h4>Testing tools</h4><ul>
        <li><b>Back / Next</b> move between questions. You can skip questions and return to them.</li>
        <li><b>Mark</b> flags a question so you can find it in <b>Review</b>.</li>
        <li><b>Review</b> lists every question with its status (Answered, Not Answered, Incomplete) and lets you jump to any of them.</li>
        <li><b>Hide Time</b> hides the clock (it reappears in the last 5 minutes).</li>
        ${S.measure === 'Q' ? '<li><b>Calculator</b> follows order of operations. <b>Transfer Display</b> copies the result into a numeric entry box. Keyboard input works while the calculator is open.</li>' : ''}
        <li><b>Exit Section</b> ends the section; you cannot return to it.</li></ul>`;
    }
    modal('Help', body, [{ label: 'Return to Question', value: true, primary: true }]);
  }

  // ---------------------------------------------------------------- results
  function sectionLabel(s) {
    if (s.measure === 'AW') return 'Analytical Writing';
    return s.idx ? `${MEASURE[s.measure]} — Section ${s.idx}` : s.title;
  }

  function renderResults(id) {
    const hist = store.get('history', []);
    const E = hist.find(h => h.id === id);
    if (!E) return renderHome();
    const scoreCard = (m, lbl) => {
      if (E.scores[m] == null) return '';
      const s1 = E.sections.find(s => s.measure === m && s.idx === 1), s2 = E.sections.find(s => s.measure === m && s.idx === 2);
      const parts = [s1, s2].filter(Boolean).map(s => `S${s.idx}${s.idx === 2 ? ' (' + LEVEL_NAME[s.level] + ')' : ''}: ${sectionCorrect(s)}/${s.items.length}`).join(' · ');
      return `<div class="score"><div class="lbl">${lbl}</div><div class="val">${E.scores[m]}</div><div class="sub">Estimated, 130–170 scale</div><div class="sub">${parts}</div></div>`;
    };
    const aw = E.sections.find(s => s.measure === 'AW');
    const awCard = aw ? `<div class="score"><div class="lbl">Analytical Writing</div><div class="val">${aw.selfScore != null ? aw.selfScore.toFixed(1) : '—'}</div><div class="sub">${aw.selfScore != null ? 'Self-scored, 0–6 scale' : 'Score your essay with the rubric below'}</div><div class="sub">${wordCount(aw.essay || '')} words</div></div>` : '';
    const drillCard = E.mode === 'drill' ? E.sections.map(s => { const c = sectionCorrect(s); return `<div class="score"><div class="lbl">${esc(s.title)}</div><div class="val">${c}/${s.items.length}</div><div class="sub">${Math.round(100 * c / Math.max(1, s.items.length))}% correct · ${mmss(s.elapsed)} total</div></div>`; }).join('') : '';

    const secTables = E.sections.map((s, si) => {
      if (s.measure === 'AW') return awResultHTML(s, si);
      const rows = s.items.map((it, i) => {
        const a = s.answers[i], ok = isCorrect(it.q, a), st = status(it.q, a);
        return `<tr class="click" data-rev="${si}:${i}"><td>${i + 1}</td><td>${esc(TYPE_NAME[it.q.type] || it.q.type)}${it.q.topic && TOPIC_NAME[it.q.topic] ? ' <span class="muted small">· ' + TOPIC_NAME[it.q.topic] + '</span>' : ''}</td>
          <td><span class="pill d${it.q.difficulty || 2}">${DIFF_NAME[it.q.difficulty || 2]}</span></td>
          <td>${ok ? '<span class="pill ok">Correct</span>' : st === 'not' ? '<span class="pill">Omitted</span>' : '<span class="pill bad">Incorrect</span>'}</td>
          <td>${mmss(s.times[i])}</td></tr>`;
      }).join('');
      return `<h2>${esc(sectionLabel(s))} <span class="muted small" style="font-weight:400">· ${sectionCorrect(s)}/${s.items.length} correct · ${mmss(s.elapsed)} used${s.idx === 2 ? ' · ' + LEVEL_NAME[s.level] + ' section' : ''}</span></h2>
        <div class="scroll-x"><table class="tbl"><thead><tr><th>#</th><th>Question type</th><th>Difficulty</th><th>Result</th><th>Time</th></tr></thead><tbody>${rows}</tbody></table></div>
        <p class="small muted">Click a row to review the question with its explanation.</p>`;
    }).join('');

    app().innerHTML = shell('history', `
      <div class="row"><h1>${esc(E.title)}</h1><span class="spacer"></span><button class="btn" data-go="home">Home</button></div>
      <p class="lede">${fmtDate(E.date)}${E.quit ? ' · ended early' : ''}. ${E.mode === 'drill' ? '' : 'Scaled scores are estimates based on the number correct and the difficulty of the second section — use them to track progress, not as an official prediction.'}</p>
      <div class="scores">${scoreCard('V', 'Verbal Reasoning')}${scoreCard('Q', 'Quantitative Reasoning')}${awCard}${drillCard}</div>
      ${secTables}`);
    app().onclick = e => {
      if (navClick(e)) return;
      const r = e.target.closest('[data-rev]');
      if (r) { const [si, i] = r.dataset.rev.split(':').map(Number); renderReviewer(E.id, si, i); return; }
      const sv = e.target.closest('[data-selfscore]');
      if (sv) {
        const si = +sv.dataset.selfscore;
        const v = $(`input[name="rub-${si}"]:checked`);
        if (!v) return;
        E.sections[si].selfScore = +v.value;
        store.set('history', hist);
        renderResults(E.id);
      }
    };
  }

  function awResultHTML(s, si) {
    const text = s.essay || '';
    const paras = text.split(/\n\s*\n|\n/).filter(p => p.trim()).length;
    const sents = (text.match(/[^.!?]+[.!?]+/g) || []).length;
    const wc = wordCount(text);
    const rub = D.rubric.length ? D.rubric : [];
    const opts = rub.map(r => `<label><input type="radio" name="rub-${si}" value="${r.score}" ${s.selfScore === r.score ? 'checked' : ''}><div><b>${r.score} — ${esc(r.label)}</b><ul>${(r.points || []).map(p => `<li>${esc(p)}</li>`).join('')}</ul></div></label>`).join('');
    const halfs = [5.5, 4.5, 3.5, 2.5, 1.5, 0.5].map(v => `<label style="grid-template-columns:28px auto;display:inline-grid;margin-right:6px"><input type="radio" name="rub-${si}" value="${v}" ${s.selfScore === v ? 'checked' : ''}><span>${v}</span></label>`).join('');
    return `<h2>Analytical Writing — Analyze an Issue</h2>
      <div class="card" style="margin-bottom:14px"><div class="small muted">Prompt</div><div style="font-weight:700;white-space:pre-line;margin:6px 0">${esc(s.prompt.prompt)}</div><div class="small">${esc(s.prompt.instructions)}</div></div>
      <div class="row small muted" style="margin-bottom:8px"><span>${wc} words</span>·<span>${paras} paragraph${paras === 1 ? '' : 's'}</span>·<span>${sents} sentences</span>·<span>avg ${sents ? Math.round(wc / sents) : 0} words/sentence</span>·<span>${mmss(s.elapsed)} used</span></div>
      <div class="essay-box">${esc(text) || '<span class="muted">No response written.</span>'}</div>
      <h2>Self-score with the rubric</h2>
      <p class="small muted">High-scoring essays typically take a clear position, address the specific instructions (not just the statement), develop 3–4 well-supported points with specific examples, and acknowledge complexity or counter-arguments. Most strong responses run 450–650 words.</p>
      <div class="rubric">${opts}</div><div style="margin:10px 0" class="small">Half-point scores: ${halfs}</div>
      <button class="btn primary" data-selfscore="${si}">Save score</button>`;
  }

  // Read-only question review with Prev/Next across a completed section.
  function renderReviewer(hid, si, i) {
    const hist = store.get('history', []);
    const E = hist.find(h => h.id === hid);
    const S = E.sections[si];
    const it = S.items[i];
    app().innerHTML = `<div class="runner"><header class="tbar">
      <div class="tleft"><span class="tlogo">GRE<span>practice</span></span><span class="tsec">Review · ${esc(sectionLabel(S))}</span></div>
      <nav class="tbtns"><button data-cmd="results">Back to Results</button><span class="sep"></span><button data-cmd="prev" ${i === 0 ? 'disabled' : ''}>Back</button><button data-cmd="nxt" ${i === S.items.length - 1 ? 'disabled' : ''}>Next</button></nav></header>
      <div class="subbar"><div class="qn">Question ${i + 1} of ${S.items.length} · ${esc(TYPE_NAME[it.q.type])} · ${DIFF_NAME[it.q.difficulty || 2]}</div><div class="small">Time spent: ${mmss(S.times[i])}</div></div>
      <main class="qarea" id="qarea">${questionHTML(it, S.answers[i], { review: true, range: groupRange(S.items, i) })}</main></div>`;
    app().onclick = e => {
      const b = e.target.closest('[data-cmd]');
      if (!b) return;
      if (b.dataset.cmd === 'results') renderResults(hid);
      else if (b.dataset.cmd === 'prev') renderReviewer(hid, si, i - 1);
      else if (b.dataset.cmd === 'nxt') renderReviewer(hid, si, i + 1);
    };
  }

  // ---------------------------------------------------------------- site shell & home
  function shell(active, inner) {
    const nav = [['home', 'Home'], ['practice', 'Custom Practice'], ['study', 'Math Study'], ['vocab', 'Vocabulary'], ['history', 'Progress']];
    return `<header class="topnav"><div class="topnav-in"><div class="logo" data-go="home">GRE <span>practice</span></div>
      <nav>${nav.map(([k, l]) => `<button data-go="${k}" class="${active === k ? 'on' : ''}">${l}</button>`).join('')}</nav></div></header>
      <div class="page">${inner}</div>`;
  }
  function navClick(e) {
    const g = e.target.closest('[data-go]');
    if (!g) return false;
    const to = g.dataset.go;
    ({ home: renderHome, practice: renderPractice, study: () => renderStudy(), vocab: () => renderVocab('cards'), history: renderHistory })[to]();
    window.scrollTo(0, 0);
    return true;
  }

  function renderHome() {
    stopTimer(); Calc.hide();
    const st = settings();
    const active = store.get('active', null);
    const missing = [];
    if (!D.tc.length && !D.se.length) missing.push('data/verbal_tc_se.js');
    if (!D.passages.length) missing.push('data/verbal_rc.js');
    if (!D.quant.length) missing.push('data/quant.js');
    const nMist = Object.keys(store.get('mistakes', {})).length;
    const nQ = D.tc.length + D.se.length + D.passages.reduce((a, p) => a + p.questions.length, 0) + D.quant.length + D.sets.reduce((a, s) => a + s.questions.length, 0);
    const fullMin = Math.round((30 + 18 + 23 + 21 + 26) * st.timeMult);
    app().innerHTML = shell('home', `
      ${active ? `<div class="banner"><b>You have a test in progress.</b><span class="muted">${esc(modeTitle(active.mode))} · started ${fmtDate(active.started)}</span><span class="spacer"></span><button class="btn" data-act="discard">Discard</button><button class="btn primary" data-act="resume">Resume</button></div>` : ''}
      ${missing.length ? `<div class="banner">Some question files did not load: ${missing.map(esc).join(', ')}.</div>` : ''}
      <h1>GRE General Test Practice</h1>
      <p class="lede">Timed sections that follow the current GRE format: one Issue essay, two Verbal and two Quant sections, with the second section of each measure adapting to how you did on the first. ${nQ} questions in the bank${D.gen ? ' plus unlimited auto-generated Quant practice' : ''}, and ${D.vocab.length} vocabulary words.</p>
      <div class="settings"><b>Test settings</b>
        <label>Time <select id="set-mult"><option value="1">Standard time</option><option value="1.5">Time and a half (+50%)</option><option value="2">Double time (+100%)</option></select></label>
        <label><input type="checkbox" id="set-untimed" ${st.untimed ? 'checked' : ''}> Untimed</label></div>
      <div class="grid">
        <div class="card feature click" data-start="full"><h3>Full-Length Test</h3><div class="meta">5 sections · ${st.untimed ? 'untimed' : '≈ ' + Math.floor(fullMin / 60) + ' h ' + (fullMin % 60) + ' min'}</div><p>Analytical Writing, then Verbal and Quant sections in mixed order with section-level adaptation. Scored on the 130–170 scale.</p><button class="btn primary">Start full test</button></div>
        <div class="card click" data-start="V"><h3>Verbal Reasoning</h3><div class="meta">2 sections · 27 questions · ${st.untimed ? 'untimed' : Math.round(41 * st.timeMult) + ' min'}</div><p>Text Completion, Sentence Equivalence and Reading Comprehension, including select-in-passage questions.</p><button class="btn">Start Verbal</button></div>
        <div class="card click" data-start="Q"><h3>Quantitative Reasoning</h3><div class="meta">2 sections · 27 questions · ${st.untimed ? 'untimed' : Math.round(47 * st.timeMult) + ' min'}</div><p>Quantitative Comparison, multiple choice, numeric entry and data interpretation, with an on-screen calculator.</p><button class="btn">Start Quant</button></div>
        <div class="card click" data-start="AW"><h3>Analytical Writing</h3><div class="meta">1 Issue task · ${st.untimed ? 'untimed' : Math.round(30 * st.timeMult) + ' min'}</div><p>Write an "Analyze an Issue" essay in a plain editor with no spell-check, then self-score it against the 0–6 rubric.</p><button class="btn">Start Writing</button></div>
      </div>
      <h2>Targeted practice</h2>
      <div class="grid">
        <div class="card click" data-go="practice"><h3>Custom Practice</h3><p>Choose question types, topics, difficulty and length. See the answer and explanation after each question, or at the end.</p><button class="btn" data-go="practice">Build a set</button></div>
        <div class="card ${nMist ? 'click' : ''}" ${nMist ? 'data-act="mistakes"' : ''}><h3>Mistake Review</h3><p>${nMist ? `${nMist} question${nMist > 1 ? 's' : ''} you missed. Get one right and it leaves the list.` : 'Questions you miss show up here so you can retry them.'}</p><button class="btn" ${nMist ? '' : 'disabled'}>Retry mistakes</button></div>
        <div class="card click" data-go="study"><h3>Math Study</h3><p>${D.study.length} short notes from the ETS Math Review and Math Conventions: arithmetic, algebra, geometry, data analysis, and what you may assume on the test.</p><button class="btn" data-go="study">Open notes</button></div>
        <div class="card click" data-go="vocab"><h3>Vocabulary</h3><p>Flashcards, quizzes and a searchable list for your ${D.vocab.length} words, with progress tracking.</p><button class="btn" data-go="vocab">Study words</button></div>
        <div class="card click" data-go="history"><h3>Progress</h3><p>Past scores, accuracy by question type and topic, and your saved essays.</p><button class="btn" data-go="history">View progress</button></div>
      </div>`);
    $('#set-mult').value = String(st.timeMult);
    $('#set-mult').onchange = e => { store.set('settings', Object.assign(settings(), { timeMult: +e.target.value })); renderHome(); };
    $('#set-untimed').onchange = e => { store.set('settings', Object.assign(settings(), { untimed: e.target.checked })); renderHome(); };
    app().onclick = async e => {
      if (e.target.closest('select, input, label')) return;
      const a = e.target.closest('[data-act]');
      if (a && a.dataset.act === 'resume') return resume();
      if (a && a.dataset.act === 'discard') { if (await confirmBox('Discard test', '<p>Discard the test in progress? This cannot be undone.</p>', 'Discard')) { store.del('active'); renderHome(); } return; }
      if (a && a.dataset.act === 'mistakes') return startMistakes();
      if (navClick(e)) return;
      const s = e.target.closest('[data-start]');
      if (s) {
        if (store.get('active', null) && !(await confirmBox('Start a new test', '<p>Starting a new test will discard the one in progress.</p>', 'Start new'))) return;
        newTest(s.dataset.start);
      }
    };
  }

  function resume() {
    T = store.get('active', null);
    if (!T) return renderHome();
    if (T.intro || !T.sections[T.si]) renderIntro(); else renderRunner();
  }

  // ---------------------------------------------------------------- custom practice
  function renderPractice() {
    const last = store.get('drillCfg', { measure: 'V', types: ['tc', 'se', 'rc-single', 'rc-multi', 'rc-select'], qtypes: ['qc', 'mc-single', 'mc-multi', 'numeric', 'fraction'], topics: ['arithmetic', 'algebra', 'geometry', 'data'], diff: 0, count: 10, timed: false, feedback: 'each', gen: true });
    const chip = (name, val, label, on) => `<label class="chip"><input type="checkbox" name="${name}" value="${val}" ${on ? 'checked' : ''}> ${label}</label>`;
    const vTypes = ['tc', 'se', 'rc-single', 'rc-multi', 'rc-select'], qTypes = ['qc', 'mc-single', 'mc-multi', 'numeric', 'fraction'];
    app().innerHTML = shell('practice', `
      <h1>Custom Practice</h1><p class="lede">Build a practice set from the question bank. Questions you haven't seen yet are chosen first.</p>
      <div class="form">
        <div class="fieldset"><span class="lg">Measure</span><div class="chips">
          <label class="chip"><input type="radio" name="measure" value="V" ${last.measure === 'V' ? 'checked' : ''}> Verbal Reasoning</label>
          <label class="chip"><input type="radio" name="measure" value="Q" ${last.measure === 'Q' ? 'checked' : ''}> Quantitative Reasoning</label></div></div>
        <div class="fieldset" id="fs-v"><span class="lg">Verbal question types</span><div class="chips">${vTypes.map(t => chip('vt', t, TYPE_NAME[t], last.types.includes(t))).join('')}</div></div>
        <div class="fieldset" id="fs-q"><span class="lg">Quant question types</span><div class="chips">${qTypes.map(t => chip('qt', t, TYPE_NAME[t], last.qtypes.includes(t))).join('')}</div>
          <span class="lg" style="margin-top:14px">Topics</span><div class="chips">${Object.keys(TOPIC_NAME).map(t => chip('tp', t, TOPIC_NAME[t], last.topics.includes(t))).join('')}</div>
          ${D.gen ? `<div style="margin-top:14px"><label class="chip"><input type="checkbox" id="gen" ${last.gen ? 'checked' : ''}> Top up with auto-generated questions when the bank runs out</label></div>` : ''}</div>
        <div class="fieldset"><span class="lg">Options</span><div class="row">
          <label>Difficulty <select id="diff"><option value="0">Mixed</option><option value="1">Easy</option><option value="2">Medium</option><option value="3">Hard</option></select></label>
          <label>Questions <select id="count">${[5, 10, 15, 20, 30].map(n => `<option ${n === last.count ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
          <label>Feedback <select id="feedback"><option value="each">After each question</option><option value="end">At the end (test-like)</option></select></label>
          <label><input type="checkbox" id="timed" ${last.timed ? 'checked' : ''}> Timed at GRE pace</label></div></div>
        <div><button class="btn primary" id="go">Start practice</button> <span id="msg" class="small muted"></span></div>
      </div>`);
    $('#diff').value = String(last.diff); $('#feedback').value = last.feedback;
    const sync = () => { const m = $('input[name=measure]:checked').value; $('#fs-v').hidden = m !== 'V'; $('#fs-q').hidden = m !== 'Q'; };
    sync();
    app().onchange = sync;
    app().onclick = e => {
      if (navClick(e)) return;
      if (e.target.id !== 'go') return;
      const cfg = {
        measure: $('input[name=measure]:checked').value,
        types: $$('input[name=vt]:checked').map(x => x.value), qtypes: $$('input[name=qt]:checked').map(x => x.value),
        topics: $$('input[name=tp]:checked').map(x => x.value), diff: +$('#diff').value, count: +$('#count').value,
        timed: $('#timed').checked, feedback: $('#feedback').value, gen: $('#gen') ? $('#gen').checked : false
      };
      store.set('drillCfg', cfg);
      const items = buildDrill(cfg);
      if (!items.length) { $('#msg').textContent = 'No questions match those filters.'; return; }
      startDrill(items, cfg, `Custom Practice — ${MEASURE[cfg.measure]}`);
    };
  }

  function buildDrill(cfg) {
    const types = cfg.measure === 'V' ? cfg.types : cfg.qtypes;
    if (!types.length) return [];
    const dOK = q => !cfg.diff || (q.difficulty || 2) === cfg.diff;
    let cands = [];
    if (cfg.measure === 'V') {
      [...D.tc, ...D.se].forEach(q => cands.push({ q }));
      D.passages.forEach(p => p.questions.forEach(q => cands.push({ q, pid: p.id })));
    } else {
      D.quant.forEach(q => cands.push({ q }));
      D.sets.forEach(s => s.questions.forEach(q => cands.push({ q, sid: s.id })));
      cands = cands.filter(c => !cfg.topics.length || cfg.topics.includes(c.q.topic));
    }
    cands = cands.filter(c => types.includes(c.q.type) && dOK(c.q))
      .map(c => ({ c, s: (SEEN[c.q.id] || 0) * 100 + Math.random() * 10 }))
      .sort((a, b) => a.s - b.s);
    let picked = cands.slice(0, cfg.count).map(x => x.c);
    if (cfg.measure === 'Q' && cfg.gen && D.gen) {
      // replace already-seen questions (and fill gaps) with fresh generated ones
      const fresh = picked.filter(c => !SEEN[c.q.id]);
      const out = fresh.slice();
      let guard = 0;
      while (out.length < cfg.count && guard++ < cfg.count * 5) {
        const g = genQuant(types, cfg.diff || sampleDiff(2), cfg.topics);
        if (g) out.push({ q: g });
      }
      if (out.length >= picked.length) picked = out;
    }
    // keep passage / data-set questions together, in passage order
    const groups = [], byKey = {};
    picked.forEach(c => {
      const k = c.pid ? 'p' + c.pid : c.sid ? 's' + c.sid : null;
      if (!k) { groups.push([c]); return; }
      if (!byKey[k]) { byKey[k] = []; groups.push(byKey[k]); }
      byKey[k].push(c);
    });
    const order = (c) => { const src = c.pid ? PASSAGE[c.pid].questions : c.sid ? QSET[c.sid].questions : []; return src.indexOf(c.q); };
    return shuffle(groups).map(g => g.sort((a, b) => order(a) - order(b))).flat();
  }

  function startDrill(items, cfg, title) {
    const pace = cfg.measure === 'V' ? 41 * 60 / 27 : 47 * 60 / 27;
    const limit = cfg.timed ? Math.round(items.length * pace * (settings().timeMult || 1)) : null;
    T = { id: uid(), mode: 'drill', title, plan: [{ measure: cfg.measure }], si: 0, intro: false, started: Date.now(), feedback: cfg.feedback === 'each', settings: { hideTime: false } };
    T.sections = [newSectionState({ measure: cfg.measure, title, items, limit, level: null })];
    persist();
    renderRunner();
  }

  function startMistakes() {
    const m = Object.values(store.get('mistakes', {})).sort((a, b) => b.t - a.t).slice(0, 20);
    if (!m.length) return;
    const measure = it => /^(tc|se|rc)/.test(it.q.type) ? 'V' : 'Q';
    const v = m.filter(x => measure(x) === 'V'), q = m.filter(x => measure(x) === 'Q');
    const use = v.length >= q.length ? v : q;
    const meas = use === v ? 'V' : 'Q';
    const items = use.map(x => ({ q: x.q, pid: x.pid && PASSAGE[x.pid] ? x.pid : undefined, sid: x.sid && QSET[x.sid] ? x.sid : undefined }));
    startDrill(items, { measure: meas, timed: false, feedback: 'each' }, `Mistake Review — ${MEASURE[meas]}`);
  }

  // ---------------------------------------------------------------- history / progress
  function renderHistory() {
    const hist = store.get('history', []);
    const stats = store.get('stats', {});
    const typeRows = Object.keys(TYPE_NAME).filter(t => stats[t]).map(t => statRow(TYPE_NAME[t], stats[t])).join('');
    const topicRows = Object.keys(TOPIC_NAME).filter(t => stats['topic:' + t]).map(t => statRow(TOPIC_NAME[t], stats['topic:' + t])).join('');
    const tests = hist.filter(h => h.mode !== 'drill');
    const vs = tests.filter(h => h.scores.V).map(h => h.scores.V), qs = tests.filter(h => h.scores.Q).map(h => h.scores.Q);
    const best = a => a.length ? Math.max(...a) : '—';
    const vocabP = store.get('vocabp', {});
    const mastered = D.vocab.filter(v => (vocabP[v.w] || {}).s >= 2).length;
    app().innerHTML = shell('history', `
      <h1>Progress</h1><p class="lede">Everything is stored in this browser only (localStorage).</p>
      <div class="scores">
        <div class="score"><div class="lbl">Best Verbal</div><div class="val">${best(vs)}</div><div class="sub">${vs.length} scored attempt${vs.length === 1 ? '' : 's'}${vs.length ? ' · latest ' + vs[0] : ''}</div></div>
        <div class="score"><div class="lbl">Best Quant</div><div class="val">${best(qs)}</div><div class="sub">${qs.length} scored attempt${qs.length === 1 ? '' : 's'}${qs.length ? ' · latest ' + qs[0] : ''}</div></div>
        <div class="score"><div class="lbl">Vocabulary mastered</div><div class="val">${mastered}</div><div class="sub">of ${D.vocab.length} words</div></div>
      </div>
      <h2>Accuracy by question type</h2>${typeRows || '<p class="muted">Answer some questions to see stats.</p>'}
      ${topicRows ? `<h2>Quant accuracy by topic</h2>${topicRows}` : ''}
      <h2>History</h2>
      ${hist.length ? `<div class="scroll-x"><table class="tbl"><thead><tr><th>Date</th><th>Activity</th><th>Verbal</th><th>Quant</th><th>Writing</th><th>Raw</th></tr></thead><tbody>
        ${hist.map(h => { const aw = h.sections.find(s => s.measure === 'AW'); const raw = h.sections.filter(s => s.measure !== 'AW'); const c = raw.reduce((a, s) => a + sectionCorrect(s), 0), n = raw.reduce((a, s) => a + s.items.length, 0);
          return `<tr class="click" data-hist="${h.id}"><td>${fmtDate(h.date)}</td><td>${esc(h.title)}${h.quit ? ' <span class="pill">ended early</span>' : ''}</td><td>${h.scores.V || '—'}</td><td>${h.scores.Q || '—'}</td><td>${aw ? (aw.selfScore != null ? aw.selfScore.toFixed(1) : 'not scored') : '—'}</td><td>${n ? c + '/' + n : '—'}</td></tr>`; }).join('')}
        </tbody></table></div>` : '<p class="muted">No completed tests yet.</p>'}
      <h2>Reset</h2><p class="small muted">Clear your history, statistics, mistake list and seen-question tracking (vocabulary progress is kept).</p>
      <button class="btn danger" data-act="reset">Reset test progress</button>`);
    app().onclick = async e => {
      if (navClick(e)) return;
      const r = e.target.closest('[data-hist]');
      if (r) return renderResults(r.dataset.hist);
      const a = e.target.closest('[data-act=reset]');
      if (a && await confirmBox('Reset progress', '<p>Delete all test history, statistics and the mistake list?</p>', 'Reset')) {
        ['history', 'stats', 'mistakes', 'seen', 'seenPrompts'].forEach(store.del);
        SEEN = {};
        renderHistory();
      }
    };
  }
  function statRow(label, s) {
    const p = Math.round(100 * s.c / Math.max(1, s.t));
    return `<div class="stat-row"><div>${esc(label)}</div><div class="bar"><i style="width:${p}%"></i></div><div class="small"><b>${p}%</b> <span class="muted">${s.c}/${s.t}</span></div></div>`;
  }

  // ---------------------------------------------------------------- vocabulary
  let VS = { deck: 'all', order: [], i: 0, flipped: false, defFirst: false };
  const vprog = () => store.get('vocabp', {});
  function vstate(w, p) {
    const x = p[w] || {};
    return x.s >= 2 ? 'mastered' : x.n ? 'learning' : 'new';
  }
  function isStarred(v, p) { const x = p[v.w]; return x && x.star != null ? x.star : !!v.starred; }
  function deckWords(deck) {
    const p = vprog();
    return D.vocab.filter(v => deck === 'all' ? true : deck === 'l1' ? v.list === 1 : deck === 'l2' ? v.list === 2 : deck === 'star' ? isStarred(v, p) : deck === 'learning' ? vstate(v.w, p) !== 'mastered' : true);
  }
  function deckSelect(id, val) {
    const c = d => deckWords(d).length;
    return `<select id="${id}">${[['all', 'All words'], ['l1', 'List 1'], ['l2', 'List 2'], ['star', 'Starred'], ['learning', 'Not yet mastered']].map(([k, l]) => `<option value="${k}" ${val === k ? 'selected' : ''}>${l} (${c(k)})</option>`).join('')}</select>`;
  }

  // ---------------------------------------------------------------- math study notes
  function renderStudy(id) {
    const items = D.study, done = store.get('studyDone', {});
    const cur = items.find(s => s.id === id) || items.find(s => s.id === store.get('studyLast', '')) || items[0];
    const groups = [];
    items.forEach(s => { let g = groups.find(x => x.name === s.group); if (!g) groups.push(g = { name: s.group, items: [] }); g.items.push(s); });
    const toc = groups.map(g => `<h4>${esc(g.name)}</h4>${g.items.map(s => `<button data-sid="${s.id}" class="${s === cur ? 'on' : ''} ${done[s.id] ? 'done' : ''}">${esc(s.title)}</button>`).join('')}`).join('');
    const i = cur ? items.indexOf(cur) : 0;
    app().innerHTML = shell('study', `<h1>Math Study</h1>
      <p class="lede">Notes distilled from ETS's <i>Math Review</i> and <i>Math Conventions</i> for the Quantitative Reasoning measure. Open the full PDFs for worked examples and exercises:
        <a href="gre_math_review.pdf" target="_blank" rel="noopener">Math Review</a> · <a href="gre_math_conventions.pdf" target="_blank" rel="noopener">Math Conventions</a>.</p>
      ${cur ? `<div class="study-layout"><nav class="study-toc" aria-label="Study topics">${toc}</nav>
        <article class="study-body"><span class="muted small">${esc(cur.group)} · ${esc(cur.pdf)}</span><h2>${esc(cur.title)}</h2>${cur.html}
          <div class="study-nav"><button class="btn ghost small" data-sid="${i > 0 ? items[i - 1].id : ''}" ${i === 0 ? 'disabled' : ''}>← Previous</button>
            <label class="small"><input type="checkbox" id="sdone" ${done[cur.id] ? 'checked' : ''}> Mark as reviewed</label>
            <button class="btn small" data-sid="${i < items.length - 1 ? items[i + 1].id : ''}" ${i === items.length - 1 ? 'disabled' : ''}>Next →</button></div></article></div>` : '<p>No study notes loaded (data/math_study.js).</p>'}`);
    if (cur) store.set('studyLast', cur.id);
    app().onclick = e => {
      if (navClick(e)) return;
      const b = e.target.closest('[data-sid]');
      if (b && b.dataset.sid) { renderStudy(b.dataset.sid); window.scrollTo(0, 0); }
    };
    const box = $('#sdone');
    if (box) box.onchange = () => { const d = store.get('studyDone', {}); if (box.checked) d[cur.id] = 1; else delete d[cur.id]; store.set('studyDone', d); renderStudy(cur.id); };
  }

  function renderVocab(tab) {
    const tabs = [['cards', 'Flashcards'], ['quiz', 'Quiz'], ['list', 'Word List']];
    app().innerHTML = shell('vocab', `<h1>Vocabulary</h1><p class="lede">${D.vocab.length} words from your lists. Mark a card "Know it" twice in a row to master it; a miss sends it back to learning.</p>
      <div class="tabs">${tabs.map(([k, l]) => `<button data-tab="${k}" class="${tab === k ? 'on' : ''}">${l}</button>`).join('')}</div><div id="vbody"></div>`);
    app().onclick = e => {
      if (navClick(e)) return;
      const t = e.target.closest('[data-tab]');
      if (t) renderVocab(t.dataset.tab);
    };
    document.onkeydown = null;
    if (!D.vocab.length) { $('#vbody').innerHTML = '<p>No vocabulary loaded (data/vocab.js).</p>'; return; }
    ({ cards: vocabCards, quiz: vocabQuizSetup, list: vocabList })[tab]();
  }

  function vocabCards() {
    if (!VS.order.length || VS.deckLoaded !== VS.deck) { VS.order = shuffle(deckWords(VS.deck).map(v => v.w)); VS.i = 0; VS.deckLoaded = VS.deck; }
    const body = $('#vbody');
    const draw = () => {
      const p = vprog();
      const p2 = D.vocab.filter(v => vstate(v.w, p) === 'mastered').length;
      if (!VS.order.length) { body.innerHTML = `<div class="row" style="margin-bottom:16px">Deck ${deckSelect('deck', VS.deck)}</div><p>No words in this deck.</p>`; bindDeck(); return; }
      if (VS.i >= VS.order.length) {
        body.innerHTML = `<div class="row" style="margin-bottom:16px">Deck ${deckSelect('deck', VS.deck)}</div><div class="card" style="text-align:center;max-width:620px;margin:0 auto"><h3>Deck complete</h3><p>You've gone through all ${VS.order.length} cards.</p><button class="btn primary" id="again">Shuffle & go again</button></div>`;
        bindDeck(); $('#again').onclick = () => { VS.order = shuffle(deckWords(VS.deck).map(v => v.w)); VS.i = 0; draw(); };
        return;
      }
      const v = D.vocab.find(x => x.w === VS.order[VS.i]);
      const st = vstate(v.w, p), star = isStarred(v, p);
      const front = VS.defFirst ? `<div class="d">${esc(v.d)}</div>` : `<div class="w">${esc(v.w)}</div>`;
      const back = VS.defFirst ? `<div class="w">${esc(v.w)}</div>` : `<div class="d">${esc(v.d)}</div>`;
      body.innerHTML = `<div class="row" style="margin-bottom:16px">Deck ${deckSelect('deck', VS.deck)}<label class="small"><input type="checkbox" id="deffirst" ${VS.defFirst ? 'checked' : ''}> Show definition first</label><span class="spacer"></span><span class="small muted">${p2} / ${D.vocab.length} mastered</span></div>
        <div class="flash"><div class="flash-card ${VS.flipped ? 'flipped' : ''}" id="fc" tabindex="0" aria-label="Flashcard, click to flip">
          <div class="flash-face"><span class="tag">${st}${v.list ? ' · list ' + v.list : ''}</span><button class="star" id="star" title="Star">${star ? '★' : '☆'}</button>${front}<div class="small muted" style="margin-top:18px">click or press space to flip</div></div>
          <div class="flash-face back"><span class="tag">${esc(v.w)}</span>${back}</div></div>
        <div class="flash-nav"><button class="btn" id="miss">← Still learning</button><span class="muted small">${VS.i + 1} / ${VS.order.length}</span><button class="btn primary" id="know">Know it →</button></div>
        <div class="flash-nav"><button class="btn ghost small" id="prev">Previous</button><button class="btn ghost small" id="shuf">Shuffle</button></div></div>`;
      bindDeck();
      $('#deffirst').onchange = e => { VS.defFirst = e.target.checked; VS.flipped = false; draw(); };
      $('#fc').onclick = e => { if (e.target.id === 'star') return; VS.flipped = !VS.flipped; $('#fc').classList.toggle('flipped', VS.flipped); };
      $('#star').onclick = () => { const pp = vprog(); pp[v.w] = Object.assign(pp[v.w] || {}, { star: !star }); store.set('vocabp', pp); draw(); };
      $('#know').onclick = () => answer(v, true);
      $('#miss').onclick = () => answer(v, false);
      $('#prev').onclick = () => { if (VS.i > 0) { VS.i--; VS.flipped = false; draw(); } };
      $('#shuf').onclick = () => { VS.order = shuffle(VS.order); VS.i = 0; VS.flipped = false; draw(); };
    };
    const answer = (v, ok) => {
      const p = vprog(), x = p[v.w] || (p[v.w] = {});
      x.n = (x.n || 0) + 1; x.s = ok ? (x.s || 0) + 1 : 0;
      store.set('vocabp', p);
      VS.i++; VS.flipped = false; draw();
    };
    const bindDeck = () => { $('#deck').onchange = e => { VS.deck = e.target.value; VS.order = []; vocabCards(); }; };
    document.onkeydown = e => {
      if (!$('#fc') || e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT') return;
      if (e.key === ' ') { e.preventDefault(); $('#fc').click(); }
      else if (e.key === 'ArrowRight') $('#know').click();
      else if (e.key === 'ArrowLeft') $('#miss').click();
    };
    draw();
  }

  function vocabQuizSetup() {
    const body = $('#vbody');
    body.innerHTML = `<div class="form"><div class="fieldset"><div class="row">
      <label>Deck ${deckSelect('qdeck', 'all')}</label>
      <label>Format <select id="qdir"><option value="wd">Word → definition</option><option value="dw">Definition → word</option><option value="mix">Mixed</option></select></label>
      <label>Questions <select id="qn"><option>10</option><option selected>20</option><option>50</option></select></label></div></div>
      <div><button class="btn primary" id="qgo">Start quiz</button></div></div>`;
    $('#qgo').onclick = () => {
      const words = deckWords($('#qdeck').value);
      if (words.length < 1) return;
      const p = vprog();
      // weight toward words not yet mastered
      const pool = shuffle(words).sort((a, b) => (vstate(a.w, p) === 'mastered') - (vstate(b.w, p) === 'mastered'));
      runQuiz(pool.slice(0, +$('#qn').value), $('#qdir').value);
    };
  }

  function runQuiz(words, dir) {
    const body = $('#vbody');
    let i = 0, score = 0;
    const missed = [];
    const next = () => {
      if (i >= words.length) {
        body.innerHTML = `<div class="card" style="max-width:680px"><h3>Quiz complete: ${score} / ${words.length}</h3>
          ${missed.length ? `<p>Review these:</p><table class="tbl">${missed.map(v => `<tr><td><b>${esc(v.w)}</b></td><td>${esc(v.d)}</td></tr>`).join('')}</table>` : '<p>Perfect score!</p>'}
          <div class="row" style="margin-top:14px"><button class="btn primary" id="qagain">New quiz</button>${missed.length ? '<button class="btn" id="qmiss">Retry missed words</button>' : ''}</div></div>`;
        $('#qagain').onclick = vocabQuizSetup;
        if (missed.length) $('#qmiss').onclick = () => runQuiz(shuffle(missed), dir);
        return;
      }
      const v = words[i];
      const d = dir === 'mix' ? (Math.random() < 0.5 ? 'wd' : 'dw') : dir;
      const distract = shuffle(D.vocab.filter(x => x.w !== v.w && x.d !== v.d)).slice(0, 4);
      const opts = shuffle([v, ...distract]);
      body.innerHTML = `<div class="small muted">Question ${i + 1} of ${words.length} · score ${score}</div>
        <div class="quiz-q">${d === 'wd' ? esc(v.w) : esc(v.d)}</div>
        <div class="small muted" style="margin-bottom:10px">${d === 'wd' ? 'Choose the best definition.' : 'Choose the word that matches.'}</div>
        <div class="quiz-opts">${opts.map((o, k) => `<button data-k="${k}">${d === 'wd' ? esc(o.d) : '<b>' + esc(o.w) + '</b>'}</button>`).join('')}</div>
        <div id="qfb" style="margin-top:14px"></div>`;
      $('.quiz-opts').onclick = e => {
        const b = e.target.closest('button[data-k]');
        if (!b) return;
        const pick = opts[+b.dataset.k], ok = pick === v;
        $$('.quiz-opts button').forEach((x, k) => { x.disabled = true; if (opts[k] === v) x.classList.add('correct'); });
        if (!ok) { b.classList.add('wrong'); missed.push(v); } else score++;
        const p = vprog(), x = p[v.w] || (p[v.w] = {});
        x.n = (x.n || 0) + 1; x.s = ok ? (x.s || 0) + 1 : 0;
        store.set('vocabp', p);
        $('#qfb').innerHTML = `<div class="expl ${ok ? 'ok' : 'bad'}"><div class="verdict">${ok ? '✓ Correct' : '✗ Not quite'}</div><b>${esc(v.w)}</b> — ${esc(v.d)}</div><div style="margin-top:12px"><button class="btn primary" id="qnext">Next →</button></div>`;
        $('#qnext').onclick = () => { i++; next(); };
        $('#qnext').focus();
      };
    };
    next();
  }

  function vocabList() {
    const body = $('#vbody');
    body.innerHTML = `<div class="row" style="margin-bottom:14px"><input class="search" id="vq" placeholder="Search words or definitions…" autocomplete="off"><select id="vf"><option value="all">All</option><option value="new">New</option><option value="learning">Learning</option><option value="mastered">Mastered</option><option value="star">Starred</option></select><span class="small muted" id="vcount"></span></div>
      <div class="scroll-x"><table class="tbl"><thead><tr><th style="width:30px"></th><th>Word</th><th>Definition</th><th>Status</th></tr></thead><tbody id="vrows"></tbody></table></div>`;
    const draw = () => {
      const p = vprog(), s = $('#vq').value.trim().toLowerCase(), f = $('#vf').value;
      const rows = D.vocab.filter(v => (!s || v.w.toLowerCase().includes(s) || v.d.toLowerCase().includes(s)) && (f === 'all' || (f === 'star' ? isStarred(v, p) : vstate(v.w, p) === f)))
        .sort((a, b) => a.w.localeCompare(b.w));
      $('#vcount').textContent = rows.length + ' words';
      $('#vrows').innerHTML = rows.map(v => { const st = vstate(v.w, p); return `<tr><td><button class="link" data-star="${esc(v.w)}" style="text-decoration:none;font-size:16px;color:#c9a227">${isStarred(v, p) ? '★' : '☆'}</button></td><td><b>${esc(v.w)}</b></td><td>${esc(v.d)}</td><td><span class="pill ${st === 'mastered' ? 'ok' : st === 'learning' ? 'd2' : ''}">${st}</span></td></tr>`; }).join('');
    };
    $('#vq').oninput = draw; $('#vf').onchange = draw;
    $('#vrows').onclick = e => {
      const b = e.target.closest('[data-star]');
      if (!b) return;
      const p = vprog(), v = D.vocab.find(x => x.w === b.dataset.star);
      p[v.w] = Object.assign(p[v.w] || {}, { star: !isStarred(v, p) });
      store.set('vocabp', p); draw();
    };
    draw();
  }

  // ---------------------------------------------------------------- boot
  window.addEventListener('beforeunload', () => { if (T) persist(); });
  // Alt+N / Alt+B / Alt+M shortcuts inside a section
  document.addEventListener('keydown', e => {
    if (!T || !e.altKey) return;
    const k = e.key.toLowerCase(), map = { n: 'next', b: 'back', m: 'mark', r: 'review' };
    const b = map[k] && $(`.tbtns [data-cmd="${map[k]}"]`);
    if (b && !b.disabled) { e.preventDefault(); b.click(); }
  });
  renderHome();
})();
