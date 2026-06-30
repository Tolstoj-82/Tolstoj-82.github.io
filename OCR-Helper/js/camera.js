// Camera
//--------------------------------

navigator.mediaDevices?.addEventListener("devicechange", () => {
  loadCameras();
});

async function getConnectedDevices(type) {
  let permissionStream = null;

  try {
    permissionStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
  } catch (err) {
    console.warn("Could not open default capture device:", err);
  }

  const devices = await navigator.mediaDevices.enumerateDevices();

  if (permissionStream) {
    permissionStream.getTracks().forEach((track) => track.stop());
  }

  return devices.filter((device) => device.kind === type && device.deviceId);
}

function cleanCameraLabel(label, index) {
  return (
    label?.replace(/\s*\([0-9a-f]{4}:[0-9a-f]{4}\)\s*$/, "").trim() ||
    `Camera ${index + 1}`
  );
}

async function loadCameras() {
  try {
    if (!navigator.mediaDevices?.getUserMedia) {
      showAlert("Camera API not available. Use HTTPS or localhost.");
      return;
    }

    const previousDeviceId = cameraSelect.value;

    cameraSelect.innerHTML = "";

    const empty = document.createElement("option");
    empty.value = "";
    empty.textContent = "Select a device";
    cameraSelect.appendChild(empty);

    const cameras = await getConnectedDevices("videoinput");

    cameras.forEach((camera, index) => {
      const option = document.createElement("option");

      option.value = camera.deviceId;
      option.textContent = cleanCameraLabel(camera.label, index);

      cameraSelect.appendChild(option);
    });

    if (cameras.length === 0) {
      cameraReady = false;
      updateWorkflowUI();
      return;
    }

    const stillAvailable = cameras.some(
      (camera) => camera.deviceId === previousDeviceId,
    );

    cameraSelect.value = stillAvailable
      ? previousDeviceId
      : cameras[0].deviceId;

    await startCamera();
  } catch (err) {
    console.error(err);
    showAlert("Camera list failed: " + err.message);
  }
}

async function startCamera() {
  if (!cameraSelect.value) return;

  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: { exact: cameraSelect.value },
      },
      audio: false,
    });

    video.srcObject = stream;

    video.onloadedmetadata = () => {
      cameraReady = true;
      updateWorkflowUI();

      if (!drawLoopRunning) {
        drawLoopRunning = true;
        drawLoop();
      }
    };
  } catch (err) {
    cameraReady = false;
    updateWorkflowUI();

    console.error(err);
    showAlert("Camera access failed: " + err.message);
  }
}

// Event handlers
//--------------------------------

document.getElementById("refreshCamera").onclick = loadCameras;

cameraSelect.onchange = () => {
  startCamera();
};

document.getElementById("startCamera").style.display = "none";
document.getElementById("startCamera").onclick = startCamera;
