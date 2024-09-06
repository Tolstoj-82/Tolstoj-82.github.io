function updateRenderedPlayfield() {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    // Ensure frameStateElement exists
    const frameStateElement = document.getElementById('frameState');
    frameState = (frameState === "&squf;") ? " " : "&squf;";
    frameStateElement.innerHTML = " " + frameState;
    
    if (isRecording) {
        recordingFrameNumber++;
    }

    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    context.imageSmoothingEnabled = false;

    const gridRows = 18;
    const blockSize = 8;

    gridContainer.innerHTML = '';

    // Change the background color based on the scheme
    if (scheme === "GB") gridContainer.style.backgroundColor = 'white';
    else gridContainer.style.backgroundColor = 'black';

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

        acc += value + ',';
        return acc;
    }, '').slice(0, -1);

    if (minoMatrix) {
        minoMatrix.value = formattedValues;
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
    intervalId = setInterval(updateRenderedPlayfield, intervalTime);
    sliderValue.innerHTML = `${slider.value} FPS`;
}

// Event listener for scheme selection change
schemeSelect.addEventListener('change', function () {
    scheme = this.value;
});