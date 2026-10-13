/* Procedural GRE Quantitative question generator.
   Plain browser script (no modules). Defines window.QUANT_GEN = { generators, generate }.
   Each generator: { name, topic, type, fn(difficulty, rng) -> question } where rng() returns [0,1).
   Generated questions follow the same schema as window.QUANT_BANK and also carry a small
   `meta` object (generator name + parameters) that the app can ignore. */
window.QUANT_GEN = (function () {
  "use strict";

  /* ============================== utilities ============================== */
  var seq = 0;
  function ri(rng, a, b) { return a + Math.floor(rng() * (b - a + 1)); }
  function pick(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }
  function shuffle(rng, arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rng() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
  function lcm(a, b) { return a / gcd(a, b) * b; }
  function clean(x) { return Math.round(x * 1e9) / 1e9; }
  function round(x, p) { var m = Math.pow(10, p); return Math.round(clean(x) * m) / m; }
  function isInt(x) { return Math.abs(x - Math.round(x)) < 1e-9; }
  function isPrime(n) { if (n < 2) return false; for (var i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; }
  function factor(n) { var f = [], p = 2; while (n > 1 && p * p <= n) { var e = 0; while (n % p === 0) { n /= p; e++; } if (e) f.push([p, e]); p++; } if (n > 1) f.push([n, 1]); return f; }
  function divisors(n) { var d = []; for (var i = 1; i <= n; i++) if (n % i === 0) d.push(i); return d; }
  function choose(n, k) { if (k < 0 || k > n) return 0; var r = 1; for (var i = 0; i < k; i++) r = r * (n - i) / (i + 1); return Math.round(r); }
  function perm(n, k) { var r = 1; for (var i = 0; i < k; i++) r *= (n - i); return r; }
  function fact(n) { return perm(n, n); }
  function modpow(b, e, m) { var r = 1 % m; b %= m; for (var i = 0; i < e; i++) r = (r * b) % m; return r; }
  function sum(a) { var s = 0; for (var i = 0; i < a.length; i++) s += a[i]; return s; }
  function mean(a) { return sum(a) / a.length; }
  function sorted(a) { return a.slice().sort(function (x, y) { return x - y; }); }
  function median(a) { var s = sorted(a), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; }
  function sd(a) { var m = mean(a), v = 0; for (var i = 0; i < a.length; i++) v += (a[i] - m) * (a[i] - m); return Math.sqrt(v / a.length); }
  function modes(a) { var c = {}, best = 0, out = []; a.forEach(function (x) { c[x] = (c[x] || 0) + 1; best = Math.max(best, c[x]); }); for (var k in c) if (c[k] === best) out.push(+k); return { modes: sorted(out), count: best }; }

  /* ---- formatting ---- */
  function num(x) {
    x = clean(x);
    var neg = x < 0; x = Math.abs(x);
    var s = String(x);
    if (s.indexOf("e") >= 0) s = x.toFixed(6).replace(/0+$/, "").replace(/\.$/, "");
    var parts = s.split(".");
    if (parts[0].length > 4) parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return (neg ? "&minus;" : "") + parts.join(".");
  }
  function money(x) { x = clean(x); if (isInt(x)) return "$" + num(x); var p = Math.abs(x).toFixed(2).split("."); return (x < 0 ? "&minus;" : "") + "$" + num(+p[0]) + "." + p[1]; }
  function V(v) { return "<i>" + v + "</i>"; }
  function sup(b, e) { return b + "<sup>" + e + "</sup>"; }
  function fhtml(n, d) { return "<span class='frac'><span>" + n + "</span><span>" + d + "</span></span>"; }
  /* rationals as [n, d] with d > 0, reduced */
  function R(n, d) { if (d < 0) { n = -n; d = -d; } var g = gcd(n, d) || 1; return [n / g, d / g]; }
  function radd(a, b) { return R(a[0] * b[1] + b[0] * a[1], a[1] * b[1]); }
  function rsub(a, b) { return R(a[0] * b[1] - b[0] * a[1], a[1] * b[1]); }
  function rmul(a, b) { return R(a[0] * b[0], a[1] * b[1]); }
  function rdiv(a, b) { return R(a[0] * b[1], a[1] * b[0]); }
  function rval(a) { return a[0] / a[1]; }
  function rh(a) { /* rational -> HTML */
    a = R(a[0], a[1]);
    if (a[1] === 1) return num(a[0]);
    return (a[0] < 0 ? "&minus;" : "") + fhtml(Math.abs(a[0]), a[1]);
  }
  function signed(c, first) { /* coefficient joiner for polynomials */
    if (first) return c < 0 ? "&minus;" : "";
    return c < 0 ? " &minus; " : " + ";
  }
  function poly(terms) { /* terms: [[coef, varHtml]] ; skips zeros */
    var s = "", first = true;
    for (var i = 0; i < terms.length; i++) {
      var c = terms[i][0], v = terms[i][1];
      if (c === 0) continue;
      var a = Math.abs(c);
      s += signed(c, first) + ((a === 1 && v) ? "" : num(a)) + v;
      first = false;
    }
    return s || "0";
  }
  function piH(q) { /* rational coefficient of pi */
    q = R(q[0], q[1]);
    if (q[0] === 0) return "0";
    if (q[1] === 1) return (q[0] === 1 ? "" : num(q[0])) + "&pi;";
    return fhtml(num(q[0]) + "&pi;", q[1]);
  }
  function radH(c, r) { /* c * sqrt(r) */
    if (r === 1) return num(c);
    return (c === 1 ? "" : num(c)) + "&radic;" + r;
  }
  function pct(v) { return num(v) + "%"; }

  /* ---- question builders ---- */
  function base(name, topic, d, type, meta) {
    seq++;
    var q = { id: "gen-" + name + "-" + seq.toString(36) + Math.floor(Math.random() * 1679616).toString(36), type: type, topic: topic, difficulty: d };
    meta = meta || {}; meta.gen = name; q.meta = meta;
    return q;
  }
  /* Build a 5-option multiple choice.
     o.render(v)->html, o.value(v)->number|null (for dedupe + ascending sort), o.fill(k)->extra candidate, o.sort (default true if value given) */
  function buildMC(rng, correct, cands, o) {
    var render = o.render, value = o.value || null, list = [], seenH = {}, seenV = [];
    function ok(v) {
      if (v === null || v === undefined) return false;
      var h = render(v);
      if (seenH[h]) return false;
      if (value) {
        var x = value(v);
        if (typeof x !== "number" || !isFinite(x)) return false;
        for (var i = 0; i < seenV.length; i++) if (Math.abs(seenV[i] - x) < 1e-9) return false;
      }
      if (o.valid && !o.valid(v)) return false;
      return true;
    }
    function add(v, c) { seenH[render(v)] = 1; if (value) seenV.push(value(v)); list.push({ v: v, c: c }); }
    add(correct, true);
    if (value && o.sort !== false) {
      /* numeric options are shown in ascending order (GRE convention); pick a random feasible
         position for the correct answer, preferring the supplied "common error" distractors. */
      var cv = value(correct), below = [], above = [];
      var consider = function (v) { if (!ok(v)) return; var x = value(v); seenH[render(v)] = 1; seenV.push(x); (x < cv ? below : above).push(v); };
      for (var a = 0; a < cands.length; a++) consider(cands[a]);
      var nbC = below.length, naC = above.length;
      for (var kk = 1; kk <= 120 && (below.length < 4 || above.length < 4); kk++) consider(o.fill(kk));
      var feas = [];
      if (o.preferCands) for (var t0 = 0; t0 <= 4; t0++) if (nbC >= t0 && naC >= 4 - t0) feas.push(t0);
      if (!feas.length) for (var t = 0; t <= 4; t++) if (below.length >= t && above.length >= 4 - t) feas.push(t);
      if (!feas.length) throw new Error("buildMC: could not find 5 distinct options");
      var tt = pick(rng, feas);
      var chosen = below.slice(0, tt).concat(above.slice(0, 4 - tt));
      for (var c2 = 0; c2 < chosen.length; c2++) list.push({ v: chosen[c2], c: false });
      list.sort(function (p, q2) { return value(p.v) - value(q2.v); });
      return { options: list.map(function (x) { return render(x.v); }), answer: [tt] };
    }
    for (var i = 0; i < cands.length && list.length < 5; i++) if (ok(cands[i])) add(cands[i], false);
    var k = 1;
    while (list.length < 5 && k < 1000) { var f = o.fill(k++); if (ok(f)) add(f, false); }
    if (list.length < 5) throw new Error("buildMC: could not find 5 distinct options");
    if (value && o.sort !== false) list.sort(function (a, b) { return value(a.v) - value(b.v); });
    else list = shuffle(rng, list);
    var ans = 0;
    for (var j = 0; j < 5; j++) if (list[j].c) ans = j;
    return { options: list.map(function (x) { return render(x.v); }), answer: [ans] };
  }
  function numFill(correct, step) { return function (k) { var s = Math.ceil(k / 2) * step; return clean(k % 2 ? correct + s : correct - s); }; }
  function mcNum(rng, correct, cands, step, render, valid) {
    return buildMC(rng, correct, cands, { render: render || num, value: function (v) { return v; }, fill: numFill(correct, step || 1), valid: valid });
  }
  function qcAnswer(a, b) { var d = a - b, tol = 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)); return d > tol ? 0 : (d < -tol ? 1 : 2); }
  var QC_WORDS = ["Quantity A is greater", "Quantity B is greater", "The two quantities are equal", "The relationship cannot be determined"];
  function multiPrompt(p, what) { return p + "<br>Indicate <u>all</u> such " + (what || "values") + "."; }

  /* ============================== generators ============================== */
  var G = [];
  function add(name, topic, type, fn) { G.push({ name: name, topic: topic, type: type, fn: fn }); }

  /* ------------------------------ ARITHMETIC ------------------------------ */
  add("percent-change", "arithmetic", "mc-single", function (d, rng) {
    var q, mc, s;
    if (d === 1) {
      var P = 20 * ri(rng, 2, 20), r = pick(rng, [10, 15, 20, 25, 30, 40]), up = rng() < 0.5;
      s = up ? 1 : -1;
      var ans = clean(P * (1 + s * r / 100));
      mc = mcNum(rng, ans, [clean(P * r / 100), clean(P * (1 - s * r / 100)), P + s * r, clean(P * (1 + s * 2 * r / 100))], 5, money, function (v) { return v > 0; });
      q = base("percent-change", "arithmetic", d, "mc-single", { P: P, r: r, up: up });
      q.prompt = up ? "The price of an item increases from " + money(P) + " by " + r + "%. What is the new price?" :
        "An item regularly priced at " + money(P) + " is discounted by " + r + "%. What is the sale price?";
      q.explanation = "<p>The change is " + r + "% of " + money(P) + " = " + money(P * r / 100) + ". New price = " + money(P) + (up ? " + " : " &minus; ") + money(P * r / 100) + " = <b>" + money(ans) + "</b>.</p><p>Equivalently, multiply by " + num(1 + s * r / 100) + ".</p>";
    } else if (d === 2) {
      var a = pick(rng, [10, 20, 25, 30, 40, 50]), b = pick(rng, [10, 20, 25, 30, 40, 50]);
      var s1 = rng() < 0.75 ? 1 : -1, s2 = rng() < 0.75 ? -1 : 1;
      var net = clean(((1 + s1 * a / 100) * (1 + s2 * b / 100) - 1) * 100);
      var render = function (v) { v = clean(v); return v > 0 ? "An increase of " + num(v) + "%" : v < 0 ? "A decrease of " + num(-v) + "%" : "No change"; };
      mc = buildMC(rng, net, [s1 * a + s2 * b, -net, 0, clean(s1 * s2 * a * b / 100), clean(s1 * a + s2 * b - s1 * s2 * a * b / 100)], { render: render, value: function (v) { return v; }, fill: numFill(net, 2.5) });
      q = base("percent-change", "arithmetic", d, "mc-single", { a: a, b: b, s1: s1, s2: s2 });
      q.prompt = "The value of an investment " + (s1 > 0 ? "increased" : "decreased") + " by " + a + "% in one year and then " + (s2 > 0 ? "increased" : "decreased") + " by " + b + "% the next year. What was the net percent change over the two years?";
      q.explanation = "<p>Multiply the growth factors: " + num(1 + s1 * a / 100) + " &times; " + num(1 + s2 * b / 100) + " = " + num(1 + net / 100) + ".</p><p>So the net change is <b>" + render(net).toLowerCase() + "</b>. Percent changes cannot simply be added, because the second change applies to a different base.</p>";
    } else {
      var P3 = 20 * ri(rng, 2, 25), r3 = pick(rng, [20, 25, 40, 50, 60, 75, 80]), up3 = rng() < 0.5;
      if (!up3 && r3 >= 75) r3 = pick(rng, [20, 25, 40]);
      s = up3 ? 1 : -1;
      var X = clean(P3 * (1 + s * r3 / 100));
      mc = mcNum(rng, P3, [clean(X * (1 - s * r3 / 100)), clean(X - s * r3), clean(X * (1 + s * r3 / 100))], 10, money, function (v) { return v > 0; });
      q = base("percent-change", "arithmetic", d, "mc-single", { P: P3, r: r3, up: up3 });
      q.prompt = up3 ? "After its price was increased by " + r3 + "%, an item costs " + money(X) + ". What was the price before the increase?" :
        "After a " + r3 + "% discount, an item costs " + money(X) + ". What was the price before the discount?";
      q.explanation = "<p>If the original price is <i>p</i>, then " + num(1 + s * r3 / 100) + "<i>p</i> = " + num(X) + ", so <i>p</i> = " + num(X) + " &divide; " + num(1 + s * r3 / 100) + " = <b>" + money(P3) + "</b>.</p><p>A common trap is to " + (up3 ? "subtract" : "add") + " " + r3 + "% of the <i>new</i> price, which gives " + money(X * (1 - s * r3 / 100)) + ".</p>";
    }
    q.options = mc.options; q.answer = mc.answer;
    return q;
  });

  add("percent-of", "arithmetic", "numeric", function (d, rng) {
    var q;
    if (d === 1) {
      var p = pick(rng, [5, 10, 15, 20, 25, 30, 40, 60, 75]), n = 20 * ri(rng, 2, 30);
      q = base("percent-of", "arithmetic", d, "numeric", { p: p, n: n });
      q.prompt = "What is " + p + "% of " + num(n) + "?";
      q.answer = clean(p * n / 100);
      q.explanation = "<p>" + p + "% of " + num(n) + " = " + num(p / 100) + " &times; " + num(n) + " = <b>" + num(q.answer) + "</b>.</p>";
    } else if (d === 2) {
      var y, pp, x;
      do { y = pick(rng, [20, 25, 40, 50, 80, 125, 200, 250, 400, 500]); pp = pick(rng, [4, 5, 8, 12, 15, 24, 35, 45, 60, 64, 75, 120, 150, 175]); x = y * pp / 100; } while (!isInt(x));
      q = base("percent-of", "arithmetic", d, "numeric", { x: x, y: y });
      q.prompt = num(x) + " is what percent of " + num(y) + "?";
      q.after = "%"; q.answer = pp;
      q.explanation = "<p>" + num(x) + " &divide; " + num(y) + " = " + num(pp / 100) + " = <b>" + pp + "%</b>.</p>";
    } else {
      var N = 20 * ri(rng, 3, 40), p1 = pick(rng, [15, 20, 25, 30, 40, 60, 75]), r = pick(rng, [35, 45, 50, 65, 80, 120, 150]);
      var qv = N * p1 / 100;
      q = base("percent-of", "arithmetic", d, "numeric", { N: N, p: p1, q: qv, r: r });
      q.prompt = "If " + p1 + "% of a number is " + num(qv) + ", what is " + r + "% of the number?";
      q.answer = clean(N * r / 100);
      q.explanation = "<p>The number is " + num(qv) + " &divide; " + num(p1 / 100) + " = " + num(N) + ". Then " + r + "% of " + num(N) + " = <b>" + num(q.answer) + "</b>.</p><p>Shortcut: multiply " + num(qv) + " by " + r + "/" + p1 + ".</p>";
    }
    return q;
  });

  add("remainder", "arithmetic", "mc-single", function (d, rng) {
    var q, mc, m, ans;
    if (d === 1) {
      m = ri(rng, 5, 12); var N = ri(rng, 100, 999); ans = N % m;
      mc = mcNum(rng, ans, [Math.floor(N / m), (ans + 1) % m, m - ans], 1, null, function (v) { return v >= 0; });
      q = base("remainder", "arithmetic", d, "mc-single", { N: N, m: m });
      q.prompt = "What is the remainder when " + num(N) + " is divided by " + m + "?";
      q.explanation = "<p>" + num(N) + " = " + m + " &times; " + Math.floor(N / m) + " + " + ans + ", so the remainder is <b>" + ans + "</b>. (" + Math.floor(N / m) + " is the quotient, not the remainder.)</p>";
    } else if (d === 2) {
      m = ri(rng, 5, 12); var r = ri(rng, 1, m - 1), k = ri(rng, 2, 9), c = ri(rng, 1, 9);
      ans = (k * r + c) % m;
      mc = buildMC(rng, ans, [k * r + c, (r + c) % m, (k * r) % m, (k * (r + c)) % m], { render: num, value: function (v) { return v; }, fill: function (j) { return (ans + j) % m; } });
      q = base("remainder", "arithmetic", d, "mc-single", { m: m, r: r, k: k, c: c });
      q.prompt = "When the positive integer " + V("n") + " is divided by " + m + ", the remainder is " + r + ". What is the remainder when " + k + V("n") + " + " + c + " is divided by " + m + "?";
      q.explanation = "<p>Write " + V("n") + " = " + m + V("q") + " + " + r + ". Then " + k + V("n") + " + " + c + " = " + (k * m) + V("q") + " + " + (k * r + c) + ".</p><p>The first term is a multiple of " + m + ", so the remainder comes from " + (k * r + c) + " &divide; " + m + ", which is <b>" + ans + "</b>.</p>";
    } else {
      var pairs = [[2, 5], [3, 5], [2, 7], [3, 7], [5, 7], [2, 9], [4, 9], [3, 10], [7, 10], [2, 11], [3, 11], [2, 13], [4, 7], [6, 11]];
      var pr = pick(rng, pairs), a = pr[0]; m = pr[1]; var e = ri(rng, 20, 99);
      ans = modpow(a, e, m);
      var cyc = [], v = a % m; do { cyc.push(v); v = (v * a) % m; } while (v !== a % m && cyc.length < 20);
      mc = buildMC(rng, ans, [modpow(a, e % 4, m), e % m, (a * e) % m, 1, modpow(a, e + 1, m)], { render: num, value: function (x) { return x; }, fill: function (j) { return (ans + j) % m; } });
      q = base("remainder", "arithmetic", d, "mc-single", { a: a, e: e, m: m });
      q.prompt = "What is the remainder when " + sup(a, e) + " is divided by " + m + "?";
      q.explanation = "<p>The remainders of " + a + "<sup>1</sup>, " + a + "<sup>2</sup>, " + a + "<sup>3</sup>, &hellip; when divided by " + m + " repeat in a cycle of length " + cyc.length + ": " + cyc.join(", ") + ".</p><p>" + e + " = " + cyc.length + " &times; " + Math.floor(e / cyc.length) + " + " + (e % cyc.length) + ", so the remainder is the " + (e % cyc.length === 0 ? "last" : "#" + (e % cyc.length)) + " entry of the cycle: <b>" + ans + "</b>.</p>";
    }
    q.options = mc.options; q.answer = mc.answer;
    return q;
  });

  add("units-digit", "arithmetic", "mc-single", function (d, rng) {
    var q, ans, mc, b, e, u;
    function ud(b, e) { return modpow(b % 10, e, 10); }
    function cycleText(b) { var c = [], v = b % 10; for (var i = 0; i < 4; i++) { c.push(v); v = (v * (b % 10)) % 10; } return c.join(", "); }
    if (d <= 2) {
      do { b = d === 1 ? pick(rng, [2, 3, 4, 7, 8, 9]) : ri(rng, 12, 99); } while (b % 10 === 0 || b % 10 === 1 || b % 10 === 5 || b % 10 === 6);
      e = ri(rng, 15, 99);
      ans = ud(b, e);
      mc = buildMC(rng, ans, [b % 10, ud(b, (e % 4) - 1 > 0 ? (e % 4) - 1 : 3), (b * e) % 10, ud(b, e + 1), e % 10], { render: num, value: function (v) { return v; }, fill: function (k) { return (ans + k) % 10; } });
      q = base("units-digit", "arithmetic", d, "mc-single", { b: b, e: e });
      q.prompt = "What is the units digit of " + sup(b, e) + "?";
      q.explanation = "<p>Only the units digit " + (b % 10) + " matters. Its powers end in a repeating cycle of length 4: " + cycleText(b) + ".</p><p>" + e + " leaves remainder " + (e % 4) + " when divided by 4, so the units digit is <b>" + ans + "</b>.</p>";
    } else {
      var b1 = pick(rng, [2, 3, 7, 8, 13, 17, 22, 28]), b2 = pick(rng, [3, 4, 7, 9, 12, 19, 23, 27]);
      var e1 = ri(rng, 20, 80), e2 = ri(rng, 20, 80), u1 = ud(b1, e1), u2 = ud(b2, e2);
      ans = (u1 + u2) % 10;
      mc = buildMC(rng, ans, [u1, u2, (u1 * u2) % 10, (ans + 1) % 10, (b1 + b2) % 10], { render: num, value: function (v) { return v; }, fill: function (k) { return (ans + k) % 10; } });
      q = base("units-digit", "arithmetic", d, "mc-single", { b1: b1, e1: e1, b2: b2, e2: e2 });
      q.prompt = "What is the units digit of " + sup(b1, e1) + " + " + sup(b2, e2) + "?";
      q.explanation = "<p>The units digits of powers repeat every 4. " + sup(b1, e1) + " ends in " + u1 + " (cycle " + cycleText(b1) + ", remainder " + (e1 % 4) + "). " + sup(b2, e2) + " ends in " + u2 + " (cycle " + cycleText(b2) + ", remainder " + (e2 % 4) + ").</p><p>" + u1 + " + " + u2 + " = " + (u1 + u2) + ", so the units digit is <b>" + ans + "</b>.</p>";
    }
    q.options = mc.options; q.answer = mc.answer;
    return q;
  });

  add("prime-factor-qc", "arithmetic", "qc", function (d, rng) {
    function fstr(n) { return factor(n).map(function (f) { return f[1] > 1 ? sup(f[0], f[1]) : f[0]; }).join(" &times; "); }
    var q, X, Y;
    if (d === 1 || d === 2) {
      var lo = d === 1 ? 30 : 60, hi = d === 1 ? 300 : 2000;
      X = ri(rng, lo, hi); Y = ri(rng, lo, hi);
      var useDiv = d === 2;
      var fa = useDiv ? divisors(X).length : factor(X).length, fb = useDiv ? divisors(Y).length : factor(Y).length;
      var what = useDiv ? "The number of positive divisors of " : "The number of distinct prime factors of ";
      q = base("prime-factor-qc", "arithmetic", d, "qc", { X: X, Y: Y, kind: useDiv ? "div" : "prime" });
      q.quantityA = what + num(X); q.quantityB = what + num(Y);
      q.answer = [qcAnswer(fa, fb)];
      var cnt = function (n) {
        var f = factor(n);
        return useDiv ? "(" + f.map(function (x) { return x[1] + " + 1"; }).join(")(") + ") = " + divisors(n).length : f.length;
      };
      q.explanation = "<p>" + num(X) + " = " + fstr(X) + ", which gives " + cnt(X) + ". " + num(Y) + " = " + fstr(Y) + ", which gives " + cnt(Y) + ".</p><p><b>" + QC_WORDS[q.answer[0]] + "</b>.</p>";
    } else {
      var kind = pick(rng, ["mult", "square", "twice"]);
      q = base("prime-factor-qc", "arithmetic", d, "qc", { kind: kind });
      q.info = V("n") + " is a positive integer.";
      if (kind === "mult") {
        var k = pick(rng, [6, 10, 15, 30]);
        q.meta.k = k;
        q.quantityA = "The number of distinct prime factors of " + V("n");
        q.quantityB = "The number of distinct prime factors of " + k + V("n");
        q.answer = [3];
        q.explanation = "<p>If " + V("n") + " = " + k + ", both quantities equal " + factor(k).length + ". If " + V("n") + " = 1, Quantity A is 0 and Quantity B is " + factor(k).length + ". Since " + k + V("n") + " has every prime factor of " + V("n") + " and possibly more, B &ge; A, but the two can be equal. <b>The relationship cannot be determined</b>.</p>";
      } else if (kind === "square") {
        q.quantityA = "The number of distinct prime factors of " + sup(V("n"), 2);
        q.quantityB = "The number of distinct prime factors of " + V("n");
        q.answer = [2];
        q.explanation = "<p>Squaring changes only the exponents in the prime factorization, never which primes appear. The quantities are <b>equal</b> for every " + V("n") + " (both are 0 when " + V("n") + " = 1).</p>";
      } else {
        q.quantityA = "The number of positive divisors of " + sup(V("n"), 2);
        q.quantityB = "Twice the number of positive divisors of " + V("n");
        q.answer = [3];
        q.explanation = "<p>" + V("n") + " = 1: A = 1 and B = 2, so B is greater. " + V("n") + " = 2: A = 3 (divisors of 4) and B = 4. " + V("n") + " = 6: A = 9 (divisors of 36) and B = 8, so A is greater.</p><p><b>The relationship cannot be determined</b>.</p>";
      }
    }
    return q;
  });

  add("divisor-count", "arithmetic", "numeric", function (d, rng) {
    function fstr(n) { return factor(n).map(function (f) { return f[1] > 1 ? sup(f[0], f[1]) : f[0]; }).join(" &times; "); }
    var n, q;
    if (d === 1) { do { n = ri(rng, 12, 100); } while (divisors(n).length < 4); }
    else { var ps = [2, 3, 5, 7, 11], lim = d === 2 ? 2000 : 10000; do { n = 1; var k = ri(rng, 2, 3); for (var i = 0; i < k; i++) n *= Math.pow(pick(rng, ps), ri(rng, 1, 3)); } while (n > lim || n < 60 || factor(n).length < 2); }
    var f = factor(n), dv = divisors(n);
    if (d < 3) {
      q = base("divisor-count", "arithmetic", d, "numeric", { n: n, kind: "all" });
      q.prompt = "How many positive divisors does " + num(n) + " have?";
      q.answer = dv.length;
      q.explanation = "<p>" + num(n) + " = " + fstr(n) + ". Add 1 to each exponent and multiply: " + f.map(function (x) { return "(" + x[1] + " + 1)"; }).join("") + " = <b>" + dv.length + "</b>.</p>";
    } else {
      var kind = pick(rng, ["even", "odd", "square"]);
      var cnt = dv.filter(function (x) { return kind === "even" ? x % 2 === 0 : kind === "odd" ? x % 2 === 1 : isInt(Math.sqrt(x)); }).length;
      if (cnt === 0 || (kind === "even" && n % 2)) { kind = "odd"; cnt = dv.filter(function (x) { return x % 2; }).length; }
      q = base("divisor-count", "arithmetic", d, "numeric", { n: n, kind: kind });
      q.prompt = "How many positive divisors of " + num(n) + " are " + (kind === "square" ? "perfect squares" : kind) + "?";
      q.answer = cnt;
      var odd = f.filter(function (x) { return x[0] !== 2; });
      var ex = kind === "even" ? "An even divisor must use 2 at least once, so the exponent of 2 has " + (f[0][0] === 2 ? f[0][1] : 0) + " choices, and each other prime keeps its usual number of choices." :
        kind === "odd" ? "An odd divisor uses no factor of 2, so count the divisors of the odd part" + (odd.length ? " (" + odd.map(function (x) { return x[1] > 1 ? sup(x[0], x[1]) : x[0]; }).join(" &times; ") + ")" : "") + "." :
          "A perfect-square divisor uses only even exponents: for each prime with exponent <i>e</i>, there are &lfloor;<i>e</i>/2&rfloor; + 1 choices.";
      q.explanation = "<p>" + num(n) + " = " + fstr(n) + ". " + ex + "</p><p>Count: <b>" + cnt + "</b>.</p>";
    }
    return q;
  });

  add("fraction-arithmetic", "arithmetic", "fraction", function (d, rng) {
    var q, res, a, b, c, e;
    function rf(lo, hi) { var den = ri(rng, lo, hi), nu = ri(rng, 1, den - 1); return R(nu, den); }
    if (d === 1) {
      do { a = rf(2, 9); b = rf(2, 12); } while (a[1] === 1 || b[1] === 1 || a[1] === b[1]);
      var plus = rng() < 0.6;
      if (!plus && rval(a) < rval(b)) { var t = a; a = b; b = t; }
      if (!plus && rval(a) === rval(b)) plus = true;
      res = plus ? radd(a, b) : rsub(a, b);
      q = base("fraction-arithmetic", "arithmetic", d, "fraction", { a: a, b: b, op: plus ? "+" : "-" });
      q.prompt = "What is the value of " + rh(a) + (plus ? " + " : " &minus; ") + rh(b) + "?";
      var L = lcm(a[1], b[1]);
      q.explanation = "<p>Use the common denominator " + L + ": " + fhtml(a[0] * L / a[1], L) + (plus ? " + " : " &minus; ") + fhtml(b[0] * L / b[1], L) + " = " + fhtml((plus ? a[0] * L / a[1] + b[0] * L / b[1] : a[0] * L / a[1] - b[0] * L / b[1]), L) + " = <b>" + rh(res) + "</b>.</p>";
    } else if (d === 2) {
      do { a = rf(2, 9); b = rf(2, 9); c = rf(2, 9); res = rdiv(rmul(a, b), c); } while (res[1] === 1 || res[0] > 60 || res[1] > 60);
      q = base("fraction-arithmetic", "arithmetic", d, "fraction", { a: a, b: b, c: c });
      q.prompt = "What is the value of " + rh(a) + " &times; " + rh(b) + " &divide; " + rh(c) + "?";
      q.explanation = "<p>Dividing by " + rh(c) + " is the same as multiplying by " + rh([c[1], c[0]]) + ": " + rh(a) + " &times; " + rh(b) + " &times; " + rh([c[1], c[0]]) + " = <b>" + rh(res) + "</b>.</p>";
    } else {
      var top, bot;
      do { a = rf(2, 8); b = rf(2, 8); c = rf(2, 8); e = rf(2, 8); top = radd(a, b); bot = rsub(c, e); }
      while (bot[0] <= 0 || (res = rdiv(top, bot))[1] === 1 || res[0] > 99 || res[1] > 99);
      q = base("fraction-arithmetic", "arithmetic", d, "fraction", { a: a, b: b, c: c, e: e });
      q.prompt = "What is the value of " + fhtml(rh(a) + " + " + rh(b), rh(c) + " &minus; " + rh(e)) + "?";
      q.explanation = "<p>Numerator: " + rh(a) + " + " + rh(b) + " = " + rh(top) + ". Denominator: " + rh(c) + " &minus; " + rh(e) + " = " + rh(bot) + ".</p><p>" + rh(top) + " &divide; " + rh(bot) + " = " + rh(top) + " &times; " + rh([bot[1], bot[0]]) + " = <b>" + rh(res) + "</b>.</p>";
    }
    q.answer = [res[0], res[1]];
    return q;
  });

  add("ratio-share", "arithmetic", "numeric", function (d, rng) {
    var q;
    if (d === 1) {
      var a, b; do { a = ri(rng, 1, 9); b = ri(rng, 1, 9); } while (a === b || gcd(a, b) !== 1);
      var k = ri(rng, 3, 15), T = (a + b) * k;
      q = base("ratio-share", "arithmetic", d, "numeric", { a: a, b: b, T: T });
      q.prompt = "A sum of " + money(T) + " is divided between Ana and Ben in the ratio " + a + " : " + b + ". How many dollars does Ben receive?";
      q.before = "$"; q.answer = b * k;
      q.explanation = "<p>There are " + a + " + " + b + " = " + (a + b) + " parts, each worth " + num(T) + " &divide; " + (a + b) + " = " + k + ". Ben gets " + b + " &times; " + k + " = <b>" + (b * k) + "</b>.</p>";
    } else if (d === 2) {
      var x, y, z; do { x = ri(rng, 1, 7); y = ri(rng, 1, 7); z = ri(rng, 1, 7); } while (x === y || y === z || x === z);
      var m = ri(rng, 2, 12), tot = (x + y + z) * m, which = ri(rng, 0, 2), names = ["red", "blue", "green"], parts = [x, y, z];
      q = base("ratio-share", "arithmetic", d, "numeric", { x: x, y: y, z: z, tot: tot, which: which });
      q.prompt = "A box contains only red, blue, and green marbles in the ratio " + x + " : " + y + " : " + z + ". If there are " + tot + " marbles in the box, how many are " + names[which] + "?";
      q.answer = parts[which] * m;
      q.explanation = "<p>Total parts: " + (x + y + z) + ". Each part is " + tot + " &divide; " + (x + y + z) + " = " + m + " marbles. " + names[which].charAt(0).toUpperCase() + names[which].slice(1) + ": " + parts[which] + " &times; " + m + " = <b>" + q.answer + "</b>.</p>";
    } else {
      var A, B, C, D, t, kk, tries = 0;
      do {
        A = ri(rng, 2, 9); B = ri(rng, 1, 9); C = ri(rng, 1, 9); D = ri(rng, 1, 9); t = ri(rng, 2, 12); tries++;
        kk = t * (D * A - C * B) / C;
      } while ((gcd(A, B) !== 1 || gcd(C, D) !== 1 || !(A * D > C * B) || !isInt(kk) || kk <= 0 || kk > 60 || A * t > 150) && tries < 5000);
      q = base("ratio-share", "arithmetic", d, "numeric", { A: A, B: B, C: C, D: D, k: kk });
      q.prompt = "In a club, the ratio of members who are adults to members who are children is " + A + " : " + B + ". After " + kk + " more children join and no one leaves, the ratio becomes " + C + " : " + D + ". How many adults are in the club?";
      q.answer = A * t;
      q.explanation = "<p>Let the counts be " + A + V("t") + " adults and " + B + V("t") + " children. Then " + fhtml(A + V("t"), B + V("t") + " + " + kk) + " = " + fhtml(C, D) + ", so " + (D * A) + V("t") + " = " + (C * B) + V("t") + " + " + (C * kk) + ".</p><p>" + (D * A - C * B) + V("t") + " = " + (C * kk) + " gives " + V("t") + " = " + t + ". The number of adults is " + A + " &times; " + t + " = <b>" + (A * t) + "</b>.</p>";
    }
    return q;
  });

  add("exponent-qc", "arithmetic", "qc", function (d, rng) {
    var q;
    if (d === 1) {
      var b = pick(rng, [2, 3]), n = ri(rng, 3, 12), kind = pick(rng, ["eq", "big", "plus"]);
      var Aval = b * Math.pow(b, n), Bval, Bh;
      if (kind === "eq") { Bval = Math.pow(b, n + 1); Bh = sup(b, n + 1); }
      else if (kind === "big") { Bval = Math.pow(b, b * n); Bh = sup(b, b * n); }
      else { Bval = Math.pow(b, n) + b; Bh = sup(b, n) + " + " + b; }
      q = base("exponent-qc", "arithmetic", d, "qc", { b: b, n: n, kind: kind });
      var terms = []; for (var i = 0; i < b; i++) terms.push(sup(b, n));
      q.quantityA = terms.join(" + "); q.quantityB = Bh;
      q.answer = [qcAnswer(Aval, Bval)];
      q.explanation = "<p>Quantity A = " + b + " &times; " + sup(b, n) + " = " + sup(b, n + 1) + ". " +
        (kind === "eq" ? "That is exactly Quantity B." : kind === "big" ? "Quantity B has exponent " + (b * n) + " &gt; " + (n + 1) + ". Adding equal powers does not multiply the exponent." : "Quantity B adds only " + b + ", but A adds another " + (b - 1) + " &times; " + sup(b, n) + ".") +
        "</p><p><b>" + QC_WORDS[q.answer[0]] + "</b>.</p>";
    } else if (d === 2) {
      var a, c, e, ea, eb;
      do { a = ri(rng, 1, 12); c = ri(rng, 1, 10); e = ri(rng, 2, 10); ea = a + 2 * c; eb = 3 * e; } while (Math.abs(ea - eb) > 2);
      q = base("exponent-qc", "arithmetic", d, "qc", { a: a, c: c, e: e });
      q.quantityA = sup(2, a) + " &times; " + sup(4, c); q.quantityB = sup(8, e);
      q.answer = [qcAnswer(ea, eb)];
      q.explanation = "<p>Write everything as a power of 2. A = " + sup(2, a) + " &times; " + sup(2, 2 * c) + " = " + sup(2, ea) + ". B = " + sup(2, 3 * e) + ".</p><p>Compare the exponents " + ea + " and " + eb + ": <b>" + QC_WORDS[q.answer[0]] + "</b>.</p>";
    } else {
      var T = [
        { info: V("n") + " is a positive integer.", A: function (n) { return Math.pow(2, n + 1); }, B: function (n) { return Math.pow(2, n) + 2; }, Ah: sup(2, V("n") + " + 1"), Bh: sup(2, V("n")) + " + 2", lo: 1, hi: 30,
          ex: "<p>A &minus; B = " + sup(2, V("n")) + " &minus; 2. When " + V("n") + " = 1 this is 0 (equal); when " + V("n") + " &ge; 2 it is positive (A is greater).</p>" },
        { info: V("n") + " is an integer greater than 1.", A: function (n) { return Math.pow(2, n + 1); }, B: function (n) { return Math.pow(2, n) + 2; }, Ah: sup(2, V("n") + " + 1"), Bh: sup(2, V("n")) + " + 2", lo: 2, hi: 30,
          ex: "<p>A &minus; B = " + sup(2, V("n")) + " &minus; 2, which is at least 2 when " + V("n") + " &ge; 2.</p>" },
        { info: V("n") + " is a positive integer.", A: function (n) { return Math.pow(3, n); }, B: function (n) { return Math.pow(n, 3); }, Ah: sup(3, V("n")), Bh: sup(V("n"), 3), lo: 1, hi: 25,
          ex: "<p>" + V("n") + " = 1: 3 vs 1 (A is greater). " + V("n") + " = 3: 27 vs 27 (equal).</p>" },
        { info: V("n") + " is an integer greater than 2.", A: function (n) { return Math.pow(2, n); }, B: function (n) { return n * n; }, Ah: sup(2, V("n")), Bh: sup(V("n"), 2), lo: 3, hi: 30,
          ex: "<p>" + V("n") + " = 3: 8 vs 9 (B is greater). " + V("n") + " = 4: 16 vs 16 (equal). " + V("n") + " = 5: 32 vs 25 (A is greater).</p>" },
        { info: V("k") + " is a positive integer.", A: function (n) { return Math.pow(10, n); }, B: function (n) { return Math.pow(9, n) + 1; }, Ah: sup(10, V("k")), Bh: sup(9, V("k")) + " + 1", lo: 1, hi: 15,
          ex: "<p>" + V("k") + " = 1: 10 vs 10 (equal). " + V("k") + " = 2: 100 vs 82 (A is greater).</p>" },
        { info: V("k") + " is an integer greater than 1.", A: function (n) { return Math.pow(10, n); }, B: function (n) { return Math.pow(9, n) + 1; }, Ah: sup(10, V("k")), Bh: sup(9, V("k")) + " + 1", lo: 2, hi: 15,
          ex: "<p>For " + V("k") + " &ge; 2, " + sup(10, V("k")) + " &minus; " + sup(9, V("k")) + " &ge; 100 &minus; 81 = 19 &gt; 1, so A is greater.</p>" }
      ];
      var ti = ri(rng, 0, T.length - 1), t = T[ti];
      var seen = {};
      for (var nn = t.lo; nn <= t.hi; nn++) seen[qcAnswer(t.A(nn), t.B(nn))] = 1;
      var keys = Object.keys(seen);
      q = base("exponent-qc", "arithmetic", d, "qc", { template: ti });
      q.info = t.info; q.quantityA = t.Ah; q.quantityB = t.Bh;
      q.answer = [keys.length === 1 ? +keys[0] : 3];
      q.explanation = t.ex + "<p><b>" + QC_WORDS[q.answer[0]] + "</b>.</p>";
    }
    return q;
  });

  add("gcd-lcm", "arithmetic", "mc-single", function (d, rng) {
    var q, mc, a, b, x, y, g, ans;
    if (d <= 2) {
      do { g = ri(rng, 2, 15); x = ri(rng, 2, 12); y = ri(rng, 2, 12); } while (x === y || gcd(x, y) !== 1);
      a = g * x; b = g * y;
      var L = lcm(a, b);
      if (d === 1) {
        ans = g;
        mc = mcNum(rng, ans, [L, x, y, g * 2, Math.min(a, b) - g], 1, null, function (v) { return v > 0; });
        q = base("gcd-lcm", "arithmetic", d, "mc-single", { a: a, b: b, kind: "gcd" });
        q.prompt = "What is the greatest common divisor of " + a + " and " + b + "?";
      } else {
        ans = L;
        mc = mcNum(rng, ans, [a * b, g, 2 * L, a + b, L / 2], g, null, function (v) { return v > 0 && isInt(v); });
        q = base("gcd-lcm", "arithmetic", d, "mc-single", { a: a, b: b, kind: "lcm" });
        q.prompt = "What is the least common multiple of " + a + " and " + b + "?";
      }
      q.explanation = "<p>" + a + " = " + g + " &times; " + x + " and " + b + " = " + g + " &times; " + y + ", where " + x + " and " + y + " share no common factor. GCD = " + g + ". LCM = " + g + " &times; " + x + " &times; " + y + " = " + L + ".</p><p>The answer is <b>" + ans + "</b>.</p>";
    } else {
      var P = [4, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30], c, l3;
      do { a = pick(rng, P); b = pick(rng, P); c = pick(rng, P); l3 = lcm(lcm(a, b), c); } while (a === b || b === c || a === c || l3 > 360 || l3 === a * b * c);
      var s = sorted([a, b, c]); a = s[0]; b = s[1]; c = s[2];
      mc = mcNum(rng, l3, [a * b * c, lcm(a, b), lcm(b, c), a + b + c, l3 * 2, l3 / 2], 6, null, function (v) { return v > 0 && isInt(v) && v !== l3; });
      q = base("gcd-lcm", "arithmetic", d, "mc-single", { a: a, b: b, c: c });
      q.prompt = "Three lights blink every " + a + ", " + b + ", and " + c + " seconds, respectively. If they all blink together at a certain moment, how many seconds later will they next all blink together?";
      var fs = function (n) { return factor(n).map(function (f) { return f[1] > 1 ? sup(f[0], f[1]) : f[0]; }).join(" &times; "); };
      q.explanation = "<p>We need the least common multiple. " + a + " = " + fs(a) + ", " + b + " = " + fs(b) + ", " + c + " = " + fs(c) + ". Take the highest power of each prime: LCM = <b>" + l3 + "</b>.</p>";
    }
    q.options = mc.options; q.answer = mc.answer;
    return q;
  });

  add("primes-multi", "arithmetic", "mc-multi", function (d, rng) {
    var lo = [0, 10, 40, 100][d], hi = [0, 60, 150, 250][d];
    var hard = [51, 57, 87, 91, 93, 111, 117, 119, 121, 133, 143, 161, 169, 187, 203, 209, 217, 221, 247, 129, 141, 153, 171, 177, 183, 201, 213, 219, 231, 237, 243, 249];
    var nOpts = ri(rng, 5, 7), set = {}, list = [], primes = 0, tries = 0;
    while (list.length < nOpts && tries++ < 5000) {
      var x;
      var r = rng();
      if (r < 0.45) { do { x = ri(rng, lo, hi); } while (!isPrime(x)); }
      else if (r < 0.8 && d > 1) { x = pick(rng, hard); if (x < lo || x > hi) continue; }
      else { do { x = ri(rng, lo, hi); } while (x % 2 === 0 || x % 5 === 0); }
      if (set[x]) continue;
      set[x] = 1; list.push(x);
    }
    list = sorted(list);
    primes = list.filter(isPrime).length;
    if (primes === 0 || primes === list.length) return G[byName["primes-multi"]].fn(d, rng);
    var q = base("primes-multi", "arithmetic", d, "mc-multi", { list: list });
    q.prompt = multiPrompt("Which of the following numbers are prime?", "numbers");
    q.options = list.map(num);
    q.answer = []; list.forEach(function (v, i) { if (isPrime(v)) q.answer.push(i); });
    q.explanation = "<ul>" + list.map(function (v) {
      if (isPrime(v)) return "<li>" + v + " is prime (no prime factor up to &radic;" + v + " &asymp; " + Math.floor(Math.sqrt(v)) + ").</li>";
      var f = factor(v)[0][0];
      return "<li>" + v + " = " + f + " &times; " + (v / f) + ", so it is not prime.</li>";
    }).join("") + "</ul>";
    return q;
  });

  /* ------------------------------- ALGEBRA ------------------------------- */
  add("linear-equation", "algebra", "mc-single", function (d, rng) {
    var q, mc, x;
    if (d === 1) {
      var a = ri(rng, 2, 9), b = ri(rng, -20, 20); x = ri(rng, -10, 12);
      if (b === 0) b = 7;
      var c = a * x + b;
      mc = mcNum(rng, x, [isInt((c + b) / a) ? (c + b) / a : null, -x, c - b, x + 1].filter(function (v) { return v !== null; }), 1);
      q = base("linear-equation", "algebra", d, "mc-single", { a: a, b: b, c: c });
      q.prompt = "If " + poly([[a, V("x")], [b, ""]]) + " = " + num(c) + ", what is the value of " + V("x") + "?";
      q.explanation = "<p>" + (b > 0 ? "Subtract " + b : "Add " + (-b)) + " on both sides: " + a + V("x") + " = " + num(c - b) + ". Divide by " + a + ": " + V("x") + " = <b>" + num(x) + "</b>.</p>";
    } else if (d === 2) {
      var A, B, p, qq;
      do { A = ri(rng, 2, 9); B = ri(rng, 1, 8); p = ri(rng, 1, 9); x = ri(rng, -9, 12); } while (A === B);
      qq = A * (x - p) - B * x;
      var wrong = (qq - A * p) / (A - B), wrong2 = (qq + A * p) / (A + B);
      mc = mcNum(rng, x, [isInt(wrong) ? wrong : null, isInt(wrong2) ? wrong2 : null, -x, x + 2, x - 1].filter(function (v) { return v !== null; }), 1);
      q = base("linear-equation", "algebra", d, "mc-single", { A: A, B: B, p: p, q: qq });
      q.prompt = "If " + A + "(" + V("x") + " &minus; " + p + ") = " + poly([[B, V("x")], [qq, ""]]) + ", what is the value of " + V("x") + "?";
      q.explanation = "<p>Distribute: " + A + V("x") + " &minus; " + (A * p) + " = " + poly([[B, V("x")], [qq, ""]]) + ". Collect terms: " + (A - B) + V("x") + " = " + num(qq + A * p) + ", so " + V("x") + " = <b>" + num(x) + "</b>.</p>";
    } else {
      var P = pick(rng, [2, 3, 4, 5, 6]), Q, L;
      do { Q = pick(rng, [2, 3, 4, 5, 6, 8]); } while (Q === P);
      L = lcm(P, Q); x = L * ri(rng, 1, 6);
      var r = x / P + x / Q;
      mc = mcNum(rng, x, [r * (P + Q), r * P * Q / 2, isInt(r * (P + Q) / 2) ? r * (P + Q) / 2 : null, x / 2, 2 * x].filter(function (v) { return v !== null; }), L, null, function (v) { return v > 0 && isInt(v); });
      q = base("linear-equation", "algebra", d, "mc-single", { P: P, Q: Q, r: r });
      q.prompt = "If " + fhtml(V("x"), P) + " + " + fhtml(V("x"), Q) + " = " + r + ", what is the value of " + V("x") + "?";
      q.explanation = "<p>Multiply both sides by " + L + ": " + (L / P) + V("x") + " + " + (L / Q) + V("x") + " = " + (r * L) + ", so " + (L / P + L / Q) + V("x") + " = " + (r * L) + " and " + V("x") + " = <b>" + num(x) + "</b>.</p>";
    }
    q.options = mc.options; q.answer = mc.answer;
    return q;
  });

  add("quadratic-roots", "algebra", "mc-multi", function (d, rng) {
    var q, r1, r2, a = 1, roots, B, C, A2;
    if (d < 3) {
      do { r1 = ri(rng, -9, 9); r2 = ri(rng, -9, 9); } while (r1 === r2 || r1 === 0 || r2 === 0 || r1 === -r2);
      A2 = 1; B = -(r1 + r2); C = r1 * r2; roots = [R(r1, 1), R(r2, 1)];
    } else {
      var p, qr;
      do { a = ri(rng, 2, 5); p = ri(rng, -9, 9); qr = ri(rng, -7, 7); } while (p === 0 || qr === 0 || p % a === 0 || gcd(p, a) !== 1);
      /* (a x - p)(x - qr) = a x^2 - (a qr + p) x + p qr */
      A2 = a; B = -(a * qr + p); C = p * qr; roots = [R(p, a), R(qr, 1)];
    }
    var pool = [];
    roots.forEach(function (r) { pool.push(R(-r[0], r[1])); pool.push(R(r[1], r[0] || 1)); pool.push(R(r[0] + 1, r[1])); });
    pool.push(R(-B, 1)); pool.push(R(C, 1)); pool.push(R(B, 1));
    pool = shuffle(rng, pool);
    var opts = roots.slice(), keys = {};
    opts.forEach(function (r) { keys[r[0] + "/" + r[1]] = 1; });
    var want = ri(rng, 5, 6);
    for (var i = 0; i < pool.length && opts.length < want; i++) {
      var k = pool[i][0] + "/" + pool[i][1];
      if (!keys[k] && pool[i][1] !== 0) { keys[k] = 1; opts.push(pool[i]); }
    }
    opts.sort(function (x, y) { return rval(x) - rval(y); });
    function f(r) { /* exact evaluation A2 r^2 + B r + C as rational */ return radd(radd(rmul(R(A2, 1), rmul(r, r)), rmul(R(B, 1), r)), R(C, 1)); }
    q = base("quadratic-roots", "algebra", d, "mc-multi", { A: A2, B: B, C: C });
    q.prompt = multiPrompt("Which of the following are solutions of the equation " + poly([[A2, sup(V("x"), 2)], [B, V("x")], [C, ""]]) + " = 0?", "values");
    q.options = opts.map(rh);
    q.answer = []; opts.forEach(function (r, i) { if (f(r)[0] === 0) q.answer.push(i); });
    q.explanation = "<p>Factor: " + (A2 === 1 ? "(" + poly([[1, V("x")], [-r1, ""]]) + ")(" + poly([[1, V("x")], [-r2, ""]]) + ")" : "(" + poly([[A2, V("x")], [-roots[0][0] * A2 / roots[0][1], ""]]) + ")(" + poly([[1, V("x")], [-roots[1][0], ""]]) + ")") + " = 0.</p><p>The solutions are <b>" + roots.map(rh).join(" and ") + "</b>. The signs flip relative to the numbers in the factors, which is the trap in the negated options.</p>";
    return q;
  });

  add("linear-system", "algebra", "numeric", function (d, rng) {
    var q, x, y;
    if (d === 1) {
      do { x = ri(rng, -5, 15); y = ri(rng, -5, 15); } while (x === y);
      var ask = rng() < 0.5 ? "x" : "y";
      q = base("linear-system", "algebra", d, "numeric", { s: x + y, df: x - y, ask: ask });
      q.prompt = "If " + V("x") + " + " + V("y") + " = " + num(x + y) + " and " + V("x") + " &minus; " + V("y") + " = " + num(x - y) + ", what is the value of " + V(ask) + "?";
      q.answer = ask === "x" ? x : y;
      q.explanation = "<p>Adding the equations: 2" + V("x") + " = " + num(2 * x) + ", so " + V("x") + " = " + num(x) + ". Then " + V("y") + " = " + num(x + y) + " &minus; " + num(x) + " = " + num(y) + ".</p><p>Answer: <b>" + num(q.answer) + "</b>.</p>";
    } else if (d === 2) {
      var a1, b1, a2, b2;
      do { a1 = ri(rng, 1, 6); b1 = ri(rng, -6, 6); a2 = ri(rng, 1, 6); b2 = ri(rng, -6, 6); x = ri(rng, -8, 8); y = ri(rng, -8, 8); } while (b1 === 0 || b2 === 0 || a1 * b2 - a2 * b1 === 0);
      var c1 = a1 * x + b1 * y, c2 = a2 * x + b2 * y;
      q = base("linear-system", "algebra", d, "numeric", { a1: a1, b1: b1, c1: c1, a2: a2, b2: b2, c2: c2 });
      q.prompt = "If " + poly([[a1, V("x")], [b1, V("y")]]) + " = " + num(c1) + " and " + poly([[a2, V("x")], [b2, V("y")]]) + " = " + num(c2) + ", what is the value of " + V("x") + "?";
      q.answer = x;
      q.explanation = "<p>Eliminate " + V("y") + ": multiply the first equation by " + num(b2) + " and the second by " + num(b1) + ", then subtract. This gives (" + num(a1 * b2 - a2 * b1) + ")" + V("x") + " = " + num(c1 * b2 - c2 * b1) + ", so " + V("x") + " = <b>" + num(x) + "</b> (and " + V("y") + " = " + num(y) + ").</p>";
    } else {
      var a, b;
      do { a = ri(rng, 2, 9); b = ri(rng, 1, 8); x = ri(rng, -6, 12); y = ri(rng, -6, 12); } while (a === b);
      var e1 = a * x + b * y, e2 = b * x + a * y, wantSum = rng() < 0.5;
      q = base("linear-system", "algebra", d, "numeric", { a: a, b: b, e1: e1, e2: e2, ask: wantSum ? "sum" : "diff" });
      q.prompt = "If " + poly([[a, V("x")], [b, V("y")]]) + " = " + num(e1) + " and " + poly([[b, V("x")], [a, V("y")]]) + " = " + num(e2) + ", what is the value of " + (wantSum ? V("x") + " + " + V("y") : V("x") + " &minus; " + V("y")) + "?";
      q.answer = wantSum ? x + y : x - y;
      q.explanation = "<p>" + (wantSum ? "Add" : "Subtract") + " the equations: " + (wantSum ? (a + b) + "(" + V("x") + " + " + V("y") + ") = " + num(e1 + e2) : (a - b) + "(" + V("x") + " &minus; " + V("y") + ") = " + num(e1 - e2)) + ".</p><p>So the value is <b>" + num(q.answer) + "</b>. There is no need to solve for each variable.</p>";
    }
    return q;
  });

  add("function-eval", "algebra", "numeric", function (d, rng) {
    var q, a = ri(rng, 1, 4) * (rng() < 0.2 ? -1 : 1), b = ri(rng, -9, 9), c = ri(rng, -10, 10);
    function f(x) { return a * x * x + b * x + c; }
    var fh = poly([[a, sup(V("x"), 2)], [b, V("x")], [c, ""]]);
    if (d === 1) {
      var k = ri(rng, -5, 5);
      q = base("function-eval", "algebra", d, "numeric", { a: a, b: b, c: c, k: k });
      q.prompt = "If " + V("f") + "(" + V("x") + ") = " + fh + ", what is the value of " + V("f") + "(" + num(k) + ")?";
      q.answer = f(k);
      q.explanation = "<p>" + V("f") + "(" + num(k) + ") = " + num(a) + "(" + num(k) + ")<sup>2</sup> + (" + num(b) + ")(" + num(k) + ") + (" + num(c) + ") = " + num(a * k * k) + " + (" + num(b * k) + ") + (" + num(c) + ") = <b>" + num(f(k)) + "</b>.</p>";
    } else if (d === 2) {
      var m = ri(rng, -4, 4) || 2, n = ri(rng, -6, 6), k2 = ri(rng, -4, 4), g = m * k2 + n;
      q = base("function-eval", "algebra", d, "numeric", { a: a, b: b, c: c, m: m, n: n, k: k2 });
      q.prompt = "If " + V("f") + "(" + V("x") + ") = " + fh + " and " + V("g") + "(" + V("x") + ") = " + poly([[m, V("x")], [n, ""]]) + ", what is the value of " + V("f") + "(" + V("g") + "(" + num(k2) + "))?";
      q.answer = f(g);
      q.explanation = "<p>Work from the inside out: " + V("g") + "(" + num(k2) + ") = " + num(g) + ". Then " + V("f") + "(" + num(g) + ") = " + num(a * g * g) + " + (" + num(b * g) + ") + (" + num(c) + ") = <b>" + num(f(g)) + "</b>.</p>";
    } else {
      var B = ri(rng, -8, 8), C = ri(rng, -10, 10);
      var F = function (x) { return x * x + B * x + C; };
      var tgt = pick(rng, [3, -1, 4]);
      q = base("function-eval", "algebra", d, "numeric", { B: B, C: C, f1: F(1), f2: F(2), t: tgt });
      q.prompt = "The function " + V("f") + " is defined by " + V("f") + "(" + V("x") + ") = " + sup(V("x"), 2) + " + " + V("bx") + " + " + V("c") + ", where " + V("b") + " and " + V("c") + " are constants. If " + V("f") + "(1) = " + num(F(1)) + " and " + V("f") + "(2) = " + num(F(2)) + ", what is the value of " + V("f") + "(" + num(tgt) + ")?";
      q.answer = F(tgt);
      q.explanation = "<p>" + V("f") + "(1) = 1 + " + V("b") + " + " + V("c") + " = " + num(F(1)) + " and " + V("f") + "(2) = 4 + 2" + V("b") + " + " + V("c") + " = " + num(F(2)) + ". Subtracting gives 3 + " + V("b") + " = " + num(F(2) - F(1)) + ", so " + V("b") + " = " + num(B) + " and " + V("c") + " = " + num(C) + ".</p><p>" + V("f") + "(" + num(tgt) + ") = " + num(tgt * tgt) + " + (" + num(B * tgt) + ") + (" + num(C) + ") = <b>" + num(F(tgt)) + "</b>.</p>";
    }
    return q;
  });

  add("slope", "algebra", "fraction", function (d, rng) {
    var q, ans;
    if (d === 1) {
      var x1 = ri(rng, -6, 6), y1 = ri(rng, -6, 6), dx, dy;
      do { dx = ri(rng, 2, 9); dy = ri(rng, 1, 11); } while (dy % dx === 0);
      ans = R(dy, dx);
      q = base("slope", "algebra", d, "fraction", { x1: x1, y1: y1, x2: x1 + dx, y2: y1 + dy });
      q.prompt = "What is the slope of the line that passes through the points (" + num(x1) + ", " + num(y1) + ") and (" + num(x1 + dx) + ", " + num(y1 + dy) + ")?";
      q.explanation = "<p>Slope = " + fhtml(num(y1 + dy) + " &minus; " + (y1 < 0 ? "(" + num(y1) + ")" : num(y1)), num(x1 + dx) + " &minus; " + (x1 < 0 ? "(" + num(x1) + ")" : num(x1))) + " = " + fhtml(dy, dx) + " = <b>" + rh(ans) + "</b>.</p>";
    } else if (d === 2) {
      var a, b, c;
      do { a = ri(rng, 1, 9); b = ri(rng, 2, 9); } while (b % a === 0 || a % b === 0);
      c = ri(rng, -12, 12);
      ans = R(b, a);
      q = base("slope", "algebra", d, "fraction", { a: a, b: b, c: c });
      q.prompt = "Line " + V("k") + " is perpendicular to the line " + poly([[a, V("x")], [b, V("y")]]) + " = " + num(c) + ". What is the slope of line " + V("k") + "?";
      q.explanation = "<p>Solve for " + V("y") + ": " + V("y") + " = &minus;" + fhtml(a, b) + V("x") + " + &hellip;, so that line has slope &minus;" + rh(R(a, b)) + ". A perpendicular slope is the negative reciprocal: <b>" + rh(ans) + "</b>.</p>";
    } else {
      var X1, Y1, X2, Y2, m, bI;
      do {
        X1 = ri(rng, -6, 6); X2 = ri(rng, -6, 6); Y1 = ri(rng, -8, 8); Y2 = ri(rng, -8, 8);
        if (X1 === X2) continue;
        m = R(Y2 - Y1, X2 - X1);
        bI = rsub(R(Y1, 1), rmul(m, R(X1, 1)));
      } while (X1 === X2 || !(bI && bI[0] > 0 && bI[1] > 1 && X1 !== 0 && X2 !== 0));
      ans = bI;
      q = base("slope", "algebra", d, "fraction", { x1: X1, y1: Y1, x2: X2, y2: Y2 });
      q.prompt = "A line passes through the points (" + num(X1) + ", " + num(Y1) + ") and (" + num(X2) + ", " + num(Y2) + "). What is the " + V("y") + "-intercept of the line?";
      q.explanation = "<p>Slope " + V("m") + " = " + fhtml(num(Y2 - Y1), num(X2 - X1)) + " = " + rh(m) + ". Then " + V("b") + " = " + V("y") + "<sub>1</sub> &minus; " + V("m") + V("x") + "<sub>1</sub> = " + num(Y1) + " &minus; (" + rh(m) + ")(" + num(X1) + ") = <b>" + rh(ans) + "</b>.</p>";
    }
    q.answer = [ans[0], ans[1]];
    return q;
  });

  add("absolute-value-count", "algebra", "numeric", function (d, rng) {
    var q, a = d === 1 ? 1 : ri(rng, 2, 3), b = ri(rng, -9, 9), c = ri(rng, 3, 12), strict = d > 1 && rng() < 0.5, lo = 0, cnt = 0, x;
    if (d === 3) lo = ri(rng, 1, c - 2);
    for (x = -300; x <= 300; x++) {
      var v = Math.abs(a * x - b);
      if ((strict ? v < c : v <= c) && (d < 3 || v > lo)) cnt++;
    }
    q = base("absolute-value-count", "algebra", d, "numeric", { a: a, b: b, c: c, strict: strict, lo: lo });
    var expr = "|" + poly([[a, V("x")], [-b, ""]]) + "|";
    q.prompt = "How many integers " + V("x") + " satisfy " + (d === 3 ? lo + " &lt; " + expr + (strict ? " &lt; " : " &le; ") + c : expr + (strict ? " &lt; " : " &le; ") + c) + "?";
    q.answer = cnt;
    var L = (b - c) / a, H = (b + c) / a;
    q.explanation = "<p>" + expr + (strict ? " &lt; " : " &le; ") + c + " means " + num(b - c) + (strict ? " &lt; " : " &le; ") + poly([[a, V("x")]]) + (strict ? " &lt; " : " &le; ") + num(b + c) + ", so " + num(round(L, 3)) + (strict ? " &lt; " : " &le; ") + V("x") + (strict ? " &lt; " : " &le; ") + num(round(H, 3)) + "." +
      (d === 3 ? " We must also exclude the integers where " + expr + " &le; " + lo + ", that is, " + num(round((b - lo) / a, 3)) + " &le; " + V("x") + " &le; " + num(round((b + lo) / a, 3)) + "." : "") +
      "</p><p>Counting the integers carefully, endpoints included where allowed, gives <b>" + cnt + "</b>.</p>";
    return q;
  });

  /* QC templates: answer stated analytically; sample() is used by tests to confirm. */
  var ALG_QC = [
    { d: 1, info: V("x") + " &gt; 1", A: sup(V("x"), 2), B: V("x"), ans: 0, f: function (v) { return [v.x * v.x, v.x]; }, sample: function (r) { return { x: 1 + 0.001 + r() * 20 }; },
      ex: "For " + V("x") + " &gt; 1, multiplying " + V("x") + " &gt; 1 by the positive " + V("x") + " gives " + sup(V("x"), 2) + " &gt; " + V("x") + "." },
    { d: 1, info: "0 &lt; " + V("x") + " &lt; 1", A: sup(V("x"), 2), B: V("x"), ans: 1, f: function (v) { return [v.x * v.x, v.x]; }, sample: function (r) { return { x: 0.001 + r() * 0.998 }; },
      ex: "Squaring a number between 0 and 1 makes it smaller (e.g., 0.5<sup>2</sup> = 0.25)." },
    { d: 1, info: V("x") + " &lt; 0", A: sup(V("x"), 3), B: sup(V("x"), 2), ans: 1, f: function (v) { return [Math.pow(v.x, 3), v.x * v.x]; }, sample: function (r) { return { x: -0.001 - r() * 20 }; },
      ex: "For negative " + V("x") + ", " + sup(V("x"), 3) + " is negative while " + sup(V("x"), 2) + " is positive." },
    { d: 2, info: V("x") + " is an integer.", A: sup(V("x"), 2), B: V("x"), ans: 3, f: function (v) { return [v.x * v.x, v.x]; }, sample: function (r) { return { x: Math.floor(r() * 9) - 3 }; },
      ex: "If " + V("x") + " = 0 or 1, the quantities are equal. If " + V("x") + " = 2, A is greater." },
    { d: 2, info: "&minus;1 &lt; " + V("x") + " &lt; 0", A: fhtml(1, V("x")), B: V("x"), ans: 1, f: function (v) { return [1 / v.x, v.x]; }, sample: function (r) { return { x: -0.001 - r() * 0.998 }; },
      ex: "For &minus;1 &lt; " + V("x") + " &lt; 0, " + fhtml(1, V("x")) + " &lt; &minus;1 &lt; " + V("x") + " (e.g., " + V("x") + " = &minus;0.5 gives &minus;2)." },
    { d: 2, info: V("x") + " &gt; 0", c: true, A: "(" + V("x") + " + C)<sup>2</sup>", B: sup(V("x"), 2) + " + C2", ans: 0, f: function (v) { return [(v.x + v.c) * (v.x + v.c), v.x * v.x + v.c * v.c]; }, sample: function (r, c) { return { x: 0.001 + r() * 20, c: c }; },
      ex: "Expanding, A = " + sup(V("x"), 2) + " + 2C" + V("x") + " + C2, which exceeds B by 2C" + V("x") + " &gt; 0." },
    { d: 2, info: "", c: true, A: "(" + V("x") + " + C)<sup>2</sup>", B: sup(V("x"), 2) + " + C2", ans: 3, f: function (v) { return [(v.x + v.c) * (v.x + v.c), v.x * v.x + v.c * v.c]; }, sample: function (r, c) { return { x: Math.round((r() * 20 - 10) * 2) / 2, c: c }; },
      ex: "A &minus; B = 2C" + V("x") + ", which is positive, zero, or negative depending on the sign of " + V("x") + "." },
    { d: 2, info: V("a") + " &lt; " + V("b") + " &lt; 0", A: sup(V("a"), 2), B: sup(V("b"), 2), ans: 0, f: function (v) { return [v.a * v.a, v.b * v.b]; }, sample: function (r) { var b = -0.01 - r() * 10; return { b: b, a: b - 0.01 - r() * 10 }; },
      ex: V("a") + " is farther from 0 than " + V("b") + " (|" + V("a") + "| &gt; |" + V("b") + "|), so its square is larger." },
    { d: 3, info: V("x") + " + " + V("y") + " = K, " + V("x") + " &gt; 0, and " + V("y") + " &gt; 0", k: true, A: V("xy"), B: "H", ans: 3, f: function (v) { return [v.x * (v.k - v.x), (v.k / 2) * (v.k / 2)]; }, sample: function (r, c, k) { return { k: k, x: r() < 0.3 ? k / 2 : 0.01 + r() * (k - 0.02) }; },
      ex: "The product " + V("xy") + " is largest, equal to (K/2)<sup>2</sup> = H, when " + V("x") + " = " + V("y") + " = K/2. Otherwise it is smaller. So it can be equal to or less than B." },
    { d: 3, info: V("x") + " &ne; 0", A: fhtml(V("x"), "|" + V("x") + "|"), B: "0", ans: 3, f: function (v) { return [v.x / Math.abs(v.x), 0]; }, sample: function (r) { return { x: (r() < 0.5 ? -1 : 1) * (0.01 + r() * 10) }; },
      ex: "A equals 1 when " + V("x") + " &gt; 0 and &minus;1 when " + V("x") + " &lt; 0." },
    { d: 3, info: V("x") + " &lt; " + V("y") + " &lt; 0", A: fhtml(V("x"), V("y")), B: "1", ans: 0, f: function (v) { return [v.x / v.y, 1]; }, sample: function (r) { var y = -0.01 - r() * 10; return { y: y, x: y - 0.01 - r() * 10 }; },
      ex: "Both are negative, so " + fhtml(V("x"), V("y")) + " is positive, and |" + V("x") + "| &gt; |" + V("y") + "| makes it greater than 1. (e.g., &minus;6/&minus;3 = 2)" },
    { d: 3, info: "0 &lt; " + V("x") + " &lt; " + V("y"), c: true, A: fhtml(V("x"), V("y")), B: fhtml(V("x") + " + C", V("y") + " + C"), ans: 1, f: function (v) { return [v.x / v.y, (v.x + v.c) / (v.y + v.c)]; }, sample: function (r, c) { var x = 0.01 + r() * 10; return { x: x, y: x + 0.01 + r() * 10, c: c }; },
      ex: "B &minus; A = " + fhtml("C(" + V("y") + " &minus; " + V("x") + ")", V("y") + "(" + V("y") + " + C)") + " &gt; 0. Adding the same positive amount to the numerator and denominator of a fraction less than 1 moves it closer to 1." },
    { d: 3, info: V("x") + " &gt; 0", c: true, A: "&radic;(" + sup(V("x"), 2) + " + C2)", B: V("x") + " + C", ans: 1, f: function (v) { return [Math.sqrt(v.x * v.x + v.c * v.c), v.x + v.c]; }, sample: function (r, c) { return { x: 0.01 + r() * 20, c: c }; },
      ex: "Square both (both positive): A<sup>2</sup> = " + sup(V("x"), 2) + " + C2, while B<sup>2</sup> = " + sup(V("x"), 2) + " + 2C" + V("x") + " + C2, which is larger." },
    { d: 2, info: sup(V("x"), 2) + " = C2", c: true, A: V("x"), B: "C", ans: 3, f: function (v) { return [v.x, v.c]; }, sample: function (r, c) { return { x: r() < 0.5 ? c : -c, c: c }; },
      ex: V("x") + " could be C (equal) or &minus;C (B is greater)." }
  ];
  add("algebra-qc", "algebra", "qc", function (d, rng) {
    var cand = [], i;
    for (i = 0; i < ALG_QC.length; i++) if (ALG_QC[i].d === d) cand.push(i);
    var ti = pick(rng, cand), t = ALG_QC[ti];
    var c = ri(rng, 2, 9), k = 2 * ri(rng, 2, 10);
    function sub(s) { return s.replace(/C2/g, String(c * c)).replace(/C/g, String(c)).replace(/K\/2/g, String(k / 2)).replace(/K/g, String(k)).replace(/H/g, String(k * k / 4)); }
    var q = base("algebra-qc", "algebra", d, "qc", { template: ti, c: c, k: k });
    if (t.info) q.info = sub(t.info);
    q.quantityA = sub(t.A); q.quantityB = sub(t.B);
    q.answer = [t.ans];
    q.explanation = "<p>" + sub(t.ex) + "</p><p><b>" + QC_WORDS[t.ans] + "</b>.</p>";
    return q;
  });

  add("arithmetic-sequence", "algebra", "mc-single", function (d, rng) {
    var q, mc, a = ri(rng, -10, 20), dd = ri(rng, -6, 9) || 3, n, ans;
    function term(k) { return a + (k - 1) * dd; }
    if (d === 1) {
      n = ri(rng, 8, 40); ans = term(n);
      mc = mcNum(rng, ans, [a + n * dd, a + (n - 2) * dd, n * dd, a * n], Math.abs(dd));
      q = base("arithmetic-sequence", "algebra", d, "mc-single", { a: a, d: dd, n: n });
      q.prompt = "The first term of an arithmetic sequence is " + num(a) + ", and each term after the first is " + (dd > 0 ? num(dd) + " more" : num(-dd) + " less") + " than the previous term. What is the " + n + "th term?";
      q.explanation = "<p>" + V("a") + "<sub>" + V("n") + "</sub> = " + V("a") + "<sub>1</sub> + (" + V("n") + " &minus; 1)" + V("d") + " = " + num(a) + " + (" + (n - 1) + ")(" + num(dd) + ") = <b>" + num(ans) + "</b>. Using " + V("n") + " instead of " + V("n") + " &minus; 1 is the classic off-by-one error.</p>";
    } else if (d === 2) {
      var p = ri(rng, 2, 8), r = p + ri(rng, 2, 8); n = r + ri(rng, 3, 15); ans = term(n);
      mc = mcNum(rng, ans, [ans + dd, ans - dd, term(n) + (term(r) - term(p)), a + n * dd], Math.abs(dd));
      q = base("arithmetic-sequence", "algebra", d, "mc-single", { p: p, ap: term(p), r: r, ar: term(r), n: n });
      q.prompt = "In an arithmetic sequence, the " + p + "th term is " + num(term(p)) + " and the " + r + "th term is " + num(term(r)) + ". What is the " + n + "th term?";
      q.explanation = "<p>(" + r + " &minus; " + p + ")" + V("d") + " = " + num(term(r)) + " &minus; " + num(term(p)) + ", so " + V("d") + " = " + num(dd) + ". Then the " + n + "th term = " + num(term(r)) + " + (" + (n - r) + ")(" + num(dd) + ") = <b>" + num(ans) + "</b>.</p>";
    } else {
      n = ri(rng, 10, 40); var last = term(n); ans = n * (a + last) / 2;
      mc = mcNum(rng, ans, [n * last, (n - 1) * (a + last) / 2, n * (a + last), ans + last, ans - a], Math.max(1, Math.abs(dd)), null, function (v) { return isInt(v); });
      q = base("arithmetic-sequence", "algebra", d, "mc-single", { a: a, d: dd, n: n });
      q.prompt = "What is the sum of the first " + n + " terms of the arithmetic sequence " + num(a) + ", " + num(term(2)) + ", " + num(term(3)) + ", &hellip;?";
      q.explanation = "<p>The " + n + "th term is " + num(a) + " + (" + (n - 1) + ")(" + num(dd) + ") = " + num(last) + ". Sum = " + fhtml(V("n") + "(first + last)", 2) + " = " + fhtml(n + "(" + num(a) + " + " + num(last) + ")", 2) + " = <b>" + num(ans) + "</b>.</p>";
    }
    q.options = mc.options; q.answer = mc.answer;
    return q;
  });

  add("rate-work", "algebra", "numeric", function (d, rng) {
    var q;
    if (d === 1) {
      var r = ri(rng, 3, 15) * 5, t = ri(rng, 2, 6), t2 = ri(rng, 2, 9);
      if (t2 === t) t2 = t + 1;
      q = base("rate-work", "algebra", d, "numeric", { r: r, t: t, t2: t2 });
      q.prompt = "A car travels " + num(r * t) + " miles in " + t + " hours. At the same constant rate, how many miles will it travel in " + t2 + " hours?";
      q.answer = r * t2; q.after = "miles";
      q.explanation = "<p>Rate = " + num(r * t) + " &divide; " + t + " = " + r + " miles per hour. Distance = " + r + " &times; " + t2 + " = <b>" + num(r * t2) + "</b> miles.</p>";
    } else if (d === 2) {
      var r1 = ri(rng, 4, 14) * 5, r2 = ri(rng, 4, 14) * 5, T = pick(rng, [1.5, 2, 2.5, 3, 4, 0.5 * ri(rng, 3, 9)]);
      var D = (r1 + r2) * T;
      if (!isInt(D)) { T = 2; D = (r1 + r2) * 2; }
      q = base("rate-work", "algebra", d, "numeric", { r1: r1, r2: r2, D: D });
      q.prompt = "Two trains start at the same time from stations " + num(D) + " miles apart and travel toward each other on parallel tracks at constant speeds of " + r1 + " and " + r2 + " miles per hour. How many hours after they start will they meet?";
      q.answer = T; q.after = "hours";
      q.explanation = "<p>The distance between them shrinks at " + r1 + " + " + r2 + " = " + (r1 + r2) + " mph. Time = " + num(D) + " &divide; " + (r1 + r2) + " = <b>" + num(T) + "</b> hours.</p>";
    } else {
      var pairs = [[3, 6, 2], [4, 12, 3], [6, 12, 4], [10, 15, 6], [12, 24, 8], [20, 30, 12], [5, 20, 4], [6, 30, 5], [8, 24, 6], [9, 18, 6], [15, 30, 10], [12, 36, 9], [18, 36, 12], [10, 40, 8], [2, 3, 1.2], [4, 6, 2.4], [6, 10, 3.75], [3, 5, 1.875], [5, 10, 10 / 3]];
      var pr = pick(rng, pairs.filter(function (p) { return isInt(p[2] * 1000); }));
      var reverse = rng() < 0.5;
      q = base("rate-work", "algebra", d, "numeric", { a: pr[0], b: pr[1], reverse: reverse });
      if (!reverse) {
        q.prompt = "Machine A can complete a job in " + pr[0] + " hours, and Machine B can complete the same job in " + pr[1] + " hours. Working together at these rates, how many hours will the two machines take to complete the job?";
        q.answer = pr[2];
        q.explanation = "<p>Combined rate = " + fhtml(1, pr[0]) + " + " + fhtml(1, pr[1]) + " = " + rh(radd(R(1, pr[0]), R(1, pr[1]))) + " job per hour. Time = " + fhtml(pr[0] + " &times; " + pr[1], pr[0] + " + " + pr[1]) + " = <b>" + num(pr[2]) + "</b> hours. (Averaging the times gives " + num((pr[0] + pr[1]) / 2) + ", which is wrong.)</p>";
      } else {
        q.prompt = "Working together, Machines A and B complete a job in " + num(pr[2]) + " hours. Machine A alone completes the job in " + pr[0] + " hours. How many hours would Machine B alone take?";
        q.answer = pr[1];
        q.explanation = "<p>B's rate = " + rh(R(1000, Math.round(pr[2] * 1000))) + " &minus; " + fhtml(1, pr[0]) + " = " + rh(R(1, pr[1])) + " job per hour, so B alone takes <b>" + pr[1] + "</b> hours.</p>";
      }
      q.after = "hours";
    }
    return q;
  });

  add("coordinate", "algebra", "numeric", function (d, rng) {
    var q, trip = pick(rng, [[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [7, 24, 25], [9, 12, 15]]);
    if (d <= 2) {
      var x1 = ri(rng, -8, 8), y1 = ri(rng, -8, 8), sx = rng() < 0.5 ? -1 : 1, sy = rng() < 0.5 ? -1 : 1, sw = rng() < 0.5;
      var dx = sx * (sw ? trip[0] : trip[1]), dy = sy * (sw ? trip[1] : trip[0]);
      var x2 = x1 + dx, y2 = y1 + dy;
      if (d === 1) {
        q = base("coordinate", "algebra", d, "numeric", { x1: x1, y1: y1, x2: x2, y2: y2, kind: "dist" });
        q.prompt = "What is the distance between the points (" + num(x1) + ", " + num(y1) + ") and (" + num(x2) + ", " + num(y2) + ") in the " + V("xy") + "-plane?";
        q.answer = trip[2];
        q.explanation = "<p>&radic;((" + num(dx) + ")<sup>2</sup> + (" + num(dy) + ")<sup>2</sup>) = &radic;(" + (dx * dx + dy * dy) + ") = <b>" + trip[2] + "</b>.</p>";
      } else {
        q = base("coordinate", "algebra", d, "numeric", { x1: x1, y1: y1, x2: x2, y2: y2, kind: "circle" });
        q.prompt = "In the " + V("xy") + "-plane, a circle has its center at (" + num(x1) + ", " + num(y1) + ") and passes through the point (" + num(x2) + ", " + num(y2) + "). What is the diameter of the circle?";
        q.answer = 2 * trip[2];
        q.explanation = "<p>The radius is the distance from the center to the point: &radic;(" + (dx * dx) + " + " + (dy * dy) + ") = " + trip[2] + ". Diameter = <b>" + (2 * trip[2]) + "</b>.</p>";
      }
    } else {
      var P = [], area2;
      do { P = [[ri(rng, -6, 6), ri(rng, -6, 6)], [ri(rng, -6, 6), ri(rng, -6, 6)], [ri(rng, -6, 6), ri(rng, -6, 6)]]; area2 = Math.abs(P[0][0] * (P[1][1] - P[2][1]) + P[1][0] * (P[2][1] - P[0][1]) + P[2][0] * (P[0][1] - P[1][1])); } while (area2 < 6);
      var pts = function (p) { return "(" + num(p[0]) + ", " + num(p[1]) + ")"; };
      var minx = Math.min(P[0][0], P[1][0], P[2][0]), maxx = Math.max(P[0][0], P[1][0], P[2][0]), miny = Math.min(P[0][1], P[1][1], P[2][1]), maxy = Math.max(P[0][1], P[1][1], P[2][1]);
      q = base("coordinate", "algebra", d, "numeric", { P: P, kind: "area" });
      q.prompt = "What is the area of the triangle with vertices " + pts(P[0]) + ", " + pts(P[1]) + ", and " + pts(P[2]) + " in the " + V("xy") + "-plane?";
      q.answer = area2 / 2;
      q.explanation = "<p>Enclose the triangle in a " + (maxx - minx) + "-by-" + (maxy - miny) + " rectangle and subtract the right triangles around it. Alternatively, use the shoelace formula: area = " + fhtml(1, 2) + "|" + V("x") + "<sub>1</sub>(" + V("y") + "<sub>2</sub> &minus; " + V("y") + "<sub>3</sub>) + " + V("x") + "<sub>2</sub>(" + V("y") + "<sub>3</sub> &minus; " + V("y") + "<sub>1</sub>) + " + V("x") + "<sub>3</sub>(" + V("y") + "<sub>1</sub> &minus; " + V("y") + "<sub>2</sub>)| = " + fhtml(1, 2) + "(" + area2 + ") = <b>" + num(area2 / 2) + "</b>.</p>";
    }
    return q;
  });

  /* ------------------------------- GEOMETRY ------------------------------- */
  add("pythagorean", "geometry", "numeric", function (d, rng) {
    var q, T = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]];
    if (d < 3) {
      var t = pick(rng, T), k = pick(rng, d === 1 ? [1, 2, 3] : [1, 2, 3, 4, 0.5]);
      var a = t[0] * k, b = t[1] * k, c = t[2] * k;
      if (d === 1) {
        q = base("pythagorean", "geometry", d, "numeric", { a: a, b: b });
        q.prompt = "The legs of a right triangle have lengths " + num(a) + " and " + num(b) + ". What is the length of the hypotenuse?";
        q.answer = c;
        q.explanation = "<p>&radic;(" + num(a) + "<sup>2</sup> + " + num(b) + "<sup>2</sup>) = &radic;(" + num(a * a + b * b) + ") = <b>" + num(c) + "</b>.</p>";
      } else {
        q = base("pythagorean", "geometry", d, "numeric", { a: a, c: c });
        q.prompt = "A " + num(c) + "-foot ladder leans against a vertical wall. The bottom of the ladder is " + num(a) + " feet from the base of the wall. How many feet above the ground is the top of the ladder?";
        q.answer = b; q.after = "feet";
        q.explanation = "<p>The ladder is the hypotenuse: &radic;(" + num(c) + "<sup>2</sup> &minus; " + num(a) + "<sup>2</sup>) = &radic;(" + num(c * c - a * a) + ") = <b>" + num(b) + "</b>.</p>";
      }
    } else {
      var Qd = pick(rng, [[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [4, 4, 7, 9], [2, 6, 9, 11], [6, 6, 7, 11], [3, 4, 12, 13], [2, 10, 11, 15], [1, 12, 12, 17], [8, 9, 12, 17]]);
      var m = pick(rng, [1, 2]);
      q = base("pythagorean", "geometry", d, "numeric", { l: Qd[0] * m, w: Qd[1] * m, h: Qd[2] * m });
      q.prompt = "A rectangular box has length " + (Qd[0] * m) + ", width " + (Qd[1] * m) + ", and height " + (Qd[2] * m) + ". What is the distance between two opposite vertices of the box (the length of a space diagonal)?";
      q.answer = Qd[3] * m;
      q.explanation = "<p>Space diagonal = &radic;(" + V("l") + "<sup>2</sup> + " + V("w") + "<sup>2</sup> + " + V("h") + "<sup>2</sup>) = &radic;(" + (Qd[0] * m) * (Qd[0] * m) + " + " + (Qd[1] * m) * (Qd[1] * m) + " + " + (Qd[2] * m) * (Qd[2] * m) + ") = &radic;" + (Qd[3] * m) * (Qd[3] * m) + " = <b>" + (Qd[3] * m) + "</b>.</p>";
    }
    return q;
  });

  add("circle", "geometry", "mc-single", function (d, rng) {
    var q, mc, r = ri(rng, 2, 12), ans, cands;
    var opt = { render: piH, value: rval, fill: function (k) { return R(ans[0] * ans[1] ? ans[0] + k * ans[1] : k, ans[1]); } };
    if (d === 1) {
      ans = R(2 * r, 1);
      cands = [R(r, 1), R(4 * r, 1), R(r * r, 1), R(r * r, 2), R(2 * r * r, 1)];
      q = base("circle", "geometry", d, "mc-single", { r: r, kind: "C-from-A" });
      q.prompt = "The area of a circle is " + piH(R(r * r, 1)) + ". What is the circumference of the circle?";
      q.explanation = "<p>&pi;" + sup(V("r"), 2) + " = " + (r * r) + "&pi;, so " + V("r") + " = " + r + ". Circumference = 2&pi;" + V("r") + " = <b>" + piH(ans) + "</b>.</p>";
    } else if (d === 2) {
      ans = R(r * r, 1);
      cands = [R(4 * r * r, 1), R(2 * r * r, 1), R(2 * r, 1), R(r * r, 2), R(r * r, 4)];
      q = base("circle", "geometry", d, "mc-single", { r: r, kind: "A-from-C" });
      q.prompt = "The circumference of a circle is " + piH(R(2 * r, 1)) + ". What is the area of the circle?";
      q.explanation = "<p>2&pi;" + V("r") + " = " + (2 * r) + "&pi;, so " + V("r") + " = " + r + ". Area = &pi;" + sup(V("r"), 2) + " = <b>" + piH(ans) + "</b>. (Using the diameter in place of the radius gives " + piH(R(4 * r * r, 1)) + ".)</p>";
    } else {
      var th = pick(rng, [30, 40, 45, 60, 72, 90, 120, 135, 150, 240]), arc = rng() < 0.5;
      ans = arc ? R(2 * r * th, 360) : R(r * r * th, 360);
      cands = arc ? [R(r * r * th, 360), R(r * th, 360), R(4 * r * th, 360), R(2 * r * (360 - th), 360)] : [R(2 * r * th, 360), R(r * r * th, 180), R(r * r * (360 - th), 360), R(r * th, 360)];
      q = base("circle", "geometry", d, "mc-single", { r: r, th: th, kind: arc ? "arc" : "sector" });
      q.prompt = "A circle has radius " + r + ". What is the " + (arc ? "length of the minor arc intercepted by a central angle" : "area of the sector formed by a central angle") + " of " + th + "&deg;?";
      q.explanation = "<p>The fraction of the circle is " + fhtml(th, 360) + " = " + rh(R(th, 360)) + ". " + (arc ? "Circumference = " + piH(R(2 * r, 1)) : "Area = " + piH(R(r * r, 1))) + ", so the " + (arc ? "arc length" : "sector area") + " is " + rh(R(th, 360)) + " &times; " + (arc ? piH(R(2 * r, 1)) : piH(R(r * r, 1))) + " = <b>" + piH(ans) + "</b>.</p>";
    }
    opt.fill = function (k) { var j = Math.ceil(k / 2) + 1; return k % 2 ? R(ans[0] * j, ans[1]) : R(ans[0], ans[1] * j); };
    opt.valid = function (v) { return v[0] > 0; };
    mc = buildMC(rng, ans, cands, opt);
    q.options = mc.options; q.answer = mc.answer;
    return q;
  });

  add("polygon-angles", "geometry", "numeric", function (d, rng) {
    var q, n;
    if (d === 1) {
      n = ri(rng, 5, 12);
      q = base("polygon-angles", "geometry", d, "numeric", { n: n, kind: "sum" });
      q.prompt = "What is the sum, in degrees, of the measures of the interior angles of a polygon with " + n + " sides?";
      q.answer = (n - 2) * 180; q.after = "&deg;";
      q.explanation = "<p>Sum = (" + V("n") + " &minus; 2) &times; 180&deg; = " + (n - 2) + " &times; 180 = <b>" + num(q.answer) + "</b>.</p>";
    } else if (d === 2) {
      n = pick(rng, [5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36]);
      q = base("polygon-angles", "geometry", d, "numeric", { n: n, kind: "each" });
      q.prompt = "What is the measure, in degrees, of each interior angle of a regular polygon with " + n + " sides?";
      q.answer = 180 - 360 / n; q.after = "&deg;";
      q.explanation = "<p>Each exterior angle is 360&deg; &divide; " + n + " = " + (360 / n) + "&deg;, so each interior angle is 180&deg; &minus; " + (360 / n) + "&deg; = <b>" + num(q.answer) + "</b>&deg;.</p>";
    } else {
      if (rng() < 0.5) {
        n = pick(rng, [8, 9, 10, 12, 15, 18, 20, 24, 30, 36, 40, 45]);
        q = base("polygon-angles", "geometry", d, "numeric", { n: n, kind: "sides" });
        q.prompt = "Each interior angle of a regular polygon measures " + num(180 - 360 / n) + "&deg;. How many sides does the polygon have?";
        q.answer = n;
        q.explanation = "<p>Each exterior angle is 180&deg; &minus; " + num(180 - 360 / n) + "&deg; = " + num(360 / n) + "&deg;. Since the exterior angles sum to 360&deg;, " + V("n") + " = 360 &divide; " + num(360 / n) + " = <b>" + n + "</b>.</p>";
      } else {
        n = ri(rng, 7, 20);
        q = base("polygon-angles", "geometry", d, "numeric", { n: n, kind: "diagonals" });
        q.prompt = "How many diagonals does a convex polygon with " + n + " sides have?";
        q.answer = n * (n - 3) / 2;
        q.explanation = "<p>Each vertex connects by a diagonal to " + V("n") + " &minus; 3 others, and each diagonal is counted twice: " + fhtml(n + " &times; " + (n - 3), 2) + " = <b>" + q.answer + "</b>.</p>";
      }
    }
    return q;
  });

  add("triangle-third-side", "geometry", "mc-multi", function (d, rng) {
    var a, b;
    do { a = ri(rng, 3, 15); b = ri(rng, 3, 15); } while (a === b && d > 1);
    var lo = Math.abs(a - b), hi = a + b, pool = [];
    if (d === 1) { for (var v = Math.max(1, lo - 2); v <= hi + 3; v++) pool.push(v); }
    else { pool = [lo, hi, lo + 1, hi - 1, Math.max(1, lo - 1), hi + 1, Math.round((lo + hi) / 2), lo + 0.5, hi - 0.5].filter(function (x) { return x > 0; }); if (d === 3) pool.push(lo + 0.1, hi + 0.5); }
    var uniq = {}; pool = pool.filter(function (x) { if (uniq[x]) return false; uniq[x] = 1; return true; });
    var opts, tries = 0;
    do {
      opts = sorted(shuffle(rng, pool).slice(0, ri(rng, 5, Math.min(7, pool.length))));
      var good = opts.filter(function (x) { return x > lo && x < hi; }).length;
      tries++;
    } while ((good === 0 || good === opts.length) && tries < 200);
    var q = base("triangle-third-side", "geometry", d, "mc-multi", { a: a, b: b, opts: opts });
    q.prompt = multiPrompt("Two sides of a triangle have lengths " + a + " and " + b + ". Which of the following could be the length of the third side?", "lengths");
    q.options = opts.map(num);
    q.answer = []; opts.forEach(function (x, i) { if (x > lo && x < hi) q.answer.push(i); });
    q.explanation = "<p>By the triangle inequality, the third side must be greater than " + Math.max(a, b) + " &minus; " + Math.min(a, b) + " = " + lo + " and less than " + a + " + " + b + " = " + hi + ". The endpoints themselves are not allowed, because they would give a flat (degenerate) triangle.</p><p>Valid choices: <b>" + q.answer.map(function (i) { return q.options[i]; }).join(", ") + "</b>.</p>";
    return q;
  });

  add("box-solid", "geometry", "mc-single", function (d, rng) {
    var q, mc, ans, l = ri(rng, 2, 12), w = ri(rng, 2, 10), h = ri(rng, 2, 9);
    if (d === 1) {
      ans = l * w * h;
      mc = mcNum(rng, ans, [2 * (l * w + l * h + w * h), l * w + l * h + w * h, l + w + h, l * w * 2 * h], Math.max(2, Math.round(ans / 10)), null, function (v) { return v > 0; });
      q = base("box-solid", "geometry", d, "mc-single", { l: l, w: w, h: h, kind: "volume" });
      q.prompt = "What is the volume of a rectangular box with dimensions " + l + " by " + w + " by " + h + "?";
      q.explanation = "<p>V = " + l + " &times; " + w + " &times; " + h + " = <b>" + num(ans) + "</b>.</p>";
    } else if (d === 2) {
      ans = 2 * (l * w + l * h + w * h);
      mc = mcNum(rng, ans, [l * w + l * h + w * h, l * w * h, 6 * l * w, ans + 2 * l * w], Math.max(2, Math.round(ans / 10)), null, function (v) { return v > 0; });
      q = base("box-solid", "geometry", d, "mc-single", { l: l, w: w, h: h, kind: "surface" });
      q.prompt = "What is the total surface area of a rectangular box with dimensions " + l + " by " + w + " by " + h + "?";
      q.explanation = "<p>SA = 2(" + V("lw") + " + " + V("lh") + " + " + V("wh") + ") = 2(" + (l * w) + " + " + (l * h) + " + " + (w * h) + ") = <b>" + num(ans) + "</b>. (Forgetting the factor of 2 gives " + num(ans / 2) + ".)</p>";
    } else {
      var e = ri(rng, 2, 10), dir = rng() < 0.5;
      if (dir) {
        ans = 6 * e * e;
        mc = mcNum(rng, ans, [e * e * e, 4 * e * e, 6 * e * e * e, e * e * 6 / 2 * 3, 12 * e], 6, null, function (v) { return v > 0; });
        q = base("box-solid", "geometry", d, "mc-single", { e: e, kind: "cube-SA-from-V" });
        q.prompt = "The volume of a cube is " + num(e * e * e) + ". What is the total surface area of the cube?";
        q.explanation = "<p>The edge is the cube root of " + num(e * e * e) + ", which is " + e + ". Surface area = 6" + sup(V("e"), 2) + " = 6(" + (e * e) + ") = <b>" + num(ans) + "</b>.</p>";
      } else {
        var k = pick(rng, [2, 3]);
        ans = k * k * k;
        mc = mcNum(rng, ans, [k, k * k, 3 * k, 2 * k * k * k], 1, null, function (v) { return v > 0; });
        q = base("box-solid", "geometry", d, "mc-single", { k: k, kind: "cube-scale" });
        q.prompt = "If each edge of a cube is multiplied by " + k + ", the volume of the cube is multiplied by what factor?";
        q.explanation = "<p>Volume scales with the cube of the edge: " + sup(k, 3) + " = <b>" + ans + "</b>. (Surface area would scale by " + sup(k, 2) + " = " + (k * k) + ".)</p>";
      }
    }
    q.options = mc.options; q.answer = mc.answer;
    return q;
  });

  add("special-right-triangle", "geometry", "mc-single", function (d, rng) {
    var q, ans, cands, kind = d === 1 ? pick(rng, ["45leg", "45hyp"]) : d === 2 ? pick(rng, ["30short", "30hyp"]) : pick(rng, ["30long", "equi"]);
    var s = ri(rng, 2, 10), m = ri(rng, 2, 9);
    var P = "";
    function rv(x) { return x[0] * Math.sqrt(x[1]); }
    if (kind === "45leg") { ans = [s, 2]; cands = [[2 * s, 1], [s, 3], [2 * s, 2], [s, 1]]; P = "An isosceles right triangle has legs of length " + s + ". What is the length of its hypotenuse?"; }
    else if (kind === "45hyp") { ans = [s, 2]; cands = [[s, 1], [2 * s, 2], [s, 3], [2 * s, 1]]; P = "An isosceles right triangle has a hypotenuse of length " + (2 * s) + ". What is the length of each leg?"; }
    else if (kind === "30short") { ans = [s, 3]; cands = [[2 * s, 1], [s, 2], [2 * s, 3], [s, 1]]; P = "In a 30&deg;-60&deg;-90&deg; triangle, the side opposite the 30&deg; angle has length " + s + ". What is the length of the side opposite the 60&deg; angle?"; }
    else if (kind === "30hyp") { ans = [s, 3]; cands = [[s, 1], [2 * s, 3], [s, 2], [2 * s, 2]]; P = "In a 30&deg;-60&deg;-90&deg; triangle, the hypotenuse has length " + (2 * s) + ". What is the length of the longer leg?"; }
    else if (kind === "30long") { ans = [2 * m, 3]; cands = [[m, 3], [6 * m, 1], [3 * m, 2], [2 * m, 1], [4 * m, 3]]; P = "In a 30&deg;-60&deg;-90&deg; triangle, the longer leg has length " + (3 * m) + ". What is the length of the hypotenuse?"; }
    else { ans = [s * s, 3]; cands = [[2 * s * s, 3], [4 * s * s, 3], [s * s, 2], [2 * s * s, 1], [s * s, 1]]; P = "An equilateral triangle has side length " + (2 * s) + ". What is its area?"; }
    var mc = buildMC(rng, ans, cands, { render: function (x) { return radH(x[0], x[1]); }, value: rv, fill: function (k) { return [ans[0] + (k % 2 ? 1 : -1) * Math.ceil(k / 2), ans[1]]; }, valid: function (x) { return x[0] > 0; } });
    q = base("special-right-triangle", "geometry", d, "mc-single", { kind: kind, s: s, m: m });
    q.prompt = P; q.options = mc.options; q.answer = mc.answer;
    var ex = {
      "45leg": "In a 45-45-90 triangle the sides are in the ratio 1 : 1 : &radic;2, so the hypotenuse is " + s + "&radic;2.",
      "45hyp": "Leg = hypotenuse &divide; &radic;2 = " + fhtml(2 * s, "&radic;2") + " = " + s + "&radic;2.",
      "30short": "The sides are in the ratio 1 : &radic;3 : 2, so the side opposite 60&deg; is " + s + "&radic;3.",
      "30hyp": "The shorter leg is half the hypotenuse, " + s + ", and the longer leg is " + s + "&radic;3.",
      "30long": "Shorter leg = " + fhtml(3 * m, "&radic;3") + " = " + m + "&radic;3, and the hypotenuse is twice that: " + (2 * m) + "&radic;3.",
      "equi": "Height = " + s + "&radic;3 (a 30-60-90 triangle with short leg " + s + "). Area = " + fhtml(1, 2) + "(" + (2 * s) + ")(" + s + "&radic;3) = " + (s * s) + "&radic;3."
    }[kind];
    q.explanation = "<p>" + ex + "</p><p>Answer: <b>" + radH(ans[0], ans[1]) + "</b>.</p>";
    return q;
  });

  add("geometry-qc", "geometry", "qc", function (d, rng) {
    var q, A, B, ex;
    if (d === 1) {
      if (rng() < 0.5) {
        var r = ri(rng, 2, 10), s = Math.round(r * Math.sqrt(Math.PI)) + ri(rng, -1, 1);
        A = Math.PI * r * r; B = s * s;
        q = base("geometry-qc", "geometry", d, "qc", { kind: "circle-square", r: r, s: s });
        q.quantityA = "The area of a circle with radius " + r; q.quantityB = "The area of a square with side length " + s;
        ex = "A = " + (r * r) + "&pi; &asymp; " + num(round(A, 2)) + ". B = " + (s * s) + ".";
      } else {
        var a = ri(rng, 3, 15), b = rng() < 0.4 ? a * 4 / 3 : ri(rng, 4, 20);
        if (!isInt(b)) { a = 3 * ri(rng, 1, 5); b = a * 4 / 3; }
        A = 4 * a; B = 3 * b;
        q = base("geometry-qc", "geometry", d, "qc", { kind: "perimeters", a: a, b: b });
        q.quantityA = "The perimeter of a square with side length " + a; q.quantityB = "The perimeter of an equilateral triangle with side length " + b;
        ex = "A = 4 &times; " + a + " = " + A + ". B = 3 &times; " + b + " = " + B + ".";
      }
      q.answer = [qcAnswer(A, B)];
    } else if (d === 2) {
      if (rng() < 0.5) {
        var dm = ri(rng, 3, 20), Bv = Math.floor(Math.PI * dm) + (rng() < 0.5 ? 0 : 1);
        q = base("geometry-qc", "geometry", d, "qc", { kind: "circumference", d: dm, B: Bv });
        q.quantityA = "The circumference of a circle with diameter " + dm; q.quantityB = String(Bv);
        A = Math.PI * dm; B = Bv;
        ex = "A = " + dm + "&pi; &asymp; " + num(round(A, 3)) + ".";
        q.answer = [qcAnswer(A, B)];
      } else {
        var l1 = ri(rng, 2, 12), l2 = ri(rng, 2, 12), h2 = l1 * l1 + l2 * l2, hv = Math.round(Math.sqrt(h2)) + ri(rng, -1, 1);
        if (rng() < 0.3) { var tt = pick(rng, [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17]]); l1 = tt[0]; l2 = tt[1]; h2 = l1 * l1 + l2 * l2; hv = tt[2]; }
        q = base("geometry-qc", "geometry", d, "qc", { kind: "hyp", l1: l1, l2: l2, B: hv });
        q.quantityA = "The length of the hypotenuse of a right triangle with legs " + l1 + " and " + l2; q.quantityB = String(hv);
        q.answer = [qcAnswer(h2, hv * hv)];
        ex = "A = &radic;(" + (l1 * l1) + " + " + (l2 * l2) + ") = &radic;" + h2 + ", and B = " + hv + " = &radic;" + (hv * hv) + ".";
      }
    } else {
      var kind = pick(rng, ["third", "rect", "area"]);
      q = base("geometry-qc", "geometry", d, "qc", { kind: kind });
      if (kind === "third") {
        var x = ri(rng, 3, 12), y = ri(rng, 3, 12), lo = Math.abs(x - y), hi = x + y;
        var choice = pick(rng, ["hi", "mid", "lo"]), v = choice === "hi" ? hi : choice === "lo" ? lo : ri(rng, lo + 1, hi - 1);
        q.meta.x = x; q.meta.y = y; q.meta.v = v;
        q.info = "Two sides of a triangle have lengths " + x + " and " + y + ".";
        q.quantityA = "The length of the third side"; q.quantityB = String(v);
        q.answer = [v >= hi ? 1 : v <= lo ? 0 : 3];
        ex = "The third side is strictly between " + lo + " and " + hi + ". " + (v >= hi ? "It is always less than " + v + "." : v <= lo ? "It is always greater than " + v + "." : v + " lies inside that range, so the third side could be greater or less than " + v + ".");
      } else if (kind === "rect") {
        var P = 4 * ri(rng, 3, 15), sq = (P / 4) * (P / 4), plus = rng() < 0.4;
        q.meta.P = P; q.meta.plus = plus;
        q.info = "A rectangle has perimeter " + P + ".";
        q.quantityA = "The area of the rectangle"; q.quantityB = String(plus ? sq + 1 : sq);
        q.answer = [plus ? 1 : 3];
        ex = "For a fixed perimeter, the largest area belongs to the square, with side " + (P / 4) + " and area " + sq + ". " + (plus ? "So the area is at most " + sq + ", which is less than " + (sq + 1) + "." : "A square is a rectangle, so the area can equal " + sq + "; any other rectangle has a smaller area.");
      } else {
        var p = ri(rng, 3, 12), r2 = ri(rng, 3, 12), half = p * r2 / 2, more = rng() < 0.4;
        q.meta.p = p; q.meta.r = r2; q.meta.more = more;
        q.info = "Two sides of a triangle have lengths " + p + " and " + r2 + ".";
        q.quantityA = "The area of the triangle"; q.quantityB = num(more ? half + 1 : half);
        q.answer = [more ? 1 : 3];
        ex = "Area = " + fhtml(1, 2) + "(" + p + ")(" + r2 + ") sin&thinsp;" + V("C") + " &le; " + num(half) + ", with equality only for a right angle between those sides. " + (more ? "So the area is always less than " + num(half + 1) + "." : "So it could equal " + num(half) + " or be less.");
      }
    }
    q.explanation = "<p>" + ex + "</p><p><b>" + QC_WORDS[q.answer[0]] + "</b>.</p>";
    return q;
  });

  /* ----------------------------- DATA ANALYSIS ----------------------------- */
  add("mean-missing", "data", "numeric", function (d, rng) {
    var q, n, m, vals, x, i;
    if (d === 1) {
      do { n = ri(rng, 4, 6); m = ri(rng, 10, 40); vals = []; for (i = 0; i < n - 1; i++) vals.push(ri(rng, m - 10, m + 10)); x = n * m - sum(vals); } while (x < 1 || x > 99);
      q = base("mean-missing", "data", d, "numeric", { vals: vals, m: m });
      q.prompt = "The average (arithmetic mean) of the " + n + " numbers " + vals.join(", ") + ", and " + V("x") + " is " + m + ". What is the value of " + V("x") + "?";
      q.answer = x;
      q.explanation = "<p>The total must be " + n + " &times; " + m + " = " + (n * m) + ". The known numbers sum to " + sum(vals) + ", so " + V("x") + " = " + (n * m) + " &minus; " + sum(vals) + " = <b>" + x + "</b>.</p>";
    } else if (d === 2) {
      var m1, m2;
      do { n = ri(rng, 5, 12); m1 = ri(rng, 20, 90); m2 = m1 + ri(rng, -6, 6); x = n * m1 - (n - 1) * m2; } while (m2 === m1 || x < 1 || x > 200);
      q = base("mean-missing", "data", d, "numeric", { n: n, m1: m1, m2: m2 });
      q.prompt = "The average (arithmetic mean) of " + n + " numbers is " + m1 + ". When one of the numbers is removed, the average of the remaining numbers is " + m2 + ". What number was removed?";
      q.answer = x;
      q.explanation = "<p>Original sum: " + n + " &times; " + m1 + " = " + (n * m1) + ". New sum: " + (n - 1) + " &times; " + m2 + " = " + ((n - 1) * m2) + ". Removed number: " + (n * m1) + " &minus; " + ((n - 1) * m2) + " = <b>" + x + "</b>.</p>";
    } else {
      var k, a, res;
      do { n = ri(rng, 8, 20); k = ri(rng, 3, n - 3); m = ri(rng, 30, 90); a = m + ri(rng, -12, 12); res = (n * m - k * a) / (n - k); } while (a === m || !isInt(res * 10) || res < 0);
      q = base("mean-missing", "data", d, "numeric", { n: n, k: k, m: m, a: a });
      q.prompt = "The average (arithmetic mean) of " + n + " test scores is " + m + ". The average of the " + k + " lowest scores is " + a + ". What is the average of the other " + (n - k) + " scores?";
      if (!isInt(res)) q.prompt += " Round to the nearest tenth.";
      q.answer = round(res, 1);
      q.explanation = "<p>Total = " + n + " &times; " + m + " = " + (n * m) + ". The " + k + " lowest scores total " + (k * a) + ". The remaining " + (n - k) + " total " + (n * m - k * a) + ", so their average is " + (n * m - k * a) + " &divide; " + (n - k) + " = <b>" + num(q.answer) + "</b>.</p>";
    }
    return q;
  });

  add("median-mode", "data", "mc-single", function (d, rng) {
    var q, mc, vals, i, n = d === 1 ? pick(rng, [7, 9]) : pick(rng, [6, 8, 10]);
    vals = []; for (i = 0; i < n; i++) vals.push(ri(rng, d === 3 ? -10 : 1, 30));
    if (d === 3) { var adj = (n - (sum(vals) % n + n) % n) % n; vals[0] += adj; }
    var s = sorted(vals), med = median(vals), mn = mean(vals), unsortedMid = n % 2 ? vals[(n - 1) / 2] : (vals[n / 2 - 1] + vals[n / 2]) / 2;
    var mo = modes(vals);
    q = base("median-mode", "data", d, "mc-single", { vals: vals });
    if (d < 3) {
      mc = mcNum(rng, med, [round(mn, 2), unsortedMid, n % 2 ? s[(n + 1) / 2] : s[n / 2], (s[0] + s[n - 1]) / 2, mo.count > 1 ? mo.modes[0] : null].filter(function (v) { return v !== null; }), 0.5);
      q.prompt = "What is the median of the following list of numbers?<br>" + vals.map(num).join(", ");
      q.explanation = "<p>Sort the list: " + s.map(num).join(", ") + ". " + (n % 2 ? "With " + n + " values, the median is the middle (" + ((n + 1) / 2) + "th) value: <b>" + num(med) + "</b>." : "With " + n + " values, the median is the average of the " + (n / 2) + "th and " + (n / 2 + 1) + "th values: (" + num(s[n / 2 - 1]) + " + " + num(s[n / 2]) + ")/2 = <b>" + num(med) + "</b>.") + " Remember to sort first; the middle of the unsorted list is a trap.</p>";
    } else {
      var ans = clean(mn - med);
      mc = mcNum(rng, ans, [-ans, clean(mn - unsortedMid), clean(mn - s[n / 2]), 0], 0.5);
      q.prompt = "For the list " + vals.map(num).join(", ") + ", what is the mean minus the median?";
      q.explanation = "<p>Sum = " + num(sum(vals)) + ", so the mean is " + num(sum(vals)) + "/" + n + " = " + num(mn) + ". Sorted: " + s.map(num).join(", ") + ", so the median is (" + num(s[n / 2 - 1]) + " + " + num(s[n / 2]) + ")/2 = " + num(med) + ".</p><p>Mean &minus; median = <b>" + num(ans) + "</b>.</p>";
    }
    q.options = mc.options; q.answer = mc.answer;
    return q;
  });

  add("counting", "data", "mc-single", function (d, rng) {
    var q, mc, ans, n, k;
    if (d === 1) {
      if (rng() < 0.5) {
        n = ri(rng, 4, 7); ans = fact(n);
        mc = mcNum(rng, ans, [n * n, Math.pow(n, n) > 1e6 ? null : Math.pow(n, n), fact(n - 1), n * (n - 1)].filter(function (v) { return v !== null; }), n);
        q = base("counting", "data", d, "mc-single", { n: n, kind: "fact" });
        q.prompt = "In how many different orders can " + n + " different books be arranged on a shelf?";
        q.explanation = "<p>" + n + " choices for the first position, " + (n - 1) + " for the next, and so on: " + n + "! = <b>" + num(ans) + "</b>.</p>";
      } else {
        n = ri(rng, 5, 15); ans = choose(n, 2);
        mc = mcNum(rng, ans, [n * (n - 1), n * n, n * 2, choose(n, 3)], n);
        q = base("counting", "data", d, "mc-single", { n: n, kind: "handshake" });
        q.prompt = "At a meeting, each of " + n + " people shakes hands exactly once with each of the other people. How many handshakes take place?";
        q.explanation = "<p>Each handshake is a pair of people: C(" + n + ", 2) = " + fhtml(n + " &times; " + (n - 1), 2) + " = <b>" + ans + "</b>. (" + (n * (n - 1)) + " counts every handshake twice.)</p>";
      }
    } else if (d === 2) {
      n = ri(rng, 6, 12); k = ri(rng, 3, 4);
      var ordered = rng() < 0.5;
      ans = ordered ? perm(n, k) : choose(n, k);
      mc = mcNum(rng, ans, [ordered ? choose(n, k) : perm(n, k), Math.pow(n, k), n * k, choose(n, k - 1)], Math.max(1, Math.round(ans / 12)));
      q = base("counting", "data", d, "mc-single", { n: n, k: k, ordered: ordered });
      q.prompt = ordered ? "From a group of " + n + " candidates, a president, a vice president, " + (k === 4 ? "a secretary, and a treasurer" : "and a secretary") + " are to be chosen, with no person holding more than one office. In how many ways can this be done?" :
        "In how many different ways can a committee of " + k + " people be chosen from a group of " + n + " people?";
      q.explanation = ordered ? "<p>Order matters because the offices are different: " + n + " &times; " + (n - 1) + " &times; " + (n - 2) + (k === 4 ? " &times; " + (n - 3) : "") + " = <b>" + num(ans) + "</b>.</p>" :
        "<p>Order does not matter: C(" + n + ", " + k + ") = " + fhtml(n + "!", k + "!(" + (n - k) + ")!") + " = <b>" + num(ans) + "</b>.</p>";
    } else {
      var kind = pick(rng, ["atleast", "together", "apart"]);
      if (kind === "atleast") {
        var men = ri(rng, 4, 8), women = ri(rng, 3, 7); k = ri(rng, 3, 4);
        ans = choose(men + women, k) - choose(men, k);
        mc = mcNum(rng, ans, [choose(men + women, k), women * choose(men + women - 1, k - 1), choose(men + women, k) - choose(women, k), women * choose(men, k - 1)], Math.max(1, Math.round(ans / 15)), null, function (v) { return v > 0; });
        q = base("counting", "data", d, "mc-single", { men: men, women: women, k: k, kind: kind });
        q.prompt = "A committee of " + k + " is to be chosen from " + men + " men and " + women + " women. How many different committees include at least one woman?";
        q.explanation = "<p>Count the complement: all committees C(" + (men + women) + ", " + k + ") = " + choose(men + women, k) + ", minus all-men committees C(" + men + ", " + k + ") = " + choose(men, k) + ". The result is <b>" + num(ans) + "</b>.</p><p>Picking one woman first and then any " + (k - 1) + " others overcounts committees with several women.</p>";
      } else {
        n = ri(rng, 4, 7);
        ans = kind === "together" ? 2 * fact(n - 1) : fact(n) - 2 * fact(n - 1);
        mc = mcNum(rng, ans, [fact(n - 1), fact(n), kind === "together" ? fact(n) - 2 * fact(n - 1) : 2 * fact(n - 1), fact(n - 2) * 2], Math.max(1, Math.round(ans / 10)), null, function (v) { return v > 0; });
        q = base("counting", "data", d, "mc-single", { n: n, kind: kind });
        q.prompt = "In how many ways can " + n + " people stand in a row if two particular people, Jo and Kai, must " + (kind === "together" ? "stand next to each other" : "<u>not</u> stand next to each other") + "?";
        q.explanation = "<p>Treat Jo and Kai as one block: (" + (n - 1) + ")! arrangements, times 2 orders within the block = " + num(2 * fact(n - 1)) + "." + (kind === "apart" ? " Subtract that from all " + n + "! = " + num(fact(n)) + " arrangements: " + num(fact(n)) + " &minus; " + num(2 * fact(n - 1)) + "." : "") + "</p><p>Answer: <b>" + num(ans) + "</b>.</p>";
      }
    }
    q.options = mc.options; q.answer = mc.answer;
    return q;
  });

  add("probability-draw", "data", "fraction", function (d, rng) {
    var r = ri(rng, 2, 8), b = ri(rng, 2, 8), g = ri(rng, 1, 6), N = r + b + g, ans, q;
    var bag = "A bag contains " + r + " red, " + b + " blue, and " + g + " green marbles. ";
    if (d === 1) {
      ans = R(b + g, N);
      q = base("probability-draw", "data", d, "fraction", { r: r, b: b, g: g, kind: "notred" });
      q.prompt = bag + "If one marble is chosen at random, what is the probability that it is <u>not</u> red?";
      q.explanation = "<p>" + (b + g) + " of the " + N + " marbles are not red: " + fhtml(b + g, N) + " = <b>" + rh(ans) + "</b>.</p>";
    } else if (d === 2) {
      ans = R(r * (r - 1), N * (N - 1));
      q = base("probability-draw", "data", d, "fraction", { r: r, b: b, g: g, kind: "bothred" });
      q.prompt = bag + "If two marbles are chosen at random without replacement, what is the probability that both are red?";
      q.explanation = "<p>" + fhtml(r, N) + " &times; " + fhtml(r - 1, N - 1) + " = " + fhtml(r * (r - 1), N * (N - 1)) + " = <b>" + rh(ans) + "</b>. The second draw has one fewer red marble and one fewer marble in total.</p>";
    } else {
      ans = R(2 * r * b, N * (N - 1));
      q = base("probability-draw", "data", d, "fraction", { r: r, b: b, g: g, kind: "onered1blue" });
      q.prompt = bag + "If two marbles are chosen at random without replacement, what is the probability that one is red and the other is blue?";
      q.explanation = "<p>Red then blue: " + fhtml(r, N) + " &times; " + fhtml(b, N - 1) + ". Blue then red: " + fhtml(b, N) + " &times; " + fhtml(r, N - 1) + ". Total = " + fhtml(2 * r * b, N * (N - 1)) + " = <b>" + rh(ans) + "</b>. Equivalently, " + fhtml(r + " &times; " + b, "C(" + N + ", 2)") + ". Do not forget that either order works.</p>";
    }
    q.answer = [ans[0], ans[1]];
    return q;
  });

  add("sd-qc", "data", "qc", function (d, rng) {
    var S = [], i, n = 5;
    do { S = []; for (i = 0; i < n; i++) S.push(ri(rng, 1, 30)); } while (sd(S) < 1);
    S = sorted(S);
    var kinds = d === 1 ? ["shift", "scale"] : d === 2 ? ["shift", "scale", "negate", "addmean"] : ["negscale", "addmean", "addfar", "removeext", "shiftscale"];
    var kind = pick(rng, kinds), T, desc;
    var c = ri(rng, 2, 12), k = ri(rng, 2, 4), mu = mean(S);
    if (kind === "shift") { T = S.map(function (x) { return x + c; }); desc = "Each value of <i>T</i> is " + c + " more than the corresponding value of <i>S</i>."; }
    else if (kind === "scale") { T = S.map(function (x) { return x * k; }); desc = "Each value of <i>T</i> is " + k + " times the corresponding value of <i>S</i>."; }
    else if (kind === "negate") { T = S.map(function (x) { return -x; }); desc = "Each value of <i>T</i> is the negative of the corresponding value of <i>S</i>."; }
    else if (kind === "negscale") { T = S.map(function (x) { return -x / k + c; }); desc = "Each value of <i>T</i> is obtained by dividing the corresponding value of <i>S</i> by &minus;" + k + " and then adding " + c + "."; }
    else if (kind === "addmean") { if (!isInt(mu)) { S[n - 1] += (n - sum(S) % n) % n; S = sorted(S); mu = mean(S); } T = S.concat([mu]); desc = "<i>T</i> consists of the values of <i>S</i> together with one additional value, " + num(mu) + "."; }
    else if (kind === "addfar") { var far = S[n - 1] + ri(rng, 5, 20); T = S.concat([far]); desc = "<i>T</i> consists of the values of <i>S</i> together with one additional value, " + far + "."; }
    else if (kind === "removeext") { T = S.slice(1, n - 1); desc = "<i>T</i> is formed by removing the least and greatest values from <i>S</i>."; }
    else { T = S.map(function (x) { return 2 * x + c; }); desc = "Each value of <i>T</i> is obtained by doubling the corresponding value of <i>S</i> and then adding " + c + "."; }
    var swap = rng() < 0.5, sS = sd(S), sT = sd(T);
    var q = base("sd-qc", "data", d, "qc", { S: S, T: T, kind: kind, swap: swap });
    q.info = "Data set <i>S</i>: " + S.map(num).join(", ") + "<br>" + desc;
    var hA = "The standard deviation of <i>" + (swap ? "T" : "S") + "</i>", hB = "The standard deviation of <i>" + (swap ? "S" : "T") + "</i>";
    q.quantityA = hA; q.quantityB = hB;
    q.answer = [swap ? qcAnswer(sT, sS) : qcAnswer(sS, sT)];
    var why = {
      shift: "Adding a constant shifts every value but does not change the spread.",
      scale: "Multiplying every value by " + k + " multiplies the standard deviation by " + k + ".",
      negate: "Negating every value reflects the data; the distances from the mean are unchanged.",
      negscale: "Adding " + c + " has no effect, and dividing by &minus;" + k + " multiplies the standard deviation by 1/" + k + ". The sign does not matter.",
      addmean: "Adding a value equal to the mean adds a zero deviation and increases the count, so the standard deviation decreases.",
      addfar: "The new value is far from the mean, so it increases the spread.",
      removeext: "Removing the most extreme values reduces the spread.",
      shiftscale: "Doubling multiplies the standard deviation by 2; adding " + c + " has no effect."
    }[kind];
    q.explanation = "<p>" + why + " (Population SDs: <i>S</i> &asymp; " + num(round(sS, 2)) + ", <i>T</i> &asymp; " + num(round(sT, 2)) + ".)</p><p><b>" + QC_WORDS[q.answer[0]] + "</b>.</p>";
    return q;
  });

  add("normal-distribution", "data", "mc-single", function (d, rng) {
    var mu = pick(rng, [50, 60, 70, 100, 150, 200, 500]), sg = pick(rng, [5, 8, 10, 12, 15, 20, 25]);
    if (mu === 500) sg = 100;
    var C = [
      { lo: -1, hi: 1, p: 68, t: "between L and H" }, { lo: -2, hi: 2, p: 95, t: "between L and H" },
      { lo: 1, hi: 99, p: 16, t: "greater than L" }, { lo: -99, hi: -2, p: 2.5, t: "less than H" },
      { lo: 0, hi: 2, p: 47.5, t: "between L and H" }, { lo: -1, hi: 2, p: 81.5, t: "between L and H" },
      { lo: -99, hi: 1, p: 84, t: "less than H" }, { lo: 1, hi: 2, p: 13.5, t: "between L and H" },
      { lo: -2, hi: 99, p: 97.5, t: "greater than L" }, { lo: 0, hi: 1, p: 34, t: "between L and H" }
    ];
    var pool = d === 1 ? [0, 1] : d === 2 ? [2, 3, 4, 6, 8, 9] : [5, 7, 2, 3, 4];
    var c = C[pick(rng, pool)];
    var L = mu + c.lo * sg, H = mu + c.hi * sg;
    var text = c.t.replace("L", num(L)).replace("H", num(H));
    var N = d === 3 ? pick(rng, [200, 400, 1000, 2000]) : 0;
    var all = [2.5, 5, 13.5, 16, 32, 34, 47.5, 50, 68, 81.5, 84, 95, 97.5];
    var ans = N ? N * c.p / 100 : c.p;
    var cands = shuffle(rng, all.filter(function (x) { return x !== c.p; })).map(function (x) { return N ? N * x / 100 : x; });
    var mc = buildMC(rng, ans, cands, { render: N ? num : pct, value: function (v) { return v; }, fill: numFill(ans, N ? N / 100 : 1), valid: function (v) { return v > 0 && v < (N || 100); }, preferCands: true });
    var q = base("normal-distribution", "data", d, "mc-single", { mu: mu, sg: sg, lo: c.lo, hi: c.hi, N: N, p: c.p });
    q.prompt = (N ? "The measurements of " + num(N) + " items" : "The values of a large population") + " are approximately normally distributed with mean " + num(mu) + " and standard deviation " + num(sg) + ". Approximately " + (N ? "how many of the items have measurements" : "what percent of the values are") + " " + text + "?";
    q.options = mc.options; q.answer = mc.answer;
    q.explanation = "<p>Convert to standard deviations from the mean: " + (c.lo > -99 ? num(L) + " is " + (c.lo === 0 ? "the mean" : (c.lo > 0 ? "+" : "&minus;") + Math.abs(c.lo) + " SD") : "") + (c.lo > -99 && c.hi < 99 ? "; " : "") + (c.hi < 99 ? num(H) + " is " + (c.hi === 0 ? "the mean" : (c.hi > 0 ? "+" : "&minus;") + Math.abs(c.hi) + " SD") : "") + ".</p><p>Using the approximate normal percentages (34% between the mean and 1 SD, 13.5% between 1 and 2 SD, 2.5% beyond 2 SD on each side), the region holds about " + c.p + "%" + (N ? ", and " + c.p + "% of " + num(N) + " is <b>" + num(ans) + "</b>." : ", so the answer is <b>" + c.p + "%</b>.") + "</p>";
    return q;
  });

  add("weighted-average", "data", "numeric", function (d, rng) {
    var q, n1, n2, a1, a2, comb;
    if (d < 3) {
      do { n1 = ri(rng, 5, 40); n2 = ri(rng, 5, 40); a1 = ri(rng, 60, 95); a2 = ri(rng, 60, 95); comb = (n1 * a1 + n2 * a2) / (n1 + n2); }
      while (a1 === a2 || (d === 1 ? !isInt(comb) : !isInt(comb * 10) || isInt(comb)));
      q = base("weighted-average", "data", d, "numeric", { n1: n1, a1: a1, n2: n2, a2: a2 });
      q.prompt = "A class of " + n1 + " students had an average (arithmetic mean) score of " + a1 + ", and another class of " + n2 + " students had an average score of " + a2 + ". What was the average score of all " + (n1 + n2) + " students combined?";
      q.answer = clean(comb);
      q.explanation = "<p>Combined average = " + fhtml(n1 + "(" + a1 + ") + " + n2 + "(" + a2 + ")", n1 + n2) + " = " + fhtml(n1 * a1 + n2 * a2, n1 + n2) + " = <b>" + num(q.answer) + "</b>. (Simply averaging " + a1 + " and " + a2 + " ignores the class sizes.)</p>";
    } else {
      do { n1 = ri(rng, 5, 40); a1 = ri(rng, 60, 85); a2 = a1 + ri(rng, 4, 15); comb = ri(rng, a1 + 1, a2 - 1); n2 = n1 * (comb - a1) / (a2 - comb); } while (!isInt(n2) || n2 < 2 || n2 > 80);
      q = base("weighted-average", "data", d, "numeric", { n1: n1, a1: a1, a2: a2, comb: comb });
      q.prompt = "Group A has " + n1 + " members with an average (arithmetic mean) age of " + a1 + ". Group B has an average age of " + a2 + ". If the average age of the two groups combined is " + comb + ", how many members does Group B have?";
      q.answer = n2;
      q.explanation = "<p>" + n1 + "(" + a1 + ") + " + a2 + V("n") + " = " + comb + "(" + n1 + " + " + V("n") + "), so " + (a2 - comb) + V("n") + " = " + n1 + "(" + (comb - a1) + ") and " + V("n") + " = <b>" + n2 + "</b>.</p><p>Balance view: the distances to the combined mean (" + (comb - a1) + " and " + (a2 - comb) + ") are inversely proportional to the group sizes.</p>";
    }
    return q;
  });

  add("dice-probability", "data", "fraction", function (d, rng) {
    var outs = []; for (var x = 1; x <= 6; x++) for (var y = 1; y <= 6; y++) outs.push([x, y]);
    var q, ev, cond = null, desc, condDesc = "";
    if (d === 1) {
      var s = ri(rng, 3, 11);
      ev = function (o) { return o[0] + o[1] === s; }; desc = "the sum of the two numbers is " + s;
    } else if (d === 2) {
      var kind = pick(rng, ["atleast", "geq", "prodeven", "diff"]);
      if (kind === "atleast") { var k = ri(rng, 1, 6); ev = function (o) { return o[0] === k || o[1] === k; }; desc = "at least one of the dice shows a " + k; }
      else if (kind === "geq") { var t = ri(rng, 8, 11); ev = function (o) { return o[0] + o[1] >= t; }; desc = "the sum is at least " + t; }
      else if (kind === "prodeven") { ev = function (o) { return (o[0] * o[1]) % 2 === 0; }; desc = "the product of the two numbers is even"; }
      else { var dd = ri(rng, 1, 3); ev = function (o) { return Math.abs(o[0] - o[1]) === dd; }; desc = "the two numbers differ by exactly " + dd; }
    } else {
      var kk = ri(rng, 1, 6), ss = ri(rng, 5, 10);
      if (rng() < 0.5) { cond = function (o) { return o[0] === kk || o[1] === kk; }; condDesc = "at least one die shows a " + kk; ev = function (o) { return o[0] + o[1] === ss; }; desc = "the sum is " + ss; }
      else { var g = ri(rng, 7, 10); cond = function (o) { return o[0] + o[1] >= g; }; condDesc = "the sum is at least " + g; ev = function (o) { return o[0] === o[1]; }; desc = "the two dice show the same number"; }
    }
    var space = cond ? outs.filter(cond) : outs, fav = space.filter(ev).length;
    if (fav === 0) return G[byName["dice-probability"]].fn(d, rng);
    var ans = R(fav, space.length);
    q = base("dice-probability", "data", d, "fraction", { d: d });
    q.prompt = "Two fair six-sided dice, with faces numbered 1 through 6, are rolled. " + (cond ? "Given that " + condDesc + ", what is the probability that " + desc + "?" : "What is the probability that " + desc + "?");
    q.answer = [ans[0], ans[1]];
    q.explanation = "<p>" + (cond ? "Restrict to the " + space.length + " equally likely outcomes in which " + condDesc + ". Of these, " + fav + " have " + desc.replace(/^the /, "the ") + "." : "Of the 36 equally likely ordered outcomes, " + fav + " satisfy the condition.") + "</p><p>Probability = " + fhtml(fav, space.length) + " = <b>" + rh(ans) + "</b>." + (cond ? " Ordered pairs matter: (2, 5) and (5, 2) are different outcomes." : "") + "</p>";
    return q;
  });

  add("stats-multi", "data", "mc-multi", function (d, rng) {
    var n = d === 1 ? 5 : d === 2 ? 7 : 8, vals, i;
    do { vals = []; for (i = 0; i < n; i++) vals.push(ri(rng, d === 3 ? -5 : 1, 20)); if (rng() < 0.7) vals[n - 1] = vals[0]; } while (modes(vals).count < 2 || modes(vals).modes.length > 1 || isInt(mean(vals) * 100) === false);
    var s = sorted(vals), mn = mean(vals), med = median(vals), mo = modes(vals).modes[0], rg = s[n - 1] - s[0];
    var st = [];
    function addS(text, truth) { st.push({ h: text, t: truth }); }
    var offR = rng() < 0.5 ? 0 : pick(rng, [-1, 1, s[n - 1]]);
    addS("The range is " + num(rg + offR) + ".", offR === 0);
    var offM = rng() < 0.5 ? 0 : pick(rng, [0.5, -0.5, 1]);
    addS("The median is " + num(med + offM) + ".", offM === 0);
    addS("The mean is greater than the median.", mn > med + 1e-9);
    addS("The mode is " + num(rng() < 0.6 ? mo : s[Math.floor(n / 2)]) + ".", null);
    st[3].t = st[3].h === "The mode is " + num(mo) + ".";
    if (d >= 2) addS("The mean is " + num(round(mn, 2)) + ".", true);
    if (d === 3) addS("If the greatest value were increased by 10, the median would increase.", false);
    if (d >= 2 && rng() < 0.5) st[4] = { h: "The mean is " + num(round(mn + pick(rng, [0.5, -1, 1]), 2)) + ".", t: false };
    if (!st.some(function (x) { return x.t; })) st[0] = { h: "The range is " + num(rg) + ".", t: true };
    st = shuffle(rng, st);
    var q = base("stats-multi", "data", d, "mc-multi", { vals: vals });
    q.prompt = multiPrompt("For the data set " + vals.map(num).join(", ") + ", which of the following statements are true?", "statements");
    q.options = st.map(function (x) { return x.h; });
    q.answer = []; st.forEach(function (x, j) { if (x.t) q.answer.push(j); });
    q.explanation = "<p>Sorted: " + s.map(num).join(", ") + ". Mean = " + num(sum(vals)) + "/" + n + " = " + num(round(mn, 4)) + "; median = " + num(med) + "; mode = " + num(mo) + "; range = " + num(s[n - 1]) + " &minus; " + (s[0] < 0 ? "(" + num(s[0]) + ")" : num(s[0])) + " = " + num(rg) + "." + (d === 3 ? " Changing the greatest value does not move the middle values, so the median stays the same." : "") + "</p><p>True statements: " + q.answer.map(function (j) { return "&ldquo;" + q.options[j] + "&rdquo;"; }).join("; ") + ".</p>";
    return q;
  });

  var byName = {};
  G.forEach(function (g, i) { byName[g.name] = i; });

  /* ============================== public API ============================== */
  function generate(count, opts) {
    opts = opts || {};
    var rng = opts.rng || Math.random;
    var pool = G.filter(function (g) {
      return (!opts.topics || !opts.topics.length || opts.topics.indexOf(g.topic) >= 0) &&
        (!opts.types || !opts.types.length || opts.types.indexOf(g.type) >= 0);
    });
    if (!pool.length) return [];
    var out = [], order = [];
    for (var i = 0; i < count; i++) {
      if (!order.length) order = shuffle(rng, pool);
      var g = order.pop();
      var d = opts.difficulty || (1 + Math.floor(rng() * 3));
      var q = null;
      for (var attempt = 0; attempt < 5 && !q; attempt++) {
        try { q = g.fn(d, rng); } catch (e) { q = null; }
      }
      if (q) out.push(q);
    }
    return out;
  }

  return { generators: G, generate: generate };
})();
