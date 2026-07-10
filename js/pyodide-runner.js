/* Code Quest — thin wrapper around Pyodide: loads the runtime locally (no CDN),
   captures stdout, wires input() to a browser prompt, and turns raw Python
   errors into friendly messages via CodeQuestErrorTranslator. */
(function (global) {
  let pyodideInstance = null;
  let readyPromise = null;
  let stdoutBuffer = [];
  let stderrBuffer = [];

  async function initPyodide(onProgress) {
    if (readyPromise) return readyPromise;
    readyPromise = (async () => {
      if (onProgress) onProgress("Loading Python engine...");
      pyodideInstance = await loadPyodide({ indexURL: "vendor/pyodide/" });

      pyodideInstance.setStdout({ batched: (msg) => stdoutBuffer.push(msg) });
      pyodideInstance.setStderr({ batched: (msg) => stderrBuffer.push(msg) });

      pyodideInstance.globals.set("_cq_input", (promptText) => {
        const val = window.prompt(promptText != null ? String(promptText) : "");
        return val === null ? "" : val;
      });

      await pyodideInstance.runPythonAsync(
        "import builtins\n" +
        "def _cq_input_wrapper(prompt=''):\n" +
        "    return _cq_input(prompt)\n" +
        "builtins.input = _cq_input_wrapper\n"
      );

      if (onProgress) onProgress("Ready!");
      return pyodideInstance;
    })();
    return readyPromise;
  }

  async function runCode(code, { setupPy } = {}) {
    await initPyodide();
    stdoutBuffer = [];
    stderrBuffer = [];
    try {
      if (setupPy) {
        await pyodideInstance.runPythonAsync(setupPy);
      }
      await pyodideInstance.runPythonAsync(code);
      return {
        success: true,
        stdout: stdoutBuffer.join("\n"),
      };
    } catch (err) {
      const rawMessage = err && err.message ? err.message : String(err);
      const translated = global.CodeQuestErrorTranslator.translate(rawMessage);
      return {
        success: false,
        stdout: stdoutBuffer.join("\n"),
        rawError: rawMessage,
        friendlyError: translated.friendly,
        errorType: translated.type,
      };
    }
  }

  global.CodeQuestPyodide = {
    init: initPyodide,
    run: (code) => runCode(code),
    runWithSetup: (code, setupPy) => runCode(code, { setupPy }),
    isReady: () => !!pyodideInstance,
  };
})(window);
