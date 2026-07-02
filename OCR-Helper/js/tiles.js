// Tile display
//--------------------------------

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
    const p = palette[v];

    img.data[i * 4] = p;
    img.data[i * 4 + 1] = p;
    img.data[i * 4 + 2] = p;
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

  input.oninput = () => {
    tile.label = input.value;
  };

  input.onclick = (e) => {
    e.stopPropagation();
  };

  input.onmousedown = (e) => {
    e.stopPropagation();
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

    div.onclick = (e) => {
      e.stopPropagation();

      if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
        clearTileSelection();
      }

      toggleTileSelection(tileData);

      renderTiles();
      renderTilesets();
    };

    div.draggable = true;
    div.dataset.key = key;

    addTileDragHandlers(div);

    tilesContainer.appendChild(div);
  });

  tileCount.textContent = uniqueTiles.size;
}

function addTileDragHandlers(card) {
  card.addEventListener("dragstart", (e) => {
    document.body.classList.add("draggingTiles");
    draggedTileKey = card.dataset.key;

    tileDeleteZone.classList.add("visible");

    card.classList.add("dragging");

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", draggedTileKey);

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
    e.preventDefault();

    const targetKey = card.dataset.key;

    if (!draggedTileKey || draggedTileKey === targetKey) return;

    const rect = card.getBoundingClientRect();
    const insertAfter = e.clientX > rect.left + rect.width / 2;

    reorderTiles(draggedTileKey, targetKey, insertAfter);

    renderTiles();
  });
}

function reorderTiles(sourceKey, targetKey, insertAfter) {
  const entries = [...uniqueTiles.entries()];

  const sourceIndex = entries.findIndex(([key]) => key === sourceKey);
  const targetIndex = entries.findIndex(([key]) => key === targetKey);

  if (sourceIndex === -1 || targetIndex === -1) return;

  const [movedTile] = entries.splice(sourceIndex, 1);

  let insertIndex = entries.findIndex(([key]) => key === targetKey);

  if (insertAfter) {
    insertIndex += 1;
  }

  entries.splice(insertIndex, 0, movedTile);

  uniqueTiles = new Map(entries);
}

let draggedTileKey = null;

tileDeleteZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  tileDeleteZone.classList.add("drag-over");
});

tileDeleteZone.addEventListener("dragleave", () => {
  tileDeleteZone.classList.remove("drag-over");
});

tileDeleteZone.addEventListener("drop", (e) => {
  e.preventDefault();

  const raw = e.dataTransfer.getData("application/json");

  if (!raw) return;

  const payload = JSON.parse(raw);
  const refs = payload.kind === "tile-selection" ? payload.tiles : [payload];

  removeTileReferences(refs);
  clearTileSelection();

  tileDeleteZone.classList.remove("visible", "drag-over");

  renderTiles();
  renderTilesets();
  updateWorkflowUI();
});

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

tilesContainer.onclick = () => {
  clearTileSelection();
};

function startTileMarquee(e, container, sourceData) {
  if (e.button !== 0) return;
  if (e.target.closest(".tileCard")) return;

  if (!container.contains(e.target)) return;

  e.stopPropagation();

  tileSelectionDrag = {
    startX: e.clientX,
    startY: e.clientY,
    currentX: e.clientX,
    currentY: e.clientY,
    container,
    sourceData,
    additive: e.ctrlKey || e.metaKey,
  };

  tileSelectionDragStartIds = new Set(selectedTiles.keys());

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

  cards.forEach((card) => {
    const rect = card.getBoundingClientRect();

    const intersects =
      rect.left < box.right &&
      rect.right > box.left &&
      rect.top < box.bottom &&
      rect.bottom > box.top;

    const data = JSON.parse(card.dataset.tileData);
    const id = getTileSelectionId(data);

    if (intersects) {
      selectedTiles.set(id, data);
      tileSelectionSource = getTileSelectionGroup(data);
      card.classList.add("selected");
    } else {
      card.classList.remove("selected");
    }
  });

  if (selectedTiles.size === 0) {
    tileSelectionSource = null;
  }
}

window.addEventListener("mousemove", (e) => {
  if (!tileSelectionDrag) return;

  tileSelectionDrag.currentX = e.clientX;
  tileSelectionDrag.currentY = e.clientY;

  updateTileSelectionBox();
});

window.addEventListener("mouseup", () => {
  if (!tileSelectionDrag) return;

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

function idToTileData(id) {
  const parts = id.split(":");

  if (parts[0] === "unique") {
    return JSON.stringify({
      source: "unique",
      key: parts.slice(1).join(":"),
    });
  }

  return JSON.stringify({
    source: "tileset",
    tilesetId: Number(parts[1]),
    index: Number(parts[2]),
  });
}

function getDragTilePayload(singleTileData) {
  const singleId = getTileSelectionId(singleTileData);

  if (!selectedTiles.has(singleId)) {
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
