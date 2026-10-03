"use strict";

(() => {

// All translations are presentation-only: imported data and custom labels stay unchanged.
const english = {
    "QR-Code Generator Plus": "QR Code Generator Plus",
    "Einzelner QR-Code erstellen": "Create a single QR code",
    "QR-Code gestalten": "Customize QR code",
    "Adresse oder Text": "URL or text",
    "Adresse oder Text eingeben …": "Enter a URL or text …",
    "QR-Code": "QR code",
    "Eckig": "Square",
    "Rund": "Round",
    "Abgerundet": "Rounded",
    "Raute": "Diamond",
    "Horizontal": "Horizontal",
    "Vertikal": "Vertical",
    "Kleinere Punkte": "Small dots",
    "Farbe des QR-Codes": "QR code color",
    "Positionsmarkierungen": "Position markers",
    "Kreisförmig": "Circular",
    "Abgerundetes Quadrat": "Rounded square",
    "Ring": "Ring",
    "Quadrat mit Kreis": "Square with circle",
    "Kreis mit Quadrat": "Circle with square",
    "Farbe der Positionsmarkierungen": "Position marker color",
    "Vorschau und Download": "Preview and download",
    "Erstellter QR-Code": "Generated QR code",
    "Logo (Quadratisch)": "Logo (square)",
    "Hinweise zum Logo": "Logo information",
    "PNG oder JPEG · max. 2 MB / 512 × 512 px. Logo wird am QR-Raster ausgerichtet und auf Lesbarkeit geprüft. Bei Bedarf wird nur das Logo verkleinert oder weggelassen. Scan vor Verwendung testen.": "PNG or JPEG · max. 2 MB / 512 × 512 px. The logo is aligned with the QR grid and checked for readability. It may be reduced or omitted if needed. Test scanning before use.",
    "Logo auswählen": "Choose logo",
    "Logo entfernen": "Remove logo",
    "Gespeicherte Logos": "Saved logos",
    "PNG herunterladen": "Download PNG",
    "Massenimport": "Bulk import",
    "JSON-Datei importieren": "Import JSON file",
    "JSON-Datei hierher ziehen": "Drop a JSON file here",
    "oder klicken, um eine Datei auszuwählen": "or click to choose a file",
    "Erscheinungsbild ändern": "Customize appearance",
    "QR-Codes während der Erstellung anzeigen": "Show QR codes while generating",
    "Template anpassen": "Customize template",
    "Export abbrechen": "Cancel export",
    "Layout schliessen": "Close layout",
    "Eckband ändern": "Customize corner ribbon",
    "Eckband aktivieren": "Enable corner ribbon",
    "Eckband": "Corner ribbon",
    "Beispiel für die Beschriftung": "Label preview",
    "Dateiformat": "File format",
    "PNG (Bild)": "PNG (image)",
    "SVG (Vektorgrafik)": "SVG (vector)",
    "Übernehmen": "Apply",
    "ZIP-Datei erstellen": "Create ZIP file",
    "Schliessen": "Close",
    "Bei Test-URLs": "For test URLs",
    "Immer": "Always",
    "Aus": "Off",
    "Text": "Text",
    "Farbe": "Color",
    "QR-Code-Vorschau": "QR code preview",
    "JSON-Felder zuordnen": "Map JSON fields",
    "Wählen Sie genau eine der drei Möglichkeiten für die URL. Titel und Untertitel sind optional.": "Choose one of the three URL options. Title and subtitle are optional.",
    "URL-Quelle – genau eine Option auswählen": "URL source – choose one option",
    "Vollständige URL aus der JSON-Datei": "Full URL from the JSON file",
    "Basis-URL aus der JSON-Datei + ID": "Base URL from the JSON file + ID",
    "Basis-URL eingeben + ID": "Enter a base URL + ID",
    "Feld mit der vollständigen URL": "Field containing the full URL",
    "Feld mit der Basis-URL": "Field containing the base URL",
    "Basis-URL": "Base URL",
    "Gespeicherte Basis-URLs anzeigen": "Show saved base URLs",
    "Gespeicherte Basis-URLs": "Saved base URLs",
    "Die Basis-URL wird mit der ID jedes Eintrags kombiniert.": "The base URL is combined with each entry’s ID.",
    "Titel (optional)": "Title (optional)",
    "Untertitel (optional)": "Subtitle (optional)",
    "ID (bei Basis-URL erforderlich)": "ID (required with a base URL)",
    "Abbrechen": "Cancel",
    "Weiter": "Continue",
    "Vorschau schliessen": "Close preview",
    "Sie können dieses Fenster schliessen, ohne die Verarbeitung abzubrechen. Ohne Vorschau werden die QR-Codes schneller erstellt.": "You can close this window without cancelling the export. QR codes generate faster with the preview closed.",
    "Vorschau des aktuellen QR-Codes": "Preview of the current QR code",
    "Meldung schliessen": "Dismiss notification",
    "Das Logo kann verwendet werden, aber der lokale Speicher ist voll oder nicht verfügbar.": "The logo can be used, but local storage is full or unavailable.",
    "Logo auswählen: ": "Choose logo: ",
    "Ungültiges gespeichertes Logo.": "Invalid saved logo.",
    "Logo ausgewählt.": "Logo selected.",
    "Das gespeicherte Logo konnte nicht geladen werden. Bitte löschen und erneut hochladen.": "The saved logo could not be loaded. Please delete it and upload it again.",
    "Gespeichertes Logo löschen: ": "Delete saved logo: ",
    "Gespeichertes Logo gelöscht.": "Saved logo deleted.",
    "Bild wird geladen …": "Loading image …",
    "Bitte ein PNG- oder JPEG-Bild auswählen.": "Please choose a PNG or JPEG image.",
    "Das Bild darf höchstens 2 MB gross sein.": "The image must not exceed 2 MB.",
    "Das Bild muss quadratisch sein.": "The image must be square.",
    "Das Bild darf höchstens 512 × 512 Pixel gross sein.": "The image must not exceed 512 × 512 pixels.",
    "Logo hinzugefügt. Es wird auch im Massenexport verwendet.": "Logo added. It will also be used for bulk exports.",
    "Logo hinzugefügt. Zum Speichern bitte eines der 12 gespeicherten Logos löschen.": "Logo added. To save it, please delete one of the 12 saved logos.",
    " Das bisherige Bild bleibt erhalten.": " The previous image is retained.",
    "Die gespeicherten Basis-URLs konnten nicht aktualisiert werden. Der Import ist trotzdem möglich.": "Saved base URLs could not be updated. You can still import the file.",
    "Gespeicherte Basis-URL löschen: ": "Delete saved base URL: ",
    "Basis-URL löschen": "Delete base URL",
    "Erwartet wird eine Liste von Einträgen oder ein Objekt mit genau einer solchen Liste.": "Expected a list of entries or an object containing exactly one such list.",
    "Die Datei muss eine nicht leere Liste von Objekten enthalten.": "The file must contain a non-empty list of objects.",
    "Die Liste enthält leere Einträge.": "The list contains empty entries.",
    "Bitte wählen Sie ein URL-Feld aus oder geben Sie eine Basis-URL ein und wählen Sie das ID-Feld.": "Please choose a URL field, or enter a base URL and choose the ID field.",
    "Eintrag ": "Entry ",
    ": Eine vollständige URL oder eine gültige Basis-URL mit ID ist erforderlich.": ": A full URL or a valid base URL with an ID is required.",
    ": Die Basis-URL darf keine Abfrageparameter oder Sprungmarke enthalten.": ": The base URL must not contain query parameters or a fragment.",
    ": Ungültige ID.": ": Invalid ID.",
    ": Das gewählte URL-Feld muss eine vollständige HTTP- oder HTTPS-Adresse enthalten.": ": The selected URL field must contain a full HTTP or HTTPS address.",
    ": Das Feld für ": ": The field for ",
    " muss Text oder eine Zahl enthalten. Sie können es auch weglassen.": " must contain text or a number. You can also leave it out.",
    "Dateiname: ": "File name: ",
    "Anzahl der Einträge: ": "Number of entries: ",
    "Import abgebrochen. Bitte wählen Sie eine JSON-Datei aus.": "Import cancelled. Please choose a JSON file.",
    "URL-Feld auswählen …": "Choose URL field …",
    "Nicht verwenden": "Do not use",
    "Basis-URL ergänzen": "Add base URL",
    "Titel, Untertitel und interne ID wurden erkannt. Bitte ergänzen Sie nur die Basis-URL.": "Title, subtitle and internal ID were detected. Just enter the base URL.",
    "Bitte ordnen Sie die JSON-Felder zu.": "Please map the JSON fields.",
    "JSON-Datei wird geladen …": "Loading JSON file …",
    "Es wurden keine verwendbaren Text- oder Zahlenfelder gefunden.": "No usable text or number fields were found.",
    "Es wurde kein Feld mit gültigen URLs gefunden. Geben Sie unten eine Basis-URL ein und wählen Sie das passende ID-Feld. Alternativ können Sie vorhandene URL-Felder zuordnen.": "No field with valid URLs was found. Enter a base URL below and select the ID field, or map an existing URL field.",
    "Ungültige JSON-Datei: ": "Invalid JSON file: ",
    "Das Logo wurde für diesen Code weggelassen. Die gewählten Formen und Farben bleiben erhalten. Bitte den Code vor Verwendung scannen.": "The logo was omitted for this code. Your chosen shapes and colors are retained. Please test scanning before use.",
    "Die QR-Leseprüfung ist nicht verfügbar. Bitte die Seite neu laden oder das Logo entfernen.": "The QR readability check is unavailable. Please reload the page or remove the logo.",
    "Datum": "Date",
    "Bern, Bahnhof": "Bern, station",
    "Kante A": "Platform A",
    "Richtung Zentrum": "Towards city center",
    "Feld ": "Add a field ",
    "oberhalb": "above",
    "unterhalb": "below",
    " des QR-Codes hinzufügen": " the QR code",
    "Verfügbare Felder": "Available fields",
    "+ Eigener Text": "+ Custom text",
    "Aktuelles Datum": "Current date",
    "Eigener Text": "Custom text",
    " verschieben (ziehen oder Pfeiltasten verwenden)": ": move (drag or use arrow keys)",
    "Ziehen oder mit den Pfeiltasten verschieben": "Drag or use the arrow keys to move",
    "Beschriftung hinzufügen": "Add label",
    "Beschriftung ändern": "Edit label",
    "Beschriftung für ": "Label for ",
    " ändern": ": edit",
    "Beschriftung": "Label",
    "Text eingeben": "Enter text",
    "Fett": "Bold",
    "Kleine Schrift": "Small font",
    "Grosse Schrift": "Large font",
    "Schwarz statt Grau": "Black instead of gray",
    " entfernen": ": remove",
    "Erscheinungsbild gespeichert.": "Appearance saved.",
    "Linien: ": "Routes: ",
    "Die Beschriftung ist zu lang. Bitte kürzen Sie den Text.": "The label is too long. Please shorten the text.",
    "Export wird abgebrochen …": "Cancelling export …",
    "QR-Code ": "QR code ",
    " von ": " of ",
    " wird erstellt …": " is being generated …",
    "ZIP-Datei wird erstellt …": "Creating ZIP file …",
    " QR-Codes exportiert.": " QR codes exported.",
    " ohne Logo.": " without a logo.",
    "Export abgebrochen. Die importierten Daten bleiben für einen erneuten Export erhalten.": "Export cancelled. Your imported data is retained so you can export again.",
    "Export fehlgeschlagen: ": "Export failed: ",
    "Beispiel-QR-Code ohne eigene Daten": "Example QR code without your own data",
    "Die QR-Code-Bibliothek konnte nicht geladen werden. Bitte die Seite neu laden.": "The QR code library could not be loaded. Please reload the page.",
    "Der Text konnte nicht als QR-Code erstellt werden. Bitte kürzen Sie die Eingabe.": "The text could not be converted to a QR code. Please shorten it.",
    " Die letzte erfolgreiche Vorschau bleibt erhalten.": " The last successful preview is retained.",
    "Sprache": "Language",
    "Linien": "Routes",
    "Interner Bezeichner": "Internal name",
    "Titel": "Title",
    "Untertitel": "Subtitle",
    "Interne ID": "Internal ID",
    "Ungültige JSON-Syntax. Bitte prüfen Sie die Datei.": "Invalid JSON syntax. Please check the file.",
    "Das Bild konnte nicht geladen werden.": "The image could not be loaded."
};
let language = "de";
try { if (localStorage.getItem("qr-generator.language") === "en") language = "en"; } catch { /* Optional preference. */ }
function t(text) { return language === "en" ? english[text] ?? text : text; }
class LocalizedError extends Error {
    constructor(render) { super(); this.render = render; }
    get message() { return this.render(); }
}
// Retain render functions so visible feedback can change language without changing user data.
const localizedMessages = new Map();
function setMessage(node, render) {
    localizedMessages.set(node, render);
    node.textContent = render();
}
const localizedNodes = [];
function captureTranslations() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
        const node = walker.currentNode;
        const text = node.textContent.trim();
        if (Object.hasOwn(english, text)) localizedNodes.push({node, text, prefix: node.textContent.match(/^\s*/)[0], suffix: node.textContent.match(/\s*$/)[0]});
    }
    for (const node of document.querySelectorAll("[aria-label], [title], [placeholder]")) {
        for (const attribute of ["aria-label", "title", "placeholder"]) {
            const text = node.getAttribute(attribute);
            if (Object.hasOwn(english, text)) localizedNodes.push({node, text, attribute});
        }
    }
}
function translateInterface() {
    document.documentElement.lang = language;
    for (const item of localizedNodes) {
        if (!item.node.isConnected) continue;
        if (item.attribute) item.node.setAttribute(item.attribute, t(item.text));
        else item.node.textContent = item.prefix + t(item.text) + item.suffix;
    }
    for (const button of document.querySelectorAll("[data-language]")) button.setAttribute("aria-pressed", String(button.dataset.language === language));
    if (!new URLSearchParams(location.search).get("title")) document.title = t("QR-Code Generator Plus");
}
captureTranslations();
translateInterface();

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

