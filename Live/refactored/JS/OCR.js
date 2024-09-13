// for each frame (OCR)
function processVideoFrames() {
    if (camera_feed.paused || camera_feed.ended) {
        return;
    }

    // Create a canvas to draw the video frame (not visible)
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvasWidth;
    tempCanvas.height = canvasHeight;
    const tempContext = tempCanvas.getContext('2d');

    // Draw the current frame to the temporary canvas
    tempContext.drawImage(camera_feed, 0, 0, canvasWidth, canvasHeight);

    // Get the image data
    const imageData = tempContext.getImageData(0, 0, canvasWidth, canvasHeight);
    const data = imageData.data;

    let tileArray = [];
    let processThisTile = false;

    // Pixels as [0,1,2,3] --> tileArray
    for (let tileY = 0; tileY < tilesY; tileY++) {      
        for (let tileX = 0; tileX < tilesX; tileX++) {
            
            processThisTile = false;
            tileType = "";

            // In game?
            if(tileX == 1 && tileY == 0){
                processThisTile = true;
                lookupPixels = wallLookupPixels;
                map = wallMap;
                tileType = "Wall";             
            }else if (tileX >= 2 && tileX < 12) {
                processThisTile = true;
                lookupPixels = minoLookUpPixels;
                map = minoMap;
                tileType = "Playfield";
            }

            if (processThisTile) {
                // Ensure tileIndex is initialized as an array
                const tileIndex = [];
                let i = 0;
            
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

                    // Use the green channel to get greyscale value
                    const avg = data[pixelIndex + 1]; // Only green needed

                    // Find the closest greyscale index
                    const index = getClosestColorIndex(avg);

                    // Store the index value in the tile index array
                    tileIndex[i++] = index;
                });
                
                if(tileType == "Wall"){ // if tile [2,1] is a wall we are on the playfield
                    if (Array.isArray(tileIndex) && tileIndex.length > 0) {
                        // Convert tileIndex array to string for map lookup
                        thisString = tileIndex.join('');
                        isPlayfield = map[thisString] || false;
                        let displayElement = document.getElementById('playfield-detected');
                        if (isPlayfield) {
                            displayElement.textContent = "Playfield detected!";
                            playfieldVisible = true;
                        } else {
                            displayElement.textContent = "No playfield!";
                            playfieldVisible = false;
                        }
                    }
                }else if(tileType == "Playfield" && playfieldVisible){
                    // Ensure tileIndex is an array and not empty before calling join
                    if (Array.isArray(tileIndex) && tileIndex.length > 0) {
                        // Convert tileIndex array to string for map lookup
                        const tileIndexString = tileIndex.join('');

                        // Find the corresponding letter from the minoMap
                        const correspondingLetter = map[tileIndexString] || '0'; // Use 0 if not found

                        // Store the corresponding letter in the tileArray
                        tileArray.push(correspondingLetter);
                    } else {
                        tileArray.push('0'); // tile not found 
                    }
                }
            }
        }
    }

    //if (calibrated) updateTextareaWithTileArray(tileArray);
    if (calibrated && playfieldVisible) populatePlayfield(tileArray);
    requestAnimationFrame(processVideoFrames);
}

// Get the closest greyscale and return 0,1,2 or 3
function getClosestColorIndex(value) {
    let closestIndex = 0;
    let minDiff = Infinity;

    for (let i = 0; i < greyGBShades.length; i++) {
        const diff = Math.abs(greyGBShades[i] - value);
        if (diff < minDiff) {
            minDiff = diff;
            closestIndex = i;
        }
    }
    closestIndex = Math.abs(3-closestIndex); 
    return closestIndex;
}

function updateTextareaWithTileArray(tileArray) { // only needed for debugging
    const formattedTiles = tileArray.map((tile) => {
        const tileContent = Array.isArray(tile) ? tile.join(', ') : tile;
        return `${tileContent}`;
    }).join('');
    document.getElementById('tileOutput').value = formattedTiles;
}

function populatePlayfield(array) {
    if (!Array.isArray(array) || array.length !== 180) {
        // console.error('Array must contain exactly 180 entries.');
        return;
    }

    const gridCells = document.querySelectorAll('.grid-cell');

    array.forEach((value, index) => {
        if (gridCells[index]) {
            gridCells[index].style.backgroundImage = `url(images/tiles/${value}.png)`;
        }
    });
}