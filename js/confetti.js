/* Code Quest — lightweight canvas confetti burst, no external library. */
(function (global) {
  let canvas = null;
  let ctx = null;
  let animId = null;

  function resize() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function burst(duration) {
    canvas = document.getElementById("confetti-canvas");
    if (!canvas) return;
    ctx = canvas.getContext("2d");
    resize();
    canvas.classList.remove("hidden");

    const colors = ["#ff6fa5", "#ffd93d", "#4aa8ff", "#2ecc71", "#ff9f43", "#6c5ce7"];
    const particles = [];
    const count = 140;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * canvas.height * 0.5,
        vx: (Math.random() - 0.5) * 3,
        vy: 2 + Math.random() * 3,
        size: 6 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.3,
      });
    }

    const total = duration || 2200;
    const start = performance.now();

    function frame(now) {
      const elapsed = now - start;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });
      if (elapsed < total) {
        animId = requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.classList.add("hidden");
      }
    }

    if (animId) cancelAnimationFrame(animId);
    animId = requestAnimationFrame(frame);
  }

  window.addEventListener("resize", resize);

  global.CodeQuestConfetti = { burst };
})(window);
