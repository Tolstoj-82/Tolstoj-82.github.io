toggleCapture.onclick = () => {
  if (!capturing && captureROIIds.size === 0) {
    showAlert("Select at least one region to search.");
    return;
  }

  capturing = !capturing;

  if (capturing) {
    captureStartTime = Date.now();
  } else {
    captureStartTime = null;
    document.title = APP_TITLE;
  }

  updateCaptureUI();
};

snapshotToggle.onclick = () => {
  if (!cameraReady) {
    showAlert("Start the camera first.");
    return;
  }

  if (!calibrated) {
    showAlert("Calibrate before taking a snapshot.");
    return;
  }

  if (!snapshotPaused) {
    ctx.drawImage(video, 0, 0, WIDTH, HEIGHT);

    const frame = ctx.getImageData(0, 0, WIDTH, HEIGHT);
    processFrame(frame);
  }

  snapshotPaused = !snapshotPaused;
  updateSnapshotUI();
};

function updateSnapshotUI() {
  snapshotToggle.textContent = snapshotPaused ? "Resume Live" : "Take Snapshot";
  canvasContainer.classList.toggle("snapshotPaused", snapshotPaused);
}

function updateCaptureUI() {
  toggleCapture.textContent = capturing ? "⏹" : "▶";

  toggleCapture.classList.toggle("capturing", capturing);
  canvasContainer.classList.toggle("capturing", capturing);

  if (!capturing) {
    document.title = APP_TITLE;
  }

  updateWorkflowUI();
  updateSnapshotUI();
}

setInterval(() => {
  if (!capturing) return;

  if (captureStartTime) {
    const elapsed = Math.floor((Date.now() - captureStartTime) / 1000);
    const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
    const seconds = String(elapsed % 60).padStart(2, "0");

    document.title = `Discovering ${minutes}:${seconds} • ${APP_TITLE}`;
  }

  const selectedROIs = getActiveScreenROIs().filter((r) =>
    captureROIIds.has(r.id),
  );

  selectedROIs.forEach((r) => {
    sortTileKeysByReadingOrder(r.tiles).forEach((id) => {
      let [x, y] = id.split(",");

      let pixels = getTile(Number(x), Number(y));

      let hash = pixels.join("");

      if (!uniqueTiles.has(hash)) {
        uniqueTiles.set(hash, {
          pixels,
          label: "",
        });

        renderTiles();
      }
    });
  });
}, 100);
