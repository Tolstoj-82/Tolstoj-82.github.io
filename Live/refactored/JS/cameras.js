// DOM Elements
const device_selector   = document.getElementById('device_selector');
const camera_feed       = document.getElementById('camera_feed');
const color_container   = document.getElementById('color-container');

// Variables
let currentStream       = null;
const tileWidth         = 8;
const tileHeight        = 8;
const canvasWidth       = 160;
const canvasHeight      = 144;
const tilesX            = canvasWidth / tileWidth; // 20 x 18 tiles
const tilesY            = canvasHeight / tileHeight;
let tileArray           = []; // tileArray[tileNr][pixelNr] (2D array)
let calibrated          = false;

const grayscaleLevels = [0, 0, 0, 0];

//---------------------------------------------------------------------------

const minoLookUpPixels      = [1,  8, 15, 57, 11, 19, 27, 35];
const numberLookUpPixels    = [9, 10, 13, 17, 18, 20, 21, 22, 30, 49];

// 00 01 02 03 04 05 06 07
// 08 09 10 11 12 13 14 15
// 16 17 18 19 20 21 22 23
// 24 25 26 27 28 29 30 31
// 32 33 34 35 36 37 38 39
// 40 41 42 43 44 45 46 47
// 48 49 50 51 52 53 54 55

// the lookup pixels in each tile are evaluated and
// assigned a mino type if the values were correct 
const minoMap = {
    // regular minos
    "3,3,3,3,2,2,2,2": "L",
    "3,3,3,3,1,3,0,0": "J",
    "3,3,3,3,0,3,3,3": "O",
    "3,3,3,3,1,1,3,3": "Z",
    "3,3,3,3,2,3,0,0": "S",
    "3,3,3,3,1,0,1,1": "T",

    // vertical I
    "3,3,3,1,1,1,1,1": "1", // top
    "1,3,3,1,1,1,1,1": "2", // middle
    "1,3,3,3,2,1,2,1": "3", // bottom

    // horizontal I
    "3,3,1,3,1,1,1,1": "4", // left
    "3,2,1,3,1,1,1,1": "5", // middle
    "3,2,3,3,1,1,1,2": "6", // right
};

const numbersMap = {
    "0333303330" : "0",
    "0000330000" : "1",
    "0333033333" : "2",
    "3330033303" : "3",
    "0333333000" : "4",
    "3333300000" : "5",
    "0333300000" : "6",
    "3330003300" : "7",
    "0333033300" : "8",
    "0333033330" : "9",
    // not a number. this is important to determine whether it is a
    // 6 or 7 digit display
    "0000000000" : "Empty"
}


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
            color_container.style.display = 'block';

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
    let closestIndex = 0;
    let minDiff = Infinity;

    for (let i = 0; i < grayscaleLevels.length; i++) {
        const diff = Math.abs(grayscaleLevels[i] - value);
        if (diff < minDiff) {
            minDiff = diff;
            closestIndex = i;
        }
    }
    closestIndex = Math.abs(3-closestIndex); 
    return closestIndex;
}

