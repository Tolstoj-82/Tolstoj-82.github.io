const LOCAL_STORAGE_KEY = "gbOcrHelper.games";

function getSavedGames() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function setSavedGames(savedGames) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedGames));
}

function renderSavedGameList() {
  const savedGames = getSavedGames();

  savedGameSelect.innerHTML = "";

  const empty = document.createElement("option");
  empty.value = "";
  empty.textContent = "Saved games...";
  savedGameSelect.appendChild(empty);

  Object.keys(savedGames)
    .sort((a, b) => a.localeCompare(b))
    .forEach((name) => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      savedGameSelect.appendChild(option);
    });
  updateStorageButtons();
}

function saveCurrentGameToLocalStorage() {
  updateJSONOutput();

  if (!jsonOutput.value.trim()) {
    showAlert("Nothing to save yet.");
    return;
  }

  const name = game.name.trim();

  if (!name) {
    showAlert("Enter a game name first.");
    return;
  }

  const savedGames = getSavedGames();

  if (savedGames[name]) {
    showConfirm(
      `A local game named "${name}" already exists.\n\nOverwrite it?`,
      () => {
        savedGames[name] = JSON.parse(jsonOutput.value);

        setSavedGames(savedGames);
        renderSavedGameList();

        savedGameSelect.value = name;
        updateStorageButtons();
      },
      null,
      "Overwrite",
      "Cancel",
    );

    return;
  }

  savedGames[name] = JSON.parse(jsonOutput.value);

  setSavedGames(savedGames);
  renderSavedGameList();

  savedGameSelect.value = name;
  updateStorageButtons();
}

function loadGameFromLocalStorage() {
  const name = savedGameSelect.value;

  if (!name) return;

  const savedGames = getSavedGames();
  const data = savedGames[name];

  if (!data) return;

  importProject(data);
  updateJSONOutput();

  savedGameSelect.value = name;
  updateStorageButtons();
}

function deleteGameFromLocalStorage() {
  const name = savedGameSelect.value;

  if (!name) return;

  showConfirm(
    `Delete saved game "${name}"?`,
    () => {
      const savedGames = getSavedGames();

      delete savedGames[name];

      setSavedGames(savedGames);
      renderSavedGameList();

      savedGameSelect.value = "";
      updateStorageButtons();
    },
    null,
    "Delete",
    "Cancel",
  );
}

saveGameLocalButton.onclick = saveCurrentGameToLocalStorage;
loadSavedGameButton.onclick = loadGameFromLocalStorage;
deleteSavedGameButton.onclick = deleteGameFromLocalStorage;

function updateStorageButtons() {
  const canSaveGame = game.name.trim() !== "" && game.screens.length > 0;
  const hasSelectedSavedGame = savedGameSelect.value !== "";

  deleteSavedGameButton.hidden = !hasSelectedSavedGame;
  saveGameLocalButton.disabled = !canSaveGame;
  loadSavedGameButton.disabled = !hasSelectedSavedGame;
  deleteSavedGameButton.disabled = !hasSelectedSavedGame;
}

newProjectButton.onclick = () => {
  showConfirm(
    "Start a new project?\n\nCurrent screens, ROIs, tiles and tilesets will be cleared.",
    () => {
      game = {
        name: "",
        screens: [],
      };

      tilesets = [];
      uniqueTiles.clear();
      captureROIIds.clear();
      lastOCRValues = {};

      activeScreenId = null;
      activeROI = null;
      selectionMode = "roi";

      calibrationReminder = false;

      document.getElementById("gameName").value = "";

      savedGameSelect.value = "";

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
      updateStorageButtons();
    },
    null,
    "New Project",
    "Cancel",
  );
};

function isCurrentProjectEmpty() {
  return (
    game.name.trim() === "" &&
    game.screens.length === 0 &&
    tilesets.length === 0 &&
    uniqueTiles.size === 0
  );
}

savedGameSelect.onchange = () => {
  updateStorageButtons();

  if (!savedGameSelect.value) return;

  if (isCurrentProjectEmpty()) {
    loadGameFromLocalStorage();
  }
};
