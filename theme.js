// The color theme: the system's by default, or the one the visitor picked with the theme button,
// kept in localStorage. A pick sets data-theme on <html>, which theme.css reads. Loaded in <head>
// without defer, so a picked theme applies before the page first paints.
(() => {
  const KEY = "theme";
  const NEXT = { system: "light", light: "dark", dark: "system" };
  const NAMES = { system: "match the system", light: "light", dark: "dark" };
  const root = document.documentElement;

  function load() {
    try {
      const value = localStorage.getItem(KEY);
      return value === "light" || value === "dark" ? value : "system";
    } catch {
      return "system";
    }
  }

  function apply(choice) {
    if (choice === "system") {
      delete root.dataset.theme;
    } else {
      root.dataset.theme = choice;
    }
    const button = document.getElementById("theme-button");
    if (button) {
      const label = `Theme: ${NAMES[choice]}. Click for ${NAMES[NEXT[choice]]}.`;
      button.dataset.choice = choice;
      button.title = label;
      button.setAttribute("aria-label", label);
    }
  }

  function choose(choice) {
    try {
      if (choice === "system") {
        localStorage.removeItem(KEY);
      } else {
        localStorage.setItem(KEY, choice);
      }
    } catch {
      // Storage blocked: the choice lasts until the page closes.
    }
    apply(choice);
  }

  apply(load());
  document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("theme-button");
    button?.addEventListener("click", () => choose(NEXT[button.dataset.choice] ?? "light"));
    apply(load());
  });
  // Another tab changed it.
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) {
      apply(load());
    }
  });
})();
