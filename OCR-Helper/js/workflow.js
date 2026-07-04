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
    message = "Add at least one region.";
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
  const captureLocked = capturing;

  const calibrateButton = document.getElementById("calibrateButton");
  const addScreenButton = document.getElementById("addScreen");
  const identifierButton = document.getElementById("identifierMode");
  const addROIButton = document.getElementById("addROI");
  const workflowHeader = document.querySelector(".workflowHeader");

  calibrateButton.disabled = !cameraReady || snapshotPaused;
  const calibrationNeedsInput =
    cameraReady &&
    !snapshotPaused &&
    (!calibrated ||
      calibrationQuality === "bad" ||
      calibrationQuality === "none");
  calibrateButton.classList.toggle("needsInput", calibrationNeedsInput);
  calibrateButton.classList.toggle("needsAction", calibrationNeedsInput);
  setDisabledReason(
    calibrateButton,
    !cameraReady
      ? "Start the camera first."
      : snapshotPaused
        ? "Resume live feed before calibrating."
        : "",
  );

  snapshotToggle.disabled = !cameraReady || !calibrated;
  setDisabledReason(
    snapshotToggle,
    !cameraReady
      ? "Start the camera first."
      : !calibrated
        ? "Calibrate before taking a snapshot."
        : "",
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

  toggleCapture.disabled = !capturing && !hasROIs;
  setDisabledReason(
    toggleCapture,
    hasROIs ? "" : "Create at least one region first.",
  );

  addTilesetButton.disabled = false;
  setDisabledReason(addTilesetButton, "");

  updateWorkflowHint();

  const hasUsableTileset = tilesets.some((t) => t.tiles.length > 0);

  workflowHeader.classList.toggle(
    "hidden",
    hasUsableTileset,
  );

  autoDetectScreens.disabled = game.screens.length < 2;

  if (game.screens.length < 2) {
    autoDetectScreens.checked = false;
    autoDetectEnabled = false;
  }

  if (typeof updateJSONOutput === "function") {
    updateJSONOutput();
  }

  if (typeof updateStorageButtons === "function") {
    updateStorageButtons();
  }

  setCaptureLockedControls(captureLocked);
}

function setCaptureLockedControls(locked) {
  document
    .querySelectorAll("button, select, input, textarea")
    .forEach((control) => {
      if (control === toggleCapture) return;
      if (control === snapshotToggle) return;
      if (control.type === "file") return;
      if (control.classList.contains("identifierDeleteButton")) return;

      if (locked) {
        if (!control.disabled) {
          control.dataset.captureLocked = "true";
        }

        control.disabled = true;
        return;
      }

      if (control.dataset.captureLocked === "true") {
        control.disabled = false;
        delete control.dataset.captureLocked;
      }
    });

  if (!locked) {
    return;
  }

  toggleCapture.disabled = false;
  setDisabledReason(toggleCapture, "");
}
