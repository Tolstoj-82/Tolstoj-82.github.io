// DOM Elements
const device_selector   = document.getElementById('device_selector');
const camera_feed       = document.getElementById('camera_feed');

// Variables
let currentStream       = null;
const tileWidth         = 8;
const tileHeight        = 8;
const canvasWidth       = 160;
const canvasHeight      = 144;
const tilesX            = canvasWidth / tileWidth; // 20 x 18 tiles
const tilesY            = canvasHeight / tileHeight;
let tileArray           = []; // tileArray[tileNr][pixelNr] (2D array)

//---------------------------------------------
// FUNCTIONS
//---------------------------------------------

// Function to get connected video input devices (cameras)
async function getConnectedDevices(type) {
    let stream;

    try {
        // Request permission to access video devices
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
    } catch (err) {
        console.log(`Warning: could not open default capture device: ${err.message}`);
    }

    // Filter devices by the specified type (e.g., 'videoinput' for cameras)
    const devices = (await navigator.mediaDevices.enumerateDevices()).filter(
        device => device.kind === type && device.deviceId
    );

    if (stream) stream.getTracks()[0].stop();

    return devices;
}

// Function to update the device list in the dropdown
function updateDeviceList(devices) {
    // Add default option
    device_selector.innerHTML = '<option value="">-</option>'; // Reset with default option
    devices.forEach(camera => {
        const camera_option = document.createElement('option');
        camera_option.text = camera.label.replace(/\s*\([0-9a-f]{4}:[0-9a-f]{4}\)\s*$/, ''); // Clean label
        camera_option.value = camera.deviceId;

        device_selector.appendChild(camera_option);
    });
}

// Function to start the webcam when a camera is selected
async function startWebcam() {
    const selectedDeviceId = device_selector.value;
    if (selectedDeviceId && navigator.mediaDevices.getUserMedia) {
        
        // Stop the current stream if already running
        if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop());
        }

        try {
            
            // Get the video stream for the selected device
            currentStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    deviceId: { exact: selectedDeviceId }
                }
            });
            
            // Set the video source to the camera feed
            camera_feed.srcObject = currentStream;
            camera_feed.style.display = 'block';

            // Start processing video frames
            camera_feed.addEventListener('play', () => {
                processVideoFrames();
            });
        } catch (err) {
            console.error(`Error accessing camera: ${err}`);
        }
    }
}

// Get the closest grayscale index
// returns 0,1,2 or 3
function getClosestColorIndex(value) {
    const grayscaleLevels = [32, 96, 160, 224];
    let closestIndex = 0;
    let minDiff = Infinity;

    for (let i = 0; i < grayscaleLevels.length; i++) {
        const diff = Math.abs(grayscaleLevels[i] - value);
        if (diff < minDiff) {
            minDiff = diff;
            closestIndex = i;
        }
    }

    return closestIndex;
}

// Process video frames and store pixel indices in a 2D array
function processVideoFrames() {
    if (camera_feed.paused || camera_feed.ended) {
        return;
    }

    // Create a canvas to draw the video frame (not visible)
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvasWidth;
    tempCanvas.height = canvasHeight;
    const tempContext = tempCanvas.getContext('2d');

    // Draw the current frame from the video element to the temporary canvas
    tempContext.drawImage(camera_feed, 0, 0, canvasWidth, canvasHeight);

    // Get the image data from the temporary canvas
    const imageData = tempContext.getImageData(0, 0, canvasWidth, canvasHeight);
    const data = imageData.data;

    // Reset the tileArray
    tileArray = [];

    // Convert the image to indexed colors and store only specific tiles in the tileArray
    for (let tileY = 0; tileY < tilesY; tileY++) {
        
        // Start processing from the 3rd column and end at the 13th column
        for (let tileX = 0; tileX < tilesX; tileX++) {
            
            // Calculate the tile number
            const tileNumber = tileY * tilesX + tileX;

            // columns 3 to 13 = playfield
            if(tileX >= 2 && tileX < 12){
                
                // Process tiles in the specified range
                let tileIndex = [];
                for (let y = 0; y < tileHeight; y++) {
                    for (let x = 0; x < tileWidth; x++) {
                        const i = ((tileY * tileHeight + y) * canvasWidth + (tileX * tileWidth + x)) * 4;
                        const r = data[i];     // R
                        const g = data[i + 1]; // G
                        const b = data[i + 2]; // B
                        const avg = (r + g + b) / 3; // greyscale
                        
                        // Find the closest grayscale index
                        const index = getClosestColorIndex(avg);
                        
                        // Store the index value in the tile index array
                        tileIndex.push(index);
                    }
                }
                
                // Store the tile index array in the tileArray
                tileArray.push(tileIndex);
            }
        }
    }
}

//---------------------------------------------
// STARTS HERE
//---------------------------------------------

// Continue processing the next frame
requestAnimationFrame(processVideoFrames);

// Function to refresh the list of devices
async function resetDevices() {
    const devicesList = await getConnectedDevices('videoinput');
    updateDeviceList(devicesList);
}

// Listen for changes in connected devices
navigator.mediaDevices.addEventListener('devicechange', resetDevices);

// Initial call to populate the device list
resetDevices();