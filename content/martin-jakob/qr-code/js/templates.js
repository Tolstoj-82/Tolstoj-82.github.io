(() => {
"use strict";
const {t, setMessage} = window.QRGenerator["i18n"];
function createTemplateLibrary(context) {
  const {readSettings, saveLayout, saveSettings, renderSavedLogos, openLayoutEditor, generateQRCode, bulkLayout, singleLayout} = context;
  const shapeSelect = document.getElementById("shapeSelect"), finderShapeSelect = document.getElementById("finderShapeSelect"), colorPicker = document.getElementById("colorPicker"), finderColorPicker = document.getElementById("finderColorPicker"), layoutDialog = document.getElementById("layoutDialog");
  const templateStorageKey = "qr-generator.text-templates.v2";
  const {createTemplateCombo, confirmOverwrite} = window.QRGenerator["template-combo"];
  const templateName = document.getElementById("templateName");
  let templates = [];
  try {
    const saved = JSON.parse(localStorage.getItem(templateStorageKey) || localStorage.getItem("qr-generator.templates.v1") || "[]");
    if (Array.isArray(saved)) templates = saved.filter(item => item && typeof item.id === "string" && typeof item.name === "string" && item.payload && typeof item.payload === "object");
  templates = templates.flatMap(item => item.kind ? [item] : ["single", "bulk"].map(kind => ({...item, id: item.id + ":" + kind, kind})));
  } catch { /* A damaged library must not prevent QR creation. */ }

  let selectedTemplateId = "", templateBaseline = "", saveTemplateResolve = null, deleteResolve = null;
  const saveTemplateDialog = document.getElementById("saveTemplateDialog");
  const deleteConfirmDialog = document.getElementById("deleteConfirmDialog");
  function confirmDeletion(name = "", options = {}) {
    if (deleteResolve) return Promise.resolve(false);
    setMessage(document.getElementById("deleteConfirmText"), () => name ? t(options.kind === "logo" ? "Logo löschen: " : "Template löschen: ") + name + "?" : t("Diesen Eintrag wirklich löschen?"));
    const usage=document.getElementById('deleteLogoUsage'),list=document.getElementById('deleteLogoTemplates'),ack=document.getElementById('deleteLogoAcknowledgement');
    const names=options.templates||[];usage.hidden=names.length===0;list.replaceChildren();
    for(const name of names){const item=document.createElement('li');item.textContent=name;list.append(item);}
    ack.checked=false;document.getElementById('confirmDeleteBtn').disabled=names.length>0;
    deleteConfirmDialog.showModal(); document.getElementById("cancelDeleteConfirmBtn").focus();
    return new Promise(resolve => {deleteResolve = resolve;});
  }
  document.getElementById('deleteLogoAcknowledgement').addEventListener('change',event=>{document.getElementById('confirmDeleteBtn').disabled=!event.target.checked;});
  function finishDeletion(confirmed) {if(confirmed&&document.getElementById('confirmDeleteBtn').disabled)return;const resolve = deleteResolve; deleteResolve = null; deleteConfirmDialog.close(); resolve?.(confirmed);}
  document.getElementById("confirmDeleteBtn").addEventListener("click", () => finishDeletion(true));
  for (const id of ["cancelDeleteConfirmBtn", "closeDeleteConfirmBtn"]) document.getElementById(id).addEventListener("click", () => finishDeletion(false));
  deleteConfirmDialog.addEventListener("cancel", event => {event.preventDefault(); finishDeletion(false);});
  const selectedByMode = {single: "", bulk: ""}, namesByMode = {single: "", bulk: ""};
  let currentMode = context.getMode();
  const combo = createTemplateCombo({
    host: document.getElementById("templateSelect").parentElement, id: "templateSelect",
    getItems: () => templates.filter(item => item.kind === context.getMode()),
    choose: async item => {
      if(!layoutDialog.open)await openLayoutEditor(context.getMode());
      if (templateChanged() && await requestTemplateSave(true) === "cancel") return false;
      const previous = selectedTemplateId; selectedTemplateId = item.id;
      if (!await loadTemplate()) {selectedTemplateId = previous; return false;}
      combo.input.value=item.name; renderTemplates(); return true;
    },
    remove: async item => {if(!await confirmDeletion(item.name))return;if(persistTemplates(templates.filter(entry=>entry.id!==item.id),selectedTemplateId===item.id?"":selectedTemplateId,"Template gelöscht.") && combo.input.value===item.name)combo.input.value="";},
    save: () => saveNamedTemplate(combo.input.value)
  });
  function closeTemplateOptions() {combo.close();}
  function renderTemplates(selected = selectedTemplateId) {
    const mode=context.getMode();
    if(mode!==currentMode){selectedByMode[currentMode]=selectedTemplateId;namesByMode[currentMode]=combo.input.value;selected=selectedByMode[mode];combo.input.value=namesByMode[mode];currentMode=mode;}
    selectedTemplateId=templates.some(item=>item.kind===mode&&item.id===selected)?selected:"";
    combo.render();
  }
  let saving = false;
  async function saveNamedTemplate(value) {
    if(saving)return false;
    if(!context.validateAppearance())return false;
    const name=value.trim().slice(0,80), mode=context.getMode();
    if(!name){templateFeedback("Bitte einen Template-Namen eingeben.",true);combo.input.focus();return false;}
    saving=true;
    try {
      const existing=templates.find(item=>item.kind===mode&&item.name.toLocaleLowerCase()===name.toLocaleLowerCase());
      const payload=templatePayload();
      if(existing&&!await confirmOverwrite(existing.name))return false;
      const item={id:existing?.id||crypto.randomUUID(),name:existing?.name||name,kind:mode,payload};
      const next=existing?templates.map(entry=>entry.id===existing.id?item:entry):[...templates,item];
      if(!persistTemplates(next,item.id,"Template gespeichert."))return false;
      combo.input.value=item.name;combo.close();templateBaseline=templateSignature();window.QRGenerator.notifications.toast(t("Template gespeichert."));return true;
    } finally {saving=false;}
  }
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
    const layout = context.getLayout();
    return {version: 2, layout: structuredClone(layout), format: document.getElementById(context.getMode() === "single" ? "singleFormat" : "exportFormat").value};
  }
  function templateSignature() { return JSON.stringify(templatePayload()); }
  function templateChanged() {return Boolean(templateBaseline) && templateSignature() !== templateBaseline;}
  function requestTemplateSave(automatic = false) {
    if (saveTemplateResolve) return Promise.resolve("cancel");
    closeTemplateOptions(); templateName.value = combo.input.value;
    document.getElementById("skipSaveTemplateBtn").hidden = !automatic;
    setMessage(document.getElementById("saveTemplateError"), () => "");
    saveTemplateDialog.showModal(); templateName.focus();
    return new Promise(resolve => {saveTemplateResolve = resolve;});
  }
  function finishTemplateSave(result) {const resolve = saveTemplateResolve; saveTemplateResolve = null; saveTemplateDialog.close(); resolve?.(result);}
  document.getElementById("saveTemplateBtn").addEventListener("click", () => saveNamedTemplate(combo.input.value));
  for (const id of ["cancelSaveTemplateBtn", "closeSaveTemplateBtn"]) document.getElementById(id).addEventListener("click", () => finishTemplateSave("cancel"));
  document.getElementById("skipSaveTemplateBtn").addEventListener("click", () => {templateBaseline = templateSignature(); finishTemplateSave("skip");});
  saveTemplateDialog.addEventListener("cancel", event => {event.preventDefault(); finishTemplateSave("cancel");});
  document.getElementById("confirmSaveTemplateBtn").addEventListener("click", async () => {
    if(await saveNamedTemplate(templateName.value))finishTemplateSave("saved");
  });
  let templateLoadVersion = 0;
  async function loadTemplate() {
    const selected = templates.find(item => item.id === selectedTemplateId); if (!selected) return;
    const version = ++templateLoadVersion, mode = context.getMode(), snapshot = context.getSnapshot();
    try {
      const payload = selected.payload, saved = payload.layout;
      if (!saved || !Array.isArray(saved.above) || !Array.isArray(saved.below)) throw Error();
      const used = new Set(), clean = {above: [], below: [], labels: {}, custom: {}, styles: {}};
      for (const area of ["above", "below"]) clean[area] = saved[area].filter(key => typeof key === "string" && !used.has(key) && used.add(key));
      for (const property of ["labels", "custom"]) clean[property] = Object.fromEntries(Object.entries(saved[property] || {}).filter(([key,value]) => typeof value === "string"));
      clean.styles = Object.fromEntries(Object.entries(saved.styles || {}).filter(([key,value]) => value && typeof value === "object").map(([key,value]) => [key,{bold: value.bold === true, large: value.large === true, black: value.black === true}]));
      if (version !== templateLoadVersion || !layoutDialog.open || mode !== context.getMode()) return;
      if (mode === "bulk") clean.contentExpression = typeof saved.contentExpression === "string" ? saved.contentExpression : context.getLayout().contentExpression || "";
      if(mode === "bulk") clean.contentCards = Array.isArray(saved.contentCards) ? saved.contentCards.filter(card=>card&&["free","url","field"].includes(card.kind)&&typeof card.value==="string") : undefined;
      clean.qrAppearance = saved.qrAppearance;
      clean.qrTemplateId = saved.qrTemplateId;
      if(saved.ribbon)clean.ribbon=structuredClone(saved.ribbon);
      clean.headingsMovable = saved.headingsMovable === true;
      Object.assign(context.getLayout(), clean);
      if(mode==="bulk")context.checkCompatibility?.(clean,selected.name);
      if (["png", "svg"].includes(payload.format)) document.getElementById(mode === "single" ? "singleFormat" : "exportFormat").value = payload.format;
      saveLayout(); saveSettings(); renderSavedLogos(); await openLayoutEditor(mode); generateQRCode(); templateFeedback("Template angewendet."); templateBaseline = templateSignature(); return true;
    } catch {templateFeedback("Ungültiges Template.", true); return false;}
  }
  renderTemplates();

  return {createNew:()=>{selectedTemplateId="";combo.input.value="";templateBaseline="";}, getEntries:()=>templates, choose:item=>combo.choose(item), remove:item=>combo.remove(item), confirmDeletion, templateChanged, requestTemplateSave, renderTemplates, markBaseline: () => { templateBaseline = templateSignature(); }};
}

window.QRGenerator["templates"] = {createTemplateLibrary};
})();
