const WIDTH = 160;
const HEIGHT = 144;

const TILE = 8;

const TILES_X = WIDTH / TILE;
const TILES_Y = HEIGHT / TILE;

const SCALE = 4;

let drawLoopRunning = false;
let lastOCRValues = {};
let highlightedIdentifierTile = null;
let highlightedIdentifierIntensity = 0;
let captureROIIds = new Set();

// Elements
//--------------------------------

const calibrationStatus = document.getElementById("calibrationStatus");
const identifierInfo = document.getElementById("identifierInfo");
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const cameraSelect = document.getElementById("cameraSelect");
const tilesContainer = document.getElementById("tilesContainer");
const roiList = document.getElementById("roiList");
const jsonOutput = document.getElementById("jsonOutput");
const tileCount = document.getElementById("tileCount");
const canvasContainer = document.querySelector(".canvasContainer");
const toggleCapture = document.getElementById("toggleCapture");
const tileDeleteZone = document.getElementById("tileDeleteZone");
const selectedScreenName = document.getElementById("selectedScreenName");
const tilesetContainer = document.getElementById("tilesetContainer");
const addTilesetButton = document.getElementById("addTileset");
const sendToTilesetButton = document.getElementById("sendToTileset");
const workflowHint = document.getElementById("workflowHint");
const roiReadout = document.getElementById("roiReadout");
const captureROIPicker = document.getElementById("captureROIPicker");
const shadeBoxes = [
  document.getElementById("shade0"),
  document.getElementById("shade1"),
  document.getElementById("shade2"),
  document.getElementById("shade3"),
];

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

/*function chooseCaptureROIs() {
  const rois = getActiveScreenROIs();

  const list = rois.map((roi, index) => `${index + 1}: ${roi.name}`).join("\n");

  const choice = prompt(
    `Which ROIs should be searched for tiles?\n\n${list}\n\nEnter numbers separated by comma, or leave empty for all:`,
    "",
  );

  if (choice === null) return false;

  if (choice.trim() === "") {
    captureROIIds = new Set(rois.map((roi) => roi.id));
    return true;
  }

  const selectedIndexes = choice
    .split(",")
    .map((v) => Number(v.trim()) - 1)
    .filter((index) => index >= 0 && index < rois.length);

  captureROIIds = new Set(selectedIndexes.map((index) => rois[index].id));

  return captureROIIds.size > 0;
}*/

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
    name.textContent = screen.name;

    const count = document.createElement("span");
    count.textContent = `IDs: ${screen.identifiers.length}`;

    div.onclick = () => {
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

    div.appendChild(name);
    div.appendChild(count);

    screenList.appendChild(div);
  });
}

document.getElementById("identifierMode").onclick = () => {
  selectionMode = "identifier";
};

// State
//--------------------------------

let stream = null;

let calibrated = false;
let palette = [240, 160, 80, 0];
let lut = [null, null, null, null];
let applyLUT = false;
let cameraReady = false;

