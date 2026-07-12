screenGraceMsInput.oninput = () => {
  const raw = screenGraceMsInput.value.trim();
  const value = Number(raw);
  const valid =
    raw !== "" &&
    Number.isInteger(value) &&
    value >= 0 &&
    value <= 1000;

  screenGraceMsInput.classList.toggle("invalid", !valid);

  if (!valid) {
    updateStorageButtons();
    return;
  }

  game.settings = normalizeGameSettings({
    ...game.settings,
    screenDetectionGraceMs: value,
  });
  updateJSONOutput();
  updateStorageButtons();
};

stallOcrOnUnknownTilesToggle.onchange = () => {
  game.settings = normalizeGameSettings({
    ...game.settings,
    stallOcrOnUnknownTiles: stallOcrOnUnknownTilesToggle.checked,
  });
  renderROIReadout();
  updateJSONOutput();
  updateStorageButtons();
};

identifierMatchCountInput.oninput = () => {
  const screen = getActiveScreen();

  if (!screen) return;

  screen.identifierMatchCount = identifierMatchCountInput.value;

  renderIdentifierInfo();
  renderROIReadout();
  updateWorkflowUI();
  updateJSONOutput();
  updateStorageButtons();
};

document.getElementById("addScreen").onclick = () => {
  showPrompt("Screen name", "Screen " + (game.screens.length + 1), (name) => {
    closeOpenAchievementAccordion();

    const screen = {
      id: Date.now(),
      name: name.trim() || "Screen " + (game.screens.length + 1),
      color: screenColors[game.screens.length % screenColors.length],
      identifiers: [],
      rois: [],
      achievements: [],
    };

    game.screens.push(screen);
    activeScreenId = screen.id;
    activeScreenLastVisibleAt = 0;
    activeROI = null;

    renderScreenList();
    updateGameRecognitionScreenOptions();
    updateScreenSetupTitle();
    renderROIList();
    renderAchievementList();
    renderCaptureROIPicker();
    renderIdentifierInfo();
    renderROIReadout();
    drawROIOverlay();
    updateWorkflowUI();
  });
};

function updateScreenSetupTitle() {
  const screen = getActiveScreen();
  const title = document.getElementById("screenSetupTitle");

  title.textContent = screen ? screen.name : "Screen Setup";
  title.style.borderBottomColor = screen ? screen.color : "";
  updateSettingsControls();
}

function updateSettingsControls() {
  game.settings = normalizeGameSettings(game.settings);
  screenGraceMsInput.value = game.settings.screenDetectionGraceMs;
  stallOcrOnUnknownTilesToggle.checked = game.settings.stallOcrOnUnknownTiles;

  const screen = getActiveScreen();
  const identifierCount = screen?.identifiers?.length || 0;
  const configured = screen?.identifierMatchCount ?? "all";
  const identifierMatchField = identifierMatchCountInput.closest(
    ".identifierMatchField",
  );

  identifierMatchField.hidden = identifierCount === 0;
  identifierMatchCountInput.disabled = !screen || identifierCount === 0;
  identifierMatchCountInput.replaceChildren();

  if (identifierCount === 0) {
    return;
  }

  const all = document.createElement("option");
  all.value = "all";
  all.textContent = "all identifiers";
  identifierMatchCountInput.appendChild(all);

  for (let count = 1; count <= identifierCount; count++) {
    const option = document.createElement("option");

    option.value = String(count);
    option.textContent = `${count} of ${identifierCount}`;
    identifierMatchCountInput.appendChild(option);
  }

  identifierMatchCountInput.value =
    configured === "all" || !Number.isFinite(Number(configured))
      ? "all"
      : String(Math.min(identifierCount, Math.max(1, Number(configured))));
  identifierMatchCountInput.disabled = identifierCount <= 1;
}

