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
}

toggleImportBtn.addEventListener("click", () => setImportVisible(bulkImport.hidden));
setImportVisible(new URLSearchParams(window.location.search).size > 0);

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
    statusDiv.textContent = "Lade JSON…";
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
        info.textContent = "Dateiname: " + file.name + "\nAnzahl Einträge: " + loadedData.length;
        generateBtn.disabled = false;
        statusDiv.textContent = "";
    } catch (error) {
        if (version !== fileLoadVersion) return;
        loadedData = null;
        statusDiv.textContent = "Ungültiges JSON: " + error.message;
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

function createQRImage(entry){

    return new Promise((resolve, reject) => {

  const qr = qrcode(0, "H");

  qr.addData(entry.URL);
  qr.make();

  const modules = qr.getModuleCount();

  const width = 1000;
  const qrSize = 850;

  const title = entry.Titel || "";
  const subtitle = entry.Untertitel || "";

  const headerHeight =
      subtitle.trim() !== ""
          ? 140
          : 90;

  const exportCanvas = document.createElement("canvas");
  const exportCtx = exportCanvas.getContext("2d");

  exportCanvas.width = width;
  exportCanvas.height = qrSize + headerHeight;

  exportCtx.fillStyle = "white";
  exportCtx.fillRect(0,0,exportCanvas.width,exportCanvas.height);

  exportCtx.textAlign = "center";

  if(title){

      exportCtx.fillStyle = "#000";

      exportCtx.font = "bold 42px Arial";

      exportCtx.fillText(
          title,
          width / 2,
          50
      );

  }

  if(subtitle){

      exportCtx.fillStyle = "#666";

      exportCtx.font = "24px Arial";

      exportCtx.fillText(
          subtitle,
          width / 2,
          90
      );

  }

  const moduleSize =
      Math.floor((qrSize * 0.8) / modules);

  const actualQRSize =
      modules * moduleSize;

  const qrOffsetX =
      Math.floor(
          (width - actualQRSize) / 2
      );

  const qrOffsetY =
      headerHeight +
      Math.floor(
          (qrSize - actualQRSize) / 2
      );

  exportCtx.fillStyle = "#000";

  for(let row=0; row<modules; row++){

      for(let col=0; col<modules; col++){

          if(!qr.isDark(row,col)){
              continue;
          }

          exportCtx.fillRect(
              qrOffsetX + col * moduleSize,
              qrOffsetY + row * moduleSize,
              moduleSize,
              moduleSize
          );

      }

  }

  exportCanvas.toBlob(blob => {

      if (blob) resolve(blob);
            else reject(new Error("PNG konnte nicht erstellt werden."));

  }, "image/png");

    });

}

generateBtn.addEventListener(
    "click",
    generateZip
);

async function generateZip(){

    if (!loadedData || isGenerating) {
  return;
    }

    try{

  generateBtn.disabled = true;

  isGenerating = true;
  fileInput.disabled = true;
  const entries = loadedData.slice();
  const filenames = new Set();
  const zip = new JSZip();

  for(let i=0; i<entries.length; i++){

      const entry = entries[i];

      statusDiv.textContent =
          `Generating ${i + 1} / ${entries.length}`;

      const image =
          await createQRImage(entry);

      const baseName =
          sanitizeFilename(
              entry.Titel ||
              entry.Interne_ID
          );
            let fileName = `${baseName}.png`;
            let suffix = 2;
            while (filenames.has(fileName.toLowerCase())) {
                fileName = `${baseName}_${suffix++}.png`;
            }
            filenames.add(fileName.toLowerCase());

      zip.file(
          fileName,
          image
      );

  }

  statusDiv.textContent =
      "Erzeuge das ZIP...";

  const zipBlob =
      await zip.generateAsync({
          type:"blob"
      });

  saveAs(
      zipBlob,
      "QR-Codes.zip"
  );

  statusDiv.textContent =
      `Done! Generated ${entries.length} QR codes.`;

    }
    catch(error){

  console.error(error);

  statusDiv.textContent = `Export fehlgeschlagen: ${error.message}`;

    }
    finally{

  isGenerating = false;
        fileInput.disabled = false;
        generateBtn.disabled = !loadedData;

    }

}



function clearQRCode() {
  canvas.width = Number.parseInt(sizeSlider.value, 10);
  canvas.height = canvas.width;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
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

function drawModule(shape, x, y, size) {
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
  const inputText = qrInput.value.trim();

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
    const qr = qrcode(0, "H");
    qr.addData(inputText);
    qr.make();

    const modules = qr.getModuleCount();
    const shape = shapeSelect.value;
    const finderShape = finderShapeSelect.value;
    const color = colorPicker.value;
    const finderColor = finderColorPicker.value;
    const size = Number.parseInt(sizeSlider.value, 10);

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

        drawModule(drawShape, x, y, moduleSize);
      }
    }

    if (customFinderStyles.has(finderShape)) {
      drawFinderPattern(finderShape, 0, 0);
      drawFinderPattern(finderShape, modules - 7, 0);
      drawFinderPattern(finderShape, 0, modules - 7);
    }

    downloadBtn.hidden = false;
  } catch (error) {
    clearQRCode();
    qrError.textContent = "Der Text konnte nicht als QR-Code erstellt werden. Bitte kürzen Sie die Eingabe.";
    console.error(error);
  }
}

function downloadQRCode() {
  if (qrInput.value.trim() === "") return;

  const title = qrTitle.textContent;
  const subtitle = qrSubtitle.textContent;

  const exportCanvas = document.createElement("canvas");
  const exportCtx = exportCanvas.getContext("2d");

  let headerHeight = 0;

  if (title) headerHeight += 50;
  if (subtitle) headerHeight += 30;

  headerHeight += 20;

  exportCanvas.width = canvas.width;
  exportCanvas.height = canvas.height + headerHeight;

  exportCtx.fillStyle = "white";
  exportCtx.fillRect(
    0,
    0,
    exportCanvas.width,
    exportCanvas.height
  );

  let y = 35;

  if (title) {
    exportCtx.fillStyle = "#222";
    exportCtx.font = "bold 28px Arial";
    exportCtx.textAlign = "center";
    exportCtx.fillText(
      title,
      exportCanvas.width / 2,
      y
    );
    y += 35;
  }

  if (subtitle) {
    exportCtx.fillStyle = "#666";
    exportCtx.font = "18px Arial";
    exportCtx.textAlign = "center";
    exportCtx.fillText(
      subtitle,
      exportCanvas.width / 2,
      y
    );
  }

  exportCtx.drawImage(
    canvas,
    0,
    headerHeight
  );

  const safeName = sanitizeFilename(title || "QR-code");

  const link = document.createElement("a");
  link.download = `${safeName}.png`;
  link.href = exportCanvas.toDataURL("image/png");
  link.click();
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

if (qrInput.value.trim()) {
  generateQRCode();
} else {
  clearQRCode();
}
})();
