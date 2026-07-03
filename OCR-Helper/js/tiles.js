function createTileCard(tile) {
  const div = document.createElement("div");

  div.className = "tileCard";

  const c = document.createElement("canvas");

  c.width = 8;
  c.height = 8;
  c.className = "tileCanvas";

  const cctx = c.getContext("2d");
  const img = cctx.createImageData(8, 8);

  tile.pixels.forEach((v, i) => {
    const color = getDisplayColor(v);

    img.data[i * 4] = color.r;
    img.data[i * 4 + 1] = color.g;
    img.data[i * 4 + 2] = color.b;
    img.data[i * 4 + 3] = 255;
  });

  cctx.putImageData(img, 0, 0);

  const input = document.createElement("input");

  input.value = tile.label;
  input.placeholder = "...";

  input.onclick = (e) => {
    e.stopPropagation();
    input.select();
  };

  input.onmousedown = (e) => {
    e.stopPropagation();
  };

  input.onpointerdown = (e) => {
    e.stopPropagation();
  };

  input.oninput = () => {
    tile.label = input.value;
  };

  div.appendChild(c);
  div.appendChild(input);

  return div;
}

function renderTiles() {
  tilesContainer.innerHTML = "";

  [...uniqueTiles.entries()].forEach(([key, tile]) => {
    const div = createTileCard(tile);

    const tileData = {
      source: "unique",
      key,
    };

    div.dataset.tileData = JSON.stringify(tileData);

    div.classList.toggle("selected", isTileSelected(tileData));
    div.classList.toggle("tile-action-target", isTileActionRef(tileData));

    div.onclick = (e) => {
      handleTileCardClick(e, tileData);
    };

    div.draggable = true;
    div.dataset.key = key;

    addTileDragHandlers(div);

    tilesContainer.appendChild(div);
  });

  tileCount.textContent = uniqueTiles.size;
  updateAddTilesetButtonText();
}

function addTileDragHandlers(card) {
  card.addEventListener("dragstart", (e) => {
    document.body.classList.add("draggingTiles");
    draggedTileKey = card.dataset.key;

    tileDeleteZone.classList.add("visible");

    card.classList.add("dragging");

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", draggedTileKey);
    e.dataTransfer.setData("application/x-tile-drag", "true");

    const tileData = JSON.parse(card.dataset.tileData);
    const payload = getDragTilePayload(tileData);

    e.dataTransfer.setData("application/json", JSON.stringify(payload));
  });

  card.addEventListener("dragend", () => {
    draggedTileKey = null;
    document.body.classList.remove("draggingTiles");
    tileDeleteZone.classList.remove("visible", "drag-over");

    document.querySelectorAll(".tileCard").forEach((tile) => {
      tile.classList.remove(
        "dragging",
        "drag-over",
        "drop-before",
        "drop-after",
      );
    });
  });

  card.addEventListener("dragover", (e) => {
    if (!isTileDrag(e) || isDraggedTileCard(card)) return;

    e.preventDefault();

    if (!draggedTileKey || draggedTileKey === card.dataset.key) return;

    const rect = card.getBoundingClientRect();
    const isAfter = e.clientX > rect.left + rect.width / 2;

    card.classList.add("drag-over");
    card.classList.toggle("drop-before", !isAfter);
    card.classList.toggle("drop-after", isAfter);
  });

  card.addEventListener("dragleave", () => {
    card.classList.remove("drag-over", "drop-before", "drop-after");
  });

  card.addEventListener("drop", (e) => {
    if (!isTileDrag(e) || isDraggedTileCard(card)) return;

    e.preventDefault();

    const targetKey = card.dataset.key;

    if (!draggedTileKey || draggedTileKey === targetKey) return;

    const raw = e.dataTransfer.getData("application/json");

    if (!raw) return;

    const rect = card.getBoundingClientRect();
    const insertAfter = e.clientX > rect.left + rect.width / 2;

    moveTilePayloadToUniquePosition(
      JSON.parse(raw),
      targetKey,
      insertAfter,
    );

    renderTiles();
  });
}

