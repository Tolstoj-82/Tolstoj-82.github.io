addTilesetButton.onclick = () => {
  const name = prompt("Tileset name", "New Tileset");

  if (name === null) return;

  tilesets.push({
    id: Date.now(),
    name: name.trim() || "New Tileset",
    type: "integer",
    tiles: [],
  });

  renderTilesets();
  renderROIList();
  renderCaptureROIPicker();
};

sendToTilesetButton.onclick = () => {
  const tiles = [...uniqueTiles.values()];

  if (tiles.length === 0) {
    alert("No captured tiles available yet.");
    return;
  }

  const existingNames = tilesets
    .map((t, i) => `${i + 1}: ${t.name}`)
    .join("\n");

  const choice = prompt(
    `Send to tileset:\n${existingNames}\n\nEnter number or new name:`,
    "",
  );

  if (choice === null) return;

  let tileset = tilesets[Number(choice) - 1];

  if (!tileset) {
    const newName = choice.trim() || "New Tileset";

    if (tilesets.some((t) => t.name === newName)) {
      alert("Tileset names must be unique.");
      return;
    }

    tileset = {
      id: Date.now(),
      name: newName,
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
    summary.textContent = `${tileset.name} • ${tileset.tiles.length} tile${tileset.tiles.length === 1 ? "" : "s"}`;

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

  card.addEventListener("dblclick", (e) => {
    if (e.target.tagName === "INPUT") return;

    const tileset = tilesets.find(
      (t) => t.id === Number(card.dataset.tilesetId),
    );

    if (!tileset) return;

    const index = Number(card.dataset.index);

    const shouldDelete = confirm(`Delete tile from "${tileset.name}"?`);

    if (!shouldDelete) return;

    tileset.tiles.splice(index, 1);

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
