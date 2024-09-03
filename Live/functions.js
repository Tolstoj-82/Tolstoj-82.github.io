let intervalId;
let frameNumber;
frameNumber = 0;
scaleFactor = 8;
scheme = "GB";

// Get some DOM Elements
const slider = document.getElementById('slider');
const sliderValue = document.getElementById('sliderValue');
const gridContainer = document.querySelector('.grid-container');

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

function updateScheme() {
    // Get the dropdown element
    const dropdown = document.getElementById('scheme');
    scheme = dropdown.value;
    
    // Update the background color based on the selected value
    if (scheme === 'GB') {
        gridContainer.style.backgroundColor = '#FFFFFF';
    } else if (scheme === 'NES') {
        gridContainer.style.backgroundColor = '#000000';
    }
}

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

const lookUpPixels = [1,8,15,57,11,19,27,35]; // Positions of pixels to check
const minoMap = {
    "33332222": "L",
    "33331300": "J",
    "33311111": "Itop",
    "13311111": "Icenter",
    "13332121": "Ibottom",
    "33131111": "Ileft",
    "32131111": "Imiddle",
    "32331112": "Iright",
    "33330333": "O",
    "33331133": "Z",
    "33332300": "S",
    "33331011": "T"
};

// Extract specific pixel values from the 8x8 tile based on lookUpPixels
function extractPixelValues(pixels) {
    // Adjust the function to use lookUpPixels for specific positions within the tile
    const pixelValues = lookUpPixels.map(index => {
        const idx = index * 4; // Each pixel has 4 values: RGBA
        const r = pixels[idx];
        const g = pixels[idx + 1];
        const b = pixels[idx + 2];
        const grey = Math.round((r + g + b) / 3); // Calculate grey value
        return greyToValue[mapToNearestGrey(grey)] || 0; // Map to nearest grey value or default to 0
    });
    
    return pixelValues.join('');
}

// Calculate and map pixel values to the tile type
function determineTileType(pixelValues) {
    // Ensure pixelValues is a string
    const pixelValuesStr = String(pixelValues);
    return minoMap[pixelValuesStr] || '0';
}

function updateGridImages() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    frameNumber++;
    if (frameNumber == 255) frameNumber = 0;

    document.getElementById('frameCounter').innerHTML = "Frame: " + frameNumber.toString(16).toUpperCase().padStart(2, '0');

    // Draw the current video frame to the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    context.imageSmoothingEnabled = false;

    // Grid dimensions
    const gridRows = 18;
    const blockSize = 8;

    // Container for grid blocks
    const gridContainer = document.querySelector('.grid-container');
    gridContainer.innerHTML = ''; // Clear previous grid blocks

    // Array to store grey values
    let greyValuesArray = [];
    let lastRowPixelValues = [];

    // Iterate over the grid rows and the specific columns (3rd to 12th)
    for (let row = 0; row < gridRows; row++) {
        for (let col = 2; col < 12; col++) {
            // Calculate the top-left corner of each relevant 8x8 area in the larger canvas
            const x = col * blockSize * scaleFactor;
            const y = row * blockSize * scaleFactor;

            // Get pixel data for the current block
            const imageData = context.getImageData(x, y, blockSize * scaleFactor, blockSize * scaleFactor);

            // Highlight and extract the grey values from the specific lookup pixels
            const relevantPixels = lookUpPixels.map(index => {
                const pixelRow = Math.floor(index / blockSize);
                const pixelCol = index % blockSize;
                const px = pixelCol * scaleFactor + 4; // Adjust x coordinate
                const py = pixelRow * scaleFactor + 4; // Adjust y coordinate
            
                const pixelIndex = ((py * (blockSize * scaleFactor)) + px) * 4;
                const r = imageData.data[pixelIndex];
                const g = imageData.data[pixelIndex + 1];
                const b = imageData.data[pixelIndex + 2];
                const grey = Math.round((r + g + b) / 3);
                return grey;
            });            

            // Map the grey values to nearest defined thresholds and determine tile type
            const pixelValues = relevantPixels.map(grey => greyToValue[mapToNearestGrey(grey)] || 0);
            const pixelValuesStr = pixelValues.join('');
            const tileType = determineTileType(pixelValuesStr);

            const imageUrl = `tiles/${scheme}/${tileType}.png`;

            // Create a visual representation of the block with image
            const block = document.createElement('div');
            block.className = 'grid-block';
            block.style.backgroundImage = `url(${imageUrl})`;
            gridContainer.appendChild(block);

            greyValuesArray.push(tileType);
            /*
            // Store pixel values for the last row
            if (row === gridRows - 1) {
                lastRowPixelValues.push(pixelValuesStr);
            }*/
        }
    }

    // Format grey values as comma-separated, breaking after every 10 values
    const formattedValues = greyValuesArray.reduce((acc, value, index) => {
        if (index > 0 && index % 10 === 0) acc += '\n';
        
        // this is ugly AF!
        if(value == "Itop") value = "1";
        if(value == "Icenter") value = "2";
        if(value == "Ibottom") value = "3";
        if(value == "Ileft") value = "4";
        if(value == "Imiddle") value = "5";
        if(value == "Iright") value = "6";

        acc += value + ',';
        return acc;
    }, '').slice(0, -1);

    const textArea = document.getElementById('textArea');
    //textArea.value = `Last Row Pixel Values:\n${lastRowPixelValues.join('\n')}\n\nFormatted Grey Values:\n${formattedValues}`;
    textArea.value = `${formattedValues}`;
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