let toastTimer;
const toastQueue = [];
function toast(message, error = false) {
    if (toastQueue.at(-1)?.message === message) return;
    toastQueue.push({message, error});
    if (toastQueue.length > 4) toastQueue.splice(1, 1);
    if (toastQueue.length === 1) showNextToast();
}
function showNextToast() {
    if (!toastQueue.length) return;
    const {message, error} = toastQueue[0];
    const element = document.getElementById("toast");
    document.getElementById("toastMessage").textContent = message;
    element.classList.remove("show");
    element.classList.toggle("error", error);
    if (element.showPopover && !element.matches(":popover-open")) element.showPopover();
    void element.offsetWidth;
    element.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, 3500);
}
function hideToast() {
    const element = document.getElementById("toast");
    element.classList.remove("show");
    if (element.hidePopover && element.matches(":popover-open")) element.hidePopover();
    clearTimeout(toastTimer);
    toastQueue.shift();
    if (toastQueue.length) toastTimer = setTimeout(showNextToast, 150);
}
document.getElementById("toastClose").addEventListener("click", hideToast);

let logoImage = null;
let logoLoadVersion = 0;
let activeLogoData = "";
const logoInput = document.getElementById("logoInput");
const logoStatus = document.getElementById("logoStatus");
const removeLogoBtn = document.getElementById("removeLogoBtn");
const logoStorageKey = "qr-generator.logos.v1";
const savedLogos = document.getElementById("savedLogos");
document.getElementById("chooseLogoBtn").addEventListener("click", () => document.getElementById("logoInput").click());
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
        setMessage(logoStatus, () => t("Das Logo kann verwendet werden, aber der lokale Speicher ist voll oder nicht verfügbar."));
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
        select.setAttribute("aria-label", t("Logo auswählen: ") + item.name);
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
                if (!image.naturalWidth || image.naturalWidth !== image.naturalHeight || image.naturalWidth > 256) throw new LocalizedError(() => t("Ungültiges gespeichertes Logo."));
                logoImage = image;
                activeLogoData = item.data;
                removeLogoBtn.hidden = false;
                setMessage(logoStatus, () => t("Logo ausgewählt."));
                renderSavedLogos();
                saveSettings();
                generateQRCode();
            } catch { if (version === logoLoadVersion) setMessage(logoStatus, () => t("Das gespeicherte Logo konnte nicht geladen werden. Bitte löschen und erneut hochladen.")); }
        });
        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "saved-logo-delete";
        remove.textContent = "×";
        remove.setAttribute("aria-label", t("Gespeichertes Logo löschen: ") + item.name);
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
            setMessage(logoStatus, () => t("Gespeichertes Logo gelöscht."));
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
    setMessage(logoStatus, () => t("Bild wird geladen …"));
    let objectURL;
    try {
        if (!["image/png", "image/jpeg"].includes(file.type)) throw new LocalizedError(() => t("Bitte ein PNG- oder JPEG-Bild auswählen."));
        if (file.size > 2 * 1024 * 1024) throw new LocalizedError(() => t("Das Bild darf höchstens 2 MB gross sein."));
        objectURL = URL.createObjectURL(file);
        const image = new Image();
        image.src = objectURL;
        await image.decode();
        if (version !== logoLoadVersion) return;
        if (!image.naturalWidth || image.naturalWidth !== image.naturalHeight) throw new LocalizedError(() => t("Das Bild muss quadratisch sein."));
        if (image.naturalWidth > 512) throw new LocalizedError(() => t("Das Bild darf höchstens 512 × 512 Pixel gross sein."));
        const logo = document.createElement("canvas");
        logo.width = logo.height = Math.min(256, image.naturalWidth);
        logo.getContext("2d").drawImage(image, 0, 0, logo.width, logo.height);
        logoImage = logo;
        activeLogoData = logo.toDataURL("image/png");
        removeLogoBtn.hidden = false;
        setMessage(logoStatus, () => t("Logo hinzugefügt. Es wird auch im Massenexport verwendet."));
        const saved = readSavedLogos().filter(item => item.data !== activeLogoData);
        if (saved.length >= 12) {
            setMessage(logoStatus, () => t("Logo hinzugefügt. Zum Speichern bitte eines der 12 gespeicherten Logos löschen."));
        } else {
            writeSavedLogos([{name: file.name, data: activeLogoData}, ...saved]);
        }
        renderSavedLogos();
        saveSettings();
        generateQRCode();
    } catch (error) {
        if (version === logoLoadVersion) setMessage(logoStatus, () => (error.name === "EncodingError" ? t("Das Bild konnte nicht geladen werden.") : error.message) + (logoImage ? t(" Das bisherige Bild bleibt erhalten.") : ""));
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
    setMessage(logoStatus, () => "");
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
    document.getElementById("singleSection").hidden = visible;
    document.getElementById("toggleSingleBtn").setAttribute("aria-expanded", String(!visible));
    toggleImportBtn.setAttribute("aria-expanded", String(visible));
    generateQRCode();
    saveSettings();
}

