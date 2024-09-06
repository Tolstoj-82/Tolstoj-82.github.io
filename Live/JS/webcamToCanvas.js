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

async function getCameras() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');

        if (cameraSelect) {
            cameraSelect.innerHTML = '';

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

