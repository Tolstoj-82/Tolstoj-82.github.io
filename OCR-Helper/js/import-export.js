const PROJECT_EXPORT_VERSION = 1;

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
  const gameDemoDetector = game.demoDetector || {};

  return {
    exportVersion: PROJECT_EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    game: game.name,
    boxartImage: game.boxartImage || "",
    boxartImages: Array.isArray(game.boxartImages) ? game.boxartImages : [],
    ...(hasExportableDemoDetector(gameDemoDetector)
      ? { demoDetector: gameDemoDetector }
      : {}),
    recognitionScreen: game.recognitionScreen || "",
    settings: normalizeGameSettings(game.settings),

    tilesets: tilesets.map((tileset) => ({
      name: tileset.name,
      type: normalizeTilesetType(tileset.type),
      scanPixels: getTilesetScanPixels(tileset),
      tiles: tileset.tiles,
    })),

    screens: game.screens.map((screen) => ({
      name: screen.name,
      identifierMatchCount: screen.identifierMatchCount || "all",
      ...(hasExportableDemoDetector(screen.demoDetector)
        ? { demoDetector: screen.demoDetector }
        : {}),

      identifiers: screen.identifiers.map((id) => ({
        tile: id.tile,
        pixels: id.pixels,
      })),

      rois: screen.rois.map((r) => ({
        name: r.name,
        tiles: sortTileKeysByReadingOrder(r.tiles),
        tileset:
          tilesets.find((tileset) => tileset.id === r.tilesetId)?.name || null,
      })),

      achievements: (screen.achievements || []).map((achievement) => ({
        metric: achievement.metric,
        comparer: achievement.comparer,
        value: achievement.value,
        message: achievement.message,
        tier: normalizeAchievementTier(achievement.tier),
        resetScreens: normalizeAchievementResetScreens(achievement),
        enabled: achievement.enabled !== false,
      })),
    })),
  };
}

