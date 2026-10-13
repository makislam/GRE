/* GRE Quantitative Reasoning question bank (original content).
   Loaded as a plain script: defines window.QUANT_BANK and window.QUANT_SETS.
   QC answer codes: 0 = Quantity A greater, 1 = Quantity B greater, 2 = equal, 3 = cannot be determined. */
(function () {
  "use strict";

  /* ---------- small HTML helpers (used only while building the bank) ---------- */
  function fr(n, d) { return "<span class='frac'><span>" + n + "</span><span>" + d + "</span></span>"; }
  var PAL = ["#5b7db1", "#c97b4a", "#7aa36b", "#a9a9a9", "#d4b44a", "#8e6bb0"];

  function svgOpen(w, h) {
    return "<svg viewBox='0 0 " + w + " " + h + "' width='" + w + "' style='max-width:100%;height:auto' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif'>";
  }
  function txt(x, y, s, size, anchor, extra) {
    return "<text x='" + x + "' y='" + y + "' font-size='" + (size || 13) + "' fill='currentColor' text-anchor='" + (anchor || "middle") + "'" + (extra || "") + ">" + s + "</text>";
  }

  /* Bar chart (single or grouped). o: {title, labels, series:[{name, values, color}], max, step, ylabel, w, h, unit} */
  function barChart(o) {
    var w = o.w || 320, h = o.h || 240, L = 50, R = w - 10, T = o.series.length > 1 ? 40 : 30, B = h - 36;
    var s = svgOpen(w, h);
    if (o.title) s += txt(w / 2, 16, o.title, 13, "middle", " font-weight='bold'");
    var sc = function (v) { return B - (v / o.max) * (B - T); };
    for (var g = 0; g <= o.max + 1e-9; g += o.step) {
      var y = sc(g).toFixed(1);
      s += "<line x1='" + L + "' x2='" + R + "' y1='" + y + "' y2='" + y + "' stroke='currentColor' stroke-opacity='0.18'/>";
      s += txt(L - 6, +y + 4, g, 11, "end");
    }
    s += "<line x1='" + L + "' x2='" + L + "' y1='" + T + "' y2='" + B + "' stroke='currentColor'/>";
    s += "<line x1='" + L + "' x2='" + R + "' y1='" + B + "' y2='" + B + "' stroke='currentColor'/>";
    var n = o.labels.length, gw = (R - L) / n, k = o.series.length;
    var bw = Math.min(30, (gw * 0.72) / k);
    for (var i = 0; i < n; i++) {
      var cx = L + gw * (i + 0.5);
      for (var j = 0; j < k; j++) {
        var v = o.series[j].values[i];
        var x = cx - (bw * k) / 2 + j * bw, yy = sc(v);
        s += "<rect x='" + x.toFixed(1) + "' y='" + yy.toFixed(1) + "' width='" + (bw - 2).toFixed(1) + "' height='" + (B - yy).toFixed(1) + "' fill='" + (o.series[j].color || PAL[j]) + "'/>";
        s += txt((x + (bw - 2) / 2).toFixed(1), (yy - 4).toFixed(1), v + (o.unit || ""), 10);
      }
      s += txt(cx.toFixed(1), B + 15, o.labels[i], 11);
    }
    if (o.xlabel) s += txt((L + R) / 2, h - 4, o.xlabel, 11);
    if (o.ylabel) s += "<text x='12' y='" + ((T + B) / 2) + "' font-size='11' fill='currentColor' text-anchor='middle' transform='rotate(-90 12 " + ((T + B) / 2) + ")'>" + o.ylabel + "</text>";
    if (k > 1) {
      var lx = L + 4;
      for (var m = 0; m < k; m++) {
        s += "<rect x='" + lx + "' y='22' width='10' height='10' fill='" + (o.series[m].color || PAL[m]) + "'/>";
        s += txt(lx + 14, 31, o.series[m].name, 11, "start");
        lx += 24 + o.series[m].name.length * 6.5;
      }
    }
    return s + "</svg>";
  }

  /* Line chart. o: {title, labels, series:[{name, values, color}], min, max, step, ylabel, xlabel, unit} */
  function lineChart(o) {
    var w = o.w || 320, h = o.h || 240, L = 50, R = w - 16, T = o.series.length > 1 ? 42 : 30, B = h - 36;
    var s = svgOpen(w, h);
    if (o.title) s += txt(w / 2, 16, o.title, 13, "middle", " font-weight='bold'");
    var sc = function (v) { return B - ((v - o.min) / (o.max - o.min)) * (B - T); };
    for (var g = o.min; g <= o.max + 1e-9; g += o.step) {
      var y = sc(g).toFixed(1);
      s += "<line x1='" + L + "' x2='" + R + "' y1='" + y + "' y2='" + y + "' stroke='currentColor' stroke-opacity='0.18'/>";
      s += txt(L - 6, +y + 4, g, 11, "end");
    }
    s += "<line x1='" + L + "' x2='" + L + "' y1='" + T + "' y2='" + B + "' stroke='currentColor'/>";
    s += "<line x1='" + L + "' x2='" + R + "' y1='" + B + "' y2='" + B + "' stroke='currentColor'/>";
    var n = o.labels.length, gw = (R - L) / n;
    var X = function (i) { return L + gw * (i + 0.5); };
    for (var i = 0; i < n; i++) s += txt(X(i).toFixed(1), B + 15, o.labels[i], 11);
    for (var j = 0; j < o.series.length; j++) {
      var se = o.series[j], col = se.color || PAL[j], pts = [];
      for (var q = 0; q < n; q++) pts.push(X(q).toFixed(1) + "," + sc(se.values[q]).toFixed(1));
      s += "<polyline points='" + pts.join(" ") + "' fill='none' stroke='" + col + "' stroke-width='2'/>";
      for (var p = 0; p < n; p++) {
        var py = sc(se.values[p]);
        s += "<circle cx='" + X(p).toFixed(1) + "' cy='" + py.toFixed(1) + "' r='3.5' fill='" + col + "'/>";
        var off = (se.labelBelow ? 15 : -7);
        s += txt(X(p).toFixed(1), (py + off).toFixed(1), se.values[p] + (o.unit || ""), 10);
      }
    }
    if (o.xlabel) s += txt((L + R) / 2, h - 4, o.xlabel, 11);
    if (o.ylabel) s += "<text x='12' y='" + ((T + B) / 2) + "' font-size='11' fill='currentColor' text-anchor='middle' transform='rotate(-90 12 " + ((T + B) / 2) + ")'>" + o.ylabel + "</text>";
    if (o.series.length > 1) {
      var lx = L + 4;
      for (var m = 0; m < o.series.length; m++) {
        s += "<line x1='" + lx + "' x2='" + (lx + 14) + "' y1='27' y2='27' stroke='" + (o.series[m].color || PAL[m]) + "' stroke-width='3'/>";
        s += txt(lx + 18, 31, o.series[m].name, 11, "start");
        lx += 30 + o.series[m].name.length * 6.5;
      }
    }
    return s + "</svg>";
  }

  /* Circle graph with legend. o: {title, slices:[[label, percent]], total} */
  function pieChart(o) {
    var w = 340, h = 230, cx = 105, cy = 120, r = 88, a = 0;
    var s = svgOpen(w, h);
    if (o.title) s += txt(w / 2, 16, o.title, 13, "middle", " font-weight='bold'");
    for (var i = 0; i < o.slices.length; i++) {
      var p = o.slices[i][1], a0 = a, a1 = a + (p / 100) * 2 * Math.PI;
      a = a1;
      var x0 = (cx + r * Math.sin(a0)).toFixed(1), y0 = (cy - r * Math.cos(a0)).toFixed(1);
      var x1 = (cx + r * Math.sin(a1)).toFixed(1), y1 = (cy - r * Math.cos(a1)).toFixed(1);
      s += "<path d='M" + cx + "," + cy + " L" + x0 + "," + y0 + " A" + r + "," + r + " 0 " + (p > 50 ? 1 : 0) + " 1 " + x1 + "," + y1 + " Z' fill='" + PAL[i % PAL.length] + "' stroke='#fff' stroke-width='1.5'/>";
      var m = (a0 + a1) / 2;
      s += "<text x='" + (cx + r * 0.62 * Math.sin(m)).toFixed(1) + "' y='" + (cy - r * 0.62 * Math.cos(m) + 4).toFixed(1) + "' font-size='11' fill='#fff' text-anchor='middle'>" + p + "%</text>";
      s += "<rect x='215' y='" + (40 + i * 24) + "' width='12' height='12' fill='" + PAL[i % PAL.length] + "'/>";
      s += txt(233, 51 + i * 24, o.slices[i][0] + " (" + p + "%)", 12, "start");
    }
    if (o.total) s += txt(cx, h - 2, o.total, 11);
    return s + "</svg>";
  }

  /* ---------- geometry / misc figures ---------- */
  var FIG_TRI_ANGLES = svgOpen(300, 200) +
    "<polygon points='30,170 270,170 110,30' fill='none' stroke='currentColor' stroke-width='1.5'/>" +
    txt(58, 163, "50&deg;") + txt(110, 58, "60&deg;") + txt(240, 163, "<tspan font-style='italic'>x</tspan>&deg;") +
    "</svg>";

  var FIG_PARALLEL = svgOpen(300, 220) +
    "<line x1='20' y1='60' x2='290' y2='60' stroke='currentColor' stroke-width='1.5'/>" +
    "<line x1='20' y1='160' x2='290' y2='160' stroke='currentColor' stroke-width='1.5'/>" +
    "<line x1='100' y1='10' x2='220' y2='210' stroke='currentColor' stroke-width='1.5'/>" +
    txt(282, 52, "&#8467;<tspan dy='4' font-size='10'>1</tspan>", 13, "end") + txt(282, 152, "&#8467;<tspan dy='4' font-size='10'>2</tspan>", 13, "end") +
    txt(140, 82, "(3<tspan font-style='italic'>x</tspan> + 10)&deg;", 13, "start") +
    txt(196, 150, "(2<tspan font-style='italic'>x</tspan> + 20)&deg;", 13, "start") +
    "</svg>";

  var FIG_SQUARE_MID = svgOpen(280, 250) +
    "<polygon points='40,20 240,20 240,220 40,220' fill='none' stroke='currentColor' stroke-width='1.5'/>" +
    "<polygon points='40,220 140,20 240,120' fill='#5b7db1' fill-opacity='0.35' stroke='currentColor' stroke-width='1.5'/>" +
    txt(32, 16, "A", 13, "end") + txt(248, 16, "B", 13, "start") + txt(248, 236, "C", 13, "start") + txt(32, 236, "D", 13, "end") +
    txt(140, 14, "E") + txt(250, 124, "F", 13, "start") +
    "</svg>";

  var FIG_EXTERIOR = svgOpen(320, 190) +
    "<polygon points='40,160 230,160 90,40' fill='none' stroke='currentColor' stroke-width='1.5'/>" +
    "<line x1='230' y1='160' x2='305' y2='160' stroke='currentColor' stroke-width='1.5'/>" +
    txt(34, 176, "A") + txt(90, 32, "B") + txt(230, 178, "C") +
    txt(66, 153, "2<tspan font-style='italic'>y</tspan>&deg;") + txt(94, 70, "<tspan font-style='italic'>y</tspan>&deg;") +
    txt(258, 152, "120&deg;") +
    "</svg>";

  var FIG_BOXPLOT = (function () {
    var s = svgOpen(300, 110), X = function (v) { return 30 + (v - 10) * 6; };
    s += "<line x1='30' x2='270' y1='80' y2='80' stroke='currentColor'/>";
    for (var t = 10; t <= 50; t += 5) {
      s += "<line x1='" + X(t) + "' x2='" + X(t) + "' y1='76' y2='84' stroke='currentColor'/>" + txt(X(t), 99, t, 11);
    }
    s += "<line x1='" + X(12) + "' x2='" + X(20) + "' y1='40' y2='40' stroke='currentColor'/>";
    s += "<line x1='" + X(34) + "' x2='" + X(50) + "' y1='40' y2='40' stroke='currentColor'/>";
    s += "<line x1='" + X(12) + "' x2='" + X(12) + "' y1='30' y2='50' stroke='currentColor'/>";
    s += "<line x1='" + X(50) + "' x2='" + X(50) + "' y1='30' y2='50' stroke='currentColor'/>";
    s += "<rect x='" + X(20) + "' y='22' width='" + (X(34) - X(20)) + "' height='36' fill='#5b7db1' fill-opacity='0.3' stroke='currentColor'/>";
    s += "<line x1='" + X(26) + "' x2='" + X(26) + "' y1='22' y2='58' stroke='currentColor' stroke-width='2'/>";
    return s + "</svg>";
  })();

  /* ====================================================================== */
  /*                                BANK                                    */
  /* ====================================================================== */
  var Q = [];

  /* ------------------------------ ARITHMETIC ------------------------------ */
  Q.push(
    { id: "q-a01", type: "qc", topic: "arithmetic", difficulty: 1,
      quantityA: fr(3, 8) + " of 64", quantityB: fr(5, 12) + " of 60", answer: [1],
      explanation: "<p>Quantity A: 64 &divide; 8 = 8, and 3 &times; 8 = 24. Quantity B: 60 &divide; 12 = 5, and 5 &times; 5 = 25.</p><p>25 &gt; 24, so <b>Quantity B is greater</b>.</p>" },
    { id: "q-a02", type: "qc", topic: "arithmetic", difficulty: 1,
      quantityA: "(0.5)<sup>2</sup>", quantityB: "(0.5)<sup>3</sup>", answer: [0],
      explanation: "<p>(0.5)<sup>2</sup> = 0.25 and (0.5)<sup>3</sup> = 0.125. Raising a number between 0 and 1 to a higher power makes it smaller, so <b>Quantity A is greater</b>.</p>" },
    { id: "q-a03", type: "qc", topic: "arithmetic", difficulty: 1,
      info: "When the positive integer <i>n</i> is divided by 6, the remainder is 4.",
      quantityA: "The remainder when <i>n</i> is divided by 3", quantityB: "1", answer: [2],
      explanation: "<p>Write <i>n</i> = 6<i>k</i> + 4 = 3(2<i>k</i> + 1) + 1. So the remainder when <i>n</i> is divided by 3 is always 1 (check: 4, 10, 16 all leave remainder 1).</p><p>The quantities are <b>equal</b>.</p>" },
    { id: "q-a04", type: "qc", topic: "arithmetic", difficulty: 1,
      quantityA: "The number of distinct prime factors of 360", quantityB: "The number of distinct prime factors of 210", answer: [1],
      explanation: "<p>360 = 2<sup>3</sup> &times; 3<sup>2</sup> &times; 5, which has 3 distinct prime factors (2, 3, 5). 210 = 2 &times; 3 &times; 5 &times; 7, which has 4.</p><p>A larger number does not necessarily have more distinct prime factors. <b>Quantity B is greater</b>.</p>" },
    { id: "q-a05", type: "qc", topic: "arithmetic", difficulty: 2,
      info: "&minus;1 &lt; <i>x</i> &lt; 0",
      quantityA: "<i>x</i><sup>3</sup>", quantityB: "<i>x</i><sup>5</sup>", answer: [1],
      explanation: "<p>Both quantities are negative. <i>x</i><sup>5</sup> &minus; <i>x</i><sup>3</sup> = <i>x</i><sup>3</sup>(<i>x</i><sup>2</sup> &minus; 1). Here <i>x</i><sup>3</sup> &lt; 0 and <i>x</i><sup>2</sup> &minus; 1 &lt; 0, so the product is positive: <i>x</i><sup>5</sup> &gt; <i>x</i><sup>3</sup>.</p><p>Example: <i>x</i> = &minus;0.5 gives <i>x</i><sup>3</sup> = &minus;0.125 and <i>x</i><sup>5</sup> = &minus;0.03125. <b>Quantity B is greater</b>.</p>" },
    { id: "q-a06", type: "qc", topic: "arithmetic", difficulty: 3,
      info: "<i>p</i> and <i>q</i> are prime numbers.",
      quantityA: "<i>p</i> + <i>q</i>", quantityB: "<i>pq</i>", answer: [3],
      explanation: "<p><i>pq</i> &minus; (<i>p</i> + <i>q</i>) = (<i>p</i> &minus; 1)(<i>q</i> &minus; 1) &minus; 1. Since every prime is at least 2, (<i>p</i> &minus; 1)(<i>q</i> &minus; 1) &ge; 1.</p><p>If <i>p</i> = <i>q</i> = 2 (nothing says the primes are different), then <i>p</i> + <i>q</i> = 4 = <i>pq</i>: equal. If <i>p</i> = 2 and <i>q</i> = 3, then 5 &lt; 6: B is greater.</p><p>The relationship <b>cannot be determined</b>.</p>" },
    { id: "q-a07", type: "qc", topic: "arithmetic", difficulty: 1,
      quantityA: "40% of 70", quantityB: "70% of 30", answer: [0],
      explanation: "<p>40% of 70 = 0.4 &times; 70 = 28. 70% of 30 = 0.7 &times; 30 = 21.</p><p><b>Quantity A is greater</b>.</p>" },
    { id: "q-a08", type: "qc", topic: "arithmetic", difficulty: 2,
      quantityA: "3<sup>20</sup> + 3<sup>20</sup> + 3<sup>20</sup>", quantityB: "3<sup>21</sup>", answer: [2],
      explanation: "<p>3<sup>20</sup> + 3<sup>20</sup> + 3<sup>20</sup> = 3 &times; 3<sup>20</sup> = 3<sup>21</sup>.</p><p>The quantities are <b>equal</b>. (A common error is to add the exponents and get 3<sup>60</sup>.)</p>" },
    { id: "q-a09", type: "qc", topic: "arithmetic", difficulty: 3,
      info: "<i>x</i> and <i>y</i> are integers, <i>x</i> &gt; <i>y</i>, and <i>xy</i> &ne; 0.",
      quantityA: fr(1, "<i>x</i>"), quantityB: fr(1, "<i>y</i>"), answer: [3],
      explanation: "<p>If <i>x</i> = 2 and <i>y</i> = 1, then " + fr(1, 2) + " &lt; 1, so B is greater.</p><p>If <i>x</i> = 1 and <i>y</i> = &minus;1, then 1 &gt; &minus;1, so A is greater.</p><p>Taking reciprocals reverses an inequality only when both numbers have the same sign. The relationship <b>cannot be determined</b>.</p>" },
    { id: "q-a10", type: "qc", topic: "arithmetic", difficulty: 2,
      quantityA: "&radic;50 + &radic;18", quantityB: "&radic;68", answer: [0],
      explanation: "<p>&radic;50 = 5&radic;2 and &radic;18 = 3&radic;2, so Quantity A = 8&radic;2 = &radic;128.</p><p>Since 128 &gt; 68, &radic;128 &gt; &radic;68. (The trap is to add the radicands: 50 + 18 = 68.) <b>Quantity A is greater</b>.</p>" },
    { id: "q-a11", type: "qc", topic: "arithmetic", difficulty: 3,
      info: "<i>n</i> is a positive integer, and <i>n</i><sup>2</sup> is divisible by 72.",
      quantityA: "The least possible value of <i>n</i>", quantityB: "12", answer: [2],
      explanation: "<p>72 = 2<sup>3</sup> &times; 3<sup>2</sup>. Every prime in <i>n</i><sup>2</sup> appears an even number of times, so <i>n</i><sup>2</sup> must contain at least 2<sup>4</sup> &times; 3<sup>2</sup>. That means <i>n</i> must be a multiple of 2<sup>2</sup> &times; 3 = 12.</p><p>Check: 12<sup>2</sup> = 144 = 2 &times; 72. The least <i>n</i> is 12, so the quantities are <b>equal</b>.</p>" },
    { id: "q-a12", type: "qc", topic: "arithmetic", difficulty: 1,
      quantityA: fr(7, 9), quantityB: "0.78", answer: [1],
      explanation: "<p>" + fr(7, 9) + " = 0.777&hellip;, which is less than 0.780. <b>Quantity B is greater</b>.</p>" },

    { id: "q-a13", type: "mc-single", topic: "arithmetic", difficulty: 1,
      prompt: "A jacket regularly priced at $40 is on sale for 15% off. What is the sale price?",
      options: ["$25.00", "$34.00", "$36.00", "$38.50", "$46.00"], answer: [1],
      explanation: "<p>The discount is 0.15 &times; $40 = $6, so the sale price is $40 &minus; $6 = <b>$34.00</b>. Equivalently, 0.85 &times; 40 = 34.</p>" },
    { id: "q-a14", type: "mc-single", topic: "arithmetic", difficulty: 2,
      prompt: "The price of a stock rose 20% on Monday and then fell 20% on Tuesday. What was the net change in the price over the two days?",
      options: ["A 4% increase", "No change", "A 2% decrease", "A 4% decrease", "A 20% decrease"], answer: [3],
      explanation: "<p>Multiply the factors: 1.20 &times; 0.80 = 0.96. The final price is 96% of the original, which is <b>a 4% decrease</b>. The 20% decrease is applied to a larger base, so it outweighs the increase.</p>" },
    { id: "q-a15", type: "mc-single", topic: "arithmetic", difficulty: 2,
      prompt: "What is the remainder when 2<sup>50</sup> is divided by 7?",
      options: ["1", "2", "3", "4", "6"], answer: [3],
      explanation: "<p>The powers of 2 have remainders 2, 4, 1, 2, 4, 1, &hellip; when divided by 7 (because 2<sup>3</sup> = 8 = 7 + 1). The cycle has length 3.</p><p>50 = 3 &times; 16 + 2, so 2<sup>50</sup> has the same remainder as 2<sup>2</sup> = 4. The answer is <b>4</b>.</p>" },
    { id: "q-a16", type: "mc-single", topic: "arithmetic", difficulty: 1,
      prompt: "In a class of 40 students, the ratio of boys to girls is 3 to 5. How many girls are in the class?",
      options: ["15", "24", "25", "30", "35"], answer: [2],
      explanation: "<p>There are 3 + 5 = 8 parts, so each part is 40 &divide; 8 = 5 students. Girls: 5 &times; 5 = <b>25</b>.</p>" },
    { id: "q-a17", type: "mc-single", topic: "arithmetic", difficulty: 3,
      prompt: "How many positive integers less than 100 are divisible by neither 2 nor 3?",
      options: ["33", "32", "34", "50", "66"], answer: [0],
      explanation: "<p>Consider the 99 integers 1 to 99. Multiples of 2: 49. Multiples of 3: 33. Multiples of 6 (counted twice): 16.</p><p>Divisible by 2 or 3: 49 + 33 &minus; 16 = 66. Divisible by neither: 99 &minus; 66 = <b>33</b>.</p>" },
    { id: "q-a18", type: "mc-single", topic: "arithmetic", difficulty: 2,
      prompt: "What is the units digit of 7<sup>83</sup>?",
      options: ["1", "3", "5", "7", "9"], answer: [1],
      explanation: "<p>Units digits of powers of 7 repeat in a cycle of 4: 7, 9, 3, 1. 83 = 4 &times; 20 + 3, so the units digit matches 7<sup>3</sup>, which ends in <b>3</b>.</p>" },
    { id: "q-a19", type: "mc-single", topic: "arithmetic", difficulty: 3,
      prompt: "If <i>n</i> = 2<sup>4</sup> &times; 3<sup>3</sup> &times; 5, how many positive divisors of <i>n</i> are multiples of 6?",
      options: ["12", "24", "20", "30", "40"], answer: [1],
      explanation: "<p>A divisor has the form 2<sup><i>a</i></sup>3<sup><i>b</i></sup>5<sup><i>c</i></sup>. To be a multiple of 6, it needs <i>a</i> &ge; 1 and <i>b</i> &ge; 1.</p><p><i>a</i> &isin; {1, 2, 3, 4} gives 4 choices, <i>b</i> &isin; {1, 2, 3} gives 3, and <i>c</i> &isin; {0, 1} gives 2. Total: 4 &times; 3 &times; 2 = <b>24</b>. (40 is the total number of divisors.)</p>" },
    { id: "q-a20", type: "mc-single", topic: "arithmetic", difficulty: 1,
      prompt: "Which of the following is closest to 0.38?",
      options: [fr(2, 5), fr(4, 9), fr(1, 3), fr(3, 7), fr(3, 8)], answer: [4],
      explanation: "<p>Convert each: " + fr(2, 5) + " = 0.4, " + fr(4, 9) + " &asymp; 0.444, " + fr(1, 3) + " &asymp; 0.333, " + fr(3, 7) + " &asymp; 0.429, " + fr(3, 8) + " = 0.375.</p><p>0.375 is only 0.005 from 0.38, so the answer is <b>" + fr(3, 8) + "</b>.</p>" },
    { id: "q-a21", type: "mc-single", topic: "arithmetic", difficulty: 2,
      prompt: "What is the value of <span style='white-space:nowrap'>(" + fr(1, 2) + " + " + fr(1, 3) + ") &divide; (" + fr(1, 4) + " &minus; " + fr(1, 6) + ")</span>?",
      options: [fr(5, 72), "2", "5", "10", "12"], answer: [3],
      explanation: "<p>" + fr(1, 2) + " + " + fr(1, 3) + " = " + fr(5, 6) + " and " + fr(1, 4) + " &minus; " + fr(1, 6) + " = " + fr(3, 12) + " &minus; " + fr(2, 12) + " = " + fr(1, 12) + ".</p><p>" + fr(5, 6) + " &divide; " + fr(1, 12) + " = " + fr(5, 6) + " &times; 12 = <b>10</b>.</p>" },
    { id: "q-a22", type: "mc-single", topic: "arithmetic", difficulty: 3,
      prompt: "On a number line, point <i>P</i> is at &minus;" + fr(3, 4) + " and point <i>Q</i> is at " + fr(5, 6) + ". Point <i>R</i> lies between <i>P</i> and <i>Q</i> and is one-third of the way from <i>P</i> to <i>Q</i>. What is the coordinate of <i>R</i>?",
      options: [fr(19, 36), "&minus;" + fr(1, 12), "&minus;" + fr(2, 9), fr(1, 24), fr(1, 36)], answer: [2],
      explanation: "<p>The distance from <i>P</i> to <i>Q</i> is " + fr(5, 6) + " &minus; (&minus;" + fr(3, 4) + ") = " + fr(10, 12) + " + " + fr(9, 12) + " = " + fr(19, 12) + ". One-third of that is " + fr(19, 36) + ".</p><p><i>R</i> = &minus;" + fr(27, 36) + " + " + fr(19, 36) + " = &minus;" + fr(8, 36) + " = <b>&minus;" + fr(2, 9) + "</b>.</p>" },

    { id: "q-a23", type: "mc-multi", topic: "arithmetic", difficulty: 2,
      prompt: "Which of the following numbers are prime?<br>Indicate <u>all</u> such numbers.",
      options: ["51", "53", "57", "59", "61", "87", "91"], answer: [1, 3, 4],
      explanation: "<p>51 = 3 &times; 17, 57 = 3 &times; 19, 87 = 3 &times; 29, and 91 = 7 &times; 13 are composite.</p><p>53, 59, and 61 have no prime factor up to 7 (the largest prime whose square is under 64), so they are <b>prime</b>.</p>" },
    { id: "q-a24", type: "mc-multi", topic: "arithmetic", difficulty: 3,
      prompt: "If <i>n</i> is a positive integer and <i>n</i><sup>3</sup> is divisible by 24, which of the following must be divisors of <i>n</i>?<br>Indicate <u>all</u> such integers.",
      options: ["2", "3", "4", "6", "8", "12"], answer: [0, 1, 3],
      explanation: "<p>24 = 2<sup>3</sup> &times; 3. For <i>n</i><sup>3</sup> to contain 2<sup>3</sup>, <i>n</i> needs only one factor of 2. For <i>n</i><sup>3</sup> to contain a 3, <i>n</i> needs a factor of 3. So <i>n</i> must be a multiple of 6.</p><p><i>n</i> = 6 works (6<sup>3</sup> = 216 = 24 &times; 9), and 4, 8, and 12 do not divide 6. The divisors that must hold are <b>2, 3, and 6</b>.</p>" },
    { id: "q-a25", type: "mc-multi", topic: "arithmetic", difficulty: 1,
      prompt: "Which of the following fractions are greater than " + fr(2, 3) + "?<br>Indicate <u>all</u> such fractions.",
      options: [fr(5, 8), fr(7, 10), fr(11, 16), fr(3, 5), fr(9, 13), fr(13, 20)], answer: [1, 2, 4],
      explanation: "<p>" + fr(2, 3) + " &asymp; 0.667. Decimals: " + fr(5, 8) + " = 0.625, " + fr(7, 10) + " = 0.7, " + fr(11, 16) + " = 0.6875, " + fr(3, 5) + " = 0.6, " + fr(9, 13) + " &asymp; 0.692, " + fr(13, 20) + " = 0.65.</p><p>The fractions greater than " + fr(2, 3) + " are <b>" + fr(7, 10) + ", " + fr(11, 16) + ", and " + fr(9, 13) + "</b>.</p>" },

    { id: "q-a26", type: "numeric", topic: "arithmetic", difficulty: 1,
      prompt: "12 is what percent of 48?", answer: 25, after: "%",
      explanation: "<p>12 &divide; 48 = 0.25 = <b>25%</b>.</p>" },
    { id: "q-a27", type: "numeric", topic: "arithmetic", difficulty: 2,
      prompt: "An investment of $2,000 earns 5% interest per year, compounded annually. How much interest, in dollars, does it earn over 3 years? Round to the nearest dollar.",
      answer: 315, before: "$",
      explanation: "<p>The value after 3 years is 2,000 &times; 1.05<sup>3</sup> = 2,000 &times; 1.157625 = 2,315.25.</p><p>Interest = 2,315.25 &minus; 2,000 = 315.25, or <b>$315</b>. (Simple interest would give $300.)</p>" },
    { id: "q-a28", type: "numeric", topic: "arithmetic", difficulty: 3,
      prompt: "How many integers from 1 to 1,000, inclusive, are multiples of 6 or multiples of 15 but are <u>not</u> multiples of 30?",
      answer: 166,
      explanation: "<p>Multiples of 6: &lfloor;1000/6&rfloor; = 166. Multiples of 15: 66. Multiples of both, which are multiples of 30: 33.</p><p>Multiples of 6 or 15: 166 + 66 &minus; 33 = 199. Every multiple of 30 is in this group, so remove all 33 of them: 199 &minus; 33 = <b>166</b>.</p>" },

    { id: "q-a29", type: "fraction", topic: "arithmetic", difficulty: 2,
      prompt: "What fraction of the positive divisors of 36 are even?", answer: [2, 3],
      explanation: "<p>The divisors of 36 are 1, 2, 3, 4, 6, 9, 12, 18, 36. That is 9 divisors, and 6 of them are even (2, 4, 6, 12, 18, 36).</p><p>" + fr(6, 9) + " = <b>" + fr(2, 3) + "</b>.</p>" },
    { id: "q-a30", type: "fraction", topic: "arithmetic", difficulty: 3,
      prompt: "What is the value of " + fr(1, "1&times;2") + " + " + fr(1, "2&times;3") + " + " + fr(1, "3&times;4") + " + &hellip; + " + fr(1, "9&times;10") + "?", answer: [9, 10],
      explanation: "<p>Each term splits as " + fr(1, "<i>k</i>(<i>k</i>+1)") + " = " + fr(1, "<i>k</i>") + " &minus; " + fr(1, "<i>k</i>+1") + ". The sum telescopes:</p><p>(1 &minus; " + fr(1, 2) + ") + (" + fr(1, 2) + " &minus; " + fr(1, 3) + ") + &hellip; + (" + fr(1, 9) + " &minus; " + fr(1, 10) + ") = 1 &minus; " + fr(1, 10) + " = <b>" + fr(9, 10) + "</b>.</p>" }
  );

  /* ------------------------------- ALGEBRA ------------------------------- */
  Q.push(
    { id: "q-b01", type: "qc", topic: "algebra", difficulty: 1,
      info: "3<i>x</i> + 7 = 22", quantityA: "<i>x</i>", quantityB: "5", answer: [2],
      explanation: "<p>3<i>x</i> = 15, so <i>x</i> = 5. The quantities are <b>equal</b>.</p>" },
    { id: "q-b02", type: "qc", topic: "algebra", difficulty: 2,
      info: "<i>x</i><sup>2</sup> = 9", quantityA: "<i>x</i>", quantityB: "3", answer: [3],
      explanation: "<p><i>x</i> can be 3 or &minus;3. If <i>x</i> = 3 the quantities are equal; if <i>x</i> = &minus;3, B is greater. The relationship <b>cannot be determined</b>.</p>" },
    { id: "q-b03", type: "qc", topic: "algebra", difficulty: 2,
      info: "<i>y</i> = 2<i>x</i> &minus; 5 and <i>x</i> &gt; 3", quantityA: "<i>y</i>", quantityB: "1", answer: [0],
      explanation: "<p>If <i>x</i> &gt; 3, then 2<i>x</i> &gt; 6 and 2<i>x</i> &minus; 5 &gt; 1. So <i>y</i> &gt; 1 and <b>Quantity A is greater</b>.</p>" },
    { id: "q-b04", type: "qc", topic: "algebra", difficulty: 3,
      info: "|<i>x</i> &minus; 2| &lt; 3", quantityA: "<i>x</i><sup>2</sup>", quantityB: "25", answer: [1],
      explanation: "<p>|<i>x</i> &minus; 2| &lt; 3 means &minus;1 &lt; <i>x</i> &lt; 5. On this interval <i>x</i><sup>2</sup> is at most just under 25 (near <i>x</i> = 5); near <i>x</i> = &minus;1 it is under 1.</p><p>So <i>x</i><sup>2</sup> &lt; 25 always, and <b>Quantity B is greater</b>.</p>" },
    { id: "q-b05", type: "qc", topic: "algebra", difficulty: 3,
      info: "<i>a</i> and <i>b</i> are nonzero, and " + fr("<i>a</i>", "<i>b</i>") + " &gt; 1.", quantityA: "<i>a</i>", quantityB: "<i>b</i>", answer: [3],
      explanation: "<p>If <i>a</i> = 4 and <i>b</i> = 2, then " + fr("<i>a</i>", "<i>b</i>") + " = 2 &gt; 1 and A is greater.</p><p>If <i>a</i> = &minus;4 and <i>b</i> = &minus;2, then " + fr("<i>a</i>", "<i>b</i>") + " = 2 &gt; 1, but now B is greater. Multiplying both sides by <i>b</i> flips the inequality when <i>b</i> &lt; 0. The relationship <b>cannot be determined</b>.</p>" },
    { id: "q-b06", type: "qc", topic: "algebra", difficulty: 2,
      quantityA: "(<i>x</i> + 3)<sup>2</sup>", quantityB: "<i>x</i><sup>2</sup> + 9", answer: [3],
      explanation: "<p>(<i>x</i> + 3)<sup>2</sup> = <i>x</i><sup>2</sup> + 6<i>x</i> + 9. Subtracting <i>x</i><sup>2</sup> + 9 from both quantities leaves A: 6<i>x</i> and B: 0.</p><p>That depends on the sign of <i>x</i>, which is not given. The relationship <b>cannot be determined</b>.</p>" },
    { id: "q-b07", type: "qc", topic: "algebra", difficulty: 1,
      info: "<i>f</i>(<i>x</i>) = <i>x</i><sup>2</sup> &minus; 4<i>x</i>", quantityA: "<i>f</i>(5)", quantityB: "<i>f</i>(&minus;1)", answer: [2],
      explanation: "<p><i>f</i>(5) = 25 &minus; 20 = 5. <i>f</i>(&minus;1) = 1 + 4 = 5. The quantities are <b>equal</b>; both inputs are 3 units from the parabola's axis <i>x</i> = 2.</p>" },
    { id: "q-b08", type: "qc", topic: "algebra", difficulty: 3,
      info: "<i>x</i> &gt; 0 and <i>y</i> &lt; 0", quantityA: "<i>x</i> &minus; <i>y</i>", quantityB: "|<i>x</i> + <i>y</i>|", answer: [0],
      explanation: "<p>Since <i>x</i> &gt; 0 and <i>y</i> &lt; 0, <i>x</i> &minus; <i>y</i> = |<i>x</i>| + |<i>y</i>|.</p><p><i>x</i> and <i>y</i> have opposite signs, so they partly cancel in <i>x</i> + <i>y</i>: |<i>x</i> + <i>y</i>| &lt; |<i>x</i>| + |<i>y</i>|. For example, <i>x</i> = 3 and <i>y</i> = &minus;3 give 6 vs. 0. <b>Quantity A is greater</b>.</p>" },
    { id: "q-b09", type: "qc", topic: "algebra", difficulty: 2,
      info: "Line <i>k</i> passes through the points (0, 3) and (4, 0) in the <i>xy</i>-plane.", quantityA: "The slope of line <i>k</i>", quantityB: "&minus;" + fr(1, 2), answer: [1],
      explanation: "<p>Slope = " + fr("0 &minus; 3", "4 &minus; 0") + " = &minus;" + fr(3, 4) + " = &minus;0.75, which is less than &minus;0.5. <b>Quantity B is greater</b>.</p>" },
    { id: "q-b10", type: "qc", topic: "algebra", difficulty: 1,
      info: "<i>x</i> + <i>y</i> = 10 and <i>x</i> &minus; <i>y</i> = 4", quantityA: "<i>x</i>", quantityB: "2<i>y</i>", answer: [0],
      explanation: "<p>Adding the equations gives 2<i>x</i> = 14, so <i>x</i> = 7 and <i>y</i> = 3. Then 2<i>y</i> = 6 &lt; 7, so <b>Quantity A is greater</b>.</p>" },
    { id: "q-b11", type: "qc", topic: "algebra", difficulty: 3,
      info: "In an arithmetic sequence, the 3rd term is 11 and the 7th term is 27.", quantityA: "The 10th term", quantityB: "38", answer: [0],
      explanation: "<p>From the 3rd to the 7th term there are 4 common differences: 4<i>d</i> = 27 &minus; 11 = 16, so <i>d</i> = 4.</p><p>10th term = 27 + 3 &times; 4 = 39 &gt; 38. <b>Quantity A is greater</b>.</p>" },

    { id: "q-b12", type: "mc-single", topic: "algebra", difficulty: 1,
      prompt: "If 5(<i>x</i> &minus; 2) = 3<i>x</i> + 4, what is the value of <i>x</i>?",
      options: ["3", "5", "7", "9", "14"], answer: [2],
      explanation: "<p>5<i>x</i> &minus; 10 = 3<i>x</i> + 4, so 2<i>x</i> = 14 and <i>x</i> = <b>7</b>.</p>" },
    { id: "q-b13", type: "mc-single", topic: "algebra", difficulty: 2,
      prompt: "If <i>r</i> and <i>s</i> are the two solutions of <i>x</i><sup>2</sup> &minus; 5<i>x</i> &minus; 14 = 0, what is the value of <i>r</i><sup>2</sup> + <i>s</i><sup>2</sup>?",
      options: ["45", "53", "25", "81", "39"], answer: [1],
      explanation: "<p>The equation factors as (<i>x</i> &minus; 7)(<i>x</i> + 2) = 0, so the roots are 7 and &minus;2. 49 + 4 = <b>53</b>.</p><p>Alternatively, <i>r</i><sup>2</sup> + <i>s</i><sup>2</sup> = (<i>r</i> + <i>s</i>)<sup>2</sup> &minus; 2<i>rs</i> = 25 &minus; 2(&minus;14) = 53.</p>" },
    { id: "q-b14", type: "mc-single", topic: "algebra", difficulty: 2,
      prompt: "If <i>f</i>(<i>x</i>) = 3<i>x</i><sup>2</sup> &minus; 2 and <i>g</i>(<i>x</i>) = <i>x</i> + 1, what is the value of <i>f</i>(<i>g</i>(2))?",
      options: ["13", "37", "11", "49", "25"], answer: [4],
      explanation: "<p><i>g</i>(2) = 3, and <i>f</i>(3) = 3(9) &minus; 2 = <b>25</b>. (Applying the functions in the wrong order gives <i>g</i>(<i>f</i>(2)) = 11.)</p>" },
    { id: "q-b15", type: "mc-single", topic: "algebra", difficulty: 1,
      prompt: "A line in the <i>xy</i>-plane passes through (1, 2) and (3, 8). What is its <i>y</i>-intercept?",
      options: ["&minus;1", "1", "2", "3", "&minus;3"], answer: [0],
      explanation: "<p>Slope = " + fr("8 &minus; 2", "3 &minus; 1") + " = 3. Using (1, 2): 2 = 3(1) + <i>b</i>, so <i>b</i> = <b>&minus;1</b>.</p>" },
    { id: "q-b16", type: "mc-single", topic: "algebra", difficulty: 3,
      prompt: "If <i>x</i><sup>2</sup> &minus; <i>y</i><sup>2</sup> = 48 and <i>x</i> + <i>y</i> = 12, what is the value of <i>xy</i>?",
      options: ["8", "16", "20", "32", "48"], answer: [3],
      explanation: "<p><i>x</i><sup>2</sup> &minus; <i>y</i><sup>2</sup> = (<i>x</i> + <i>y</i>)(<i>x</i> &minus; <i>y</i>), so 12(<i>x</i> &minus; <i>y</i>) = 48 and <i>x</i> &minus; <i>y</i> = 4.</p><p>With <i>x</i> + <i>y</i> = 12, this gives <i>x</i> = 8 and <i>y</i> = 4, so <i>xy</i> = <b>32</b>.</p>" },
    { id: "q-b17", type: "mc-single", topic: "algebra", difficulty: 2,
      prompt: "Maria is now 4 times as old as her son. In 20 years, she will be twice as old as her son. How old is her son now?",
      options: ["12", "10", "5", "15", "8"], answer: [1],
      explanation: "<p>Let the son be <i>s</i>. Then 4<i>s</i> + 20 = 2(<i>s</i> + 20), so 4<i>s</i> + 20 = 2<i>s</i> + 40 and 2<i>s</i> = 20, giving <i>s</i> = <b>10</b>. (Check: 40 and 10 now; 60 and 30 in 20 years.)</p>" },
    { id: "q-b18", type: "mc-single", topic: "algebra", difficulty: 3,
      prompt: "How many integers <i>x</i> satisfy |2<i>x</i> &minus; 3| &le; 7?",
      options: ["9", "7", "10", "6", "8"], answer: [4],
      explanation: "<p>&minus;7 &le; 2<i>x</i> &minus; 3 &le; 7 gives &minus;4 &le; 2<i>x</i> &le; 10, so &minus;2 &le; <i>x</i> &le; 5.</p><p>The integers are &minus;2, &minus;1, 0, 1, 2, 3, 4, 5, a total of <b>8</b>. (Counting 5 &minus; (&minus;2) = 7 forgets an endpoint.)</p>" },
    { id: "q-b19", type: "mc-single", topic: "algebra", difficulty: 3,
      prompt: "An inlet pipe can fill an empty tank in 4 hours, and a drain can empty the full tank in 6 hours. If the tank is empty and both the pipe and the drain are open, how many hours will it take to fill the tank?",
      options: ["2.4", "5", "10", "12", "24"], answer: [3],
      explanation: "<p>Net rate = " + fr(1, 4) + " &minus; " + fr(1, 6) + " = " + fr(3, 12) + " &minus; " + fr(2, 12) + " = " + fr(1, 12) + " tank per hour, so it takes <b>12</b> hours. (2.4 hours is what you get if you add the rates by mistake.)</p>" },
    { id: "q-b20", type: "mc-single", topic: "algebra", difficulty: 1,
      prompt: "If 2<sup><i>x</i> + 3</sup> = 4<sup><i>x</i> &minus; 1</sup>, what is the value of <i>x</i>?",
      options: ["5", "2", "7", "1", "4"], answer: [0],
      explanation: "<p>4<sup><i>x</i> &minus; 1</sup> = 2<sup>2(<i>x</i> &minus; 1)</sup> = 2<sup>2<i>x</i> &minus; 2</sup>. Setting the exponents equal: <i>x</i> + 3 = 2<i>x</i> &minus; 2, so <i>x</i> = <b>5</b>.</p>" },
    { id: "q-b21", type: "mc-single", topic: "algebra", difficulty: 3,
      prompt: "In a sequence, <i>a</i><sub>1</sub> = 2, and <i>a</i><sub><i>n</i></sub> = 3<i>a</i><sub><i>n</i>&minus;1</sub> &minus; 1 for every integer <i>n</i> &gt; 1. What is the value of <i>a</i><sub>5</sub>?",
      options: ["41", "122", "121", "365", "124"], answer: [1],
      explanation: "<p><i>a</i><sub>2</sub> = 3(2) &minus; 1 = 5, <i>a</i><sub>3</sub> = 14, <i>a</i><sub>4</sub> = 41, <i>a</i><sub>5</sub> = 3(41) &minus; 1 = <b>122</b>.</p>" },

    { id: "q-b22", type: "mc-multi", topic: "algebra", difficulty: 2,
      prompt: "Which of the following values of <i>x</i> satisfy <i>x</i><sup>2</sup> &minus; 3<i>x</i> &minus; 10 &lt; 0?<br>Indicate <u>all</u> such values.",
      options: ["&minus;3", "&minus;2", "&minus;1", "0", "3", "5", "6"], answer: [2, 3, 4],
      explanation: "<p><i>x</i><sup>2</sup> &minus; 3<i>x</i> &minus; 10 = (<i>x</i> &minus; 5)(<i>x</i> + 2), which is negative strictly between the roots: &minus;2 &lt; <i>x</i> &lt; 5.</p><p>The values that work are <b>&minus;1, 0, and 3</b>. At the endpoints &minus;2 and 5 the expression equals 0, which is not less than 0.</p>" },
    { id: "q-b23", type: "mc-multi", topic: "algebra", difficulty: 3,
      prompt: "If " + fr("<i>x</i>", "<i>y</i>") + " &lt; 0 and <i>x</i> &gt; <i>y</i>, which of the following statements must be true?<br>Indicate <u>all</u> such statements.",
      options: ["<i>x</i> &gt; 0", "<i>x</i> + <i>y</i> &gt; 0", "<i>xy</i> &lt; 0", "<i>x</i><sup>2</sup> &gt; <i>y</i><sup>2</sup>", "<i>x</i> &minus; <i>y</i> &gt; <i>x</i>"], answer: [0, 2, 4],
      explanation: "<p>" + fr("<i>x</i>", "<i>y</i>") + " &lt; 0 means <i>x</i> and <i>y</i> have opposite signs. Since <i>x</i> &gt; <i>y</i>, it follows that <i>x</i> &gt; 0 &gt; <i>y</i>.</p><ul><li><i>x</i> &gt; 0: true.</li><li><i>x</i> + <i>y</i> &gt; 0: not necessarily (<i>x</i> = 1, <i>y</i> = &minus;5).</li><li><i>xy</i> &lt; 0: true, because the signs are opposite.</li><li><i>x</i><sup>2</sup> &gt; <i>y</i><sup>2</sup>: not necessarily (same counterexample).</li><li><i>x</i> &minus; <i>y</i> &gt; <i>x</i> is the same as &minus;<i>y</i> &gt; 0, which is true.</li></ul>" },
    { id: "q-b24", type: "mc-multi", topic: "algebra", difficulty: 3,
      prompt: "For which of the following values of <i>k</i> does the equation <i>x</i><sup>2</sup> + <i>kx</i> + 9 = 0 have at least one real solution?<br>Indicate <u>all</u> such values.",
      options: ["&minus;10", "&minus;6", "&minus;3", "0", "4", "6", "7"], answer: [0, 1, 5, 6],
      explanation: "<p>A real solution exists when the discriminant is non-negative: <i>k</i><sup>2</sup> &minus; 36 &ge; 0, that is, |<i>k</i>| &ge; 6.</p><p>The values that work are <b>&minus;10, &minus;6, 6, and 7</b>. When <i>k</i> = &plusmn;6 there is exactly one (repeated) solution, which still counts.</p>" },
    { id: "q-b25", type: "mc-multi", topic: "algebra", difficulty: 1,
      prompt: "Which of the following points lie on the line <i>y</i> = &minus;2<i>x</i> + 3?<br>Indicate <u>all</u> such points.",
      options: ["(0, 3)", "(&minus;1, 1)", "(2, &minus;1)", "(3, &minus;2)", "(&minus;2, 7)"], answer: [0, 2, 4],
      explanation: "<p>Substitute each <i>x</i>: <i>x</i> = 0 gives 3 &#10003;; <i>x</i> = &minus;1 gives 5 (not 1); <i>x</i> = 2 gives &minus;1 &#10003;; <i>x</i> = 3 gives &minus;3 (not &minus;2); <i>x</i> = &minus;2 gives 7 &#10003;.</p><p>The points on the line are <b>(0, 3), (2, &minus;1), and (&minus;2, 7)</b>.</p>" },

    { id: "q-b26", type: "numeric", topic: "algebra", difficulty: 1,
      prompt: "If <i>f</i>(<i>x</i>) = 2<i>x</i><sup>2</sup> &minus; 3<i>x</i> + 1, what is the value of <i>f</i>(&minus;2)?", answer: 15,
      explanation: "<p><i>f</i>(&minus;2) = 2(4) &minus; 3(&minus;2) + 1 = 8 + 6 + 1 = <b>15</b>.</p>" },
    { id: "q-b27", type: "numeric", topic: "algebra", difficulty: 2,
      prompt: "What is the distance between the points (&minus;3, 4) and (5, &minus;2) in the <i>xy</i>-plane?", answer: 10,
      explanation: "<p>&radic;((5 &minus; (&minus;3))<sup>2</sup> + (&minus;2 &minus; 4)<sup>2</sup>) = &radic;(64 + 36) = &radic;100 = <b>10</b>.</p>" },
    { id: "q-b28", type: "numeric", topic: "algebra", difficulty: 3,
      prompt: "What is the sum of all distinct real solutions of the equation |<i>x</i><sup>2</sup> &minus; 4<i>x</i>| = 4?", answer: 6,
      explanation: "<p>Case 1: <i>x</i><sup>2</sup> &minus; 4<i>x</i> = 4, so <i>x</i><sup>2</sup> &minus; 4<i>x</i> &minus; 4 = 0, which has two real roots (2 &plusmn; 2&radic;2) with sum 4.</p><p>Case 2: <i>x</i><sup>2</sup> &minus; 4<i>x</i> = &minus;4, so (<i>x</i> &minus; 2)<sup>2</sup> = 0 and <i>x</i> = 2 (counted once).</p><p>Sum of distinct solutions: 4 + 2 = <b>6</b>.</p>" },

    { id: "q-b29", type: "fraction", topic: "algebra", difficulty: 1,
      prompt: "What is the slope of the line that passes through the points (2, 5) and (10, 8)?", answer: [3, 8],
      explanation: "<p>Slope = " + fr("8 &minus; 5", "10 &minus; 2") + " = <b>" + fr(3, 8) + "</b>.</p>" },
    { id: "q-b30", type: "fraction", topic: "algebra", difficulty: 2,
      prompt: "If " + fr("<i>a</i>", "<i>b</i>") + " = " + fr(3, 4) + " and " + fr("<i>b</i>", "<i>c</i>") + " = " + fr(2, 5) + ", what is the value of " + fr("<i>a</i> + <i>b</i>", "<i>b</i> + <i>c</i>") + "?", answer: [1, 2],
      explanation: "<p>Choose <i>b</i> = 4. Then <i>a</i> = 3 and <i>c</i> = " + fr(5, 2) + "(4) = 10.</p><p>" + fr("3 + 4", "4 + 10") + " = " + fr(7, 14) + " = <b>" + fr(1, 2) + "</b>.</p>" }
  );

  /* ------------------------------- GEOMETRY ------------------------------- */
  Q.push(
    { id: "q-g01", type: "qc", topic: "geometry", difficulty: 1, figure: FIG_TRI_ANGLES,
      info: "Note: Figure not drawn to scale.", quantityA: "<i>x</i>", quantityB: "70", answer: [2],
      explanation: "<p>The angles of a triangle sum to 180&deg;: <i>x</i> = 180 &minus; 50 &minus; 60 = 70. The quantities are <b>equal</b>.</p>" },
    { id: "q-g02", type: "qc", topic: "geometry", difficulty: 1,
      quantityA: "The area of a circle with radius 3", quantityB: "The area of a square with side length 5", answer: [0],
      explanation: "<p>Circle: &pi;(3)<sup>2</sup> = 9&pi; &asymp; 28.3. Square: 5<sup>2</sup> = 25. <b>Quantity A is greater</b>.</p>" },
    { id: "q-g03", type: "qc", topic: "geometry", difficulty: 2,
      info: "In triangle <i>ABC</i>, <i>AB</i> = 5 and <i>BC</i> = 8.", quantityA: "<i>AC</i>", quantityB: "13", answer: [1],
      explanation: "<p>By the triangle inequality, <i>AC</i> &lt; <i>AB</i> + <i>BC</i> = 13 (and <i>AC</i> &gt; 3). <i>AC</i> can never equal 13, so <b>Quantity B is greater</b>.</p>" },
    { id: "q-g04", type: "qc", topic: "geometry", difficulty: 3,
      info: "Two sides of a triangle have lengths 6 and 8.", quantityA: "The area of the triangle", quantityB: "24", answer: [3],
      explanation: "<p>Area = " + fr(1, 2) + "(6)(8) sin&thinsp;<i>C</i> = 24 sin&thinsp;<i>C</i>, where <i>C</i> is the angle between those sides.</p><p>If the angle is 90&deg;, the area is exactly 24. Otherwise it is less than 24. Because the angle is not given, the relationship <b>cannot be determined</b>.</p>" },
    { id: "q-g05", type: "qc", topic: "geometry", difficulty: 2,
      info: "A right triangle has angles of 30&deg;, 60&deg;, and 90&deg;, and its hypotenuse has length 10.", quantityA: "The length of the longer leg", quantityB: "8.5", answer: [0],
      explanation: "<p>In a 30-60-90 triangle the sides are in the ratio 1 : &radic;3 : 2. With hypotenuse 10, the shorter leg is 5 and the longer leg is 5&radic;3 &asymp; 8.66.</p><p>8.66 &gt; 8.5, so <b>Quantity A is greater</b>.</p>" },
    { id: "q-g06", type: "qc", topic: "geometry", difficulty: 3,
      info: "Rectangle <i>R</i> has perimeter 20.", quantityA: "The area of <i>R</i>", quantityB: "25", answer: [3],
      explanation: "<p>If the sides are <i>L</i> and <i>W</i>, then <i>L</i> + <i>W</i> = 10, and the area <i>LW</i> is at most 25. That maximum occurs when <i>L</i> = <i>W</i> = 5.</p><p>A square is a rectangle, so the area can equal 25. It can also be smaller, for example 9 &times; 1 = 9. The relationship <b>cannot be determined</b>.</p>" },
    { id: "q-g07", type: "qc", topic: "geometry", difficulty: 2,
      quantityA: "The measure of each interior angle of a regular hexagon", quantityB: "The measure of each exterior angle of an equilateral triangle", answer: [2],
      explanation: "<p>A regular hexagon's interior angle is (6 &minus; 2)(180&deg;)/6 = 120&deg;. An equilateral triangle's exterior angle is 180&deg; &minus; 60&deg; = 120&deg;. The quantities are <b>equal</b>.</p>" },
    { id: "q-g08", type: "qc", topic: "geometry", difficulty: 2,
      quantityA: "The circumference of a circle with diameter 7", quantityB: "22", answer: [1],
      explanation: "<p>Circumference = 7&pi; &asymp; 7(3.14159) &asymp; 21.99. The approximation &pi; &asymp; " + fr(22, 7) + " is slightly too large, so 7&pi; is just under 22. <b>Quantity B is greater</b>.</p>" },
    { id: "q-g09", type: "qc", topic: "geometry", difficulty: 1,
      quantityA: "The volume of a right circular cylinder with radius 3 and height 4", quantityB: "The volume of a right circular cylinder with radius 4 and height 3", answer: [1],
      explanation: "<p>V = &pi;<i>r</i><sup>2</sup><i>h</i>. A: &pi;(9)(4) = 36&pi;. B: &pi;(16)(3) = 48&pi;. The radius is squared, so it has more effect. <b>Quantity B is greater</b>.</p>" },
    { id: "q-g10", type: "qc", topic: "geometry", difficulty: 3,
      info: "In the <i>xy</i>-plane, <i>A</i> = (0, 0), <i>B</i> = (6, 0), and point <i>C</i> lies on the line <i>y</i> = &minus;4.", quantityA: "The area of triangle <i>ABC</i>", quantityB: "12", answer: [2],
      explanation: "<p>Use <i>AB</i> as the base: its length is 6, and it lies on the <i>x</i>-axis. Wherever <i>C</i> is on <i>y</i> = &minus;4, its distance from the <i>x</i>-axis (the height) is 4.</p><p>Area = " + fr(1, 2) + "(6)(4) = 12 for every such <i>C</i>. The quantities are <b>equal</b>.</p>" },
    { id: "q-g11", type: "qc", topic: "geometry", difficulty: 3,
      info: "A circle is inscribed in a square with side length 10.", quantityA: "The area of the region inside the square but outside the circle", quantityB: "21.5", answer: [1],
      explanation: "<p>The circle's radius is 5, so the region's area is 100 &minus; 25&pi; &asymp; 100 &minus; 78.54 = 21.46.</p><p>21.46 &lt; 21.5. (Using &pi; &asymp; 3.14 gives 21.5 exactly, which would wrongly suggest the quantities are equal.) <b>Quantity B is greater</b>.</p>" },

    { id: "q-g12", type: "mc-single", topic: "geometry", difficulty: 1,
      prompt: "A rectangle has length 12 and width 5. What is the length of its diagonal?",
      options: ["17", "7", "13", "60", "15"], answer: [2],
      explanation: "<p>&radic;(12<sup>2</sup> + 5<sup>2</sup>) = &radic;169 = <b>13</b> (a 5-12-13 right triangle).</p>" },
    { id: "q-g13", type: "mc-single", topic: "geometry", difficulty: 2, figure: FIG_PARALLEL,
      prompt: "In the figure, line &#8467;<sub>1</sub> is parallel to line &#8467;<sub>2</sub>. What is the value of <i>x</i>?<br><small>Note: Figure not drawn to scale.</small>",
      options: ["20", "30", "34", "40", "50"], answer: [1],
      explanation: "<p>The two marked angles are same-side interior angles between parallel lines, so they are supplementary: (3<i>x</i> + 10) + (2<i>x</i> + 20) = 180.</p><p>5<i>x</i> = 150, so <i>x</i> = <b>30</b>. (Setting them equal gives 10, which is not an option.)</p>" },
    { id: "q-g14", type: "mc-single", topic: "geometry", difficulty: 1,
      prompt: "The area of a circle is 49&pi;. What is its circumference?",
      options: ["28&pi;", "7&pi;", "49&pi;", "14&pi;", "98&pi;"], answer: [3],
      explanation: "<p>&pi;<i>r</i><sup>2</sup> = 49&pi;, so <i>r</i> = 7. Circumference = 2&pi;(7) = <b>14&pi;</b>.</p>" },
    { id: "q-g15", type: "mc-single", topic: "geometry", difficulty: 2,
      prompt: "An isosceles right triangle has a hypotenuse of length 8. What is the area of the triangle?",
      options: ["32", "16&radic;2", "8", "64", "16"], answer: [4],
      explanation: "<p>Each leg is " + fr(8, "&radic;2") + " = 4&radic;2. Area = " + fr(1, 2) + "(4&radic;2)<sup>2</sup> = " + fr(1, 2) + "(32) = <b>16</b>.</p>" },
    { id: "q-g16", type: "mc-single", topic: "geometry", difficulty: 3,
      prompt: "Points <i>A</i> and <i>B</i> lie on a circle with center <i>O</i> and radius 6, and angle <i>AOB</i> measures 120&deg;. What is the area of the region bounded by chord <i>AB</i> and the minor arc <i>AB</i>?",
      options: ["12&pi; &minus; 18&radic;3", "6&pi; &minus; 9&radic;3", "36&pi; &minus; 9&radic;3", "12&pi; &minus; 9&radic;3", "12&pi; &minus; 9"], answer: [3],
      explanation: "<p>Sector area = " + fr(120, 360) + " &times; 36&pi; = 12&pi;.</p><p>Triangle <i>AOB</i> area = " + fr(1, 2) + "(6)(6) sin 120&deg; = 18 &times; " + fr("&radic;3", 2) + " = 9&radic;3. (Equivalently: the altitude from <i>O</i> is 3 and <i>AB</i> = 6&radic;3.)</p><p>Segment area = <b>12&pi; &minus; 9&radic;3</b>.</p>" },
    { id: "q-g17", type: "mc-single", topic: "geometry", difficulty: 2,
      prompt: "Each interior angle of a regular polygon measures 144&deg;. How many sides does the polygon have?",
      options: ["10", "12", "8", "15", "9"], answer: [0],
      explanation: "<p>Each exterior angle is 180&deg; &minus; 144&deg; = 36&deg;. The exterior angles sum to 360&deg;, so there are 360 &divide; 36 = <b>10</b> sides.</p>" },
    { id: "q-g18", type: "mc-single", topic: "geometry", difficulty: 2,
      prompt: "A rectangular box has dimensions 3 by 4 by 12. What is the length of the longest line segment that can be drawn between two vertices of the box?",
      options: ["19", "15", "17", "12", "13"], answer: [4],
      explanation: "<p>The space diagonal is &radic;(3<sup>2</sup> + 4<sup>2</sup> + 12<sup>2</sup>) = &radic;(9 + 16 + 144) = &radic;169 = <b>13</b>.</p>" },
    { id: "q-g19", type: "mc-single", topic: "geometry", difficulty: 3,
      prompt: "A circle is inscribed in an equilateral triangle with side length 6. What is the area of the circle?",
      options: ["9&pi;", "3&pi;", "4&pi;", "12&pi;", "2&pi;"], answer: [1],
      explanation: "<p>The triangle's height is 3&radic;3. The center of the inscribed circle is the centroid, which is " + fr(1, 3) + " of the height above the base, so <i>r</i> = &radic;3.</p><p>Area = &pi;(&radic;3)<sup>2</sup> = <b>3&pi;</b>.</p>" },
    { id: "q-g20", type: "mc-single", topic: "geometry", difficulty: 3,
      prompt: "Two triangles are similar, and the ratio of their areas is 9 to 16. If the perimeter of the smaller triangle is 24, what is the perimeter of the larger triangle?",
      options: ["36", "28", "32", "48", fr(128, 3)], answer: [2],
      explanation: "<p>The area ratio is the square of the side ratio, so the side (and perimeter) ratio is 3 : 4. Larger perimeter = 24 &times; " + fr(4, 3) + " = <b>32</b>. (Using 9 : 16 directly gives " + fr(128, 3) + ".)</p>" },
    { id: "q-g21", type: "mc-single", topic: "geometry", difficulty: 1,
      prompt: "What is the midpoint of the line segment with endpoints (&minus;2, 5) and (6, &minus;1)?",
      options: ["(2, 2)", "(4, 3)", "(2, 3)", "(4, &minus;2)", "(8, &minus;6)"], answer: [0],
      explanation: "<p>Midpoint = (" + fr("&minus;2 + 6", 2) + ", " + fr("5 + (&minus;1)", 2) + ") = <b>(2, 2)</b>.</p>" },

    { id: "q-g22", type: "mc-multi", topic: "geometry", difficulty: 1,
      prompt: "Two sides of a triangle have lengths 4 and 9. Which of the following could be the length of the third side?<br>Indicate <u>all</u> such lengths.",
      options: ["4", "5", "6", "9", "12", "13", "14"], answer: [2, 3, 4],
      explanation: "<p>The third side must be greater than 9 &minus; 4 = 5 and less than 9 + 4 = 13. The lengths that work are <b>6, 9, and 12</b>. Lengths of exactly 5 or 13 would give a degenerate (flat) triangle.</p>" },
    { id: "q-g23", type: "mc-multi", topic: "geometry", difficulty: 3,
      prompt: "Each of the following gives the side lengths of a triangle. Which are right triangles?<br>Indicate <u>all</u> such triangles.",
      options: ["5, 12, 13", "6, 8, 11", "1, 1, &radic;2", "2, 3, &radic;13", "7, 24, 26", "3, &radic;7, 4"], answer: [0, 2, 3, 5],
      explanation: "<p>Check whether the squares of the two shorter sides add up to the square of the longest:</p><ul><li>25 + 144 = 169 &#10003;</li><li>36 + 64 = 100 &ne; 121</li><li>1 + 1 = 2 &#10003;</li><li>4 + 9 = 13 &#10003;</li><li>49 + 576 = 625 &ne; 676</li><li>7 + 9 = 16 &#10003; (&radic;7 &asymp; 2.65 is the shortest side)</li></ul>" },
    { id: "q-g24", type: "mc-multi", topic: "geometry", difficulty: 2,
      prompt: "The circumference of a circle is greater than 10&pi; and less than 16&pi;. Which of the following could be the area of the circle?<br>Indicate <u>all</u> such areas.",
      options: ["20&pi;", "25&pi;", "36&pi;", "49&pi;", "64&pi;", "81&pi;"], answer: [2, 3],
      explanation: "<p>10&pi; &lt; 2&pi;<i>r</i> &lt; 16&pi; gives 5 &lt; <i>r</i> &lt; 8, so 25&pi; &lt; area &lt; 64&pi;. Only <b>36&pi; and 49&pi;</b> fit; the endpoints are excluded.</p>" },
    { id: "q-g25", type: "mc-multi", topic: "geometry", difficulty: 2,
      prompt: "Which of the following statements must be true for every parallelogram?<br>Indicate <u>all</u> such statements.",
      options: ["The diagonals bisect each other.", "The diagonals are congruent.", "Opposite angles are congruent.", "Consecutive angles are supplementary.", "The diagonals are perpendicular."], answer: [0, 2, 3],
      explanation: "<p>All parallelograms have diagonals that bisect each other, congruent opposite angles, and supplementary consecutive angles. Congruent diagonals hold only for rectangles, and perpendicular diagonals only for rhombuses.</p>" },

    { id: "q-g26", type: "numeric", topic: "geometry", difficulty: 1,
      prompt: "A rectangle has area 72 and length 9. What is its perimeter?", answer: 34,
      explanation: "<p>Width = 72 &divide; 9 = 8. Perimeter = 2(9 + 8) = <b>34</b>.</p>" },
    { id: "q-g27", type: "numeric", topic: "geometry", difficulty: 1,
      prompt: "A right circular cylinder has radius 2 and height 5. What is its volume? Round to the nearest whole number.", answer: 63,
      explanation: "<p>V = &pi;<i>r</i><sup>2</sup><i>h</i> = &pi;(4)(5) = 20&pi; &asymp; 62.83, which rounds to <b>63</b>.</p>" },
    { id: "q-g28", type: "numeric", topic: "geometry", difficulty: 3, figure: FIG_SQUARE_MID,
      prompt: "In the figure, <i>ABCD</i> is a square with side length 10, <i>E</i> is the midpoint of <i>AB</i>, and <i>F</i> is the midpoint of <i>BC</i>. What is the area of the shaded triangle <i>DEF</i>?", answer: 37.5,
      explanation: "<p>Subtract the three unshaded right triangles from the square's area of 100:</p><ul><li><i>AED</i>: " + fr(1, 2) + "(5)(10) = 25</li><li><i>EBF</i>: " + fr(1, 2) + "(5)(5) = 12.5</li><li><i>FCD</i>: " + fr(1, 2) + "(5)(10) = 25</li></ul><p>100 &minus; 62.5 = <b>37.5</b>.</p>" },
    { id: "q-g29", type: "numeric", topic: "geometry", difficulty: 2, figure: FIG_EXTERIOR,
      prompt: "In triangle <i>ABC</i>, side <i>AC</i> is extended past <i>C</i>, and the exterior angle at <i>C</i> measures 120&deg;. If angle <i>A</i> measures 2<i>y</i>&deg; and angle <i>B</i> measures <i>y</i>&deg;, what is the value of <i>y</i>?<br><small>Note: Figure not drawn to scale.</small>", answer: 40,
      explanation: "<p>An exterior angle equals the sum of the two remote interior angles: 2<i>y</i> + <i>y</i> = 120, so <i>y</i> = <b>40</b>.</p>" },

    { id: "q-g30", type: "fraction", topic: "geometry", difficulty: 3,
      prompt: "A right triangle has legs of length 6 and 8. The altitude drawn to the hypotenuse divides the triangle into two smaller triangles. What is the ratio of the area of the smaller of these two triangles to the area of the larger one?", answer: [9, 16],
      explanation: "<p>Both smaller triangles are similar to the original triangle. Their hypotenuses are the legs 6 and 8, so the ratio of their sides is 6 : 8 = 3 : 4, and the ratio of their areas is 9 : 16.</p><p>Check: the hypotenuse is split into 3.6 and 6.4, and the altitude is 4.8. The areas are 8.64 and 15.36, and 8.64/15.36 = <b>" + fr(9, 16) + "</b>.</p>" }
  );

  /* ----------------------------- DATA ANALYSIS ----------------------------- */
  Q.push(
    { id: "q-d01", type: "qc", topic: "data", difficulty: 1,
      info: "List <i>L</i>: 3, 7, 7, 9, 14", quantityA: "The mean of list <i>L</i>", quantityB: "The median of list <i>L</i>", answer: [0],
      explanation: "<p>Mean = 40 &divide; 5 = 8. Median = 7 (the middle value). <b>Quantity A is greater</b>; the large value 14 pulls the mean up.</p>" },
    { id: "q-d02", type: "qc", topic: "data", difficulty: 2,
      quantityA: "The number of ways to choose 3 people from a group of 8", quantityB: "The number of ways to choose 5 people from a group of 8", answer: [2],
      explanation: "<p>Choosing 3 people to include is the same as choosing the 5 to leave out, so C(8, 3) = C(8, 5) = 56. The quantities are <b>equal</b>.</p>" },
    { id: "q-d03", type: "qc", topic: "data", difficulty: 1,
      info: "Set <i>S</i>: 10, 20, 30, 40, 50<br>Set <i>T</i>: 15, 25, 35, 45, 55", quantityA: "The standard deviation of <i>S</i>", quantityB: "The standard deviation of <i>T</i>", answer: [2],
      explanation: "<p>Each value of <i>T</i> is the corresponding value of <i>S</i> plus 5. Adding a constant shifts the data without changing its spread, so the standard deviations are <b>equal</b>.</p>" },
    { id: "q-d04", type: "qc", topic: "data", difficulty: 2,
      info: "The heights of the adults in a population are approximately normally distributed with mean 170 cm and standard deviation 8 cm.", quantityA: "The percent of the population with heights greater than 186 cm", quantityB: "5%", answer: [1],
      explanation: "<p>186 = 170 + 2(8), which is 2 standard deviations above the mean. About 95% of a normal distribution lies within 2 standard deviations, leaving about 2.5% in each tail.</p><p>About 2.5% &lt; 5%, so <b>Quantity B is greater</b>.</p>" },
    { id: "q-d05", type: "qc", topic: "data", difficulty: 3,
      info: "In the list 2, 5, 8, <i>x</i>, the mean equals the median.", quantityA: "<i>x</i>", quantityB: "5", answer: [3],
      explanation: "<p>Mean = " + fr("15 + <i>x</i>", 4) + ". Consider where <i>x</i> falls in order:</p><ul><li><i>x</i> &le; 2: median = 3.5, so 15 + <i>x</i> = 14 and <i>x</i> = &minus;1 (valid).</li><li>2 &le; <i>x</i> &le; 8: median = " + fr("5 + <i>x</i>", 2) + " (if <i>x</i> &le; 5) or " + fr("<i>x</i> + 5", 2) + " (if 5 &le; <i>x</i> &le; 8). Either way <i>x</i> = 5.</li><li><i>x</i> &ge; 8: median = 6.5, so 15 + <i>x</i> = 26 and <i>x</i> = 11 (valid).</li></ul><p><i>x</i> can be &minus;1, 5, or 11, so the relationship <b>cannot be determined</b>.</p>" },
    { id: "q-d06", type: "qc", topic: "data", difficulty: 1,
      quantityA: "The probability of getting at least one head in 3 tosses of a fair coin", quantityB: "0.85", answer: [0],
      explanation: "<p>P(at least one head) = 1 &minus; P(no heads) = 1 &minus; " + fr(1, 8) + " = " + fr(7, 8) + " = 0.875 &gt; 0.85. <b>Quantity A is greater</b>.</p>" },
    { id: "q-d07", type: "qc", topic: "data", difficulty: 3,
      info: "Events <i>E</i> and <i>F</i> are independent, P(<i>E</i>) = 0.4, and P(<i>F</i>) = 0.5.", quantityA: "The probability that <i>E</i> or <i>F</i> (or both) occurs", quantityB: "0.8", answer: [1],
      explanation: "<p>For independent events, P(<i>E</i> and <i>F</i>) = 0.4 &times; 0.5 = 0.2. Then P(<i>E</i> or <i>F</i>) = 0.4 + 0.5 &minus; 0.2 = 0.7.</p><p>0.7 &lt; 0.8. (Just adding the probabilities gives 0.9.) <b>Quantity B is greater</b>.</p>" },
    { id: "q-d08", type: "qc", topic: "data", difficulty: 1,
      info: "The average (arithmetic mean) of 5 numbers is 12. When a sixth number is added, the average of the 6 numbers is 13.", quantityA: "The sixth number", quantityB: "18", answer: [2],
      explanation: "<p>Sum of 5 numbers = 60. Sum of 6 numbers = 78. Sixth number = 78 &minus; 60 = 18. The quantities are <b>equal</b>.</p>" },
    { id: "q-d09", type: "qc", topic: "data", difficulty: 3,
      info: "Data set <i>Q</i>: 1, 2, 3, 4, 5<br>Data set <i>R</i> is formed by multiplying each value in <i>Q</i> by &minus;2 and then adding 7.", quantityA: "The standard deviation of <i>R</i>", quantityB: "The standard deviation of <i>Q</i>", answer: [0],
      explanation: "<p>Adding 7 does not change the spread. Multiplying by &minus;2 multiplies the standard deviation by |&minus;2| = 2; the negative sign only reverses the order. So SD(<i>R</i>) = 2 &times; SD(<i>Q</i>), and SD(<i>Q</i>) &gt; 0.</p><p>Standard deviation is never negative. <b>Quantity A is greater</b>.</p>" },
    { id: "q-d10", type: "qc", topic: "data", difficulty: 1,
      info: "Two fair six-sided dice are rolled.", quantityA: "The probability that the sum is 7", quantityB: "The probability that the sum is 8", answer: [0],
      explanation: "<p>Sum 7 can happen 6 ways ((1,6), (2,5), &hellip;, (6,1)). Sum 8 can happen 5 ways ((2,6), (3,5), (4,4), (5,3), (6,2)).</p><p>" + fr(6, 36) + " &gt; " + fr(5, 36) + ", so <b>Quantity A is greater</b>.</p>" },
    { id: "q-d11", type: "qc", topic: "data", difficulty: 3,
      quantityA: "The number of distinct arrangements of the letters in the word LEVEL", quantityB: "The number of different 3-person committees that can be chosen from 7 people", answer: [1],
      explanation: "<p>LEVEL has 5 letters, with L repeated twice and E repeated twice: " + fr("5!", "2!&thinsp;2!") + " = " + fr(120, 4) + " = 30.</p><p>C(7, 3) = " + fr("7 &times; 6 &times; 5", "3 &times; 2 &times; 1") + " = 35. <b>Quantity B is greater</b>.</p>" },

    { id: "q-d12", type: "mc-single", topic: "data", difficulty: 1,
      prompt: "The average (arithmetic mean) of four numbers is 15. If three of the numbers are 10, 12, and 20, what is the fourth number?",
      options: ["18", "13", "23", "15", "17"], answer: [0],
      explanation: "<p>The four numbers sum to 4 &times; 15 = 60. 60 &minus; (10 + 12 + 20) = 60 &minus; 42 = <b>18</b>.</p>" },
    { id: "q-d13", type: "mc-single", topic: "data", difficulty: 2,
      prompt: "A bag contains 4 red, 5 blue, and 3 green marbles. Two marbles are drawn at random without replacement. What is the probability that both are red?",
      options: [fr(1, 9), fr(4, 33), fr(1, 11), fr(1, 6), fr(1, 12)], answer: [2],
      explanation: "<p>P = " + fr(4, 12) + " &times; " + fr(3, 11) + " = " + fr(12, 132) + " = <b>" + fr(1, 11) + "</b>. (" + fr(1, 9) + " is the result if the first marble were replaced.)</p>" },
    { id: "q-d14", type: "mc-single", topic: "data", difficulty: 2,
      prompt: "How many different 4-digit codes can be formed from the digits 0 through 9 if no digit may be repeated? (A code may begin with 0.)",
      options: ["210", "5,040", "10,000", "6,561", "3,024"], answer: [1],
      explanation: "<p>10 &times; 9 &times; 8 &times; 7 = <b>5,040</b>. Order matters, so this is a permutation (210 = C(10, 4) ignores order).</p>" },
    { id: "q-d15", type: "mc-single", topic: "data", difficulty: 3,
      prompt: "A committee of 4 people is to be chosen from 6 men and 5 women. How many different committees include at least 1 woman?",
      options: ["330", "150", "345", "315", "300"], answer: [3],
      explanation: "<p>Total committees: C(11, 4) = 330. Committees with no women: C(6, 4) = 15.</p><p>At least one woman: 330 &minus; 15 = <b>315</b>.</p>" },
    { id: "q-d16", type: "mc-single", topic: "data", difficulty: 1, figure: FIG_BOXPLOT,
      prompt: "The box plot summarizes a set of data. What is the interquartile range of the data?",
      options: ["30", "8", "24", "38", "14"], answer: [4],
      explanation: "<p>From the plot: Q<sub>1</sub> = 20 and Q<sub>3</sub> = 34. IQR = 34 &minus; 20 = <b>14</b>. (38 is the range, 50 &minus; 12.)</p>" },
    { id: "q-d17", type: "mc-single", topic: "data", difficulty: 2,
      prompt: "Scores on a test are approximately normally distributed with mean 500 and standard deviation 100. Approximately what percent of the scores are between 400 and 700?",
      options: ["68%", "75%", "82%", "95%", "98%"], answer: [2],
      explanation: "<p>400 is 1 SD below the mean and 700 is 2 SD above. About 34% lies between &minus;1 SD and the mean, 34% between the mean and +1 SD, and 13.5% between +1 SD and +2 SD.</p><p>34 + 34 + 13.5 = 81.5 &asymp; <b>82%</b>.</p>" },
    { id: "q-d18", type: "mc-single", topic: "data", difficulty: 1,
      prompt: "What is the median of the list 4, 8, 8, 3, 10, 8, 5, 3?",
      options: ["6.125", "8", "5", "7", "6.5"], answer: [4],
      explanation: "<p>Sorted: 3, 3, 4, 5, 8, 8, 8, 10. With 8 values, the median is the average of the 4th and 5th: (5 + 8)/2 = <b>6.5</b>. (6.125 is the mean, and 8 is the mode.)</p>" },
    { id: "q-d19", type: "mc-single", topic: "data", difficulty: 3,
      prompt: "Three fair six-sided dice are rolled. What is the probability that all three show different numbers?",
      options: [fr(5, 9), fr(25, 36), fr(1, 6), fr(2, 3), fr(5, 18)], answer: [0],
      explanation: "<p>The first die can be anything. The second must differ from it (" + fr(5, 6) + "), and the third must differ from both (" + fr(4, 6) + ").</p><p>" + fr(5, 6) + " &times; " + fr(4, 6) + " = " + fr(20, 36) + " = <b>" + fr(5, 9) + "</b>.</p>" },
    { id: "q-d20", type: "mc-single", topic: "data", difficulty: 2,
      figure: "<table class='data'><caption>Quiz Scores of 20 Students</caption><tr><th>Score</th><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td></tr><tr><th>Number of students</th><td>3</td><td>5</td><td>8</td><td>2</td><td>2</td></tr></table>",
      prompt: "Based on the frequency table, what is the median score minus the mean score?",
      options: ["0.5", "0", "1", "0.25", "0.75"], answer: [3],
      explanation: "<p>Median: the 10th and 11th scores in order. The cumulative counts are 3, 8, 16, &hellip;, so both are 3 and the median is 3.</p><p>Mean = (1&middot;3 + 2&middot;5 + 3&middot;8 + 4&middot;2 + 5&middot;2)/20 = 55/20 = 2.75. Difference: 3 &minus; 2.75 = <b>0.25</b>.</p>" },
    { id: "q-d21", type: "mc-single", topic: "data", difficulty: 2,
      prompt: "Class A has 20 students with an average score of 80. Class B has an average score of 90. If the average score of the two classes combined is 86, how many students are in Class B?",
      options: ["36", "30", "24", "40", "20"], answer: [1],
      explanation: "<p>20(80) + 90<i>n</i> = 86(20 + <i>n</i>), so 1,600 + 90<i>n</i> = 1,720 + 86<i>n</i>. Then 4<i>n</i> = 120 and <i>n</i> = <b>30</b>.</p><p>Shortcut: the combined mean is 6 above A's and 4 below B's, so the class sizes are in the ratio 4 : 6 = 20 : 30.</p>" },

    { id: "q-d22", type: "mc-multi", topic: "data", difficulty: 1,
      prompt: "For the data set 2, 4, 4, 6, 9, which of the following statements are true?<br>Indicate <u>all</u> such statements.",
      options: ["The mean is greater than the median.", "The range is 9.", "The mode equals the median.", "The median is 6.", "The mean is 5."], answer: [0, 2, 4],
      explanation: "<p>Mean = 25/5 = 5. Median = 4. Mode = 4. Range = 9 &minus; 2 = 7.</p><p>True: mean &gt; median (5 &gt; 4), mode = median (4), and mean = 5.</p>" },
    { id: "q-d23", type: "mc-multi", topic: "data", difficulty: 3,
      prompt: "Data set <i>D</i> consists of the values 10, 20, 30, 40, 50. Which of the following changes would increase the standard deviation of <i>D</i>?<br>Indicate <u>all</u> such changes.",
      options: ["Adding 5 to each value", "Multiplying each value by 2", "Including an additional value of 30", "Including an additional value of 80", "Removing the value 30", "Replacing 10 and 50 with 20 and 40"], answer: [1, 3, 4],
      explanation: "<ul><li>Adding 5 shifts the data; the SD does not change.</li><li>Multiplying by 2 doubles the SD.</li><li>Adding another 30 (the mean) adds a zero deviation, so the SD decreases.</li><li>80 is far from the mean, so the SD increases.</li><li>Removing 30 (the mean) leaves only the spread-out values, so the SD increases. The population variance goes from 200 to 250.</li><li>Replacing the extremes with values closer to the mean decreases the SD.</li></ul>" },
    { id: "q-d24", type: "mc-multi", topic: "data", difficulty: 3,
      prompt: "A fair six-sided die is rolled twice. Which of the following events have a probability greater than " + fr(1, 4) + "?<br>Indicate <u>all</u> such events.",
      options: ["The sum is 7.", "At least one roll is a 6.", "Both rolls are even.", "The two rolls are different.", "The product of the rolls is odd.", "The sum is at most 5."], answer: [1, 3, 5],
      explanation: "<ul><li>Sum 7: 6/36 = 1/6.</li><li>At least one 6: 1 &minus; 25/36 = 11/36 &asymp; 0.306 &#10003;</li><li>Both even: (1/2)(1/2) = 1/4, which is not greater than 1/4.</li><li>Different: 30/36 &#10003;</li><li>Product odd means both odd: 1/4. Not greater.</li><li>Sum &le; 5: 1 + 2 + 3 + 4 = 10 outcomes, so 10/36 &asymp; 0.278 &#10003;</li></ul>" },
    { id: "q-d25", type: "mc-multi", topic: "data", difficulty: 2,
      prompt: "Consider the data set 3, 5, 7, 8, 12, 13, 14, 18, 21. Find the quartiles by taking the medians of the lower and upper halves, leaving out the overall median. Which of the following statements are true?<br>Indicate <u>all</u> such statements.",
      options: ["The median is 12.", "The first quartile is 5.", "The interquartile range is 10.", "The range is 18.", "The mean is greater than the median."], answer: [0, 2, 3],
      explanation: "<p>Median = 12 (the 5th of 9 values). Lower half 3, 5, 7, 8 gives Q<sub>1</sub> = 6. Upper half 13, 14, 18, 21 gives Q<sub>3</sub> = 16. IQR = 10. Range = 21 &minus; 3 = 18.</p><p>Mean = 101/9 &asymp; 11.2, which is less than the median. True statements: median 12, IQR 10, range 18.</p>" },

    { id: "q-d26", type: "numeric", topic: "data", difficulty: 1,
      prompt: "The average (arithmetic mean) of 12, 15, 18, and <i>x</i> is 16. What is the value of <i>x</i>?", answer: 19,
      explanation: "<p>The sum must be 4 &times; 16 = 64, so <i>x</i> = 64 &minus; 45 = <b>19</b>.</p>" },
    { id: "q-d27", type: "numeric", topic: "data", difficulty: 2,
      prompt: "In how many different ways can 5 people stand in a line if two particular people, Ana and Ben, must stand next to each other?", answer: 48,
      explanation: "<p>Treat Ana and Ben as one block. Arrange 4 units: 4! = 24. Ana and Ben can be ordered within the block 2 ways. 24 &times; 2 = <b>48</b>.</p>" },
    { id: "q-d28", type: "numeric", topic: "data", difficulty: 2,
      prompt: "In a group of 50 people, 30 like tea, 25 like coffee, and 8 like neither. How many people like both tea and coffee?", answer: 13,
      explanation: "<p>The number who like at least one is 50 &minus; 8 = 42. By inclusion-exclusion, 30 + 25 &minus; both = 42, so both = <b>13</b>.</p>" },
    { id: "q-d29", type: "numeric", topic: "data", difficulty: 3,
      prompt: "How many positive integers less than 1,000 have digits whose sum is 3?", answer: 10,
      explanation: "<p>Write each number as a three-digit string <i>abc</i> with leading zeros allowed. We need <i>a</i> + <i>b</i> + <i>c</i> = 3 with nonnegative digits. The number of solutions is C(5, 2) = 10, and none of them is 000.</p><p>The numbers are 3, 12, 21, 30, 102, 111, 120, 201, 210, 300: <b>10</b>.</p>" },
    { id: "q-d30", type: "fraction", topic: "data", difficulty: 3,
      prompt: "Two different cards are chosen at random from five cards numbered 1, 2, 3, 4, and 5. What is the probability that the sum of the two numbers is even?", answer: [2, 5],
      explanation: "<p>There are C(5, 2) = 10 equally likely pairs. The sum is even when both cards are odd (C(3, 2) = 3 pairs) or both are even (C(2, 2) = 1 pair).</p><p>P = " + fr(4, 10) + " = <b>" + fr(2, 5) + "</b>.</p>" }
  );

  window.QUANT_BANK = Q;

  /* ====================================================================== */
  /*                     DATA INTERPRETATION SETS                            */
  /* ====================================================================== */
  var S = [];

  S.push({
    id: "ds01", difficulty: 1,
    figure: "<table class='data'><caption>Enrollment by Department at College <i>M</i></caption>" +
      "<tr><th>Department</th><th>2022</th><th>2023</th></tr>" +
      "<tr><td>Biology</td><td>420</td><td>462</td></tr>" +
      "<tr><td>Chemistry</td><td>280</td><td>266</td></tr>" +
      "<tr><td>Physics</td><td>150</td><td>180</td></tr>" +
      "<tr><td>Mathematics</td><td>310</td><td>341</td></tr>" +
      "<tr><td>Psychology</td><td>540</td><td>513</td></tr></table>",
    questions: [
      { id: "ds01-q1", type: "mc-single", topic: "data", difficulty: 1,
        prompt: "Which department had the greatest percent increase in enrollment from 2022 to 2023?",
        options: ["Biology", "Chemistry", "Physics", "Mathematics", "Psychology"], answer: [2],
        explanation: "<p>Biology: 42/420 = 10%. Chemistry: &minus;5%. Physics: 30/150 = 20%. Mathematics: 31/310 = 10%. Psychology: &minus;5%. The greatest is <b>Physics</b>, even though Biology had the largest increase in number of students.</p>" },
      { id: "ds01-q2", type: "numeric", topic: "data", difficulty: 1,
        prompt: "By what percent did the total enrollment of the five departments increase from 2022 to 2023? Round to the nearest tenth of a percent.", answer: 3.6, after: "%",
        explanation: "<p>2022 total: 420 + 280 + 150 + 310 + 540 = 1,700. 2023 total: 462 + 266 + 180 + 341 + 513 = 1,762.</p><p>Increase = 62/1,700 &asymp; 0.0365, or <b>3.6%</b>.</p>" },
      { id: "ds01-q3", type: "mc-multi", topic: "data", difficulty: 1,
        prompt: "Which departments had more than 300 students enrolled in 2023 <u>and</u> an increase in enrollment from 2022 to 2023?<br>Indicate <u>all</u> such departments.",
        options: ["Biology", "Chemistry", "Physics", "Mathematics", "Psychology"], answer: [0, 3],
        explanation: "<p>The departments with more than 300 students in 2023 are Biology (462), Mathematics (341), and Psychology (513). Of these, Psychology decreased. The answer is <b>Biology and Mathematics</b>.</p>" }
    ]
  });

  S.push({
    id: "ds02", difficulty: 2,
    figure: barChart({ title: "Monthly Sales of Product X", labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      series: [{ name: "Sales", values: [12, 18, 15, 22, 27, 24] }], max: 30, step: 5, ylabel: "Units sold (thousands)" }),
    questions: [
      { id: "ds02-q1", type: "mc-single", topic: "data", difficulty: 2,
        prompt: "For which month was the percent increase in sales over the previous month the greatest?",
        options: ["February", "March", "April", "May", "June"], answer: [0],
        explanation: "<p>Feb: 6/12 = 50%. Mar: decrease. Apr: 7/15 &asymp; 46.7%. May: 5/22 &asymp; 22.7%. Jun: decrease. The greatest is <b>February</b>. April had the largest increase in units (7 thousand), but it started from a larger base.</p>" },
      { id: "ds02-q2", type: "numeric", topic: "data", difficulty: 2,
        prompt: "What was the average (arithmetic mean) monthly sales, in thousands of units, for the six months shown? Round to the nearest tenth.", answer: 19.7, after: "thousand units",
        explanation: "<p>Total = 12 + 18 + 15 + 22 + 27 + 24 = 118. 118/6 &asymp; 19.67, which rounds to <b>19.7</b>.</p>" },
      { id: "ds02-q3", type: "mc-single", topic: "data", difficulty: 2,
        prompt: "What is the median of the six monthly sales figures, in thousands of units?",
        options: ["22", "19.5", "18", "20", "24"], answer: [3],
        explanation: "<p>Sorted: 12, 15, 18, 22, 24, 27. Median = (18 + 22)/2 = <b>20</b>. (19.5 is the midrange.)</p>" }
    ]
  });

  S.push({
    id: "ds03", difficulty: 2,
    figure: lineChart({ title: "Populations of Towns P and Q", labels: ["2015", "2016", "2017", "2018", "2019", "2020"],
      series: [{ name: "Town P", values: [40, 42, 45, 47, 50, 54], labelBelow: true }, { name: "Town Q", values: [60, 58, 57, 55, 54, 52] }],
      min: 30, max: 65, step: 5, ylabel: "Population (thousands)" }),
    questions: [
      { id: "ds03-q1", type: "mc-single", topic: "data", difficulty: 2,
        prompt: "In which of the years shown was the population of Town P first greater than 90% of the population of Town Q?",
        options: ["2016", "2017", "2018", "2019", "2020"], answer: [3],
        explanation: "<p>Ratios P/Q: 2016: 42/58 &asymp; 0.72; 2017: 45/57 &asymp; 0.79; 2018: 47/55 &asymp; 0.85; 2019: 50/54 &asymp; 0.93. The first year above 0.90 is <b>2019</b>.</p>" },
      { id: "ds03-q2", type: "numeric", topic: "data", difficulty: 1,
        prompt: "By what percent did the population of Town P increase from 2015 to 2020?", answer: 35, after: "%",
        explanation: "<p>(54 &minus; 40)/40 = 14/40 = 0.35 = <b>35%</b>.</p>" },
      { id: "ds03-q3", type: "mc-multi", topic: "data", difficulty: 2,
        prompt: "In which years did the population of Town Q decrease by more than 1,500 from the previous year?<br>Indicate <u>all</u> such years.",
        options: ["2016", "2017", "2018", "2019", "2020"], answer: [0, 2, 4],
        explanation: "<p>Changes in Town Q (thousands): 2016: &minus;2, 2017: &minus;1, 2018: &minus;2, 2019: &minus;1, 2020: &minus;2. Decreases of more than 1.5 thousand occurred in <b>2016, 2018, and 2020</b>.</p>" }
    ]
  });

  S.push({
    id: "ds04", difficulty: 1,
    figure: pieChart({ title: "Monthly Budget of the Rivera Household",
      slices: [["Housing", 35], ["Food", 15], ["Transportation", 12], ["Savings", 10], ["Utilities", 8], ["Other", 20]],
      total: "Total monthly income: $4,800" }),
    questions: [
      { id: "ds04-q1", type: "numeric", topic: "data", difficulty: 1,
        prompt: "How many dollars per month does the household budget for food?", answer: 720, before: "$",
        explanation: "<p>15% of $4,800 = 0.15 &times; 4,800 = <b>$720</b>.</p>" },
      { id: "ds04-q2", type: "mc-single", topic: "data", difficulty: 1,
        prompt: "What is the measure of the central angle of the sector representing Transportation?",
        options: ["48&deg;", "43.2&deg;", "36&deg;", "54&deg;", "12&deg;"], answer: [1],
        explanation: "<p>12% of 360&deg; = 0.12 &times; 360 = <b>43.2&deg;</b>.</p>" },
      { id: "ds04-q3", type: "mc-single", topic: "data", difficulty: 2,
        prompt: "Suppose the household's housing cost increases by $240 per month and savings are reduced by $240 to cover it, with income unchanged. Savings would then be what percent of the monthly income?",
        options: ["7.5%", "2.5%", "8%", "10%", "5%"], answer: [4],
        explanation: "<p>Savings are now 10% of 4,800, or $480. After the reduction they are $240, and 240/4,800 = <b>5%</b>.</p>" }
    ]
  });

  S.push({
    id: "ds05", difficulty: 3,
    figure: barChart({ title: "Total Revenue of Company R", labels: ["2019", "2020", "2021", "2022"],
      series: [{ name: "Revenue", values: [50, 60, 80, 100], color: "#5b7db1" }], max: 100, step: 20, ylabel: "Millions of dollars", h: 220 }) +
      "<table class='data'><caption>Company R: 2022 Revenue by Region</caption><tr><th>Region</th><th>Percent of 2022 revenue</th></tr>" +
      "<tr><td>North</td><td>30%</td></tr><tr><td>South</td><td>25%</td></tr><tr><td>East</td><td>25%</td></tr><tr><td>West</td><td>20%</td></tr></table>",
    questions: [
      { id: "ds05-q1", type: "numeric", topic: "data", difficulty: 2,
        prompt: "What was Company R's 2022 revenue from the West region, in millions of dollars?", answer: 20, after: "million dollars",
        explanation: "<p>20% of $100 million = <b>$20 million</b>.</p>" },
      { id: "ds05-q2", type: "mc-single", topic: "data", difficulty: 3,
        prompt: "If revenue from the North region increased by 25% from 2021 to 2022, then 2021 revenue from the North region was what percent of Company R's total 2021 revenue?",
        options: ["37.5%", "24%", "32%", "30%", "25%"], answer: [3],
        explanation: "<p>North 2022 = 0.30 &times; 100 = $30 million. Since 2022 = 1.25 &times; 2021, North 2021 = 30/1.25 = $24 million.</p><p>24/80 = <b>30%</b>. (Subtracting 25% of 30 gives 22.5, which is a common error.)</p>" },
      { id: "ds05-q3", type: "mc-multi", topic: "data", difficulty: 3,
        prompt: "Which of the following statements must be true?<br>Indicate <u>all</u> such statements.",
        options: ["The percent increase in total revenue from 2020 to 2021 was greater than from 2021 to 2022.",
          "The 2022 revenue from the South region was greater than the total revenue in 2019.",
          "The combined 2022 revenue from the East and West regions was less than the total revenue in 2019.",
          "The average (arithmetic mean) annual revenue for 2019 through 2022 was greater than $70 million.",
          "Total revenue doubled from 2019 to 2021."], answer: [0, 2, 3],
        explanation: "<ul><li>2020&rarr;2021: 20/60 &asymp; 33.3%. 2021&rarr;2022: 20/80 = 25%. True.</li><li>South 2022 = $25M &lt; $50M. False.</li><li>East + West 2022 = $45M &lt; $50M. True.</li><li>Mean = 290/4 = $72.5M &gt; $70M. True.</li><li>50 to 80 is not doubling. False.</li></ul>" }
    ]
  });

  S.push({
    id: "ds06", difficulty: 2,
    figure: "<table class='data'><caption>Number of Books Read Last Month by 40 Students</caption>" +
      "<tr><th>Number of books</th><th>Number of students</th></tr>" +
      "<tr><td>0</td><td>4</td></tr><tr><td>1</td><td>9</td></tr><tr><td>2</td><td>12</td></tr>" +
      "<tr><td>3</td><td>8</td></tr><tr><td>4</td><td>5</td></tr><tr><td>5</td><td>2</td></tr></table>",
    questions: [
      { id: "ds06-q1", type: "mc-single", topic: "data", difficulty: 2,
        prompt: "What is the median number of books read by the 40 students?",
        options: ["2.5", "3", "12", "2", "1.5"], answer: [3],
        explanation: "<p>The median is the average of the 20th and 21st values. The cumulative counts are 4, 13, 25, &hellip;, so values 14 through 25 are all 2. The median is <b>2</b>. (12 is the largest frequency, not a data value.)</p>" },
      { id: "ds06-q2", type: "numeric", topic: "data", difficulty: 1,
        prompt: "What percent of the students read at least 3 books last month?", answer: 37.5, after: "%",
        explanation: "<p>8 + 5 + 2 = 15 students. 15/40 = <b>37.5%</b>.</p>" },
      { id: "ds06-q3", type: "mc-multi", topic: "data", difficulty: 3,
        prompt: "Which of the following statements are true?<br>Indicate <u>all</u> such statements.",
        options: ["Fewer than 10 students read at most 1 book.",
          "The mode of the data is 2 books.",
          "If 2 of the students who read 0 books had each read 5 books instead, the median would change.",
          "The mean number of books read is greater than the median.",
          "The range of the data is 5 books."], answer: [1, 3, 4],
        explanation: "<ul><li>At most 1 book: 4 + 9 = 13 students, which is not fewer than 10. False.</li><li>Mode = 2 (12 students). True.</li><li>The new counts are 2, 9, 12, 8, 5, 4, with cumulative counts 2, 11, 23. The 20th and 21st values are still 2, so the median is unchanged. False.</li><li>Mean = (0 + 9 + 24 + 24 + 20 + 10)/40 = 87/40 = 2.175 &gt; 2. True.</li><li>Range = 5 &minus; 0 = 5. True.</li></ul>" }
    ]
  });

  S.push({
    id: "ds07", difficulty: 3,
    figure: lineChart({ title: "Total Employees at Firm F", labels: ["2018", "2019", "2020", "2021", "2022"],
      series: [{ name: "Employees", values: [200, 240, 300, 330, 360], color: "#c97b4a" }], min: 150, max: 400, step: 50, ylabel: "Employees", h: 220 }) +
      barChart({ title: "Percent of Employees Working Remotely", labels: ["2018", "2019", "2020", "2021", "2022"],
        series: [{ name: "Remote", values: [10, 15, 40, 50, 45], color: "#7aa36b" }], max: 60, step: 10, ylabel: "Percent", unit: "%", h: 220 }),
    questions: [
      { id: "ds07-q1", type: "numeric", topic: "data", difficulty: 2,
        prompt: "How many employees of Firm F worked remotely in 2021?", answer: 165, after: "employees",
        explanation: "<p>50% of 330 = <b>165</b>.</p>" },
      { id: "ds07-q2", type: "mc-single", topic: "data", difficulty: 3,
        prompt: "In which year was the increase over the previous year in the <u>number</u> of remote employees the greatest?",
        options: ["2019", "2020", "2021", "2022", "The increase was the same in two of these years."], answer: [1],
        explanation: "<p>Remote employees: 2018: 20, 2019: 36, 2020: 120, 2021: 165, 2022: 162. The increases were 16, 84, 45, and &minus;3. The greatest was in <b>2020</b>.</p>" },
      { id: "ds07-q3", type: "mc-single", topic: "data", difficulty: 3,
        prompt: "The number of employees who did <u>not</u> work remotely in 2022 was what percent of the number who did not work remotely in 2018?",
        options: ["180%", "90%", "120%", "110%", "100%"], answer: [3],
        explanation: "<p>Non-remote in 2018: 200 &minus; 20 = 180. Non-remote in 2022: 360 &minus; 162 = 198. 198/180 = 1.1 = <b>110%</b>.</p>" }
    ]
  });

  S.push({
    id: "ds08", difficulty: 1,
    figure: barChart({ title: "Club Membership by Gender", labels: ["Chess", "Drama", "Robotics"],
      series: [{ name: "Male", values: [18, 10, 22], color: "#5b7db1" }, { name: "Female", values: [12, 25, 14], color: "#c97b4a" }],
      max: 30, step: 5, ylabel: "Number of members" }),
    questions: [
      { id: "ds08-q1", type: "mc-single", topic: "data", difficulty: 1,
        prompt: "What is the ratio of the number of female members of the Drama club to the number of female members of the Chess club?",
        options: ["5 to 2", "25 to 12", "12 to 25", "5 to 3", "2 to 1"], answer: [1],
        explanation: "<p>Drama has 25 female members and Chess has 12, so the ratio is <b>25 to 12</b>.</p>" },
      { id: "ds08-q2", type: "numeric", topic: "data", difficulty: 1,
        prompt: "What percent of the members of the Robotics club are female? Round to the nearest whole percent.", answer: 39, after: "%",
        explanation: "<p>Robotics has 22 + 14 = 36 members. 14/36 &asymp; 0.389, which is <b>39%</b>.</p>" },
      { id: "ds08-q3", type: "mc-multi", topic: "data", difficulty: 1,
        prompt: "Which clubs have more than 30 members?<br>Indicate <u>all</u> such clubs.",
        options: ["Chess", "Drama", "Robotics"], answer: [1, 2],
        explanation: "<p>Chess: 18 + 12 = 30, which is not more than 30. Drama: 35. Robotics: 36. The answer is <b>Drama and Robotics</b>.</p>" }
    ]
  });

  window.QUANT_SETS = S;
})();
