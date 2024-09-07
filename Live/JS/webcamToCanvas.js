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