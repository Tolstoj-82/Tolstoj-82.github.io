(() => {
  "use strict";
  const storageKey = "qr-generator.theme";
  const root = document.documentElement;
  const system = window.matchMedia("(prefers-color-scheme: dark)");
  let preference = null;
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === "light" || saved === "dark") preference = saved;
  } catch { /* The theme also works without browser storage. */ }
  function apply() {
    root.dataset.theme = preference || (system.matches ? "dark" : "light");
    const button = document.getElementById("themeToggle");
    if (!button) return;
    const label = root.lang === "en" ? "Dark mode" : "Dunkelmodus";
    button.setAttribute("aria-pressed", String(root.dataset.theme === "dark"));
    button.setAttribute("aria-label", label);
    button.title = label;
  }
  // Runs before the stylesheets so a saved dark theme does not flash light.
  apply();
  system.addEventListener("change", () => { if (!preference) apply(); });
  window.addEventListener("storage", event => {
    if (event.key !== storageKey && event.key !== null) return;
    preference = ["light", "dark"].includes(event.newValue) ? event.newValue : null;
    apply();
  });
  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("themeToggle").addEventListener("click", () => {
      preference = root.dataset.theme === "dark" ? "light" : "dark";
      try { localStorage.setItem(storageKey, preference); } catch { /* Optional preference. */ }
      apply();
    });
    new MutationObserver(apply).observe(root, {attributes:true, attributeFilter:["lang"]});
    apply();
  });
})();
