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
    alert("Nothing to save yet.");
    return;
  }

  const name = game.name.trim();

  if (!name) {
    alert("Enter a game name first.");
    return;
  }

  const savedGames = getSavedGames();

  if (savedGames[name]) {
    const overwrite = confirm(
      `A local game named "${name}" already exists. Overwrite it?`,
    );

    if (!overwrite) return;
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

  if (!confirm(`Delete saved game "${name}"?`)) return;

  const savedGames = getSavedGames();
  delete savedGames[name];

  setSavedGames(savedGames);
  renderSavedGameList();

  savedGameSelect.value = "";
}

saveGameLocalButton.onclick = saveCurrentGameToLocalStorage;
loadSavedGameButton.onclick = loadGameFromLocalStorage;
deleteSavedGameButton.onclick = deleteGameFromLocalStorage;
savedGameSelect.onchange = updateStorageButtons;

function updateStorageButtons() {
  const canSaveGame = game.name.trim() !== "" && game.screens.length > 0;
  const hasSelectedSavedGame = savedGameSelect.value !== "";

  saveGameLocalButton.disabled = !canSaveGame;
  loadSavedGameButton.disabled = !hasSelectedSavedGame;
  deleteSavedGameButton.disabled = !hasSelectedSavedGame;
}
