const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const colorInputs = [
    document.getElementById('col1'),
    document.getElementById('col2'),
    document.getElementById('col3'),
    document.getElementById('col4')
];

const paletteSelect = document.getElementById('palette-select');
const filenameInput = document.getElementById('filename');
const downloadBtn = document.getElementById('download-btn');

const gridSelect = document.getElementById('grid-select');
const transparencySlider = document.getElementById('transparency-slider');
const transparencyValue = document.getElementById('transparency-value');
const downloadGridBtn = document.getElementById('downloadgrid-btn');

const pixelColors = {};
let overlayImage = new Image();
let overlayOpacity = 0.5;

function updatePaletteSelect() {
    paletteSelect.innerHTML = '<option value="">Select Palette</option>';

    for (const [paletteName] of Object.entries(paletteLookup)) {
        const option = document.createElement('option');
        option.value = paletteName;
        option.textContent = paletteName;
        paletteSelect.appendChild(option);
    }

    if (paletteSelect.options.length > 1) {
        paletteSelect.selectedIndex = 1;
        applyPalette(paletteSelect.value);
    }
}

function applyPalette(palette) {
    if (!palette) return;
    const colors = paletteLookup[palette];
    if (colors) {
        colorInputs.forEach((input, index) => {
            input.value = `#${colors[index]}`;
        });
        pixelColors[1] = colorInputs[0].value;
        pixelColors[2] = colorInputs[1].value;
        pixelColors[3] = colorInputs[2].value;
        pixelColors[4] = colorInputs[3].value;
        drawImage();
        drawPlayfield();
    }
}

function drawImage() {
    const colors = colorInputs.map(input => input.value);

    const sequence = [];
    for (let i = 0; i < 48; i++) sequence.push(0);
    for (let i = 0; i < 48; i++) sequence.push(1);
    for (let i = 0; i < 48; i++) sequence.push(2);
    for (let i = 0; i < 48; i++) sequence.push(3);

    const imageSize = 64;
    const gridSize = 8;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let offset = 0; offset < 64; offset++) {
        let startX = (offset % gridSize) * imageSize;
        let startY = Math.floor(offset / gridSize) * imageSize;

        for (let y = 0; y < imageSize; y++) {
            for (let x = 0; x < imageSize; x++) {
                let index = (x + y + offset) % sequence.length;
                ctx.fillStyle = colors[sequence[index]];
                ctx.fillRect(startX + x, startY + y, 1, 1);
            }
        }
    }
}

function downloadImage() {
    const filename = filenameInput.value.trim();
    const validFilename = filename.length > 0 ? `${filename}.png` : 'LUT.png';
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = validFilename;
    link.click();
}

function drawPlayfield() {
    const myCanvas = document.getElementById('myCanvas');
    const ctxMyCanvas = myCanvas.getContext('2d');
    const width = myCanvas.width;
    const height = myCanvas.height;

    const pixelSize = 8;  // Size of each "pixel" in the playfield

    // Clear the canvas
    ctxMyCanvas.clearRect(0, 0, width, height);

    // Create ImageData object
    const imageData = ctxMyCanvas.createImageData(width, height);

    let y = 0;
    pixelData.trim().split(';').forEach(row => {
        if (y >= height / pixelSize) return;
        let x = 0;
        row.trim().split(',').forEach(pixel => {
            const [value, count] = pixel.split('(');
            const numPixels = parseInt(count.replace(')', ''), 10);
            const color = pixelColors[value];
            const rgba = hexToRgba(color);

            for (let i = 0; i < numPixels; i++) {
                if (x + i < width / pixelSize) {
                    // Draw the 8x8 block
                    for (let dy = 0; dy < pixelSize; dy++) {
                        for (let dx = 0; dx < pixelSize; dx++) {
                            const pixelX = (x + i) * pixelSize + dx;
                            const pixelY = y * pixelSize + dy;
                            const index = (pixelY * width + pixelX) * 4;
                            imageData.data[index] = rgba.r;
                            imageData.data[index + 1] = rgba.g;
                            imageData.data[index + 2] = rgba.b;
                            imageData.data[index + 3] = rgba.a;
                        }
                    }
                }
            }
            x += numPixels;
        });
        y++;
    });

    // Put ImageData to canvas
    ctxMyCanvas.putImageData(imageData, 0, 0);

    // Draw the overlay grid image with transparency
    if (overlayImage.src && overlayImage.complete) {
        ctxMyCanvas.globalAlpha = overlayOpacity;
        ctxMyCanvas.drawImage(overlayImage, 0, 0, width, height);
        ctxMyCanvas.globalAlpha = 1.0; // Reset alpha to default
    }
}

function hexToRgba(color) {
    let r = 0, g = 0, b = 0, a = 255;
    if (color) {
        color = color.replace('#', '');
        r = parseInt(color.substr(0, 2), 16);
        g = parseInt(color.substr(2, 2), 16);
        b = parseInt(color.substr(4, 2), 16);
    }
    return { r, g, b, a };
}

function loadOverlayImage(imagePath) {
    if (imagePath) {
        overlayImage.src = `grids/${imagePath}`;  // Set the path to your grid images
        overlayImage.onload = drawPlayfield;
    } else {
        overlayImage.src = '';
        drawPlayfield(); // Redraw without overlay
    }
}

transparencySlider.addEventListener('input', () => {
    overlayOpacity = transparencySlider.value / 100;
    drawPlayfield();
    transparencyValue.value = transparencySlider.value + "%";
});

gridSelect.addEventListener('change', (event) => {
    if (gridSelect.checked) {
        loadOverlayImage("grid.png");
    } else {
        loadOverlayImage("");
    }
});

updatePaletteSelect();
drawImage();
drawPlayfield();

colorInputs.forEach((input) => {
    input.addEventListener('change', () => {
        pixelColors[1] = colorInputs[0].value;
        pixelColors[2] = colorInputs[1].value;
        pixelColors[3] = colorInputs[2].value;
        pixelColors[4] = colorInputs[3].value;
        drawImage();
        drawPlayfield();
    });
});

paletteSelect.addEventListener('change', (event) => {
    applyPalette(event.target.value);
});

downloadBtn.addEventListener('click', downloadImage);

downloadBtn.addEventListener('click', function() {

});