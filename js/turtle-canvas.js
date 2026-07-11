/* Code Quest — canvas-based turtle graphics backend.
   Pyodide's Python turtle shim (python/turtle_shim.py) calls into the
   functions here via `from js import CodeQuestTurtleAPI`, since Pyodide
   exposes browser globals as importable JS objects automatically.
   Two stacked canvases are used: a base layer that keeps permanent lines,
   and a transparent overlay that shows the turtle cursor (redrawn cheaply
   on every move without touching the drawn lines). */
(function (global) {
  const SIZE = 420;
  let baseCanvas = null;
  let overlayCanvas = null;
  let baseCtx = null;
  let overlayCtx = null;
  let bgColor = "#ffffff";
  let drewSomething = false;
  const originX = SIZE / 2;
  const originY = SIZE / 2;

  function findCanvases() {
    baseCanvas = document.getElementById("turtle-canvas");
    overlayCanvas = document.getElementById("turtle-canvas-overlay");
    baseCtx = baseCanvas ? baseCanvas.getContext("2d") : null;
    overlayCtx = overlayCanvas ? overlayCanvas.getContext("2d") : null;
    return !!(baseCtx && overlayCtx);
  }

  function toPixel(x, y) {
    return [originX + x, originY - y];
  }

  const api = {
    clear() {
      if (!findCanvases()) return;
      baseCtx.fillStyle = bgColor;
      baseCtx.fillRect(0, 0, SIZE, SIZE);
      overlayCtx.clearRect(0, 0, SIZE, SIZE);
      drewSomething = false;
    },

    setBg(color) {
      bgColor = color || "#ffffff";
      if (!findCanvases()) return;
      api.clear();
    },

    line(x1, y1, x2, y2, color, width) {
      if (!findCanvases()) return;
      const [px1, py1] = toPixel(x1, y1);
      const [px2, py2] = toPixel(x2, y2);
      baseCtx.strokeStyle = color || "#2b6cff";
      baseCtx.lineWidth = width || 3;
      baseCtx.lineCap = "round";
      baseCtx.beginPath();
      baseCtx.moveTo(px1, py1);
      baseCtx.lineTo(px2, py2);
      baseCtx.stroke();
      drewSomething = true;
    },

    writeText(x, y, text) {
      if (!findCanvases()) return;
      const [px, py] = toPixel(x, y);
      baseCtx.fillStyle = "#26264d";
      baseCtx.font = "bold 16px sans-serif";
      baseCtx.fillText(text, px, py);
      drewSomething = true;
    },

    hasDrawing() {
      return drewSomething;
    },

    drawTurtleIcon(x, y, headingDeg, visible) {
      if (!findCanvases()) return;
      overlayCtx.clearRect(0, 0, SIZE, SIZE);
      if (!visible) return;
      const [px, py] = toPixel(x, y);
      const rad = (-headingDeg * Math.PI) / 180;
      overlayCtx.save();
      overlayCtx.translate(px, py);
      overlayCtx.rotate(rad);
      overlayCtx.fillStyle = "#2ecc71";
      overlayCtx.strokeStyle = "#1e9e56";
      overlayCtx.lineWidth = 1.5;
      overlayCtx.beginPath();
      overlayCtx.moveTo(10, 0);
      overlayCtx.lineTo(-8, 6);
      overlayCtx.lineTo(-8, -6);
      overlayCtx.closePath();
      overlayCtx.fill();
      overlayCtx.stroke();
      overlayCtx.restore();
    },
  };

  global.CodeQuestTurtleAPI = api;
})(window);
