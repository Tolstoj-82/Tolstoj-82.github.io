addTilesetButton.onclick = () => {
  showPrompt("Tileset name", "New Tileset", (name) => {
    const tiles = [...uniqueTiles.values()].map((tile) => ({
      pixels: [...tile.pixels],
      label: tile.label,
    }));

    tilesets.push({
      id: Date.now(),
      name: name.trim() || "New Tileset",
      type: "text-number",
      scanPixels: calculateTilesetScanPixels(tiles),
      tiles,
    });

    if (tiles.length > 0) {
      uniqueTiles.clear();
      selectedTiles.clear();
      tileSelectionSource = null;
      renderTiles();
    }

    renderTilesets();
    renderROIList();
    renderCaptureROIPicker();
    updateWorkflowUI();
  });
};

function updateAddTilesetButtonText() {
  addTilesetButton.textContent =
    uniqueTiles.size > 0 ? ">> Tileset" : "+ Tileset";
}

function renderTilesets() {
  updateAddTilesetButtonText();

  const openStates = new Map();

  tilesetContainer.querySelectorAll(".tileset").forEach((details) => {
    openStates.set(Number(details.dataset.tilesetId), details.open);
  });

  tilesetContainer.innerHTML = "";

  tilesets.forEach((tileset) => {
    const details = document.createElement("details");
    details.className = "tileset";
    details.dataset.tilesetId = tileset.id;
    details.open = openStates.has(tileset.id)
      ? openStates.get(tileset.id)
      : true;

    const summary = document.createElement("summary");

    summary.className = "tilesetSummary";

    const nameInput = document.createElement("input");
    nameInput.className = "tilesetNameInput";
    nameInput.value = tileset.name;

    nameInput.onclick = (e) => {
      e.stopPropagation();
    };

    nameInput.oninput = () => {
      tileset.name = nameInput.value.trim() || tileset.name;
      updateWorkflowUI();
    };

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "tilesetDeleteButton";
    deleteButton.textContent = "Delete Tileset";

    deleteButton.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();

      showConfirm(
        `Delete tileset "${tileset.name}"?`,
        () => {
          game.screens.forEach((screen) => {
            screen.rois.forEach((roi) => {
              if (roi.tilesetId === tileset.id) {
                roi.tilesetId = null;
              }
            });
          });

          tilesets = tilesets.filter((t) => t.id !== tileset.id);

          renderTilesets();
          renderROIList();
          renderCaptureROIPicker();
          drawROIOverlay();
          renderROIReadout();
          updateWorkflowUI();
        },
        null,
        "Delete",
        "Cancel",
      );
    };

    deleteButton.addEventListener("dragover", (e) => {
      if (!isTileDrag(e)) return;

      e.preventDefault();
      e.stopPropagation();

      deleteButton.classList.add("tile-delete-over");
    });

    deleteButton.addEventListener("dragleave", () => {
      deleteButton.classList.remove("tile-delete-over");
    });

    deleteButton.addEventListener("drop", (e) => {
      if (!isTileDrag(e)) return;

      e.preventDefault();
      e.stopPropagation();

      deleteButton.classList.remove("tile-delete-over");

      const raw = e.dataTransfer.getData("application/json");
      if (!raw) return;

      const payload = JSON.parse(raw);
      const refs =
        payload.kind === "tile-selection" ? payload.tiles : [payload];

      animateTileDeletion(refs, () => {
        removeTileReferences(refs);
        refreshAllTilesetScanPixels();
        clearTileSelection();

        renderTiles();
        renderTilesets();
        updateWorkflowUI();
      });
    });

    const typeSelect = document.createElement("select");
    typeSelect.className = "tilesetTypeSelect";

    tilesetTypes.forEach((type) => {
      const option = document.createElement("option");
      option.value = type.value;
      option.textContent = type.label;
      typeSelect.appendChild(option);
    });

    typeSelect.value = normalizeTilesetType(tileset.type);

    typeSelect.onchange = (e) => {
      e.stopPropagation();
      tileset.type = typeSelect.value;
    };

    typeSelect.onclick = (e) => {
      e.stopPropagation();
    };

    const count = document.createElement("span");
    count.className = "tilesetCount";
    count.textContent = `(${tileset.tiles.length} tile${tileset.tiles.length === 1 ? "" : "s"})`;

    summary.appendChild(nameInput);
    summary.appendChild(typeSelect);
    summary.appendChild(count);
    summary.appendChild(deleteButton);

    const list = document.createElement("div");

    list.addEventListener("mousedown", (e) => {
      startTileMarquee(e, list, {
        source: "tileset",
        tilesetId: tileset.id,
      });
    });

    list.dataset.tileset = tileset.id;

    list.addEventListener("dragover", (e) => {
      if (!isTileDrag(e)) return;

      e.preventDefault();

      const rect = list.getBoundingClientRect();
      const isCopy = e.clientX > rect.left + rect.width / 2;

      list.classList.add("drag-over");
      list.classList.toggle("copy-mode", isCopy);
      list.classList.toggle("move-mode", !isCopy);
    });

    list.addEventListener("dragleave", () => {
      list.classList.remove("drag-over", "copy-mode", "move-mode");
    });

    list.addEventListener("drop", (e) => {
      if (!isTileDrag(e)) return;

      e.preventDefault();

      const raw = e.dataTransfer.getData("application/json");

      list.classList.remove("drag-over", "copy-mode", "move-mode");

      if (!raw) return;

      const payload = JSON.parse(raw);

      moveTilePayloadToTileset(
        payload,
        tileset.id,
        tileset.tiles.length,
        false,
        e.ctrlKey,
      );

      refreshAllTilesetScanPixels();
      clearTileSelection();

      renderTiles();
      renderTilesets();
      renderROIList();
      renderCaptureROIPicker();
      updateWorkflowUI();
    });

    list.className = "tilesetTiles";

    if (tileset.tiles.length === 0) {
      const hint = document.createElement("div");

      hint.className = "tilesetEmptyHint";
      hint.textContent = "Drop tiles here";

      list.appendChild(hint);
    }

    tileset.tiles.forEach((tile, index) => {
      const card = createTileCard(tile);

      const tileData = {
        source: "tileset",
        tilesetId: tileset.id,
        index,
      };

      card.dataset.tileData = JSON.stringify(tileData);

      card.classList.toggle("selected", isTileSelected(tileData));
      card.classList.toggle("tile-action-target", isTileActionRef(tileData));

      card.onclick = (e) => {
        handleTileCardClick(e, tileData);
      };

      card.draggable = true;
      card.dataset.source = "tileset";
      card.dataset.tilesetId = tileset.id;
      card.dataset.index = index;

      addTilesetTileDragHandlers(card);

      list.appendChild(card);
    });

    details.appendChild(summary);
    details.appendChild(createTilesetScanInfo(tileset));
    details.appendChild(list);

    tilesetContainer.appendChild(details);
  });
}

