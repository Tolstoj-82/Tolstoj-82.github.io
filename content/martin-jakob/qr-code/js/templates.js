(() => {
"use strict";
const {t, setMessage} = window.QRGenerator["i18n"];
function createTemplateLibrary(context) {
  const {readSettings, saveLayout, saveSettings, renderSavedLogos, openLayoutEditor, generateQRCode, bulkLayout, singleLayout} = context;
  const shapeSelect = document.getElementById("shapeSelect"), finderShapeSelect = document.getElementById("finderShapeSelect"), colorPicker = document.getElementById("colorPicker"), finderColorPicker = document.getElementById("finderColorPicker"), layoutDialog = document.getElementById("layoutDialog");
  const templateStorageKey = "qr-generator.templates.v1";
  const templateSelect = document.getElementById("templateSelect");
  const templateName = document.getElementById("templateName");
  let templates = [];
  try {
    const saved = JSON.parse(localStorage.getItem(templateStorageKey) || "[]");
    if (Array.isArray(saved)) templates = saved.filter(item => item && typeof item.id === "string" && typeof item.name === "string" && item.payload && typeof item.payload === "object");
  } catch { /* A damaged library must not prevent QR creation. */ }

  let selectedTemplateId = "", templateBaseline = "", saveTemplateResolve = null, deleteResolve = null;
  const saveTemplateDialog = document.getElementById("saveTemplateDialog");
  const deleteConfirmDialog = document.getElementById("deleteConfirmDialog");
  function confirmDeletion(name = "") {
    if (deleteResolve) return Promise.resolve(false);
    setMessage(document.getElementById("deleteConfirmText"), () => name ? t("Template löschen: ") + name + "?" : t("Diesen Eintrag wirklich löschen?"));
    deleteConfirmDialog.showModal(); document.getElementById("cancelDeleteConfirmBtn").focus();
    return new Promise(resolve => {deleteResolve = resolve;});
  }
  function finishDeletion(confirmed) {const resolve = deleteResolve; deleteResolve = null; deleteConfirmDialog.close(); resolve?.(confirmed);}
  document.getElementById("confirmDeleteBtn").addEventListener("click", () => finishDeletion(true));
  for (const id of ["cancelDeleteConfirmBtn", "closeDeleteConfirmBtn"]) document.getElementById(id).addEventListener("click", () => finishDeletion(false));
  deleteConfirmDialog.addEventListener("cancel", event => {event.preventDefault(); finishDeletion(false);});
  function closeTemplateOptions() {document.getElementById("templateOptions").hidden = true; templateSelect.setAttribute("aria-expanded", "false");}
  function renderTemplates(selected = selectedTemplateId) {
    selectedTemplateId = templates.some(item => item.id === selected) ? selected : "";
    document.getElementById("templateSelectedName").textContent = templates.find(item => item.id === selectedTemplateId)?.name || t("Template auswählen …");
    const list = document.getElementById("templateOptions"); list.replaceChildren();
    for (const item of templates) {
      const row = document.createElement("div"); row.className = "template-option";
      const choose = document.createElement("button"); choose.type = "button"; choose.className = "template-choice"; choose.textContent = item.name; choose.setAttribute("aria-pressed", String(item.id === selectedTemplateId));
      choose.addEventListener("click", async () => {
        closeTemplateOptions();
        if (templateChanged() && await requestTemplateSave(true) === "cancel") return;
        const previous = selectedTemplateId; selectedTemplateId = item.id;
        if (!await loadTemplate()) selectedTemplateId = previous;
        renderTemplates();
      });
      const remove = document.createElement("button"); remove.type = "button"; remove.className = "template-delete"; remove.textContent = "×"; remove.setAttribute("aria-label", t("Template löschen: ") + item.name);
      remove.addEventListener("click", async () => {if (!await confirmDeletion(item.name)) return; persistTemplates(templates.filter(entry => entry.id !== item.id), selectedTemplateId === item.id ? "" : selectedTemplateId, "Template gelöscht.");});
      row.append(choose, remove); list.append(row);
    }
    if (!templates.length) {const empty = document.createElement("span"); empty.className = "template-empty"; empty.textContent = t("Template auswählen …"); list.append(empty);}
  }
  templateSelect.addEventListener("click", () => {const list = document.getElementById("templateOptions"); list.hidden = !list.hidden; templateSelect.setAttribute("aria-expanded", String(!list.hidden));});
  document.addEventListener("click", event => {if (!event.target.closest(".template-combo") && !deleteConfirmDialog.open) closeTemplateOptions();});
  templateSelect.parentElement.addEventListener("keydown", event => {if (event.key === "Escape" && !document.getElementById("templateOptions").hidden) {event.preventDefault(); event.stopPropagation(); closeTemplateOptions(); templateSelect.focus();}});
  function templateFeedback(message, error = false) {
    setMessage(document.getElementById("templateStatus"), () => t(message));
    document.getElementById("templateStatus").classList.toggle("is-error", error);
    if (saveTemplateDialog.open) setMessage(document.getElementById("saveTemplateError"), () => error ? t(message) : "");
  }
  function persistTemplates(next, selected, message) {
    try { localStorage.setItem(templateStorageKey, JSON.stringify(next)); }
    catch { templateFeedback("Templates konnten nicht gespeichert werden. Der lokale Speicher ist voll oder nicht verfügbar.", true); return false; }
    templates = next; renderTemplates(selected); templateFeedback(message); return true;
  }
  function templatePayload() {
    const {logo, ...appearance} = readSettings();
    return {version: 1, layout: structuredClone(context.getLayout()), appearance, logoData: context.getLogoData(), format: document.getElementById(context.getMode() === "single" ? "singleFormat" : "exportFormat").value};
  }
  function templateSignature() {
    const payload = templatePayload();
    payload.layout.ribbon.rules = payload.layout.ribbon.rules.map(({id, ...rule}) => rule);
    return JSON.stringify(payload);
  }
  function templateChanged() {return Boolean(templateBaseline) && templateSignature() !== templateBaseline;}
  function requestTemplateSave(automatic = false) {
    if (saveTemplateResolve) return Promise.resolve("cancel");
    closeTemplateOptions(); templateName.value = templates.find(item => item.id === selectedTemplateId)?.name || "";
    document.querySelector('input[name="templateSaveMode"][value="copy"]').checked = true;
    updateTemplateSaveMode();
    document.getElementById("skipSaveTemplateBtn").hidden = !automatic;
    setMessage(document.getElementById("saveTemplateError"), () => "");
    saveTemplateDialog.showModal(); templateName.focus();
    return new Promise(resolve => {saveTemplateResolve = resolve;});
  }
  function finishTemplateSave(result) {const resolve = saveTemplateResolve; saveTemplateResolve = null; saveTemplateDialog.close(); resolve?.(result);}
  document.getElementById("saveTemplateBtn").addEventListener("click", () => requestTemplateSave());
  for (const id of ["cancelSaveTemplateBtn", "closeSaveTemplateBtn"]) document.getElementById(id).addEventListener("click", () => finishTemplateSave("cancel"));
  document.getElementById("skipSaveTemplateBtn").addEventListener("click", () => {templateBaseline = templateSignature(); finishTemplateSave("skip");});
  saveTemplateDialog.addEventListener("cancel", event => {event.preventDefault(); finishTemplateSave("cancel");});
  function updateTemplateSaveMode() {
    const selected = templates.find(item => item.id === selectedTemplateId);
    document.getElementById("templateSaveMode").hidden = !selected || templateName.value.trim() === selected.name || !templateName.value.trim();
  }
  templateName.addEventListener("input", updateTemplateSaveMode);
  document.getElementById("confirmSaveTemplateBtn").addEventListener("click", () => {
    const name = templateName.value.trim().slice(0, 80); if (!name) {templateFeedback("Bitte einen Template-Namen eingeben.", true); return;}
    if (templates.some(item => item.id !== selectedTemplateId && item.name.toLocaleLowerCase() === name.toLocaleLowerCase())) {templateFeedback("Dieser Name ist bereits vergeben.", true); return;}
    const selected = templates.find(item => item.id === selectedTemplateId);
    const createCopy = selected && name !== selected.name && document.querySelector('input[name="templateSaveMode"]:checked').value === "copy";
    const id = selected && !createCopy ? selected.id : crypto.randomUUID(), item = {id, name, payload: templatePayload()};
    const next = selected && !createCopy ? templates.map(entry => entry.id === id ? item : entry) : [...templates, item];
    if (persistTemplates(next, id, "Template gespeichert.")) {templateBaseline = templateSignature(); finishTemplateSave("saved");}
  });
  let templateLoadVersion = 0;
  async function loadTemplate() {
    const selected = templates.find(item => item.id === selectedTemplateId); if (!selected) return;
    const version = ++templateLoadVersion, mode = context.getMode(), snapshot = context.getSnapshot();
    try {
      const payload = selected.payload, saved = payload.layout, appearance = payload.appearance;
      if (!saved || !Array.isArray(saved.above) || !Array.isArray(saved.below) || !appearance || !saved.ribbon || !Array.isArray(saved.ribbon.rules)) throw Error();
      for (const [key, control] of [["shape", shapeSelect], ["finderShape", finderShapeSelect]]) if (![...control.options].some(option => option.value === appearance[key])) throw Error();
      for (const key of ["color", "finderColor"]) if (!/^#[0-9a-f]{6}$/i.test(appearance[key])) throw Error();
      const used = new Set(), clean = {above: [], below: [], labels: {}, custom: {}, styles: {}, ribbon: {enabled: saved.ribbon.enabled !== false, rules: []}};
      for (const area of ["above", "below"]) clean[area] = saved[area].filter(key => typeof key === "string" && !(mode === "single" && ["title", "subtitle"].includes(key)) && !used.has(key) && used.add(key));
      for (const property of ["labels", "custom"]) clean[property] = Object.fromEntries(Object.entries(saved[property] || {}).filter(([key,value]) => typeof value === "string"));
      clean.styles = Object.fromEntries(Object.entries(saved.styles || {}).filter(([key,value]) => value && typeof value === "object").map(([key,value]) => [key,{bold: value.bold === true, large: value.large === true, black: value.black === true}]));
      clean.ribbon.rules = saved.ribbon.rules.map(rule => {
        if (!rule || typeof rule.pattern !== "string" || typeof rule.text !== "string" || !/^#[0-9a-f]{6}$/i.test(rule.color)) throw Error();
        return {id: crypto.randomUUID(), pattern: rule.pattern, text: Array.from(rule.text).slice(0,5).join(""), color: rule.color, match: rule.match === "always" ? "always" : "contains"};
      });
      let image = null;
      if (payload.logoData) {
        if (typeof payload.logoData !== "string" || payload.logoData.length > 500000 || !/^data:image\/png;base64,/.test(payload.logoData)) throw Error();
        image = new Image(); image.src = payload.logoData; await image.decode();
        if (!image.naturalWidth || image.naturalWidth !== image.naturalHeight || image.naturalWidth > 256) throw Error();
      }
      if (version !== templateLoadVersion || !layoutDialog.open || mode !== context.getMode() || snapshot !== context.getSnapshot() || selectedTemplateId !== selected.id || !templates.some(item => item.id === selected.id)) return;
      Object.assign(context.getLayout(), clean); bulkLayout.ribbon = clean.ribbon; singleLayout.ribbon = clean.ribbon;
      for (const [key, control] of [["shape", shapeSelect], ["finderShape", finderShapeSelect], ["color", colorPicker], ["finderColor", finderColorPicker]]) control.value = appearance[key];
      context.setLogo(image, payload.logoData || "");
      if (["png", "svg"].includes(payload.format)) document.getElementById(mode === "single" ? "singleFormat" : "exportFormat").value = payload.format;
      saveLayout(); saveSettings(); renderSavedLogos(); openLayoutEditor(mode); generateQRCode(); templateFeedback("Template angewendet."); templateBaseline = templateSignature(); return true;
    } catch {templateFeedback("Ungültiges Template.", true); return false;}
  }
  renderTemplates();

  return {confirmDeletion, templateChanged, requestTemplateSave, renderTemplates, markBaseline: () => { templateBaseline = templateSignature(); }};
}

window.QRGenerator["templates"] = {createTemplateLibrary};
})();
