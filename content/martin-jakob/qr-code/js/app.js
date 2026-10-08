(() => {
"use strict";
const {t, setLanguage, LocalizedError, localizedMessages, setMessage, captureTranslations, translateInterface} = window.QRGenerator["i18n"];
const {toast} = window.QRGenerator["notifications"];
const {createLogoManager} = window.QRGenerator["logos"];
const {EXPORT_SIZE, renderQRCode, vectorContext, toSVG, wrapText} = window.QRGenerator["qr-renderer"];
const {createTemplateLibrary} = window.QRGenerator["templates"];
captureTranslations();
translateInterface();
// All translations are presentation-only: imported data and custom labels stay unchanged.
const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const info = document.getElementById("info");
const statusDiv = document.getElementById("status");
const generateBtn = document.getElementById("generateBtn");

const qrInput = document.getElementById("qrInput");
const shapeSelect = document.getElementById("shapeSelect");
const colorPicker = document.getElementById("colorPicker");
const finderShapeSelect = document.getElementById("finderShapeSelect");
const finderColorPicker = document.getElementById("finderColorPicker");
const canvas = document.getElementById("qrCanvas");
const downloadBtn = document.getElementById("downloadBtn");
const qrTitle = document.getElementById("qrTitle");
const qrSubtitle = document.getElementById("qrSubtitle");
const ctx = canvas.getContext("2d");

let editorSnapshot = null;
const {logoState, readSavedLogos, renderSavedLogos} = createLogoManager({saveSettings, generateQRCode, confirmDeletion: (...args) => confirmDeletion(...args)});

let loadedData = null;
let isGenerating = false;
let fileLoadVersion = 0;
const bulkImport = document.getElementById("bulkImport");
const qrError = document.getElementById("qrError");
const toggleImportBtn = document.getElementById("toggleImportBtn");

function setImportVisible(visible) {
  bulkImport.hidden = !visible;
  toggleImportBtn.setAttribute("aria-expanded", String(visible));
  generateQRCode();
  saveSettings();
}

toggleImportBtn.addEventListener("click", () =>
  setImportVisible(bulkImport.hidden),
);
document.getElementById("toggleSingleBtn").addEventListener("click", () => {
  const section = document.getElementById("singleSection");
  section.hidden = !section.hidden;
  document
    .getElementById("toggleSingleBtn")
    .setAttribute("aria-expanded", String(!section.hidden));
});

dropZone.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    fileInput.click();
  }
});

dropZone.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", (e) => {
  if (e.target.files.length) {
    loadFile(e.target.files[0]);
  }
});

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");

  const file = e.dataTransfer.files[0];

  if (file) {
    loadFile(file);
  }
});

const mappingDialog = document.getElementById("mappingDialog");
const mappingError = document.getElementById("mappingError");
const mappingForm = document.getElementById("mappingForm");
const mappingSubmitBtn = document.getElementById("mappingSubmitBtn");
const manualBaseURL = document.getElementById("manualBaseURL");
const baseURLStorageKey = "qr-generator.base-urls.v1";
const savedBaseURLs = document.getElementById("savedBaseURLs");
const baseURLStorageStatus = document.getElementById("baseURLStorageStatus");

function readSavedBaseURLs() {
  try {
    const values = JSON.parse(
      localStorage.getItem(baseURLStorageKey) || "[]",
    );
    return Array.isArray(values) ? [...new Set(values.filter(isWebURL))] : [];
  } catch {
    return [];
  }
}

function writeSavedBaseURLs(values) {
  try {
    localStorage.setItem(baseURLStorageKey, JSON.stringify(values));
    setMessage(baseURLStorageStatus, () => "");
    return true;
  } catch {
    setMessage(baseURLStorageStatus, () =>
      t(
        "Die gespeicherten Basis-URLs konnten nicht aktualisiert werden. Der Import ist trotzdem möglich.",
      ),
      "warning"
    );
    return false;
  }
}

const baseURLCombo = document.getElementById("baseURLCombo");
function closeSavedBaseURLs() {
  savedBaseURLs.hidden = true;
  manualBaseURL.setAttribute("aria-expanded", "false");
  document
    .getElementById("baseURLDropdownBtn")
    .setAttribute("aria-expanded", "false");
  baseURLCombo.classList.remove("is-open");
}
manualBaseURL.addEventListener("click", () => renderSavedBaseURLs(true));
document
  .getElementById("baseURLDropdownBtn")
  .addEventListener("click", () => {
    if (savedBaseURLs.hidden) renderSavedBaseURLs(true);
    else closeSavedBaseURLs();
    manualBaseURL.focus();
  });
manualBaseURL.addEventListener("keydown", (event) => {
  if (event.key === "ArrowDown") {
    event.preventDefault();
    renderSavedBaseURLs(true);
    savedBaseURLs.querySelector("button")?.focus();
  }
});
baseURLCombo.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !savedBaseURLs.hidden) {
    event.preventDefault();
    event.stopPropagation();
    closeSavedBaseURLs();
    manualBaseURL.focus();
  }
});
document.addEventListener("pointerdown", (event) => {
  if (!baseURLCombo.contains(event.target)) closeSavedBaseURLs();
});
baseURLCombo.addEventListener("focusout", (event) => {
  if (!baseURLCombo.contains(event.relatedTarget)) closeSavedBaseURLs();
});

function renderSavedBaseURLs(open = false) {
  const values = readSavedBaseURLs();
  document.getElementById("baseURLDropdownBtn").hidden = values.length === 0;
  baseURLCombo.classList.toggle("has-suggestions", values.length > 0);
  savedBaseURLs.replaceChildren();
  const expanded = open && values.length > 0;
  savedBaseURLs.hidden = !expanded;
  manualBaseURL.setAttribute("aria-expanded", String(expanded));
  document
    .getElementById("baseURLDropdownBtn")
    .setAttribute("aria-expanded", String(expanded));
  baseURLCombo.classList.toggle("is-open", expanded);
  for (const url of values) {
    const row = document.createElement("div");
    row.className = "saved-base-url";
    const select = document.createElement("button");
    select.type = "button";
    select.className = "saved-base-url-select";
    select.textContent = url;
    select.addEventListener("click", () => {
      manualBaseURL.value = url;
      updateMappingSubmit();
      closeSavedBaseURLs();
      manualBaseURL.focus();
    });
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "saved-base-url-remove";
    remove.textContent = "×";
    remove.setAttribute(
      "aria-label",
      t("Gespeicherte Basis-URL löschen: ") + url,
    );
    remove.title = t("Basis-URL löschen");
    remove.addEventListener("click", async () => {
    if (!await confirmDeletion()) return;
      if (
        writeSavedBaseURLs(
          readSavedBaseURLs().filter((value) => value !== url),
        )
      ) {
        renderSavedBaseURLs(true);
        manualBaseURL.focus();
      }
    });
    row.append(select, remove);
    savedBaseURLs.append(row);
  }
}

