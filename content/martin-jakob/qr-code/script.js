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
const sizeSlider = document.getElementById("sizeSlider");
const canvas = document.getElementById("qrCanvas");
const downloadBtn = document.getElementById("downloadBtn");
const qrTitle = document.getElementById("qrTitle");
const qrSubtitle = document.getElementById("qrSubtitle");
const ctx = canvas.getContext("2d");

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
    baseURLCombo.classList.remove("is-open");
}
manualBaseURL.addEventListener("click", () => renderSavedBaseURLs(true));
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
    savedBaseURLs.replaceChildren();
    const expanded = open && values.length > 0;
    savedBaseURLs.hidden = !expanded;
    manualBaseURL.setAttribute("aria-expanded", String(expanded));
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

function readSettings() {
    return {
        shape: shapeSelect.value, finderShape: finderShapeSelect.value,
        color: colorPicker.value, finderColor: finderColorPicker.value,
        size: Number.parseInt(sizeSlider.value, 10)
    };
}

function renderQRCode(canvas, inputText, settings) {
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

function createLabeledCanvas(qrCanvas, title, subtitle, internalId = "") {
    const output = document.createElement("canvas");
    const context = output.getContext("2d");
    const margin = Math.max(12, Math.round(qrCanvas.width * 0.05));
    const maxWidth = qrCanvas.width - margin * 2;
    const blocks = [];
    for (const [text, font, lineHeight, color] of [
        [title, "bold 28px Arial", 36, "#222"],
        [subtitle, "18px Arial", 26, "#666"]
    ]) {
        if (!text.trim()) continue;
        context.font = font;
        blocks.push({font, lineHeight, color, lines: wrapText(context, text, maxWidth)});
    }
    const headerHeight = blocks.length
        ? margin * 2 + blocks.reduce((height, block) => height + block.lines.length * block.lineHeight, 0)
        : 0;
    const idText = String(internalId ?? "").trim();
    context.font = "14px Arial";
    const idLines = idText ? wrapText(context, idText, maxWidth) : [];
    const footerHeight = idLines.length ? margin * 2 + idLines.length * 20 : 0;
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
    context.font = "14px Arial";
    context.fillStyle = "#666";
    y = headerHeight + qrCanvas.height + margin;
    for (const line of idLines) {
        context.fillText(line, output.width / 2, y + 10, maxWidth);
        y += 20;
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
    bulkPreview.close();
}
document.getElementById("closePreviewBtn").addEventListener("click", dismissPreview);
bulkPreview.addEventListener("cancel", event => {
    event.preventDefault();
    dismissPreview();
});
showBulkPreview.addEventListener("change", () => {
    if (!showBulkPreview.checked) bulkPreview.close();
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
        const filenames = new Set();
        const zip = new JSZip();
        const qrCanvas = document.createElement("canvas");
        for (let i = 0; i < entries.length; i++) {
            checkExportCancelled();
            const entry = entries[i];
            statusDiv.textContent = "QR-Code " + (i + 1) + " von " + entries.length + " wird erstellt …";
            renderQRCode(qrCanvas, entry.URL, settings);
            const output = createLabeledCanvas(qrCanvas, entry.Titel, entry.Untertitel, entry.Interne_ID);
            if (showBulkPreview.checked) {
                bulkCanvas.width = output.width;
                bulkCanvas.height = output.height;
                bulkCanvas.getContext("2d").drawImage(output, 0, 0);
                previewStatus.textContent = statusDiv.textContent;
                if (!bulkPreview.open) bulkPreview.showModal();
                // Give the browser time to paint and keep the preview readable.
                await new Promise(resolve => setTimeout(resolve, 80));
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
        statusDiv.textContent = entries.length + " QR-Codes wurden erstellt. Die importierten Daten wurden entfernt.";
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
  canvas.width = Number.parseInt(sizeSlider.value, 10);
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
  const isExample = !qrInput.value.trim() && !bulkImport.hidden;
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
    renderQRCode(canvas, inputText, readSettings());
    downloadBtn.hidden = isExample;
  } catch (error) {
    clearQRCode();
    qrError.textContent = "Der Text konnte nicht als QR-Code erstellt werden. Bitte kürzen Sie die Eingabe.";
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
  finderColorPicker,
  sizeSlider
].forEach((control) => control.addEventListener("input", generateQRCode));

downloadBtn.addEventListener("click", downloadQRCode);

loadQueryParameters();

setImportVisible(new URLSearchParams(window.location.search).size > 0);
})();
