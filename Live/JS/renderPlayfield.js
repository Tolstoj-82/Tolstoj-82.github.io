function processTile(row, col, blockSize, scaleFactor, tileClass, context, scheme, greyValuesArray) {
    const x = col * blockSize * scaleFactor;
    const y = row * blockSize * scaleFactor;

    // Get image data for the specific tile
    const imageData = context.getImageData(x, y, blockSize * scaleFactor, blockSize * scaleFactor);

    // Choose the pixel lookup array based on tileClass
    const pixelLookup = tileClass === "score" ? numberLookUpPixels : minoLookUpPixels;

    // Map the relevant pixels to grey values
    const relevantPixels = pixelLookup.map(index => {
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

    // Map the grey values to pixel values using your map function
    const pixelValues = relevantPixels.map(grey => greyToValue[mapToNearestGrey(grey)] || 0);
    const pixelValuesStr = pixelValues.join('');

    // Determine the tile type
    const tileType = determineTileType(pixelValuesStr, tileClass);

    if (tileClass === "playfield") {
        // Construct the image URL
        const imageUrl = `tiles/${scheme}/${tileType}.png`;

        // Create and append the grid block with the corresponding image
        const block = document.createElement('div');
        block.className = 'grid-block';
        block.style.backgroundImage = `url(${imageUrl})`;
        gridContainer.appendChild(block);

        // Add the tile type to the grey values array
        greyValuesArray.push(tileType);
    }
    return tileType;
}


function updateNextBox(nextPiece) {
    // Define the nextBoxMap with pieces
    const nextBoxMap = {
        "L" : ["L", "L", "L", 0, "L", 0, 0, 0],
        "J" : ["J", "J", "J", 0, 0, 0, "J", 0],
        "I" : ["4", "5", "5", "6", 0, 0, 0, 0], 
        "O" : [0, "O", "O", 0, 0, "O", "O", 0],
        "Z" : ["Z", "Z", 0, 0, 0, "Z", "Z", 0],
        "S" : [0, "S", "S", 0, "S", "S", 0, 0],
        "T" : ["T", "T", "T", 0, 0, "T", 0, 0],
    };

    const box = document.querySelector('.next-box');
    const tiles = nextBoxMap[nextPiece];
    
    // Clear any existing content
    box.innerHTML = '';

    // Loop through a 4x4 grid (16 cells)
    for (let i = 0; i < 16; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');

        // Skip the first row (first 4 tiles)
        if (i >= 4 && tiles[i - 4] !== 0) {
            // Start placing images from the 5th cell onward using the first tile in the array
            if(scheme == "NES" && !isNaN(parseInt(currentLevel)) && parseInt(currentLevel) >= 0){
                let lastDigit = parseInt(currentLevel) % 10; // Get the last digit
                cell.style.backgroundImage = `url(images/tiles/${scheme}/${lastDigit}/${tiles[i-4]}.png)`;
            }else{
                cell.style.backgroundImage = `url(images/tiles/${scheme}/${tiles[i-4]}.png)`;
            }  
            cell.style.backgroundSize = 'cover';
        }

        box.appendChild(cell);
    }
}

function calculateScore(digitCount) {
    let score = 0;
    for (let i = 0; i < digitCount; i++) {
        let currentDigit = parseInt(processTile(3, 13 + i, blockSize, scaleFactor, "score", context, scheme, greyValuesArray));
        if (isNaN(currentDigit)) currentDigit = 0;
        score += Math.pow(10, digitCount - 1 - i) * currentDigit;
    }
    return score;
}

function updateRenderedPlayfield() {
/*    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
*/
    // Ensure frameStateElement exists
    const frameStateElement = document.getElementById('frameState');
    frameState = (frameState === "&squf;") ? " " : "&squf;";
    frameStateElement.innerHTML = " " + frameState;

    if (isRecording) {
        recordingFrameNumber++;
    }

    // Draw the current video frame onto the canvas
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    context.imageSmoothingEnabled = false;

    // Clear the grid container before updating
    gridContainer.innerHTML = '';

    // Set the background color based on the scheme
    gridContainer.style.backgroundColor = scheme === "GB" ? 'white' : 'black';
    nextBoxContainer.style.backgroundColor = scheme === "GB" ? 'white' : 'black';

    //let greyValuesArray = [];

    // Loop through the rows and columns to process each tile
    for (let row = 0; row < gridRows; row++) {
        for (let col = 2; col < 12; col++) {
            processTile(row, col, blockSize, scaleFactor, "playfield", context, scheme, greyValuesArray);
        }
    }

    // Process tiles for next piece detection
    nextBoxTile1 = processTile(14, 17, blockSize, scaleFactor, "nextBox", context, scheme, greyValuesArray);
    nextBoxTile2 = processTile(14, 16, blockSize, scaleFactor, "nextBox", context, scheme, greyValuesArray);

    // Check if both tiles are not zero (or empty)
    if (!(nextBoxTile1 == 0 && nextBoxTile2 == 0)) {
        nextPiece = nextBoxTile2;
        if (nextBoxTile1 != 0) nextPiece = nextBoxTile1;
        if (parseInt(nextPiece) > 0) {
            nextPiece = "I";
        }

        updateNextBox(nextPiece);
    }

    // Process tiles for score
    seventhDigit = processTile(3, 19, blockSize, scaleFactor, "score", context, scheme, greyValuesArray);
    let currentScore = 0;
    if (seventhDigit === "Empty") { // six digit display
        currentScore = calculateScore(6);
    } else { // seven digit display
        currentScore = calculateScore(7);
    }

    // Update the score div with the current score
    document.getElementById("score").innerHTML = `SCORE<br> ${currentScore}`;

    // Format the grey values array into a string with line breaks every 10 values
    const formattedValues = greyValuesArray.reduce((acc, value, index) => {
        if (index > 0 && index % 10 === 0) acc += '\n';
        acc += value + ',';
        return acc;
    }, '').slice(0, -1);

    // Update the minoMatrix value if it exists
    if (minoMatrix) {
        minoMatrix.value = formattedValues;
    }

    // Handle recording logic
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
    intervalId = setInterval(updateRenderedPlayfield, intervalTime);
    sliderValue.innerHTML = `${slider.value} FPS`;
}

// Event listener for scheme selection change
schemeSelect.addEventListener('change', function () {
    scheme = this.value;
});