document.getElementById("identifierMode").onclick = () => {
  selectionMode = "identifier";
};

// ROI management
//--------------------------------

document.getElementById("addROI").onclick = () => {
  const screen = getActiveScreen();

  if (!screen) {
    alert("Add or select a screen first.");
    return;
  }

  const name = prompt("ROI name", "ROI " + (screen.rois.length + 1));

  if (name === null) return;

  const roi = {
    id: Date.now(),
    name: name.trim() || "ROI " + (screen.rois.length + 1),
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
};

function renderROIList() {
  roiList.innerHTML = "";

  getActiveScreenROIs().forEach((r) => {
    let div = document.createElement("div");

    div.className = "roiItem";
    div.draggable = true;
    div.dataset.roiId = r.id;

    div.addEventListener("dragstart", (e) => {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", String(r.id));
      div.classList.add("dragging");
    });

    div.addEventListener("dragend", () => {
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

    let name = document.createElement("span");

    name.textContent = r.name;

    let edit = document.createElement("button");

    edit.textContent = "✏";

    edit.onclick = (e) => {
      e.stopPropagation();

      const name = prompt("Name", r.name);

      if (name !== null) {
        r.name = name.trim() || r.name;
        renderROIList();
        renderCaptureROIPicker();
      }
    };

    let del = document.createElement("button");

    del.textContent = "🗑";

    del.onclick = (e) => {
      e.stopPropagation();

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

    top.appendChild(name);
    top.appendChild(edit);
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

  const sourceIndex = screen.rois.findIndex((r) => r.id === sourceId);
  const targetIndex = screen.rois.findIndex((r) => r.id === targetId);

  if (sourceIndex === -1 || targetIndex === -1) return;

  const [moved] = screen.rois.splice(sourceIndex, 1);

  let insertIndex = screen.rois.findIndex((r) => r.id === targetId);

  if (insertAfter) {
    insertIndex += 1;
  }

  screen.rois.splice(insertIndex, 0, moved);
}

function renderCaptureROIPicker() {
  const rois = getActiveScreenROIs();

  captureROIPicker.innerHTML = "";
  captureROIIds.clear();

  if (rois.length === 0) {
    captureROIPicker.textContent = "No ROIs available";
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
