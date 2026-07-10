const roiCanvas = document.getElementById("roiCanvas");
const roiCtx = roiCanvas.getContext("2d");

const gridCanvas = document.getElementById("gridCanvas");

function drawROIOverlay() {
  roiCtx.clearRect(0, 0, WIDTH, HEIGHT);

  if (!showRegions) return;

  for (const roi of getActiveScreenROIs()) {
    roiCtx.fillStyle = roiOverlayColor(roi.color);

    for (const key of roi.tiles) {
      const [x, y] = key.split(",").map(Number);
      roiCtx.fillRect(x * TILE, y * TILE, TILE, TILE);
    }

    drawRegionOutline(roi);
  }

  const screen = getActiveScreen();

  if (screen) {
    for (const identifier of screen.identifiers) {
      const [x, y] = identifier.tile.split(",").map(Number);

      const isHighlighted = identifier.tile === highlightedIdentifierTile;

      const alpha = isHighlighted
        ? 0.45 + highlightedIdentifierIntensity * 0.45
        : 0.45;

      const px = x * TILE;
      const py = y * TILE;

      roiCtx.fillStyle = `rgba(255,0,0,${alpha})`;

      roiCtx.fillRect(px, py, TILE, 1);
      roiCtx.fillRect(px, py + TILE - 1, TILE, 1);
      roiCtx.fillRect(px, py + 1, 1, TILE - 2);
      roiCtx.fillRect(px + TILE - 1, py + 1, 1, TILE - 2);
    }
  }
}

function drawRegionOutline(roi) {
  roiCtx.save();
  roiCtx.strokeStyle = "rgba(255,255,255,0.82)";
  roiCtx.lineWidth = 1;
  roiCtx.shadowColor = "rgba(0,0,0,0.75)";
  roiCtx.shadowBlur = 1;

  for (const key of roi.tiles) {
    const [x, y] = key.split(",").map(Number);
    const px = x * TILE;
    const py = y * TILE;

    drawRegionBoundaryLine(roi, key, `${x},${y - 1}`, px, py, px + TILE, py);
    drawRegionBoundaryLine(
      roi,
      key,
      `${x},${y + 1}`,
      px,
      py + TILE,
      px + TILE,
      py + TILE,
    );
    drawRegionBoundaryLine(roi, key, `${x - 1},${y}`, px, py, px, py + TILE);
    drawRegionBoundaryLine(
      roi,
      key,
      `${x + 1},${y}`,
      px + TILE,
      py,
      px + TILE,
      py + TILE,
    );
  }

  roiCtx.restore();
}

function drawRegionBoundaryLine(roi, key, neighborKey, x1, y1, x2, y2) {
  if (!roi.tiles.has(key) || roi.tiles.has(neighborKey)) return;

  roiCtx.beginPath();
  roiCtx.moveTo(x1, y1);
  roiCtx.lineTo(x2, y2);
  roiCtx.stroke();
}

function syncIdentifierSectionState() {
  const screen = getActiveScreen();
  const needsIdentifier = Boolean(screen && screen.identifiers.length === 0);

  identifierSection.classList.toggle("lockedOpen", needsIdentifier);

  if (needsIdentifier) {
    identifierSection.open = true;
  }
}

function renderIdentifierInfo() {
  const screen = getActiveScreen();

  identifierInfoContent.innerHTML = "";
  syncIdentifierSectionState();

  if (!screen) {
    identifierInfoContent.textContent = "No screen selected";
    identifierInfo.classList.remove("valid");
    identifierInfo.style.removeProperty("--identifier-screen-color");
    activeScreenTitle.textContent = "No screen selected";
    activeScreenTitle.classList.remove("valid");
    return;
  }

  identifierInfo.style.setProperty("--identifier-screen-color", screen.color);

  const visibleEnough = screenMatchesByIdentifiers(screen);

  identifierInfo.classList.toggle("valid", visibleEnough);
  renderActiveScreenTitle(screen, visibleEnough);

  if (screen.identifiers.length === 0) {
    const empty = document.createElement("div");
    empty.textContent = "No identifier tiles";
    identifierInfoContent.appendChild(empty);
    return;
  }

  screen.identifiers.forEach((identifier) => {
    const visible = isIdentifierVisible(identifier);

    const row = document.createElement("div");
    row.className = "identifierInfoItem";
    row.dataset.tile = identifier.tile;
    row.classList.toggle("valid", visible);

    const label = document.createElement("div");
    label.className = "identifierInfoLabel";
    label.textContent = `(${identifier.tile})`;

    const deleteButton = document.createElement("button");
    deleteButton.className = "identifierDeleteButton";
    deleteButton.type = "button";
    deleteButton.textContent = "×";
    deleteButton.title = "Delete identifier tile";

    const handleDelete = (e) => {
      e.preventDefault();
      e.stopPropagation();

      deleteIdentifierTile(screen, identifier.tile);
    };

    deleteButton.onpointerdown = handleDelete;
    deleteButton.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const card = createTileCard({
      pixels: identifier.pixels,
      label: "",
    });

    card.querySelector("input").remove();
    card.draggable = false;

    card.addEventListener("mouseenter", () => {
      highlightedIdentifierTile = identifier.tile;
      highlightedIdentifierIntensity = 1;

      const animate = () => {
        highlightedIdentifierIntensity *= 0.92;
        drawROIOverlay();

        if (highlightedIdentifierIntensity > 0.05) {
          requestAnimationFrame(animate);
        } else {
          highlightedIdentifierTile = null;
          drawROIOverlay();
        }
      };

      animate();
    });

    row.appendChild(label);
    row.appendChild(card);
    row.appendChild(deleteButton);

    identifierInfoContent.appendChild(row);
  });
}

