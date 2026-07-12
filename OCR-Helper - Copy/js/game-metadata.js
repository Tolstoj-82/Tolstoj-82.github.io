const BOXART_THUMBNAIL_BASE = "Games/boxart/thumbnail/";
const BOXART_BIG_BASE = "Games/boxart/bigger/";

function getBoxartImages() {
  return Array.isArray(window.OCR_HELPER_BOXART_IMAGES)
    ? window.OCR_HELPER_BOXART_IMAGES
    : [];
}

function getBoxartName(filename) {
  return String(filename || "").replace(/\.[^.]+$/, "");
}

function getBoxartDisplayName(filename) {
  return getBoxartName(filename).replace(/\s+\(\d+\)$/, "");
}

function getBoxartGroups() {
  const groups = new Map();

  getBoxartImages().forEach((filename) => {
    const name = getBoxartDisplayName(filename);
    const key = name.toLowerCase();

    if (!groups.has(key)) {
      groups.set(key, {
        name,
        images: [],
      });
    }

    groups.get(key).images.push(filename);
  });

  return [...groups.values()];
}

function getBoxartGroupForGameName(name) {
  const normalized = String(name || "").trim().toLowerCase();

  if (!normalized) return null;

  return getBoxartGroups().find((group) => {
    return group.name.toLowerCase() === normalized;
  }) || null;
}

function getBoxartForGameName(name) {
  const group = getBoxartGroupForGameName(name);

  return group?.images[0] || "";
}

function setGameBoxartGroup(group, preferredImage = "") {
  if (!group) return;

  game.boxartImages = group.images.slice();
  game.boxartImage = group.images.includes(preferredImage)
    ? preferredImage
    : group.images[0] || "";
}

function handleGameNameInput() {
  game.name = gameNameInput.value;
  const selectedGroup = getBoxartGroupForGameName(game.name);

  if (selectedGroup) {
    setGameBoxartGroup(selectedGroup, game.boxartImage);
    updateGameBoxartButton();
  }

  renderGameNameSuggestions();
  updateWorkflowUI();
  updateJSONOutput();
  updateStorageButtons();
}

function updateGameRecognitionScreenOptions() {
  const previous = game.recognitionScreen || "";

  gameRecognitionScreenInput.replaceChildren();

  const empty = document.createElement("option");
  empty.value = "";
  empty.textContent = "Choose screen...";
  gameRecognitionScreenInput.appendChild(empty);

  game.screens.forEach((screen) => {
    const option = document.createElement("option");

    option.value = screen.name || "";
    option.textContent = screen.name || "Unnamed screen";
    gameRecognitionScreenInput.appendChild(option);
  });

  if (!game.screens.some((screen) => screen.name === previous)) {
    game.recognitionScreen = "";
  }

  gameRecognitionScreenInput.value = game.recognitionScreen || "";
  gameRecognitionScreenInput.disabled = game.screens.length === 0;
}

function handleGameRecognitionScreenChange() {
  game.recognitionScreen = gameRecognitionScreenInput.value;
  updateJSONOutput();
  updateStorageButtons();
}

function updateGameMetadataControls() {
  gameNameInput.value = game.name || "";
  renderGameNameSuggestions(false);
  updateGameBoxartButton();
  updateGameRecognitionScreenOptions();
}

function getFilteredBoxartSuggestions() {
  const query = gameNameInput.value.trim().toLowerCase();
  const groups = getBoxartGroups();

  if (!query) return groups.slice(0, 40);

  return groups
    .filter((group) => {
      return group.name.toLowerCase().includes(query);
    })
    .slice(0, 40);
}

