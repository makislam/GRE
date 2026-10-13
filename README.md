# GRE Practice

A self-contained GRE General Test practice site. Open `index.html` in a browser: no install, no server, works offline. Progress is saved in your browser's localStorage, and can sync across devices (see below).

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
server.js              optional local server: auto-saves and commits progress
css/style.css          styles
js/app.js              test engine, drills, vocab, history
js/quantgen.js         procedural Quant question generators
js/sync.js             progress save/load (server sync, export/import)
data/vocab.js          vocabulary (window.VOCAB)
data/writing.js        Issue prompts + scoring rubric
data/verbal_tc_se.js   Text Completion + Sentence Equivalence
data/verbal_rc.js      Reading Comprehension passages
data/quant.js          Quant questions + data-interpretation sets
data/math_study.js     Math Study notes (from the ETS Math Review + Math Conventions PDFs)
```

To add questions, append objects in the same shape as the existing ones in the `data/` files.

All questions and prompts are original practice material. This project is not affiliated with or endorsed by ETS. GRE® is a registered trademark of ETS.

## Running locally with auto-saved progress

```
node server.js            # http://localhost:8080
```

The server (no dependencies, needs Node and git) serves the site and writes your progress to `data/progress.json`. 30 seconds after your last change it commits just that file ("Update GRE progress"); stopping the server with Ctrl+C commits any pending changes first.

- `PUSH=1 node server.js` also pushes after each commit.
- `HOST=0.0.0.0 node server.js` lets your phone use it over the same Wi-Fi (`http://<laptop-ip>:8080`). There is no login, so use only trusted networks.
- `PORT=3000` changes the port.

## GitHub Pages / other devices

The site is also static, so it deploys to GitHub Pages as-is (Settings → Pages → deploy from `main`, root). A deployed copy merges the committed `data/progress.json` on load (newest change per item wins), so pushed progress shows up on any device. The deployed copy can't save back; use **Save / Load → Export / Import** there. Anyone who can see the repo can read `progress.json`, so use a private repo if your scores shouldn't be public.