function saveBaseURL(value) {
  const url = value.trim().replace(/\/+$/, "") + "/";
  const others = readSavedBaseURLs().filter(
    (saved) => saved.replace(/\/+$/, "") !== url.replace(/\/+$/, ""),
  );
  writeSavedBaseURLs([url, ...others]);
}
const mappingFields = Object.fromEntries(
  ["Titel", "Untertitel", "URL", "Base_URL", "Interne_ID"].map((key) => [
    key,
    document.getElementById("map" + key),
  ]),
);
let pendingImport = null;
let urlMode = "full";
function setURLMode(mode) {
  urlMode = mode;
  closeSavedBaseURLs();
  for (const [name, radioId, groupId, input] of [
    ["full", "urlModeFull", "fullURLGroup", mappingFields.URL],
    ["base", "urlModeBase", "baseURLGroup", mappingFields.Base_URL],
    ["manual", "urlModeManual", "manualBaseURLGroup", manualBaseURL],
  ]) {
    const active = name === mode;
    document.getElementById(radioId).checked = active;
    document.getElementById(groupId).hidden = !active;
    input.disabled = !active;
    input.required = active;
  }
  mappingFields.Interne_ID.required = mode !== "full";
  setMessage(mappingError, () => "");
  updateMappingSubmit();
}
for (const [id, mode] of [
  ["urlModeFull", "full"],
  ["urlModeBase", "base"],
  ["urlModeManual", "manual"],
]) {
  document
    .getElementById(id)
    .addEventListener("change", () => setURLMode(mode));
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function extractRecords(data) {
  if (isRecord(data)) {
    const lists = Object.values(data).filter(Array.isArray);
    if (lists.length !== 1)
      throw new LocalizedError(() =>
        t(
          "Erwartet wird eine Liste von Einträgen oder ein Objekt mit genau einer solchen Liste.",
        ),
      );
    data = lists[0];
  }
  if (!Array.isArray(data) || !data.length || !data.every(isRecord)) {
    throw new LocalizedError(() =>
      t("Die Datei muss eine nicht leere Liste von Objekten enthalten."),
    );
  }
  if (data.some((row) => !Object.keys(row).length))
    throw new LocalizedError(() => t("Die Liste enthält leere Einträge."));
  return data;
}

function isWebURL(value) {
  if (
    typeof value !== "string" ||
    !/^https?:\/\//i.test(value.trim()) ||
    /\s/.test(value.trim())
  )
    return false;
  try {
    const url = new URL(value.trim());
    return Boolean(url.hostname);
  } catch {
    return false;
  }
}

function normalizeRecords(records, mapping, enteredBaseURL = "") {
  if (!mapping.URL && !mapping.Base_URL && !enteredBaseURL.trim())
    throw new LocalizedError(() =>
      t(
        "Bitte wählen Sie ein URL-Feld aus oder geben Sie eine Basis-URL ein und wählen Sie das ID-Feld.",
      ),
    );
  return records.map((row, index) => {
    const fullURL = mapping.URL ? row[mapping.URL] : null;
    let url = fullURL;
    if (fullURL == null || (typeof fullURL === "string" && !fullURL.trim())) {
      const mappedBase = mapping.Base_URL ? row[mapping.Base_URL] : null;
      const base =
        mappedBase == null ||
        (typeof mappedBase === "string" && !mappedBase.trim())
          ? enteredBaseURL.trim()
          : mappedBase;
      const id = mapping.Interne_ID ? row[mapping.Interne_ID] : null;
      if (
        !isWebURL(base) ||
        !["string", "number"].includes(typeof id) ||
        (typeof id === "number" && !Number.isFinite(id)) ||
        !String(id).trim()
      ) {
        throw new LocalizedError(
          () =>
            t("Eintrag ") +
            (index + 1) +
            t(
              ": Eine vollständige URL oder eine gültige Basis-URL mit ID ist erforderlich.",
            ),
        );
      }
      const parsedBase = new URL(base.trim());
      if (parsedBase.search || parsedBase.hash)
        throw new LocalizedError(
          () =>
            t("Eintrag ") +
            (index + 1) +
            t(
              ": Die Basis-URL darf keine Abfrageparameter oder Sprungmarke enthalten.",
            ),
        );
      const encodedId = encodeURIComponent(String(id).trim());
      if (encodedId === "." || encodedId === "..")
        throw new LocalizedError(
          () => t("Eintrag ") + (index + 1) + t(": Ungültige ID."),
        );
      url = base.trim().replace(/\/+$/, "") + "/" + encodedId;
    }
    if (!isWebURL(url))
      throw new LocalizedError(
        () =>
          t("Eintrag ") +
          (index + 1) +
          t(
            ": Das gewählte URL-Feld muss eine vollständige HTTP- oder HTTPS-Adresse enthalten.",
          ),
      );
    const result = { URL: url.trim() };
    for (const field of ["Titel", "Untertitel", "Interne_ID"]) {
      const value = mapping[field] ? row[mapping[field]] : null;
      if (
        value != null &&
        typeof value !== "string" &&
        !(typeof value === "number" && Number.isFinite(value))
      ) {
        throw new LocalizedError(
          () =>
            t("Eintrag ") +
            (index + 1) +
            t(": Das Feld für ") +
            field +
            t(
              " muss Text oder eine Zahl enthalten. Sie können es auch weglassen.",
            ),
        );
      }
      result[field] = value == null ? "" : String(value).trim();
    }
    result.Linien = formatLines(row.Linien);
    const excluded = new Set([
      "URL",
      "Base_URL",
      "Titel",
      "Untertitel",
      ...Object.values(mapping).filter(Boolean),
    ]);
    result.Metrics = Object.fromEntries(
      Object.entries(row).filter(
        ([key, value]) => !excluded.has(key) && metricValue(value) !== "",
      ),
    );
    result.Metrics.Interne_ID = result.Interne_ID;
    result.Metrics.Linien = result.Linien;
    return result;
  });
}

function acceptImport(records, filename) {
  loadedData = records;
  setMessage(
    info,
    () =>
      t("Dateiname: ") +
      filename +
      "\n" +
      t("Anzahl der Einträge: ") +
      records.length,
  );
  generateBtn.disabled = false;
  setMessage(statusDiv, () => "");
  pendingImport = null;
  mappingDialog.close();
  openLayoutEditor();
}

function selectedMapping() {
  const mapping = Object.fromEntries(
    Object.entries(mappingFields).map(([field, select]) => [
      field,
      select.value,
    ]),
  );
  if (urlMode !== "full") mapping.URL = "";
  if (urlMode !== "base") mapping.Base_URL = "";
  return mapping;
}

function updateMappingSubmit() {
  mappingSubmitBtn.disabled = !pendingImport;
  if (!pendingImport) return;
  try {
    normalizeRecords(
      pendingImport.records,
      selectedMapping(),
      urlMode === "manual" ? manualBaseURL.value : "",
    );
    mappingSubmitBtn.disabled = false;
  } catch {
    mappingSubmitBtn.disabled = true;
  }
}
mappingForm.addEventListener("input", updateMappingSubmit);
mappingForm.addEventListener("change", updateMappingSubmit);

function cancelMapping() {
  pendingImport = null;
  mappingDialog.close();
  setMessage(statusDiv, () =>
    t("Import abgebrochen. Bitte wählen Sie eine JSON-Datei aus."),
  );
}
document
  .getElementById("cancelMappingBtn")
  .addEventListener("click", cancelMapping);
mappingDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  cancelMapping();
});
mappingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!pendingImport) return;
  try {
    const records = normalizeRecords(
      pendingImport.records,
      selectedMapping(),
      urlMode === "manual" ? manualBaseURL.value : "",
    );
    if (urlMode === "manual") saveBaseURL(manualBaseURL.value);
    acceptImport(records, pendingImport.filename);
  } catch (error) {
    setMessage(mappingError, () => error.message);
  }
});

function showMapping(records, filename, keys, mapping, reason) {
  pendingImport = { records, filename };
  manualBaseURL.value = "";
  setMessage(baseURLStorageStatus, () => "");
  renderSavedBaseURLs();
  for (const [field, select] of Object.entries(mappingFields)) {
    select.replaceChildren();
    const empty = document.createElement("option");
    empty.value = "";
    empty.textContent =
      field === "URL" ? t("URL-Feld auswählen …") : t("Nicht verwenden");
    select.append(empty);
    for (const key of keys) {
      const option = document.createElement("option");
      option.value = key;
      const example = records.find(
        (row) => row[key] != null && row[key] !== "",
      )?.[key];
      option.textContent =
        key + (example == null ? "" : " — " + String(example).slice(0, 70));
      select.append(option);
    }
    select.value = mapping[field] || "";
  }
  const simple =
    !mapping.URL &&
    !mapping.Base_URL &&
    ["Titel", "Untertitel", "Interne_ID"].every((field) => mapping[field]) &&
    records.every((row) =>
      ["Titel", "Untertitel", "Interne_ID"].every((field) =>
        row[mapping[field]] == null
          ? field !== "Interne_ID"
          : ["string", "number"].includes(typeof row[mapping[field]]) &&
            (field !== "Interne_ID" ||
              String(row[mapping[field]]).trim() !== ""),
      ),
    );
  document.getElementById("urlModeChoices").hidden = simple;
  document.getElementById("recordMappingFields").hidden = simple;
  setMessage(document.getElementById("mappingHeading"), () =>
    simple ? t("Basis-URL ergänzen") : t("JSON-Felder zuordnen"),
  );
  setMessage(document.getElementById("mappingHelp"), () =>
    simple
      ? t(
          "Titel, Untertitel und interne ID wurden erkannt. Bitte ergänzen Sie nur die Basis-URL.",
        )
      : t(
          "Wählen Sie genau eine der drei Möglichkeiten für die URL. Titel und Untertitel sind optional.",
        ),
  );
  setURLMode(mapping.URL ? "full" : mapping.Base_URL ? "base" : "manual");
  setMessage(mappingError, () => (simple ? "" : reason()));
  setMessage(statusDiv, () => t("Bitte ordnen Sie die JSON-Felder zu."));
  mappingDialog.showModal();
  if (simple) manualBaseURL.focus();
}

async function loadFile(file) {
  if (isGenerating) return;
  const version = ++fileLoadVersion;
  pendingImport = null;
  mappingDialog.close();
  loadedData = null;
  generateBtn.disabled = true;
  setMessage(info, () => "");
  setMessage(statusDiv, () => t("JSON-Datei wird geladen …"));
  try {
    const data = JSON.parse((await file.text()).replace(/^\uFEFF/, ""));
    if (version !== fileLoadVersion) return;
    const records = extractRecords(data);
    const keys = [...new Set(records.flatMap(Object.keys))].filter((key) =>
      records.some(
        (row) => typeof row[key] === "string" || typeof row[key] === "number",
      ),
    );
    if (!keys.length)
      throw new LocalizedError(() =>
        t("Es wurden keine verwendbaren Text- oder Zahlenfelder gefunden."),
      );
    const mapping = Object.fromEntries(
      Object.keys(mappingFields).map((key) => [
        key,
        keys.includes(key) ? key : "",
      ]),
    );
    const recognized = new Set([
      "Titel",
      "Untertitel",
      "URL",
      "Base_URL",
      "Interne_ID",
      "Hst_SLOID",
      "Hst_DiDok",
      "Kt_SLOID",
      "Interner_Bezeichner",
      "Linien",
    ]);
    let reason = () => "";
    let normalized;
    try {
      normalized = normalizeRecords(records, mapping);
    } catch (error) {
      reason = () => error.message;
    }
    if (normalized && keys.every((key) => recognized.has(key))) {
      acceptImport(normalized, file.name);
    } else {
      if (!mapping.URL && !mapping.Base_URL) {
        const candidates = keys.filter((key) =>
          records.every((row) => isWebURL(row[key])),
        );
        if (candidates.length === 1) mapping.URL = candidates[0];
        if (!candidates.length)
          reason = () =>
            t(
              "Es wurde kein Feld mit gültigen URLs gefunden. Geben Sie unten eine Basis-URL ein und wählen Sie das passende ID-Feld. Alternativ können Sie vorhandene URL-Felder zuordnen.",
            );
      }
      showMapping(records, file.name, keys, mapping, reason);
    }
  } catch (error) {
    if (version !== fileLoadVersion) return;
    setMessage(
      statusDiv,
      () =>
        t("Ungültige JSON-Datei: ") +
        (error instanceof SyntaxError
          ? t("Ungültige JSON-Syntax. Bitte prüfen Sie die Datei.")
          : error.message),
    );
  } finally {
    if (version === fileLoadVersion) fileInput.value = "";
  }
}

