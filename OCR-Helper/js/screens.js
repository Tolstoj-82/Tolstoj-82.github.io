document.getElementById("gameName").oninput = (e) => {
  game.name = e.target.value;
};

document.getElementById("addScreen").onclick = () => {
  const name = prompt("Screen name", "Screen " + (game.screens.length + 1));

  if (name === null) return;

  const screen = {
    id: Date.now(),
    name: name.trim() || "Screen " + (game.screens.length + 1),
    color: screenColors[game.screens.length % screenColors.length],
    identifiers: [],
    rois: [],
  };

  game.screens.push(screen);
  activeScreenId = screen.id;
  activeROI = null;

  renderScreenList();
  renderROIList();
  renderCaptureROIPicker();
  drawROIOverlay();
  updateSelectedScreenName();
  updateWorkflowUI();
};

function updateSelectedScreenName() {
  const screen = getActiveScreen();

  selectedScreenName.textContent = screen
    ? `Selected: ${screen.name}`
    : "No screen selected";
}

function renderScreenList() {
  const screenList = document.getElementById("screenList");

  screenList.innerHTML = "";

  game.screens.forEach((screen) => {
    const div = document.createElement("div");

    div.className = "roiItem";
    div.style.background = screen.color;

    if (screen.id === activeScreenId) {
      div.classList.add("active");
    }

    const name = document.createElement("span");
    name.textContent = `${screen.name} (${screen.identifiers.length})`;

    div.appendChild(name);

    div.onclick = () => {
      // Manual selection disables auto detection
      autoDetectEnabled = false;
      autoDetectScreens.checked = false;

      activeScreenId = screen.id;
      activeROI = null;

      renderScreenList();
      renderROIList();
      renderCaptureROIPicker();
      drawROIOverlay();
      renderIdentifierInfo();
      updateSelectedScreenName();
      updateWorkflowUI();
    };

    screenList.appendChild(div);
  });
}

autoDetectScreens.onchange = () => {
  autoDetectEnabled = autoDetectScreens.checked;
};

function screenMatchesLiveImage(screen) {
  return (
    screen.identifiers.length > 0 &&
    screen.identifiers.every((identifier) => isIdentifierVisible(identifier))
  );
}

function autoDetectScreen() {
  if (!autoDetectEnabled) return;
  if (game.screens.length < 2) return;

  const match = game.screens.find((screen) => screenMatchesLiveImage(screen));

  if (!match || match.id === activeScreenId) return;

  activeScreenId = match.id;
  activeROI = match.rois[0]?.id || null;

  renderScreenList();
  renderROIList();
  renderCaptureROIPicker();
  renderIdentifierInfo();
  renderROIReadout();
  drawROIOverlay();
  updateSelectedScreenName();
  updateWorkflowUI();
}
