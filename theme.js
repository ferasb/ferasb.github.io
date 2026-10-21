// The color theme: the system's until the visitor picks light or dark with the theme button; the
// pick is kept in localStorage. A pick sets data-theme on <html>, which theme.css reads. Loaded in
// <head> without defer, so a picked theme applies before the page first paints.
(() => {
  const KEY = "theme";
  const root = document.documentElement;
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)");

  function load() {
    try {
      const value = localStorage.getItem(KEY);
      return value === "light" || value === "dark" ? value : null;
    } catch {
      return null;
    }
  }

  let picked = load();
  const current = () => picked ?? (systemDark.matches ? "dark" : "light");

  function apply() {
    if (picked) {
      root.dataset.theme = picked;
    } else {
      delete root.dataset.theme;
    }
    // The button shows the theme it switches to.
    const button = document.getElementById("theme-button");
    if (button) {
      const next = current() === "dark" ? "light" : "dark";
      const label = `Switch to the ${next} theme`;
      button.dataset.next = next;
      button.title = label;
      button.setAttribute("aria-label", label);
    }
  }

  function toggle() {
    picked = current() === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(KEY, picked);
    } catch {
      // Storage blocked: the pick lasts until the page closes.
    }
    apply();
  }

  apply();
  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("theme-button")?.addEventListener("click", toggle);
    apply();
  });
  // The system's theme changed (it only shows until a pick), or another tab picked one.
  systemDark.addEventListener("change", apply);
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) {
      picked = load();
      apply();
    }
  });
})();