function moveTilePayloadToUniquePosition(payload, targetKey, insertAfter) {
  const refs = payload.kind === "tile-selection" ? payload.tiles : [payload];
  const uniqueRefs = refs.filter((ref) => ref.source === "unique");

  if (uniqueRefs.length === 0) return;

  reorderTiles(
    uniqueRefs.map((ref) => ref.key),
    targetKey,
    insertAfter,
  );
}

function reorderTiles(sourceKeys, targetKey, insertAfter) {
  const entries = [...uniqueTiles.entries()];
  const movingKeys = sourceKeys.filter((key) => uniqueTiles.has(key));
  const movingKeySet = new Set(movingKeys);

  if (movingKeys.length === 0 || movingKeySet.has(targetKey)) return;

  const movingEntries = movingKeys
    .map((key) => entries.find(([entryKey]) => entryKey === key))
    .filter(Boolean);
  const remainingEntries = entries.filter(([key]) => !movingKeySet.has(key));
  const targetIndex = remainingEntries.findIndex(([key]) => key === targetKey);

  if (targetIndex < 0) return;

  remainingEntries.splice(
    insertAfter ? targetIndex + 1 : targetIndex,
    0,
    ...movingEntries,
  );

  uniqueTiles = new Map(remainingEntries);
}

let draggedTileKey = null;
let suppressNextTileContainerClick = false;
let pendingTileImageImport = null;
let tileActionRefIds = new Set();

uploadTileImageButton.onclick = () => {
  uploadTileImageFile.click();
};

uploadTileImageButton.addEventListener("dragenter", (e) => {
  if (!isFileDrag(e.dataTransfer)) return;

  e.preventDefault();
  uploadTileImageButton.classList.add("tile-upload-over");
});

uploadTileImageButton.addEventListener("dragover", (e) => {
  if (!isFileDrag(e.dataTransfer)) return;

  e.preventDefault();
  e.dataTransfer.dropEffect = "copy";
  uploadTileImageButton.classList.add("tile-upload-over");
});

uploadTileImageButton.addEventListener("dragleave", () => {
  uploadTileImageButton.classList.remove("tile-upload-over");
});

uploadTileImageButton.addEventListener("drop", async (e) => {
  if (!isFileDrag(e.dataTransfer)) return;

  e.preventDefault();
  uploadTileImageButton.classList.remove("tile-upload-over");

  const file = getPNGFile(e.dataTransfer.files);

  if (!file) {
    showAlert("Drop a PNG image.");
    return;
  }

  await prepareTileImageImport(file);
});

uploadTileImageFile.onchange = async (e) => {
  const file = e.target.files[0];

  if (!file) return;

  await prepareTileImageImport(file);
  uploadTileImageFile.value = "";
};

tileImageInvert.onchange = updateTileImagePreview;
cancelTileImageImport.onclick = closeTileImageImportModal;
tileImageModalOverlay.onclick = (e) => {
  if (e.target === tileImageModalOverlay) {
    closeTileImageImportModal();
  }
};

confirmTileImageImport.onclick = () => {
  if (!pendingTileImageImport) return;

  try {
    const tiles = getPreparedTiles(
      pendingTileImageImport,
      tileImageInvert.checked,
    );

    if (tiles.length === 0) {
      showAlert("The image did not contain any non-empty tiles.");
      return;
    }

    tiles.forEach((pixels) => {
      const hash = pixels.join("");

      if (!uniqueTiles.has(hash)) {
        uniqueTiles.set(hash, {
          pixels,
          label: "",
        });
      }
    });

    renderTiles();
    updateWorkflowUI();
    closeTileImageImportModal();
  } catch (err) {
    showAlert(err.message || "The image was not a valid tile PNG.");
  }
};