function updateTextareaWithTileArray(tileArray) {
    // Format tileArray into a readable string
    const formattedTiles = tileArray.map((tile, index) => `Tile ${index + 1}: ${tile.join(', ')}`).join('\n\n');

    // Set the formatted string as the value of the textarea
    document.getElementById('tileOutput').value = formattedTiles;
}

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
    processThisTile = false;

    // Convert the image to indexed colors and store only specific tiles in the tileArray
    for (let tileY = 0; tileY < tilesY; tileY++) {      
        for (let tileX = 0; tileX < tilesX; tileX++) {
            
            // Calculate the tile number
            const tileNumber = tileY * tilesX + tileX;

            if (tileX >= 2 && tileX < 12) {
                processThisTile = true;
                lookupPixels = minoLookUpPixels;
                map = minoMap;
            } else {
                processThisTile = false;
            }

            if (processThisTile) {
                // Create a tile index array using a typed array if possible (e.g., Uint8Array)
                const tileIndex = new Array(lookupPixels.length); // Only store pixels specified in lookupPixels
                let i = 0; // Index for tileIndex array
            
                // Pre-calculate positions for tile start
                const baseY = tileY * tileHeight;
                const baseX = tileX * tileWidth;
            
                // Process only the pixels specified in lookupPixels
                lookupPixels.forEach(pixel => {
                    // Calculate x and y positions within the tile
                    const x = pixel % tileWidth;
                    const y = Math.floor(pixel / tileWidth);
                    
                    // Compute pixel index in the data array
                    const pixelIndex = ((baseY + y) * canvasWidth + (baseX + x)) * 4;

                    // Use bit shifts for fast average calculation: (r + g + b) / 3 approximation
                    //const avg = (data[pixelIndex] + data[pixelIndex + 1] + data[pixelIndex + 2]) >>> 2;
                    const avg = data[pixelIndex + 1]; // only green needed

                    // Find the closest grayscale index
                    const index = getClosestColorIndex(avg);

                    // Store the index value in the tile index array
                    tileIndex[i++] = index;
                });

                // Store the tile index array in the tileArray
                tileArray.push(tileIndex);
            }
            
        }
    }
    if(calibrated) updateTextareaWithTileArray(tileArray);
    requestAnimationFrame(processVideoFrames);
}

// Function to set background colors
function styleColorDivs(success) {
    // Get all elements with the class 'col-val' inside the '#color-container'

    const colorDivs = document.querySelectorAll('#color-container .col-val');
    
    // Loop through each div and set its background color
    colorDivs.forEach((div, index) => {
        // Set background color using the grayscaleLevels array
        if (grayscaleLevels[index] !== undefined) {
            div.style.backgroundColor = `rgb(${grayscaleLevels[index]}, ${grayscaleLevels[index]}, ${grayscaleLevels[index]})`;
            if(success){
                div.style.border = "2px solid green";
            }
        }
    });
}

// get the correct grey values
function calibrate() {
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

    // Object to count occurrences of each grayscale value
    const grayscaleCount = {};

    // Convert the image to grayscale and count occurrences
    for (let y = 0; y < canvasHeight; y++) {
        for (let x = 0; x < canvasWidth; x++) {
            // Compute pixel index in the data array
            const pixelIndex = (y * canvasWidth + x) * 4;

            //const avg = (data[pixelIndex] + data[pixelIndex + 1] + data[pixelIndex + 2]) >>> 2;
            const avg = data[pixelIndex + 1]; // only green needed

            // Increment the count for this grayscale value
            if (grayscaleCount[avg]) {
                grayscaleCount[avg]++;
            } else {
                grayscaleCount[avg] = 1;
            }
        }
    }

    // Convert the grayscaleCount object to an array of [value, count] pairs
    const grayscaleArray = Object.entries(grayscaleCount).map(([value, count]) => [parseInt(value), count]);

    // Sort the array by count in descending order, then by value
    grayscaleArray.sort((a, b) => b[1] - a[1] || a[0] - b[0]);
    //console.log(grayscaleArray);

    // Get the four most abundant grayscale values
    const topValues = grayscaleArray.slice(0, 4).map(([value]) => value);

    // Check the number of values and show a toast if not equal to 4
    if (grayscaleArray.length !== 4) {
        addText = "";
        if(grayscaleArray.length == 1) addText = `Seems like there was no signal!`;
        else if(grayscaleArray.length == 2 || grayscaleArray.length == 3) addText = `Your image had only ${grayscaleArray.length} shades. Calibrate again.`;
        else if(grayscaleArray.length > 4) addText = `There are too many shades. Turn off 'Frameblending' or chose another source.`;
        showToast(`The calibration failed.\n${addText}`);
    }else{
        // Assign these values to grayscaleLevels, sorted from darkest to brightest
        grayscaleLevels.length = 0; // Clear the array
        grayscaleLevels.push(...topValues.sort((a, b) => a - b));

        styleColorDivs(true);
        calibrated = true;
        document.getElementById('calibrate-button').textContent = 'Re-calibrate';
    }

}

function showToast(message) {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = message.replace(/\n/g, '<br>'); // \n = <br>
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 4000);
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

// Call the function to apply the styles
styleColorDivs(false);