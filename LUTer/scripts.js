// DOM Elements
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
const overlayColorBase = document.getElementById('overlayColorBase');

const pixelColors = {};
let overlayImage = new Image();
let overlayOpacity = 0;

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
        overlayColorBase.value = pixelColors[4];
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

function setupDownloadButton(canvas) {
    const downloadGridBtn = document.getElementById('downloadGridBtn');

    if (!downloadGridBtn) {
        console.error('Download button not found');
        return; // Exit if button is not found
    }

    // Remove any existing click event listeners
    downloadGridBtn.removeEventListener('click', handleDownload);

    // Add a new click event listener
    downloadGridBtn.addEventListener('click', () => handleDownload(canvas));
}

// Handle the download logic
function handleDownload(canvas) {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png'); // Generate a data URL with PNG format
    link.download = 'Grid.png'; // Set the download filename
    link.click(); // Trigger download
}

function loadOverlayImage() {
    // Get the base color from overlayColorBase input element
    let baseColor = overlayColorBase.value;
    if (!/^#[0-9A-Fa-f]{6}$/.test(baseColor)) {
        baseColor = '#FFFFFF'; // Default to white if baseColor is invalid
    }

    const tileSize = 1;  // Each tile is 1x1 pixels
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 640;
    canvas.height = 576;

    const tileValues = [
        [163, 140, 118, 140],
        [140, 112, 111, 112],
        [118, 111, 110, 111],
        [140, 112, 111, 112],
    ];

    // Function to convert a shade value to a color with transparency
    function shadeColorWithTransparency(baseColor, shade) {
        const r = parseInt(baseColor.slice(1, 3), 16);
        const g = parseInt(baseColor.slice(3, 5), 16);
        const b = parseInt(baseColor.slice(5, 7), 16);
        const alpha = shade / 255; // Transparency based on shade value (0 is fully transparent, 1 is opaque)
        return `rgba(${r}, ${g}, ${b}, ${1 - alpha})`; // Invert alpha for darker shades to be more transparent
    }

    // Create the repeating pattern with shades of the selected color
    for (let y = 0; y < canvas.height; y += tileSize) {
        for (let x = 0; x < canvas.width; x += tileSize) {
            const value = tileValues[Math.floor(y / tileSize) % 4][Math.floor(x / tileSize) % 4];
            ctx.fillStyle = shadeColorWithTransparency(baseColor, value);
            ctx.fillRect(x, y, tileSize, tileSize);
        }
    }

    // Set the generated canvas image to the overlay image
    overlayImage.src = canvas.toDataURL();
    overlayImage.onload = drawPlayfield;

    // Setup download button
    setupDownloadButton(canvas);
}

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
        overlayColorBase.value = pixelColors[4];
        loadOverlayImage();
    });
});

// Event Listeners
//----------------------

document.addEventListener('DOMContentLoaded', () => {
    // Initialize or call functions that depend on DOM elements
    loadOverlayImage();
});

transparencySlider.addEventListener('input', () => {
    overlayOpacity = transparencySlider.value / 100;
    drawPlayfield();
    transparencyValue.value = transparencySlider.value + "%";
});

overlayColorBase.onchange = function() {
    const selectedColor = this.value;
    loadOverlayImage();
};

paletteSelect.addEventListener('change', (event) => {
    applyPalette(event.target.value);
    loadOverlayImage();
});

downloadBtn.addEventListener('click', downloadImage);