/* Code Quest — service worker. Precaches the entire app (including the
   Pyodide runtime and CodeMirror, both vendored locally) so the quest
   works fully offline after the first visit. */
const CACHE_VERSION = "codequest-v1";

const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/styles.css",
  "./js/progress.js",
  "./js/error-translator.js",
  "./js/pyodide-runner.js",
  "./js/turtle-canvas.js",
  "./js/confetti.js",
  "./js/lessons-data.js",
  "./js/map-view.js",
  "./js/lesson-view.js",
  "./js/main.js",
  "./python/turtle_shim.py",
  "./vendor/pyodide/pyodide.js",
  "./vendor/pyodide/pyodide.mjs",
  "./vendor/pyodide/pyodide.asm.js",
  "./vendor/pyodide/pyodide.asm.wasm",
  "./vendor/pyodide/python_stdlib.zip",
  "./vendor/pyodide/pyodide-lock.json",
  "./vendor/codemirror/lib/codemirror.js",
  "./vendor/codemirror/lib/codemirror.css",
  "./vendor/codemirror/mode/python/python.js",
  "./vendor/codemirror/addon/edit/matchbrackets.js",
  "./vendor/codemirror/theme/dracula.css",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          if (response && response.ok && response.type === "basic") {
            const clone = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          if (event.request.mode === "navigate") {
            return caches.match("./index.html");
          }
          return undefined;
        });
    })
  );
});
