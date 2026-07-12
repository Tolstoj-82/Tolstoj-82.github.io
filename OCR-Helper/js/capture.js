const SNAPSHOT_STORAGE_KEY = "gbOcrHelper.snapshots.v1";
let draggedSnapshotId = "";
let snapshotPersistTimer = null;

snapshots = loadPersistedSnapshots();

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
    id: createSnapshotId(),
    name: getNextSnapshotName(),
    imageData: ctx.getImageData(0, 0, WIDTH, HEIGHT),
    quantized: quantized.slice(),
    palette: displayPalette.slice(),
    createdAt: Date.now(),
  };
}

function storeCurrentSnapshot() {
  if (!snapshotFrameData) return;

  snapshots.unshift(snapshotFrameData);
  snapshots = snapshots.slice(0, 10);
  persistSnapshots();
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
    palette: snapshot.palette?.slice() || displayPalette.slice(),
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
    const item = document.createElement("article");
    const previewButton = document.createElement("button");
    const preview = document.createElement("canvas");
    const controls = document.createElement("div");
    const dragHandle = document.createElement("button");
    const nameInput = document.createElement("input");
    const deleteButton = document.createElement("button");
    const previewCtx = preview.getContext("2d");

    item.className = "snapshotItem";
    item.dataset.snapshotId = snapshot.id;
    previewButton.type = "button";
    previewButton.className = "snapshotPreviewButton";
    previewButton.title = `Open ${snapshot.name}`;
    preview.width = WIDTH;
    preview.height = HEIGHT;
    previewCtx.putImageData(snapshot.imageData, 0, 0);
    previewButton.onclick = () => restoreSnapshot(snapshot);

    controls.className = "snapshotItemControls";
    dragHandle.type = "button";
    dragHandle.className = "snapshotDragHandle";
    dragHandle.textContent = "⋮⋮";
    dragHandle.title = "Drag to rearrange snapshot";
    dragHandle.setAttribute("aria-label", dragHandle.title);
    dragHandle.draggable = true;
    dragHandle.ondragstart = (event) => {
      draggedSnapshotId = snapshot.id;
      item.classList.add("dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", snapshot.id);
    };
    dragHandle.ondragend = () => {
      draggedSnapshotId = "";
      snapshotList.querySelectorAll(".snapshotItem").forEach((candidate) => {
        candidate.classList.remove(
          "dragging",
          "dragOver",
          "dropBefore",
          "dropAfter",
        );
      });
    };

    nameInput.type = "text";
    nameInput.className = "snapshotNameInput";
    nameInput.value = snapshot.name || `Snapshot ${index + 1}`;
    nameInput.maxLength = 80;
    nameInput.setAttribute("aria-label", "Snapshot name");
    nameInput.oninput = () => {
      snapshot.name = nameInput.value.trim();
      previewButton.title = `Open ${snapshot.name || "snapshot"}`;
      deleteButton.title = `Delete ${snapshot.name || "snapshot"}`;
      deleteButton.setAttribute("aria-label", deleteButton.title);
      scheduleSnapshotPersist();
    };
    nameInput.onchange = () => {
      snapshot.name = nameInput.value.trim() || `Snapshot ${index + 1}`;
      nameInput.value = snapshot.name;
      previewButton.title = `Open ${snapshot.name}`;
      deleteButton.title = `Delete ${snapshot.name}`;
      deleteButton.setAttribute("aria-label", deleteButton.title);
      persistSnapshots();
    };
    nameInput.onkeydown = (event) => {
      if (event.key === "Enter") nameInput.blur();
    };

    deleteButton.type = "button";
    deleteButton.className = "snapshotDeleteButton roundDeleteButton";
    deleteButton.textContent = "×";
    deleteButton.title = `Delete ${snapshot.name}`;
    deleteButton.setAttribute("aria-label", deleteButton.title);
    deleteButton.onclick = () => {
      showConfirm(
        `Delete snapshot "${snapshot.name}"?`,
        () => deleteSnapshot(snapshot.id),
        null,
        "Delete",
        "Cancel",
      );
    };

    item.ondragover = (event) => {
      if (!draggedSnapshotId || draggedSnapshotId === snapshot.id) return;

      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      const bounds = item.getBoundingClientRect();
      const insertAfter = event.clientX > bounds.left + bounds.width / 2;

      item.classList.add("dragOver");
      item.classList.toggle("dropBefore", !insertAfter);
      item.classList.toggle("dropAfter", insertAfter);
    };
    item.ondragleave = () => {
      item.classList.remove("dragOver", "dropBefore", "dropAfter");
    };
    item.ondrop = (event) => {
      event.preventDefault();
      item.classList.remove("dragOver", "dropBefore", "dropAfter");

      const sourceId = draggedSnapshotId || event.dataTransfer.getData("text/plain");

      if (!sourceId || sourceId === snapshot.id) return;

      const bounds = item.getBoundingClientRect();
      const insertAfter = event.clientX > bounds.left + bounds.width / 2;

      reorderArrayItem(
        snapshots,
        sourceId,
        snapshot.id,
        insertAfter,
        (candidate) => candidate.id,
      );
      draggedSnapshotId = "";
      persistSnapshots();
      renderSnapshotList();
    };

    previewButton.appendChild(preview);
    controls.append(dragHandle, nameInput, deleteButton);
    item.append(previewButton, controls);
    snapshotList.appendChild(item);
  });
}

