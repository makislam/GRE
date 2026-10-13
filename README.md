# GRE Practice

A self-contained GRE General Test practice site. Open `index.html` in a browser: no install, no server, works offline. Progress is saved in your browser's localStorage.

## Test format (matches the current, shorter GRE)

| Section | Questions | Time |
|---|---|---|
| Analytical Writing: Analyze an Issue | 1 essay | 30 min |
| Verbal Reasoning, Section 1 | 12 | 18 min |
| Verbal Reasoning, Section 2 (adaptive) | 15 | 23 min |
| Quantitative Reasoning, Section 1 | 12 | 21 min |
| Quantitative Reasoning, Section 2 (adaptive) | 15 | 26 min |

- The full test runs Writing first, then the Verbal and Quant sections in mixed order.
- The second section of each measure is easier or harder depending on how you did on the first.
- Test-day tools: Back/Next, Mark, Review (status of every question), Hide Time, Exit Section, Help, an on-screen calculator with order of operations, memory and Transfer Display, and an essay editor with Cut/Copy/Paste/Undo/Redo and no spell-check.
- Question types:
  - Verbal: Text Completion (1–3 blanks), Sentence Equivalence, and Reading Comprehension (single answer, select-all, select-in-passage, and argument questions).
  - Quant: Quantitative Comparison, multiple choice (one answer, or one or more), numeric entry (decimal and fraction), and data interpretation sets.
- Scores are estimated on the 130–170 scale. You self-score essays against a 0–6 rubric.
- Time accommodations (+50% or +100%) or untimed mode.

## Other modes

- **Custom Practice**: pick question types, Quant topics, difficulty, length, and timing. Feedback comes after each question or at the end. Quant can top up with auto-generated questions, so it never runs out.
- **Mistake Review**: retry anything you got wrong.
- **Vocabulary**: flashcards, quizzes and a searchable list of the ~1,000 words from both study lists, with mastery tracking and stars.
- **Progress**: score history, accuracy by question type and Quant topic, and saved essays.

## Files

```
index.html             entry point
css/style.css          styles
js/app.js              test engine, drills, vocab, history
js/quantgen.js         procedural Quant question generators
data/vocab.js          vocabulary (window.VOCAB)
data/writing.js        Issue prompts + scoring rubric
data/verbal_tc_se.js   Text Completion + Sentence Equivalence
data/verbal_rc.js      Reading Comprehension passages
data/quant.js          Quant questions + data-interpretation sets
data/math_study.js     Math Study notes (from the ETS Math Review + Math Conventions PDFs)
```

To add questions, append objects in the same shape as the existing ones in the `data/` files.

All questions and prompts are original practice material. This project is not affiliated with or endorsed by ETS. GRE® is a registered trademark of ETS.
