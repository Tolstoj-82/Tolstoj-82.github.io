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

    let tileArray       = [];
    let processThisTile = false;
    let currentScore    = "";
    let currentLevel    = "";
    let currentLines    = "";
    let nextPiece       = "";

    // Pixels as [0,1,2,3] --> tileArray
    for (let tileY = 0; tileY < tilesY; tileY++) {      
        for (let tileX = 0; tileX < tilesX; tileX++) {
            
            processThisTile = false;
            tileType = "";

            // In game?
            if(tileX == 1 && tileY == 0){
                tileType = "Wall";                             
                processThisTile = true;
                lookupPixels = wallLookupPixels;
                map = wallMap;
            }else if(tileX >= 2 && tileX < 12){
                tileType = "Playfield";
                processThisTile = true;
                lookupPixels = minoLookUpPixels;
                map = minoMap;
            }else if(tileX >= 13 && tileX < 20 && tileY == 3){
                tileType = "Score";
                processThisTile = true;
                lookupPixels = numberLookUpPixels;
                map = numbersMap;
            }else if(tileX >= 16 && tileX < 18 && tileY == 7){
                tileType = "Level";
                processThisTile = true;
                lookupPixels = numberLookUpPixels;
                map = numbersMap;
            }else if(tileX >= 14 && tileX < 18 && tileY == 10){
                tileType = "Lines";
                processThisTile = true;
                lookupPixels = numberLookUpPixels;
                map = numbersMap;
            }else if((tileX == 17 && tileY == 14) || (tileX == 16 && tileY == 15)){
                tileType = "Nextbox";
                processThisTile = true;
                lookupPixels = minoLookUpPixels;
                map = minoMap;
            }

            if(processThisTile){
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
                            displayElement.style.color = "green";
                            playfieldVisible = true;
                        } else {
                            displayElement.textContent = "No playfield!";
                            displayElement.style.color = "white";
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
                }else if(tileType == "Score" || tileType == "Level" || tileType == "Lines"){
                    if (Array.isArray(tileIndex) && tileIndex.length > 0) {    
                        thisString = tileIndex.join('');
                        if(tileType == "Score") currentScore += map[thisString];
                        if(tileType == "Level") currentLevel += map[thisString];
                        if(tileType == "Lines") currentLines += map[thisString]; 
                    }
                }else if(tileType == "Nextbox"){
                    if (Array.isArray(tileIndex) && tileIndex.length > 0) {  
                        thisString = tileIndex.join('');
                        add = map[thisString];
                        if (add !== undefined && add !== "")  nextPiece = add;
                    }
                }
            }
        }
    }

    //if (calibrated) updateTextareaWithTileArray(tileArray);
    if(calibrated && playfieldVisible){
        const scoreDiv = document.getElementById("score");
        scoreDiv.innerHTML = "<p>Score<br>" + parseInt(currentScore) + "</p>";
        scoreDiv.innerHTML += "<p>Level<br>" + parseInt(currentLevel) + "</p>";
        scoreDiv.innerHTML += "<p>Lines<br>" + parseInt(currentLines) + "</p>";
        //console.log(nextPiece);
        updateNextBox(nextPiece, currentLevel);
        populatePlayfield(tileArray, currentLevel);
    }
    requestAnimationFrame(processVideoFrames);
}

function updateNextBox(nextPiece, currentLevel) {
    if(nextPiece.length != 1) return;

    // Define the nextBoxMap with pieces
    const nextBoxMap = {
        "L" : ["L", "L", "L", 0, "L", 0, 0, 0],
        "J" : ["J", "J", "J", 0, 0, 0, "J", 0],
        "5" : ["4", "5", "5", "6", 0, 0, 0, 0], // 5 = I, because [4,5,5,6]
        "O" : [0, "O", "O", 0, 0, "O", "O", 0],
        "Z" : ["Z", "Z", 0, 0, 0, "Z", "Z", 0],
        "S" : [0, "S", "S", 0, "S", "S", 0, 0],
        "T" : ["T", "T", "T", 0, 0, "T", 0, 0],
    };

    const box = document.querySelector('.next-box');
    const tiles = nextBoxMap[nextPiece];

    // Loop through the next box cells
    const cells = box.querySelectorAll('.next-box-cell');
    for (let i = 0; i < 16; i++) {
        const cell = cells[i];

        // Skip the first row (first 4 tiles)
        if (i >= 4 && tiles[i - 4] !== 0) {
            if(scheme == "NES" && !isNaN(parseInt(currentLevel)) && parseInt(currentLevel) >= 0){
                let lastDigit = parseInt(currentLevel) % 10; // Get the last digit
                cell.style.backgroundImage = `url(images/tiles/${scheme}/${lastDigit}/${tiles[i-4]}.png)`;
            }else{
                cell.style.backgroundImage = `url(images/tiles/${scheme}/${tiles[i-4]}.png)`;
            }            
            cell.style.backgroundSize = 'cover';
        } else {
            cell.style.backgroundImage = '';
        }
    }
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

function populatePlayfield(array, currentLevel) {
    if (!Array.isArray(array) || array.length !== 180) {
        // console.error('Array must contain exactly 180 entries.');
        return;
    }

    const gridCells = document.querySelectorAll('.grid-cell');
    
    array.forEach((value, index) => {
        if (gridCells[index]) {
            if (value != "0") {
                //gridCells[index].style.backgroundImage = `url(images/tiles/${scheme}/${value}.png)`;
                if(scheme == "NES" && !isNaN(parseInt(currentLevel)) && parseInt(currentLevel) >= 0){
                    let lastDigit = parseInt(currentLevel) % 10; // Get the last digit
                    gridCells[index].style.backgroundImage = `url(images/tiles/${scheme}/${lastDigit}/${value}.png)`;
                }else{
                    gridCells[index].style.backgroundImage = `url(images/tiles/${scheme}/${value}.png)`;
                }  
                //console.log(scheme);
            } else {
                gridCells[index].style.backgroundImage = '';
            }
        }
    });
}