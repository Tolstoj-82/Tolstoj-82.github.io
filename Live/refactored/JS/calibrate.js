// get the correct grey values
// TOLSTOJ COMMENT: This function has too much 
// overlap with processVideoFrames() in OCR.js
// maybe certain parts can be their own functions?
function calibrate() {
    if (camera_feed.paused || camera_feed.ended) {
        return;
    }

    // video --> temp canvas (not visible)
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvasWidth;
    tempCanvas.height = canvasHeight;
    const tempContext = tempCanvas.getContext('2d');
    tempContext.drawImage(camera_feed, 0, 0, canvasWidth, canvasHeight);
    const imageData = tempContext.getImageData(0, 0, canvasWidth, canvasHeight);
    const data = imageData.data; // Get image data

    // Count occurrences of the shades
    const greyscaleCount = {};

    // image --> greyscale / count occurrences
    for (let y = 0; y < canvasHeight; y++) {
        for (let x = 0; x < canvasWidth; x++) {
            const pixelIndex = (y * canvasWidth + x) * 4;
            const avg = data[pixelIndex + 1]; // Only green needed
            greyscaleCount[avg] = (greyscaleCount[avg] || 0) + 1;
        }
    }

    // Occurances = [value, count]
    const greyscaleArray = Object.entries(greyscaleCount).map(([value, count]) => [parseInt(value), count]);

    // Sort by count and value
    greyscaleArray.sort((a, b) => b[1] - a[1] || a[0] - b[0]);

    // Toast if not 4 shades
    forceCalibrate = false;
    if (greyscaleArray.length !== 4) {
        let addText = "";
        const len = greyscaleArray.length;
        if (len == 1) {
            addText = `Seems like there was no signal!`;
        } else if (len == 2 || len == 3) {
            addText = `Your image had only ${len} shades. Calibrate again.`;
        } else if (len > 4) {
            addText = `There were too many shades (${len}). \nTurn off 'Frameblending' or choose another source. \nThe calibration might be inacurate.`;
            forceCalibrate = true;
        }
        showToast(`The calibration failed.\n${addText}`);
    } 
    
    if(greyscaleArray.length == 4 || forceCalibrate) {
        // Assign the GB shades, sorted from darkest to brightest
        greyGBShades.length = 0;
        greyGBShades.push(...greyscaleArray.slice(0, 4).map(([value]) => value).sort((a, b) => a - b));
        if(greyscaleArray.length == 4) forceCalibrate = false;
        styleColorDivs(true, forceCalibrate);
        calibrated = true;
        document.getElementById('calibrate-button').textContent = 'Re-calibrate';
        
        // only display the button if calibrated
        document.getElementById('websocketConnectItems').style.display = 'block';
    }
}

// Function to set background colors
function styleColorDivs(success, forceCalibrate) {
    // Get the color boxes (divs)
    const colorDivs = document.querySelectorAll('#color-container .col-val');
    
    // ... and loop through them
    colorDivs.forEach((div, index) => {
        if (greyGBShades[index] !== undefined) {
            div.style.backgroundColor = `rgb(${greyGBShades[index]}, ${greyGBShades[index]}, ${greyGBShades[index]})`;
            if(success){
                if(forceCalibrate){
                    div.style.border = "2px solid orange";
                }else{
                    div.style.border = "2px solid green";
                }
            }
        }
    });
}