function createSnapshotId() {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `snapshot-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getNextSnapshotName() {
  const used = new Set(snapshots.map((snapshot) => snapshot.name));
  let number = 1;

  while (used.has(`Snapshot ${number}`)) number += 1;

  return `Snapshot ${number}`;
}

function deleteSnapshot(snapshotId) {
  snapshots = snapshots.filter((snapshot) => snapshot.id !== snapshotId);
  persistSnapshots();
  renderSnapshotList();
  updateSnapshotUI();
}

function persistSnapshots() {
  try {
    const stored = snapshots.map((snapshot) => ({
      id: snapshot.id,
      name: snapshot.name,
      createdAt: snapshot.createdAt,
      palette: snapshot.palette || displayPalette,
      quantized: encodeSnapshotQuantized(snapshot.quantized),
    }));

    localStorage.setItem(SNAPSHOT_STORAGE_KEY, JSON.stringify(stored));
  } catch (error) {
    console.warn("Could not persist snapshots.", error);
    showAlert("Could not save the snapshot library in local storage.");
  }
}

function scheduleSnapshotPersist() {
  window.clearTimeout(snapshotPersistTimer);
  snapshotPersistTimer = window.setTimeout(persistSnapshots, 250);
}

function loadPersistedSnapshots() {
  try {
    const stored = JSON.parse(localStorage.getItem(SNAPSHOT_STORAGE_KEY)) || [];

    if (!Array.isArray(stored)) return [];

    return stored.slice(0, 10).flatMap((snapshot, index) => {
      const restoredQuantized = decodeSnapshotQuantized(snapshot.quantized);

      if (restoredQuantized.length !== WIDTH * HEIGHT) return [];

      const palette = Array.isArray(snapshot.palette) && snapshot.palette.length >= 4
        ? snapshot.palette.slice(0, 4)
        : DEFAULT_DISPLAY_PALETTE.slice();

      return [{
        id: String(snapshot.id || createSnapshotId()),
        name: String(snapshot.name || `Snapshot ${index + 1}`),
        imageData: createSnapshotImageData(restoredQuantized, palette),
        quantized: restoredQuantized,
        palette,
        createdAt: Number(snapshot.createdAt) || Date.now(),
      }];
    });
  } catch (error) {
    console.warn("Could not load persisted snapshots.", error);
    return [];
  }
}

function encodeSnapshotQuantized(values) {
  const bytes = Uint8Array.from(values, (value) => Number(value) & 3);
  let binary = "";

  for (let offset = 0; offset < bytes.length; offset += 8192) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 8192));
  }

  return btoa(binary);
}

function decodeSnapshotQuantized(value) {
  if (typeof value !== "string" || !value) return [];

  const binary = atob(value);

  return Array.from(binary, (character) => character.charCodeAt(0) & 3);
}

function createSnapshotImageData(values, palette) {
  const imageData = ctx.createImageData(WIDTH, HEIGHT);

  values.forEach((value, index) => {
    const pixel = index * 4;
    const color = hexToRgb(palette[value] || DEFAULT_DISPLAY_PALETTE[value]);

    imageData.data[pixel] = color.r;
    imageData.data[pixel + 1] = color.g;
    imageData.data[pixel + 2] = color.b;
    imageData.data[pixel + 3] = 255;
  });

  return imageData;
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
