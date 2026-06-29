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

    div.draggable = true;
    div.dataset.key = key;

    addTileDragHandlers(div);

    tilesContainer.appendChild(div);
  });

  tileCount.textContent = uniqueTiles.size;
}

function addTileDragHandlers(card) {
  card.addEventListener("dragstart", (e) => {
    draggedTileKey = card.dataset.key;

    tileDeleteZone.classList.add("visible");

    card.classList.add("dragging");

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", draggedTileKey);

    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        source: "unique",
        key: draggedTileKey,
      }),
    );
  });

  card.addEventListener("dragend", () => {
    draggedTileKey = null;

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

  if (raw) {
    const data = JSON.parse(raw);

    if (data.source === "tileset") {
      const tileset = tilesets.find((t) => t.id === Number(data.tilesetId));

      if (tileset) {
        tileset.tiles.splice(Number(data.index), 1);
      }

      tileDeleteZone.classList.remove("visible", "drag-over");

      renderTilesets();
      updateWorkflowUI();
      return;
    }
  }

  const key = e.dataTransfer.getData("text/plain");

  if (!key) return;

  uniqueTiles.delete(key);

  tileDeleteZone.classList.remove("visible", "drag-over");

  renderTiles();
});