function renderScreenList() {
  const screenList = document.getElementById("screenList");

  screenList.innerHTML = "";

  game.screens.forEach((screen) => {
    const div = document.createElement("div");
    div.className = "roiItem screenItem";
    div.style.background = screen.color;
    div.draggable = false;

    if (screen.id === activeScreenId) {
      div.classList.add("active");
    }

    const dragHandle = document.createElement("span");
    dragHandle.className = "dragHandle";
    dragHandle.title = "Drag to reorder";
    dragHandle.draggable = true;

    const name = document.createElement("input");
    name.className = "roiNameInput screenNameInput";
    name.value = screen.name;

    name.classList.toggle("missingIdentifier", screen.identifiers.length === 0);

    name.onclick = (e) => {
      e.stopPropagation();
    };

    name.oninput = () => {
      const oldName = screen.name;
      const newName = name.value.trim() || screen.name;

      screen.name = newName;
      updateAchievementLifecycleScreenName(oldName, newName);
      if (game.recognitionScreen === oldName) {
        game.recognitionScreen = newName;
      }

      updateScreenSetupTitle();
      updateGameRecognitionScreenOptions();
      renderIdentifierInfo();
      renderAchievementList();
      updateWorkflowUI();
    };

    const del = document.createElement("button");
    del.textContent = "×";
    del.className = "roiDeleteButton roundDeleteButton";
    del.title = "Delete screen";

    del.onclick = (e) => {
      e.stopPropagation();

      showConfirm(
        `Delete screen "${screen.name}"?`,
        () => {
          game.screens = game.screens.filter((s) => s.id !== screen.id);
          clearMissingAchievementLifecycleScreens();

          if (activeScreenId === screen.id) {
            activeScreenId = game.screens[0]?.id || null;
            activeScreenLastVisibleAt = 0;
            activeROI = getActiveScreen()?.rois[0]?.id || null;
          }

          if (game.recognitionScreen === screen.name) {
            game.recognitionScreen = "";
          }

          renderScreenList();
          updateGameRecognitionScreenOptions();
          updateScreenSetupTitle();
          renderROIList();
          renderAchievementList();
          renderCaptureROIPicker();
          renderIdentifierInfo();
          renderROIReadout();
          drawROIOverlay();
          updateWorkflowUI();
        },
        null,
        "Delete",
        "Cancel",
      );
    };

    dragHandle.addEventListener("dragstart", (e) => {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", String(screen.id));
      e.dataTransfer.setData("application/x-screen-drag", "true");
      e.dataTransfer.setDragImage(
        div,
        div.offsetWidth / 2,
        div.offsetHeight / 2,
      );
      div.classList.add("dragging");
    });

    dragHandle.addEventListener("dragend", () => {
      document.querySelectorAll(".screenItem").forEach((item) => {
        item.classList.remove(
          "dragging",
          "drag-over",
          "drop-before",
          "drop-after",
        );
      });
    });

    div.addEventListener("dragover", (e) => {
      if (!e.dataTransfer.types.includes("application/x-screen-drag")) return;

      e.preventDefault();

      const rect = div.getBoundingClientRect();
      const isAfter = e.clientY > rect.top + rect.height / 2;

      div.classList.add("drag-over");
      div.classList.toggle("drop-before", !isAfter);
      div.classList.toggle("drop-after", isAfter);
    });

    div.addEventListener("dragleave", () => {
      div.classList.remove("drag-over", "drop-before", "drop-after");
    });

    div.addEventListener("drop", (e) => {
      if (!e.dataTransfer.types.includes("application/x-screen-drag")) return;

      e.preventDefault();

      const draggedId = Number(e.dataTransfer.getData("text/plain"));
      const targetId = screen.id;

      div.classList.remove("drag-over", "drop-before", "drop-after");

      if (!draggedId || draggedId === targetId) return;

      const rect = div.getBoundingClientRect();
      const insertAfter = e.clientY > rect.top + rect.height / 2;

      reorderScreens(draggedId, targetId, insertAfter);

      renderScreenList();
      updateScreenSetupTitle();
      updateWorkflowUI();
    });

    div.onclick = () => {
      closeOpenAchievementAccordion();

      autoDetectEnabled = false;
      autoDetectScreens.checked = false;

      activeScreenId = screen.id;
      activeScreenLastVisibleAt = 0;
      activeROI = screen.rois[0]?.id || null;

      renderScreenList();
      updateScreenSetupTitle();
      renderROIList();
      renderAchievementList();
      renderCaptureROIPicker();
      drawROIOverlay();
      renderIdentifierInfo();
      renderROIReadout();
      updateWorkflowUI();
    };

    const top = document.createElement("div");
    top.className = "roiItemTop";

    top.appendChild(dragHandle);
    top.appendChild(name);
    top.appendChild(del);

    div.appendChild(top);

    screenList.appendChild(div);
  });
}

autoDetectScreens.onchange = () => {
  autoDetectEnabled = autoDetectScreens.checked;
};

showRegionsToggle.onchange = () => {
  showRegions = showRegionsToggle.checked;
  drawROIOverlay();
};

useOptimizedScanToggle.onchange = () => {
  useOptimizedTileScan = useOptimizedScanToggle.checked;
  renderROIReadout();
};

function screenMatchesLiveImage(screen) {
  return screenMatchesByIdentifiers(screen);
}

function autoDetectScreen() {
  if (!autoDetectEnabled) return;
  if (game.screens.length < 2) return;

  const now = Date.now();
  const currentScreen = getActiveScreen();

  if (currentScreen && screenMatchesLiveImage(currentScreen)) {
    activeScreenLastVisibleAt = now;
    return;
  }

  if (
    currentScreen &&
    activeScreenLastVisibleAt > 0 &&
    now - activeScreenLastVisibleAt <= getScreenDetectionGraceMs()
  ) {
    return;
  }

  const match = game.screens.find((screen) => screenMatchesLiveImage(screen));

  if (!match || match.id === activeScreenId) return;

  closeOpenAchievementAccordion();

  activeScreenId = match.id;
  activeScreenLastVisibleAt = Date.now();
  activeROI = match.rois[0]?.id || null;

  renderScreenList();
  updateScreenSetupTitle();
  renderROIList();
  renderAchievementList();
  renderCaptureROIPicker();
  renderIdentifierInfo();
  renderROIReadout();
  drawROIOverlay();
  updateWorkflowUI();
}

function reorderScreens(sourceId, targetId, insertAfter) {
  reorderArrayItem(
    game.screens,
    sourceId,
    targetId,
    insertAfter,
    (screen) => screen.id,
  );
}
