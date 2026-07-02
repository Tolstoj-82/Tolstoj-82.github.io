addTilesetButton.onclick = () => {
  showPrompt("Tileset name", "New Tileset", (name) => {
    tilesets.push({
      id: Date.now(),
      name: name.trim() || "New Tileset",
      type: "integer",
      tiles: [],
    });

    renderTilesets();
    renderROIList();
    renderCaptureROIPicker();
  });
};

sendToTilesetButton.onclick = () => {
  const tiles = [...uniqueTiles.values()];

  if (tiles.length === 0) {
    showAlert("No captured tiles available yet.");
    return;
  }

  showPrompt("Send tiles to tileset", "", (choice) => {
    const name = choice.trim();

    let tileset = tilesets.find((t) => t.name === name);

    if (!tileset) {
      tileset = {
        id: Date.now(),
        name: name || "New Tileset",
        type: "integer",
        tiles: [],
      };

      tilesets.push(tileset);
    }

    tileset.tiles.push(
      ...tiles.map((tile) => ({
        pixels: tile.pixels,
        label: tile.label,
      })),
    );

    uniqueTiles.clear();
    renderTiles();

    renderTilesets();
    renderROIList();
    renderCaptureROIPicker();
    updateWorkflowUI();
  });
};

function renderTilesets() {
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
    summary.textContent = `${tileset.name} • ${tileset.tiles.length} tile${tileset.tiles.length === 1 ? "" : "s"}`;

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
      if (!document.body.classList.contains("draggingTiles")) return;

      e.preventDefault();
      e.stopPropagation();

      deleteButton.classList.add("tile-delete-over");
    });

    deleteButton.addEventListener("dragleave", () => {
      deleteButton.classList.remove("tile-delete-over");
    });

    deleteButton.addEventListener("drop", (e) => {
      if (!document.body.classList.contains("draggingTiles")) return;

      e.preventDefault();
      e.stopPropagation();

      deleteButton.classList.remove("tile-delete-over");

      const raw = e.dataTransfer.getData("application/json");
      if (!raw) return;

      const payload = JSON.parse(raw);
      const refs =
        payload.kind === "tile-selection" ? payload.tiles : [payload];

      removeTileReferences(refs);
      clearTileSelection();

      renderTiles();
      renderTilesets();
      updateWorkflowUI();
    });

    const typeSelect = document.createElement("select");

    tilesetTypes.forEach((type) => {
      const option = document.createElement("option");
      option.value = type.value;
      option.textContent = type.label;
      typeSelect.appendChild(option);
    });

    typeSelect.value = tileset.type || "integer";

    typeSelect.onchange = (e) => {
      e.stopPropagation();
      tileset.type = typeSelect.value;
    };

    typeSelect.onclick = (e) => {
      e.stopPropagation();
    };

    const list = document.createElement("div");

    list.addEventListener("mousedown", (e) => {
      startTileMarquee(e, list, {
        source: "tileset",
        tilesetId: tileset.id,
      });
    });

    list.dataset.tileset = tileset.id;

    list.addEventListener("dragover", (e) => {
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

      card.onclick = (e) => {
        e.stopPropagation();

        if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
          clearTileSelection();
        }

        toggleTileSelection(tileData);

        renderTiles();
        renderTilesets();
      };

      card.draggable = true;
      card.dataset.source = "tileset";
      card.dataset.tilesetId = tileset.id;
      card.dataset.index = index;

      addTilesetTileDragHandlers(card);

      list.appendChild(card);
    });

    details.appendChild(summary);
    details.appendChild(deleteButton);
    details.appendChild(typeSelect);
    details.appendChild(list);

    tilesetContainer.appendChild(details);
  });
}

function addTilesetTileDragHandlers(card) {
  card.addEventListener("dragstart", (e) => {
    const tileData = JSON.parse(card.dataset.tileData);
    const payload = getDragTilePayload(tileData);
    document.body.classList.add("draggingTiles");

    draggedTilesetTile = {
      tilesetId: Number(card.dataset.tilesetId),
      index: Number(card.dataset.index),
    };

    tileDeleteZone.classList.add("visible");
    card.classList.add("dragging");

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("application/json", JSON.stringify(payload));
  });

  card.addEventListener("dragend", () => {
    draggedTilesetTile = null;
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

    clearTileSelection();

    renderTiles();
    renderTilesets();
    updateWorkflowUI();
  });
}

let draggedTilesetTile = null;

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

  if (!copy) {
    removeTileReferences(tileRefs);
  }

  let insertIndex = insertAfter ? targetIndex + 1 : targetIndex;

  insertIndex = Math.max(0, Math.min(targetTileset.tiles.length, insertIndex));

  targetTileset.tiles.splice(insertIndex, 0, ...movedTiles);
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
