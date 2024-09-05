let intervalId;
let frameState = "";
let recordingFrameNumber = 0; // Frame counter for recording
let isRecording = false;
let recordingData = [];
let lastFrameContent = '';
let frameStart = 0;

const scaleFactor = 8;
let scheme = "GB";

// DOM Elements
const slider = document.getElementById('slider');
const sliderValue = document.getElementById('sliderValue');
const gridContainer = document.getElementById('grid-container');
const recordButton = document.getElementById('recordButton');
const textArea = document.getElementById('textArea');
const recordingTextArea = document.getElementById('recording'); // Updated to "recording"
const cameraSelect = document.getElementById('cameraSelect');
const videoElement = document.getElementById('video'); // Video element for webcam feed

//---------------------------------------------------------------
// FUNCTIONS
//---------------------------------------------------------------

function setGreyValues(values) {
    const sortedValues = Array.from(new Set(values)).sort((a, b) => a - b);
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

function mapToNearestGrey(value) {
    return greyValues.reduce((prev, curr) => Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev);
}

const lookUpPixels = [1, 8, 15, 57, 11, 19, 27, 35]; // Positions of pixels to check
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

function extractPixelValues(pixels) {
    const pixelValues = lookUpPixels.map(index => {
        const idx = index * 4;
        const r = pixels[idx];
        const g = pixels[idx + 1];
        const b = pixels[idx + 2];
        const grey = Math.round((r + g + b) / 3);
        return greyToValue[mapToNearestGrey(grey)] || 0;
    });
    return pixelValues.join('');
}

function determineTileType(pixelValues) {
    return minoMap[String(pixelValues)] || '0';
}

function updateGridImages() {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    // Ensure frameStateElement exists
    const frameStateElement = document.getElementById('frameState');
    if (frameStateElement) {
        frameState = (frameState === "|") ? " " : "|";
        frameStateElement.innerHTML = frameState;
    } else {
        console.error('Element with ID "frameState" not found.');
    }

    if (isRecording) {
        recordingFrameNumber++; // Increment recording frame counter
    }

    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    context.imageSmoothingEnabled = false;

    const gridRows = 18;
    const blockSize = 8;

    gridContainer.innerHTML = '';

    // Change the background color based on the scheme
    if (scheme === "GB") {
        gridContainer.style.backgroundColor = 'white'; // Set background to white for "GB"
    } else {
        gridContainer.style.backgroundColor = 'black'; // Set background to black for other schemes
    }

    let greyValuesArray = [];

    for (let row = 0; row < gridRows; row++) {
        for (let col = 2; col < 12; col++) {
            const x = col * blockSize * scaleFactor;
            const y = row * blockSize * scaleFactor;

            const imageData = context.getImageData(x, y, blockSize * scaleFactor, blockSize * scaleFactor);

            const relevantPixels = lookUpPixels.map(index => {
                const pixelRow = Math.floor(index / blockSize);
                const pixelCol = index % blockSize;
                const px = pixelCol * scaleFactor + 4;
                const py = pixelRow * scaleFactor + 4;

                const pixelIndex = ((py * (blockSize * scaleFactor)) + px) * 4;
                const r = imageData.data[pixelIndex];
                const g = imageData.data[pixelIndex + 1];
                const b = imageData.data[pixelIndex + 2];
                const grey = Math.round((r + g + b) / 3);
                return grey;
            });

            const pixelValues = relevantPixels.map(grey => greyToValue[mapToNearestGrey(grey)] || 0);
            const pixelValuesStr = pixelValues.join('');
            const tileType = determineTileType(pixelValuesStr);

            const imageUrl = `tiles/${scheme}/${tileType}.png`;

            const block = document.createElement('div');
            block.className = 'grid-block';
            block.style.backgroundImage = `url(${imageUrl})`;
            gridContainer.appendChild(block);

            greyValuesArray.push(tileType);
        }
    }

    const formattedValues = greyValuesArray.reduce((acc, value, index) => {
        if (index > 0 && index % 10 === 0) acc += '\n';

        switch(value) {
            case "Itop": value      = "1"; break;
            case "Icenter": value   = "2"; break;
            case "Ibottom": value   = "3"; break;
            case "Ileft": value     = "4"; break;
            case "Imiddle": value   = "5"; break;
            case "Iright": value    = "6"; break;
        }

        acc += value + ',';
        return acc;
    }, '').slice(0, -1);

    if (textArea) {
        textArea.value = formattedValues;
    } else {
        console.error('Textarea with ID "textArea" not found.');
    }

    if (isRecording) {
        const currentFrameContent = formattedValues;

        if (currentFrameContent !== lastFrameContent) {
            if (recordingData.length > 0) {
                recordingData[recordingData.length - 1].end = recordingFrameNumber - 1;
            }

            recordingData.push({
                start: recordingFrameNumber,
                end: recordingFrameNumber,
                content: currentFrameContent
            });

            lastFrameContent = currentFrameContent;
        } else {
            recordingData[recordingData.length - 1].end = recordingFrameNumber;
        }

        saveRecording(); // Continuously update recording
    }
}

function adjustInterval() {
    clearInterval(intervalId); // Clears the existing interval.
    const intervalTime = 1000 / slider.value;
    intervalId = setInterval(updateGridImages, intervalTime);
    if (sliderValue) {
        sliderValue.innerHTML = `${slider.value} FPS`;
    } else {
        console.error('Element with ID "sliderValue" not found.');
    }
}

function toggleRecording() {
    isRecording = !isRecording;

    if (isRecording) {
        recordingFrameNumber = 1; // Start the recording frame counter at 1
        recordButton.textContent = 'Stop Recording';
        recordingData = [];
        frameStart = recordingFrameNumber;
    } else {
        recordButton.textContent = 'Start Recording';
        saveRecording(); // Final save when stopping
    }
}

// Function to normalize and flatten comma-separated content
function normalizeContent(input) {
    // Remove all whitespace and split by commas
    const flattened = input.replace(/\s+/g, '').split(',');
    return flattened.join('');
}

// Function to compress the normalized content
function compressContent(content) {
    let compressed = '';
    let lastChar = '';
    let count = 0;

    for (const char of content) {
        if (char === lastChar) {
            count++;
        } else {
            if (lastChar) {
                compressed += (count > 1 ? `${lastChar}(${count}),` : `${lastChar},`);
            }
            lastChar = char;
            count = 1;
        }
    }

    if (lastChar) {
        compressed += (count > 1 ? `${lastChar}(${count}),` : `${lastChar},`);
    }

    // Remove trailing comma if there is one
    if (compressed.endsWith(',')) {
        compressed = compressed.slice(0, -1);
    }

    return compressed;
}

function saveRecording() {
    const recordingText = recordingData.map(({ start, end, content }) => {
        const compressedContent = compressContent(normalizeContent(content));
        return start === end
            ? `{frame#${start}}\n[${compressedContent}]`
            : `{frames#${start}..#${end}}\n[${compressedContent}]`;
    }).join('\n\n');

    // Update the textarea with the compressed content
    if (recordingTextArea) {
        recordingTextArea.value = recordingText;
    } else {
        console.error('Textarea with ID "recording" not found.');
    }
    document.getElementById("recordingFrame").innerHTML = "Frame Nr: " + recordingFrameNumber;
}

async function getCameras() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');

        if (cameraSelect) {
            cameraSelect.innerHTML = ''; // Clear previous options

            videoDevices.forEach((device, index) => {
                const option = document.createElement('option');
                option.value = device.deviceId;
                option.textContent = device.label || `Camera ${index + 1}`;
                cameraSelect.appendChild(option);
            });

            // Ensure an empty option for "Select Camera"
            const selectOption = document.createElement('option');
            selectOption.value = '';
            selectOption.textContent = 'Select Camera';
            cameraSelect.insertBefore(selectOption, cameraSelect.firstChild);
        } else {
            console.error('Select element with ID "cameraSelect" not found.');
        }
    } catch (error) {
        console.error('Error accessing media devices:', error);
    }
}

async function startWebcam() {
    const selectedDeviceId = cameraSelect.value;

    if (selectedDeviceId) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: selectedDeviceId }
            });

            videoElement.srcObject = stream;
        } catch (error) {
            console.error('Error accessing webcam:', error);
        }
    }
}

recordButton.addEventListener('click', toggleRecording);
slider.addEventListener('input', adjustInterval);
window.addEventListener('load', async () => {
    await getCameras();
    adjustInterval(); // Set initial interval
});

// Event listener for scheme selection change
schemeSelect.addEventListener('change', function () {
    scheme = this.value; // Update the scheme variable to the selected value
    updateGridImages(); // Optionally update the grid images immediately after changing the scheme
});
