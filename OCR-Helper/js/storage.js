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
    deleteButton.className = "savedGameDelete";
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

  savedGameDropdownButton.textContent =
    selectedSavedGameName || "Saved games...";
  newProjectButton.disabled = isCurrentProjectEmpty();
  saveGameLocalButton.disabled = !canSaveGame;
  loadSavedGameButton.disabled = !hasSelectedSavedGame;
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
    screens: [],
  };

  tilesets = [];
  uniqueTiles.clear();
  captureROIIds.clear();
  lastOCRValues = {};
  resetAchievementRuntime({ clearQueue: true });

  activeScreenId = null;
  activeROI = null;
  selectionMode = "roi";

  document.getElementById("gameName").value = "";

  selectedSavedGameName = "";

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