function hasExportableDemoDetector(value = {}) {
  const metric = String(value.metric || value.demoMetric || "").trim();
  const sequence = String(value.sequence || value.demoSequence || "").trim();
  const mode = value.mode === "held" ? "held" : "sequence";
  const heldValue = String(value.heldValue || value.targetValue || "").trim();
  const stopScreens = value.stopScreens || value.trackUntilScreens;
  const hasDraftValues = Boolean(
    metric || sequence || heldValue ||
      (Array.isArray(stopScreens) && stopScreens.length),
  );
  const created = value.created === true || value.demoDetectorCreated === true;

  const usable = mode === "held"
    ? Boolean(metric && heldValue)
    : Boolean(metric && sequence);

  return Boolean((created && hasDraftValues) || usable);
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

function normalizeImportedDemoDetector(value = {}) {
  const metric = String(value.metric || value.demoMetric || "");
  const sequence = Array.isArray(value.sequence || value.demoSequence)
    ? (value.sequence || value.demoSequence).join(", ")
    : String(value.sequence || value.demoSequence || "");
  const startValue = String(value.startValue || value.demoStartValue || "");
  const created = value.created === true || value.demoDetectorCreated === true;
  const stopScreens = Array.isArray(value.stopScreens || value.trackUntilScreens)
    ? (value.stopScreens || value.trackUntilScreens)
        .map((item) => String(item || "").trim())
        .filter(Boolean)
    : [];
  const mode = value.mode === "held" ? "held" : "sequence";
  const heldValue = String(value.heldValue || value.targetValue || "");
  const holdMs = Number.isFinite(Number(value.holdMs))
    ? Math.max(0, Math.round(Number(value.holdMs)))
    : 2000;
  const confirmOnScreenExit = value.confirmOnScreenExit !== false;

  return {
    created,
    enabled: created || Boolean(
      metric && (mode === "held" ? heldValue : sequence),
    ),
    metric,
    sequence,
    startValue,
    stopScreens,
    mode,
    heldValue,
    holdMs,
    confirmOnScreenExit,
  };
}

function getSafeFileName(name) {
  return (name || "ocr-helper")
    .replace(/[<>:"/\\|?*]+/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function downloadProjectFile(data, fallbackName = "ocr-helper") {
  const exportData = addExportMetadata(data);
  const blob = new Blob([stringifyProjectData(exportData)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${getSafeFileName(exportData.game || fallbackName)}.json`;

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function addExportMetadata(data, exportedAt = new Date().toISOString()) {
  return {
    ...data,
    exportVersion: PROJECT_EXPORT_VERSION,
    exportedAt,
  };
}

function getProjectTimestamp(data, file) {
  const exportedAt = Date.parse(data.exportedAt || "");

  if (Number.isFinite(exportedAt)) {
    return exportedAt;
  }

  return file?.lastModified || 0;
}

function getProjectTimestampLabel(timestamp) {
  if (!timestamp) return "no export date";

  return new Date(timestamp).toLocaleString();
}

function formatImportSummaryItem(item) {
  const timestamp = getProjectTimestampLabel(item.timestamp);

  return `${item.name}: ${item.fileName} (${timestamp})`;
}

function appendImportSummaryList(
  parent,
  title,
  items,
  variant = "",
  options = {},
) {
  const sectionTitle = document.createElement("p");
  const titleLabel = document.createElement("strong");

  sectionTitle.className = "importSummaryTitle";

  if (variant) {
    sectionTitle.classList.add(`importSummaryTitle-${variant}`);
  }

  titleLabel.textContent = title;
  sectionTitle.appendChild(titleLabel);
  parent.appendChild(sectionTitle);

  const list = document.createElement("ul");
  list.className = "importSummaryList";

  items.forEach((item) => {
    const listItem = document.createElement("li");
    const isOverwrite = options.overwrittenNames?.has(item.name);

    listItem.textContent =
      typeof item === "string" ? item : formatImportSummaryItem(item);

    if (isOverwrite) {
      const marker = document.createElement("span");

      marker.className = "importSummaryOverwriteMarker";
      marker.textContent = " overwrite";
      listItem.appendChild(marker);
    }

    list.appendChild(listItem);
  });

  parent.appendChild(list);
}

function getImportDuplicateResolution(imported) {
  const byName = new Map();
  const dropped = [];

  imported.forEach((item, index) => {
    const current = byName.get(item.name);
    const rankedItem = { ...item, index };

    if (
      !current ||
      rankedItem.timestamp > current.timestamp ||
      (rankedItem.timestamp === current.timestamp &&
        rankedItem.index > current.index)
    ) {
      if (current) {
        dropped.push(current);
      }

      byName.set(rankedItem.name, rankedItem);
      return;
    }

    dropped.push(rankedItem);
  });

  return {
    kept: [...byName.values()],
    dropped,
  };
}

function getImportOverwrites(kept, savedGames) {
  return kept.filter((item) => {
    return Object.prototype.hasOwnProperty.call(savedGames, item.name);
  });
}

function buildMultipleImportContent(kept, dropped, failed, overwritten) {
  const fileWord = kept.length === 1 ? "file" : "files";
  const hasDuplicates = dropped.length > 0;
  const content = document.createElement("div");

  content.className = "importSummary";

  const title = document.createElement("p");
  title.textContent = hasDuplicates
    ? `Import ${kept.length} JSON ${fileWord} as saved games?`
    : "Import";
  content.appendChild(title);

  if (hasDuplicates) {
    const info = document.createElement("p");

    info.textContent =
      "Duplicate game names were found. The latest export for each game will be kept.";

    content.appendChild(info);
  }

  const listWrapper = document.createElement("div");
  listWrapper.className = "importSummaryScroll";

  if (hasDuplicates) {
    appendImportSummaryList(listWrapper, "Keep", kept, "keep", {
      overwrittenNames: new Set(overwritten.map((item) => item.name)),
    });
  } else {
    const prompt = document.createElement("p");

    prompt.textContent = `Import ${kept.length} JSON ${fileWord} as saved games?`;
    listWrapper.appendChild(prompt);
    appendImportSummaryList(listWrapper, "Games", kept, "", {
      overwrittenNames: new Set(overwritten.map((item) => item.name)),
    });
  }

  if (hasDuplicates) {
    appendImportSummaryList(
      listWrapper,
      "Ignore (Duplicates)",
      dropped,
      "ignored",
    );
  }

  if (failed.length > 0) {
    appendImportSummaryList(listWrapper, "Invalid files skipped", failed);
  }

  content.appendChild(listWrapper);

  return content;
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
  const entries = getExportableGameEntries(savedGames);

  if (entries.length > 0) {
    showSavedGameDownloadDialog(entries);
    return;
  }

  if (game.screens.length > 0) {
    const currentData = getCurrentProjectData();

    saveCurrentProjectBeforeExport(savedGames, currentData);
    downloadProjectFile(currentData, game.name);
  }
};

function getExportableGameEntries(savedGames) {
  const entries = Object.entries(savedGames);
  const currentName = game.name.trim();

  if (!currentName || game.screens.length === 0 || !hasUnsavedLocalChanges()) {
    return entries;
  }

  const currentData = getCurrentProjectData();
  const existingIndex = entries.findIndex(([name]) => name === currentName);

  if (existingIndex >= 0) {
    entries[existingIndex] = [currentName, currentData];
  } else {
    entries.push([currentName, currentData]);
  }

  return entries;
}

function saveCurrentProjectBeforeExport(savedGames, currentData = null) {
  const name = game.name.trim();

  if (!name || game.screens.length === 0 || !hasUnsavedLocalChanges()) {
    return false;
  }

  savedGames[name] = currentData || getCurrentProjectData();
  setSavedGames(savedGames);
  renderSavedGameList();
  selectedSavedGameName = name;

  if (typeof markLocalSaveClean === "function") {
    markLocalSaveClean(name);
  }

  updateStorageButtons();
  return true;
}

function showSavedGameDownloadDialog(entries) {
  const sortedEntries = entries.sort(([a], [b]) => a.localeCompare(b));
  const savedNames = new Set(sortedEntries.map(([name]) => name));
  const initialSelection =
    !isCurrentProjectEmpty() && savedNames.has(game.name.trim() || selectedSavedGameName)
      ? [game.name.trim() || selectedSavedGameName]
      : null;

  showCheckboxList(
    "Export saved game JSONs",
    sortedEntries.map(([name]) => ({
      value: name,
      label: name,
    })),
    (selectedNames) => {
      const selected = new Set(selectedNames);
      const selectedCurrentProject = selected.has(game.name.trim());
      const savedGames = typeof getSavedGames === "function" ? getSavedGames() : {};

      if (selectedCurrentProject) {
        saveCurrentProjectBeforeExport(savedGames);
      }

      sortedEntries
        .filter(([name]) => selected.has(name))
        .forEach(([name, data], index) => {
          const exportData = name === game.name.trim() ? getCurrentProjectData() : data;

          window.setTimeout(() => {
            downloadProjectFile(exportData, name);
          }, index * 100);
        });
    },
    null,
    "Export",
    "Cancel",
    initialSelection,
  );
}

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
    const savedGames = getSavedGames();
    const overwritesSavedGame = Object.prototype.hasOwnProperty.call(
      savedGames,
      name,
    );
    const replacesCurrentSetup = !isCurrentProjectEmpty();

    const finishSingleImport = () => {
      importProject(data, {
        confirm: false,
        onComplete: () => {
          const savedGames = getSavedGames();

          savedGames[name] = data;
          setSavedGames(savedGames);
          renderSavedGameList();

          selectedSavedGameName = name;
          if (typeof markLocalSaveClean === "function") {
            markLocalSaveClean(name);
          }
          updateStorageButtons();
        },
      });
    };

    if (overwritesSavedGame || replacesCurrentSetup) {
      showConfirm(
        getSingleImportConfirmMessage(name, {
          overwritesSavedGame,
          replacesCurrentSetup,
        }),
        finishSingleImport,
        null,
        "Import",
        "Cancel",
      );
      return;
    }

    finishSingleImport();
  } catch (err) {
    showAlert("Invalid JSON file.");
    console.error(err);
  }
}

function getSingleImportConfirmMessage(
  name,
  { overwritesSavedGame, replacesCurrentSetup },
) {
  const details = [];

  if (overwritesSavedGame) {
    details.push(`- Saved game: "${name}" already exists and will be overwritten.`);
  }

  if (replacesCurrentSetup) {
    details.push("- Current setup: current settings will be lost.");
  }

  return `Load these game settings?\n\n${details.join("\n")}`;
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
        fileName: file.name,
        timestamp: getProjectTimestamp(data, file),
        data: data.exportedAt
          ? data
          : addExportMetadata(
              data,
              file.lastModified
                ? new Date(file.lastModified).toISOString()
                : new Date().toISOString(),
            ),
      });
    } catch {
      failed.push(file.name);
    }
  }

  if (imported.length === 0) {
    showAlert("No valid JSON files were found.");
    return;
  }

  const { kept, dropped } = getImportDuplicateResolution(imported);
  const savedGames = getSavedGames();
  const overwritten = getImportOverwrites(kept, savedGames);

  showConfirmContent(
    buildMultipleImportContent(kept, dropped, failed, overwritten),
    () => {
      const savedGames = getSavedGames();

      kept.forEach(({ name, data }) => {
        savedGames[name] = data;
      });

      setSavedGames(savedGames);
      renderSavedGameList();
    },
    null,
    "Import",
    "Cancel",
  );
}

function applyImportedProject(data) {
  game.name = data.game || "";
  game.boxartImage = String(data.boxartImage || "");
  game.boxartImages = Array.isArray(data.boxartImages)
    ? data.boxartImages.map((item) => String(item || "")).filter(Boolean)
    : game.boxartImage
      ? [game.boxartImage]
      : [];
  game.demoDetector = normalizeImportedDemoDetector(data.demoDetector);
  game.recognitionScreen = String(data.recognitionScreen || "");
  game.settings = normalizeGameSettings(data.settings);

  tilesets = data.tilesets.map((tileset, index) => ({
    id: Date.now() + index,
    name: tileset.name || `Tileset ${index + 1}`,
    type: normalizeTilesetType(tileset.type),
    scanPixels: normalizeScanPixels(tileset.scanPixels),
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
    identifierMatchCount:
      screen.identifierMatchCount === "all" ||
      Number.isFinite(Number(screen.identifierMatchCount))
        ? screen.identifierMatchCount
        : "all",
    demoDetector: normalizeImportedDemoDetector(screen.demoDetector),

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

    achievements: normalizeImportedAchievements(screen.achievements),
  }));

  if (!game.screens.some((screen) => screen.name === game.recognitionScreen)) {
    game.recognitionScreen = "";
  }

  clearMissingAchievementLifecycleScreens();

  activeScreenId = game.screens[0]?.id || null;
  activeScreenLastVisibleAt = 0;
  activeROI = game.screens[0]?.rois[0]?.id || null;

  uniqueTiles.clear();
  captureROIIds.clear();
  lastOCRValues = {};
  resetAchievementRuntime({ clearQueue: true });

  renderScreenList();
  updateGameMetadataControls();
  updateScreenSetupTitle();
  renderROIList();
  renderAchievementList();
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