toggleImportBtn.addEventListener("click", () => setImportVisible(bulkImport.hidden));
document.getElementById("toggleSingleBtn").addEventListener("click", () => setImportVisible(!document.getElementById("singleSection").hidden));


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
        setMessage(baseURLStorageStatus, () => "");
        return true;
    } catch {
        setMessage(baseURLStorageStatus, () => t("Die gespeicherten Basis-URLs konnten nicht aktualisiert werden. Der Import ist trotzdem möglich."));
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
        remove.setAttribute("aria-label", t("Gespeicherte Basis-URL löschen: ") + url);
        remove.title = t("Basis-URL löschen");
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
    setMessage(mappingError, () => "");
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
        if (lists.length !== 1) throw new LocalizedError(() => t("Erwartet wird eine Liste von Einträgen oder ein Objekt mit genau einer solchen Liste."));
        data = lists[0];
    }
    if (!Array.isArray(data) || !data.length || !data.every(isRecord)) {
        throw new LocalizedError(() => t("Die Datei muss eine nicht leere Liste von Objekten enthalten."));
    }
    if (data.some(row => !Object.keys(row).length)) throw new LocalizedError(() => t("Die Liste enthält leere Einträge."));
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
    if (!mapping.URL && !mapping.Base_URL && !enteredBaseURL.trim()) throw new LocalizedError(() => t("Bitte wählen Sie ein URL-Feld aus oder geben Sie eine Basis-URL ein und wählen Sie das ID-Feld."));
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
                throw new LocalizedError(() => t("Eintrag ") + (index + 1) + t(": Eine vollständige URL oder eine gültige Basis-URL mit ID ist erforderlich."));
            }
            const parsedBase = new URL(base.trim());
            if (parsedBase.search || parsedBase.hash) throw new LocalizedError(() => t("Eintrag ") + (index + 1) + t(": Die Basis-URL darf keine Abfrageparameter oder Sprungmarke enthalten."));
            const encodedId = encodeURIComponent(String(id).trim());
            if (encodedId === "." || encodedId === "..") throw new LocalizedError(() => t("Eintrag ") + (index + 1) + t(": Ungültige ID."));
            url = base.trim().replace(/\/+$/, "") + "/" + encodedId;
        }
        if (!isWebURL(url)) throw new LocalizedError(() => t("Eintrag ") + (index + 1) + t(": Das gewählte URL-Feld muss eine vollständige HTTP- oder HTTPS-Adresse enthalten."));
        const result = {URL: url.trim()};
        for (const field of ["Titel", "Untertitel", "Interne_ID"]) {
            const value = mapping[field] ? row[mapping[field]] : null;
            if (value != null && typeof value !== "string" && !(typeof value === "number" && Number.isFinite(value))) {
                throw new LocalizedError(() => t("Eintrag ") + (index + 1) + t(": Das Feld für ") + field + t(" muss Text oder eine Zahl enthalten. Sie können es auch weglassen."));
            }
            result[field] = value == null ? "" : String(value).trim();
        }
        result.Linien = formatLines(row.Linien);
        const excluded = new Set(["URL", "Base_URL", "Titel", "Untertitel", ...Object.values(mapping).filter(Boolean)]);
        result.Metrics = Object.fromEntries(Object.entries(row).filter(([key, value]) =>
            !excluded.has(key) && metricValue(value) !== ""
        ));
        result.Metrics.Interne_ID = result.Interne_ID;
        result.Metrics.Linien = result.Linien;
        return result;
    });
}

function acceptImport(records, filename) {
    loadedData = records;
    setMessage(info, () => t("Dateiname: ") + filename + "\n" + t("Anzahl der Einträge: ") + records.length);
    generateBtn.disabled = false;
    setMessage(statusDiv, () => "");
    pendingImport = null;
    mappingDialog.close();
    openLayoutEditor();
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
    setMessage(statusDiv, () => t("Import abgebrochen. Bitte wählen Sie eine JSON-Datei aus."));
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
    } catch (error) { setMessage(mappingError, () => error.message); }
});

