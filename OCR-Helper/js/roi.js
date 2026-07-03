document.getElementById("addROI").onclick = () => {
  const screen = getActiveScreen();

  if (!screen) {
    showAlert("Add or select a screen first.");
    return;
  }

  showPrompt("Region name", "Region " + (screen.rois.length + 1), (name) => {
    const roi = {
      id: Date.now(),
      name: name.trim() || "Region " + (screen.rois.length + 1),
      color: roiColors[screen.rois.length % roiColors.length],
      tiles: new Set(),
    };

    screen.rois.push(roi);
    activeROI = roi.id;

    renderROIList();
    renderCaptureROIPicker();
    drawROIOverlay();
    renderIdentifierInfo();
    updateWorkflowUI();
  });
};

function renderROIList() {
  roiList.innerHTML = "";

  getActiveScreenROIs().forEach((r) => {
    let div = document.createElement("div");

    const dragHandle = document.createElement("span");
    dragHandle.className = "dragHandle";
    dragHandle.title = "Drag to reorder";

    div.className = "roiItem";
    div.draggable = false;
    dragHandle.draggable = true;
    div.dataset.roiId = r.id;

    dragHandle.addEventListener("dragstart", (e) => {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", String(r.id));
      e.dataTransfer.setData("application/x-region-drag", "true");
      e.dataTransfer.setDragImage(
        div,
        div.offsetWidth / 2,
        div.offsetHeight / 2,
      );
      div.classList.add("dragging");
    });

    dragHandle.addEventListener("dragend", () => {
      document.querySelectorAll(".roiItem").forEach((item) => {
        item.classList.remove(
          "dragging",
          "drag-over",
          "drop-before",
          "drop-after",
        );
      });
    });

    div.addEventListener("dragover", (e) => {
      if (!e.dataTransfer.types.includes("application/x-region-drag")) return;

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
      if (!e.dataTransfer.types.includes("application/x-region-drag")) return;

      e.preventDefault();

      const draggedId = Number(e.dataTransfer.getData("text/plain"));
      const targetId = r.id;

      if (!draggedId || draggedId === targetId) return;

      const rect = div.getBoundingClientRect();
      const insertAfter = e.clientY > rect.top + rect.height / 2;

      reorderROIs(draggedId, targetId, insertAfter);

      renderROIList();
      renderCaptureROIPicker();
      renderROIReadout();
      updateWorkflowUI();
    });

    if (r.id === activeROI) {
      div.classList.add("active");
    }

    div.style.background = r.color;

    let name = document.createElement("input");
    name.className = "roiNameInput";
    name.value = r.name;

    name.onclick = (e) => {
      e.stopPropagation();
    };

    name.oninput = () => {
      r.name = name.value.trim() || r.name;
      renderCaptureROIPicker();
      renderROIReadout();
      updateWorkflowUI();
    };

    let del = document.createElement("button");

    del.textContent = "×";
    del.className = "roiDeleteButton";
    del.title = "Delete region";

    del.onclick = (e) => {
      e.stopPropagation();

      showConfirm(
        `Delete region "${r.name}"?`,
        () => {
          const screen = getActiveScreen();

          screen.rois = screen.rois.filter((x) => x.id !== r.id);

          if (activeROI === r.id) {
            activeROI = screen.rois.length ? screen.rois[0].id : null;
          }

          renderROIList();
          renderCaptureROIPicker();
          drawROIOverlay();
          renderIdentifierInfo();
          updateWorkflowUI();
        },
        null,
        "Delete",
        "Cancel",
      );
    };

    div.onclick = () => {
      activeROI = r.id;
      renderROIList();
      renderCaptureROIPicker();
      drawROIOverlay();
      renderIdentifierInfo();
      updateWorkflowUI();
    };

    const select = document.createElement("select");

    const none = document.createElement("option");
    none.value = "";
    none.textContent = "No tileset";

    select.appendChild(none);

    tilesets.forEach((tileset) => {
      const option = document.createElement("option");

      option.value = tileset.id;
      option.textContent = tileset.name;

      select.appendChild(option);
    });

    select.value = r.tilesetId || "";
    select.classList.toggle("missingTileset", !r.tilesetId);

    select.onchange = (e) => {
      e.stopPropagation();

      r.tilesetId = Number(e.target.value) || null;

      select.classList.toggle("missingTileset", !r.tilesetId);
    };

    select.onclick = (e) => {
      e.stopPropagation();
    };

    const top = document.createElement("div");
    top.className = "roiItemTop";

    const bottom = document.createElement("div");
    bottom.className = "roiItemBottom";

    top.appendChild(dragHandle);
    top.appendChild(name);
    top.appendChild(del);

    bottom.appendChild(select);

    div.appendChild(top);
    div.appendChild(bottom);

    roiList.appendChild(div);
  });
}

function reorderROIs(sourceId, targetId, insertAfter) {
  const screen = getActiveScreen();

  if (!screen) return;

  reorderArrayItem(screen.rois, sourceId, targetId, insertAfter, (roi) => {
    return roi.id;
  });
}

function renderCaptureROIPicker() {
  const rois = getActiveScreenROIs();

  captureROIPicker.innerHTML = "";
  captureROIIds.clear();

  if (rois.length === 0) {
    captureROIPicker.textContent = "No regions available";
    return;
  }

  rois.forEach((roi) => {
    const label = document.createElement("label");
    label.className = "captureROICheck";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    checkbox.checked = roi.id === activeROI;

    if (checkbox.checked) {
      captureROIIds.add(roi.id);
      label.classList.add("selected");
    }

    checkbox.onchange = () => {
      if (checkbox.checked) {
        captureROIIds.add(roi.id);
        label.classList.add("selected");
      } else {
        captureROIIds.delete(roi.id);
        label.classList.remove("selected");
      }
    };

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(roi.name));

    captureROIPicker.appendChild(label);
  });
}
