// Export
//--------------------------------

function updateJSONOutput() {
  // only start generating a JSON once at least one screen exists
  if (game.screens.length === 0) {
    jsonOutput.value = "";
    return;
  }

  const data = {
    game: game.name,

    tilesets: tilesets.map((tileset) => ({
      name: tileset.name,
      type: tileset.type || "integer",
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

  json = json.replace(
    /"pixels":\s*\[\s*([\d,\s]+?)\s*\]/gs,
    (_, values) => `"pixels": [${values.replace(/\s+/g, " ").trim()}]`,
  );

  jsonOutput.value = json;
}

// Download
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

// Import
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
      alert("Invalid JSON file.");
      console.error(err);
    }
  };

  reader.readAsText(file);

  importJSONFile.value = "";
};

function importProject(data) {
  if (!data || !Array.isArray(data.screens) || !Array.isArray(data.tilesets)) {
    alert("This does not look like a valid OCR Helper JSON file.");
    return;
  }

  if (!confirm("Import this JSON? This will replace the current setup.")) {
    return;
  }

  //palette = Array.isArray(data.palette) ? data.palette : palette;
  game.name = data.game || "";

  document.getElementById("gameName").value = game.name;

  tilesets = data.tilesets.map((tileset, index) => ({
    id: Date.now() + index,
    name: tileset.name || `Tileset ${index + 1}`,
    type: tileset.type || "integer",
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
          name: roi.name || `ROI ${roiIndex + 1}`,
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

  //updatePalette();
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

  alert(
    "Project loaded. Calibration may be needed again for the current capture.",
  );

  jsonOutput.value = JSON.stringify(data, null, 2);
}