function addTilesetTileDragHandlers(card) {
  card.addEventListener("dragstart", (e) => {
    const tileData = JSON.parse(card.dataset.tileData);
    const payload = getDragTilePayload(tileData);
    document.body.classList.add("draggingTiles");

    tileDeleteZone.classList.add("visible");
    card.classList.add("dragging");

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("application/x-tile-drag", "true");
    e.dataTransfer.setData("application/json", JSON.stringify(payload));
  });

  card.addEventListener("dragend", () => {
    document.body.classList.remove("draggingTiles");

    document.querySelectorAll(".tileCard").forEach((tile) => {
      tile.classList.remove(
        "dragging",
        "drag-over",
        "drop-before",
        "drop-after",
      );
    });

    tileDeleteZone.classList.remove("visible", "drag-over");
  });

  card.addEventListener("dragover", (e) => {
    if (!isTileDrag(e) || isDraggedTileCard(card)) return;

    e.preventDefault();

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
    e.stopPropagation();

    const raw = e.dataTransfer.getData("application/json");
    if (!raw) return;

    const payload = JSON.parse(raw);

    const targetTilesetId = Number(card.dataset.tilesetId);
    const targetIndex = Number(card.dataset.index);

    const rect = card.getBoundingClientRect();
    const insertAfter = e.clientX > rect.left + rect.width / 2;

    moveTilePayloadToTileset(
      payload,
      targetTilesetId,
      targetIndex,
      insertAfter,
      e.ctrlKey,
    );

    refreshAllTilesetScanPixels();
    clearTileSelection();

    renderTiles();
    renderTilesets();
    updateWorkflowUI();
  });
}

function createTilesetScanInfo(tileset) {
  const panel = document.createElement("div");
  panel.className = "tilesetScanInfo";

  const preview = document.createElement("canvas");
  preview.className = "tilesetScanPreview";
  preview.width = TILE;
  preview.height = TILE;

  const scanPixels = getTilesetScanPixels(tileset);
  drawScanPixelPreview(preview, scanPixels);

  const label = document.createElement("div");
  label.className = "tilesetScanLabel";
  label.textContent = getTilesetScanLabel(tileset, scanPixels);

  panel.appendChild(preview);
  panel.appendChild(label);

  return panel;
}

