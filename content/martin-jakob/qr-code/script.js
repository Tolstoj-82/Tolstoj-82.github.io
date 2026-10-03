"use strict";

(() => {
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
const EXPORT_SIZE = 1000;
const canvas = document.getElementById("qrCanvas");
const downloadBtn = document.getElementById("downloadBtn");
const qrTitle = document.getElementById("qrTitle");
const qrSubtitle = document.getElementById("qrSubtitle");
const ctx = canvas.getContext("2d");

let logoImage = null;
let logoLoadVersion = 0;
let activeLogoData = "";
const logoInput = document.getElementById("logoInput");
const logoStatus = document.getElementById("logoStatus");
const removeLogoBtn = document.getElementById("removeLogoBtn");
const logoStorageKey = "qr-generator.logos.v1";
const savedLogos = document.getElementById("savedLogos");
function readSavedLogos() {
    try {
        const items = JSON.parse(localStorage.getItem(logoStorageKey) || "[]");
        return Array.isArray(items) ? items.filter(item => item && typeof item.name === "string" &&
            typeof item.data === "string" && item.data.length < 500000 && /^data:image\/png;base64,/.test(item.data)).slice(0, 12) : [];
    } catch { return []; }
}
function writeSavedLogos(items) {
    try { localStorage.setItem(logoStorageKey, JSON.stringify(items)); return true; }
    catch {
        logoStatus.textContent = "Das Logo kann verwendet werden, aber der lokale Speicher ist voll oder nicht verfügbar.";
        return false;
    }
}
function renderSavedLogos() {
    const items = readSavedLogos();
    savedLogos.replaceChildren();
    savedLogos.hidden = !items.length;
    for (const item of items) {
        const tile = document.createElement("div");
        tile.className = "saved-logo";
        const select = document.createElement("button");
        select.type = "button";
        select.className = "saved-logo-select";
        select.setAttribute("aria-label", "Logo auswählen: " + item.name);
        select.setAttribute("aria-pressed", String(activeLogoData === item.data));
        const thumbnail = document.createElement("img");
        thumbnail.src = item.data;
        thumbnail.alt = item.name;
        select.append(thumbnail);
        select.addEventListener("click", async () => {
            const version = ++logoLoadVersion;
            try {
                const image = new Image();
                image.src = item.data;
                await image.decode();
                if (version !== logoLoadVersion) return;
                if (!image.naturalWidth || image.naturalWidth !== image.naturalHeight || image.naturalWidth > 256) throw new Error("Ungültiges gespeichertes Logo.");
                logoImage = image;
                activeLogoData = item.data;
                removeLogoBtn.hidden = false;
                logoStatus.textContent = "Logo ausgewählt.";
                renderSavedLogos();
                saveSettings();
                generateQRCode();
            } catch { if (version === logoLoadVersion) logoStatus.textContent = "Das gespeicherte Logo konnte nicht geladen werden. Bitte löschen und erneut hochladen."; }
        });
        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "saved-logo-delete";
        remove.textContent = "×";
        remove.setAttribute("aria-label", "Gespeichertes Logo löschen: " + item.name);
        remove.addEventListener("click", () => {
            ++logoLoadVersion;
            if (!writeSavedLogos(readSavedLogos().filter(saved => saved.data !== item.data))) return;
            if (activeLogoData === item.data) {
                logoImage = null;
                activeLogoData = "";
                removeLogoBtn.hidden = true;
                generateQRCode();
            }
            saveSettings();
            logoStatus.textContent = "Gespeichertes Logo gelöscht.";
            renderSavedLogos();
        });
        tile.append(select, remove);
        savedLogos.append(tile);
    }
}
logoInput.addEventListener("change", async () => {
    const file = logoInput.files[0];
    if (!file) return;
    const version = ++logoLoadVersion;
    logoStatus.textContent = "Bild wird geladen …";
    let objectURL;
    try {
        if (!["image/png", "image/jpeg"].includes(file.type)) throw new Error("Bitte ein PNG- oder JPEG-Bild auswählen.");
        if (file.size > 2 * 1024 * 1024) throw new Error("Das Bild darf höchstens 2 MB gross sein.");
        objectURL = URL.createObjectURL(file);
        const image = new Image();
        image.src = objectURL;
        await image.decode();
        if (version !== logoLoadVersion) return;
        if (!image.naturalWidth || image.naturalWidth !== image.naturalHeight) throw new Error("Das Bild muss quadratisch sein.");
        if (image.naturalWidth > 512) throw new Error("Das Bild darf höchstens 512 × 512 Pixel gross sein.");
        const logo = document.createElement("canvas");
        logo.width = logo.height = Math.min(256, image.naturalWidth);
        logo.getContext("2d").drawImage(image, 0, 0, logo.width, logo.height);
        logoImage = logo;
        activeLogoData = logo.toDataURL("image/png");
        removeLogoBtn.hidden = false;
        logoStatus.textContent = "Logo hinzugefügt. Es wird auch im Massenexport verwendet.";
        const saved = readSavedLogos().filter(item => item.data !== activeLogoData);
        if (saved.length >= 12) {
            logoStatus.textContent = "Logo hinzugefügt. Zum Speichern bitte eines der 12 gespeicherten Logos löschen.";
        } else {
            writeSavedLogos([{name: file.name, data: activeLogoData}, ...saved]);
        }
        renderSavedLogos();
        saveSettings();
        generateQRCode();
    } catch (error) {
        if (version === logoLoadVersion) logoStatus.textContent = error.message + (logoImage ? " Das bisherige Bild bleibt erhalten." : "");
    } finally {
        if (objectURL) URL.revokeObjectURL(objectURL);
        if (version === logoLoadVersion) logoInput.value = "";
    }
});
removeLogoBtn.addEventListener("click", () => {
    ++logoLoadVersion;
    logoImage = null;
    activeLogoData = "";
    renderSavedLogos();
    logoInput.value = "";
    removeLogoBtn.hidden = true;
    logoStatus.textContent = "";
    saveSettings();
    generateQRCode();
});

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
}

toggleImportBtn.addEventListener("click", () => setImportVisible(bulkImport.hidden));


dropZone.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        fileInput.click();
    }
});

