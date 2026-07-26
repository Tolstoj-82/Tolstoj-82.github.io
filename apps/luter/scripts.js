'use strict';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const playfieldCanvas = document.getElementById('myCanvas');
const playfieldContext = playfieldCanvas.getContext('2d');
const paletteSelect = document.getElementById('palette-select');
const filenameInput = document.getElementById('filename');
const transparencySlider = document.getElementById('transparency-slider');
const transparencyValue = document.getElementById('transparency-value');
const overlayColorBase = document.getElementById('overlayColorBase');
const colorInputs = ['col1', 'col2', 'col3', 'col4'].map(id => document.getElementById(id));

const pixelColors = {};
const overlayImage = new Image();
const overlayCanvas = document.createElement('canvas');
const overlayContext = overlayCanvas.getContext('2d');
const gridExportCanvas = document.createElement('canvas');
const gridExportContext = gridExportCanvas.getContext('2d');
overlayCanvas.width = 640;
overlayCanvas.height = 576;
gridExportCanvas.width = overlayCanvas.width;
gridExportCanvas.height = overlayCanvas.height;
let overlayOpacity = 0;
let gridFileHandle;
let gridFileName;
let gridSaveInProgress = false;

function updatePaletteSelect() {
    paletteSelect.replaceChildren();
    for (const [section, palettes] of Object.entries(paletteLookup)) {
        const optgroup = document.createElement('optgroup');
        optgroup.label = section;
        for (const paletteName of Object.keys(palettes)) optgroup.append(new Option(paletteName, paletteName));
        paletteSelect.append(optgroup);
    }
    if (paletteSelect.value) applyPalette(paletteSelect.value);
}

function applyPalette(paletteName) {
    if (!paletteName) return;
    let colors;
    for (const palettes of Object.values(paletteLookup)) {
        if (Object.hasOwn(palettes, paletteName)) {
            colors = palettes[paletteName];
            break;
        }
    }
    if (!colors) return;
    colorInputs.forEach((input, index) => { input.value = `#${colors[index]}`; });
    syncPixelColors();
    overlayColorBase.value = pixelColors[4];
    drawImage();
    loadOverlayImage();
}

function syncPixelColors() {
    colorInputs.forEach((input, index) => { pixelColors[index + 1] = input.value; });
}

// Keep the original LUT algorithm byte-for-byte in its color sequencing.
function drawImage() {
    const colors = colorInputs.map(input => input.value);
    const sequence = [];
    for (let color = 0; color < 4; color += 1) {
        for (let count = 0; count < 48; count += 1) sequence.push(color);
    }
    const imageSize = 64;
    const gridSize = 8;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let offset = 0; offset < 64; offset += 1) {
        const startX = (offset % gridSize) * imageSize;
        const startY = Math.floor(offset / gridSize) * imageSize;
        for (let y = 0; y < imageSize; y += 1) {
            for (let x = 0; x < imageSize; x += 1) {
                ctx.fillStyle = colors[sequence[(x + y + offset) % sequence.length]];
                ctx.fillRect(startX + x, startY + y, 1, 1);
            }
        }
    }
}

function drawPlayfield() {
    const width = playfieldCanvas.width;
    const height = playfieldCanvas.height;
    const pixelSize = 8;
    const imageData = playfieldContext.createImageData(width, height);
    let y = 0;
    pixelData.trim().split(';').forEach(row => {
        if (y >= height / pixelSize) return;
        let x = 0;
        row.trim().split(',').forEach(pixel => {
            const [value, rawCount] = pixel.split('(');
            const count = Number.parseInt(rawCount.replace(')', ''), 10);
            const rgba = hexToRgba(pixelColors[value]);
            for (let i = 0; i < count; i += 1) {
                if (x + i >= width / pixelSize) continue;
                for (let dy = 0; dy < pixelSize; dy += 1) {
                    for (let dx = 0; dx < pixelSize; dx += 1) {
                        const pixelX = (x + i) * pixelSize + dx;
                        const pixelY = y * pixelSize + dy;
                        const index = (pixelY * width + pixelX) * 4;
                        imageData.data.set([rgba.r, rgba.g, rgba.b, 255], index);
                    }
                }
            }
            x += count;
        });
        y += 1;
    });
    playfieldContext.putImageData(imageData, 0, 0);
    if (overlayImage.complete && overlayImage.src) {
        playfieldContext.globalAlpha = overlayOpacity;
        playfieldContext.drawImage(overlayImage, 0, 0, width, height);
        playfieldContext.globalAlpha = 1;
    }
}

