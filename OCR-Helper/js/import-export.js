function updateJSONOutput() {
  if (game.screens.length === 0) {
    jsonOutput.value = "";
    updateJSONHighlight();
    return;
  }

  jsonOutput.value = stringifyProjectData(getCurrentProjectData());
  updateJSONHighlight();
}

function getCurrentProjectData() {
  return {
    game: game.name,

    tilesets: tilesets.map((tileset) => ({
      name: tileset.name,
      type: normalizeTilesetType(tileset.type),
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
}

function stringifyProjectData(data) {
  let json = JSON.stringify(data, null, 2);

  // Keep 8x8 tile pixels compact without changing the exported shape.
  json = json.replace(
    /"pixels":\s*\[\s*([\d,\s]+?)\s*\]/gs,
    (_, values) => `"pixels": [${values.replace(/\s+/g, " ").trim()}]`,
  );

  return json;
}

function getSafeFileName(name) {
  return (name || "ocr-helper")
    .replace(/[<>:"/\\|?*]+/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function downloadProjectFile(data, fallbackName = "ocr-helper") {
  const blob = new Blob([stringifyProjectData(data)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${getSafeFileName(data.game || fallbackName)}.json`;

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
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

  const savedGames = typeof getSavedGames === "function" ? getSavedGames() : {};
  const entries = Object.entries(savedGames);

  if (entries.length > 0) {
    entries.forEach(([name, data], index) => {
      window.setTimeout(() => {
        downloadProjectFile(data, name);
      }, index * 100);
    });

    return;
  }

  if (game.screens.length > 0) {
    downloadProjectFile(getCurrentProjectData(), game.name);
  }
};

importJSONButton.onclick = () => {
  importJSONFile.click();
};

importJSONFile.onchange = async (e) => {
  const files = [...e.target.files];

  if (files.length === 0) return;

  if (files.length === 1) {
    await importSingleProjectFile(files[0]);
    importJSONFile.value = "";
    return;
  }

  await importMultipleProjects(files);
  importJSONFile.value = "";
};

async function importSingleProjectFile(file) {
  try {
    const data = JSON.parse(await file.text());

    if (!isValidProjectData(data)) {
      showAlert("This does not seem to be a valid OCR JSON file.");
      return;
    }

    const name = data.game || file.name.replace(/\.json$/i, "");

    importProject(data, {
      confirm: !isCurrentProjectEmpty(),
      onComplete: () => {
        const savedGames = getSavedGames();

        savedGames[name] = data;
        setSavedGames(savedGames);
        renderSavedGameList();

        selectedSavedGameName = name;
        updateStorageButtons();
      },
    });
  } catch (err) {
    showAlert("Invalid JSON file.");
    console.error(err);
  }
}

async function importMultipleProjects(files) {
  const imported = [];
  const failed = [];

  for (const file of files) {
    try {
      const data = JSON.parse(await file.text());

      if (!isValidProjectData(data)) {
        failed.push(file.name);
        continue;
      }

      imported.push({
        name: data.game || file.name.replace(/\.json$/i, ""),
        data,
      });
    } catch {
      failed.push(file.name);
    }
  }

  if (imported.length === 0) {
    showAlert("No valid JSON files were found.");
    return;
  }

  showConfirm(
    `Import ${imported.length} JSON file${imported.length === 1 ? "" : "s"} as saved games?`,
    () => {
      const savedGames = getSavedGames();

      imported.forEach(({ name, data }) => {
        savedGames[name] = data;
      });

      setSavedGames(savedGames);
      renderSavedGameList();

      if (failed.length > 0) {
        showAlert(`Imported ${imported.length}. Skipped ${failed.length} invalid file${failed.length === 1 ? "" : "s"}.`);
      }
    },
    null,
    "Import",
    "Cancel",
  );
}

function applyImportedProject(data) {
  game.name = data.game || "";
  document.getElementById("gameName").value = game.name;

  tilesets = data.tilesets.map((tileset, index) => ({
    id: Date.now() + index,
    name: tileset.name || `Tileset ${index + 1}`,
    type: normalizeTilesetType(tileset.type),
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
  if (!isValidProjectData(data)) {
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
    "Load these game settings?\n\nThis will replace the current setup without saving your unsaved settings.",
    finishImport,
    null,
    "Import",
    "Cancel",
  );
}

function isValidProjectData(data) {
  return data && Array.isArray(data.screens) && Array.isArray(data.tilesets);
}