function sanitizeFilename(text) {
  return (
    String(text || "QR")
      .normalize("NFC")
      .replace(/,/g, "")
      .replace(/[<>:"/\\|?*\x00-\x1f]/g, "_")
      .trim()
      .replace(/\s+/g, "_")
      .slice(0, 120)
      .replace(/[. ]+$/g, "") || "QR"
  );
}

const settingsStorageKey = "qr-generator.settings.v1";
function saveSettings() {
  if (editorSnapshot) return;
  try {
    const { logo, ...appearance } = readSettings();
    localStorage.setItem(
      settingsStorageKey,
      JSON.stringify({
        ...appearance,
        preview: showBulkPreview.checked,
        logoData: logoState.data,
        format: document.getElementById("exportFormat").value,
        singleFormat: document.getElementById("singleFormat").value,
      }),
    );
  } catch {
    /* Preferences are optional when browser storage is unavailable. */
  }
}
function restoreSettings() {
  let saved;
  try {
    saved = JSON.parse(localStorage.getItem(settingsStorageKey) || "null");
  } catch {
    return;
  }
  if (!saved || typeof saved !== "object") return;
  for (const [key, control] of [
    ["shape", shapeSelect],
    ["finderShape", finderShapeSelect],
  ]) {
    if (
      Array.from(control.options).some(
        (option) => option.value === saved[key],
      )
    )
      control.value = saved[key];
  }
  for (const [key, control] of [
    ["color", colorPicker],
    ["finderColor", finderColorPicker],
  ]) {
    if (typeof saved[key] === "string" && /^#[0-9a-f]{6}$/i.test(saved[key]))
      control.value = saved[key];
  }

  if (["png", "svg"].includes(saved.format))
    document.getElementById("exportFormat").value = saved.format;
  if (["png", "svg"].includes(saved.singleFormat))
    document.getElementById("singleFormat").value = saved.singleFormat;
  if (typeof saved.preview === "boolean")
    showBulkPreview.checked = saved.preview;
  const storedLogo = readSavedLogos().find(
    (item) => item.data === saved.logoData,
  ) || (typeof saved.logoData === "string" && saved.logoData.length < 500000 && /^data:image\/png;base64,/.test(saved.logoData) ? {data: saved.logoData} : null);
  if (storedLogo) {
    const version = ++logoState.version;
    const image = new Image();
    image.src = storedLogo.data;
    image
      .decode()
      .then(() => {
        if (
          version !== logoState.version ||
          !image.naturalWidth ||
          image.naturalWidth !== image.naturalHeight ||
          image.naturalWidth > 256
        )
          return;
        logoState.image = image;
        logoState.data = storedLogo.data;

        renderSavedLogos();
        generateQRCode();
      })
      .catch(() => {});
  }
}

function readSettings() {
  return {
    shape: shapeSelect.value,
    finderShape: finderShapeSelect.value,
    color: colorPicker.value,
    finderColor: finderColorPicker.value,
    logo: logoState.image,
    size: EXPORT_SIZE,
  };
}

const bulkLayout = {
  above: [],
  below: ["Interne_ID", "Linien"],
  labels: {},
  custom: {},
  styles: {},
  ribbon: {
    enabled: true,
    rules: [
      {
        id: "test",
        match: "contains",
        pattern: ".test.",
        text: "TST",
        color: "#2563eb",
      },
    ],
  },
};
const singleLayout = {
  above: [],
  below: [],
  labels: {},
  custom: {},
  styles: {},
  ribbon: bulkLayout.ribbon,
};
let metricLayout = bulkLayout;
let editorMode = "bulk";
const layoutStorageKey = "qr-generator.layout.v1";
function saveLayout() {
  if (editorSnapshot) return;
  try {
    localStorage.setItem(layoutStorageKey, JSON.stringify(bulkLayout));
    localStorage.setItem(
      "qr-generator.single-layout.v1",
      JSON.stringify(singleLayout),
    );
  } catch {
    /* Optional local preferences. */
  }
}
function restoreLayout() {
  for (const [layout, storageKey] of [
    [bulkLayout, layoutStorageKey],
    [singleLayout, "qr-generator.single-layout.v1"],
  ]) {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (
        !saved ||
        !Array.isArray(saved.above) ||
        !Array.isArray(saved.below)
      )
        continue;
      const used = new Set();
      for (const area of ["above", "below"])
        layout[area] = saved[area].filter(
          (key) => typeof key === "string" && !used.has(key) && used.add(key),
        );
      for (const prop of ["labels", "custom"])
        layout[prop] = Object.fromEntries(
          Object.entries(saved[prop] || {}).filter(
            ([key, value]) => typeof value === "string",
          ),
        );
      layout.styles = Object.fromEntries(
        Object.entries(saved.styles || {})
          .filter(([key, value]) => value && typeof value === "object")
          .map(([key, value]) => [
            key,
            {
              bold: value.bold === true,
              large: value.large === true,
              black: value.black === true,
            },
          ]),
      );
      if (layout === bulkLayout && saved.ribbon) {
        const ribbon = saved.ribbon;
        if (Array.isArray(ribbon.rules)) {
          layout.ribbon = {
            enabled: ribbon.enabled !== false,
            rules: ribbon.rules
              .filter(
                (rule) =>
                  rule &&
                  typeof rule.pattern === "string" &&
                  typeof rule.text === "string" &&
                  /^#[0-9a-f]{6}$/i.test(rule.color),
              )
              .map((rule) => ({
                id: crypto.randomUUID(),
                match: rule.match === "always" ? "always" : "contains",
                pattern: rule.pattern,
                text: Array.from(rule.text).slice(0, 5).join(""),
                color: rule.color,
              })),
          };
        } else {
          layout.ribbon = {
            enabled: ribbon.mode !== "off",
            rules: [
              {
                id: crypto.randomUUID(),
                match:
                  ribbon.mode === "always" || ribbon.previousMode === "always"
                    ? "always"
                    : "contains",
                pattern: ".test.",
                text: Array.from(ribbon.text || "TST")
                  .slice(0, 5)
                  .join(""),
                color: /^#[0-9a-f]{6}$/i.test(ribbon.color)
                  ? ribbon.color
                  : "#2563eb",
              },
            ],
          };
        }
      }
    } catch {
      /* Ignore invalid stored preferences. */
    }
  }
  singleLayout.ribbon = bulkLayout.ribbon;
  for (const area of ["above", "below"])
    singleLayout[area] = singleLayout[area].filter(
      (key) => !["title", "subtitle"].includes(key),
    );
}
function matchingRibbon(url, layout = metricLayout) {
  if (!layout.ribbon?.enabled) return null;
  const text = String(url || "").toLowerCase();
  return (
    layout.ribbon.rules.find(
      (rule) =>
        rule.text.trim() &&
        (rule.match === "always" ||
          (rule.pattern.trim() && text.includes(rule.pattern.toLowerCase()))),
    ) || null
  );
}
function ribbonVisible(url, layout = metricLayout) {
  return Boolean(matchingRibbon(url, layout));
}
function updateRibbonUI() {
  const ribbon = document.getElementById("layoutRibbon");
  const match = matchingRibbon(layoutSample?.URL, metricLayout);
  const fallback = metricLayout.ribbon.rules[0];
  ribbon.textContent = match?.text || fallback?.text || "+";
  ribbon.style.backgroundColor = match?.color || fallback?.color || "#888888";
  ribbon.hidden = false;
  ribbon.classList.toggle("inactive", !match);
  document.getElementById("ribbonEnabled").checked =
    metricLayout.ribbon.enabled;
  document.getElementById("ribbonRulesEnabled").checked =
    metricLayout.ribbon.enabled;
  const count = document.getElementById("ribbonCount");
  count.textContent = String(metricLayout.ribbon.rules.length);
  count.hidden = metricLayout.ribbon.rules.length === 0;
}
const ribbonDialog = document.getElementById("ribbonDialog");
function openRibbonEditor() {
  renderRibbonRules();
  ribbonDialog.showModal();
}
document
  .getElementById("layoutRibbon")
  .addEventListener("click", openRibbonEditor);
document
  .getElementById("singleRibbonBtn")
  .addEventListener("click", openRibbonEditor);
document
  .getElementById("closeRibbonBtn")
  .addEventListener("click", () => ribbonDialog.close());
document
  .getElementById("applyRibbonBtn")
  .addEventListener("click", () => ribbonDialog.close());
for (const id of ["ribbonEnabled", "ribbonRulesEnabled"])
  document.getElementById(id).addEventListener("change", (event) => {
    metricLayout.ribbon.enabled = event.target.checked;
    saveLayout();
    updateRibbonUI();
    generateQRCode();
  });
document.getElementById("addRibbonBtn").addEventListener("click", () => {
  metricLayout.ribbon.rules.push({
    id: crypto.randomUUID(),
    match: "contains",
    pattern: "",
    text: "TST",
    color: "#2563eb",
  });
  saveLayout();
  renderRibbonRules();
  document
    .querySelector("#ribbonRules .ribbon-rule:last-child input[type=text]")
    ?.focus();
});
function renderRibbonRules() {
  updateRibbonUI();
  const list = document.getElementById("ribbonRules");
  list.replaceChildren();
  for (const rule of metricLayout.ribbon.rules) {
    const row = document.createElement("div");
    row.className = "metric-row ribbon-rule";
    row.dataset.key = rule.id;
    const handle = document.createElement("button");
    handle.type = "button";
    handle.className = "metric-handle";
    handle.textContent = "⠿";
    handle.setAttribute("aria-label", t("Eckband verschieben"));
    const fields = document.createElement("div");
    fields.className = "ribbon-rule-fields";
    const mode = document.createElement("select");
    mode.setAttribute("aria-label", t("Eckband"));
    for (const [value, label] of [
      ["contains", "URL enthält"],
      ["always", "Immer verwenden"],
    ]) {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = t(label);
      mode.append(option);
    }
    mode.value = rule.match;
    const pattern = document.createElement("input");
    pattern.type = "text";
    pattern.value = rule.pattern;
    pattern.placeholder = "test";
    pattern.setAttribute("aria-label", t("URL enthält"));
    pattern.hidden = rule.match === "always";
    const text = document.createElement("input");
    text.type = "text";
    text.value = rule.text;
    text.maxLength = 5;
    text.placeholder = "TST";
    text.setAttribute(
      "aria-label",
      t("Text") + " — " + t("Maximal 5 Zeichen"),
    );
    const color = document.createElement("input");
    color.type = "color";
    color.value = rule.color;
    color.setAttribute("aria-label", t("Farbe"));
    for (const [control, property] of [
      [mode, "match"],
      [pattern, "pattern"],
      [text, "text"],
      [color, "color"],
    ])
      control.addEventListener("input", () => {
        rule[property] =
          property === "text"
            ? Array.from(control.value).slice(0, 5).join("")
            : control.value;
        if (property === "text") control.value = rule.text;
        pattern.hidden = rule.match === "always";
        saveLayout();
        updateRibbonUI();
        generateQRCode();
      });
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "metric-remove";
    remove.textContent = "×";
    remove.setAttribute("aria-label", t("Eckband entfernen"));
    remove.addEventListener("click", async () => {
    if (!await confirmDeletion()) return;
      metricLayout.ribbon.rules = metricLayout.ribbon.rules.filter(
        (item) => item !== rule,
      );
      saveLayout();
      renderRibbonRules();
      updateRibbonUI();
      generateQRCode();
    });
    fields.append(mode, pattern, text, color);
    row.append(handle, fields, remove);
    list.append(row);
    attachRibbonDrag(handle, row, list);
  }
}
function attachRibbonDrag(handle, row, list) {
  handle.addEventListener("keydown", (event) => {
    if (!["ArrowUp", "ArrowDown"].includes(event.key)) return;
    event.preventDefault();
    const rules = metricLayout.ribbon.rules,
      index = rules.findIndex((rule) => rule.id === row.dataset.key);
    const next = index + (event.key === "ArrowUp" ? -1 : 1);
    if (next < 0 || next >= rules.length) return;
    [rules[index], rules[next]] = [rules[next], rules[index]];
    saveLayout();
    renderRibbonRules();
    updateRibbonUI();
    generateQRCode();
    [...list.children]
      .find((item) => item.dataset.key === row.dataset.key)
      ?.querySelector("button")
      .focus();
  });
  handle.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    const original = [...list.children],
      bounds = row.getBoundingClientRect(),
      dy = event.clientY - bounds.top;
    const ghost = row.cloneNode(true);
    ghost.classList.add("ribbon-drag-ghost");
    ghost.setAttribute("aria-hidden", "true");
    Object.assign(ghost.style, {
      position: "fixed",
      top: bounds.top + "px",
      left: bounds.left + "px",
      width: bounds.width + "px",
      pointerEvents: "none",
      zIndex: "20",
    });
    ribbonDialog.append(ghost);
    row.classList.add("ribbon-drag-placeholder");
    const move = (e) => {
      if (e.pointerId !== event.pointerId) return;
      ghost.style.top = e.clientY - dy + "px";
      const others = [...list.children].filter((item) => item !== row);
      const next = others.find((item) => {
        const r = item.getBoundingClientRect(),
          transform = getComputedStyle(item).transform;
        const offset =
          !transform || transform === "none"
            ? 0
            : new DOMMatrixReadOnly(transform).m42;
        return e.clientY < r.top - offset + r.height / 2;
      });
      if (row.nextElementSibling !== (next || null)) {
        const before = new Map(
          [...list.children].map((item) => [
            item,
            item.getBoundingClientRect().top,
          ]),
        );
        for (const item of list.children)
          for (const animation of item.getAnimations()) animation.cancel();
        list.insertBefore(row, next || null);
        if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
          for (const item of list.children)
            if (item !== row)
              item.animate(
                [
                  {
                    transform:
                      "translateY(" +
                      (before.get(item) - item.getBoundingClientRect().top) +
                      "px)",
                  },
                  { transform: "translateY(0)" },
                ],
                { duration: 240, easing: "cubic-bezier(.2,.8,.2,1)" },
              );
      }
      const body = ribbonDialog.querySelector(".modal-scroll-body"),
        rect = body.getBoundingClientRect();
      if (e.clientY < rect.top + 40) body.scrollBy(0, -12);
      if (e.clientY > rect.bottom - 40) body.scrollBy(0, 12);
    };
    const finish = (cancelled = false) => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", cancel);
      document.removeEventListener("keydown", escape);
      ghost.remove();
      row.classList.remove("ribbon-drag-placeholder");
      for (const item of list.children)
        for (const animation of item.getAnimations()) animation.cancel();
      if (cancelled) list.append(...original);
      else {
        const rules = metricLayout.ribbon.rules;
        metricLayout.ribbon.rules = [...list.children].map((item) =>
          rules.find((rule) => rule.id === item.dataset.key),
        );
        saveLayout();
        updateRibbonUI();
        generateQRCode();
      }
    };
    const up = (e) => {
        if (e.pointerId === event.pointerId) finish();
      },
      cancel = (e) => {
        if (e.pointerId === event.pointerId) finish(true);
      };
    const escape = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        finish(true);
      }
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", cancel);
    document.addEventListener("keydown", escape);
  });
}
const layoutDialog = document.getElementById("layoutDialog");
let layoutSample;
let availableMetricKeys = [];
function metricValue(value) {
  if (value == null) return "";
  if (["string", "number", "boolean"].includes(typeof value))
    return String(value).trim();
  if (Array.isArray(value))
    return value
      .filter((item) => ["string", "number"].includes(typeof item))
      .join(", ");
  return "";
}
function metricLabel(key, layout = metricLayout) {
  return Object.hasOwn(layout.labels || {}, key)
    ? layout.labels[key]
    : key === "Interne_ID"
      ? ""
      : key === "date:current"
        ? t("Datum")
        : key;
}
function currentDateText() {
  return new Intl.DateTimeFormat(window.QRGenerator.i18n.language === "en" ? "en-GB" : "de-CH", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(new Date());
}
function metricValueFor(record, key, layout = metricLayout) {
  if (key === "date:current") return layout.dateText || currentDateText();
  if (Object.hasOwn(layout.custom || {}, key)) return layout.custom[key];
  return key === "Linien"
    ? formatLines(record.Metrics?.[key])
    : metricValue(record.Metrics?.[key]);
}
function metricStyle(key, layout = metricLayout, scale = 1) {
  const style = layout.styles?.[key] || {};
  const size = Math.round((style.large ? 48 : 36) * scale);
  return {
    font: (style.bold ? "bold " : "") + size + "px Arial",
    lineHeight: Math.ceil(size * 1.4),
    color: style.black ? "#111" : "#666",
    size,
  };
}
function metricText(record, key, layout = metricLayout) {
  if (Object.hasOwn(layout.custom || {}, key)) return layout.custom[key];
  const value = metricValueFor(record, key, layout);
  if (!value) return "";
  const label = metricLabel(key, layout);
  return label ? label + ": " + value : value;
}
function isTestURL(value) {
  return typeof value === "string" && value.toLowerCase().includes(".test.");
}
function drawTestRibbon(context, width, layout = metricLayout, url = "") {
  const ribbon = matchingRibbon(url, layout);
  if (!ribbon) return;
  const size = width * 0.13;
  context.save();
  context.fillStyle = ribbon.color;
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(size, 0);
  context.lineTo(0, size);
  context.closePath();
  context.fill();
  context.translate(size * 0.32, size * 0.32);
  context.rotate(-Math.PI / 4);
  context.font = "bold " + Math.round(width * 0.028) + "px Arial";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = "white";
  context.fillText(ribbon.text, 0, 0, size * 0.7);
  context.restore();
}
function singleRecord() {
  const metrics = Object.fromEntries(new URLSearchParams(location.search));
  const title = metrics.title || "",
    subtitle = metrics.subtitle || "";
  delete metrics.title;
  delete metrics.subtitle;
  if (Object.hasOwn(metrics, "url")) metrics.url = qrInput.value.trim();
  return {
    URL: qrInput.value.trim() || "https://example.com",
    Titel: title,
    Untertitel: subtitle,
    Metrics: metrics,
  };
}
function updateUnusedParameters() {
  const used = new Set([
    "url",
    "title",
    "subtitle",
    ...singleLayout.above,
    ...singleLayout.below,
  ]);
  const unused = [
    ...new Set(new URLSearchParams(location.search).keys()),
  ].filter((key) => !used.has(key));
  for (const id of ["unusedQueryParameters", "unusedTemplateParameters"]) {
    const node = document.getElementById(id);
    node.hidden =
      !unused.length ||
      (id === "unusedTemplateParameters" && editorMode !== "single");
    node.textContent = unused.length
      ? t("Ungenutzte URL-Parameter: ") + unused.join(", ")
      : "";
  }
}
function openLayoutEditor(mode = "bulk") {
  if (typeof mode !== "string") mode = "bulk";
  editorMode = mode;
  metricLayout = mode === "single" ? singleLayout : bulkLayout;
  if (!layoutDialog.open) templateLibrary.markBaseline();
  if (mode === "single" && !editorSnapshot)
    editorSnapshot = {
      layout: structuredClone(singleLayout),
      ribbon: structuredClone(bulkLayout.ribbon),
      settings: readSettings(),
      logo: logoState.image,
      logoData: logoState.data,
      singleFormat: document.getElementById("singleFormat").value,
    };
  const demo = {
    URL: "https://mobileinfo.test.bernmobil.ch/stops/BEISPIEL",
    Titel: t("Bern, Bahnhof"),
    Untertitel: t("Kante A"),
    Metrics: {
      Interne_ID: "M-BEISPIEL",
      Linien: "3, 9, 10, 12, 332",
      Hst_SLOID: "ch:1:sloid:7000",
      Hst_DiDok: "8507000",
      Kt_SLOID: "ch:1:sloid:7000:0:1",
      Interner_Bezeichner: t("Richtung Zentrum"),
    },
  };
  if (mode === "single") {
    layoutSample = singleRecord();
    availableMetricKeys = Object.keys(layoutSample.Metrics);
  } else if (loadedData?.length) {
    availableMetricKeys = [
      ...new Set(
        loadedData.flatMap((record) => Object.keys(record.Metrics || {})),
      ),
    ].filter((key) =>
      loadedData.some((record) => metricValue(record.Metrics[key])),
    );
    const richest = loadedData.reduce((best, record) =>
      Object.values(record.Metrics).filter(metricValue).length >
      Object.values(best.Metrics).filter(metricValue).length
        ? record
        : best,
    );
    layoutSample = { ...richest, Metrics: { ...richest.Metrics } };
    for (const key of availableMetricKeys) {
      if (!metricValue(layoutSample.Metrics[key]))
        layoutSample.Metrics[key] = loadedData.find((record) =>
          metricValue(record.Metrics[key]),
        ).Metrics[key];
    }
    for (const key of ["Titel", "Untertitel"])
      if (!layoutSample[key])
        layoutSample[key] =
          loadedData.find((record) => record[key])?.[key] || "";
  } else {
    layoutSample = demo;
    availableMetricKeys = Object.keys(demo.Metrics);
  }

  document.getElementById("layoutExportBtn").disabled =
    !loadedData || isGenerating;
  document.getElementById("layoutExportBtn").hidden = mode === "single";
  document.getElementById("exportFormat").closest(".export-format").hidden =
    mode === "single";
  document.getElementById("cancelLayoutBtn").hidden = mode !== "single";
  document.getElementById("layoutTitle").textContent = layoutSample.Titel;
  document.getElementById("layoutSubtitle").textContent =
    layoutSample.Untertitel;
  updateRibbonUI();
  setMessage(document.getElementById("layoutError"), () => "");
  try {
    setMessage(document.getElementById("layoutError"), () =>
      renderQRCode(
        document.getElementById("layoutQR"),
        layoutSample.URL,
        readSettings(),
      ),
    );
  } catch (error) {
    setMessage(document.getElementById("layoutError"), () => error.message);
  }
  renderMetricEditor();
  if (!layoutDialog.open) layoutDialog.showModal();
}
function moveMetric(key, destination, position) {
  const source = ["above", "below"].find((area) =>
    metricLayout[area].includes(key),
  );
  if (!source || !["above", "below"].includes(destination)) return;
  const oldIndex = metricLayout[source].indexOf(key);
  metricLayout[source].splice(oldIndex, 1);
  if (source === destination && oldIndex < position) position--;
  metricLayout[destination].splice(
    Math.max(0, Math.min(position, metricLayout[destination].length)),
    0,
    key,
  );
  renderMetricEditor();
  saveLayout();
  [...layoutDialog.querySelectorAll(".metric-handle")]
    .find((handle) => handle.dataset.key === key)
    ?.focus();
}
function attachMetricDrag(handle, row, key, area, index) {
  let pointer = null,
    placeholder,
    separator,
    origin,
    finishing = false;
  let offsetX = 0,
    offsetY = 0;
  const containers = [
    document.getElementById("layoutAbove"),
    document.getElementById("layoutBelow"),
  ];
  const reducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const animatedItems = () => [
    ...layoutDialog.querySelectorAll(
      ".metric-row:not(.is-dragging), .metric-add, .metric-placeholder, .qr-edit-button",
    ),
  ];
  const rearrange = (change) => {
    const items = animatedItems();
    const before = new Map(
      items.map((item) => [item, item.getBoundingClientRect()]),
    );
    for (const item of items)
      for (const animation of item.getAnimations()) animation.cancel();
    change();
    if (reducedMotion()) return;
    for (const item of items) {
      const from = before.get(item),
        to = item.getBoundingClientRect();
      const dx = from.left - to.left,
        dy = from.top - to.top;
      if (dx || dy)
        item.animate(
          [
            { transform: `translate(${dx}px, ${dy}px)` },
            { transform: "translate(0, 0)" },
          ],
          { duration: 240, easing: "cubic-bezier(.2,.8,.2,1)" },
        );
    }
  };
  // Collision tests use final layout positions, not intermediate animated positions.
  const layoutBounds = (item) => {
    const rect = item.getBoundingClientRect();
    const transform = getComputedStyle(item).transform;
    const offset =
      transform === "none" ? 0 : new DOMMatrixReadOnly(transform).m42;
    return {
      top: rect.top - offset,
      bottom: rect.bottom - offset,
      height: rect.height,
    };
  };
  handle.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || pointer !== null || finishing) return;
    event.preventDefault();
    pointer = event.pointerId;
    const bounds = row.getBoundingClientRect();
    offsetX = event.clientX - bounds.left;
    offsetY = event.clientY - bounds.top;
    separator = row.nextElementSibling;
    origin = document.createComment("drag origin");
    row.before(origin);
    placeholder = document.createElement("div");
    placeholder.className = "metric-placeholder";
    placeholder.style.height = bounds.height + "px";
    row.before(placeholder);
    Object.assign(row.style, {
      position: "fixed",
      left: bounds.left + "px",
      top: bounds.top + "px",
      width: bounds.width + "px",
      zIndex: "20",
      pointerEvents: "none",
    });
    row.classList.add("is-dragging");
    layoutDialog.append(row);
    handle.setPointerCapture(pointer);
    layoutDialog.classList.add("is-sorting");
    document.addEventListener("keydown", cancelWithEscape);
  });
  handle.addEventListener("pointermove", (event) => {
    if (pointer !== event.pointerId || finishing) return;
    row.style.left = event.clientX - offsetX + "px";
    row.style.top = event.clientY - offsetY + "px";
    const hit = document.elementFromPoint(event.clientX, event.clientY);
    const container = containers.find((item) => item.contains(hit));
    if (container && !placeholder.contains(hit) && !separator.contains(hit)) {
      const rows = [...container.children].filter((item) =>
        item.matches(".metric-row"),
      );
      const next = rows.find((item) => {
        const bounds = layoutBounds(item);
        return event.clientY < bounds.top + bounds.height / 2;
      });
      // Each row travels with its trailing + line. The leading + stays at the top.
      const anchor = next || null;
      const currentNext = separator.nextElementSibling;
      if (placeholder.parentElement !== container || currentNext !== anchor)
        rearrange(() => {
          const pair = document.createDocumentFragment();
          pair.append(placeholder, separator);
          container.insertBefore(pair, anchor);
        });
    }
    const scrollBody = layoutDialog.querySelector(".modal-scroll-body");
    const bounds = scrollBody.getBoundingClientRect();
    if (event.clientY < bounds.top + 45) scrollBody.scrollBy(0, -14);
    if (event.clientY > bounds.bottom - 45) scrollBody.scrollBy(0, 14);
  });
  const finish = async (event, cancelled) => {
    if (pointer !== event.pointerId || finishing) return;
    finishing = true;
    document.removeEventListener("keydown", cancelWithEscape);
    if (cancelled) rearrange(() => origin.after(placeholder, separator));
    const destination =
      placeholder.parentElement.id === "layoutAbove" ? "above" : "below";
    const next = separator.nextElementSibling;
    const position = next
      ? metricLayout[destination].indexOf(next.dataset.key)
      : metricLayout[destination].length;
    const to = placeholder.getBoundingClientRect(),
      from = row.getBoundingClientRect();
    if (!reducedMotion()) {
      try {
        await row.animate(
          [
            { transform: "translate(0, 0)" },
            {
              transform: `translate(${to.left - from.left}px, ${to.top - from.top}px)`,
            },
          ],
          {
            duration: 170,
            easing: "cubic-bezier(.2,.8,.2,1)",
            fill: "forwards",
          },
        ).finished;
      } catch {
        /* Interrupted animation. */
      }
    }
    if (handle.hasPointerCapture(pointer))
      handle.releasePointerCapture(pointer);
    pointer = null;
    for (const item of [...animatedItems(), row])
      for (const animation of item.getAnimations()) animation.cancel();
    placeholder.replaceWith(row);
    origin.remove();
    row.classList.remove("is-dragging");
    row.removeAttribute("style");
    layoutDialog.classList.remove("is-sorting");
    finishing = false;
    if (!cancelled) moveMetric(key, destination, position);
  };
  const cancelWithEscape = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      finish({ pointerId: pointer }, true);
    }
  };
  handle.addEventListener("pointerup", (event) => finish(event, false));
  handle.addEventListener("pointercancel", (event) => finish(event, true));
  handle.addEventListener("lostpointercapture", (event) => {
    if (!finishing) finish(event, true);
  });
  handle.addEventListener("keydown", (event) => {
    if (!["ArrowUp", "ArrowDown"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "ArrowUp") {
      if (index > 0) moveMetric(key, area, index - 1);
      else if (area === "below")
        moveMetric(key, "above", metricLayout.above.length);
    } else {
      if (index < metricLayout[area].length - 1)
        moveMetric(key, area, index + 2);
      else if (area === "above") moveMetric(key, "below", 0);
    }
  });
}
function renderMetricEditor() {
  updateUnusedParameters();
  const used = new Set([...metricLayout.above, ...metricLayout.below]);
  const remaining = availableMetricKeys.filter((key) => !used.has(key));
  for (const [area, target] of [
    ["above", "layoutAbove"],
    ["below", "layoutBelow"],
  ]) {
    const container = document.getElementById(target);
    container.replaceChildren();
    const addControl = (index) => {
      const slot = document.createElement("div");
      slot.className = "metric-add";
      slot.dataset.area = area;
      slot.dataset.index = String(index);
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "+";
      button.className = "metric-plus";
      button.setAttribute(
        "aria-label",
        t("Feld ") +
          (area === "above" ? t("oberhalb") : t("unterhalb")) +
          t(" des QR-Codes hinzufügen"),
      );
      button.setAttribute("aria-expanded", "false");
      const dropdown = document.createElement("div");
      dropdown.className = "metric-options";
      dropdown.hidden = true;
      dropdown.setAttribute("role", "group");
      dropdown.setAttribute("aria-label", t("Verfügbare Felder"));
      const close = () => {
        dropdown.hidden = true;
        button.setAttribute("aria-expanded", "false");
      };
      for (const key of [
        ...remaining,
        ...(!used.has("date:current") ? ["date:current"] : []),
        "__add_custom__",
      ]) {
        const option = document.createElement("button");
        option.type = "button";
        option.textContent =
          key === "__add_custom__"
            ? t("+ Eigener Text")
            : key === "date:current"
              ? t("Aktuelles Datum")
              : key;
        option.addEventListener("click", () => {
          if ([...metricLayout.above, ...metricLayout.below].includes(key))
            return;
          const addedKey =
            key === "__add_custom__" ? "custom:" + crypto.randomUUID() : key;
          if (key === "__add_custom__")
            metricLayout.custom[addedKey] = t("Eigener Text");
          metricLayout[area].splice(index, 0, addedKey);
          saveLayout();
          renderMetricEditor();
          [...layoutDialog.querySelectorAll(".metric-handle")]
            .find((handle) => handle.dataset.key === addedKey)
            ?.focus();
          if (key === "__add_custom__")
            [...layoutDialog.querySelectorAll(".metric-row")]
              .find((row) => row.dataset.key === addedKey)
              ?.querySelector(".metric-label")
              ?.click();
        });
        dropdown.append(option);
      }
      button.addEventListener("click", () => {
        const open = dropdown.hidden;
        for (const other of layoutDialog.querySelectorAll(
          ".metric-options",
        )) {
          other.hidden = true;
          other.previousElementSibling?.setAttribute(
            "aria-expanded",
            "false",
          );
        }
        dropdown.hidden = !open;
        button.setAttribute("aria-expanded", String(open));
        if (open) dropdown.querySelector("button")?.focus();
      });
      slot.addEventListener("focusout", (event) => {
        if (!slot.contains(event.relatedTarget)) close();
      });
      slot.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !dropdown.hidden) {
          event.preventDefault();
          event.stopPropagation();
          close();
          button.focus();
        }
      });
      slot.append(button, dropdown);
      container.append(slot);
    };
    addControl(0);
    metricLayout[area].forEach((key, index) => {
      if (
        !availableMetricKeys.includes(key) &&
        !Object.hasOwn(metricLayout.custom, key) &&
        key !== "date:current"
      )
        return;
      const row = document.createElement("div");
      row.className = "metric-row";
      row.dataset.key = key;
      const handle = document.createElement("button");
      handle.type = "button";
      handle.className = "metric-handle";
      handle.textContent = "⠿";
      handle.dataset.key = key;
      handle.setAttribute(
        "aria-label",
        key + t(" verschieben (ziehen oder Pfeiltasten verwenden)"),
      );
      handle.title = t("Ziehen oder mit den Pfeiltasten verschieben");
      attachMetricDrag(handle, row, key, area, index);
      const text = document.createElement("span");
      text.className = "metric-content";
      const label = document.createElement("button");
      label.type = "button";
      label.className = "metric-label";
      const isCustom = Object.hasOwn(metricLayout.custom, key);
      label.textContent = isCustom
        ? metricLayout.custom[key]
        : metricLabel(key) || t("Beschriftung hinzufügen");
      label.title = t("Beschriftung ändern");
      label.setAttribute(
        "aria-label",
        t("Beschriftung für ") + key + t(" ändern"),
      );
      const value = document.createElement("span");
      value.className = "metric-value";
      value.textContent = isCustom
        ? ""
        : (metricLabel(key) ? ": " : " ") + metricValueFor(layoutSample, key);
      label.addEventListener("click", () => {
        const input = document.createElement("input");
        input.type = "text";
        input.className = "metric-label-input";
        input.value = isCustom ? metricLayout.custom[key] : metricLabel(key);
        input.placeholder = t("Beschriftung");
        input.setAttribute("aria-label", t("Beschriftung für ") + key);
        let finished = false;
        const finish = (save) => {
          if (finished) return;
          finished = true;
          if (save) {
            if (isCustom) metricLayout.custom[key] = input.value.trim();
            else metricLayout.labels[key] = input.value.trim();
            saveLayout();
          }
          label.textContent = isCustom
            ? metricLayout.custom[key] || t("Text eingeben")
            : metricLabel(key) || t("Beschriftung hinzufügen");
          value.textContent = isCustom
            ? ""
            : (metricLabel(key) ? ": " : " ") +
              metricValueFor(layoutSample, key);
          input.replaceWith(label);
        };
        input.addEventListener("blur", () => finish(true));
        input.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
            finish(event.key === "Enter");
            label.focus();
          }
        });
        label.replaceWith(input);
        input.focus();
        input.select();
      });
      text.append(label, value);
      const toolbar = document.createElement("span");
      toolbar.className = "metric-toolbar";
      const controls = [];
      const refreshStyle = () => {
        const style = metricLayout.styles[key] || {};
        text.style.fontWeight = style.bold ? "700" : "400";
        text.style.fontSize = style.large ? "17px" : "14px";
        text.style.color = style.black ? "#111" : "#666";
        for (const [button, property, activeValue] of controls)
          button.setAttribute(
            "aria-pressed",
            String(Boolean(style[property]) === activeValue),
          );
      };
      for (const [caption, description, property, activeValue] of [
        ["B", t("Fett"), "bold", true],
        ["A", t("Kleine Schrift"), "large", false],
        ["A", t("Grosse Schrift"), "large", true],
        ["●", t("Schwarz statt Grau"), "black", true],
      ]) {
        const button = document.createElement("button");
        button.type = "button";
        button.className =
          "metric-format" +
          (property === "large"
            ? activeValue
              ? " font-large"
              : " font-small"
            : property === "black"
              ? " color-toggle"
              : " font-bold");
        button.textContent = caption;
        button.title = description;
        button.setAttribute("aria-label", description);
        controls.push([button, property, activeValue]);
        button.addEventListener("click", () => {
          const style = (metricLayout.styles[key] ||= {});
          style[property] =
            property === "large" ? activeValue : !style[property];
          refreshStyle();
          saveLayout();
        });
        toolbar.append(button);
      }
      refreshStyle();
      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "×";
      remove.className = "metric-remove";
      remove.setAttribute("aria-label", key + t(" entfernen"));
      remove.addEventListener("click", async () => {
    if (!await confirmDeletion()) return;
        metricLayout[area].splice(index, 1);
        if (isCustom) delete metricLayout.custom[key];
        delete metricLayout.styles[key];
        saveLayout();
        renderMetricEditor();
      });
      row.append(handle, text, toolbar, remove);
      container.append(row);
      addControl(index + 1);
    });
  }
}
document
  .getElementById("editLayoutBtn")
  .addEventListener("click", openLayoutEditor);