async function prepareTileImageImport(file) {
  try {
    pendingTileImageImport = await readTileImage(file);
    tileImageInvert.checked = false;
    updateTileImagePreview();
    tileImageModalOverlay.classList.remove("hidden");
  } catch (err) {
    showAlert(err.message || "The image was not a valid tile PNG.");
  }
}

function closeTileImageImportModal() {
  pendingTileImageImport = null;
  tileImageModalOverlay.classList.add("hidden");
}

function isFileDrag(dataTransfer) {
  return dataTransfer && [...dataTransfer.types].includes("Files");
}

function getPNGFile(files) {
  return [...files].find(
    (file) =>
      file.type === "image/png" || file.name.toLowerCase().endsWith(".png"),
  );
}

function readTileImage(file) {
  return new Promise((resolve, reject) => {
    if (file.type !== "image/png" && !file.name.toLowerCase().endsWith(".png")) {
      reject(new Error("Upload a PNG image."));
      return;
    }

    const image = new Image();
    const url = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(url);

      try {
        resolve(getTileImageData(image));
      } catch (err) {
        reject(err);
      }
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("The image could not be loaded."));
    };

    image.src = url;
  });
}

function getTileImageData(image) {
  if (image.width % TILE !== 0 || image.height % TILE !== 0) {
    throw new Error("The image dimensions must be divisible by 8.");
  }

  const scratch = document.createElement("canvas");
  scratch.width = image.width;
  scratch.height = image.height;

  const scratchCtx = scratch.getContext("2d");
  scratchCtx.drawImage(image, 0, 0);

  const data = scratchCtx.getImageData(0, 0, image.width, image.height).data;
  const shades = getImageShades(data);

  if (![2, 4].includes(shades.length)) {
    throw new Error("The image must contain exactly 2 or 4 grayscale shades.");
  }

  return {
    width: image.width,
    height: image.height,
    data,
    shades,
  };
}

function getPreparedTiles(imageData, invert) {
  const shadeToValue = getTileImageShadeMap(imageData.shades, invert);
  const tiles = [];

  for (let ty = 0; ty < imageData.height / TILE; ty++) {
    for (let tx = 0; tx < imageData.width / TILE; tx++) {
      tiles.push(
        getImageTile(imageData.data, imageData.width, tx, ty, shadeToValue),
      );
    }
  }

  while (tiles.length > 0 && isEmptyTile(tiles[tiles.length - 1])) {
    tiles.pop();
  }

  return tiles;
}

function updateTileImagePreview() {
  if (!pendingTileImageImport) return;

  const { width, height, data, shades } = pendingTileImageImport;
  const shadeToValue = getTileImageShadeMap(shades, tileImageInvert.checked);

  tileImagePreview.width = width;
  tileImagePreview.height = height;
  tileImagePreview.style.width = `${Math.min(width * 2, 640)}px`;

  const previewCtx = tileImagePreview.getContext("2d");
  const previewImage = previewCtx.createImageData(width, height);

  for (let i = 0; i < data.length; i += 4) {
    const color = getDisplayColor(shadeToValue.get(data[i]));

    previewImage.data[i] = color.r;
    previewImage.data[i + 1] = color.g;
    previewImage.data[i + 2] = color.b;
    previewImage.data[i + 3] = 255;
  }

  previewCtx.putImageData(previewImage, 0, 0);
}

function getTileImageShadeMap(shades, invert) {
  return new Map(
    [...shades].sort((a, b) => b - a).map((shade, index) => {
      const value = shades.length === 2 && index === 1 ? 3 : index;

      return [shade, invert ? 3 - value : value];
    }),
  );
}

function getImageShades(data) {
  const shades = new Set();

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] !== 255) {
      throw new Error("The image must be fully opaque.");
    }

    if (data[i] !== data[i + 1] || data[i] !== data[i + 2]) {
      throw new Error("The image must use grayscale shades only.");
    }

    shades.add(data[i]);

    if (shades.size > 4) {
      break;
    }
  }

  return [...shades];
}