function setDisabledReason(button, reason) {
  button.title = reason || "";
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

function updateWorkflowUI() {
  const hasScreen = !!getActiveScreen();
  const hasROIs = hasScreen && getActiveScreen().rois.length > 0;

  const calibrateButton = document.getElementById("calibrateButton");
  const addScreenButton = document.getElementById("addScreen");
  const identifierButton = document.getElementById("identifierMode");
  const addROIButton = document.getElementById("addROI");

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
}

let quantized = new Array(WIDTH * HEIGHT).fill(0);

let game = {
  name: "",
  screens: [],
};

let activeScreenId = null;
let selectionMode = "roi";

let activeROI = null;

let uniqueTiles = new Map();
let tilesets = [];

let capturing = false;
let captureBlink = false;
let captureBlinkTimer = null;

const roiColors = [
  "rgb(255,140,0)",
  "rgb(0,150,255)",
  "rgb(0,255,100)",
  "rgb(255,0,150)",
  "rgb(255,255,0)",
];

const screenColors = [
  "rgb(47,140,255)",
  "rgb(120,90,255)",
  "rgb(0,170,120)",
  "rgb(255,150,0)",
  "rgb(220,70,120)",
];

function roiOverlayColor(color) {
  return color.replace("rgb(", "rgba(").replace(")", ",0.35)");
}

function getActiveScreen() {
  return game.screens.find((s) => s.id === activeScreenId);
}

function getActiveScreenROIs() {
  return getActiveScreen()?.rois || [];
}

// Camera
//--------------------------------

async function loadCameras() {
  try {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert("Camera API not available. Use HTTPS or localhost.");
      return;
    }

    cameraSelect.innerHTML = "";

    // Ask permission first.
    const permissionStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    permissionStream.getTracks().forEach((track) => track.stop());

    // Chrome sometimes needs a short moment after permission.
    await new Promise((resolve) => setTimeout(resolve, 250));

    const devices = await navigator.mediaDevices.enumerateDevices();
    const cams = devices.filter((device) => device.kind === "videoinput");

    cams.forEach((cam, index) => {
      const option = document.createElement("option");

      option.value = cam.deviceId;
      option.textContent = cam.label || `Camera ${index + 1}`;

      cameraSelect.appendChild(option);
    });

    if (cams.length === 0) {
      alert("No cameras found. Check Chrome camera permissions.");
      return;
    }

    cameraSelect.selectedIndex = 0;
    await startCamera();
  } catch (err) {
    console.error(err);
    alert("Camera access failed: " + err.message);
  }
}

async function startCamera() {
  if (stream) {
    stream.getTracks().forEach((t) => t.stop());
  }

  stream = await navigator.mediaDevices.getUserMedia({
    video: {
      deviceId: cameraSelect.value
        ? {
            exact: cameraSelect.value,
          }
        : undefined,

      width: WIDTH,
      height: HEIGHT,
    },
  });

  video.srcObject = stream;

  video.onloadedmetadata = () => {
    cameraReady = true;
    updateWorkflowUI();

    if (!drawLoopRunning) {
      drawLoopRunning = true;
      drawLoop();
    }
  };
}

// Main loop
//--------------------------------

function drawLoop() {
  ctx.drawImage(video, 0, 0, WIDTH, HEIGHT);

  let frame = ctx.getImageData(0, 0, WIDTH, HEIGHT);

  processFrame(frame);
  renderIdentifierInfo();
  renderROIReadout();

  requestAnimationFrame(drawLoop);
}

// Calibration
//--------------------------------

document.getElementById("calibrateButton").onclick = () => {
  ctx.drawImage(video, 0, 0, WIDTH, HEIGHT);

  let frame = ctx.getImageData(0, 0, WIDTH, HEIGHT);

  let samples = [];

  for (let i = 0; i < frame.data.length; i += 4) {
    samples.push(
      Math.round((frame.data[i] + frame.data[i + 1] + frame.data[i + 2]) / 3),
    );
  }

  palette = findFourShades(samples);

  calibrated = true;
  updatePalette();
  updateWorkflowUI();
};

// Find 4 histogram peaks
//--------------------------------

function findFourShades(samples) {
  let histogram = new Array(256).fill(0);

  samples.forEach((v) => {
    histogram[v]++;
  });

  let ranked = [];

  for (let i = 0; i < 256; i++) {
    ranked.push({
      value: i,

      count: histogram[i],
    });
  }

  ranked.sort((a, b) => b.count - a.count);

  let peaks = [];

  for (let p of ranked) {
    if (!peaks.some((x) => Math.abs(x - p.value) < 10)) {
      peaks.push(p.value);
    }

    if (peaks.length === 4) break;
  }

  return peaks.sort((a, b) => a - b);
}

function updatePalette() {
  palette.sort((a, b) => b - a);

  for (let i = 0; i < 4; i++) {
    shadeBoxes[i].title = palette[i];

    shadeBoxes[i].style.background =
      `rgb(${palette[i]},${palette[i]},${palette[i]})`;

    shadeBoxes[i].classList.toggle("calibrated", calibrated);
  }

  calibrationStatus.textContent = calibrated ? "✓" : "✖";
  calibrationStatus.classList.toggle("good", calibrated);
  calibrationStatus.classList.toggle("bad", !calibrated);
}

// Quantize
//--------------------------------