dropZone.addEventListener("click", () => {
    fileInput.click();
});

fileInput.addEventListener("change", e => {

    if(e.target.files.length){
  loadFile(e.target.files[0]);
    }

});

dropZone.addEventListener("dragover", e => {
    e.preventDefault();
    dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", e => {

    e.preventDefault();
    dropZone.classList.remove("dragover");

    const file = e.dataTransfer.files[0];

    if(file){
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
        const values = JSON.parse(localStorage.getItem(baseURLStorageKey) || "[]");
        return Array.isArray(values) ? [...new Set(values.filter(isWebURL))] : [];
    } catch { return []; }
}

function writeSavedBaseURLs(values) {
    try {
        localStorage.setItem(baseURLStorageKey, JSON.stringify(values));
        baseURLStorageStatus.textContent = "";
        return true;
    } catch {
        baseURLStorageStatus.textContent = "Die gespeicherten Basis-URLs konnten nicht aktualisiert werden. Der Import ist trotzdem möglich.";
        return false;
    }
}

const baseURLCombo = document.getElementById("baseURLCombo");
function closeSavedBaseURLs() {
    savedBaseURLs.hidden = true;
    manualBaseURL.setAttribute("aria-expanded", "false");
    document.getElementById("baseURLDropdownBtn").setAttribute("aria-expanded", "false");
    baseURLCombo.classList.remove("is-open");
}
manualBaseURL.addEventListener("click", () => renderSavedBaseURLs(true));
document.getElementById("baseURLDropdownBtn").addEventListener("click", () => {
    if (savedBaseURLs.hidden) renderSavedBaseURLs(true);
    else closeSavedBaseURLs();
    manualBaseURL.focus();
});
manualBaseURL.addEventListener("keydown", event => {
    if (event.key === "ArrowDown") {
        event.preventDefault();
        renderSavedBaseURLs(true);
        savedBaseURLs.querySelector("button")?.focus();
    }
});
baseURLCombo.addEventListener("keydown", event => {
    if (event.key === "Escape" && !savedBaseURLs.hidden) {
        event.preventDefault();
        event.stopPropagation();
        closeSavedBaseURLs();
        manualBaseURL.focus();
    }
});
document.addEventListener("pointerdown", event => {
    if (!baseURLCombo.contains(event.target)) closeSavedBaseURLs();
});
baseURLCombo.addEventListener("focusout", event => {
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
    document.getElementById("baseURLDropdownBtn").setAttribute("aria-expanded", String(expanded));
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
        remove.setAttribute("aria-label", "Gespeicherte Basis-URL löschen: " + url);
        remove.title = "Basis-URL löschen";
        remove.addEventListener("click", () => {
            if (writeSavedBaseURLs(readSavedBaseURLs().filter(value => value !== url))) {
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
    const others = readSavedBaseURLs().filter(saved => saved.replace(/\/+$/, "") !== url.replace(/\/+$/, ""));
    writeSavedBaseURLs([url, ...others]);
}
const mappingFields = Object.fromEntries(["Titel", "Untertitel", "URL", "Base_URL", "Interne_ID"].map(key => [key, document.getElementById("map" + key)]));
let pendingImport = null;
let urlMode = "full";
function setURLMode(mode) {
    urlMode = mode;
    closeSavedBaseURLs();
    for (const [name, radioId, groupId, input] of [
        ["full", "urlModeFull", "fullURLGroup", mappingFields.URL],
        ["base", "urlModeBase", "baseURLGroup", mappingFields.Base_URL],
        ["manual", "urlModeManual", "manualBaseURLGroup", manualBaseURL]
    ]) {
        const active = name === mode;
        document.getElementById(radioId).checked = active;
        document.getElementById(groupId).hidden = !active;
        input.disabled = !active;
        input.required = active;
    }
    mappingFields.Interne_ID.required = mode !== "full";
    mappingError.textContent = "";
    updateMappingSubmit();
}
for (const [id, mode] of [["urlModeFull", "full"], ["urlModeBase", "base"], ["urlModeManual", "manual"]]) {
    document.getElementById(id).addEventListener("change", () => setURLMode(mode));
}

function isRecord(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

function extractRecords(data) {
    if (isRecord(data)) {
        const lists = Object.values(data).filter(Array.isArray);
        if (lists.length !== 1) throw new Error("Erwartet wird eine Liste von Einträgen oder ein Objekt mit genau einer solchen Liste.");
        data = lists[0];
    }
    if (!Array.isArray(data) || !data.length || !data.every(isRecord)) {
        throw new Error("Die Datei muss eine nicht leere Liste von Objekten enthalten.");
    }
    if (data.some(row => !Object.keys(row).length)) throw new Error("Die Liste enthält leere Einträge.");
    return data;
}

function isWebURL(value) {
    if (typeof value !== "string" || !/^https?:\/\//i.test(value.trim()) || /\s/.test(value.trim())) return false;
    try {
        const url = new URL(value.trim());
        return Boolean(url.hostname);
    } catch { return false; }
}

function normalizeRecords(records, mapping, enteredBaseURL = "") {
    if (!mapping.URL && !mapping.Base_URL && !enteredBaseURL.trim()) throw new Error("Bitte wählen Sie ein URL-Feld aus oder geben Sie eine Basis-URL ein und wählen Sie das ID-Feld.");
    return records.map((row, index) => {
        const fullURL = mapping.URL ? row[mapping.URL] : null;
        let url = fullURL;
        if (fullURL == null || (typeof fullURL === "string" && !fullURL.trim())) {
            const mappedBase = mapping.Base_URL ? row[mapping.Base_URL] : null;
            const base = mappedBase == null || (typeof mappedBase === "string" && !mappedBase.trim())
                ? enteredBaseURL.trim() : mappedBase;
            const id = mapping.Interne_ID ? row[mapping.Interne_ID] : null;
            if (!isWebURL(base) || !["string", "number"].includes(typeof id) ||
                (typeof id === "number" && !Number.isFinite(id)) || !String(id).trim()) {
                throw new Error("Eintrag " + (index + 1) + ": Eine vollständige URL oder eine gültige Basis-URL mit ID ist erforderlich.");
            }
            const parsedBase = new URL(base.trim());
            if (parsedBase.search || parsedBase.hash) throw new Error("Eintrag " + (index + 1) + ": Die Basis-URL darf keine Abfrageparameter oder Sprungmarke enthalten.");
            const encodedId = encodeURIComponent(String(id).trim());
            if (encodedId === "." || encodedId === "..") throw new Error("Eintrag " + (index + 1) + ": Ungültige ID.");
            url = base.trim().replace(/\/+$/, "") + "/" + encodedId;
        }
        if (!isWebURL(url)) throw new Error("Eintrag " + (index + 1) + ": Das gewählte URL-Feld muss eine vollständige HTTP- oder HTTPS-Adresse enthalten.");
        const result = {URL: url.trim()};
        for (const field of ["Titel", "Untertitel", "Interne_ID"]) {
            const value = mapping[field] ? row[mapping[field]] : null;
            if (value != null && typeof value !== "string" && !(typeof value === "number" && Number.isFinite(value))) {
                throw new Error("Eintrag " + (index + 1) + ": Das Feld für " + field + " muss Text oder eine Zahl enthalten. Sie können es auch weglassen.");
            }
            result[field] = value == null ? "" : String(value).trim();
        }
        result.Linien = formatLines(row.Linien);
        return result;
    });
}

function acceptImport(records, filename) {
    loadedData = records;
    info.textContent = "Dateiname: " + filename + "\nAnzahl der Einträge: " + records.length;
    generateBtn.disabled = false;
    statusDiv.textContent = "";
    pendingImport = null;
    mappingDialog.close();
}

function selectedMapping() {
    const mapping = Object.fromEntries(Object.entries(mappingFields).map(([field, select]) => [field, select.value]));
    if (urlMode !== "full") mapping.URL = "";
    if (urlMode !== "base") mapping.Base_URL = "";
    return mapping;
}

function updateMappingSubmit() {
    mappingSubmitBtn.disabled = !pendingImport;
    if (!pendingImport) return;
    try {
        normalizeRecords(pendingImport.records, selectedMapping(), urlMode === "manual" ? manualBaseURL.value : "");
        mappingSubmitBtn.disabled = false;
    } catch { mappingSubmitBtn.disabled = true; }
}
mappingForm.addEventListener("input", updateMappingSubmit);
mappingForm.addEventListener("change", updateMappingSubmit);

function cancelMapping() {
    pendingImport = null;
    mappingDialog.close();
    statusDiv.textContent = "Import abgebrochen. Bitte wählen Sie eine JSON-Datei aus.";
}
document.getElementById("cancelMappingBtn").addEventListener("click", cancelMapping);
mappingDialog.addEventListener("cancel", event => { event.preventDefault(); cancelMapping(); });
mappingForm.addEventListener("submit", event => {
    event.preventDefault();
    if (!pendingImport) return;
    try {
        const records = normalizeRecords(pendingImport.records, selectedMapping(), urlMode === "manual" ? manualBaseURL.value : "");
        if (urlMode === "manual") saveBaseURL(manualBaseURL.value);
        acceptImport(records, pendingImport.filename);
        generateZip();
    } catch (error) { mappingError.textContent = error.message; }
});

function showMapping(records, filename, keys, mapping, reason) {
    pendingImport = {records, filename};
    manualBaseURL.value = "";
    baseURLStorageStatus.textContent = "";
    renderSavedBaseURLs();
    for (const [field, select] of Object.entries(mappingFields)) {
        select.replaceChildren();
        const empty = document.createElement("option");
        empty.value = "";
        empty.textContent = field === "URL" ? "URL-Feld auswählen …" : "Nicht verwenden";
        select.append(empty);
        for (const key of keys) {
            const option = document.createElement("option");
            option.value = key;
            const example = records.find(row => row[key] != null && row[key] !== "")?.[key];
            option.textContent = key + (example == null ? "" : " — " + String(example).slice(0, 70));
            select.append(option);
        }
        select.value = mapping[field] || "";
    }
    const simple = !mapping.URL && !mapping.Base_URL &&
        ["Titel", "Untertitel", "Interne_ID"].every(field => mapping[field]) &&
        records.every(row => ["Titel", "Untertitel", "Interne_ID"].every(field =>
            row[mapping[field]] == null ? field !== "Interne_ID" :
            ["string", "number"].includes(typeof row[mapping[field]]) &&
            (field !== "Interne_ID" || String(row[mapping[field]]).trim() !== "")));
    document.getElementById("urlModeChoices").hidden = simple;
    document.getElementById("recordMappingFields").hidden = simple;
    document.getElementById("mappingHeading").textContent = simple ? "Basis-URL ergänzen" : "JSON-Felder zuordnen";
    document.getElementById("mappingHelp").textContent = simple
        ? "Titel, Untertitel und interne ID wurden erkannt. Bitte ergänzen Sie nur die Basis-URL."
        : "Wählen Sie genau eine der drei Möglichkeiten für die URL. Titel und Untertitel sind optional.";
    setURLMode(mapping.URL ? "full" : mapping.Base_URL ? "base" : "manual");
    mappingError.textContent = simple ? "" : reason;
    statusDiv.textContent = "Bitte ordnen Sie die JSON-Felder zu.";
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
    info.textContent = "";
    statusDiv.textContent = "JSON-Datei wird geladen …";
    try {
        const data = JSON.parse((await file.text()).replace(/^\uFEFF/, ""));
        if (version !== fileLoadVersion) return;
        const records = extractRecords(data);
        const keys = [...new Set(records.flatMap(Object.keys))].filter(key => records.some(row => typeof row[key] === "string" || typeof row[key] === "number"));
        if (!keys.length) throw new Error("Es wurden keine verwendbaren Text- oder Zahlenfelder gefunden.");
        const mapping = Object.fromEntries(Object.keys(mappingFields).map(key => [key, keys.includes(key) ? key : ""]));
        const recognized = new Set(["Titel", "Untertitel", "URL", "Base_URL", "Interne_ID", "Hst_SLOID", "Hst_DiDok", "Kt_SLOID", "Interner_Bezeichner", "Linien"]);
        let reason = "";
        let normalized;
        try { normalized = normalizeRecords(records, mapping); } catch (error) { reason = error.message; }
        if (normalized && keys.every(key => recognized.has(key))) {
            acceptImport(normalized, file.name);
        } else {
            if (!mapping.URL && !mapping.Base_URL) {
                const candidates = keys.filter(key => records.every(row => isWebURL(row[key])));
                if (candidates.length === 1) mapping.URL = candidates[0];
                if (!candidates.length) reason = "Es wurde kein Feld mit gültigen URLs gefunden. Geben Sie unten eine Basis-URL ein und wählen Sie das passende ID-Feld. Alternativ können Sie vorhandene URL-Felder zuordnen.";
            }
            showMapping(records, file.name, keys, mapping, reason);
        }
    } catch (error) {
        if (version !== fileLoadVersion) return;
        statusDiv.textContent = "Ungültige JSON-Datei: " + error.message;
    } finally {
        if (version === fileLoadVersion) fileInput.value = "";
    }
}

function sanitizeFilename(text) {
    return String(text || "QR")
        .normalize("NFC")
        .replace(/,/g, "")
        .replace(/[<>:"/\\|?*\x00-\x1f]/g, "_")
        .trim()
        .replace(/\s+/g, "_")
        .slice(0, 120)
        .replace(/[. ]+$/g, "") || "QR";
}

const settingsStorageKey = "qr-generator.settings.v1";
function saveSettings() {
    try {
        const {logo, ...appearance} = readSettings();
        localStorage.setItem(settingsStorageKey, JSON.stringify({
            ...appearance, preview: showBulkPreview.checked, logoData: activeLogoData
        }));
    } catch { /* Preferences are optional when browser storage is unavailable. */ }
}
function restoreSettings() {
    let saved;
    try { saved = JSON.parse(localStorage.getItem(settingsStorageKey) || "null"); }
    catch { return; }
    if (!saved || typeof saved !== "object") return;
    for (const [key, control] of [["shape", shapeSelect], ["finderShape", finderShapeSelect]]) {
        if (Array.from(control.options).some(option => option.value === saved[key])) control.value = saved[key];
    }
    for (const [key, control] of [["color", colorPicker], ["finderColor", finderColorPicker]]) {
        if (typeof saved[key] === "string" && /^#[0-9a-f]{6}$/i.test(saved[key])) control.value = saved[key];
    }
    if (typeof saved.preview === "boolean") showBulkPreview.checked = saved.preview;
    const storedLogo = readSavedLogos().find(item => item.data === saved.logoData);
    if (storedLogo) {
        const version = ++logoLoadVersion;
        const image = new Image();
        image.src = storedLogo.data;
        image.decode().then(() => {
            if (version !== logoLoadVersion || !image.naturalWidth || image.naturalWidth !== image.naturalHeight || image.naturalWidth > 256) return;
            logoImage = image;
            activeLogoData = storedLogo.data;
            removeLogoBtn.hidden = false;
            renderSavedLogos();
            generateQRCode();
        }).catch(() => {});
    }
}

function readSettings() {
    return {
        shape: shapeSelect.value, finderShape: finderShapeSelect.value,
        color: colorPicker.value, finderColor: finderColorPicker.value,
        logo: logoImage,
        size: EXPORT_SIZE
    };
}

function renderQRCode(canvas, inputText, settings) {
    const verifiedLogo = drawQRCode(canvas, inputText, {...settings, size: EXPORT_SIZE});
    if (settings.logo && !verifiedLogo) {
        // The logo renderer restores the original, styled QR code on failure.
        return "Das Logo wurde für diesen Code weggelassen. Die gewählten Formen und Farben bleiben erhalten. Bitte den Code vor Verwendung scannen.";
    }
    return "";
}

function drawQRCode(canvas, inputText, settings) {
    const ctx = canvas.getContext("2d");
    const qr = qrcode(0, "H");
    qr.addData(inputText);
    qr.make();

    const modules = qr.getModuleCount();
    const shape = settings.shape;
    const finderShape = settings.finderShape;
    const color = settings.color;
    const finderColor = settings.finderColor;
    const size = settings.size;

    canvas.width = size;
    canvas.height = size;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const moduleSize = (Math.floor((size * 0.8) / modules) || size / (modules + 8));
    const actualQRSize = moduleSize * modules;
    const padding = Math.floor((canvas.width - actualQRSize) / 2);

    function drawFinderPattern(style, column, row) {
      const x = padding + column * moduleSize;
      const y = padding + row * moduleSize;
      const centerX = padding + (column + 3.5) * moduleSize;
      const centerY = padding + (row + 3.5) * moduleSize;

      ctx.fillStyle = finderColor;
      if (style === "rounded-square") {
        roundedRectPath(ctx, x, y, moduleSize * 7, moduleSize * 7, moduleSize * 1.25);
        ctx.fill();
        ctx.fillStyle = "white";
        roundedRectPath(ctx, x + moduleSize, y + moduleSize, moduleSize * 5, moduleSize * 5, moduleSize * 0.8);
        ctx.fill();
        ctx.fillStyle = finderColor;
        roundedRectPath(ctx, x + moduleSize * 2, y + moduleSize * 2, moduleSize * 3, moduleSize * 3, moduleSize * 0.5);
        ctx.fill();
      } else if (style === "diamond") {
        diamondPath(ctx, centerX, centerY, moduleSize * 3.5);
        ctx.fill();
        ctx.fillStyle = "white";
        diamondPath(ctx, centerX, centerY, moduleSize * 2.5);
        ctx.fill();
        ctx.fillStyle = finderColor;
        diamondPath(ctx, centerX, centerY, moduleSize * 1.5);
        ctx.fill();
      } else if (style === "square-circle") {
        ctx.fillRect(x, y, moduleSize * 7, moduleSize * 7);
        ctx.fillStyle = "white";
        ctx.fillRect(x + moduleSize, y + moduleSize, moduleSize * 5, moduleSize * 5);
        ctx.fillStyle = finderColor;
        ctx.beginPath();
        ctx.arc(centerX, centerY, moduleSize * 1.5, 0, Math.PI * 2);
        ctx.fill();
      } else if (style === "circle-square") {
        ctx.beginPath();
        ctx.arc(centerX, centerY, moduleSize * 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.fillRect(x + moduleSize, y + moduleSize, moduleSize * 5, moduleSize * 5);
        ctx.fillStyle = finderColor;
        ctx.fillRect(x + moduleSize * 2, y + moduleSize * 2, moduleSize * 3, moduleSize * 3);
      } else {
        ctx.beginPath();
        ctx.arc(centerX, centerY, moduleSize * 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(centerX, centerY, moduleSize * 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = finderColor;

        if (style === "ring") {
          ctx.fillRect(
            centerX - moduleSize * 1.5,
            centerY - moduleSize * 1.5,
            moduleSize * 3,
            moduleSize * 3
          );
        } else {
          ctx.beginPath();
          ctx.arc(centerX, centerY, moduleSize * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    const customFinderStyles = new Set([
      "circular",
      "rounded-square",
      "diamond",
      "ring",
      "square-circle",
      "circle-square"
    ]);

    for (let row = 0; row < modules; row++) {
      for (let col = 0; col < modules; col++) {
        if (!qr.isDark(row, col)) continue;

        const x = padding + col * moduleSize;
        const y = padding + row * moduleSize;
        const isFinderPattern =
          (row < 7 && col < 7) ||
          (row < 7 && col > modules - 8) ||
          (row > modules - 8 && col < 7);

        if (isFinderPattern && customFinderStyles.has(finderShape)) continue;

        const drawShape = isFinderPattern ? finderShape : shape;
        ctx.fillStyle = isFinderPattern ? finderColor : color;

        drawModule(ctx, drawShape, x, y, moduleSize);
      }
    }

    if (customFinderStyles.has(finderShape)) {
      drawFinderPattern(finderShape, 0, 0);
      drawFinderPattern(finderShape, modules - 7, 0);
      drawFinderPattern(finderShape, 0, modules - 7);
    }

    if (settings.logo) {
        return drawVerifiedLogo(canvas, ctx, settings.logo, inputText, modules, moduleSize, padding);
    }


}

// Reuse verification buffers and a successful footprint as a starting point.
// Payloads differ, so every logo-bearing code still needs its own check.
const logoFootprints = new WeakMap();
let verificationCanvas;
let logoBackupCanvas;
function drawVerifiedLogo(canvas, context, logo, inputText, modules, moduleSize, padding) {
    if (typeof jsQR !== "function") throw new Error("Die QR-Leseprüfung ist nicht verfügbar. Bitte die Seite neu laden oder das Logo entfernen.");
    if (!Number.isInteger(moduleSize)) return false;
    if (!verificationCanvas) verificationCanvas = document.createElement("canvas");
    if (!logoBackupCanvas) logoBackupCanvas = document.createElement("canvas");
    let maxModules = Math.floor(modules * 0.27);
    if (maxModules % 2 === 0) maxModules--;
    const odd = value => { const n = Math.max(5, Math.floor(value)); return n % 2 ? n : n - 1; };
    const footprintCache = logoFootprints.get(logo) || new Map();
    logoFootprints.set(logo, footprintCache);
    const cached = footprintCache.get(modules);
    const candidates = [...new Set([cached || maxModules, odd(modules * 0.18), 5])]
        .filter(value => value >= 5 && value <= maxModules).sort((a, b) => b - a);
    const backupEdge = maxModules * moduleSize;
    const backupStart = padding + (modules - maxModules) / 2 * moduleSize;
    logoBackupCanvas.width = logoBackupCanvas.height = backupEdge;
    logoBackupCanvas.getContext("2d").drawImage(canvas, backupStart, backupStart, backupEdge, backupEdge, 0, 0, backupEdge, backupEdge);
    const restore = () => context.drawImage(logoBackupCanvas, backupStart, backupStart);
    // Four pixels per module keeps decoding work proportional to QR complexity,
    // rather than scanning the full 1000 px export for every attempt.
    const testModule = Math.min(moduleSize, 4);
    verificationCanvas.width = verificationCanvas.height = (modules + 8) * testModule;
    const testContext = verificationCanvas.getContext("2d", {willReadFrequently: true});
    for (const covered of candidates) {
        restore();
        const x = padding + (modules - covered) / 2 * moduleSize;
        const edge = covered * moduleSize;
        context.fillStyle = "white";
        context.fillRect(x, x, edge, edge);
        context.drawImage(logo, x + moduleSize, x + moduleSize, edge - 2 * moduleSize, edge - 2 * moduleSize);
        testContext.fillStyle = "white";
        testContext.fillRect(0, 0, verificationCanvas.width, verificationCanvas.height);
        testContext.imageSmoothingEnabled = true;
        testContext.drawImage(canvas, padding, padding, modules * moduleSize, modules * moduleSize,
            4 * testModule, 4 * testModule, modules * testModule, modules * testModule);
        const pixels = testContext.getImageData(0, 0, verificationCanvas.width, verificationCanvas.height);
        const decoded = jsQR(pixels.data, pixels.width, pixels.height, {inversionAttempts: "dontInvert"});
        if (decoded && decoded.data === inputText) {
            footprintCache.set(modules, covered);
            return true;
        }
    }
    restore();
    return false;
}

// Wrap at word boundaries, splitting long words when necessary.
function wrapText(context, text, maxWidth) {
    const lines = [];
    for (const paragraph of text.split(/\r?\n/)) {
        let line = "";
        for (const word of paragraph.trim().split(/\s+/)) {
            const candidate = line ? line + " " + word : word;
            if (context.measureText(candidate).width <= maxWidth) {
                line = candidate;
                continue;
            }
            if (line) lines.push(line);
            line = "";
            for (const character of word) {
                if (line && context.measureText(line + character).width > maxWidth) {
                    lines.push(line);
                    line = "";
                }
                line += character;
            }
        }
        lines.push(line);
    }
    return lines;
}

function formatLines(value) {
    const values = Array.isArray(value) ? value : [value];
    const lines = values.flatMap(item => {
        if (typeof item !== "string" && typeof item !== "number") return [];
        return String(item).split(/[,;\s]+/).filter(Boolean).map(line =>
            /^\d+$/.test(line) ? line.replace(/^0+(?=\d)/, "") : line
        );
    });
    return [...new Set(lines)].sort((a, b) =>
        a.localeCompare(b, "de", {numeric: true})
    ).join(", ");
}

function createLabeledCanvas(qrCanvas, title, subtitle, internalId = "", lines = "") {
    const output = document.createElement("canvas");
    const context = output.getContext("2d");
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
        [subtitle, `${subtitleSize}px Arial`, Math.ceil(subtitleSize * 1.4), "#666"]
    ]) {
        if (!text.trim()) continue;
        context.font = font;
        blocks.push({font, lineHeight, color, lines: wrapText(context, text, maxWidth)});
    }
    const headerHeight = blocks.length
        ? margin * 2 + blocks.reduce((height, block) => height + block.lines.length * block.lineHeight, 0)
        : 0;
    const idText = String(internalId ?? "").trim();
    context.font = `${idSize}px Arial`;
    const idLines = idText ? wrapText(context, idText, maxWidth) : [];
    const lineText = formatLines(lines);
    const footerLines = [...idLines, ...(lineText ? wrapText(context, "Linien: " + lineText, maxWidth) : [])];
    const footerHeight = footerLines.length ? margin * 2 + footerLines.length * idLineHeight : 0;
    output.width = qrCanvas.width;
    output.height = qrCanvas.height + headerHeight + footerHeight;
    // Browsers impose canvas size limits; fail clearly instead of exporting clipped text.
    if (output.height > 16384) throw new Error("Die Beschriftung ist zu lang. Bitte kürzen Sie den Text.");
    context.fillStyle = "white";
    context.fillRect(0, 0, output.width, output.height);
    context.textAlign = "center";
    context.textBaseline = "middle";
    let y = margin;
    for (const block of blocks) {
        context.font = block.font;
        context.fillStyle = block.color;
        for (const line of block.lines) {
            context.fillText(line, output.width / 2, y + block.lineHeight / 2, maxWidth);
            y += block.lineHeight;
        }
    }
    context.drawImage(qrCanvas, 0, headerHeight);
    context.font = `${idSize}px Arial`;
    context.fillStyle = "#666";
    y = headerHeight + qrCanvas.height + margin;
    for (const line of footerLines) {
        context.fillText(line, output.width / 2, y + idLineHeight / 2, maxWidth);
        y += idLineHeight;
    }
    return output;
}

function toPNG(source) {
    return new Promise((resolve, reject) => source.toBlob(blob => {
        if (blob) resolve(blob);
        else reject(new Error("Die PNG-Datei konnte nicht erstellt werden."));
    }, "image/png"));
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
document.getElementById("closePreviewBtn").addEventListener("click", dismissPreview);
bulkPreview.addEventListener("cancel", event => {
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
    statusDiv.textContent = "Export wird abgebrochen …";
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
    const settings = readSettings();
    try {
        let adjustedCount = 0;
        const filenames = new Set();
        const zip = new JSZip();
        const qrCanvas = document.createElement("canvas");
        for (let i = 0; i < entries.length; i++) {
            checkExportCancelled();
            const entry = entries[i];
            statusDiv.textContent = "QR-Code " + (i + 1) + " von " + entries.length + " wird erstellt …";
            const adjustment = renderQRCode(qrCanvas, entry.URL, settings);
            if (adjustment) adjustedCount++;
            const output = createLabeledCanvas(qrCanvas, entry.Titel, entry.Untertitel, entry.Interne_ID, entry.Linien);
            if (showBulkPreview.checked) {
                bulkCanvas.width = output.width;
                bulkCanvas.height = output.height;
                bulkCanvas.getContext("2d").drawImage(output, 0, 0);
                previewStatus.textContent = statusDiv.textContent + (adjustment ? " " + adjustment : "");
                if (!bulkPreview.open) bulkPreview.showModal();
                // Yield for painting/cancellation without adding a delay per image.
                await new Promise(resolve => setTimeout(resolve, 0));
            } else {
                // Allow cancellation and other UI events between images.
                await new Promise(resolve => setTimeout(resolve, 0));
            }
            checkExportCancelled();
            const image = await toPNG(output);
            checkExportCancelled();
            const baseName = sanitizeFilename(entry.Titel || entry.Interne_ID);
            let fileName = baseName + ".png";
            let suffix = 2;
            while (filenames.has(fileName.toLowerCase())) fileName = baseName + "_" + suffix++ + ".png";
            filenames.add(fileName.toLowerCase());
            zip.file(fileName, image);
        }
        statusDiv.textContent = "ZIP-Datei wird erstellt …";
        previewStatus.textContent = statusDiv.textContent;
        checkExportCancelled();
        const zipBlob = await zip.generateAsync({type: "blob"}, checkExportCancelled);
        checkExportCancelled();
        saveAs(zipBlob, "QR-Codes.zip");
        loadedData = null;
        fileInput.value = "";
        info.textContent = "";
        bulkPreview.close();
        bulkCanvas.width = bulkCanvas.height = 0;
        statusDiv.textContent = entries.length + " QR-Codes wurden erstellt. " +
            (adjustedCount ? adjustedCount + " Codes wurden ohne Logo exportiert; Formen und Farben wurden beibehalten. " : "") +
            "Die importierten Daten wurden entfernt.";
    } catch (error) {
        if (error === exportCancelled) {
            statusDiv.textContent = "Export abgebrochen. Die importierten Daten bleiben für einen erneuten Export erhalten.";
        } else {
            console.error(error);
            statusDiv.textContent = "Export fehlgeschlagen: " + error.message;
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

function roundedRectPath(context, x, y, width, height, radius) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.lineTo(x + width - safeRadius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
  context.lineTo(x + width, y + height - safeRadius);
  context.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
  context.lineTo(x + safeRadius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
  context.lineTo(x, y + safeRadius);
  context.quadraticCurveTo(x, y, x + safeRadius, y);
  context.closePath();
}

function diamondPath(context, centerX, centerY, radius) {
  context.beginPath();
  context.moveTo(centerX, centerY - radius);
  context.lineTo(centerX + radius, centerY);
  context.lineTo(centerX, centerY + radius);
  context.lineTo(centerX - radius, centerY);
  context.closePath();
}

function drawModule(ctx, shape, x, y, size) {
  const centerX = x + size / 2;
  const centerY = y + size / 2;

  switch (shape) {
    case "circle":
      ctx.beginPath();
      ctx.arc(centerX, centerY, size / 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "rounded":
      roundedRectPath(ctx, x, y, size, size, size * 0.3);
      ctx.fill();
      break;
    case "diamond":
      diamondPath(ctx, centerX, centerY, size / 2);
      ctx.fill();
      break;
    case "horizontal":
      roundedRectPath(ctx, x, y + size * 0.15, size, size * 0.7, size * 0.35);
      ctx.fill();
      break;
    case "vertical":
      roundedRectPath(ctx, x + size * 0.15, y, size * 0.7, size, size * 0.35);
      ctx.fill();
      break;
    case "dot":
      ctx.beginPath();
      ctx.arc(centerX, centerY, size * 0.35, 0, Math.PI * 2);
      ctx.fill();
      break;
    default:
      ctx.fillRect(x, y, size, size);
  }
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
  qrError.textContent = "";
  document.getElementById("renderNotice").textContent = "";
  const isExample = !qrInput.value.trim();
  canvas.classList.toggle("is-example", isExample);
  canvas.setAttribute("aria-label", isExample ? "Beispiel-QR-Code ohne eigene Daten" : "Erstellter QR-Code");
  document.getElementById("exampleHint").hidden = !isExample;
  const inputText = qrInput.value.trim() || (isExample ? "https://example.com" : "");

  if (inputText === "") {
    clearQRCode();
    return;
  }

  if (typeof qrcode !== "function") {
    downloadBtn.hidden = true;
    clearQRCode();
    qrError.textContent = "Die QR-Code-Bibliothek konnte nicht geladen werden. Bitte die Seite neu laden.";
    return;
  }

  try {
    // Verify off-screen; failed logo checks must not erase the visible preview.
    const nextCanvas = document.createElement("canvas");
    const adjustment = renderQRCode(nextCanvas, inputText, readSettings());
    document.getElementById("renderNotice").textContent = adjustment;
    canvas.width = nextCanvas.width;
    canvas.height = nextCanvas.height;
    ctx.drawImage(nextCanvas, 0, 0);
    downloadBtn.hidden = isExample;
  } catch (error) {
    downloadBtn.hidden = true;
    qrError.textContent = (error instanceof Error ? error.message : "Der Text konnte nicht als QR-Code erstellt werden. Bitte kürzen Sie die Eingabe.") + " Die letzte erfolgreiche Vorschau bleibt erhalten.";
    console.error(error);
  }
}

async function downloadQRCode() {
    if (downloadBtn.hidden || !qrInput.value.trim()) return;
    try {
        const output = createLabeledCanvas(canvas, qrTitle.textContent, qrSubtitle.textContent);
        const blob = await toPNG(output);
        saveAs(blob, sanitizeFilename(qrTitle.textContent || "QR-Code") + ".png");
    } catch (error) {
        qrError.textContent = "Export fehlgeschlagen: " + error.message;
    }
}

[
  qrInput,
  shapeSelect,
  colorPicker,
  finderShapeSelect,
  finderColorPicker
].forEach((control) => control.addEventListener("input", () => {
    generateQRCode();
    if (control !== qrInput) saveSettings();
}));

downloadBtn.addEventListener("click", downloadQRCode);

restoreSettings();
renderSavedLogos();
loadQueryParameters();

setImportVisible(new URLSearchParams(window.location.search).size > 0);
})();