function getImageTile(data, width, tx, ty, shadeToValue) {
  const pixels = [];

  for (let y = 0; y < TILE; y++) {
    for (let x = 0; x < TILE; x++) {
      const pixelIndex = ((ty * TILE + y) * width + tx * TILE + x) * 4;
      pixels.push(shadeToValue.get(data[pixelIndex]));
    }
  }

  return pixels;
}

function isEmptyTile(pixels) {
  return pixels.every((value) => value === 0);
}

tileDeleteZone.addEventListener("dragover", (e) => {
  if (!isTileDrag(e)) return;

  e.preventDefault();
  tileDeleteZone.classList.add("drag-over");
});

tileDeleteZone.addEventListener("dragleave", () => {
  tileDeleteZone.classList.remove("drag-over");
});

tileDeleteZone.addEventListener("drop", (e) => {
  if (!isTileDrag(e)) return;

  e.preventDefault();

  const raw = e.dataTransfer.getData("application/json");

  if (!raw) return;

  const payload = JSON.parse(raw);
  const refs = payload.kind === "tile-selection" ? payload.tiles : [payload];

  tileDeleteZone.classList.remove("visible", "drag-over");

  animateTileDeletion(refs, () => {
    removeTileReferences(refs);
    clearTileSelection();

    renderTiles();
    renderTilesets();
    updateWorkflowUI();
  });
});

function animateTileDeletion(refs, onComplete) {
  const ids = new Set(refs.map(getTileSelectionId));
  const cards = [...document.querySelectorAll(".tileCard")].filter((card) => {
    if (!card.dataset.tileData) return false;

    return ids.has(getTileSelectionId(JSON.parse(card.dataset.tileData)));
  });

  cards.forEach((card) => {
    card.classList.add("deleting");
  });

  window.setTimeout(onComplete, cards.length > 0 ? 180 : 0);
}

function isTileDrag(e) {
  return e.dataTransfer.types.includes("application/x-tile-drag");
}

function isDraggedTileCard(card) {
  if (!card.dataset.tileData) return false;

  return isTileSelected(JSON.parse(card.dataset.tileData));
}

function getTileSelectionId(data) {
  if (data.source === "unique") {
    return `unique:${data.key}`;
  }

  return `tileset:${data.tilesetId}:${data.index}`;
}

function clearTileSelection() {
  selectedTiles.clear();
  tileSelectionSource = null;
  renderTiles();
  renderTilesets();
}

function getTileSelectionGroup(data) {
  if (data.source === "unique") {
    return "unique";
  }

  return `tileset:${data.tilesetId}`;
}

function toggleTileSelection(data) {
  const group = getTileSelectionGroup(data);

  if (tileSelectionSource && tileSelectionSource !== group) {
    clearTileSelection();
  }

  tileSelectionSource = group;

  const id = getTileSelectionId(data);

  if (selectedTiles.has(id)) {
    selectedTiles.delete(id);
  } else {
    selectedTiles.set(id, data);
  }

  if (selectedTiles.size === 0) {
    tileSelectionSource = null;
  }
}

function isTileSelected(data) {
  return selectedTiles.has(getTileSelectionId(data));
}

function isTileActionRef(data) {
  return tileActionRefIds.has(getTileSelectionId(data));
}

tilesContainer.onclick = () => {
  if (suppressNextTileContainerClick) {
    suppressNextTileContainerClick = false;
    return;
  }

  clearTileSelection();
};

document.addEventListener("contextmenu", (e) => {
  if (e.button !== 2) return;
  if (selectedTiles.size === 0) return;
  if (!e.target.closest("#tilesContainer, .tilesetTiles")) return;

  e.preventDefault();
  showTileSelectionActionDialog([...selectedTiles.values()]);
});

function handleTileCardClick(e, tileData) {
  e.stopPropagation();

  const additive = e.ctrlKey || e.metaKey || e.shiftKey;
  const wasSelected = isTileSelected(tileData);

  if (!additive && wasSelected) {
    clearTileSelection();
    return;
  }

  if (!additive) {
    clearTileSelection();
  }

  toggleTileSelection(tileData);

  renderTiles();
  renderTilesets();
}

