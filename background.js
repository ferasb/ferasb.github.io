// The background's constellation: small points drifting slowly, joined by faint lines while they're
// near each other. Each point fades from one of .constellation's four colors (style.css: grey, gold,
// red, green) to another, at its own pace; a line takes its first point's color. The colors are read
// again when the theme changes. Points near the mouse pointer link to it and drift away from it. With
// reduced motion it draws one still frame and ignores the pointer. Without this script the rest of the
// background still shows.
(() => {
  const LINK = 150; // points closer than this, in CSS pixels, are joined
  const SPEED = 0.12; // the fastest a point moves, in CSS pixels per frame
  const FADE = [360, 840]; // how long a point takes to change color, in frames (6 to 14 s at 60 fps)
  const REACH = 140; // points closer than this to the pointer, in CSS pixels, link to it and move off
  const PUSH = 0.6; // how far a point right at the pointer moves away, in CSS pixels per frame

  const canvas = document.createElement("canvas");
  canvas.className = "constellation";
  canvas.setAttribute("aria-hidden", "true");
  document.body.append(canvas);
  const ctx = canvas.getContext("2d");
  const still = window.matchMedia("(prefers-reduced-motion: reduce)");

  let width = 0;
  let height = 0;
  let colors = [];
  let points = [];
  let frame = 0;
  let pointer = null; // the mouse's position, while it's over the page

  // Any of the four colors but this one.
  function other(index) {
    return (index + 1 + Math.floor(Math.random() * 3)) % 4;
  }

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    // About one point per 16,000 square pixels: ~60 on a laptop, ~25 on a phone.
    const count = Math.max(20, Math.min(90, Math.round((width * height) / 16000)));
    points = Array.from({ length: count }, () => {
      const from = Math.floor(Math.random() * 4);
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() * 2 - 1) * SPEED,
        vy: (Math.random() * 2 - 1) * SPEED,
        r: 0.8 + Math.random() * 1.1,
        from,
        to: other(from),
        t: Math.random(),
        rate: 1 / (FADE[0] + Math.random() * (FADE[1] - FADE[0])),
      };
    });
  }

  // Draws with a point's color partway through its fade: the old color fading out, the new one in.
  function paint(p, alpha, path) {
    for (const [index, weight] of [[p.from, 1 - p.t], [p.to, p.t]]) {
      ctx.globalAlpha = alpha * weight;
      ctx.fillStyle = ctx.strokeStyle = colors[index];
      path();
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 0.6;
    for (let i = 0; i < points.length; i++) {
      const a = points[i];
      for (let j = i + 1; j < points.length; j++) {
        const b = points[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK) {
          paint(a, (1 - d / LINK) * 0.35, () => {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          });
        }
      }
    }
    if (pointer) {
      for (const p of points) {
        const d = Math.hypot(p.x - pointer.x, p.y - pointer.y);
        if (d < REACH) {
          paint(p, (1 - d / REACH) * 0.5, () => {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.stroke();
          });
        }
      }
    }
    for (const p of points) {
      paint(p, 0.7, () => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }

  // Points leaving one edge come back at the opposite one, and near the pointer are pushed away from
  // it, harder the closer they are. A point done fading picks its next color.
  function step() {
    for (const p of points) {
      let { vx, vy } = p;
      if (pointer) {
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const d = Math.hypot(dx, dy);
        if (d > 0 && d < REACH) {
          const push = (1 - d / REACH) * PUSH;
          vx += (dx / d) * push;
          vy += (dy / d) * push;
        }
      }
      p.x = (p.x + vx + width) % width;
      p.y = (p.y + vy + height) % height;
      p.t += p.rate;
      if (p.t >= 1) {
        p.from = p.to;
        p.to = other(p.from);
        p.t = 0;
      }
    }
    draw();
    frame = requestAnimationFrame(step);
  }

  function start() {
    cancelAnimationFrame(frame);
    if (still.matches) draw();
    else frame = requestAnimationFrame(step);
  }

  function readColors() {
    const style = getComputedStyle(canvas);
    colors = [1, 2, 3, 4].map((n) => style.getPropertyValue(`--dot-${n}`).trim());
    if (still.matches) draw();
  }

  resize();
  readColors();
  start();
  window.addEventListener("resize", () => {
    resize();
    if (still.matches) draw();
  });
  still.addEventListener("change", start);
  // A mouse only: on a touch screen the pointer is a finger, gone as soon as it lifts.
  window.addEventListener("pointermove", (e) => {
    pointer = e.pointerType === "mouse" && !still.matches ? { x: e.clientX, y: e.clientY } : null;
  });
  document.documentElement.addEventListener("pointerleave", () => {
    pointer = null;
  });
  // A theme pick sets data-theme on <html>; otherwise the system's theme can change.
  new MutationObserver(readColors).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", readColors);
})();
