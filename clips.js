// The projects' clips: hovering a screenshot plays its short recording over it, from the start; leaving
// stops it. Only where style.css shows the clip at all (the dark theme, a mouse, no reduced motion), so
// elsewhere the screenshot stays and the clip is never downloaded (preload="none").
document.querySelectorAll(".shot").forEach((shot) => {
  const clip = shot.querySelector("video");
  if (!clip) return;
  shot.addEventListener("pointerenter", () => {
    if (getComputedStyle(clip).display === "none") return;
    clip.currentTime = 0;
    clip.play().then(
      () => shot.classList.add("playing"),
      () => {}, // the browser refused (e.g. data saving): the screenshot stays
    );
  });
  shot.addEventListener("pointerleave", () => {
    clip.pause();
    shot.classList.remove("playing");
  });
});
