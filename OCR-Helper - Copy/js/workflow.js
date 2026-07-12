function setDisabledReason(button, reason) {
  button.title = reason || "";
}

function updateWorkflowHint() {
  const activeScreen = getActiveScreen();
  const hasScreen = !!activeScreen;
  const hasTiles = uniqueTiles.size > 0 || tilesets.some((tileset) => {
    return Array.isArray(tileset.tiles) && tileset.tiles.length > 0;
  });
  const items = [
    {
      label: "Camera",
      done: cameraReady,
    },
    {
      label: "Calibrated",
      done: calibrated,
    },
    {
      label: "Screen",
      done: hasScreen,
    },
    {
      label: "Identifiers",
      done: hasScreen && activeScreen.identifiers.length > 0,
    },
    {
      label: "Regions",
      done: hasScreen && activeScreen.rois.length > 0,
    },
    {
      label: "Tiles",
      done: hasTiles,
    },
  ];
  const list = document.createElement("ul");

  list.className = "workflowHintList";

  items.forEach((item) => {
    const row = document.createElement("li");
    const marker = document.createElement("span");
    const label = document.createElement("span");

    row.className = `workflowHintItem ${item.done ? "done" : "pending"}`;
    marker.className = "workflowHintCheck";
    marker.textContent = item.done ? "✓" : "!";
    label.textContent = item.label;

    row.append(marker, label);
    list.appendChild(row);
  });

  workflowHint.replaceChildren(list);
}

function updateWorkflowUI() {
  const activeScreen = getActiveScreen();
  const hasScreen = !!activeScreen;
  const hasIdentifiers = hasScreen && activeScreen.identifiers.length > 0;
  const hasROIs = hasScreen && activeScreen.rois.length > 0;
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
  snapshotLibraryButton.hidden = snapshots.length === 0;
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
  identifierButton.classList.toggle(
    "needsAction",
    calibrated && hasScreen && !hasIdentifiers,
  );
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

  workflowHeader.classList.remove("hidden");

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
      if (control === snapshotLibraryButton) return;
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
