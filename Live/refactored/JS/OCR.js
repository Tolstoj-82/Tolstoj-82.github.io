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
    let currentHigh     = "";
    let opponentHeight  = 0;

    // Pixels as [0,1,2,3] --> tileArray
    for (let tileY = 0; tileY < tilesY; tileY++) {      
        for (let tileX = 0; tileX < tilesX; tileX++) {

            processThisTile = false;
            tileType = "";

            // In game?
            if(tileX == 12 && tileY == 0){
                tileType = "Wall";                             
                lookupPixels = wallLookupPixels;
                map = wallMap;
            }else if(tileX >= 2 && tileX < 12){
                tileType = "Playfield";
                lookupPixels = minoLookUpPixels;
                map = minoMap;
            }else if(tileX >= 13 && tileX < 20 && tileY == 3){
                tileType = "A-Score";
                lookupPixels = numberLookUpPixels;
                map = numbersMap;
            }else if(tileX >= 16 && tileX < 18 && tileY == 7){
                tileType = "A-Level";
                lookupPixels = numberLookUpPixels;
                map = numbersMap;
            }else if(tileX == 16 && tileY == 5){
                tileType = "B-High";
                lookupPixels = numberLookUpPixels;
                map = numbersMap;
            }else if(tileX == 16 && tileY == 2){
                tileType = "B-Level";
                lookupPixels = numberLookUpPixels;
                map = numbersMap;
            }else if(tileX >= 14 && tileX < 18 && tileY == 10){
                tileType = "Lines";
                lookupPixels = numberLookUpPixels;
                map = numbersMap;
            }else if(tileX == 16 && tileY == 14){ // pivot mino
                tileType = "Nextbox";
                lookupPixels = minoLookUpPixels;
                map = minoMap;
            }else if(tileX == 1){
                tileType = "Heightbar";
                lookupPixels = heightLookUpPixels;
                map = heightMap;
            }

            if(tileType != "") processThisTile = true;


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
                        players = map[thisString] || 0;
                        isPlayfield = false;
                        if(players != 0) isPlayfield = true;
                        let displayElement = document.getElementById('playfield-detected');
                        if (isPlayfield) {
                            displayElement.textContent = "Playfield detected! (" + playfieldType + ")";
                            displayElement.style.color = "green";
                            playfieldVisible = true;
                        } else {
                            displayElement.textContent = "No playfield!";
                            displayElement.style.color = "white";
                            playfieldVisible = false;
                        }
                    }
                }else if(tileType == "Playfield" && playfieldVisible){

                    if (Array.isArray(tileIndex) && tileIndex.length > 0) {
                        const tileIndexString = tileIndex.join('');
                        const correspondingLetter = map[tileIndexString] || '0'; // Mino or 0 if not found
                        tileArray.push(correspondingLetter);
                    } else {
                        tileArray.push('0'); // tile not found (is this even needed?)
                    }
                }else if(tileType != ""){
                    if (Array.isArray(tileIndex) && tileIndex.length > 0) {    
                        thisString = tileIndex.join('');
                        if(map[thisString] !== undefined){
                            if(tileType == "A-Score") currentScore += map[thisString];
                            if(tileType == "A-Level") currentLevel += map[thisString];
                            if(tileType == "Lines") currentLines += map[thisString]; 
                            if(tileType == "B-High") currentHigh += map[thisString];
                            if(tileType == "B-Level") currentLevel += map[thisString];
                            if(tileType == "Nextbox") nextPiece += map[thisString];
                            if(tileType == "Heightbar") opponentHeight += parseInt(map[thisString]);
                        }
                    }
                }
            }
        }
    }

    //if (calibrated) 
    if (calibrated && playfieldVisible) {
        playfieldType = "A-Type";
        if (currentLevel.includes("B-Type")) playfieldType = "B-Type";
        if(players === "2P") playfieldType = "2-Player";

        const scoreDiv = document.getElementById("score");
        scoreDiv.innerHTML = "";
    
        const score = parseInt(currentScore);
        const level = parseInt(currentLevel);
        const high = parseInt(currentHigh);
        const lines = parseInt(currentLines);
    
        showGameMetrics(playfieldType, score, level, high, opponentHeight, lines);

        //websocket stuff
        if(webSocketConnected){
            submitString(
                tileArray,
                score,
                level,
                high,
                lines,
                nextPiece,
                playfieldType);
        }
        updateNextBox(nextPiece, level);
        populatePlayfield(tileArray, level);
    }

    requestAnimationFrame(processVideoFrames);
}

function showGameMetrics(playfieldType, score, level, high, opponentHeight, lines){
    const scoreDiv = document.getElementById("score");
    scoreDiv.innerHTML = "";
    // list the correct stats
    if (playfieldType === "A-Type") {
        scoreDiv.innerHTML += `<p>Score<br>${score}</p>`;
        scoreDiv.innerHTML += `<p>Level<br>${level}</p>`;
    } else if (playfieldType === "B-Type") {
        scoreDiv.innerHTML += `<p>Level<br>${level}</p>`;
        scoreDiv.innerHTML += `<p>High<br>${high}</p>`;
    } else if (playfieldType === "2-Player") {
        scoreDiv.innerHTML += `<p>High<br>${high}</p>`;
        scoreDiv.innerHTML += `<p>Opponent<br>${opponentHeight}</p>`;
    }

    scoreDiv.innerHTML += `<p>Lines<br>${lines}</p>`;
}

function updateNextBox(nextPiece, currentLevel) {
    if(nextPiece.length != 1) return;

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

function populatePlayfield(array, currentLevel) {
    if (!Array.isArray(array) || array.length !== 180) {
        // console.error('Array must contain exactly 180 entries.');
        return;
    }

    const gridCells = document.querySelectorAll('.grid-cell');
    
    array.forEach((value, index) => {
        if (gridCells[index]) {
            if (value != "0") {
                if(scheme == "NES" && !isNaN(parseInt(currentLevel)) && parseInt(currentLevel) >= 0){
                    let lastDigit = parseInt(currentLevel) % 10; // Get the last digit
                    gridCells[index].style.backgroundImage = `url(images/tiles/${scheme}/${lastDigit}/${value}.png)`;
                }else{
                    gridCells[index].style.backgroundImage = `url(images/tiles/${scheme}/${value}.png)`;
                }  
            } else {
                gridCells[index].style.backgroundImage = '';
            }
        }
    });
}