document
  .getElementById("closeLayoutBtn")
  .addEventListener("click", () => closeLayoutEditor(false));
document
  .getElementById("cancelLayoutBtn")
  .addEventListener("click", () => closeLayoutEditor(false));
layoutDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeLayoutEditor(false);
});
document
  .getElementById("editSingleTemplateBtn")
  .addEventListener("click", () => openLayoutEditor("single"));
document
  .getElementById("applyLayoutBtn")
  .addEventListener("click", () => closeLayoutEditor(true));
async function closeLayoutEditor(apply) {
  if ((apply || editorMode === "bulk") && templateChanged() && await requestTemplateSave(true) === "cancel") return false;
  if (!apply && editorSnapshot) {
    Object.assign(singleLayout, editorSnapshot.layout);
    bulkLayout.ribbon = editorSnapshot.ribbon;
    singleLayout.ribbon = bulkLayout.ribbon;
    for (const [key, control] of [
      ["shape", shapeSelect],
      ["finderShape", finderShapeSelect],
      ["color", colorPicker],
      ["finderColor", finderColorPicker],
    ])
      control.value = editorSnapshot.settings[key];
    ++logoState.version;
    logoState.image = editorSnapshot.logo;
    logoState.data = editorSnapshot.logoData;
    document.getElementById("singleFormat").value = editorSnapshot.singleFormat;
  }
  editorSnapshot = null;
  metricLayout = bulkLayout;
  layoutDialog.close();
  saveLayout();
  saveSettings();
  renderSavedLogos();
  generateQRCode();
}
document.getElementById("layoutExportBtn").addEventListener("click", async () => {
  if (templateChanged() && await requestTemplateSave(true) === "cancel") return;
  layoutDialog.close();
  generateZip();
});

