function getActiveScreen() {
  return game.screens.find((s) => s.id === activeScreenId);
}

function getActiveScreenROIs() {
  return getActiveScreen()?.rois || [];
}

function roiOverlayColor(color) {
  return color.replace("rgb(", "rgba(").replace(")", ",0.35)");
}

function getTile(tx, ty) {
  let arr = [];

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      arr.push(quantized[(ty * 8 + y) * WIDTH + tx * 8 + x]);
    }
  }

  return arr;
}

function reorderArrayItem(items, sourceId, targetId, insertAfter, getId) {
  const sourceIndex = items.findIndex((item) => getId(item) === sourceId);
  const targetIndex = items.findIndex((item) => getId(item) === targetId);

  if (sourceIndex === -1 || targetIndex === -1) return;

  const [moved] = items.splice(sourceIndex, 1);
  let insertIndex = items.findIndex((item) => getId(item) === targetId);

  if (insertAfter) {
    insertIndex += 1;
  }

  items.splice(insertIndex, 0, moved);
}

// Old saved games are folded into the two current tileset modes.
function normalizeTilesetType(type) {
  return type === "counter" ? "counter" : "text-number";
}

function tilesEqual(a, b) {
  return a.length === b.length && a.every((value, i) => value === b[i]);
}

function formatROIValue(labels, type) {
  if (labels.length === 0) return "--";

  switch (type) {
    case "text-number": {
      const value = labels.join("");

      return /^\d+$/.test(value) ? value.replace(/^0+/, "") || "0" : value;
    }

    case "counter": {
      return String(
        labels.reduce((sum, label) => sum + (parseInt(label, 10) || 0), 0),
      );
    }

    default: {
      return labels.join("");
    }
  }
}

function findTileLabelInTileset(pixels, tileset) {
  const match = tileset.tiles.find((tile) => tilesEqual(tile.pixels, pixels));

  return match ? match.label : null;
}