function showTileSelectionActionDialog(tileRefs) {
  if (tileRefs.length === 0) return;

  markTileActionRefs(tileRefs);

  const options = [
    {
      value: "new-tileset",
      label: "Create new tileset",
      variant: "primary",
    },
  ];

  if (tilesets.length > 0) {
    options.push({
      value: "existing-tileset",
      label: "Move to existing tileset",
    });
  }

  options.push({
    value: "delete",
    label: "Delete tiles",
    variant: "danger",
  });

  showChoiceList(
    "Tile selection",
    options,
    (value) => {
      if (value === "new-tileset") {
        showCreateTilesetDialog(tileRefs);
        return;
      }

      if (value === "existing-tileset") {
        showExistingTilesetDialog(tileRefs);
        return;
      }

      deleteTileSelection(tileRefs);
    },
    clearTileActionRefs,
    "Cancel",
  );
}

function showCreateTilesetDialog(tileRefs) {
  if (tileRefs.length === 0) return;

  showPrompt(
    "Tileset name",
    "New Tileset",
    (name) => {
      const tileset = {
        id: Date.now(),
        name: name.trim() || "New Tileset",
        type: "text-number",
        tiles: [],
      };

      tilesets.push(tileset);
      moveSelectedTilesToTileset(tileset, tileRefs);
    },
    clearTileActionRefs,
    "Create",
    "Cancel",
  );
}

function showExistingTilesetDialog(tileRefs) {
  if (tileRefs.length === 0) return;
  if (tilesets.length === 0) return;

  showChoiceList(
    ">>tileset",
    tilesets.map((tileset) => ({
      value: String(tileset.id),
      label: tileset.name,
    })),
    (value) => {
      const targetTilesetId = Number(value);
      const targetTileset = tilesets.find(
        (tileset) => tileset.id === targetTilesetId,
      );

      if (!targetTileset) return;

      moveSelectedTilesToTileset(targetTileset, tileRefs);
    },
    clearTileActionRefs,
    "Cancel",
  );
}

function moveSelectedTilesToTileset(targetTileset, tileRefs) {
  moveTileSelectionToTileset(
    tileRefs,
    targetTileset.id,
    targetTileset.tiles.length,
    false,
  );

  clearTileSelection();
  clearTileActionRefs();
  renderTiles();
  renderTilesets();
  renderROIList();
  renderCaptureROIPicker();
  updateWorkflowUI();
}

function deleteTileSelection(tileRefs) {
  animateTileDeletion(tileRefs, () => {
    removeTileReferences(tileRefs);
    clearTileSelection();
    clearTileActionRefs();

    renderTiles();
    renderTilesets();
    updateWorkflowUI();
  });
}

function markTileActionRefs(tileRefs) {
  tileActionRefIds = new Set(tileRefs.map(getTileSelectionId));

  document.querySelectorAll(".tileCard").forEach((card) => {
    if (!card.dataset.tileData) return;

    const data = JSON.parse(card.dataset.tileData);

    card.classList.toggle("tile-action-target", isTileActionRef(data));
  });
}

function clearTileActionRefs() {
  tileActionRefIds.clear();

  document.querySelectorAll(".tileCard.tile-action-target").forEach((card) => {
    card.classList.remove("tile-action-target");
  });
}

function startTileMarquee(e, container, sourceData) {
  if (e.button !== 0) return;
  if (e.target.closest(".tileCard")) return;

  if (!container.contains(e.target)) return;

  e.stopPropagation();

  const sourceGroup = getTileSelectionGroup(sourceData);
  const additive =
    (e.ctrlKey || e.metaKey) &&
    (!tileSelectionSource || tileSelectionSource === sourceGroup);

  // Keep marquee selection scoped to one tile source at a time.
  tileSelectionDrag = {
    startX: e.clientX,
    startY: e.clientY,
    currentX: e.clientX,
    currentY: e.clientY,
    container,
    sourceData,
    sourceGroup,
    additive,
    baseSelection: additive ? new Map(selectedTiles) : new Map(),
  };

  if (!tileSelectionDrag.additive) {
    selectedTiles.clear();
    tileSelectionSource = null;
  }

  tileSelectionBoxElement.classList.remove("hidden");
  updateTileSelectionBox();
}