function formatLines(value) {
  const values = Array.isArray(value) ? value : [value];
  const lines = values.flatMap((item) => {
    if (typeof item !== "string" && typeof item !== "number") return [];
    return String(item)
      .split(/[,;\s]+/)
      .filter(Boolean)
      .map((line) =>
        /^\d+$/.test(line) ? line.replace(/^0+(?=\d)/, "") : line,
      );
  });
  return [...new Set(lines)]
    .sort((a, b) => a.localeCompare(b, "de", { numeric: true }))
    .join(", ");
}

function createLabeledCanvas(
  qrCanvas,
  title,
  subtitle,
  internalId = "",
  lines = "",
  record = null,
  layout = metricLayout,
) {
  const output = document.createElement("canvas");
  const nativeContext = output.getContext("2d");
  const context = qrCanvas.svgContent
    ? vectorContext(nativeContext)
    : nativeContext;
  const margin = Math.max(12, Math.round(qrCanvas.width * 0.05));
  const maxWidth = qrCanvas.width - margin * 2;
  const scale = qrCanvas.width / 1000;
  const titleSize = Math.round(72 * scale);
  const subtitleSize = Math.round(48 * scale);
  const idSize = Math.round(36 * scale);
  const idLineHeight = Math.ceil(idSize * 1.4);
  const blocks = [];
  for (const [text, font, lineHeight, color] of [
    [title, `bold ${titleSize}px Arial`, Math.ceil(titleSize * 1.3), "#222"],
    [
      subtitle,
      `${subtitleSize}px Arial`,
      Math.ceil(subtitleSize * 1.4),
      "#666",
    ],
  ]) {
    if (!text.trim()) continue;
    context.font = font;
    blocks.push({
      font,
      lineHeight,
      color,
      lines: wrapText(context, text, maxWidth),
    });
  }
  if (record) {
    context.font = `${idSize}px Arial`;
    for (const key of layout.above) {
      const text = metricText(record, key, layout);
      if (text) {
        const style = metricStyle(key, layout, scale);
        context.font = style.font;
        blocks.push({ ...style, lines: wrapText(context, text, maxWidth) });
      }
    }
  }
  const ribbonHeight =
    record && ribbonVisible(record.URL, layout) ? Math.round(110 * scale) : 0;
  const headerHeight =
    ribbonHeight +
    (blocks.length
      ? margin * 2 +
        blocks.reduce(
          (height, block) => height + block.lines.length * block.lineHeight,
          0,
        )
      : 0);
  const idText = String(internalId ?? "").trim();
  context.font = `${idSize}px Arial`;
  const idLines = idText ? wrapText(context, idText, maxWidth) : [];
  const lineText = formatLines(lines);
  const footerBlocks = record
    ? layout.below.flatMap((key) => {
        const text = metricText(record, key, layout);
        if (!text) return [];
        const style = metricStyle(key, layout, scale);
        context.font = style.font;
        return [{ ...style, lines: wrapText(context, text, maxWidth) }];
      })
    : [
        {
          font: idSize + "px Arial",
          color: "#666",
          lineHeight: idLineHeight,
          lines: [
            ...idLines,
            ...(lineText
              ? wrapText(context, "Linien: " + lineText, maxWidth)
              : []),
          ],
        },
      ].filter((block) => block.lines.length);
  const footerHeight = footerBlocks.length
    ? margin * 2 +
      footerBlocks.reduce(
        (height, block) => height + block.lines.length * block.lineHeight,
        0,
      )
    : 0;
  output.width = qrCanvas.width;
  output.height = qrCanvas.height + headerHeight + footerHeight;
  // Browsers impose canvas size limits; fail clearly instead of exporting clipped text.
  if (output.height > 16384)
    throw new LocalizedError(() =>
      t("Die Beschriftung ist zu lang. Bitte kürzen Sie den Text."),
    );
  context.fillStyle = "white";
  context.fillRect(0, 0, output.width, output.height);
  context.textAlign = "center";
  context.textBaseline = "middle";
  let y = margin + ribbonHeight;
  for (const block of blocks) {
    context.font = block.font;
    context.fillStyle = block.color;
    for (const line of block.lines) {
      context.fillText(
        line,
        output.width / 2,
        y + block.lineHeight / 2,
        maxWidth,
      );
      y += block.lineHeight;
    }
  }
  context.drawImage(qrCanvas, 0, headerHeight);
  context.font = `${idSize}px Arial`;
  context.fillStyle = "#666";
  y = headerHeight + qrCanvas.height + margin;
  for (const block of footerBlocks) {
    context.font = block.font;
    context.fillStyle = block.color;
    for (const line of block.lines) {
      context.fillText(
        line,
        output.width / 2,
        y + block.lineHeight / 2,
        maxWidth,
      );
      y += block.lineHeight;
    }
  }
  if (ribbonHeight) drawTestRibbon(context, output.width, layout, record.URL);
  if (qrCanvas.svgContent) output.svgContent = context.svgContent;
  return output;
}