function processFrame(frame) {
  let output = ctx.createImageData(WIDTH, HEIGHT);

  for (let i = 0; i < WIDTH * HEIGHT; i++) {
    let p = i * 4;

    let gray = (frame.data[p] + frame.data[p + 1] + frame.data[p + 2]) / 3;

    let best = 0;

    let dist = 9999;

    palette.forEach((v, index) => {
      let d = Math.abs(gray - v);

      if (d < dist) {
        dist = d;

        best = index;
      }
    });

    quantized[i] = best;

    let value = palette[best];

    output.data[p] = value;
    output.data[p + 1] = value;
    output.data[p + 2] = value;
    output.data[p + 3] = 255;
  }

  ctx.putImageData(output, 0, 0);
}

// Grid + ROI drawing
//--------------------------------

const roiCanvas = document.getElementById("roiCanvas");
const roiCtx = roiCanvas.getContext("2d");

const gridCanvas = document.getElementById("gridCanvas");
const gridCtx = gridCanvas.getContext("2d");

function drawROIOverlay() {
  roiCtx.clearRect(0, 0, WIDTH, HEIGHT);

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

      roiCtx.fillStyle = `rgba(255,0,0,${alpha})`;

      roiCtx.fillRect(x * TILE, y * TILE, TILE, TILE);
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

function drawGrid() {
  gridCtx.clearRect(0, 0, WIDTH * SCALE, HEIGHT * SCALE);

  gridCtx.fillStyle = "#5fbf5f";

  const DASH = 3;
  const GAP = 3;

  for (let tx = 1; tx < TILES_X; tx++) {
    const x = tx * TILE * SCALE;

    for (let y = 0; y < HEIGHT * SCALE; y += DASH + GAP) {
      gridCtx.fillRect(x, y, 1, DASH);
    }
  }

  for (let ty = 1; ty < TILES_Y; ty++) {
    const y = ty * TILE * SCALE;

    for (let x = 0; x < WIDTH * SCALE; x += DASH + GAP) {
      gridCtx.fillRect(x, y, DASH, 1);
    }
  }
}

// ROI selection
//--------------------------------

let isSelectingROI = false;
let roiSelectionMode = "add";
let lastSelectedTile = null;

gridCanvas.addEventListener("mousedown", (e) => {
  const key = getTileKeyFromMouse(e);

  if (!key) return;

  const screen = getActiveScreen();

  if (!screen) return;

  const existingIdentifier = screen.identifiers.find((id) => id.tile === key);

  if (existingIdentifier) {
    const shouldDelete = confirm(
      `Delete identifier tile ${key} from "${screen.name}"?`,
    );

    if (shouldDelete) {
      screen.identifiers = screen.identifiers.filter((id) => id.tile !== key);

      renderScreenList();
      drawROIOverlay();
      renderIdentifierInfo();
      updateWorkflowUI();
    }

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
  drawROIOverlay();
  renderIdentifierInfo();
  updateWorkflowUI();
}

const identifierModeButton = document.getElementById("identifierMode");

identifierModeButton.onclick = () => {
  selectionMode = "identifier";
  identifierModeButton.textContent = "🎯 Click a tile.";
};

gridCanvas.addEventListener("mousemove", (e) => {
  if (!isSelectingROI || !activeROI) return;

  const key = getTileKeyFromMouse(e);

  if (!key || key === lastSelectedTile) return;

  applyROITileSelection(key);
});

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
  updateSelectedScreenName();
  updateWorkflowUI();
}

function getTileKeyFromMouse(e) {
  const rect = gridCanvas.getBoundingClientRect();

  const x = Math.floor((e.clientX - rect.left) / (rect.width / WIDTH));
  const y = Math.floor((e.clientY - rect.top) / (rect.height / HEIGHT));

  if (x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT) return null;

  return `${Math.floor(x / TILE)},${Math.floor(y / TILE)}`;
}

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
  updateSelectedScreenName();
  updateWorkflowUI();
};

function renderROIList() {
  roiList.innerHTML = "";

  getActiveScreenROIs().forEach((r) => {
    let div = document.createElement("div");

    div.className = "roiItem";

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
      updateSelectedScreenName();
      updateWorkflowUI();
    };

    div.onclick = () => {
      activeROI = r.id;
      renderROIList();
      renderCaptureROIPicker();
      drawROIOverlay();
      renderIdentifierInfo();
      updateSelectedScreenName();
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
    //bottom.appendChild(captureLabel);

    div.appendChild(top);
    div.appendChild(bottom);

    roiList.appendChild(div);
  });
}

addTilesetButton.onclick = () => {
  const name = prompt("Tileset name", "New Tileset");

  if (name === null) return;

  tilesets.push({
    id: Date.now(),
    name: name.trim() || "New Tileset",
    tiles: [],
  });

  renderTilesets();
  renderROIList();
  renderCaptureROIPicker();
};

sendToTilesetButton.onclick = () => {
  const tiles = [...uniqueTiles.values()];

  if (tiles.length === 0) {
    alert("No captured tiles available yet.");
    return;
  }

  const existingNames = tilesets
    .map((t, i) => `${i + 1}: ${t.name}`)
    .join("\n");

  const choice = prompt(
    `Send to tileset:\n${existingNames}\n\nEnter number or new name:`,
    "",
  );

  if (choice === null) return;

  let tileset = tilesets[Number(choice) - 1];

  if (!tileset) {
    const newName = choice.trim() || "New Tileset";

    if (tilesets.some((t) => t.name === newName)) {
      alert("Tileset names must be unique.");
      return;
    }

    tileset = {
      id: Date.now(),
      name: newName,
      tiles: [],
    };

    tilesets.push(tileset);
  }

  tileset.tiles.push(
    ...tiles.map((tile) => ({
      pixels: tile.pixels,
      label: tile.label,
    })),
  );

  uniqueTiles.clear();
  renderTiles();

  renderTilesets();
  renderROIList();
  renderCaptureROIPicker();
};

// Tile capture
//--------------------------------

toggleCapture.onclick = () => {
  if (!capturing && captureROIIds.size === 0) {
    alert("Select at least one ROI to search.");
    return;
  }

  capturing = !capturing;
  updateCaptureUI();
};

function updateCaptureUI() {
  toggleCapture.textContent = capturing ? "⏹️" : "▶️";

  canvasContainer.classList.toggle("capturing", capturing);

  if (capturing) {
    captureBlink = false;

    document.title = "🔴 Capturing — Tile Capture Tool";

    captureBlinkTimer = setInterval(() => {
      captureBlink = !captureBlink;

      document.title = captureBlink
        ? "🔴 Capturing — Tile Capture Tool"
        : "⚫ Capturing — Tile Capture Tool";
    }, 500);
  } else {
    clearInterval(captureBlinkTimer);

    captureBlinkTimer = null;

    document.title = "Tile Capture Tool";
  }
}

setInterval(() => {
  if (!capturing) return;

  const selectedROIs = getActiveScreenROIs().filter((r) =>
    captureROIIds.has(r.id),
  );

  selectedROIs.forEach((r) => {
    r.tiles.forEach((id) => {
      let [x, y] = id.split(",");

      let pixels = getTile(Number(x), Number(y));

      let hash = pixels.join("");

      if (!uniqueTiles.has(hash)) {
        uniqueTiles.set(hash, {
          pixels,
          label: "",
        });

        renderTiles();
      }
    });
  });
}, 100);

// Extract tile
//--------------------------------

function getTile(tx, ty) {
  let arr = [];

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      arr.push(quantized[(ty * 8 + y) * WIDTH + tx * 8 + x]);
    }
  }

  return arr;
}

