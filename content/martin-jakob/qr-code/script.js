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

async function loadFile(file) {
    if (isGenerating) return;
    const version = ++fileLoadVersion;
    loadedData = null;
    generateBtn.disabled = true;
    info.textContent = "";
    statusDiv.textContent = "JSON-Datei wird geladen …";
    try {
        const data = JSON.parse(await file.text());
        if (version !== fileLoadVersion) return;
        if (!Array.isArray(data) || !data.length) {
            throw new Error("Erwartet wird eine Liste mit mindestens einem Eintrag.");
        }
        loadedData = data.map((entry, index) => {
            if (!entry || typeof entry.URL !== "string" || !entry.URL.trim() ||
                (entry.Interne_ID != null && !["string", "number"].includes(typeof entry.Interne_ID)) ||
                (entry.Titel != null && typeof entry.Titel !== "string") ||
                (entry.Untertitel != null && typeof entry.Untertitel !== "string")) {
                throw new Error("Eintrag " + (index + 1) + ": URL fehlt oder ein Feld hat einen ungültigen Typ.");
            }
            return { URL: entry.URL.trim(), Interne_ID: String(entry.Interne_ID ?? "").trim(), Titel: entry.Titel || "", Untertitel: entry.Untertitel || "" };
        });
        info.textContent = "Dateiname: " + file.name + "\nAnzahl der Einträge: " + loadedData.length;
        generateBtn.disabled = false;
        statusDiv.textContent = "";
    } catch (error) {
        if (version !== fileLoadVersion) return;
        loadedData = null;
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

function createLabeledCanvas(qrCanvas, title, subtitle) {
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
    output.width = qrCanvas.width;
    output.height = qrCanvas.height + headerHeight;
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

async function generateZip() {
    if (!loadedData || isGenerating) return;
    isGenerating = true;
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
            const entry = entries[i];
            statusDiv.textContent = "QR-Code " + (i + 1) + " von " + entries.length + " wird erstellt …";
            renderQRCode(qrCanvas, entry.URL, settings);
            const output = createLabeledCanvas(qrCanvas, entry.Titel, entry.Untertitel);
            if (showBulkPreview.checked) {
                bulkCanvas.width = output.width;
                bulkCanvas.height = output.height;
                bulkCanvas.getContext("2d").drawImage(output, 0, 0);
                previewStatus.textContent = statusDiv.textContent;
                if (!bulkPreview.open) bulkPreview.showModal();
                // Give the browser time to paint and keep the preview readable.
                await new Promise(resolve => setTimeout(resolve, 80));
            }
            const image = await toPNG(output);
            const baseName = sanitizeFilename(entry.Titel || entry.Interne_ID);
            let fileName = baseName + ".png";
            let suffix = 2;
            while (filenames.has(fileName.toLowerCase())) fileName = baseName + "_" + suffix++ + ".png";
            filenames.add(fileName.toLowerCase());
            zip.file(fileName, image);
        }
        statusDiv.textContent = "ZIP-Datei wird erstellt …";
        previewStatus.textContent = statusDiv.textContent;
        const zipBlob = await zip.generateAsync({type: "blob"});
        saveAs(zipBlob, "QR-Codes.zip");
        loadedData = null;
        fileInput.value = "";
        info.textContent = "";
        bulkPreview.close();
        bulkCanvas.width = bulkCanvas.height = 0;
        statusDiv.textContent = entries.length + " QR-Codes wurden erstellt. Die importierten Daten wurden entfernt.";
    } catch (error) {
        console.error(error);
        statusDiv.textContent = "Export fehlgeschlagen: " + error.message;
    } finally {
        bulkPreview.close();
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
