(() => {
  "use strict";
  const { t } = window.QRGenerator.i18n;
  const token = (key) => "{{" + JSON.stringify(key) + "}}";
  function sanitize(value) {
    let name = String(value).normalize("NFC")
      .replace(/[<>:"/\\|?*\x00-\x1f]/g, "_")
      .trim().replace(/\s+/g, "_").replace(/[. ]+$/g, "");
    if (/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(name)) name = "QR-" + name;
    if (!name) throw Error(t("Der Dateiname darf nicht leer sein."));
    if (name.length > 180) throw Error(t("Der Dateiname ist zu lang (maximal 180 Zeichen)."));
    return name;
  }
  function filenameError(error) {
    if (error.message === t("Der QR-Code-Inhalt darf nicht leer sein.")) return t("Der Dateiname darf nicht leer sein.");
    if (error.message === t("Bitte den QR-Code-Inhalt festlegen.")) return t("Der Dateiname darf nicht leer sein.");
    return error.message;
  }
  function plan(records, expression, titleField, format, typedCards) {
    const used = new Set();
    return records.map((entry, index) => {
      try {
        const raw = expression.trim()
          ? window.QRGenerator["qr-content"].resolveContent(expression, entry.Raw, typedCards)
          : window.QRGenerator["qr-content"].resolveContent(token(titleField), entry.Raw);
        const base = sanitize(raw);
        let name = base + "." + format, suffix = 2;
        while (used.has(name.toLocaleLowerCase())) name = base + "_" + suffix++ + "." + format;
        used.add(name.toLocaleLowerCase());
        return { name, duplicate: suffix > 2 };
      } catch (error) {
        throw Error(t("Eintrag ") + (index + 1) + ": " + filenameError(error));
      }
    });
  }
  function initialize({ getRecords, getTitleField, confirmDeletion }) {
    const input = document.getElementById("bulkFilenamePattern");
    const preview = document.getElementById("bulkFilenamePreview");
    const summary = document.getElementById("bulkFilenameSummary");
    const format = document.getElementById("exportFormat");
    const prefix = "filename-";
    const dialog = document.createElement("dialog");
    dialog.id = "filenameDialog";
    dialog.className = "modal-frame";
    dialog.setAttribute("aria-labelledby", "filenameHeading");
    dialog.innerHTML = `<div class="preview-header"><h2 id="filenameHeading"></h2><button id="closeFilenames" class="modal-close" type="button" aria-label="Close">×</button></div>
      <div class="modal-scroll-body">
        <div class="export-format"><label id="filenameModeLabel" for="filenameMode"></label><select id="filenameMode"><option id="filenameTitleLabel" value="title"></option><option id="filenameCustomLabel" value="custom"></option></select></div>
        <p id="filenameHelp" class="csv-file-info"></p>
        <div id="filenameEditorHost"></div>
        <button id="pdfFilenamePreset" class="action-button secondary" type="button"></button>
        <pre id="filenameNamesPreview" aria-live="polite"></pre>
        <p id="filenameError" role="alert"></p>
      <div class="modal-actions"><button id="cancelFilenames" class="action-button secondary" type="button"></button><button id="applyFilenames" class="action-button" type="button"></button></div></div>`;
    const clone = (id) => {
      const node = document.getElementById(id).cloneNode(true);
      for (const el of [node, ...node.querySelectorAll("*")]) {
        for (const attr of ["id", "for", "aria-labelledby", "aria-describedby", "aria-controls"])
          if (el.hasAttribute(attr)) el.setAttribute(attr, el.getAttribute(attr).split(/\s+/).map(value => prefix + value).join(" "));
      }
      return node;
    };
    const editorHost = clone("qrContentEditor");
    editorHost.hidden = false;
    dialog.querySelector("#filenameEditorHost").append(editorHost);
    document.body.append(dialog, clone("contentCardDialog"));
    const el = id => document.getElementById(id);
    let appliedCards, draft = { expression: "", cards: [] }, custom = false;
    const keys = () => [...new Set((getRecords() || []).flatMap(entry => Object.keys(entry.Raw)))];
    const prefixes = ["Betriebszweig", "Liniennummer", "Linienerg\u00e4nzung", "Linienversionsnummer", "Richtung", "Projekt-K\u00fcrzel", "Haltestellennummer"];
    const editor = window.QRGenerator["qr-content"].createContentEditor({
      idPrefix: prefix, writeResolved: false, formatError: filenameError,
      getRecords, getExpression: () => draft.expression, getCards: () => draft.cards,
      setExpression: (expression, cards) => { draft = { expression, cards }; },
      changed: () => { editor.validate(); updateDraftPreview(); }, confirmDeletion,
    });
    function names(expression, cards) { return plan(getRecords() || [], expression, getTitleField(), format.value, cards); }
    function showNames(node, items) {
      node.textContent = items.slice(0, 3).map(item => item.name).join("\n");
      const duplicates = items.filter(item => item.duplicate).length;
      if (duplicates) node.textContent += "\n" + duplicates + t(" doppelte Dateinamen erhalten einen nummerierten Zusatz.");
    }
    function updateDraftPreview() {
      el("filenameError").textContent = "";
      try { showNames(el("filenameNamesPreview"), names(custom ? draft.expression : "", custom ? draft.cards : undefined)); }
      catch (error) { el("filenameNamesPreview").textContent = ""; el("filenameError").textContent = error.message; }
    }
    function labels() {
      el("filenameHeading").textContent = t("Dateinamen definieren");
      el(prefix + "qrContentEditor").querySelector('label[for="filename-qrContentPreview"]').textContent = t("Vorschau: erster Eintrag");
      el(prefix + "contentCardHeading").textContent = t("Textkarte bearbeiten");
      el(prefix + "contentCardValueLabel").textContent = t("Text");
      el(prefix + "removeContentCard").textContent = t("Entfernen");
      el(prefix + "applyContentCard").textContent = t("\u00dcbernehmen");
      el(prefix + "closeContentCard").setAttribute("aria-label", t("Schliessen"));
      el("filenameModeLabel").textContent = t("Dateinamen");
      el("filenameTitleLabel").textContent = t("Titel (Standard)");
      el("filenameCustomLabel").textContent = t("Eigene Definition");
      el("filenameHelp").textContent = t("Dateinamen aus Textkarten und Feldern zusammensetzen. Die Dateiendung wird automatisch angeh\u00e4ngt.");
      el(prefix + "qrContentHeading").textContent = t("Dateinamen");
      el(prefix + "qrContentEditor").querySelector('label[for="filename-qrContentExpression"]').textContent = t("Dateinamen");
      el("pdfFilenamePreset").textContent = t("PDF-Kennung verwenden");
      el("cancelFilenames").textContent = t("Abbrechen");
      el("applyFilenames").textContent = t("\u00dcbernehmen");
      el("closeFilenames").setAttribute("aria-label", t("Schliessen"));
    }
    function renderDraft() {
      labels(); editor.render("bulk");
      editorHost.hidden = !custom;
      el("pdfFilenamePreset").hidden = !custom;
      el("pdfFilenamePreset").disabled = !prefixes.every(p => keys().some(key => key === p || key.startsWith(p + " ")));
      updateDraftPreview();
    }
    function refresh() {
      summary.textContent = input.value.trim() ? t("Dateinamen: Eigene Definition") : t("Dateinamen: Titel (Standard)");
      preview.dataset.tone = "success";
      try { showNames(preview, names(input.value, appliedCards)); }
      catch (error) { preview.textContent = error.message; preview.dataset.tone = "error"; }
      if (dialog.open) renderDraft();
    }
    el("editFilenames").addEventListener("click", () => {
      custom = Boolean(input.value.trim());
      draft = custom ? { expression: input.value, cards: structuredClone(appliedCards) } : { expression: token(getTitleField()), cards: [{kind:"field", value:getTitleField()}] };
      el("filenameMode").value = custom ? "custom" : "title";
      renderDraft(); dialog.showModal();
    });
    el("filenameMode").addEventListener("change", () => {
      custom = el("filenameMode").value === "custom";
      renderDraft();
    });
    el("pdfFilenamePreset").addEventListener("click", () => {
      const fields = prefixes.map(p => keys().find(key => key === p || key.startsWith(p + " ")));
      const cards = [];
      fields.forEach((key, i) => { if (i) cards.push({kind:"free",value:i<5 ? "-" : ";"}); cards.push({kind:"field",value:key}); });
      draft = { cards, expression: cards.map(card => card.kind === "field" ? token(card.value) : card.value).join("") };
      renderDraft();
    });
    el("applyFilenames").addEventListener("click", () => {
      if (custom && !editor.validate()) return;
      try { names(custom ? draft.expression : "", custom ? draft.cards : undefined); }
      catch (error) { el("filenameError").textContent = error.message; return; }
      input.value = custom ? draft.expression : "";
      appliedCards = custom ? structuredClone(draft.cards) : undefined;
      dialog.close(); refresh();
    });
    for (const id of ["closeFilenames", "cancelFilenames"]) el(id).addEventListener("click", () => dialog.close());
    format.addEventListener("change", refresh);
    return {
      refresh,
      custom: () => Boolean(input.value.trim()),
      plan: () => names(input.value, appliedCards),
      report: () => el("editFilenames").click(),
    };
  }
  window.QRGenerator["bulk-filenames"] = { initialize, plan, sanitize };
})();