function tilesEqual(a, b) {
  return a.length === b.length && a.every((value, i) => value === b[i]);
}

function isCurrentScreenVisible() {
  const screen = getActiveScreen();

  return (
    screen &&
    screen.identifiers.length > 0 &&
    screen.identifiers.every((identifier) => isIdentifierVisible(identifier))
  );
}

function findTileLabelInTileset(pixels, tileset) {
  const match = tileset.tiles.find((tile) => tilesEqual(tile.pixels, pixels));

  return match ? match.label : null;
}

function isIdentifierVisible(identifier) {
  const [x, y] = identifier.tile.split(",").map(Number);
  const currentPixels = getTile(x, y);

  return tilesEqual(currentPixels, identifier.pixels);
}

function renderROIReadout() {
  const screen = getActiveScreen();

  roiReadout.innerHTML = "";

  if (!screen) {
    roiReadout.textContent = "No screen selected";
    return;
  }

  const title = document.createElement("div");
  title.className = "roiReadoutTitle";
  title.textContent = "Live OCR";

  roiReadout.appendChild(title);

  const screenVisible = isCurrentScreenVisible();

  screen.rois.forEach((roi) => {
    const row = document.createElement("div");
    row.className = "roiReadoutItem";

    const label = document.createElement("strong");
    label.textContent = `${roi.name}: `;

    const value = document.createElement("span");

    const tileset = tilesets.find((t) => t.id === roi.tilesetId);

    if (!tileset) {
      value.textContent = "--";
    } else if (screenVisible) {
      const found = [...roi.tiles]
        .map((key) => {
          const [x, y] = key.split(",").map(Number);
          return findTileLabelInTileset(getTile(x, y), tileset);
        })
        .filter((label) => label !== null && label !== "")
        .join("");

      if (found !== "") {
        lastOCRValues[roi.id] = found;
      }

      value.textContent = lastOCRValues[roi.id] || "--";
    } else {
      value.textContent = lastOCRValues[roi.id] || "--";
    }

    row.appendChild(label);
    row.appendChild(value);
    roiReadout.appendChild(row);
  });
}

