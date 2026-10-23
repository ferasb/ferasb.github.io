// The projects as a 3D ring of cards (README): built from the <article class="project"> list, which
// stays the page's content. Without JavaScript, or for visitors who ask for less motion, the list is
// simply shown as it is. The cards are pictures; the front project's article shows under the ring.
//
// The ring turns slowly by itself, pausing while the pointer is over it, while it has keyboard focus,
// and for a few seconds after the visitor drags, swipes, clicks or presses an arrow key; then it eases
// back into its spin. The pause button stops it until pressed again (WCAG 2.2.2: anything that moves
// for more than five seconds needs a way to stop it). With fewer
// than six projects each one appears more than once, so the ring never looks empty.
(() => {
  /** At least this many cards around the ring. */
  const MIN_CARDS = 6;
  /** Auto-spin speed, in degrees a second: a card every ~7 s with six. */
  const SPIN = 360 / 42;
  /** After the visitor does something, the ring holds still this long before spinning again. */
  const IDLE_MS = 4000;
  /** Seconds the spin takes to get back to full speed. */
  const EASE_IN = 1.5;
  /** A pointer that moves less than this is a click, not a drag. */
  const CLICK_PX = 6;
  const TURN_MS = 650;
  /** How far the ring is tipped toward the visitor, in degrees. */
  const TILT = -7;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  document.addEventListener("DOMContentLoaded", () => {
    const list = document.querySelector("[data-carousel]");
    const projects = list ? [...list.querySelectorAll(":scope > .project")] : [];
    if (projects.length < 2) return;
    build(list, projects);
  });

  function build(list, projects) {
    const n = projects.length;
    const slots = n >= MIN_CARDS ? n : n * Math.ceil(MIN_CARDS / n);
    const step = 360 / slots;
    const names = projects.map((p) => p.querySelector("h3").textContent.trim());

    const carousel = document.createElement("div");
    carousel.className = "carousel";
    carousel.setAttribute("role", "region");
    carousel.setAttribute("aria-roledescription", "carousel");
    carousel.setAttribute("aria-label", "Projects");

    // The ring: pictures only, hidden from screen readers (the articles below are the content).
    const stage = document.createElement("div");
    stage.className = "stage";
    stage.setAttribute("aria-hidden", "true");
    const ring = document.createElement("div");
    ring.className = "ring";
    stage.append(ring);

    const cards = [];
    for (let i = 0; i < slots; i++) {
      const project = projects[i % n];
      const card = document.createElement("a");
      card.className = "card";
      card.href = project.querySelector("h3 a").href;
      card.tabIndex = -1;
      card.draggable = false;
      for (const img of project.querySelectorAll(":scope > a img")) {
        const copy = img.cloneNode();
        copy.loading = "eager";
        copy.draggable = false;
        card.append(copy);
      }
      const title = document.createElement("span");
      title.className = "card-title";
      title.textContent = names[i % n];
      card.append(title);
      ring.append(card);
      cards.push(card);
    }

    // The controls: previous, a dot per project, next.
    const controls = document.createElement("div");
    controls.className = "controls";
    const arrow = (label, text, delta) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "button arrow";
      b.setAttribute("aria-label", label);
      b.textContent = text;
      b.addEventListener("click", () => turnBy(delta));
      return b;
    };
    const dots = names.map((name, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "dot";
      b.setAttribute("aria-label", `Show ${name}`);
      b.addEventListener("click", () => turnTo(i));
      return b;
    });
    const dotRow = document.createElement("div");
    dotRow.className = "dots";
    dotRow.append(...dots);

    // Pause and play: two icons, one shown at a time (style.css), the label saying what a press does.
    const svg = (paths) => {
      const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      icon.setAttribute("viewBox", "0 0 24 24");
      icon.setAttribute("aria-hidden", "true");
      for (const d of paths) {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", d);
        icon.append(path);
      }
      return icon;
    };
    const pauseButton = document.createElement("button");
    pauseButton.type = "button";
    pauseButton.className = "button arrow pause";
    const pauseIcon = svg(["M8 5v14", "M16 5v14"]);
    pauseIcon.classList.add("icon-pause");
    const playIcon = svg(["M8 5l11 7-11 7z"]);
    playIcon.classList.add("icon-play");
    pauseButton.append(pauseIcon, playIcon);
    const showPaused = () => {
      pauseButton.classList.toggle("paused", paused);
      pauseButton.setAttribute("aria-label", paused ? "Start the rotation" : "Stop the rotation");
      pauseButton.title = paused ? "Start the rotation" : "Stop the rotation";
    };
    pauseButton.addEventListener("click", () => {
      paused = !paused;
      showPaused();
    });

    controls.append(arrow("Previous project", "‹", -1), dotRow, arrow("Next project", "›", 1), pauseButton);

    // The front project's article. Its own screenshot is hidden here (the ring shows it). All the
    // articles share one spot, sized to the tallest, so the page doesn't jump as the ring turns.
    const detail = document.createElement("div");
    detail.className = "detail";
    detail.append(...projects);

    carousel.append(stage, controls, detail);
    list.replaceWith(carousel);

    // --- State -------------------------------------------------------------------------------

    /** The ring's turn, in degrees; card i faces the visitor when angle = i × step (mod 360). */
    let angle = 0;
    let tween = null; // { from, to, start }
    let drag = null; // { x, angle, moved, lastX, lastT, v }
    let hovering = false;
    /** Stopped with the pause button, until it's pressed again. */
    let paused = false;
    let heldUntil = 0;
    let shown = -1;

    const hold = () => (heldUntil = performance.now() + IDLE_MS);
    // Keyboard focus holds it (someone is reading or stepping through); focus left on a button by a
    // mouse click doesn't, or a click would stop the ring for good.
    const keyboardFocus = () => carousel.querySelector(":focus-visible") !== null;
    const spinning = () => !paused && !drag && !tween && !hovering && !keyboardFocus() && performance.now() > heldUntil;
    const frontSlot = () => ((Math.round(angle / step) % slots) + slots) % slots;

    function layout() {
      const width = cards[0].offsetWidth;
      // Far enough out that neighbours don't touch, plus a little air.
      const radius = width / 2 / Math.tan(Math.PI / slots) + width * 0.08;
      cards.forEach((card, i) => {
        card.style.transform = `rotateY(${i * step}deg) translateZ(${radius}px)`;
      });
      ring.style.setProperty("--radius", `${radius}px`);
      render();
    }

    function render() {
      // Pushed back by the radius (so the front card is at its real size), and tipped a little, so the
      // ring is seen from just above.
      ring.style.transform = `translateZ(calc(-1 * var(--radius))) rotateX(${TILT}deg) rotateY(${-angle}deg)`;
      // Cards fade as they turn away; the ones behind are hidden by backface-visibility.
      cards.forEach((card, i) => {
        const rel = ((((i * step - angle) % 360) + 540) % 360) - 180;
        const facing = Math.cos((rel * Math.PI) / 180);
        card.style.opacity = String(Math.max(0, 0.25 + 0.75 * facing));
        card.classList.toggle("front", Math.abs(rel) < step / 2);
      });
      const project = frontSlot() % n;
      if (project !== shown) {
        shown = project;
        projects.forEach((p, i) => p.classList.toggle("inactive", i !== project));
        dots.forEach((d, i) => d.setAttribute("aria-current", i === project ? "true" : "false"));
      }
      // Announce the project only when it changes because the visitor asked, not while spinning.
      detail.setAttribute("aria-live", spinning() ? "off" : "polite");
    }

    function animateTo(target) {
      tween = { from: angle, to: target, start: performance.now() };
      hold();
    }

    /** One card forward or back. */
    function turnBy(delta) {
      animateTo((Math.round(angle / step) + delta) * step);
    }

    /** The nearest way round to this card: the one clicked turns to the front from its own side. */
    function slotTarget(slot) {
      const base = slot * step;
      return base + 360 * Math.round((angle - base) / 360);
    }

    /**
     * The nearest card showing this project (a dot). With copies on both sides the two are equally
     * near: then forward, the way the ring spins and › turns.
     */
    function turnTo(project) {
      let best = null;
      for (let s = project; s < slots; s += n) {
        const target = slotTarget(s);
        const d = target - angle;
        const bestD = best === null ? Infinity : best - angle;
        if (Math.abs(d) < Math.abs(bestD) - 0.5 || (Math.abs(Math.abs(d) - Math.abs(bestD)) <= 0.5 && d > 0)) best = target;
      }
      animateTo(best);
    }

    let last = performance.now();
    /** The spin's current speed: it eases back up to SPIN after a pause. */
    let speed = SPIN;
    function frame(now) {
      // Capped, so coming back to a background tab doesn't jump the ring.
      const dt = Math.min(now - last, 50) / 1000;
      last = now;
      if (tween) {
        const t = Math.min(1, (now - tween.start) / TURN_MS);
        angle = tween.from + (tween.to - tween.from) * (1 - (1 - t) ** 3);
        if (t === 1) tween = null;
      } else if (spinning()) {
        speed = Math.min(SPIN, speed + (SPIN / EASE_IN) * dt);
        angle += speed * dt;
      }
      if (!spinning()) speed = 0;
      render();
      requestAnimationFrame(frame);
    }

    // --- Input -------------------------------------------------------------------------------

    stage.addEventListener("pointerenter", (e) => e.pointerType === "mouse" && (hovering = true));
    stage.addEventListener("pointerleave", () => (hovering = false));
    detail.addEventListener("pointerenter", (e) => e.pointerType === "mouse" && (hovering = true));
    detail.addEventListener("pointerleave", () => (hovering = false));

    /** How far the last press moved: the click that follows a drag isn't a click. */
    let lastMoved = 0;
    stage.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      tween = null;
      lastMoved = 0;
      drag = { x: e.clientX, angle, moved: 0, lastX: e.clientX, lastT: e.timeStamp, v: 0, captured: false };
    });
    stage.addEventListener("pointermove", (e) => {
      if (!drag) return;
      const width = cards[0].offsetWidth;
      const dx = e.clientX - drag.x;
      drag.moved = Math.max(drag.moved, Math.abs(dx));
      // Captured only once it's a drag: a plain click must still land on the card's link.
      if (!drag.captured && drag.moved >= CLICK_PX) {
        stage.setPointerCapture(e.pointerId);
        drag.captured = true;
      }
      // Dragging one card's width turns the ring by one card.
      angle = drag.angle - (dx / width) * step;
      const dt = e.timeStamp - drag.lastT;
      if (dt > 0) drag.v = (e.clientX - drag.lastX) / dt;
      drag.lastX = e.clientX;
      drag.lastT = e.timeStamp;
    });
    const endDrag = () => {
      if (!drag) return;
      const { moved, v } = drag;
      drag = null;
      lastMoved = moved;
      hold();
      if (moved < CLICK_PX) return;
      // A flick carries on a little, then settles on the nearest card.
      const width = cards[0].offsetWidth;
      const coast = (-v * 250 * step) / width;
      animateTo(Math.round((angle + coast) / step) * step);
    };
    stage.addEventListener("pointerup", endDrag);
    stage.addEventListener("pointercancel", endDrag);

    // A click (not a drag) on the front card opens the project; on another card, turns to it.
    cards.forEach((card, i) => {
      card.addEventListener("click", (e) => {
        if (lastMoved >= CLICK_PX || !card.classList.contains("front")) {
          e.preventDefault();
          if (lastMoved < CLICK_PX) animateTo(slotTarget(i));
        }
      });
    });

    carousel.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        turnBy(e.key === "ArrowLeft" ? -1 : 1);
      }
    });

    showPaused();
    window.addEventListener("resize", layout);
    // The screenshots set the cards' height: lay out again once one has loaded.
    cards[0].querySelector("img")?.addEventListener("load", layout, { once: true });
    layout();
    requestAnimationFrame(frame);
  }
})();
