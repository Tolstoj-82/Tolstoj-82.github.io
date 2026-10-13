(() => {
  "use strict";
  const { t } = window.QRGenerator.i18n;
  let active = false;
  function choose(entries, title) {
    if (active || !entries.length) return Promise.resolve([]);
    active = true;
    // Keep the selected export stable even if the library changes later.
    const items = structuredClone(entries);
    const dialog = document.createElement("dialog");
    dialog.className = "template-export-dialog modal-frame";
    dialog.setAttribute("aria-labelledby", "templateExportHeading");
    const header = document.createElement("div");
    header.className = "preview-header";
    const heading = document.createElement("h2");
    heading.id = "templateExportHeading";
    heading.textContent = t(title);
    const close = document.createElement("button");
    close.type = "button";
    close.className = "modal-close";
    close.textContent = "×";
    close.setAttribute("aria-label", t("Schliessen"));
    header.append(heading, close);
    const body = document.createElement("div");
    body.className = "modal-scroll-body";
    const allLabel = document.createElement("label");
    allLabel.className = "export-select-all";
    const all = document.createElement("input");
    all.type = "checkbox";
    all.checked = true;
    allLabel.append(all, document.createTextNode(t("Alle auswählen")));
    const list = document.createElement("div");
    list.className = "template-export-list";
    const checks = items.map((item) => {
      const row = document.createElement("label");
      row.className = "template-export-option";
      const check = document.createElement("input");
      check.type = "checkbox";
      check.checked = true;
      const name = document.createElement("span");
      name.textContent = item.name;
      row.append(check, name);
      if (item.kind) {
        const kind = document.createElement("small");
        kind.textContent = t(
          item.kind === "single" ? "Einzelner QR-Code" : "Massenexport",
        );
        row.append(kind);
      }
      list.append(row);
      return check;
    });
    const footer = document.createElement("div");
    footer.className = "template-export-footer";
    const count = document.createElement("p");
    count.setAttribute("role", "status");
    const actions = document.createElement("div");
    actions.className = "modal-actions";
    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.className = "action-button secondary";
    cancel.textContent = t("Abbrechen");
    const confirm = document.createElement("button");
    confirm.type = "button";
    confirm.className = "action-button";
    confirm.textContent = t("Auswahl exportieren");
    actions.append(cancel, confirm);
    footer.append(count, actions);
    body.append(allLabel, list);
    dialog.append(header, body, footer);
    document.body.append(dialog);
    function update() {
      const selected = checks.filter((check) => check.checked).length;
      all.checked = selected === checks.length;
      all.indeterminate = selected > 0 && selected < checks.length;
      confirm.disabled = !selected;
      count.textContent =
        selected + " / " + checks.length + " " + t("ausgewählt");
    }
    all.addEventListener("change", () => {
      checks.forEach((check) => {
        check.checked = all.checked;
      });
      update();
    });
    checks.forEach((check) => check.addEventListener("change", update));
    update();
    return new Promise((resolve) => {
      let finished = false;
      function finish(selected) {
        if (finished) return;
        finished = true;
        active = false;
        dialog.close();
        dialog.remove();
        resolve(selected);
      }
      close.addEventListener("click", () => finish([]));
      cancel.addEventListener("click", () => finish([]));
      dialog.addEventListener("cancel", (event) => {
        event.preventDefault();
        finish([]);
      });
      dialog.addEventListener("close", () => finish([]));
      confirm.addEventListener("click", () => {
        if (!confirm.disabled)
          finish(items.filter((item, index) => checks[index].checked));
      });
      dialog.showModal();
      all.focus();
    });
  }
  window.QRGenerator["template-export"] = { choose };
})();
