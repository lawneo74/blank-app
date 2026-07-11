# 🐍 Code Quest — Learn Python!

A friendly, browser-based Python adventure for kids. No install, no account,
no server — everything runs locally in the browser using
[Pyodide](https://pyodide.org) (real Python via WebAssembly).

## What's inside

8 islands take a learner from `print()` all the way to a turtle-graphics
capstone, combining loops and functions to draw shapes:

1. Say Hello — `print()`
2. Boxes for Stuff — variables (`str`, `int`, `bool`)
3. Ask & Answer — `input()`
4. Yes or No — conditionals
5. Do It Again — loops
6. Collections — lists
7. Your Own Commands — functions
8. Capstone: Turtle Art — loops + functions + canvas-based turtle graphics

Every lesson follows the same four steps: a plain-language explanation with
an analogy, a worked example you can run as-is, a hands-on challenge with a
real Python editor, and immediate, kid-friendly feedback (no raw Python
tracebacks — errors are translated into friendly hints).

Progress (points, badges, unlocked islands) is saved to `localStorage`, so it
survives a page refresh.

## Running it locally

This is a static site — no build step, no bundler. Serve the folder with any
static file server and open it in a browser, for example:

```
python3 -m http.server 8000
```

Then visit `http://localhost:8000/`.

The Pyodide runtime and CodeMirror editor are vendored locally under
`vendor/` (no CDN dependency), and a service worker (`sw.js`) precaches the
whole app on first load so it keeps working fully offline afterwards.

## Project layout

- `index.html` — app shell
- `css/styles.css` — bright, kid-friendly, responsive styling
- `js/` — app logic (routing, Pyodide runner, error translator, lesson
  content, map/lesson views, confetti, progress persistence)
- `python/turtle_shim.py` — canvas-based `turtle` module shim (real
  `turtle` needs tkinter, which isn't available in Pyodide)
- `vendor/` — locally vendored Pyodide runtime and CodeMirror
- `sw.js` — offline service worker
