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

function renderIdentifierInfo() {
  const screen = getActiveScreen();

  identifierInfo.innerHTML = "";

  if (!screen) {
    identifierInfo.textContent = "No screen selected";
    identifierInfo.classList.remove("valid");
    return;
  }

  const title = document.createElement("div");
  title.className = "identifierInfoTitle";
  title.style.borderBottomColor = screen.color;

  const allVisible =
    screen.identifiers.length > 0 &&
    screen.identifiers.every((identifier) => isIdentifierVisible(identifier));

  title.innerHTML = allVisible
    ? `${screen.name} <span class="screenOk">✓</span>`
    : screen.name;

  identifierInfo.classList.toggle("valid", allVisible);

  identifierInfo.appendChild(title);

  if (screen.identifiers.length === 0) {
    const empty = document.createElement("div");
    empty.textContent = "No identifier tiles";
    identifierInfo.appendChild(empty);
    return;
  }

  screen.identifiers.forEach((identifier, index) => {
    const visible = isIdentifierVisible(identifier);

    const row = document.createElement("div");
    row.className = "identifierInfoItem";
    row.classList.toggle("valid", visible);

    const label = document.createElement("div");
    label.className = "identifierInfoLabel";
    label.textContent = `(${identifier.tile})`;

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

    identifierInfo.appendChild(row);
  });
}

gridCanvas.addEventListener("mousedown", (e) => {
  const key = getTileKeyFromMouse(e);

  if (!key) return;

  const screen = getActiveScreen();

  if (!screen) return;

  const existingIdentifier = screen.identifiers.find((id) => id.tile === key);

  if (existingIdentifier) {
    showConfirm(`Delete identifier tile ${key} from "${screen.name}"?`, () => {
      screen.identifiers = screen.identifiers.filter((id) => id.tile !== key);

      renderScreenList();
      updateScreenSetupTitle();
      drawROIOverlay();
      renderIdentifierInfo();
      updateWorkflowUI();
    });

    return;
  }

  if (selectionMode === "identifier") {
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

  selectionMode = "roi";
  identifierModeButton.textContent = "Add Identifier Tile";

  renderScreenList();
  updateScreenSetupTitle();
  drawROIOverlay();
  renderIdentifierInfo();
  updateWorkflowUI();
}

const identifierModeButton = document.getElementById("identifierMode");

identifierModeButton.onclick = () => {
  selectionMode = "identifier";
  identifierModeButton.textContent = "Click a tile.";
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
