function generateQRCode() {
//const inputText = document.getElementById("qrInput").value.trim();
const inputText = document.getElementById("querystring").innerText.trim();

const downloadBtn = document.getElementById("downloadBtn");

// Hide download button if input is empty
if (inputText === "") {
    downloadBtn.style.display = "none";
} else {
    downloadBtn.style.display = "inline-block";
}
const qr = qrcode(0, "H");
qr.addData(inputText);
qr.make();
const modules = qr.getModuleCount();
const canvas = document.getElementById("qrCanvas");
const ctx = canvas.getContext("2d");
if (!ctx) {
    console.error("Failed to get canvas context.");
    return;
}
const shape = document.getElementById("shapeSelect").value;
const finderShape = document.getElementById("finderShapeSelect").value;
const color = document.getElementById("colorPicker").value;
const finderColor = document.getElementById("finderColorPicker").value;
const size = parseInt(document.getElementById("sizeSlider").value, 10);
canvas.width = size;
canvas.height = size;
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);
const moduleSize = Math.floor((size * 0.8) / modules);
const actualQRSize = moduleSize * modules;
const padding = Math.floor((canvas.width - actualQRSize) / 2);
for (let row = 0; row < modules; row++) {
    for (let col = 0; col < modules; col++) {
    if (qr.isDark(row, col)) {
        const x = padding + col * moduleSize;
        const y = padding + row * moduleSize;
        const isFinderPattern =
        (row < 7 && col < 7) ||
        (row < 7 && col > modules - 8) ||
        (row > modules - 8 && col < 7);
        ctx.fillStyle = isFinderPattern ? finderColor : color;
        const drawShape = isFinderPattern ? finderShape : shape;
        if (drawShape === "square") {
        ctx.fillRect(x, y, moduleSize, moduleSize);
        } else if (drawShape === "circle") {
        ctx.beginPath();
        ctx.arc(
            x + moduleSize / 2,
            y + moduleSize / 2,
            moduleSize / 2,
            0,
            Math.PI * 2
        );
        ctx.fill();
        }
    }
    }
}
}

function downloadQRCode() {
const inputText = document.getElementById("qrInput").value.trim();
if (inputText === "") return; // Prevent download if input is empty

    const canvas = document.getElementById("qrCanvas");
    const link = document.createElement("a");
    link.download = `QR-${inputText}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
}

document.addEventListener("DOMContentLoaded", generateQRCode);