function hexToRgba(color = '#000000') {
    const hex = color.replace('#', '');
    return {
        r: Number.parseInt(hex.slice(0, 2), 16),
        g: Number.parseInt(hex.slice(2, 4), 16),
        b: Number.parseInt(hex.slice(4, 6), 16)
    };
}

function loadOverlayImage() {
    const baseColor = /^#[0-9a-f]{6}$/i.test(overlayColorBase.value) ? overlayColorBase.value : '#ffffff';
    const { r, g, b } = hexToRgba(baseColor);
    const tileValues = [[163,140,118,140],[140,112,111,112],[118,111,110,111],[140,112,111,112]];
    const tile = document.createElement('canvas');
    tile.width = tile.height = 4;
    const tileContext = tile.getContext('2d');
    tileValues.forEach((row, y) => row.forEach((shade, x) => {
        tileContext.fillStyle = `rgba(${r}, ${g}, ${b}, ${1 - shade / 255})`;
        tileContext.fillRect(x, y, 1, 1);
    }));
    overlayContext.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    overlayContext.fillStyle = overlayContext.createPattern(tile, 'repeat');
    overlayContext.fillRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    overlayImage.onload = drawPlayfield;
    overlayImage.src = overlayCanvas.toDataURL('image/png');
}

function canvasToBlob(source) {
    return new Promise((resolve, reject) => source.toBlob(blob => blob ? resolve(blob) : reject(new Error('PNG creation failed.')), 'image/png'));
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = Object.assign(document.createElement('a'), { href: url, download: filename });
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function cleanLutName() {
    return filenameInput.value.trim().replace(/[<>:"/\\|?*]/g, '-') || 'LUT';
}

async function saveGrid() {
    if (gridSaveInProgress) return;
    gridSaveInProgress = true;
    const saveButton = document.getElementById('downloadGridBtn');
    saveButton.disabled = true;
    try {
        gridExportContext.clearRect(0, 0, gridExportCanvas.width, gridExportCanvas.height);
        gridExportContext.globalAlpha = overlayOpacity;
        gridExportContext.drawImage(overlayCanvas, 0, 0);
        gridExportContext.globalAlpha = 1;
        const blob = await canvasToBlob(gridExportCanvas);
        const desiredGridName = `Grid_${cleanLutName()}.png`;
        if ('showSaveFilePicker' in window) {
            if (gridFileName !== desiredGridName) gridFileHandle = undefined;
            gridFileHandle ||= await window.showSaveFilePicker({
                suggestedName: desiredGridName,
                types: [{ description: 'PNG image', accept: { 'image/png': ['.png'] } }]
            });
            gridFileName = desiredGridName;
            const writable = await gridFileHandle.createWritable();
            await writable.write(blob);
            await writable.close();
        } else {
            downloadBlob(blob, desiredGridName);
        }
    } catch (error) {
        if (error.name !== 'AbortError') console.error('Grid save failed:', error);
    } finally {
        gridSaveInProgress = false;
        saveButton.disabled = false;
    }
}

async function downloadImage() {
    downloadBlob(await canvasToBlob(canvas), `${cleanLutName()}.png`);
}

colorInputs.forEach(input => input.addEventListener('input', () => {
    syncPixelColors();
    overlayColorBase.value = pixelColors[4];
    drawImage();
    loadOverlayImage();
}));
transparencySlider.addEventListener('input', () => {
    overlayOpacity = Number(transparencySlider.value) / 100;
    transparencyValue.value = `${transparencySlider.value}%`;
    drawPlayfield();
});
overlayColorBase.addEventListener('input', loadOverlayImage);
paletteSelect.addEventListener('change', event => applyPalette(event.target.value));
document.getElementById('download-btn').addEventListener('click', downloadImage);
document.getElementById('downloadGridBtn').addEventListener('click', saveGrid);

syncPixelColors();
updatePaletteSelect();
