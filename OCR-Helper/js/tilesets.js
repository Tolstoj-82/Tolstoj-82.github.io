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
    deleteButton.textContent = "×";
    deleteButton.title = "Delete tileset";

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
    list.dataset.tileset = tileset.id;

    list.addEventListener("dragover", (e) => {
      e.preventDefault();
      list.classList.add("drag-over");
    });

    list.addEventListener("dragleave", () => {
      list.classList.remove("drag-over");
    });

    list.addEventListener("drop", (e) => {
      e.preventDefault();

      const raw = e.dataTransfer.getData("application/json");

      if (!raw) return;

      const data = JSON.parse(raw);

      moveTileToTileset(data, tileset.id, tileset.tiles.length, false);

      list.classList.remove("drag-over");

      renderTilesets();
      renderTiles();
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
    draggedTilesetTile = {
      tilesetId: Number(card.dataset.tilesetId),
      index: Number(card.dataset.index),
    };

    tileDeleteZone.classList.add("visible");

    card.classList.add("dragging");

    e.dataTransfer.effectAllowed = "move";

    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        source: "tileset",
        tilesetId: Number(card.dataset.tilesetId),
        index: Number(card.dataset.index),
      }),
    );
  });

  card.addEventListener("dragend", () => {
    draggedTilesetTile = null;

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

    const data = JSON.parse(e.dataTransfer.getData("application/json"));

    const targetTilesetId = Number(card.dataset.tilesetId);
    const targetIndex = Number(card.dataset.index);

    const rect = card.getBoundingClientRect();
    const insertAfter = e.clientX > rect.left + rect.width / 2;

    moveTileToTileset(data, targetTilesetId, targetIndex, insertAfter);

    renderTilesets();
    updateWorkflowUI();
  });
}

function moveTileToTileset(data, targetTilesetId, targetIndex, insertAfter) {
  const targetTileset = tilesets.find((t) => t.id === targetTilesetId);

  if (!targetTileset) return;

  let movedTile = null;

  if (data.source === "unique") {
    const tile = uniqueTiles.get(data.key);

    if (!tile) return;

    movedTile = {
      pixels: tile.pixels,
      label: tile.label,
    };
  }

  if (data.source === "tileset") {
    const sourceTileset = tilesets.find((t) => t.id === Number(data.tilesetId));

    if (!sourceTileset) return;

    const [tile] = sourceTileset.tiles.splice(Number(data.index), 1);

    movedTile = tile;

    if (
      sourceTileset.id === targetTileset.id &&
      Number(data.index) < targetIndex
    ) {
      targetIndex--;
    }
  }

  if (!movedTile) return;

  const insertIndex = insertAfter ? targetIndex + 1 : targetIndex;

  targetTileset.tiles.splice(insertIndex, 0, movedTile);
}

let draggedTilesetTile = null;
