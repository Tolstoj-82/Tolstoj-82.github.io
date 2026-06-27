const WIDTH = 160;
const HEIGHT = 144;

const TILE = 8;

const TILES_X = WIDTH / TILE;
const TILES_Y = HEIGHT / TILE;

const SCALE = 4;

let drawLoopRunning = false;

// Elements
//--------------------------------

const calibrationStatus = document.getElementById("calibrationStatus");

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

const shadeBoxes = [
  document.getElementById("shade0"),
  document.getElementById("shade1"),
  document.getElementById("shade2"),
  document.getElementById("shade3"),
];

// State
//--------------------------------

let stream = null;

let calibrated = false;
let palette = [240, 160, 80, 0];
let lut = [null, null, null, null];
let applyLUT = false;

let quantized = new Array(WIDTH * HEIGHT).fill(0);

let rois = [];

let activeROI = null;

let uniqueTiles = new Map();

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

function roiOverlayColor(color) {
  return color.replace("rgb(", "rgba(").replace(")", ",0.35)");
}

// Camera
//--------------------------------

async function loadCameras() {
  try {
    // STEP 1: force permission FIRST (this unlocks labels)
    const tempStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    // stop it immediately (we only needed permission)
    tempStream.getTracks().forEach((t) => t.stop());

    // STEP 2: now device labels will be available
    const devices = await navigator.mediaDevices.enumerateDevices();

    const cams = devices.filter((d) => d.kind === "videoinput");

    cameraSelect.innerHTML = "";

    cams.forEach((cam, i) => {
      const option = document.createElement("option");

      option.value = cam.deviceId;

      option.textContent = cam.label || `Camera ${i}`;

      cameraSelect.appendChild(option);
    });

    if (cams.length > 0) {
      cameraSelect.selectedIndex = 0;
      await startCamera();
    }

    if (cams.length === 0) {
      alert("No cameras found.");
    }
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

  for (const roi of rois) {
    roiCtx.fillStyle = roiOverlayColor(roi.color);

    for (const key of roi.tiles) {
      const [x, y] = key.split(",").map(Number);
      roiCtx.fillRect(x * TILE, y * TILE, TILE, TILE);
    }
  }
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
  if (!activeROI) return;

  const key = getTileKeyFromMouse(e);
  const roi = rois.find((r) => r.id === activeROI);

  if (!key || !roi) return;

  isSelectingROI = true;
  lastSelectedTile = null;

  roiSelectionMode = roi.tiles.has(key) ? "remove" : "add";

  applyROITileSelection(key);
});

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
  const roi = rois.find((r) => r.id === activeROI);

  if (!roi) return;

  if (roiSelectionMode === "remove") {
    roi.tiles.delete(key);
  } else {
    roi.tiles.add(key);
  }

  lastSelectedTile = key;

  drawROIOverlay();
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
  const name = prompt("ROI name", "ROI " + (rois.length + 1));

  if (name === null) return;

  const roi = {
    id: Date.now(),
    name: name.trim() || "ROI " + (rois.length + 1),
    color: roiColors[rois.length % roiColors.length],
    tiles: new Set(),
  };

  rois.push(roi);
  activeROI = roi.id;

  renderROIList();
  drawROIOverlay();
};

function renderROIList() {
  roiList.innerHTML = "";

  rois.forEach((r) => {
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
      }
    };

    let del = document.createElement("button");

    del.textContent = "🗑";

    del.onclick = (e) => {
      e.stopPropagation();

      rois = rois.filter((x) => x.id !== r.id);

      if (activeROI === r.id) {
        activeROI = rois.length ? rois[0].id : null;
      }

      renderROIList();
      drawROIOverlay();
    };

    div.onclick = () => {
      activeROI = r.id;
      renderROIList();
      drawROIOverlay();
    };

    div.appendChild(name);

    div.appendChild(edit);

    div.appendChild(del);

    roiList.appendChild(div);
  });
}

// Tile capture
//--------------------------------

toggleCapture.onclick = () => {
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

  rois.forEach((r) => {
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

// Tile display
//--------------------------------

function renderTiles() {
  tilesContainer.innerHTML = "";

  [...uniqueTiles.entries()].forEach(([key, tile]) => {
    const div = document.createElement("div");

    div.className = "tileCard";
    div.draggable = true;
    div.dataset.key = key;

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

    addTileDragHandlers(div);

    tilesContainer.appendChild(div);
  });

  tileCount.textContent = uniqueTiles.size;
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
  let data = {
    palette,

    rois: rois.map((r) => ({
      name: r.name,

      tiles: [...r.tiles],
    })),

    tiles: [...uniqueTiles.values()],
  };

  jsonOutput.value = JSON.stringify(data, null, 2);
};

// Init
//--------------------------------

document.getElementById("refreshCamera").onclick = loadCameras;

cameraSelect.onchange = () => {
  startCamera();
};

document.getElementById("startCamera").style.display = "none";

document.getElementById("startCamera").onclick = startCamera;

navigator.mediaDevices
  .getUserMedia({ video: true })
  .then((stream) => {
    stream.getTracks().forEach((t) => t.stop());
    loadCameras();
  })
  .catch((err) => {
    console.warn("Permission not granted yet:", err);
    loadCameras(); // fallback (may show empty labels)
  });

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
drawGrid();
updatePalette();
updateCaptureUI();
