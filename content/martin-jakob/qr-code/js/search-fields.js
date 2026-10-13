(() => {
  "use strict";
  const { t } = window.QRGenerator.i18n;
  function enhance() {
    if (!window.document) return;
    for (const button of document.querySelectorAll(".search-clear")) {
      button.setAttribute("aria-label", t("Suche leeren"));
      button.title = t("Suche leeren");
    }
    for (const input of document.querySelectorAll('input[type="search"]')) {
      if (input.dataset.clearable) return;
      input.dataset.clearable = "true";
      const wrap = document.createElement("span");
      wrap.className = "clearable-search";
      input.before(wrap);
      wrap.append(input);
      const clear = document.createElement("button");
      clear.type = "button";
      clear.className = "search-clear";
      clear.textContent = "×";
      clear.setAttribute("aria-label", t("Suche leeren"));
      clear.title = t("Suche leeren");
      wrap.append(clear);
      const update = () => {
        clear.hidden = !input.value;
      };
      input.addEventListener("input", update);
      clear.addEventListener("click", () => {
        input.value = "";
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.focus();
        update();
      });
      update();
    }
  }
  new MutationObserver(enhance).observe(document.body, {
    childList: true,
    subtree: true,
  });
  enhance();
})();