function getTilesetScanLabel(tileset, scanPixels = getTilesetScanPixels(tileset)) {
  if (tileset.tiles.length === 0) {
    return "Fast OCR: no tiles";
  }

  if (!tilesetCanBeDistinguished(tileset.tiles)) {
    return "Fast OCR unavailable: duplicate tile pixels";
  }

  if (!isUsableScanPixelSet(scanPixels)) {
    return `Full tile scan: ${TILE * TILE}/${TILE * TILE} pixels`;
  }

  return `Fast OCR: ${scanPixels.length}/${TILE * TILE} pixels`;
}

function drawScanPixelPreview(canvas, scanPixels) {
  const ctx = canvas.getContext("2d");
  const ignoredColor = getCSSColor("--scan-pixel-ignored");
  const activeColor = getCSSColor("--scan-pixel-active");
  const active = new Set(scanPixels);

  ctx.fillStyle = ignoredColor;
  ctx.fillRect(0, 0, TILE, TILE);

  ctx.fillStyle = activeColor;

  for (let index = 0; index < TILE * TILE; index++) {
    if (!active.has(index)) continue;

    ctx.fillRect(index % TILE, Math.floor(index / TILE), 1, 1);
  }
}

function getCSSColor(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function getTileFromReference(ref) {
  if (ref.source === "unique") {
    return uniqueTiles.get(ref.key) || null;
  }

  if (ref.source === "tileset") {
    const tileset = tilesets.find((t) => t.id === Number(ref.tilesetId));

    if (!tileset) return null;

    return tileset.tiles[Number(ref.index)] || null;
  }

  return null;
}

function removeTileReferences(tileRefs) {
  const refsByUniqueKey = tileRefs
    .filter((ref) => ref.source === "unique")
    .map((ref) => ref.key);

  refsByUniqueKey.forEach((key) => {
    uniqueTiles.delete(key);
  });

  const refsByTileset = new Map();

  tileRefs
    .filter((ref) => ref.source === "tileset")
    .forEach((ref) => {
      const id = Number(ref.tilesetId);

      if (!refsByTileset.has(id)) {
        refsByTileset.set(id, []);
      }

      refsByTileset.get(id).push(Number(ref.index));
    });

  refsByTileset.forEach((indexes, tilesetId) => {
    const tileset = tilesets.find((t) => t.id === tilesetId);

    if (!tileset) return;

    indexes
      .sort((a, b) => b - a)
      .forEach((index) => {
        tileset.tiles.splice(index, 1);
      });
  });
}

function moveTileSelectionToTileset(
  tileRefs,
  targetTilesetId,
  targetIndex,
  insertAfter,
  copy = false,
) {
  const targetTileset = tilesets.find((t) => t.id === targetTilesetId);

  if (!targetTileset) return;

  const movedTiles = tileRefs
    .map((ref) => getTileFromReference(ref))
    .filter(Boolean)
    .map((tile) => ({
      pixels: [...tile.pixels],
      label: tile.label,
    }));

  if (movedTiles.length === 0) return;

  let insertIndex = insertAfter ? targetIndex + 1 : targetIndex;

  if (!copy) {
    const removedBeforeTarget = tileRefs
      .filter((ref) => {
        return (
          ref.source === "tileset" &&
          Number(ref.tilesetId) === targetTilesetId &&
          Number(ref.index) < insertIndex
        );
      })
      .length;

    removeTileReferences(tileRefs);
    insertIndex -= removedBeforeTarget;
  }

  insertIndex = Math.max(0, Math.min(targetTileset.tiles.length, insertIndex));

  targetTileset.tiles.splice(insertIndex, 0, ...movedTiles);
  targetTileset.scanPixels = calculateTilesetScanPixels(targetTileset.tiles);
}

function moveTilePayloadToTileset(
  payload,
  targetTilesetId,
  targetIndex,
  insertAfter,
  copy = false,
) {
  const refs = payload.kind === "tile-selection" ? payload.tiles : [payload];

  moveTileSelectionToTileset(
    refs,
    targetTilesetId,
    targetIndex,
    insertAfter,
    copy,
  );
}

function refreshAllTilesetScanPixels() {
  tilesets.forEach((tileset) => {
    tileset.scanPixels = calculateTilesetScanPixels(tileset.tiles);
  });
}