// Tile display
//--------------------------------

function createTileCard(tile) {
  const div = document.createElement("div");

  div.className = "tileCard";

  const c = document.createElement("canvas");

  c.width = 8;
  c.height = 8;
  c.className = "tileCanvas";

  const cctx = c.getContext("2d");
  const img = cctx.createImageData(8, 8);

  tile.pixels.forEach((v, i) => {
    const p = palette[v];

    img.data[i * 4] = p;
    img.data[i * 4 + 1] = p;
    img.data[i * 4 + 2] = p;
    img.data[i * 4 + 3] = 255;
  });

  cctx.putImageData(img, 0, 0);

  const input = document.createElement("input");

  input.value = tile.label;
  input.placeholder = "...";

  input.oninput = () => {
    tile.label = input.value;
  };

  div.appendChild(c);
  div.appendChild(input);

  return div;
}

function renderTiles() {
  tilesContainer.innerHTML = "";

  [...uniqueTiles.entries()].forEach(([key, tile]) => {
    const div = createTileCard(tile);

    div.draggable = true;
    div.dataset.key = key;

    addTileDragHandlers(div);

    tilesContainer.appendChild(div);
  });

  tileCount.textContent = uniqueTiles.size;
}

function renderTilesets() {
  tilesetContainer.innerHTML = "";

  tilesets.forEach((tileset) => {
    const details = document.createElement("details");
    details.open = true;
    details.className = "tileset";

    const summary = document.createElement("summary");
    summary.textContent = `${tileset.name} • ${tileset.tiles.length} tile${tileset.tiles.length === 1 ? "" : "s"}`;

    const list = document.createElement("div");
    list.dataset.tileset = tileset.id;

    list.addEventListener("dragover", (e) => {
      e.preventDefault();
      list.classList.add("drag-over");
    });

    list.addEventListener("dragleave", () => {
      list.classList.remove("drag-over");
    });

    list.addEventListener("drop", (e) => {
      e.preventDefault();

      const raw = e.dataTransfer.getData("application/json");

      if (!raw) return;

      const data = JSON.parse(raw);

      moveTileToTileset(data, tileset.id, tileset.tiles.length, false);

      list.classList.remove("drag-over");

      renderTilesets();
      renderTiles();
    });

    list.className = "tilesetTiles";

    if (tileset.tiles.length === 0) {
      const hint = document.createElement("div");

      hint.className = "tilesetEmptyHint";
      hint.textContent = "Drop tiles here";

      list.appendChild(hint);
    }

    tileset.tiles.forEach((tile, index) => {
      const card = createTileCard(tile);

      card.draggable = true;
      card.dataset.source = "tileset";
      card.dataset.tilesetId = tileset.id;
      card.dataset.index = index;

      addTilesetTileDragHandlers(card);

      list.appendChild(card);
    });

    details.appendChild(summary);
    details.appendChild(list);

    tilesetContainer.appendChild(details);
  });
}

tileDeleteZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  tileDeleteZone.classList.add("drag-over");
});

tileDeleteZone.addEventListener("dragleave", () => {
  tileDeleteZone.classList.remove("drag-over");
});

tileDeleteZone.addEventListener("drop", (e) => {
  e.preventDefault();

  const raw = e.dataTransfer.getData("application/json");

  if (raw) {
    const data = JSON.parse(raw);

    if (data.source === "tileset") {
      const tileset = tilesets.find((t) => t.id === Number(data.tilesetId));

      if (tileset) {
        tileset.tiles.splice(Number(data.index), 1);
      }

      tileDeleteZone.classList.remove("visible", "drag-over");

      renderTilesets();
      return;
    }
  }

  const key = e.dataTransfer.getData("text/plain");

  if (!key) return;

  uniqueTiles.delete(key);

  tileDeleteZone.classList.remove("visible", "drag-over");

  renderTiles();
});

let draggedTileKey = null;

function addTileDragHandlers(card) {
  card.addEventListener("dragstart", (e) => {
    draggedTileKey = card.dataset.key;

    tileDeleteZone.classList.add("visible");

    card.classList.add("dragging");

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", draggedTileKey);

    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        source: "unique",
        key: draggedTileKey,
      }),
    );
  });

  card.addEventListener("dragend", () => {
    draggedTileKey = null;

    tileDeleteZone.classList.remove("visible", "drag-over");

    document.querySelectorAll(".tileCard").forEach((tile) => {
      tile.classList.remove(
        "dragging",
        "drag-over",
        "drop-before",
        "drop-after",
      );
    });
  });

  card.addEventListener("dragover", (e) => {
    e.preventDefault();

    if (!draggedTileKey || draggedTileKey === card.dataset.key) return;

    const rect = card.getBoundingClientRect();
    const isAfter = e.clientX > rect.left + rect.width / 2;

    card.classList.add("drag-over");
    card.classList.toggle("drop-before", !isAfter);
    card.classList.toggle("drop-after", isAfter);
  });

  card.addEventListener("dragleave", () => {
    card.classList.remove("drag-over", "drop-before", "drop-after");
  });

  card.addEventListener("drop", (e) => {
    e.preventDefault();

    const targetKey = card.dataset.key;

    if (!draggedTileKey || draggedTileKey === targetKey) return;

    const rect = card.getBoundingClientRect();
    const insertAfter = e.clientX > rect.left + rect.width / 2;

    reorderTiles(draggedTileKey, targetKey, insertAfter);

    renderTiles();
  });
}

let draggedTilesetTile = null;

function addTilesetTileDragHandlers(card) {
  card.addEventListener("dragstart", (e) => {
    draggedTilesetTile = {
      tilesetId: Number(card.dataset.tilesetId),
      index: Number(card.dataset.index),
    };

    tileDeleteZone.classList.add("visible");

    card.classList.add("dragging");

    e.dataTransfer.effectAllowed = "move";

    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        source: "tileset",
        tilesetId: Number(card.dataset.tilesetId),
        index: Number(card.dataset.index),
      }),
    );
  });

  card.addEventListener("dragend", () => {
    draggedTilesetTile = null;

    document.querySelectorAll(".tileCard").forEach((tile) => {
      tile.classList.remove(
        "dragging",
        "drag-over",
        "drop-before",
        "drop-after",
      );
    });

    tileDeleteZone.classList.remove("visible", "drag-over");
  });

  card.addEventListener("dragover", (e) => {
    e.preventDefault();

    const rect = card.getBoundingClientRect();
    const isAfter = e.clientX > rect.left + rect.width / 2;

    card.classList.add("drag-over");
    card.classList.toggle("drop-before", !isAfter);
    card.classList.toggle("drop-after", isAfter);
  });

  card.addEventListener("dragleave", () => {
    card.classList.remove("drag-over", "drop-before", "drop-after");
  });

  card.addEventListener("drop", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const data = JSON.parse(e.dataTransfer.getData("application/json"));

    const targetTilesetId = Number(card.dataset.tilesetId);
    const targetIndex = Number(card.dataset.index);

    const rect = card.getBoundingClientRect();
    const insertAfter = e.clientX > rect.left + rect.width / 2;

    moveTileToTileset(data, targetTilesetId, targetIndex, insertAfter);

    renderTilesets();
  });

  card.addEventListener("dblclick", () => {
    const tileset = tilesets.find(
      (t) => t.id === Number(card.dataset.tilesetId),
    );

    if (!tileset) return;

    const index = Number(card.dataset.index);

    const shouldDelete = confirm(`Delete tile from "${tileset.name}"?`);

    if (!shouldDelete) return;

    tileset.tiles.splice(index, 1);

    renderTilesets();
  });
}

