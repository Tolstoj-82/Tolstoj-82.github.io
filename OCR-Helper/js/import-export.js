function updateJSONOutput() {
  if (game.screens.length === 0) {
    jsonOutput.value = "";
    updateJSONHighlight();
    return;
  }

  const data = {
    game: game.name,

    tilesets: tilesets.map((tileset) => ({
      name: tileset.name,
      type: tileset.type || "text-number",
      tiles: tileset.tiles,
    })),

    screens: game.screens.map((screen) => ({
      name: screen.name,

      identifiers: screen.identifiers.map((id) => ({
        tile: id.tile,
        pixels: id.pixels,
      })),

      rois: screen.rois.map((r) => ({
        name: r.name,
        tiles: [...r.tiles],
        tileset:
          tilesets.find((tileset) => tileset.id === r.tilesetId)?.name || null,
      })),
    })),
  };

  let json = JSON.stringify(data, null, 2);

  // Keep 8x8 tile pixels compact without changing the exported shape.
  json = json.replace(
    /"pixels":\s*\[\s*([\d,\s]+?)\s*\]/gs,
    (_, values) => `"pixels": [${values.replace(/\s+/g, " ").trim()}]`,
  );

  jsonOutput.value = json;
  updateJSONHighlight();
}

function escapeHTML(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function updateJSONHighlight() {
  const escaped = escapeHTML(jsonOutput.value);

  jsonHighlight.innerHTML = escaped.replace(
    /("(?:\\.|[^"\\])*"(?=\s*:))|("(?:\\.|[^"\\])*")|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|\b(true|false|null)\b/g,
    (match, key, string, number, literal) => {
      if (key) return `<span class="jsonKey">${match}</span>`;
      if (string) return `<span class="jsonString">${match}</span>`;
      if (number) return `<span class="jsonNumber">${match}</span>`;
      if (literal) return `<span class="jsonLiteral">${match}</span>`;
      return match;
    },
  );

  jsonHighlight.scrollTop = jsonOutput.scrollTop;
  jsonHighlight.scrollLeft = jsonOutput.scrollLeft;
}

jsonOutput.addEventListener("input", updateJSONHighlight);

jsonOutput.addEventListener("scroll", () => {
  jsonHighlight.scrollTop = jsonOutput.scrollTop;
  jsonHighlight.scrollLeft = jsonOutput.scrollLeft;
});

document.getElementById("downloadJSON").onclick = () => {
  updateJSONOutput();

  const blob = new Blob([jsonOutput.value], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${game.name || "ocr-helper"}.json`;

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

importJSONButton.onclick = () => {
  importJSONFile.click();
};

importJSONFile.onchange = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      importProject(data);
    } catch (err) {
      showAlert("Invalid JSON file.");
      console.error(err);
    }
  };

  reader.readAsText(file);

  importJSONFile.value = "";
};

function applyImportedProject(data) {
  game.name = data.game || "";
  document.getElementById("gameName").value = game.name;

  tilesets = data.tilesets.map((tileset, index) => ({
    id: Date.now() + index,
    name: tileset.name || `Tileset ${index + 1}`,
    type: tileset.type || "text-number",
    tiles: Array.isArray(tileset.tiles)
      ? tileset.tiles.map((tile) => ({
          pixels: tile.pixels || [],
          label: tile.label || "",
        }))
      : [],
  }));

  const tilesetIdByName = new Map(
    tilesets.map((tileset) => [tileset.name, tileset.id]),
  );

  game.screens = data.screens.map((screen, screenIndex) => ({
    id: Date.now() + 1000 + screenIndex,
    name: screen.name || `Screen ${screenIndex + 1}`,
    color: screenColors[screenIndex % screenColors.length],

    identifiers: Array.isArray(screen.identifiers)
      ? screen.identifiers.map((identifier) => ({
          tile: identifier.tile,
          pixels: identifier.pixels || [],
        }))
      : [],

    rois: Array.isArray(screen.rois)
      ? screen.rois.map((roi, roiIndex) => ({
          id: Date.now() + 2000 + screenIndex * 100 + roiIndex,
          name: roi.name || `Region ${roiIndex + 1}`,
          color: roiColors[roiIndex % roiColors.length],
          tiles: new Set(roi.tiles || []),
          tilesetId: tilesetIdByName.get(roi.tileset) || null,
        }))
      : [],
  }));

  activeScreenId = game.screens[0]?.id || null;
  activeROI = game.screens[0]?.rois[0]?.id || null;

  uniqueTiles.clear();
  captureROIIds.clear();
  lastOCRValues = {};

  renderScreenList();
  updateScreenSetupTitle();
  renderROIList();
  renderCaptureROIPicker();
  renderIdentifierInfo();
  renderROIReadout();
  renderTiles();
  renderTilesets();
  drawROIOverlay();

  updateWorkflowUI();
  updateJSONOutput();
}

function importProject(data, options = {}) {
  if (!data || !Array.isArray(data.screens) || !Array.isArray(data.tilesets)) {
    showAlert("This does not seem to be a valid OCR JSON file.");
    return;
  }

  const { confirm = true, onComplete = null } = options;

  const finishImport = () => {
    applyImportedProject(data);

    if (onComplete) {
      onComplete();
    }
  };

  if (!confirm) {
    finishImport();
    return;
  }

  showConfirm(
    "Import this JSON?\n\nThis will replace the current setup.",
    finishImport,
    null,
    "Import",
    "Cancel",
  );
}
