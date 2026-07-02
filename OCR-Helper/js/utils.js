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

function tilesEqual(a, b) {
  return a.length === b.length && a.every((value, i) => value === b[i]);
}

function formatROIValue(labels, type) {
  if (labels.length === 0) return "--";

  switch (type) {
    case "integer":
    case "text":
    case "tokens":
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
