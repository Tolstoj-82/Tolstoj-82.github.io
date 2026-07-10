function getActiveScreen() {
  return game.screens.find((s) => s.id === activeScreenId);
}

function getActiveScreenROIs() {
  return getActiveScreen()?.rois || [];
}

function normalizeGameSettings(settings = {}) {
  const grace = Number(settings.screenDetectionGraceMs);

  return {
    screenDetectionGraceMs: Number.isFinite(grace)
      ? Math.max(0, Math.min(1000, Math.round(grace)))
      : DEFAULT_SCREEN_DETECTION_GRACE_MS,
    stallOcrOnUnknownTiles: Boolean(settings.stallOcrOnUnknownTiles),
  };
}

function getScreenDetectionGraceMs(gameData = game) {
  return normalizeGameSettings(gameData?.settings).screenDetectionGraceMs;
}

function getRequiredIdentifierCount(screen) {
  const identifierCount = screen?.identifiers?.length || 0;

  if (identifierCount === 0) return 0;

  if (screen.identifierMatchCount === "all") return identifierCount;

  const configured = Number(screen.identifierMatchCount);

  if (!Number.isFinite(configured)) return identifierCount;

  return Math.max(1, Math.min(identifierCount, Math.round(configured)));
}

function countVisibleIdentifiers(screen, tileGetter = getTile) {
  if (!Array.isArray(screen?.identifiers)) return 0;

  return screen.identifiers.filter((identifier) => {
    const [x, y] = identifier.tile.split(",").map(Number);

    return tilesEqual(tileGetter(x, y), identifier.pixels || []);
  }).length;
}

function screenMatchesByIdentifiers(screen, tileGetter = getTile) {
  const required = getRequiredIdentifierCount(screen);

  return required > 0 && countVisibleIdentifiers(screen, tileGetter) >= required;
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

function sortTileKeysByReadingOrder(keys) {
  return [...keys].sort((a, b) => {
    const [ax, ay] = a.split(",").map(Number);
    const [bx, by] = b.split(",").map(Number);

    return ay - by || ax - bx;
  });
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

function normalizeScanPixels(scanPixels) {
  if (!Array.isArray(scanPixels)) return [];

  return [...new Set(scanPixels.map(Number))]
    .filter((index) => Number.isInteger(index) && index >= 0 && index < TILE * TILE)
    .sort((a, b) => a - b);
}

function tilesEqual(a, b, scanPixels = null) {
  if (!scanPixels || scanPixels.length === 0) {
    return a.length === b.length && a.every((value, i) => value === b[i]);
  }

  return scanPixels.every((index) => a[index] === b[index]);
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
  const scanPixels =
    useOptimizedTileScan && isUsableScanPixelSet(tileset.scanPixels)
      ? tileset.scanPixels
      : null;
  const match = tileset.tiles.find((tile) => {
    return tilesEqual(tile.pixels, pixels, scanPixels);
  });

  return match ? match.label : null;
}

function isUsableScanPixelSet(scanPixels) {
  return (
    Array.isArray(scanPixels) &&
    scanPixels.length > 0 &&
    scanPixels.length < TILE * TILE
  );
}

function getTilesetScanPixels(tileset) {
  const normalized = normalizeScanPixels(tileset.scanPixels);

  if (tilesetScanPixelsAreValid(tileset.tiles, normalized)) {
    tileset.scanPixels = normalized;
    return normalized;
  }

  tileset.scanPixels = calculateTilesetScanPixels(tileset.tiles);

  return tileset.scanPixels;
}

function calculateTilesetScanPixels(tiles) {
  if (!tilesetCanBeDistinguished(tiles)) {
    return getAllTilePixelIndexes();
  }

  const unresolvedPairs = getDifferentTilePairs(tiles);
  const selected = [];

  while (unresolvedPairs.length > 0) {
    const bestPixel = findBestDistinguishingPixel(unresolvedPairs, selected);

    if (bestPixel === null) {
      return getAllTilePixelIndexes();
    }

    selected.push(bestPixel);

    for (let i = unresolvedPairs.length - 1; i >= 0; i--) {
      const [a, b] = unresolvedPairs[i];

      if (a.pixels[bestPixel] !== b.pixels[bestPixel]) {
        unresolvedPairs.splice(i, 1);
      }
    }
  }

  return selected.sort((a, b) => a - b);
}

function tilesetCanBeDistinguished(tiles) {
  const seen = new Set();

  for (const tile of tiles) {
    const key = (tile.pixels || []).join("");

    if (seen.has(key)) return false;

    seen.add(key);
  }

  return true;
}

function tilesetScanPixelsAreValid(tiles, scanPixels) {
  if (tiles.length === 0) return scanPixels.length === 0;
  if (!tilesetCanBeDistinguished(tiles)) return scanPixels.length === TILE * TILE;
  if (scanPixels.length === 0) return false;

  for (let a = 0; a < tiles.length; a++) {
    for (let b = a + 1; b < tiles.length; b++) {
      if (tilesEqual(tiles[a].pixels, tiles[b].pixels, scanPixels)) {
        return false;
      }
    }
  }

  return true;
}

function getDifferentTilePairs(tiles) {
  const pairs = [];

  for (let a = 0; a < tiles.length; a++) {
    for (let b = a + 1; b < tiles.length; b++) {
      pairs.push([tiles[a], tiles[b]]);
    }
  }

  return pairs;
}

function findBestDistinguishingPixel(pairs, selected) {
  const selectedSet = new Set(selected);
  let bestPixel = null;
  let bestScore = 0;

  for (let index = 0; index < TILE * TILE; index++) {
    if (selectedSet.has(index)) continue;

    const score = pairs.reduce((total, [a, b]) => {
      return total + (a.pixels[index] !== b.pixels[index] ? 1 : 0);
    }, 0);

    if (score > bestScore) {
      bestScore = score;
      bestPixel = index;
    }
  }

  return bestPixel;
}

function getAllTilePixelIndexes() {
  return Array.from({ length: TILE * TILE }, (_, index) => index);
}
