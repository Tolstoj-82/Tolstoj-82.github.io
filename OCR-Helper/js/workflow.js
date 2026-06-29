function setDisabledReason(button, reason) {
  button.title = reason || "";
}

function updateWorkflowHint() {
  const hasScreen = !!getActiveScreen();
  const hasROIs = hasScreen && getActiveScreen().rois.length > 0;

  let message = "";

  if (!cameraReady) {
    message = "Start the capture.";
  } else if (!calibrated) {
    message = "Choose GB capture then calibrate.";
  } else if (!hasScreen) {
    message = "Create a screen.";
  } else if (getActiveScreen().identifiers.length === 0) {
    message = "Add at least one identifier tile.";
  } else if (!hasROIs) {
    message = "Add at least one ROI.";
  } else if (uniqueTiles.size === 0) {
    message = "Start capturing tiles.";
  } else {
    message = "OK!";
  }

  workflowHint.textContent = message;
}

function updateWorkflowUI() {
  const hasScreen = !!getActiveScreen();
  const hasROIs = hasScreen && getActiveScreen().rois.length > 0;

  const calibrateButton = document.getElementById("calibrateButton");
  const addScreenButton = document.getElementById("addScreen");
  const identifierButton = document.getElementById("identifierMode");
  const addROIButton = document.getElementById("addROI");
  const workflowHeader = document.querySelector(".workflowHeader");

  calibrateButton.disabled = !cameraReady;
  setDisabledReason(
    calibrateButton,
    cameraReady ? "" : "Start the camera first.",
  );

  addScreenButton.disabled = !calibrated;
  setDisabledReason(
    addScreenButton,
    calibrated ? "" : "Calibrate the image first.",
  );

  identifierButton.disabled = !calibrated || !hasScreen;
  setDisabledReason(
    identifierButton,
    !calibrated
      ? "Calibrate the image first."
      : !hasScreen
        ? "Create a screen first."
        : "",
  );

  addROIButton.disabled = !calibrated || !hasScreen;
  setDisabledReason(
    addROIButton,
    !calibrated
      ? "Calibrate the image first."
      : !hasScreen
        ? "Create a screen first."
        : "",
  );

  toggleCapture.disabled = !hasROIs;
  setDisabledReason(
    toggleCapture,
    hasROIs ? "" : "Create at least one ROI first.",
  );

  addTilesetButton.disabled = !hasROIs;
  setDisabledReason(
    addTilesetButton,
    hasROIs ? "" : "Capture tiles before creating tilesets.",
  );

  sendToTilesetButton.disabled = !hasROIs;
  setDisabledReason(
    sendToTilesetButton,
    hasROIs ? "" : "Create at least one ROI first.",
  );
  updateWorkflowHint();
  const hasUsableTileset = tilesets.some((t) => t.tiles.length > 0);

  workflowHeader.classList.toggle("hidden", hasUsableTileset);

  autoDetectScreens.disabled = game.screens.length < 2;

  if (game.screens.length < 2) {
    autoDetectScreens.checked = false;
    autoDetectEnabled = false;
  }

  if (typeof updateJSONOutput === "function") {
    updateJSONOutput();
  }
}
