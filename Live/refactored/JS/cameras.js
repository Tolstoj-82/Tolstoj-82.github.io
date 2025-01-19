// Function to refresh the list of devices
async function resetDevices() {
    const devicesList = await getConnectedDevices('videoinput');
    updateDeviceList(devicesList);
}

// Listen for changes in connected devices
navigator.mediaDevices.addEventListener('devicechange', resetDevices);

// Initial call to populate the device list
resetDevices();

// Function to get connected video input devices (cameras)
async function getConnectedDevices(type) {
    let stream;

    try {
        // Request permission to access video devices
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
    } catch (err) {
        showToast(`Warning: could not open default capture device:\n${err.message}`, "red");
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
            showToast(`Error accessing camera:\n${err}`, "red");
        }
    }
}