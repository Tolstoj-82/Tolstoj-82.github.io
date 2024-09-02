let intervalId;

// Get some DOM Elements
const slider = document.getElementById('slider');
const sliderValue = document.getElementById('sliderValue');

// let dynamically assign thresholds for the values 
function setGreyValues(values) {
    // Ensure values are sorted and unique
    const sortedValues = Array.from(new Set(values)).sort((a, b) => a - b);

    // Create a mapping based on sorted values
    const greyToValue = {};
    sortedValues.forEach((value, index) => {
        greyToValue[value] = sortedValues.length - 1 - index;
    });

    return {
        greyValues: sortedValues,
        greyToValue: greyToValue
    };
}

const { greyValues, greyToValue } = setGreyValues([32, 96, 160, 224]);

// Populate the camera selection dropdown
async function getCameras() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        const cameraSelect = document.getElementById('cameraSelect');

        // Populate the dropdown with available cameras
        videoDevices.forEach((device, index) => {
            const option = document.createElement('option');
            option.value = device.deviceId;
            option.text = device.label || `Camera ${index + 1}`;
            cameraSelect.appendChild(option);
        });

        // If there are no devices, display a message
        if (videoDevices.length === 0) {
            const option = document.createElement('option');
            option.text = 'No cameras found';
            cameraSelect.appendChild(option);
            cameraSelect.disabled = true;
        }
    } catch (error) {
        console.error('Error fetching devices: ', error);
    }
}

// Start the selected webcam
async function startWebcam() {
    const cameraSelect = document.getElementById('cameraSelect');
    const selectedCameraId = cameraSelect.value;

    if (!selectedCameraId) return;

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: selectedCameraId } }
        });
        const video = document.getElementById('video');
        video.srcObject = stream;
    } catch (error) {
        console.error('Error accessing webcam: ', error);
    }
}

// Map a value to the nearest grey value
function mapToNearestGrey(value) {
    // Find the nearest grey value
    return greyValues.reduce((prev, curr) => Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev);
}

const lookUpPixels = [1, 8, 12, 18, 27]; // Positions of pixels to check
const minoMap = {
    "33222": "L",
    "33130": "J",
    "33221": "Itop", // I vertical
    "23111": "Imiddle",
    "31212": "Ibottom",
    "33111": "Ileft", // I horizontal
    "31111": "Icenter",
    "23221": "Iright",
    "33033": "O",
    "33113": "Z",
    "33230": "S",
    "33101": "T"
};

// Extract specific pixel values from the 8x8 tile
function extractPixelValues(pixels) {
    const pixelValues = [1, 8, 12, 18, 27].map(index => {
        const idx = index * 4;
        const r = pixels[idx];
        const g = pixels[idx + 1];
        const b = pixels[idx + 2];
        const grey = Math.round((r + g + b) / 3);
        return greyToValue[mapToNearestGrey(grey)] || 0; // Default to 0 if not mapped
    });
    
    return pixelValues.join('');
}

// Calculate and map pixel values to the tile type
function determineTileType(pixelValues) {
    return minoMap[pixelValues] || '0';
}

// Capture frame and update grid images and text area
function updateGridImages() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    // Draw the current video frame to the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Grid dimensions
    const gridRows = 18;
    const blockSize = 8; // Each block is 8x8 pixels

    // Container for grid blocks
    const gridContainer = document.querySelector('.grid-container');
    gridContainer.innerHTML = ''; // Clear previous grid blocks

    // Array to store grey values
    let greyValuesArray = [];

    // Iterate over the required columns (3rd to 12th, i.e., index 2 to 11)
    for (let row = 0; row < gridRows; row++) {
        for (let col = 2; col <= 11; col++) { // Start from 2, end at 11 (3rd to 12th columns)
            // Calculate the top-left corner of each square
            const x = col * blockSize;
            const y = row * blockSize;

            // Get pixel data for the current block (8x8 pixels)
            const imageData = context.getImageData(x, y, blockSize, blockSize);
            const pixelValues = extractPixelValues(imageData.data);
            const tileType = determineTileType(pixelValues);

            // Get the corresponding display number and image for the tile type
            const imageUrl = `tiles/${tileType}.png`;

            // Create a visual representation of the block with image
            const block = document.createElement('div');
            block.className = 'grid-block';
            block.style.backgroundImage = `url(${imageUrl})`; // Set the image as the background
            gridContainer.appendChild(block);

            // Add tile type to array
            greyValuesArray.push(tileType);
        }
    }

    // Format grey values as comma-separated, breaking after every 10 values
    const formattedValues = greyValuesArray.reduce((acc, value, index) => {
        if (index > 0 && index % 10 === 0) acc += '\n';
        acc += value + ',';
        return acc;
    }, '').slice(0, -1); // Remove the trailing comma

    // Update the text area with formatted grey values
    const textArea = document.getElementById('textArea');
    textArea.value = formattedValues;
}

// Function to dynamically adjust the interval
function adjustInterval() {
    // Clear the existing interval
    clearInterval(intervalId);

    // Get the slider value and calculate the new interval time
    const intervalTime = 1000 / slider.value; // Example: dynamically adjust interval based on the slider value

    // Set a new interval with the updated time
    intervalId = setInterval(updateGridImages, intervalTime);

    sliderValue.innerHTML = `${slider.value} FPS`;
}

// Initial setup
updateGridImages();
adjustInterval();

// Add event listener to the slider to adjust the interval on change
slider.addEventListener('input', () => {
    adjustInterval(); // Adjust interval when slider changes
});

// Load available cameras on page load
window.onload = getCameras;
