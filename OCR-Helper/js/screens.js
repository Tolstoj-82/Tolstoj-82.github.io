document.getElementById("gameName").oninput = (e) => {
  game.name = e.target.value;
  updateWorkflowUI();
  updateStorageButtons();
};

document.getElementById("addScreen").onclick = () => {
  showPrompt("Screen name", "Screen " + (game.screens.length + 1), (name) => {
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
    updateScreenSetupTitle();
    renderROIList();
    renderCaptureROIPicker();
    renderIdentifierInfo();
    drawROIOverlay();
    updateWorkflowUI();
  });
};

function updateScreenSetupTitle() {
  const screen = getActiveScreen();
  const title = document.getElementById("screenSetupTitle");

  title.textContent = screen ? screen.name : "Screen Setup";
  title.style.borderBottomColor = screen ? screen.color : "";
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
      screen.name = name.value.trim() || screen.name;

      updateScreenSetupTitle();
      renderIdentifierInfo();
      updateWorkflowUI();
    };

    const del = document.createElement("button");
    del.textContent = "×";
    del.className = "roiDeleteButton";
    del.title = "Delete screen";

    del.onclick = (e) => {
      e.stopPropagation();

      showConfirm(
        `Delete screen "${screen.name}"?`,
        () => {
          game.screens = game.screens.filter((s) => s.id !== screen.id);

          if (activeScreenId === screen.id) {
            activeScreenId = game.screens[0]?.id || null;
            activeROI = getActiveScreen()?.rois[0]?.id || null;
          }

          renderScreenList();
          updateScreenSetupTitle();
          renderROIList();
          renderCaptureROIPicker();
          renderIdentifierInfo();
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
      autoDetectEnabled = false;
      autoDetectScreens.checked = false;

      activeScreenId = screen.id;
      activeROI = screen.rois[0]?.id || null;

      renderScreenList();
      updateScreenSetupTitle();
      renderROIList();
      renderCaptureROIPicker();
      drawROIOverlay();
      renderIdentifierInfo();
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
  updateScreenSetupTitle();
  renderROIList();
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