function moveTileToTileset(data, targetTilesetId, targetIndex, insertAfter) {
  const targetTileset = tilesets.find((t) => t.id === targetTilesetId);

  if (!targetTileset) return;

  let movedTile = null;

  if (data.source === "unique") {
    const tile = uniqueTiles.get(data.key);

    if (!tile) return;

    movedTile = {
      pixels: tile.pixels,
      label: tile.label,
    };
  }

  if (data.source === "tileset") {
    const sourceTileset = tilesets.find((t) => t.id === Number(data.tilesetId));

    if (!sourceTileset) return;

    const [tile] = sourceTileset.tiles.splice(Number(data.index), 1);

    movedTile = tile;

    if (
      sourceTileset.id === targetTileset.id &&
      Number(data.index) < targetIndex
    ) {
      targetIndex--;
    }
  }

  if (!movedTile) return;

  const insertIndex = insertAfter ? targetIndex + 1 : targetIndex;

  targetTileset.tiles.splice(insertIndex, 0, movedTile);
}

function reorderTiles(sourceKey, targetKey, insertAfter) {
  const entries = [...uniqueTiles.entries()];

  const sourceIndex = entries.findIndex(([key]) => key === sourceKey);
  const targetIndex = entries.findIndex(([key]) => key === targetKey);

  if (sourceIndex === -1 || targetIndex === -1) return;

  const [movedTile] = entries.splice(sourceIndex, 1);

  let insertIndex = entries.findIndex(([key]) => key === targetKey);

  if (insertAfter) {
    insertIndex += 1;
  }

  entries.splice(insertIndex, 0, movedTile);

  uniqueTiles = new Map(entries);
}

// Export
//--------------------------------

document.getElementById("exportJSON").onclick = () => {
  const data = {
    game: game.name,
    palette,

    tilesets: tilesets.map((tileset) => ({
      name: tileset.name,
      tiles: tileset.tiles,
    })),

    screens: game.screens.map((screen) => ({
      name: screen.name,

      identifiers: screen.identifiers.map((id) => ({
        tile: id.tile,
        pixels: id.pixels,
      })),

      rois: screen.rois.map((r) => ({
        name: r.name,
        tiles: [...r.tiles],
        tileset:
          tilesets.find((tileset) => tileset.id === r.tilesetId)?.name || null,
      })),
    })),
  };

  let json = JSON.stringify(data, null, 2);

  // Keep all pixel arrays on one line.
  json = json.replace(
    /"pixels":\s*\[\s*([\d,\s]+?)\s*\]/gs,
    (_, values) => `"pixels": [${values.replace(/\s+/g, " ").trim()}]`,
  );

  jsonOutput.value = json;
};

// Init
//--------------------------------

document.getElementById("refreshCamera").onclick = loadCameras;

cameraSelect.onchange = () => {
  startCamera();
};

document.getElementById("startCamera").style.display = "none";

document.getElementById("startCamera").onclick = startCamera;
loadCameras();

document.querySelectorAll(".lutBox").forEach((box) => {
  box.style.width = "40px";
  box.style.height = "40px";
  box.style.border = "2px solid white";
  box.style.cursor = "pointer";
  box.style.background = "#222";

  box.onclick = async () => {
    let i = Number(box.dataset.i);

    // simple browser color picker
    let input = document.createElement("input");
    input.type = "color";

    input.oninput = () => {
      lut[i] = input.value;

      box.style.background = input.value;
    };

    input.click();
  };
});

drawROIOverlay();
renderIdentifierInfo();
drawGrid();
updatePalette();
updateCaptureUI();
updateSelectedScreenName();
renderTilesets();
updateWorkflowUI();
renderCaptureROIPicker();