function toPNG(source) {
  return new Promise((resolve, reject) =>
    source.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Die PNG-Datei konnte nicht erstellt werden."));
    }, "image/png"),
  );
}

const showBulkPreview = document.getElementById("showBulkPreview");
const bulkPreview = document.getElementById("bulkPreview");
const bulkCanvas = document.getElementById("bulkCanvas");
const previewStatus = document.getElementById("previewStatus");
function dismissPreview() {
  showBulkPreview.checked = false;
  saveSettings();
  bulkPreview.close();
}
document
  .getElementById("closePreviewBtn")
  .addEventListener("click", dismissPreview);
bulkPreview.addEventListener("cancel", (event) => {
  event.preventDefault();
  dismissPreview();
});
showBulkPreview.addEventListener("change", () => {
  if (!showBulkPreview.checked) bulkPreview.close();
  saveSettings();
});

generateBtn.addEventListener("click", generateZip);
const cancelExportBtn = document.getElementById("cancelExportBtn");
let cancelExportRequested = false;
const exportCancelled = new Error("Export abgebrochen");
cancelExportBtn.addEventListener("click", () => {
  if (!isGenerating) return;
  cancelExportRequested = true;
  cancelExportBtn.disabled = true;
  setMessage(statusDiv, () => t("Export wird abgebrochen …"));
});