function renderGameNameSuggestions(show = document.activeElement === gameNameInput) {
  if (!gameNameSuggestions) return;

  gameNameSuggestions.replaceChildren();
  gameNameSuggestions.hidden = true;

  if (!show) return;

  const suggestions = getFilteredBoxartSuggestions();

  if (suggestions.length === 0) return;

  suggestions.forEach((group) => {
    const option = document.createElement("button");

    option.type = "button";
    option.className = "gameNameSuggestion";
    option.textContent = group.name;
    option.onpointerdown = (event) => {
      event.preventDefault();
      selectGameNameSuggestion(group);
    };
    gameNameSuggestions.appendChild(option);
  });

  gameNameSuggestions.hidden = false;
}

function selectGameNameSuggestion(group) {
  game.name = group.name;
  setGameBoxartGroup(group);
  gameNameInput.value = game.name;
  gameNameSuggestions.hidden = true;
  updateGameBoxartButton();
  updateWorkflowUI();
  updateJSONOutput();
  updateStorageButtons();
}

function updateGameBoxartButton() {
  if (!gameBoxartButton) return;

  gameBoxartButton.replaceChildren();
  gameBoxartButton.classList.toggle("hasBoxart", Boolean(game.boxartImage));
  gameBoxartButton.title = game.boxartImage
    ? "Boxart selected"
    : "No boxart selected";

  if (!game.boxartImage) return;

  const image = document.createElement("img");
  const preview = document.createElement("img");
  const images = getCurrentBoxartImages();

  image.alt = "";
  image.src = `${BOXART_THUMBNAIL_BASE}${encodeURIComponent(game.boxartImage)}`;
  preview.alt = "";
  preview.className = "gameBoxartPreview";
  preview.src = `${BOXART_BIG_BASE}${encodeURIComponent(game.boxartImage)}`;
  gameBoxartButton.append(image, preview);

  if (images.length > 1) {
    const previous = createBoxartCarouselButton("‹", -1);
    const next = createBoxartCarouselButton("›", 1);

    gameBoxartButton.append(previous, next);
  }
}

function getCurrentBoxartImages() {
  if (Array.isArray(game.boxartImages) && game.boxartImages.length > 0) {
    return game.boxartImages.filter((filename) => getBoxartImages().includes(filename));
  }

  const group = getBoxartGroupForGameName(game.name);

  return group?.images || (game.boxartImage ? [game.boxartImage] : []);
}

function createBoxartCarouselButton(label, direction) {
  const button = document.createElement("button");

  button.type = "button";
  button.className = `gameBoxartCarousel gameBoxartCarousel-${direction < 0 ? "prev" : "next"}`;
  button.textContent = label;
  button.onclick = (event) => {
    event.stopPropagation();
    cycleBoxartImage(direction);
  };

  return button;
}

function cycleBoxartImage(direction) {
  const images = getCurrentBoxartImages();

  if (images.length <= 1) return;

  const currentIndex = Math.max(0, images.indexOf(game.boxartImage));
  const nextIndex = (currentIndex + direction + images.length) % images.length;

  game.boxartImages = images;
  game.boxartImage = images[nextIndex];
  updateGameBoxartButton();
  updateJSONOutput();
  updateStorageButtons();
}

function handleGameBoxartButtonClick(event) {
  if (event.target.closest(".gameBoxartCarousel")) return;

  if (!game.boxartImage) {
    const selectedGroup = getBoxartGroupForGameName(game.name);

    if (selectedGroup) {
      setGameBoxartGroup(selectedGroup);
    }
  } else {
    game.boxartImage = "";
    game.boxartImages = [];
  }

  updateGameBoxartButton();
  updateJSONOutput();
  updateStorageButtons();
}

gameNameInput.addEventListener("input", handleGameNameInput);
gameNameInput.addEventListener("focus", () => renderGameNameSuggestions(true));
gameNameInput.addEventListener("blur", () => {
  window.setTimeout(() => renderGameNameSuggestions(false), 120);
});
gameBoxartButton?.addEventListener("click", handleGameBoxartButtonClick);
gameBoxartButton?.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;

  event.preventDefault();
  handleGameBoxartButtonClick(event);
});
gameRecognitionScreenInput.addEventListener(
  "change",
  handleGameRecognitionScreenChange,
);