function showMapping(records, filename, keys, mapping, reason) {
    pendingImport = {records, filename};
    manualBaseURL.value = "";
    setMessage(baseURLStorageStatus, () => "");
    renderSavedBaseURLs();
    for (const [field, select] of Object.entries(mappingFields)) {
        select.replaceChildren();
        const empty = document.createElement("option");
        empty.value = "";
        empty.textContent = field === "URL" ? t("URL-Feld auswählen …") : t("Nicht verwenden");
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
    setMessage(document.getElementById("mappingHeading"), () => simple ? t("Basis-URL ergänzen") : t("JSON-Felder zuordnen"));
    setMessage(document.getElementById("mappingHelp"), () => simple
        ? t("Titel, Untertitel und interne ID wurden erkannt. Bitte ergänzen Sie nur die Basis-URL.")
        : t("Wählen Sie genau eine der drei Möglichkeiten für die URL. Titel und Untertitel sind optional."));
    setURLMode(mapping.URL ? "full" : mapping.Base_URL ? "base" : "manual");
    setMessage(mappingError, () => simple ? "" : reason());
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
        const keys = [...new Set(records.flatMap(Object.keys))].filter(key => records.some(row => typeof row[key] === "string" || typeof row[key] === "number"));
        if (!keys.length) throw new LocalizedError(() => t("Es wurden keine verwendbaren Text- oder Zahlenfelder gefunden."));
        const mapping = Object.fromEntries(Object.keys(mappingFields).map(key => [key, keys.includes(key) ? key : ""]));
        const recognized = new Set(["Titel", "Untertitel", "URL", "Base_URL", "Interne_ID", "Hst_SLOID", "Hst_DiDok", "Kt_SLOID", "Interner_Bezeichner", "Linien"]);
        let reason = () => "";
        let normalized;
        try { normalized = normalizeRecords(records, mapping); } catch (error) { reason = () => error.message; }
        if (normalized && keys.every(key => recognized.has(key))) {
            acceptImport(normalized, file.name);
        } else {
            if (!mapping.URL && !mapping.Base_URL) {
                const candidates = keys.filter(key => records.every(row => isWebURL(row[key])));
                if (candidates.length === 1) mapping.URL = candidates[0];
                if (!candidates.length) reason = () => t("Es wurde kein Feld mit gültigen URLs gefunden. Geben Sie unten eine Basis-URL ein und wählen Sie das passende ID-Feld. Alternativ können Sie vorhandene URL-Felder zuordnen.");
            }
            showMapping(records, file.name, keys, mapping, reason);
        }
    } catch (error) {
        if (version !== fileLoadVersion) return;
        setMessage(statusDiv, () => t("Ungültige JSON-Datei: ") + (error instanceof SyntaxError ? t("Ungültige JSON-Syntax. Bitte prüfen Sie die Datei.") : error.message));
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
            ...appearance, preview: showBulkPreview.checked, logoData: activeLogoData, format: document.getElementById("exportFormat").value
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

    if (["png", "svg"].includes(saved.format)) document.getElementById("exportFormat").value = saved.format;
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

function xml(value) { return String(value).replace(/[&<>"']/g, character => ({"&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&apos;"})[character]); }
// Record the same paths used by Canvas, so SVG exports retain every chosen shape.
function vectorContext(native) {
    const elements = [];
    let path = "", transform = "";
    const transforms = [];
    const wrap = content => transform ? '<g transform="' + transform + '">' + content + '</g>' : content;
    const proxy = new Proxy(native, {
        get(target, key) {
            if (key === "svgContent") return elements.join("");
            const original = target[key];
            if (typeof original !== "function") return original;
            return (...args) => {
                const [x, y, w, h] = args;
                if (key === "beginPath") path = "";
                if (key === "moveTo") path += 'M' + x + ' ' + y + ' ';
                if (key === "lineTo") path += 'L' + x + ' ' + y + ' ';
                if (key === "quadraticCurveTo") path += 'Q' + args.join(' ') + ' ';
                if (key === "closePath") path += 'Z ';
                if (key === "arc") {
                    const r = w, start = h, end = args[4];
                    const sx = x + r * Math.cos(start), sy = y + r * Math.sin(start);
                    path += 'M' + sx + ' ' + sy + ' ';
                    if (Math.abs(end - start) >= Math.PI * 2 - 0.001) {
                        path += 'A' + r + ' ' + r + ' 0 1 1 ' + (x-r) + ' ' + y + ' A' + r + ' ' + r + ' 0 1 1 ' + sx + ' ' + sy + ' ';
                    } else path += 'A' + r + ' ' + r + ' 0 ' + (end-start > Math.PI ? 1 : 0) + ' 1 ' + (x+r*Math.cos(end)) + ' ' + (y+r*Math.sin(end)) + ' ';
                }
                if (key === "fill") elements.push(wrap('<path d="' + path + '" fill="' + xml(target.fillStyle) + '"/>'));
                if (key === "fillRect") elements.push(wrap('<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + xml(target.fillStyle) + '"/>'));
                if (key === "save") transforms.push(transform);
                if (key === "restore") transform = transforms.pop() || "";
                if (key === "translate") transform += ' translate(' + x + ' ' + y + ')';
                if (key === "rotate") transform += ' rotate(' + (x*180/Math.PI) + ')';
                if (key === "fillText") {
                    const fontSize = /([\d.]+)px/.exec(target.font)?.[1] || '16';
                    const fit = args[3] && target.measureText(x).width > args[3] ? ' textLength="' + args[3] + '" lengthAdjust="spacingAndGlyphs"' : '';
                    elements.push(wrap('<text x="' + y + '" y="' + w + '" fill="' + xml(target.fillStyle) + '" font-family="Arial, sans-serif" font-size="' + fontSize + '" font-weight="' + (target.font.includes('bold') ? '700' : '400') + '" text-anchor="middle" dominant-baseline="central"' + fit + '>' + xml(x) + '</text>'));
                }
                if (key === "drawImage") {
                    const image = x, dx = y, dy = w, width = args.length === 5 ? args[3] : image.width, height = args.length === 5 ? args[4] : image.height;
                    if (image.svgContent) elements.push(wrap('<svg x="' + dx + '" y="' + dy + '" width="' + width + '" height="' + height + '" viewBox="0 0 ' + image.width + ' ' + image.height + '">' + image.svgContent + '</svg>'));
                    else {
                        const data = image.toDataURL ? image.toDataURL('image/png') : image.src;
                        elements.push(wrap('<image x="' + dx + '" y="' + dy + '" width="' + width + '" height="' + height + '" href="' + xml(data) + '"/>'));
                    }
                }
                return original.apply(target, args);
            };
        },
        set(target, key, value) { target[key] = value; return true; }
    });
    return proxy;
}
function toSVG(source) {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + source.width + '" height="' + source.height + '" viewBox="0 0 ' + source.width + ' ' + source.height + '">' + source.svgContent + '</svg>';
}

function renderQRCode(canvas, inputText, settings) {
    const verifiedLogo = drawQRCode(canvas, inputText, {...settings, size: EXPORT_SIZE});
    if (settings.logo && !verifiedLogo) {
        // The logo renderer restores the original, styled QR code on failure.
        return t("Das Logo wurde für diesen Code weggelassen. Die gewählten Formen und Farben bleiben erhalten. Bitte den Code vor Verwendung scannen.");
    }
    return "";
}

function drawQRCode(canvas, inputText, settings) {
    const nativeContext = canvas.getContext("2d");
    const ctx = settings.vector ? vectorContext(nativeContext) : nativeContext;
    canvas.svgContent = "";
    canvas.logoPlacement = null;
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

    const verifiedLogo = settings.logo ? drawVerifiedLogo(canvas, nativeContext, settings.logo, inputText, modules, moduleSize, padding) : false;
    if (settings.vector) {
        if (canvas.logoPlacement) {
            const {x, edge} = canvas.logoPlacement;
            ctx.fillStyle = "white"; ctx.fillRect(x, x, edge, edge);
            ctx.drawImage(settings.logo, x + moduleSize, x + moduleSize, edge - 2*moduleSize, edge - 2*moduleSize);
        }
        canvas.svgContent = ctx.svgContent;
    }
    return verifiedLogo;


}

// Reuse verification buffers and a successful footprint as a starting point.
// Payloads differ, so every logo-bearing code still needs its own check.
const logoFootprints = new WeakMap();
let verificationCanvas;
let logoBackupCanvas;
function drawVerifiedLogo(canvas, context, logo, inputText, modules, moduleSize, padding) {
    if (typeof jsQR !== "function") throw new LocalizedError(() => t("Die QR-Leseprüfung ist nicht verfügbar. Bitte die Seite neu laden oder das Logo entfernen."));
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
            canvas.logoPlacement = {x, edge};
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

const metricLayout = {above: [], below: ["Interne_ID", "Linien"], labels: Object.create(null), custom: Object.create(null), styles: Object.create(null), ribbon: {mode: "auto", text: "TST", color: "#2563eb"}};
const layoutStorageKey = "qr-generator.layout.v1";
function saveLayout() {
    try { localStorage.setItem(layoutStorageKey, JSON.stringify(metricLayout)); } catch { /* Optional local preferences. */ }
}
function restoreLayout() {
    try {
        const saved = JSON.parse(localStorage.getItem(layoutStorageKey) || "null");
        if (!saved || !Array.isArray(saved.above) || !Array.isArray(saved.below)) return;
        const used = new Set();
        for (const area of ["above", "below"]) metricLayout[area] = saved[area].filter(key => typeof key === "string" && !used.has(key) && used.add(key));
        for (const prop of ["labels", "custom"]) metricLayout[prop] = Object.fromEntries(Object.entries(saved[prop] || {}).filter(([key, value]) => typeof value === "string"));
        metricLayout.styles = Object.fromEntries(Object.entries(saved.styles || {}).filter(([key, value]) => value && typeof value === "object").map(([key, value]) => [key, {bold: value.bold === true, large: value.large === true, black: value.black === true}]));
        if (["auto", "always"].includes(saved.ribbon?.previousMode)) metricLayout.ribbon.previousMode = saved.ribbon.previousMode;
        if (["auto", "always", "off"].includes(saved.ribbon?.mode)) metricLayout.ribbon.mode = saved.ribbon.mode;
        if (typeof saved.ribbon?.text === "string") metricLayout.ribbon.text = saved.ribbon.text.slice(0, 12);
        if (/^#[0-9a-f]{6}$/i.test(saved.ribbon?.color)) metricLayout.ribbon.color = saved.ribbon.color;
    } catch { /* Ignore invalid stored layouts. */ }
}
function ribbonVisible(url, layout = metricLayout) {
    return layout.ribbon?.mode !== "off" && (layout.ribbon?.mode === "always" || isTestURL(url));
}
function updateRibbonUI() {
    for (const id of ["layoutRibbon", "mainTestRibbon"]) {
        const ribbon = document.getElementById(id);
        ribbon.textContent = metricLayout.ribbon.text || "TST";
        ribbon.style.backgroundColor = metricLayout.ribbon.color;
    }
    const ribbon = document.getElementById("layoutRibbon");
    ribbon.hidden = false;
    ribbon.classList.toggle("inactive", !ribbonVisible(layoutSample?.URL || "https://example.com"));
    document.getElementById("ribbonEnabled").checked = metricLayout.ribbon.mode !== "off";
}
for (const [id, key] of [["ribbonMode", "mode"], ["ribbonText", "text"], ["ribbonColor", "color"]]) {
    document.getElementById(id).addEventListener("input", event => {
        metricLayout.ribbon[key] = event.target.value;
        saveLayout(); updateRibbonUI(); generateQRCode();
    });
}
const ribbonDialog = document.getElementById("ribbonDialog");
document.getElementById("layoutRibbon").addEventListener("click", () => ribbonDialog.showModal());
document.getElementById("closeRibbonBtn").addEventListener("click", () => ribbonDialog.close());
document.getElementById("applyRibbonBtn").addEventListener("click", () => ribbonDialog.close());
document.getElementById("ribbonEnabled").addEventListener("change", event => {
    if (event.target.checked) metricLayout.ribbon.mode = metricLayout.ribbon.previousMode || "auto";
    else { metricLayout.ribbon.previousMode = metricLayout.ribbon.mode; metricLayout.ribbon.mode = "off"; }
    document.getElementById("ribbonMode").value = metricLayout.ribbon.mode;
    saveLayout(); updateRibbonUI(); generateQRCode();
});
const layoutDialog = document.getElementById("layoutDialog");
let layoutSample;
let availableMetricKeys = [];
function metricValue(value) {
    if (value == null) return "";
    if (["string", "number", "boolean"].includes(typeof value)) return String(value).trim();
    if (Array.isArray(value)) return value.filter(item => ["string", "number"].includes(typeof item)).join(", ");
    return "";
}
function metricLabel(key, layout = metricLayout) {
    return Object.hasOwn(layout.labels || {}, key) ? layout.labels[key] : key === "Interne_ID" ? "" : key === "date:current" ? t("Datum") : key;
}
function currentDateText() { return new Intl.DateTimeFormat(language === "en" ? "en-GB" : "de-CH", {day: "numeric", month: "numeric", year: "numeric"}).format(new Date()); }
function metricValueFor(record, key, layout = metricLayout) {
    if (key === "date:current") return layout.dateText || currentDateText();
    if (Object.hasOwn(layout.custom || {}, key)) return layout.custom[key];
    return key === "Linien" ? formatLines(record.Metrics?.[key]) : metricValue(record.Metrics?.[key]);
}
function metricStyle(key, layout = metricLayout, scale = 1) {
    const style = layout.styles?.[key] || {};
    const size = Math.round((style.large ? 48 : 36) * scale);
    return {font: (style.bold ? "bold " : "") + size + "px Arial", lineHeight: Math.ceil(size * 1.4), color: style.black ? "#111" : "#666", size};
}
function metricText(record, key, layout = metricLayout) {
    if (Object.hasOwn(layout.custom || {}, key)) return layout.custom[key];
    const value = metricValueFor(record, key, layout);
    if (!value) return "";
    const label = metricLabel(key, layout);
    return label ? label + ": " + value : value;
}
function isTestURL(value) { return typeof value === "string" && value.toLowerCase().includes(".test."); }
function drawTestRibbon(context, width, layout = metricLayout) {
    const size = width * 0.13;
    context.save();
    context.fillStyle = layout.ribbon?.color || "#2563eb";
    context.beginPath(); context.moveTo(0, 0); context.lineTo(size, 0); context.lineTo(0, size); context.closePath(); context.fill();
    context.translate(size * 0.32, size * 0.32); context.rotate(-Math.PI / 4);
    context.font = "bold " + Math.round(width * 0.028) + "px Arial";
    context.textAlign = "center"; context.textBaseline = "middle"; context.fillStyle = "white";
    context.fillText(layout.ribbon?.text || "TST", 0, 0, size * 0.7); context.restore();
}
function openLayoutEditor() {
    const demo = {URL: "https://mobileinfo.test.bernmobil.ch/stops/BEISPIEL", Titel: t("Bern, Bahnhof"), Untertitel: t("Kante A"), Metrics: {
        Interne_ID: "M-BEISPIEL", Linien: "3, 9, 10, 12, 332", Hst_SLOID: "ch:1:sloid:7000", Hst_DiDok: "8507000", Kt_SLOID: "ch:1:sloid:7000:0:1", Interner_Bezeichner: t("Richtung Zentrum")
    }};
    if (loadedData?.length) {
        availableMetricKeys = [...new Set(loadedData.flatMap(record => Object.keys(record.Metrics || {})))].filter(key => loadedData.some(record => metricValue(record.Metrics[key])));
        const richest = loadedData.reduce((best, record) => Object.values(record.Metrics).filter(metricValue).length > Object.values(best.Metrics).filter(metricValue).length ? record : best);
        layoutSample = {...richest, Metrics: {...richest.Metrics}};
        for (const key of availableMetricKeys) {
            if (!metricValue(layoutSample.Metrics[key])) layoutSample.Metrics[key] = loadedData.find(record => metricValue(record.Metrics[key])).Metrics[key];
        }
        for (const key of ["Titel", "Untertitel"]) if (!layoutSample[key]) layoutSample[key] = loadedData.find(record => record[key])?.[key] || "";
    } else {
        layoutSample = demo;
        availableMetricKeys = Object.keys(demo.Metrics);
    }

    document.getElementById("layoutExportBtn").disabled = !loadedData || isGenerating;
    document.getElementById("layoutTitle").textContent = layoutSample.Titel;
    document.getElementById("layoutSubtitle").textContent = layoutSample.Untertitel;
    for (const [id, key] of [["ribbonMode", "mode"], ["ribbonText", "text"], ["ribbonColor", "color"]]) document.getElementById(id).value = metricLayout.ribbon[key];
    updateRibbonUI();
    setMessage(document.getElementById("layoutError"), () => "");
    try { setMessage(document.getElementById("layoutError"), () => renderQRCode(document.getElementById("layoutQR"), layoutSample.URL, readSettings())); }
    catch (error) { setMessage(document.getElementById("layoutError"), () => error.message); }
    renderMetricEditor();
    if (!layoutDialog.open) layoutDialog.showModal();
}
function moveMetric(key, destination, position) {
    const source = ["above", "below"].find(area => metricLayout[area].includes(key));
    if (!source || !["above", "below"].includes(destination)) return;
    const oldIndex = metricLayout[source].indexOf(key);
    metricLayout[source].splice(oldIndex, 1);
    if (source === destination && oldIndex < position) position--;
    metricLayout[destination].splice(Math.max(0, Math.min(position, metricLayout[destination].length)), 0, key);
    renderMetricEditor();
    saveLayout();
    [...layoutDialog.querySelectorAll(".metric-handle")].find(handle => handle.dataset.key === key)?.focus();
}
function attachMetricDrag(handle, row, key, area, index) {
    let target = null;
    let pointer = null;
    let placeholder, origin, lastTarget;
    let offsetX = 0, offsetY = 0;
    const clearTarget = () => { target?.classList.remove("drop-target"); target = null; };
    handle.addEventListener("pointerdown", event => {
        if (event.button !== 0) return;
        event.preventDefault();
        pointer = event.pointerId;
        handle.setPointerCapture(pointer);
        const bounds = row.getBoundingClientRect();
        offsetX = event.clientX - bounds.left; offsetY = event.clientY - bounds.top;
        origin = document.createComment("drag origin"); row.before(origin);
        placeholder = document.createElement("div"); placeholder.className = "metric-placeholder"; placeholder.style.height = bounds.height + "px"; row.before(placeholder);
        Object.assign(row.style, {position: "fixed", left: bounds.left + "px", top: bounds.top + "px", width: bounds.width + "px", zIndex: "20", pointerEvents: "none"});
        row.classList.add("is-dragging");
        layoutDialog.classList.add("is-sorting");
    });
    handle.addEventListener("pointermove", event => {
        if (pointer !== event.pointerId) return;
        row.style.left = event.clientX - offsetX + "px"; row.style.top = event.clientY - offsetY + "px";
        clearTarget();
        const hit = document.elementFromPoint(event.clientX, event.clientY);
        target = hit?.closest(".metric-add") || (hit?.closest(".metric-placeholder") ? lastTarget : null);
        if (!target) {
            const hitRow = hit?.closest(".metric-row");
            if (hitRow) target = event.clientY < hitRow.getBoundingClientRect().top + hitRow.offsetHeight / 2
                ? hitRow.previousElementSibling : hitRow.nextElementSibling;
        }
        if (target?.classList.contains("metric-placeholder")) target = target.previousElementSibling;
        if (target && !target.matches(".metric-add")) target = null;
        if (target && layoutDialog.contains(target)) {
            target.classList.add("drop-target");
            if (lastTarget !== target) {
                const rows = [...layoutDialog.querySelectorAll(".metric-row:not(.is-dragging)")];
                const before = new Map(rows.map(item => [item, item.getBoundingClientRect()]));
                target.after(placeholder); lastTarget = target;
                if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) for (const item of rows) {
                    const from = before.get(item), to = item.getBoundingClientRect();
                    if (from.top !== to.top) item.animate([{transform: 'translateY(' + (from.top-to.top) + 'px)'}, {transform: 'translateY(0)'}], {duration: 180, easing: 'ease-out'});
                }
            }
        } else target = null;
        const bounds = layoutDialog.getBoundingClientRect();
        if (event.clientY < bounds.top + 45) layoutDialog.scrollBy(0, -14);
        if (event.clientY > bounds.bottom - 45) layoutDialog.scrollBy(0, 14);
    });
    const finish = (event, cancelled) => {
        if (pointer !== event.pointerId) return;
        const destination = target?.dataset.area;
        const position = Number(target?.dataset.index);
        clearTarget();
        row.classList.remove("is-dragging");
        row.removeAttribute("style");
        origin.after(row); origin.remove(); placeholder.remove(); lastTarget = null;
        layoutDialog.classList.remove("is-sorting");
        if (handle.hasPointerCapture(pointer)) handle.releasePointerCapture(pointer);
        pointer = null;
        if (!cancelled && destination) moveMetric(key, destination, position);
    };
    handle.addEventListener("pointerup", event => finish(event, false));
    handle.addEventListener("pointercancel", event => finish(event, true));
    handle.addEventListener("keydown", event => {
        if (!["ArrowUp", "ArrowDown"].includes(event.key)) return;
        event.preventDefault();
        if (event.key === "ArrowUp") {
            if (index > 0) moveMetric(key, area, index - 1);
            else if (area === "below") moveMetric(key, "above", metricLayout.above.length);
        } else {
            if (index < metricLayout[area].length - 1) moveMetric(key, area, index + 2);
            else if (area === "above") moveMetric(key, "below", 0);
        }
    });
}
function renderMetricEditor() {
    const used = new Set([...metricLayout.above, ...metricLayout.below]);
    const remaining = availableMetricKeys.filter(key => !used.has(key));
    for (const [area, target] of [["above", "layoutAbove"], ["below", "layoutBelow"]]) {
        const container = document.getElementById(target);
        container.replaceChildren();
        const addControl = index => {
            const slot = document.createElement("div"); slot.className = "metric-add";
            slot.dataset.area = area; slot.dataset.index = String(index);
            const button = document.createElement("button"); button.type = "button"; button.textContent = "+"; button.className = "metric-plus";
            button.setAttribute("aria-label", t("Feld ") + (area === "above" ? t("oberhalb") : t("unterhalb")) + t(" des QR-Codes hinzufügen"));
            button.setAttribute("aria-expanded", "false");
            const dropdown = document.createElement("div"); dropdown.className = "metric-options"; dropdown.hidden = true;
            dropdown.setAttribute("role", "group"); dropdown.setAttribute("aria-label", t("Verfügbare Felder"));
            const close = () => { dropdown.hidden = true; button.setAttribute("aria-expanded", "false"); };
            for (const key of [...remaining, ...(!used.has("date:current") ? ["date:current"] : []), "__add_custom__"]) {
                const option = document.createElement("button"); option.type = "button"; option.textContent = key === "__add_custom__" ? t("+ Eigener Text") : key === "date:current" ? t("Aktuelles Datum") : key;
                option.addEventListener("click", () => {
                    if ([...metricLayout.above, ...metricLayout.below].includes(key)) return;
                    const addedKey = key === "__add_custom__" ? "custom:" + crypto.randomUUID() : key;
                    if (key === "__add_custom__") metricLayout.custom[addedKey] = t("Eigener Text");
                    metricLayout[area].splice(index, 0, addedKey);
                    saveLayout();
                    renderMetricEditor();
                    [...layoutDialog.querySelectorAll(".metric-handle")].find(handle => handle.dataset.key === addedKey)?.focus();
                    if (key === "__add_custom__") [...layoutDialog.querySelectorAll(".metric-row")].find(row => row.dataset.key === addedKey)?.querySelector(".metric-label")?.click();
                });
                dropdown.append(option);
            }
            button.addEventListener("click", () => {
                const open = dropdown.hidden;
                for (const other of layoutDialog.querySelectorAll(".metric-options")) {
                    other.hidden = true;
                    other.previousElementSibling?.setAttribute("aria-expanded", "false");
                }
                dropdown.hidden = !open;
                button.setAttribute("aria-expanded", String(open));
                if (open) dropdown.querySelector("button")?.focus();
            });
            slot.addEventListener("focusout", event => { if (!slot.contains(event.relatedTarget)) close(); });
            slot.addEventListener("keydown", event => {
                if (event.key === "Escape" && !dropdown.hidden) {
                    event.preventDefault(); event.stopPropagation(); close(); button.focus();
                }
            });
            slot.append(button, dropdown); container.append(slot);
        };
        addControl(0);
        metricLayout[area].forEach((key, index) => {
            if (!availableMetricKeys.includes(key) && !Object.hasOwn(metricLayout.custom, key) && key !== "date:current") return;
            const row = document.createElement("div"); row.className = "metric-row"; row.dataset.key = key;
            const handle = document.createElement("button"); handle.type = "button"; handle.className = "metric-handle"; handle.textContent = "⠿"; handle.dataset.key = key;
            handle.setAttribute("aria-label", key + t(" verschieben (ziehen oder Pfeiltasten verwenden)"));
            handle.title = t("Ziehen oder mit den Pfeiltasten verschieben");
            attachMetricDrag(handle, row, key, area, index);
            const text = document.createElement("span"); text.className = "metric-content";
            const label = document.createElement("button"); label.type = "button"; label.className = "metric-label";
            const isCustom = Object.hasOwn(metricLayout.custom, key);
            label.textContent = isCustom ? metricLayout.custom[key] : metricLabel(key) || t("Beschriftung hinzufügen");
            label.title = t("Beschriftung ändern");
            label.setAttribute("aria-label", t("Beschriftung für ") + key + t(" ändern"));
            const value = document.createElement("span"); value.className = "metric-value";
            value.textContent = isCustom ? "" : (metricLabel(key) ? ": " : " ") + metricValueFor(layoutSample, key);
            label.addEventListener("click", () => {
                const input = document.createElement("input"); input.type = "text"; input.className = "metric-label-input";
                input.value = isCustom ? metricLayout.custom[key] : metricLabel(key); input.placeholder = t("Beschriftung");
                input.setAttribute("aria-label", t("Beschriftung für ") + key);
                let finished = false;
                const finish = save => {
                    if (finished) return;
                    finished = true;
                    if (save) {
                        if (isCustom) metricLayout.custom[key] = input.value.trim();
                        else metricLayout.labels[key] = input.value.trim();
                        saveLayout();
                    }
                    label.textContent = isCustom ? metricLayout.custom[key] || t("Text eingeben") : metricLabel(key) || t("Beschriftung hinzufügen");
                    value.textContent = isCustom ? "" : (metricLabel(key) ? ": " : " ") + metricValueFor(layoutSample, key);
                    input.replaceWith(label);
                };
                input.addEventListener("blur", () => finish(true));
                input.addEventListener("keydown", event => {
                    if (event.key === "Enter" || event.key === "Escape") {
                        event.preventDefault(); event.stopPropagation(); finish(event.key === "Enter"); label.focus();
                    }
                });
                label.replaceWith(input); input.focus(); input.select();
            });
            text.append(label, value);
            const toolbar = document.createElement("span"); toolbar.className = "metric-toolbar";
            const controls = [];
            const refreshStyle = () => {
                const style = metricLayout.styles[key] || {};
                text.style.fontWeight = style.bold ? "700" : "400";
                text.style.fontSize = style.large ? "17px" : "14px";
                text.style.color = style.black ? "#111" : "#666";
                for (const [button, property, activeValue] of controls) button.setAttribute("aria-pressed", String(Boolean(style[property]) === activeValue));
            };
            for (const [caption, description, property, activeValue] of [
                ["B", t("Fett"), "bold", true], ["A", t("Kleine Schrift"), "large", false], ["A", t("Grosse Schrift"), "large", true], ["●", t("Schwarz statt Grau"), "black", true]
            ]) {
                const button = document.createElement("button"); button.type = "button";
                button.className = "metric-format" + (property === "large" ? activeValue ? " font-large" : " font-small" : property === "black" ? " color-toggle" : " font-bold");
                button.textContent = caption; button.title = description; button.setAttribute("aria-label", description);
                controls.push([button, property, activeValue]);
                button.addEventListener("click", () => {
                    const style = metricLayout.styles[key] ||= {};
                    style[property] = property === "large" ? activeValue : !style[property];
                    refreshStyle(); saveLayout();
                });
                toolbar.append(button);
            }
            refreshStyle();
            const remove = document.createElement("button"); remove.type = "button"; remove.textContent = "×"; remove.className = "metric-remove";
            remove.setAttribute("aria-label", key + t(" entfernen"));
            remove.addEventListener("click", () => { metricLayout[area].splice(index, 1); if (isCustom) delete metricLayout.custom[key]; delete metricLayout.styles[key]; saveLayout(); renderMetricEditor(); });
            row.append(handle, text, toolbar, remove); container.append(row); addControl(index + 1);
        });
    }
}
document.getElementById("editLayoutBtn").addEventListener("click", openLayoutEditor);
document.getElementById("closeLayoutBtn").addEventListener("click", () => { saveLayout(); layoutDialog.close(); });
document.getElementById("applyLayoutBtn").addEventListener("click", () => { saveLayout(); layoutDialog.close(); toast("Erscheinungsbild gespeichert."); });
document.getElementById("layoutExportBtn").addEventListener("click", () => { layoutDialog.close(); generateZip(); });

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

function createLabeledCanvas(qrCanvas, title, subtitle, internalId = "", lines = "", record = null, layout = metricLayout) {
    const output = document.createElement("canvas");
    const nativeContext = output.getContext("2d");
    const context = qrCanvas.svgContent ? vectorContext(nativeContext) : nativeContext;
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
    if (record) {
        context.font = `${idSize}px Arial`;
        for (const key of layout.above) {
            const text = metricText(record, key, layout);
            if (text) {
                const style = metricStyle(key, layout, scale); context.font = style.font;
                blocks.push({...style, lines: wrapText(context, text, maxWidth)});
            }
        }
    }
    const ribbonHeight = record && ribbonVisible(record.URL, layout) ? Math.round(110 * scale) : 0;
    const headerHeight = ribbonHeight + (blocks.length
        ? margin * 2 + blocks.reduce((height, block) => height + block.lines.length * block.lineHeight, 0)
        : 0);
    const idText = String(internalId ?? "").trim();
    context.font = `${idSize}px Arial`;
    const idLines = idText ? wrapText(context, idText, maxWidth) : [];
    const lineText = formatLines(lines);
    const footerBlocks = record
        ? layout.below.flatMap(key => {
            const text = metricText(record, key, layout);
            if (!text) return [];
            const style = metricStyle(key, layout, scale); context.font = style.font;
            return [{...style, lines: wrapText(context, text, maxWidth)}];
        })
        : [{font: idSize + "px Arial", color: "#666", lineHeight: idLineHeight, lines: [...idLines, ...(lineText ? wrapText(context, "Linien: " + lineText, maxWidth) : [])]}].filter(block => block.lines.length);
    const footerHeight = footerBlocks.length ? margin * 2 + footerBlocks.reduce((height, block) => height + block.lines.length * block.lineHeight, 0) : 0;
    output.width = qrCanvas.width;
    output.height = qrCanvas.height + headerHeight + footerHeight;
    // Browsers impose canvas size limits; fail clearly instead of exporting clipped text.
    if (output.height > 16384) throw new LocalizedError(() => t("Die Beschriftung ist zu lang. Bitte kürzen Sie den Text."));
    context.fillStyle = "white";
    context.fillRect(0, 0, output.width, output.height);
    context.textAlign = "center";
    context.textBaseline = "middle";
    let y = margin + ribbonHeight;
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
    for (const block of footerBlocks) {
        context.font = block.font; context.fillStyle = block.color;
        for (const line of block.lines) {
            context.fillText(line, output.width / 2, y + block.lineHeight / 2, maxWidth);
            y += block.lineHeight;
        }
    }
    if (ribbonHeight) drawTestRibbon(context, output.width, layout);
    if (qrCanvas.svgContent) output.svgContent = context.svgContent;
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

generateBtn.addEventListener("click", openLayoutEditor);
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
    const settings = {...readSettings(), vector: format === "svg"};
    const exportLayout = {above: [...metricLayout.above], below: [...metricLayout.below], labels: {...metricLayout.labels}, custom: {...metricLayout.custom}, styles: structuredClone(metricLayout.styles), ribbon: {...metricLayout.ribbon}, dateText: currentDateText()};
    // Keep one language throughout this ZIP even if the interface language changes.
    for (const key of [...exportLayout.above, ...exportLayout.below]) exportLayout.labels[key] = metricLabel(key);
    try {
        let adjustedCount = 0;
        const filenames = new Set();
        const zip = new JSZip();
        const qrCanvas = document.createElement("canvas");
        for (let i = 0; i < entries.length; i++) {
            checkExportCancelled();
            const entry = entries[i];
            setMessage(statusDiv, () => t("QR-Code ") + (i + 1) + t(" von ") + entries.length + t(" wird erstellt …"));
            const adjustment = renderQRCode(qrCanvas, entry.URL, settings);
            if (adjustment) adjustedCount++;
            const output = createLabeledCanvas(qrCanvas, entry.Titel, entry.Untertitel, entry.Interne_ID, entry.Linien, entry, exportLayout);
            if (showBulkPreview.checked) {
                bulkCanvas.width = output.width;
                bulkCanvas.height = output.height;
                bulkCanvas.getContext("2d").drawImage(output, 0, 0);
                setMessage(previewStatus, () => statusDiv.textContent);
                if (!bulkPreview.open) bulkPreview.showModal();
                // Yield for painting/cancellation without adding a delay per image.
                await new Promise(resolve => setTimeout(resolve, 0));
            } else {
                // Allow cancellation and other UI events between images.
                await new Promise(resolve => setTimeout(resolve, 0));
            }
            checkExportCancelled();
            const image = format === "svg" ? toSVG(output) : await toPNG(output);
            checkExportCancelled();
            const baseName = sanitizeFilename(entry.Titel || entry.Interne_ID);
            let fileName = baseName + "." + format;
            let suffix = 2;
            while (filenames.has(fileName.toLowerCase())) fileName = baseName + "_" + suffix++ + "." + format;
            filenames.add(fileName.toLowerCase());
            zip.file(fileName, image);
        }
        setMessage(statusDiv, () => t("ZIP-Datei wird erstellt …"));
        setMessage(previewStatus, () => statusDiv.textContent);
        checkExportCancelled();
        const zipBlob = await zip.generateAsync({type: "blob"}, checkExportCancelled);
        checkExportCancelled();
        saveAs(zipBlob, "QR-Codes.zip");
        loadedData = null;
        fileInput.value = "";
        setMessage(info, () => "");
        bulkPreview.close();
        bulkCanvas.width = bulkCanvas.height = 0;
        setMessage(statusDiv, () => "");
        toast(entries.length + t(" QR-Codes exportiert.") + (adjustedCount ? " " + adjustedCount + t(" ohne Logo.") : ""));
    } catch (error) {
        if (error === exportCancelled) {
            setMessage(statusDiv, () => t("Export abgebrochen. Die importierten Daten bleiben für einen erneuten Export erhalten."));
        } else {
            console.error(error);
            setMessage(statusDiv, () => t("Export fehlgeschlagen: ") + error.message);
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
  setMessage(qrError, () => "");
  setMessage(document.getElementById("renderNotice"), () => "");
  const isExample = !qrInput.value.trim();
  canvas.classList.toggle("is-example", isExample);
  canvas.setAttribute("aria-label", isExample ? t("Beispiel-QR-Code ohne eigene Daten") : t("Erstellter QR-Code"));

  const inputText = qrInput.value.trim() || (isExample ? "https://example.com" : "");
  const showTestRibbon = !isExample && ribbonVisible(inputText);
  updateRibbonUI();
  document.getElementById("mainTestRibbon").hidden = !showTestRibbon;
  canvas.parentElement.classList.toggle("has-test-ribbon", showTestRibbon);

  if (inputText === "") {
    clearQRCode();
    return;
  }

  if (typeof qrcode !== "function") {
    downloadBtn.hidden = true;
    clearQRCode();
    setMessage(qrError, () => t("Die QR-Code-Bibliothek konnte nicht geladen werden. Bitte die Seite neu laden."));
    return;
  }

  try {
    // Verify off-screen; failed logo checks must not erase the visible preview.
    const nextCanvas = document.createElement("canvas");
    const adjustment = renderQRCode(nextCanvas, inputText, readSettings());
    setMessage(document.getElementById("renderNotice"), () => adjustment);
    canvas.width = nextCanvas.width;
    canvas.height = nextCanvas.height;
    ctx.drawImage(nextCanvas, 0, 0);
    if (layoutDialog.open && layoutSample) renderQRCode(document.getElementById("layoutQR"), layoutSample.URL, readSettings());
    if (qrStyleDialog.open) renderQRCode(document.getElementById("styleQR"), layoutSample?.URL || inputText, readSettings());
    downloadBtn.hidden = isExample;
  } catch (error) {
    downloadBtn.hidden = true;
    setMessage(qrError, () => (error instanceof Error ? error.message : t("Der Text konnte nicht als QR-Code erstellt werden. Bitte kürzen Sie die Eingabe.")) + t(" Die letzte erfolgreiche Vorschau bleibt erhalten."));
    console.error(error);
  }
}

async function downloadQRCode() {
    if (downloadBtn.hidden || !qrInput.value.trim()) return;
    try {
        const output = createLabeledCanvas(canvas, qrTitle.textContent, qrSubtitle.textContent, "", "", {URL: qrInput.value.trim(), Metrics: {}}, {above: [], below: [], ribbon: {...metricLayout.ribbon}});
        const blob = await toPNG(output);
        saveAs(blob, sanitizeFilename(qrTitle.textContent || t("QR-Code")) + ".png");
    } catch (error) {
        setMessage(qrError, () => t("Export fehlgeschlagen: ") + error.message);
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

const qrStyleDialog = document.getElementById("qrStyleDialog");
const appearanceControls = document.querySelector(".appearance-fields");
const logoControls = document.querySelector(".logo-controls");
const appearanceAnchor = document.createComment("appearance controls");
const logoAnchor = document.createComment("logo controls");
appearanceControls.before(appearanceAnchor); logoControls.before(logoAnchor);
document.getElementById("editQRStyleBtn").addEventListener("click", () => {
    document.getElementById("modalAppearanceControls").append(appearanceControls);
    document.getElementById("modalLogoControls").append(logoControls);
    try { renderQRCode(document.getElementById("styleQR"), layoutSample?.URL || qrInput.value.trim() || "https://example.com", readSettings()); }
    catch (error) { toast(error.message, true); }
    qrStyleDialog.showModal();
});
function closeStyleEditor() { qrStyleDialog.close(); }
document.getElementById("closeQRStyleBtn").addEventListener("click", closeStyleEditor);
document.getElementById("applyQRStyleBtn").addEventListener("click", closeStyleEditor);
qrStyleDialog.addEventListener("close", () => {
    appearanceAnchor.after(appearanceControls); logoAnchor.after(logoControls);
    if (layoutSample) {
        try { renderQRCode(document.getElementById("layoutQR"), layoutSample.URL, readSettings()); }
        catch (error) { toast(error.message, true); }
    }
    saveSettings();
});
document.getElementById("exportFormat").addEventListener("change", saveSettings);
// Toast feedback mirrors TREP; keep persistent errors and progress beside their controls.
for (const id of ["logoStatus", "baseURLStorageStatus"]) {
    const source = document.getElementById(id);
    new MutationObserver(() => { if (source.textContent.trim()) toast(source.textContent); }).observe(source, {childList: true, characterData: true, subtree: true});
}

document.querySelectorAll("[data-language]").forEach(button => button.addEventListener("click", () => {
    if (language === button.dataset.language) return;
    language = button.dataset.language;
    try { localStorage.setItem("qr-generator.language", language); } catch { /* Optional preference. */ }
    // Updating in place preserves imported records, user input and all open dialogs.
    translateInterface();
    for (const [node, render] of localizedMessages) if (node.isConnected) node.textContent = render();
    for (const [field, select] of Object.entries(mappingFields)) if (select.options.length) select.options[0].textContent = field === "URL" ? t("URL-Feld auswählen …") : t("Nicht verwenden");
    renderSavedLogos();
    renderSavedBaseURLs();
    if (layoutDialog.open) openLayoutEditor();
    generateQRCode();
}));
restoreLayout();
restoreSettings();
renderSavedLogos();
loadQueryParameters();

setImportVisible(false);
})();