function updateTileSelectionBox() {
  if (!tileSelectionDrag) return;

  const x1 = Math.min(tileSelectionDrag.startX, tileSelectionDrag.currentX);
  const y1 = Math.min(tileSelectionDrag.startY, tileSelectionDrag.currentY);
  const x2 = Math.max(tileSelectionDrag.startX, tileSelectionDrag.currentX);
  const y2 = Math.max(tileSelectionDrag.startY, tileSelectionDrag.currentY);

  tileSelectionBoxElement.style.left = `${x1}px`;
  tileSelectionBoxElement.style.top = `${y1}px`;
  tileSelectionBoxElement.style.width = `${x2 - x1}px`;
  tileSelectionBoxElement.style.height = `${y2 - y1}px`;

  selectTilesInBox({
    left: x1,
    top: y1,
    right: x2,
    bottom: y2,
  });
}

function selectTilesInBox(box) {
  const cards = tileSelectionDrag.container.querySelectorAll(".tileCard");

  selectedTiles.clear();
  tileSelectionDrag.baseSelection.forEach((data, id) => {
    selectedTiles.set(id, data);
  });

  cards.forEach((card) => {
    const rect = card.getBoundingClientRect();

    const intersects =
      rect.left < box.right &&
      rect.right > box.left &&
      rect.top < box.bottom &&
      rect.bottom > box.top;

    const data = JSON.parse(card.dataset.tileData);
    const id = getTileSelectionId(data);
    const selected = intersects || tileSelectionDrag.baseSelection.has(id);

    if (selected) {
      selectedTiles.set(id, data);
      card.classList.add("selected");
    } else {
      card.classList.remove("selected");
    }
  });

  tileSelectionSource =
    selectedTiles.size > 0 ? tileSelectionDrag.sourceGroup : null;
}

window.addEventListener("mousemove", (e) => {
  if (!tileSelectionDrag) return;

  tileSelectionDrag.currentX = e.clientX;
  tileSelectionDrag.currentY = e.clientY;

  updateTileSelectionBox();
});

window.addEventListener("mouseup", () => {
  if (!tileSelectionDrag) return;

  suppressNextTileContainerClick = tileSelectionDrag.container === tilesContainer;
  tileSelectionDrag = null;
  tileSelectionBoxElement.classList.add("hidden");

  renderTiles();
  renderTilesets();
});

document.addEventListener("mousedown", (e) => {
  if (tileSelectionDrag) return;
  if (e.ctrlKey || e.metaKey || e.shiftKey) return;

  if (
    e.target.closest(".tileCard") ||
    e.target.closest(".tileset") ||
    e.target.closest("#tilesContainer")
  ) {
    return;
  }

  clearTileSelection();
});

tilesContainer.addEventListener("mousedown", (e) => {
  startTileMarquee(e, tilesContainer, {
    source: "unique",
  });
});

function getDragTilePayload(singleTileData) {
  const singleId = getTileSelectionId(singleTileData);

  if (!selectedTiles.has(singleId)) {
    // Dragging an unselected tile makes it the only dragged item.
    selectedTiles.clear();
    tileSelectionSource = getTileSelectionGroup(singleTileData);
    selectedTiles.set(singleId, singleTileData);

    document.querySelectorAll(".tileCard.selected").forEach((card) => {
      card.classList.remove("selected");
    });
  }

  return {
    kind: "tile-selection",
    sourceGroup: tileSelectionSource,
    sourceTilesetId:
      singleTileData.source === "tileset"
        ? Number(singleTileData.tilesetId)
        : null,
    tiles: [...selectedTiles.values()],
  };
}