identifierSection.addEventListener("toggle", () => {
  const screen = getActiveScreen();

  if (screen && screen.identifiers.length === 0 && !identifierSection.open) {
    identifierSection.open = true;
  }
});

function renderActiveScreenTitle(screen, visibleEnough) {
  activeScreenTitle.innerHTML = `${screen.name} <span class="screenOk">${
    visibleEnough ? "✓" : ""
  }</span>`;
  activeScreenTitle.classList.toggle("valid", visibleEnough);
}

function updateIdentifierInfoStatus() {
  const screen = getActiveScreen();

  if (!screen) return;

  const visibleEnough = screenMatchesByIdentifiers(screen);

  identifierInfo.classList.toggle("valid", visibleEnough);
  renderActiveScreenTitle(screen, visibleEnough);

  identifierInfoContent
    .querySelectorAll(".identifierInfoItem")
    .forEach((row) => {
      const tile = row.dataset.tile;
      const identifier = screen.identifiers.find((item) => item.tile === tile);

      if (!identifier) return;

      row.classList.toggle("valid", isIdentifierVisible(identifier));
    });
}

function deleteIdentifierTile(screen, tileKey) {
  showConfirm(
    `Delete identifier tile ${tileKey} from "${screen.name}"?`,
    () => {
      screen.identifiers = screen.identifiers.filter((identifier) => {
        return identifier.tile !== tileKey;
      });
      if (Number(screen.identifierMatchCount) > screen.identifiers.length) {
        screen.identifierMatchCount = "all";
      }

      renderScreenList();
      updateScreenSetupTitle();
      drawROIOverlay();
      renderIdentifierInfo();
      updateWorkflowUI();
    },
    null,
    "Delete",
    "Cancel",
  );
}

gridCanvas.addEventListener("mousedown", (e) => {
  const key = getTileKeyFromMouse(e);

  if (!key) return;

  const screen = getActiveScreen();

  if (!screen) return;

  const existingIdentifier = screen.identifiers.find((id) => id.tile === key);

  if (selectionMode === "identifier") {
    if (existingIdentifier) {
      showAlert("This identifier tile already exists.");
      return;
    }

    addIdentifierTile(key);
    return;
  }

  if (!activeROI) return;

  const roi = getActiveScreenROIs().find((r) => r.id === activeROI);

  if (!roi) return;

  isSelectingROI = true;
  lastSelectedTile = null;

  roiSelectionMode = roi.tiles.has(key) ? "remove" : "add";

  applyROITileSelection(key);
});

function addIdentifierTile(key) {
  const screen = getActiveScreen();

  if (!screen) return;

  const [x, y] = key.split(",").map(Number);

  screen.identifiers.push({
    tile: key,
    pixels: getTile(x, y),
  });
  screen.identifierMatchCount ||= "all";

  stopIdentifierTileMode();
  identifierSection.open = true;

  renderScreenList();
  updateScreenSetupTitle();
  drawROIOverlay();
  renderIdentifierInfo();
  updateWorkflowUI();
}

const identifierModeButton = document.getElementById("identifierMode");

function setIdentifierModeButtonLabel(label) {
  identifierModeButton.textContent = "+";
  identifierModeButton.setAttribute("aria-label", label);
}

function stopIdentifierTileMode() {
  window.clearTimeout(identifierModeTimer);
  identifierModeTimer = null;
  selectionMode = "roi";
  setIdentifierModeButtonLabel("Add Identifier Tile");
  identifierModeButton.classList.remove("identifierAwaiting");
  drawROIOverlay();
}

function startIdentifierTileMode() {
  window.clearTimeout(identifierModeTimer);
  showRegions = true;
  showRegionsToggle.checked = true;
  selectionMode = "identifier";
  setIdentifierModeButtonLabel("Click a tile");
  identifierModeButton.classList.add("identifierAwaiting");
  drawROIOverlay();

  identifierModeTimer = window.setTimeout(() => {
    if (selectionMode === "identifier") {
      stopIdentifierTileMode();
    }
  }, 10000);
}

identifierModeButton.onclick = (e) => {
  e.preventDefault();
  e.stopPropagation();

  if (selectionMode === "identifier") {
    stopIdentifierTileMode();
    return;
  }

  startIdentifierTileMode();
};

window.addEventListener("mouseup", () => {
  isSelectingROI = false;
  lastSelectedTile = null;
});

function applyROITileSelection(key) {
  const roi = getActiveScreenROIs().find((r) => r.id === activeROI);

  if (!roi) return;

  if (roiSelectionMode === "remove") {
    roi.tiles.delete(key);
  } else {
    roi.tiles.add(key);
  }

  lastSelectedTile = key;

  drawROIOverlay();
  updateROIAccordionState();
  renderIdentifierInfo();
  updateWorkflowUI();
}

function getTileKeyFromMouse(e) {
  const rect = gridCanvas.getBoundingClientRect();

  const x = Math.floor((e.clientX - rect.left) / (rect.width / WIDTH));
  const y = Math.floor((e.clientY - rect.top) / (rect.height / HEIGHT));

  if (x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT) return null;

  return `${Math.floor(x / TILE)},${Math.floor(y / TILE)}`;
}

let isSelectingROI = false;
let roiSelectionMode = "add";
let lastSelectedTile = null;

gridCanvas.addEventListener("mousemove", (e) => {
  if (!isSelectingROI || !activeROI) return;

  const key = getTileKeyFromMouse(e);

  if (!key || key === lastSelectedTile) return;

  applyROITileSelection(key);
});
