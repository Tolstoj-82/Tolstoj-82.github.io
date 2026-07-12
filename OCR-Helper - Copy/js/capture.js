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

  if (snapshotPaused) {
    if (!snapshotFrameRestored) {
      storeCurrentSnapshot();
    }
    snapshotPaused = false;
    snapshotFrameData = null;
    snapshotFrameRestored = false;
  } else {
    snapshotPaused = true;
    snapshotFrameData = captureCurrentSnapshotFrame();
    snapshotFrameRestored = false;
  }

  updateSnapshotUI();
};

snapshotLibraryButton.onclick = () => {
  renderSnapshotList();
  snapshotModalOverlay.classList.remove("hidden");
};

closeSnapshotModalButton.onclick = () => {
  snapshotModalOverlay.classList.add("hidden");
};

snapshotModalOverlay.onclick = (e) => {
  if (e.target === snapshotModalOverlay) {
    snapshotModalOverlay.classList.add("hidden");
  }
};

function updateSnapshotUI() {
  snapshotToggle.textContent = snapshotPaused ? "Resume Live" : "Take Snapshot";
  canvasContainer.classList.toggle("snapshotPaused", snapshotPaused);
  snapshotLibraryButton.hidden = snapshots.length === 0;
}

function captureCurrentSnapshotFrame() {
  return {
    imageData: ctx.getImageData(0, 0, WIDTH, HEIGHT),
    quantized: quantized.slice(),
    createdAt: Date.now(),
  };
}

function storeCurrentSnapshot() {
  if (!snapshotFrameData) return;

  snapshots.unshift(snapshotFrameData);
  snapshots = snapshots.slice(0, 10);
  renderSnapshotList();
}

function restoreSnapshot(snapshot) {
  snapshotPaused = true;
  snapshotFrameRestored = true;
  snapshotFrameData = {
    imageData: new ImageData(
      new Uint8ClampedArray(snapshot.imageData.data),
      snapshot.imageData.width,
      snapshot.imageData.height,
    ),
    quantized: snapshot.quantized.slice(),
    createdAt: snapshot.createdAt,
  };
  quantized = snapshot.quantized.slice();
  ctx.putImageData(snapshot.imageData, 0, 0);
  drawROIOverlay();
  renderROIReadout();
  updateSnapshotUI();
  snapshotModalOverlay.classList.add("hidden");
}

function renderSnapshotList() {
  snapshotList.replaceChildren();

  if (snapshots.length === 0) {
    const empty = document.createElement("div");

    empty.className = "snapshotEmpty";
    empty.textContent = "No snapshots yet";
    snapshotList.appendChild(empty);
    return;
  }

  snapshots.forEach((snapshot, index) => {
    const button = document.createElement("button");
    const preview = document.createElement("canvas");
    const label = document.createElement("span");
    const previewCtx = preview.getContext("2d");

    button.type = "button";
    button.className = "snapshotItem";
    preview.width = WIDTH;
    preview.height = HEIGHT;
    previewCtx.putImageData(snapshot.imageData, 0, 0);
    label.textContent = `Snapshot ${index + 1}`;

    button.onclick = () => restoreSnapshot(snapshot);

    button.append(preview, label);
    snapshotList.appendChild(button);
  });
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
