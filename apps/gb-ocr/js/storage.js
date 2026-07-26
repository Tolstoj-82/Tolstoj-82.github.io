const LOCAL_STORAGE_KEY = "gbOcrHelper.games";
let localSaveCleanName = "";
let localSaveCleanSnapshot = "";

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
  const savedGameNames = Object.keys(savedGames).sort((a, b) =>
    a.localeCompare(b),
  );

  savedGameMenu.innerHTML = "";
  const savedGamePanel = document.querySelector(".savedGamePanel");

  if (savedGamePanel) {
    savedGamePanel.hidden = savedGameNames.length === 0;
  }

  savedGameNames.forEach((name) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "savedGameItem";

    const label = document.createElement("span");
    label.textContent = name;

    const deleteButton = document.createElement("span");
    deleteButton.className = "savedGameDelete roundDeleteButton";
    deleteButton.textContent = "×";
    deleteButton.title = "Delete saved game";

    item.appendChild(label);
    item.appendChild(deleteButton);

    item.onclick = () => {
      selectedSavedGameName = name;
      savedGameMenu.classList.add("hidden");
      updateStorageButtons();

      if (isCurrentProjectEmpty()) {
        loadGameFromLocalStorage();
      }
    };

    deleteButton.onclick = (e) => {
      e.stopPropagation();
      deleteGameFromLocalStorage(name);
    };

    savedGameMenu.appendChild(item);
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

        selectedSavedGameName = name;
        markLocalSaveClean(name);
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

  selectedSavedGameName = name;
  markLocalSaveClean(name);
  updateStorageButtons();
}
function loadGameFromLocalStorage() {
  const name = selectedSavedGameName;

  if (!name) return;

  const savedGames = getSavedGames();
  const data = savedGames[name];

  if (!data) return;

  importProject(data, {
    confirm: !isCurrentProjectEmpty(),
    onComplete: () => {
      selectedSavedGameName = name;
      markLocalSaveClean(name);
      updateStorageButtons();
    },
  });
}

function deleteGameFromLocalStorage(name = selectedSavedGameName) {
  if (!name) return;

  showConfirm(
    `Delete saved game "${name}"?`,
    () => {
      const savedGames = getSavedGames();

      delete savedGames[name];

      setSavedGames(savedGames);
      renderSavedGameList();

      if (selectedSavedGameName === name) {
        clearCurrentProject();
      }

      updateStorageButtons();
    },
    null,
    "Delete",
    "Cancel",
  );
}
saveGameLocalButton.onclick = saveCurrentGameToLocalStorage;
loadSavedGameButton.onclick = loadGameFromLocalStorage;

const twoPlayerPageLink = document.getElementById("twoPlayerPageLink");

twoPlayerPageLink?.addEventListener("click", (event) => {
  if (!hasUnsavedLocalChanges()) return;

  event.preventDefault();
  showConfirm(
    "Open Two Player?\n\nYour unsaved configuration changes will be lost.",
    () => {
      window.location.assign(twoPlayerPageLink.href);
    },
    null,
    "Open Two Player",
    "Stay Here",
  );
});

savedGameDropdownButton.onclick = () => {
  savedGameMenu.classList.toggle("hidden");
};

document.addEventListener("click", (e) => {
  if (e.target.closest(".savedGamePicker")) return;

  savedGameMenu.classList.add("hidden");
});

function updateStorageButtons() {
  const canSaveGame = game.name.trim() !== "" && game.screens.length > 0;
  const hasSelectedSavedGame = selectedSavedGameName !== "";
  const hasLocalChanges = canSaveGame && hasUnsavedLocalChanges();
  const needsSelectedGameLoad = selectedSavedGameNeedsLoad();

  savedGameDropdownButton.textContent =
    selectedSavedGameName || "Saved games...";
  newProjectButton.disabled = isCurrentProjectEmpty();
  saveGameLocalButton.disabled = !canSaveGame;
  loadSavedGameButton.disabled = !hasSelectedSavedGame;
  saveGameLocalButton.classList.toggle("needsLocalSave", hasLocalChanges);
  saveGameLocalButton.classList.toggle("needsAction", hasLocalChanges);
  loadSavedGameButton.classList.toggle("needsLoad", needsSelectedGameLoad);
  loadSavedGameButton.classList.toggle("needsAction", needsSelectedGameLoad);
}

newProjectButton.onclick = () => {
  if (isCurrentProjectEmpty()) return;

  showConfirm(
    "Start a new project?\n\nCurrent settings will be lost.",
    () => {
      clearCurrentProject();
    },
    null,
    "New Project",
    "Cancel",
  );
};

function clearCurrentProject() {
  game = {
    name: "",
    boxartImage: "",
    boxartImages: [],
    demoDetector: {
      metric: "",
      sequence: "",
      startValue: "",
    },
    recognitionScreen: "",
    settings: normalizeGameSettings(),
    screens: [],
  };

  tilesets = [];
  uniqueTiles.clear();
  captureROIIds.clear();
  lastOCRValues = {};
  resetAchievementRuntime({ clearQueue: true });

  activeScreenId = null;
  activeScreenLastVisibleAt = 0;
  activeROI = null;
  selectionMode = "roi";

  updateGameMetadataControls();

  selectedSavedGameName = "";
  localSaveCleanName = "";
  localSaveCleanSnapshot = "";

  renderScreenList();
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
  updateStorageButtons();
  updateJSONOutput();
}

function isCurrentProjectEmpty() {
  return (
    game.name.trim() === "" &&
    game.screens.length === 0 &&
    tilesets.length === 0 &&
    uniqueTiles.size === 0
  );
}

function hasUnsavedLocalChanges() {
  if (isCurrentProjectEmpty() || typeof getCurrentProjectData !== "function") {
    return false;
  }

  const name = game.name.trim();

  if (!name) return true;

  const currentSnapshot = getComparableProjectJSON(getCurrentProjectData());

  if (
    localSaveCleanName === name &&
    localSaveCleanSnapshot === currentSnapshot
  ) {
    return false;
  }

  const savedGames = getSavedGames();
  const saved = savedGames[name];

  if (!saved) return true;

  return (
    getComparableProjectJSON(saved) !==
    currentSnapshot
  );
}

function selectedSavedGameNeedsLoad() {
  return (
    selectedSavedGameName !== "" &&
    !isCurrentProjectEmpty() &&
    selectedSavedGameName !== localSaveCleanName
  );
}

function markLocalSaveClean(name = game.name.trim()) {
  if (!name || typeof getCurrentProjectData !== "function") {
    localSaveCleanName = "";
    localSaveCleanSnapshot = "";
    return;
  }

  localSaveCleanName = name;
  localSaveCleanSnapshot = getComparableProjectJSON(getCurrentProjectData());
}

function getComparableProjectJSON(data) {
  return JSON.stringify(stripProjectExportMetadata(data));
}

function stripProjectExportMetadata(data) {
  if (!data || typeof data !== "object") return data;

  const { exportedAt, exportVersion, ...projectData } = data;

  return projectData;
}
