/* Quant study notes distilled from ETS "Math Review" and "Math Conventions" (the two PDFs in the repo root).
   Plain script: defines window.MATH_STUDY = [{ id, group, title, pdf, html }].
   `pdf` is the page range / section in the source PDF so you can look up the full treatment. */
window.MATH_STUDY = [

  /* ============================== MATH CONVENTIONS ============================== */
  { id: "conv-numbers", group: "Conventions", title: "Numbers & Quantities", pdf: "Conventions p.4–5", html: `
    <ul>
      <li>All numbers are <b>real</b> (integers, rational, irrational). <b>No imaginary numbers.</b></li>
      <li>Base 10 unless stated. A "two-digit integer" has a nonzero leftmost digit: 5,000 is four-digit; 031 is not three-digit.</li>
      <li>One billion = 10<sup>9</sup>. One dozen = 12. π ≈ 3.14.</li>
      <li><b>Rounding halves:</b> positive numbers round <i>up</i> (23.5 → 24); negative numbers round to the <i>lesser</i> value (−36.5 → −37).</li>
      <li><b>Factor / divisor / divisible</b> only apply to integers. Factors include negatives (4 has six factors: ±1, ±2, ±4). <b>Multiple</b> can be used with reals (1.2 is a multiple of 0.4).</li>
      <li>Division: n = qd + r with 0 ≤ r &lt; d. r = 0 exactly when d divides n. <i>20 ÷ 7: q = 2, r = 6.</i></li>
      <li>Prime: integer &gt; 1 with exactly two positive divisors. Composite: integer &gt; 1 that is not prime. <b>2 is the only even prime; 1 is neither prime nor composite.</b></li>
      <li>Odd/even integers need not be positive; <b>0 is even</b> and neither positive nor negative.</li>
    </ul>` },

  { id: "conv-expr", group: "Conventions", title: "Expressions, Symbols & Variables", pdf: "Conventions p.5–7", html: `
    <ul>
      <li>Variables are real numbers unless restricted ("n is a nonzero integer", "1 &lt; x ≤ π").</li>
      <li><b>Order of operations:</b> parentheses → exponents → negation → × ÷ (left to right) → + − (left to right). So −3<sup>2</sup> = −9 but (−3)<sup>2</sup> = 9.</li>
      <li>Symbols: ≤ ≥ ≠ ≈, |x| absolute value, √x is the <i>nonnegative</i> root, n! (0! = 1), ∥ parallel, ⊥ perpendicular, ∠B.</li>
      <li><b>Undefined:</b> x/0, √x for x &lt; 0, 0<sup>0</sup>. Any nonzero x<sup>0</sup> = 1.</li>
      <li>Letter strings like "BCD" can be digits, not a product. Context decides.</li>
      <li>Function domain not given ⇒ all real x for which f(x) is a real number. g∘f(x) = g(f(x)).</li>
      <li>Custom operations (e.g. r ♦ s = …) are always defined in the question; just substitute.</li>
    </ul>` },

  { id: "conv-geometry", group: "Conventions", title: "Geometry Figures (what you may assume)", pdf: "Conventions p.8–10", html: `
    <ul>
      <li>Plane (Euclidean) geometry; angles of a triangle sum to 180°. Angle measures are positive and ≤ 360°.</li>
      <li>"Angle ABC" means the <b>smaller</b> angle at vertex B. "AB" may be a segment, its length, or the line.</li>
      <li>Described-but-not-shown closed figures are <b>convex</b> and not degenerate (a point or segment).</li>
      <li><b>Figures are NOT necessarily drawn to scale.</b> Use reasoning, never eyeballing or measuring.</li>
    </ul>
    <div class="cols"><div>
      <h4>You CAN assume from a figure</h4>
      <ul><li>Lines drawn straight are straight; curves are not.</li><li>Points on a line/curve are in the order shown.</li>
      <li>Points on opposite sides of a line are on opposite sides.</li><li>Relative positions (D between A and C, E on BD).</li>
      <li>Marked right-angle squares, labelled lengths, and labelled angles.</li><li>Shapes named (triangle ABC exists).</li></ul>
    </div><div>
      <h4>You can NOT assume</h4>
      <ul><li>Which segment looks longer or which angle looks larger.</li><li>Two angles or sides are equal because they look equal.</li>
      <li>An angle is 90° unless marked.</li><li>Which of two triangle areas is greater by looks.</li></ul>
    </div></div>
    <p><b>Distance</b> from a point to a line is the perpendicular segment. "Area of a rectangle" means area of the region it encloses. "Similar" = same shape.</p>` },

  { id: "conv-coord", group: "Conventions", title: "Coordinate Systems", pdf: "Conventions p.11–12", html: `
    <ul>
      <li>Unlike geometry figures, <b>coordinate systems ARE drawn to scale</b>: you can read, estimate and compare by sight.</li>
      <li>Number lines: positive is right (horizontal) and up (vertical). Distances are nonnegative.</li>
      <li>xy-plane: x-axis horizontal, y-axis vertical, equal unit lengths unless noted, four quadrants around origin O. P(−2, −8) is 2 left of and 8 below the axes.</li>
      <li>Tick marks/grid lines are evenly spaced. <b>x-intercept</b> = the x-coordinate where the graph meets the x-axis (y-intercept likewise).</li>
    </ul>` },

  { id: "conv-sets", group: "Conventions", title: "Sets, Lists & Sequences", pdf: "Conventions p.12–13", html: `
    <table class="study-table"><tr><th></th><th>Set</th><th>List / data set</th></tr>
      <tr><td>Repeats</td><td>Not counted</td><td>Counted</td></tr>
      <tr><td>Order</td><td>Irrelevant</td><td>Relevant</td></tr>
      <tr><td>Example</td><td>{2, 4, 6, 8}</td><td>3, 1, 2, 3, 3 has five numbers</td></tr></table>
    <ul>
      <li>A∩B = in both (intersection); A∪B = in either or both (union); ∅ is the empty set and a subset of every set. Disjoint = mutually exclusive.</li>
      <li>"Data set" means a <i>list</i>, so repetitions matter.</li>
      <li>Sequences: terms a<sub>1</sub>, a<sub>2</sub>, … a<sub>n</sub>; trailing "…" means infinite.</li>
      <li><b>"From 0 to 9 inclusive" is 10 integers;</b> "years from 1985 to 2005" is 21 years. Count = last − first + 1.</li>
    </ul>` },

  { id: "conv-stats", group: "Conventions", title: "Data & Statistics Definitions", pdf: "Conventions p.13–14", html: `
    <ul>
      <li><b>Average (arithmetic mean)</b> = sum ÷ count. "Average" never means median or mode on the GRE.</li>
      <li><b>Median:</b> middle value of ordered data; with an even count, the mean of the two middle values.</li>
      <li><b>Mode:</b> most frequent value; there may be more than one.</li>
      <li><b>Quartiles:</b> Q1, Q2 (= median), Q3 split the ordered data into four roughly equal groups. Percentiles: 25th = Q1, 50th = median, 75th = Q3.</li>
      <li><b>Standard deviation</b> here is the <i>population</i> SD: √(mean of squared differences from the mean). Bigger SD = more spread.</li>
      <li><b>Range</b> = max − min. <b>Interquartile range</b> = Q3 − Q1.</li>
    </ul>` },

  { id: "conv-prob", group: "Conventions", title: "Distributions & Probability Conventions", pdf: "Conventions p.14–16", html: `
    <ul>
      <li>Frequency distribution: counts per value or interval. Relative frequency = frequency ÷ total.</li>
      <li>"Random selection/sample": all equal-size samples equally likely unless told otherwise.</li>
      <li>Equally likely outcomes: <b>P(E) = (outcomes in E) ÷ (all outcomes)</b>, and 0 ≤ P(E) ≤ 1.</li>
      <li>Mutually exclusive ⇒ P(E and F) = 0. <b>Independent ⇔ P(E and F) = P(E)·P(F).</b></li>
      <li>Discrete random variable mean (expected value) = Σ x·P(x).</li>
      <li>Continuous: P(a ≤ X ≤ b) is the area under the curve between a and b; total area = 1. Mean is the balance point; median splits area in half.</li>
      <li><b>Normal distribution:</b> bell-shaped, symmetric about the mean (= median). Standard normal: mean 0, SD 1. Approx. probabilities: within 1 SD ≈ 68%, within 2 SD ≈ 95%, within 3 SD ≈ 99.7%.</li>
    </ul>` },

  { id: "conv-misc", group: "Conventions", title: "Reading Question Information", pdf: "Conventions p.16–18", html: `
    <ul>
      <li>Graphs (bar, circle, line) are <b>drawn to scale</b>, but axes may not start at 0 or may be broken. A circle graph is 100% of the titled total.</li>
      <li>Venn diagrams: a number in a region counts only that smallest region; a number above a circle counts the whole set.</li>
      <li>Given numbers are <b>exact</b> (30% is 30%, not 29.6%). An integer count is the <b>total</b>: 50 marbles, 23 red ⇒ 27 not red.</li>
      <li>"Approximate" with no tolerance: choose the closest answer.</li>
      <li>"Difference" means <b>positive difference</b>. "Profit" is gross profit = revenue − cost, nothing else unless stated.</li>
      <li>A variable for a count or money in a real-life story is &gt; 0 unless noted.</li>
      <li>Common unit relations (minutes/hours, cents/dollars, cm/m) are not supplied; unusual conversions are given.</li>
      <li><b>Don't add assumptions:</b> ignore time zones, daylight saving and sales tax unless mentioned. Some information may be unneeded.</li>
      <li>Data Interpretation: one display feeds every question in the set, but treat each question separately and carry nothing between them.</li>
      <li>Parse math expressions first, then words: "the sum of the first two consecutive integers greater than n + 6" means (n+7)+(n+8).</li>
    </ul>` },

  /* ================================ ARITHMETIC ================================== */
  { id: "ar-integers", group: "Arithmetic", title: "1.1 Integers", pdf: "Review p.3–6", html: `
    <ul>
      <li>Integers: …, −2, −1, 0, 1, 2, …; consecutive integers differ by 1. Positive × negative = negative; negative × negative = positive.</li>
      <li><b>Even/odd:</b> even ± even = even; odd ± odd = even; even ± odd = odd; even × anything = even; odd × odd = odd.</li>
      <li><b>Divisibility tests:</b> 2 (last digit even), 3 (digit sum divisible by 3), 4 (last two digits), 5 (ends 0/5), 6 (2 and 3), 8 (last three digits), 9 (digit sum divisible by 9), 10 (ends 0).</li>
      <li><b>Prime factorization</b> is unique: 140 = 2<sup>2</sup>·5·7. Number of positive divisors = product of (exponent + 1) → 140 has 3·2·2 = 12.</li>
      <li><b>GCD</b> = product of shared primes at lowest powers; <b>LCM</b> = all primes at highest powers. GCD × LCM = a × b.</li>
      <li>Remainders: n = qd + r. Remainder arithmetic works on remainders themselves.</li>
    </ul>` },

  { id: "ar-fractions", group: "Arithmetic", title: "1.2 Fractions", pdf: "Review p.7–10", html: `
    <ul>
      <li>Rational number = c/d with d ≠ 0. Equivalent fractions: multiply or divide top and bottom by the same nonzero number. −c/d = c/−d = −(c/d).</li>
      <li><b>Add/subtract:</b> common denominator, combine numerators. 1/3 + 2/5 = 5/15 + 6/15 = 11/15.</li>
      <li><b>Multiply:</b> top×top / bottom×bottom. <b>Divide:</b> multiply by the reciprocal. (17/8) ÷ (3/5) = (17/8)(5/3) = 85/24.</li>
      <li>Mixed number: 4⅜ = 35/8 (4×8 + 3 over 8).</li>
      <li>Compare fractions by cross-multiplying (positive denominators) or converting to decimals. Bigger denominator, same numerator ⇒ smaller fraction.</li>
    </ul>` },

  { id: "ar-exponents", group: "Arithmetic", title: "1.3 Exponents & Roots", pdf: "Review p.11–13", html: `
    <ul>
      <li>x<sup>n</sup> = x·x·…·x (n times). 10 is a base; negative exponent = reciprocal: 10<sup>−2</sup> = 1/100. x<sup>0</sup> = 1 (x ≠ 0).</li>
      <li><b>Squares to know:</b> 1–15 → 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225. <b>Cubes:</b> 1, 8, 27, 64, 125.</li>
      <li>Odd powers keep the sign of the base; even powers of a negative number are positive.</li>
      <li>√x is the nonnegative root only. √(ab) = √a·√b; √(a/b) = √a/√b. <b>√(a+b) ≠ √a + √b.</b> √(x<sup>2</sup>) = |x|.</li>
      <li>Useful: √2 ≈ 1.41, √3 ≈ 1.73, √5 ≈ 2.24. Cube root of a negative is negative. Even roots of negatives are not real.</li>
      <li>Simplify radicals: √72 = √36·√2 = 6√2. Rationalize: 1/√2 = √2/2.</li>
    </ul>` },

  { id: "ar-decimals", group: "Arithmetic", title: "1.4 Decimals", pdf: "Review p.14–15", html: `
    <ul>
      <li>Place values: tenths, hundredths, thousandths… Terminating decimals are fractions over powers of 10.</li>
      <li>Add/subtract by lining up decimal points. Multiply as integers, then place the point (decimal places add). Divide by moving the point in divisor and dividend equally.</li>
      <li>Multiplying/dividing by 10<sup>n</sup> shifts the point n places. 0.1 × 0.1 = 0.01.</li>
      <li><b>Fraction ↔ decimal:</b> 1/2 = .5, 1/4 = .25, 3/4 = .75, 1/5 = .2, 1/8 = .125, 1/3 = .333…, 1/6 = .1666…, 1/9 = .111…, 1/7 = .142857 repeating.</li>
    </ul>` },

  { id: "ar-real", group: "Arithmetic", title: "1.5 Real Numbers", pdf: "Review p.16–19", html: `
    <ul>
      <li>Number line: reals fill every point. Rational (fractions, terminating or repeating decimals) plus irrational (√2, π) make the reals.</li>
      <li><b>Absolute value</b> |x| = distance from 0. |x − y| = distance between x and y. |x| = a (a &gt; 0) gives x = ±a.</li>
      <li>Sign rules: nonzero x² &gt; 0. Multiplying an inequality by a negative flips it. For 0 &lt; x &lt; 1: x² &lt; x and √x &gt; x.</li>
      <li><b>Order of operations</b> PEMDAS, with negation after exponents.</li>
      <li>Estimating and approximating: round early only when answer choices are far apart; closest choice wins.</li>
      <li>Distributive law: a(b + c) = ab + ac. Zero-product: ab = 0 ⇒ a = 0 or b = 0.</li>
    </ul>` },

  { id: "ar-ratio", group: "Arithmetic", title: "1.6 Ratio", pdf: "Review p.20", html: `
    <ul>
      <li>Ratio a:b = a/b. <b>Part-to-part ratio 3:2 means parts 3k and 2k, whole 5k</b> (so part:whole is 3/5 and 2/5).</li>
      <li>Ratios scale: 3:2 = 6:4. Convert to a unit rate to compare.</li>
      <li>Proportion: a/b = c/d ⇒ ad = bc. Direct variation: y = kx. Inverse: xy = k.</li>
      <li>Rate problems: distance = rate × time, work = rate × time.</li>
    </ul>` },

  { id: "ar-percent", group: "Arithmetic", title: "1.7 Percent", pdf: "Review p.21–27", html: `
    <ul>
      <li>Percent = per hundred. p% of N = (p/100)·N. 5% = 0.05, 12.5% = 1/8, 25% = 1/4, 33⅓% = 1/3, 50% = 1/2, 75% = 3/4.</li>
      <li>Percent change = (new − old)/old × 100. <b>Always divide by the original.</b></li>
      <li>Increase by p%: multiply by (1 + p/100). Decrease: (1 − p/100). Successive changes <b>multiply</b>, they do not add: +20% then −20% = 1.2 × 0.8 = 0.96 (a 4% drop).</li>
      <li>"A is p% of B" ⇒ A = (p/100)B. "A is p% greater than B" ⇒ A = (1 + p/100)B.</li>
      <li>Percent vs percentage points: going from 40% to 50% is +10 percentage points but +25% relative.</li>
      <li><b>Interest:</b> simple A = P(1 + rt). Compound A = P(1 + r/n)<sup>nt</sup>.</li>
      <li>Discount/markup chains, mixtures, and "percent of percent" all reduce to multiplying factors.</li>
    </ul>` },

  /* ================================== ALGEBRA =================================== */
  { id: "al-expr", group: "Algebra", title: "2.1 Algebraic Expressions", pdf: "Review p.36–39", html: `
    <ul>
      <li>Combine like terms; distribute. <b>FOIL:</b> (a+b)(c+d) = ac + ad + bc + bd.</li>
      <li><b>Key identities:</b>
        <div class="formula">(a + b)² = a² + 2ab + b² &nbsp;&nbsp; (a − b)² = a² − 2ab + b² &nbsp;&nbsp; <b>a² − b² = (a + b)(a − b)</b></div></li>
      <li>Factoring: pull out the greatest common factor first. x² + (a+b)x + ab = (x + a)(x + b).</li>
      <li>Fractions: cancel common <i>factors</i> only, never terms. (x²−9)/(x−3) = x + 3.</li>
      <li>Evaluate by substitution; use parentheses around substituted negatives.</li>
    </ul>` },

  { id: "al-exp", group: "Algebra", title: "2.2 Rules of Exponents", pdf: "Review p.40–42", html: `
    <div class="formula">x<sup>a</sup>·x<sup>b</sup> = x<sup>a+b</sup> &nbsp; x<sup>a</sup>/x<sup>b</sup> = x<sup>a−b</sup> &nbsp; (x<sup>a</sup>)<sup>b</sup> = x<sup>ab</sup> &nbsp; (xy)<sup>a</sup> = x<sup>a</sup>y<sup>a</sup> &nbsp; x<sup>−a</sup> = 1/x<sup>a</sup> &nbsp; x<sup>1/n</sup> = ⁿ√x &nbsp; x<sup>m/n</sup> = (ⁿ√x)<sup>m</sup></div>
    <ul>
      <li>Rules apply to the <b>same base</b>. Make bases match (4 = 2², 8 = 2³, 9 = 3²) to solve 2<sup>x</sup> = 32.</li>
      <li>x<sup>a</sup> + x<sup>b</sup> does <b>not</b> simplify; factor instead: 2<sup>5</sup> + 2<sup>4</sup> = 2<sup>4</sup>(2 + 1).</li>
      <li>Scientific notation: a × 10<sup>n</sup> with 1 ≤ a &lt; 10.</li>
    </ul>` },

  { id: "al-linear", group: "Algebra", title: "2.3 Solving Linear Equations", pdf: "Review p.43–47", html: `
    <ul>
      <li>Do the same operation to both sides to isolate the variable. Clear fractions by multiplying by the LCD.</li>
      <li><b>Systems of two equations:</b> substitution or elimination. Count solutions: one (different slopes), none (same slope, different intercept), infinitely many (identical).</li>
      <li>If a system looks hard, try adding or subtracting the equations: it may hand you the quantity asked for (e.g. x + y) with no solving.</li>
      <li>Literal equations: solve for one variable in terms of others.</li>
      <li>Absolute-value equations: |ax + b| = c ⇒ ax + b = c or ax + b = −c. Check for extraneous answers.</li>
    </ul>` },

  { id: "al-quad", group: "Algebra", title: "2.4 Solving Quadratic Equations", pdf: "Review p.48–50", html: `
    <ul>
      <li>Standard form ax² + bx + c = 0. Factor, then use zero-product. Move everything to one side first.</li>
      <li><b>Quadratic formula:</b> <span class="formula">x = (−b ± √(b² − 4ac)) / 2a</span></li>
      <li><b>Discriminant</b> b² − 4ac: &gt; 0 two real roots; = 0 one repeated root; &lt; 0 none (real).</li>
      <li><b>Sum of roots = −b/a; product of roots = c/a.</b></li>
      <li>Square-root shortcut: x² = k ⇒ x = ±√k (k ≥ 0). Don't divide by x; you lose the x = 0 root.</li>
      <li>Perfect squares to recognise: x² ± 2ax + a² = (x ± a)².</li>
    </ul>` },

  { id: "al-ineq", group: "Algebra", title: "2.5 Solving Linear Inequalities", pdf: "Review p.51–52", html: `
    <ul>
      <li>Solve like equations, but <b>multiplying or dividing by a negative flips the inequality</b>: −2x &lt; 6 ⇒ x &gt; −3.</li>
      <li>Never multiply by a variable of unknown sign.</li>
      <li>|x| &lt; a ⇒ −a &lt; x &lt; a. |x| &gt; a ⇒ x &lt; −a or x &gt; a.</li>
      <li>Compound inequalities: operate on all parts at once. Combine ranges to find extreme values (min of a + b uses both minimums).</li>
    </ul>` },

  { id: "al-func", group: "Algebra", title: "2.6 Functions", pdf: "Review p.53", html: `
    <ul>
      <li>A function assigns <b>exactly one</b> output to each input in its domain. f(x) = 2x² − 3 ⇒ f(−1) = −1.</li>
      <li>Default domain: every real x for which f(x) is real (no zero denominators, no negatives under even roots).</li>
      <li>Composition: g(f(x)) means apply f first. Evaluate from the inside out.</li>
      <li>Defined operations (e.g. x ★ y = …) are just functions of two variables.</li>
    </ul>` },

  { id: "al-apps", group: "Algebra", title: "2.7 Applications (Word Problems)", pdf: "Review p.54–60", html: `
    <ul>
      <li><b>Translate:</b> "is" → =, "of" → ×, "more than" → +, "less than" → − (reversed: "5 less than x" = x − 5), "per" → ÷.</li>
      <li><b>Rate × time:</b> distance = rate × time. Average speed = total distance ÷ total time (<i>not</i> the mean of speeds). Combined work rates add: 1/a + 1/b = 1/t.</li>
      <li><b>Mixtures:</b> amount × concentration, summed. <b>Interest/discount:</b> multiply factors.</li>
      <li><b>Sets/Venn (2 sets):</b> <span class="formula">Total = A + B − Both + Neither</span> &nbsp; (3 sets: add singles, subtract pair overlaps, add the triple overlap.)</li>
      <li><b>Consecutive integers:</b> n, n+1, n+2. Evens/odds: n, n+2, n+4. Sum of n consecutive integers = n × (mean = middle).</li>
      <li><b>Arithmetic sequence:</b> a<sub>n</sub> = a<sub>1</sub> + (n−1)d; sum = n(a<sub>1</sub> + a<sub>n</sub>)/2. <b>Geometric:</b> a<sub>n</sub> = a<sub>1</sub>r<sup>n−1</sup>.</li>
      <li>Define variables clearly, write equations, check units and that the answer is what was asked.</li>
    </ul>` },

  { id: "al-coord", group: "Algebra", title: "2.8 Coordinate Geometry", pdf: "Review p.61–71", html: `
    <ul>
      <li><b>Slope</b> m = (y₂ − y₁)/(x₂ − x₁). Line: <span class="formula">y = mx + b</span> (b = y-intercept). Point-slope: y − y₁ = m(x − x₁). Ax + By = C ⇒ slope −A/B.</li>
      <li><b>Parallel lines:</b> equal slopes. <b>Perpendicular:</b> slopes are negative reciprocals (m·m′ = −1). Horizontal lines have slope 0; vertical lines have undefined slope (x = k).</li>
      <li><b>Distance:</b> d = √((x₂−x₁)² + (y₂−y₁)²). <b>Midpoint:</b> ((x₁+x₂)/2, (y₁+y₂)/2).</li>
      <li>Intercepts: set y = 0 for the x-intercept; set x = 0 for the y-intercept.</li>
      <li><b>Circle:</b> (x − h)² + (y − k)² = r² (center (h, k), radius r).</li>
      <li>Intersection of two graphs = solution of the system.</li>
      <li>Quadrants: I (+,+), II (−,+), III (−,−), IV (+,−).</li>
    </ul>` },

  { id: "al-graphs", group: "Algebra", title: "2.9 Graphs of Functions", pdf: "Review p.72–79", html: `
    <ul>
      <li><b>Transformations</b> of y = f(x): f(x) + c shifts up c; f(x + c) shifts <i>left</i> c; −f(x) reflects over the x-axis; f(−x) reflects over the y-axis; a·f(x) stretches vertically; f(ax) compresses horizontally.</li>
      <li><b>Parabola</b> y = ax² + bx + c: opens up if a &gt; 0, down if a &lt; 0. Vertex at x = −b/2a. Roots are the x-intercepts. Axis of symmetry through the vertex.</li>
      <li>Vertex form y = a(x − h)² + k has vertex (h, k).</li>
      <li>y = |x| is a V with vertex at the origin. Linear graphs: constant slope. Read function values from the graph: f(2) is the y-value at x = 2.</li>
      <li>A graph is a function only if it passes the <b>vertical-line test</b>.</li>
      <li>Increasing/decreasing, max/min, intercepts, and symmetry: even functions f(−x) = f(x); odd functions f(−x) = −f(x).</li>
    </ul>` },

  /* ================================== GEOMETRY ================================== */
  { id: "ge-lines", group: "Geometry", title: "3.1 Lines & Angles", pdf: "Review p.92–94", html: `
    <ul>
      <li>Straight angle = 180°; right angle = 90°; full turn = 360°. <b>Supplementary</b> sum to 180°; <b>complementary</b> sum to 90°.</li>
      <li><b>Vertical angles</b> (opposite, formed by two crossing lines) are equal.</li>
      <li><b>Parallel lines cut by a transversal:</b> corresponding angles equal, alternate interior equal, same-side interior supplementary. Only 2 distinct angle measures appear (a and 180° − a).</li>
      <li><b>Perpendicular bisector:</b> every point on it is equidistant from the two endpoints.</li>
    </ul>` },

  { id: "ge-poly", group: "Geometry", title: "3.2 Polygons", pdf: "Review p.95", html: `
    <ul>
      <li>Interior angle sum = <b>(n − 2) × 180°</b>: triangle 180°, quadrilateral 360°, pentagon 540°, hexagon 720°.</li>
      <li>Exterior angles (one per vertex) always sum to 360°.</li>
      <li>Regular n-gon: all sides and angles equal; each interior angle = (n−2)·180°/n.</li>
      <li>Convex polygons only on the GRE unless shown otherwise.</li>
    </ul>` },

  { id: "ge-tri", group: "Geometry", title: "3.3 Triangles", pdf: "Review p.96–101", html: `
    <ul>
      <li><b>Area = ½ × base × height</b> (height is perpendicular to the base). Angles sum to 180°. <b>Triangle inequality:</b> each side &lt; sum of the other two and &gt; their difference.</li>
      <li>Bigger angle ↔ opposite longer side. <b>Isosceles:</b> equal sides ↔ equal opposite angles. <b>Equilateral:</b> all 60°; area = (√3/4)s².</li>
      <li><b>Pythagorean theorem</b> (right triangle): <span class="formula">a² + b² = c²</span> Triples: 3-4-5, 5-12-13, 8-15-17, 7-24-25 (and multiples).</li>
      <li><b>30°-60°-90°:</b> sides x : x√3 : 2x. <b>45°-45°-90°:</b> sides x : x : x√2. Equilateral altitude = (√3/2)s.</li>
      <li><b>Similar triangles:</b> equal angles, proportional sides; areas scale by the <i>square</i> of the side ratio. <b>Congruent:</b> same shape and size (SSS, SAS, ASA).</li>
      <li>Exterior angle = sum of the two remote interior angles. Midsegment is parallel to the third side, half as long.</li>
    </ul>` },

  { id: "ge-quad", group: "Geometry", title: "3.4 Quadrilaterals", pdf: "Review p.102–105", html: `
    <table class="study-table"><tr><th>Shape</th><th>Area</th><th>Notes</th></tr>
      <tr><td>Rectangle</td><td>l × w</td><td>Diagonal √(l² + w²); diagonals equal</td></tr>
      <tr><td>Square</td><td>s² = d²/2</td><td>Diagonal s√2</td></tr>
      <tr><td>Parallelogram</td><td>base × height</td><td>Opposite sides and angles equal; diagonals bisect each other</td></tr>
      <tr><td>Rhombus</td><td>½ d₁d₂</td><td>All sides equal; diagonals perpendicular</td></tr>
      <tr><td>Trapezoid</td><td>½(b₁ + b₂)h</td><td>One pair of parallel sides</td></tr></table>
    <p>Perimeter = sum of the sides. Height is perpendicular, not the slanted side.</p>` },

  { id: "ge-circles", group: "Geometry", title: "3.5 Circles", pdf: "Review p.106–111", html: `
    <ul>
      <li><b>Circumference C = 2πr = πd. Area A = πr².</b> Diameter is twice the radius.</li>
      <li><b>Arc length</b> = (θ/360) × 2πr. <b>Sector area</b> = (θ/360) × πr². (Fraction of the circle = central angle ÷ 360.)</li>
      <li><b>Inscribed angle</b> = ½ the central angle on the same arc. An angle inscribed in a semicircle is 90°. Triangle inscribed with the diameter as a side is a right triangle.</li>
      <li><b>Tangent</b> is perpendicular to the radius at the point of tangency. Tangents from one outside point are equal in length.</li>
      <li>Chord: segment joining two points on the circle; the perpendicular from the center bisects it.</li>
      <li>Concentric circles share a center. Annulus (ring) area = π(R² − r²).</li>
    </ul>` },

  { id: "ge-3d", group: "Geometry", title: "3.6 Three-Dimensional Figures", pdf: "Review p.112–114", html: `
    <table class="study-table"><tr><th>Solid</th><th>Volume</th><th>Surface area</th></tr>
      <tr><td>Rectangular box</td><td>lwh</td><td>2(lw + lh + wh)</td></tr>
      <tr><td>Cube</td><td>s³</td><td>6s²</td></tr>
      <tr><td>Cylinder</td><td>πr²h</td><td>2πr² + 2πrh</td></tr>
      <tr><td>Sphere*</td><td>(4/3)πr³</td><td>4πr²</td></tr>
      <tr><td>Cone*</td><td>(1/3)πr²h</td><td>πr² + πrℓ</td></tr></table>
    <p class="small muted">* Extra reference: the ETS review covers boxes, cubes and cylinders; sphere and cone formulas would be given in a question.</p>
    <ul><li>Space diagonal of a box = √(l² + w² + h²). Volume scales with the cube of the linear scale factor.</li></ul>` },

  /* ================================ DATA ANALYSIS =============================== */
  { id: "da-present", group: "Data Analysis", title: "4.1 Methods for Presenting Data", pdf: "Review p.125–138", html: `
    <ul>
      <li><b>Frequency tables</b> and <b>relative frequency</b> (frequency ÷ total; sums to 1 or 100%). <b>Cumulative frequency</b> adds up to a value.</li>
      <li><b>Bar graphs</b> (compare categories), <b>histograms</b> (bars touching, intervals; the area/height shows frequency), <b>line graphs</b> (trends over time), <b>scatterplots</b> (two variables; look for trend, outliers), <b>circle graphs</b> (parts of 100%; angle = percent × 360°), <b>boxplots</b> (min, Q1, median, Q3, max), <b>stem-and-leaf plots</b>.</li>
      <li>Check axis scales and whether they start at zero. Identify units (thousands? percent?).</li>
      <li>Lines of best fit estimate trends; a point above the line is above prediction.</li>
    </ul>` },

  { id: "da-num", group: "Data Analysis", title: "4.2 Numerical Methods for Describing Data", pdf: "Review p.139–148", html: `
    <ul>
      <li><b>Mean</b> = sum/n. <b>Weighted mean</b> = Σ(value × weight)/Σweights. Sum = mean × n; use that to adjust averages when a value is added or removed.</li>
      <li><b>Median, mode, range, quartiles, IQR</b> as defined in the Conventions. Outliers move the mean more than the median.</li>
      <li><b>Standard deviation:</b> (1) find the mean, (2) square each deviation, (3) average the squares, (4) take the square root. Adding a constant to every value leaves the SD unchanged; multiplying by k multiplies the SD by |k|.</li>
      <li>If a value equals the mean, it adds no spread. More spread from the mean ⇒ larger SD.</li>
      <li><b>z-score</b> = (x − mean)/SD: the number of SDs from the mean.</li>
    </ul>` },

  { id: "da-count", group: "Data Analysis", title: "4.3 Counting Methods", pdf: "Review p.149–156", html: `
    <ul>
      <li><b>Multiplication principle:</b> independent stages multiply (3 shirts × 4 pants = 12 outfits).</li>
      <li><b>Permutations</b> (order matters): arrangements of n distinct items = <b>n!</b>. Choosing k in order: n!/(n−k)!.</li>
      <li><b>Combinations</b> (order doesn't matter): <span class="formula">C(n, k) = n! / (k!(n − k)!)</span> C(5,2) = 10. C(n, k) = C(n, n−k).</li>
      <li>Arrangements with repeats: n!/(a!·b!…). Circular arrangements: (n − 1)!.</li>
      <li>"At least one" → use the complement: total − none.</li>
      <li>Venn diagrams / inclusion–exclusion for overlapping groups (see Algebra applications).</li>
    </ul>` },

  { id: "da-prob", group: "Data Analysis", title: "4.4 Probability", pdf: "Review p.157–163", html: `
    <ul>
      <li><b>P(E) = favorable ÷ total</b> (equally likely). 0 ≤ P ≤ 1. <b>P(not E) = 1 − P(E).</b></li>
      <li><b>P(E or F) = P(E) + P(F) − P(E and F).</b> Mutually exclusive: just add.</li>
      <li><b>Independent:</b> P(E and F) = P(E)·P(F). Dependent (e.g. without replacement): P(E and F) = P(E)·P(F | E).</li>
      <li><b>Conditional:</b> P(F | E) = P(E and F)/P(E).</li>
      <li>"At least one" = 1 − P(none). Two dice: 36 outcomes; sum 7 has 6 ways (1/6). n flips: 2<sup>n</sup> outcomes.</li>
      <li>Expected value = Σ value × probability.</li>
    </ul>` },

  { id: "da-dist", group: "Data Analysis", title: "4.5 Distributions, Random Variables & Probability Distributions", pdf: "Review p.164–179", html: `
    <ul>
      <li><b>Discrete random variable:</b> list of values with probabilities summing to 1. Mean = Σ x·P(x).</li>
      <li><b>Binomial</b> (n independent trials, success p): P(k successes) = C(n,k)p<sup>k</sup>(1−p)<sup>n−k</sup>; mean = np.</li>
      <li><b>Normal distribution:</b> symmetric bell; mean = median = mode. <b>Empirical rule:</b> ≈ 68% within 1 SD, ≈ 95% within 2 SD, ≈ 99.7% within 3 SD. Standard normal: mean 0, SD 1 (z-scores).</li>
      <li>Probability for continuous variables = area under the curve; P(X = a) = 0 for a single point. Total area = 1.</li>
      <li>Skew: a long right tail pulls the mean above the median.</li>
      <li>Sampling: random samples are representative; larger samples vary less.</li>
    </ul>` },

  { id: "da-interp", group: "Data Analysis", title: "4.6 Data Interpretation Examples", pdf: "Review p.180–184", html: `
    <ul>
      <li>Read titles, axes, units, legends and footnotes first. Note whether values are counts, percents, or in thousands/millions.</li>
      <li>Estimate when the answer choices are far apart. Percent change = difference ÷ <b>original</b>.</li>
      <li><b>Each question stands alone</b>, and use only what the display shows.</li>
      <li>Convert circle-graph percents to amounts using the stated total. A percent of a percent needs the base of each.</li>
      <li>Watch for traps: bars compared across different scales, percents with different bases, and truncated axes.</li>
    </ul>` }
];