function checkExportCancelled() {
  if (cancelExportRequested) throw exportCancelled;
}

async function generateZip() {
  if (!loadedData || isGenerating) return;
  isGenerating = true;
  cancelExportRequested = false;
  cancelExportBtn.hidden = false;
  cancelExportBtn.disabled = false;
  generateBtn.disabled = true;
  fileInput.disabled = true;
  dropZone.setAttribute("aria-disabled", "true");
  bulkPreview.close();
  const entries = loadedData.slice();
  const format = document.getElementById("exportFormat").value;
  const settings = { ...readSettings(), vector: format === "svg" };
  const exportLayout = {
    ...structuredClone(bulkLayout),
    dateText: currentDateText(),
  };
  // Keep one language throughout this ZIP even if the interface language changes.
  for (const key of [...exportLayout.above, ...exportLayout.below])
    exportLayout.labels[key] = metricLabel(key, bulkLayout);
  try {
    let adjustedCount = 0;
    const filenames = new Set();
    const zip = new JSZip();
    const qrCanvas = document.createElement("canvas");
    for (let i = 0; i < entries.length; i++) {
      checkExportCancelled();
      const entry = entries[i];
      setMessage(
        statusDiv,
        () =>
          t("QR-Code ") +
          (i + 1) +
          t(" von ") +
          entries.length +
          t(" wird erstellt …"),
      );
      const adjustment = renderQRCode(qrCanvas, entry.URL, settings);
      if (adjustment) adjustedCount++;
      const output = createLabeledCanvas(
        qrCanvas,
        entry.Titel,
        entry.Untertitel,
        entry.Interne_ID,
        entry.Linien,
        entry,
        exportLayout,
      );
      if (showBulkPreview.checked) {
        bulkCanvas.width = output.width;
        bulkCanvas.height = output.height;
        bulkCanvas.getContext("2d").drawImage(output, 0, 0);
        setMessage(previewStatus, () => statusDiv.textContent);
        if (!bulkPreview.open) bulkPreview.showModal();
        // Yield for painting/cancellation without adding a delay per image.
        await new Promise((resolve) => setTimeout(resolve, 0));
      } else {
        // Allow cancellation and other UI events between images.
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
      checkExportCancelled();
      const image = format === "svg" ? toSVG(output) : await toPNG(output);
      checkExportCancelled();
      const baseName = sanitizeFilename(entry.Titel || entry.Interne_ID);
      let fileName = baseName + "." + format;
      let suffix = 2;
      while (filenames.has(fileName.toLowerCase()))
        fileName = baseName + "_" + suffix++ + "." + format;
      filenames.add(fileName.toLowerCase());
      zip.file(fileName, image);
    }
    setMessage(statusDiv, () => t("ZIP-Datei wird erstellt …"));
    setMessage(previewStatus, () => statusDiv.textContent);
    checkExportCancelled();
    const zipBlob = await zip.generateAsync(
      { type: "blob" },
      checkExportCancelled,
    );
    checkExportCancelled();
    saveAs(zipBlob, "QR-Codes.zip");
    loadedData = null;
    fileInput.value = "";
    setMessage(info, () => "");
    bulkPreview.close();
    bulkCanvas.width = bulkCanvas.height = 0;
    setMessage(statusDiv, () => "");
    toast(
      entries.length +
        t(" QR-Codes exportiert.") +
        (adjustedCount ? " " + adjustedCount + t(" ohne Logo.") : ""),
    );
  } catch (error) {
    if (error === exportCancelled) {
      setMessage(statusDiv, () =>
        t(
          "Export abgebrochen. Die importierten Daten bleiben für einen erneuten Export erhalten.",
        ),
      );
    } else {
      console.error(error);
      setMessage(
        statusDiv,
        () => t("Export fehlgeschlagen: ") + error.message,
      );
    }
  } finally {
    bulkPreview.close();
    bulkCanvas.width = bulkCanvas.height = 0;
    cancelExportBtn.hidden = true;
    isGenerating = false;
    fileInput.disabled = false;
    dropZone.setAttribute("aria-disabled", "false");
    generateBtn.disabled = !loadedData;
  }
}

function clearQRCode() {
  canvas.width = EXPORT_SIZE;
  canvas.height = canvas.width;
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  downloadBtn.hidden = true;
}

function loadQueryParameters() {
  const params = new URLSearchParams(window.location.search);

  const url = params.get("url");
  const title = params.get("title");
  const subtitle = params.get("subtitle");

  if (url) {
    qrInput.value = url;
  }

  qrTitle.textContent = title || "";
  qrSubtitle.textContent = subtitle || "";

  if (title) {
    document.title = title;
  }
}

function generateQRCode() {
  updateUnusedParameters();
  setMessage(qrError, () => "");
  setMessage(document.getElementById("renderNotice"), () => "");
  const isExample = !qrInput.value.trim();
  canvas.classList.toggle("is-example", isExample);
  canvas.setAttribute(
    "aria-label",
    isExample
      ? t("Beispiel-QR-Code ohne eigene Daten")
      : t("Erstellter QR-Code"),
  );

  const inputText =
    qrInput.value.trim() || (isExample ? "https://example.com" : "");
  updateRibbonUI();

  if (inputText === "") {
    clearQRCode();
    return;
  }

  if (typeof qrcode !== "function") {
    downloadBtn.hidden = true;
    clearQRCode();
    setMessage(qrError, () =>
      t(
        "Die QR-Code-Bibliothek konnte nicht geladen werden. Bitte die Seite neu laden.",
      ),
    );
    return;
  }

  try {
    // Verify off-screen; failed logo checks must not erase the visible preview.
    const nextCanvas = document.createElement("canvas");
    const adjustment = renderQRCode(nextCanvas, inputText, readSettings());
    setMessage(document.getElementById("renderNotice"), () => adjustment);
    const record = singleRecord();
    const output = createLabeledCanvas(
      nextCanvas,
      record.Titel,
      record.Untertitel,
      "",
      "",
      record,
      singleLayout,
    );
    canvas.width = output.width;
    canvas.height = output.height;
    ctx.drawImage(output, 0, 0);
    if (layoutDialog.open && layoutSample)
      renderQRCode(
        document.getElementById("layoutQR"),
        layoutSample.URL,
        readSettings(),
      );
    if (qrStyleDialog.open)
      renderQRCode(
        document.getElementById("styleQR"),
        layoutSample?.URL || inputText,
        readSettings(),
      );
    downloadBtn.hidden = isExample;
  } catch (error) {
    downloadBtn.hidden = true;
    setMessage(
      qrError,
      () =>
        (error instanceof Error
          ? error.message
          : t(
              "Der Text konnte nicht als QR-Code erstellt werden. Bitte kürzen Sie die Eingabe.",
            )) + t(" Die letzte erfolgreiche Vorschau bleibt erhalten."),
    );
    console.error(error);
  }
}

async function downloadQRCode() {
  if (downloadBtn.hidden || !qrInput.value.trim()) return;
  try {
    const format = document.getElementById("singleFormat").value;
    const qr = document.createElement("canvas");
    renderQRCode(qr, qrInput.value.trim(), {
      ...readSettings(),
      vector: format === "svg",
    });
    const record = singleRecord();
    const output = createLabeledCanvas(
      qr,
      record.Titel,
      record.Untertitel,
      "",
      "",
      record,
      singleLayout,
    );
    const blob =
      format === "svg"
        ? new Blob([toSVG(output)], { type: "image/svg+xml;charset=utf-8" })
        : await toPNG(output);
    saveAs(
      blob,
      sanitizeFilename(qrTitle.textContent || t("QR-Code")) + "." + format,
    );
  } catch (error) {
    setMessage(qrError, () => t("Export fehlgeschlagen: ") + error.message);
  }
}

[
  qrInput,
  shapeSelect,
  colorPicker,
  finderShapeSelect,
  finderColorPicker,
].forEach((control) =>
  control.addEventListener("input", () => {
    generateQRCode();
    if (control !== qrInput) saveSettings();
  }),
);

downloadBtn.addEventListener("click", downloadQRCode);

const qrStyleDialog = document.getElementById("qrStyleDialog");
const appearanceControls = document.querySelector(".appearance-fields");
const logoControls = document.querySelector(".logo-controls");
const logoAnchor = document.createComment("logo controls");
logoControls.before(logoAnchor);
document.getElementById("modalAppearanceControls").append(appearanceControls);
document.getElementById("labelContainer").hidden = true;
document.getElementById("editQRStyleBtn").addEventListener("click", () => {
  document
    .getElementById("modalAppearanceControls")
    .append(appearanceControls);
  document.getElementById("modalLogoControls").append(logoControls);
  try {
    renderQRCode(
      document.getElementById("styleQR"),
      layoutSample?.URL || qrInput.value.trim() || "https://example.com",
      readSettings(),
    );
  } catch (error) {
    toast(error.message, true);
  }
  qrStyleDialog.showModal();
});
function closeStyleEditor() {
  qrStyleDialog.close();
}
document
  .getElementById("closeQRStyleBtn")
  .addEventListener("click", closeStyleEditor);
document
  .getElementById("applyQRStyleBtn")
  .addEventListener("click", closeStyleEditor);
qrStyleDialog.addEventListener("close", () => {
  logoAnchor.after(logoControls);
  if (layoutSample) {
    try {
      renderQRCode(
        document.getElementById("layoutQR"),
        layoutSample.URL,
        readSettings(),
      );
    } catch (error) {
      toast(error.message, true);
    }
  }
  saveSettings();
});
document
  .getElementById("exportFormat")
  .addEventListener("change", saveSettings);
document
  .getElementById("singleFormat")
  .addEventListener("change", saveSettings);


const templateLibrary = createTemplateLibrary({readSettings, saveLayout, saveSettings, renderSavedLogos, openLayoutEditor, generateQRCode, bulkLayout, singleLayout, getMode: () => editorMode, getSnapshot: () => editorSnapshot, getLayout: () => metricLayout, getLogoData: () => logoState.data, setLogo: (image, data) => { ++logoState.version; logoState.image = image; logoState.data = data; }});
const {confirmDeletion, templateChanged, requestTemplateSave, renderTemplates} = templateLibrary;

document.querySelectorAll("[data-language]").forEach((button) =>
  button.addEventListener("click", () => {
    if (window.QRGenerator.i18n.language === button.dataset.language) return;
    setLanguage(button.dataset.language);
    // Updating in place preserves imported records, user input and all open dialogs.
    translateInterface();
    for (const [node, render] of localizedMessages)
      if (node.isConnected) node.textContent = render();
    for (const [field, select] of Object.entries(mappingFields))
      if (select.options.length)
        select.options[0].textContent =
          field === "URL" ? t("URL-Feld auswählen …") : t("Nicht verwenden");
    renderSavedLogos();
    renderTemplates();
    renderSavedBaseURLs();
    if (layoutDialog.open) openLayoutEditor(editorMode);
    if (ribbonDialog.open) renderRibbonRules();
    generateQRCode();
  }),
);
restoreLayout();
restoreSettings();
renderSavedLogos();
loadQueryParameters();

setImportVisible(false);

window.QRGenerator["app"] = {};
})();
