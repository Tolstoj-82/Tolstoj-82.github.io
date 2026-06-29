// Camera
//--------------------------------

async function loadCameras() {
  try {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert("Camera API not available. Use HTTPS or localhost.");
      return;
    }

    cameraSelect.innerHTML = "";

    // Ask permission first.
    const permissionStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    permissionStream.getTracks().forEach((track) => track.stop());

    // Chrome sometimes needs a short moment after permission.
    await new Promise((resolve) => setTimeout(resolve, 250));

    const devices = await navigator.mediaDevices.enumerateDevices();
    const cams = devices.filter((device) => device.kind === "videoinput");

    cams.forEach((cam, index) => {
      const option = document.createElement("option");

      option.value = cam.deviceId;
      option.textContent = cam.label || `Camera ${index + 1}`;

      cameraSelect.appendChild(option);
    });

    if (cams.length === 0) {
      alert("No cameras found. Check Chrome camera permissions.");
      return;
    }

    cameraSelect.selectedIndex = 0;
    await startCamera();
  } catch (err) {
    console.error(err);
    alert("Camera access failed: " + err.message);
  }
}

async function startCamera() {
  if (stream) {
    stream.getTracks().forEach((t) => t.stop());
  }

  stream = await navigator.mediaDevices.getUserMedia({
    video: {
      deviceId: cameraSelect.value
        ? {
            exact: cameraSelect.value,
          }
        : undefined,

      width: WIDTH,
      height: HEIGHT,
    },
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
}

// Init
//--------------------------------

document.getElementById("refreshCamera").onclick = loadCameras;

cameraSelect.onchange = () => {
  startCamera();
};

document.getElementById("startCamera").style.display = "none";

document.getElementById("startCamera").onclick = startCamera;
loadCameras();
