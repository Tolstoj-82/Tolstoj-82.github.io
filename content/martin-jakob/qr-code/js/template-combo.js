(() => {
  "use strict";
  const { t } = window.QRGenerator.i18n;
  function createTemplateCombo({
    host,
    id,
    getItems,
    choose,
    remove,
    save,
    placeholder = "Template auswählen oder benennen …",
    emptyText = "Neuer Name – mit Speichern als Template anlegen.",
    removeLabel = "Template löschen: ",
  }) {
    host.replaceChildren();
    host.classList.add("template-combo");
    const input = document.createElement("input");
    input.type = "text";
    input.id = id;
    input.maxLength = 80;
    input.autocomplete = "off";
    input.className = "template-name-input";
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-haspopup", "dialog");
    input.setAttribute("aria-autocomplete", "list");
    input.setAttribute("aria-expanded", "false");
    input.setAttribute("aria-controls", id + "Options");
    const arrow = document.createElement("button");
    arrow.type = "button";
    arrow.className = "template-dropdown-toggle";
    arrow.setAttribute("aria-label", t("Templates anzeigen"));
    const chevron = document.createElement("span");
    chevron.className = "template-chevron";
    chevron.setAttribute("aria-hidden", "true");
    arrow.append(chevron);
    const list = document.createElement("div");
    list.id = id + "Options";
    list.className = "template-suggestions";
    list.setAttribute("role", "dialog");
    list.setAttribute("aria-label", t("Templates"));
    list.hidden = true;
    const close = () => {
      list.hidden = true;
      input.setAttribute("aria-expanded", "false");
    };
    function render(filter = true) {
      input.placeholder = t(placeholder);
      arrow.setAttribute("aria-label", t("Templates anzeigen"));
      list.replaceChildren();
      const query = filter ? input.value.trim().toLocaleLowerCase() : "";
      for (const item of getItems().filter((item) =>
        item.name.toLocaleLowerCase().includes(query),
      )) {
        const row = document.createElement("div");
        row.className = "template-option";
        const option = document.createElement("button");
        option.type = "button";
        option.className = "template-choice";
        option.textContent = item.name;
        option.addEventListener("click", async () => {
          close();
          if ((await choose(item)) !== false) input.value = item.name;
        });
        const del = document.createElement("button");
        del.type = "button";
        del.className = "template-delete";
        del.textContent = "×";
        del.setAttribute("aria-label", t(removeLabel) + item.name);
        del.addEventListener("click", async () => {
          await remove(item);
          render(filter);
        });
        row.append(option, del);
        list.append(row);
      }
      if (!list.children.length) {
        const empty = document.createElement("span");
        empty.className = "template-empty";
        empty.textContent = t(emptyText);
        list.append(empty);
      }
    }
    const open = (filter = true) => {
      render(filter);
      list.hidden = false;
      input.setAttribute("aria-expanded", "true");
    };
    input.addEventListener("input", () => open());
    input.addEventListener("click", () => open(false));
    arrow.addEventListener("click", () =>
      list.hidden ? open(false) : close(),
    );
    host.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !list.hidden) {
        event.preventDefault();
        event.stopPropagation();
        close();
        input.focus();
      }
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        if (list.hidden) open(false);
        const options = [...list.querySelectorAll(".template-choice")];
        const index = options.indexOf(document.activeElement);
        options[
          index < 0
            ? event.key === "ArrowDown"
              ? 0
              : options.length - 1
            : (index + (event.key === "ArrowDown" ? 1 : -1) + options.length) %
              options.length
        ]?.focus();
      }
      if (event.key === "Enter" && event.target === input) {
        event.preventDefault();
        close();
        save();
      }
    });
    host.addEventListener("focusout", (event) => {
      if (event.relatedTarget && !host.contains(event.relatedTarget)) close();
    });
    document.addEventListener("click", (event) => {
      if (!host.contains(event.target)) close();
    });
    host.append(input, arrow, list);
    render();
    return {
      input,
      close,
      render,
      choose: async (item) => {
        if ((await choose(item)) === false) return false;
        input.value = item.name;
        return true;
      },
      remove,
    };
  }
  let pending = null;
  function confirmOverwrite(name) {
    if (pending) return Promise.resolve(false);
    const dialog = document.getElementById("overwriteTemplateDialog");
    document.getElementById("overwriteTemplateText").textContent =
      t("Vorhandenes Template überschreiben: ") + name + "?";
    dialog.showModal();
    document.getElementById("cancelOverwriteBtn").focus();
    return new Promise((resolve) => {
      pending = resolve;
    });
  }
  function finish(value) {
    document.getElementById("overwriteTemplateDialog").close();
    const resolve = pending;
    pending = null;
    resolve?.(value);
  }
  document
    .getElementById("confirmOverwriteBtn")
    .addEventListener("click", () => finish(true));
  for (const id of ["cancelOverwriteBtn", "closeOverwriteBtn"])
    document.getElementById(id).addEventListener("click", () => finish(false));
  document
    .getElementById("overwriteTemplateDialog")
    .addEventListener("cancel", (event) => {
      event.preventDefault();
      finish(false);
    });
  window.QRGenerator["template-combo"] = {
    createTemplateCombo,
    confirmOverwrite,
  };
})();
