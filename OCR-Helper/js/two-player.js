const WIDTH = 160;
const HEIGHT = 144;
const TILE = 8;
const LOCAL_STORAGE_KEY = "gbOcrHelper.games";
const DEFAULT_THRESHOLDS = [64, 128, 192];
const INITIAL_LUT_CATEGORY = "GB Standard Palettes";
const INITIAL_LUT_PALETTE = "MGB-001";

const players = [
  createPlayerState(1, "Player 1"),
  createPlayerState(2, "Player 2"),
];

let savedGames = {};
let drawLoopStarted = false;

function createPlayerState(number, label) {
  const canvas = document.getElementById(`player${number}Canvas`);

  return {
    label,
    video: document.getElementById(`player${number}Video`),
    canvas,
    ctx: canvas.getContext("2d"),
    cameraSelect: document.getElementById(`player${number}Camera`),
    gameSelect: document.getElementById(`player${number}Game`),
    lutSelect: document.getElementById(`player${number}Lut`),
    calibrateButton: document.getElementById(`player${number}Calibrate`),
    status: document.getElementById(`player${number}Status`),
    stream: null,
    game: null,
    palette: getPalette(INITIAL_LUT_CATEGORY, INITIAL_LUT_PALETTE),
    thresholds: DEFAULT_THRESHOLDS.slice(),
    quantized: new Array(WIDTH * HEIGHT).fill(0),
    activeScreen: null,
    values: [],
    calibrated: false,
  };
}

function getSavedGames() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function getPalette(category, paletteName) {
  return [...paletteLookup[category][paletteName]].reverse().map(hexToRgb);
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");

  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function getLUTOptionValue(category, paletteName) {
  return `${category}::${paletteName}`;
}

function parseLUTOptionValue(value) {
  const [category, paletteName] = value.split("::");

  return { category, paletteName };
}

function populateLUTSelect(select) {
  select.innerHTML = "";

  Object.entries(paletteLookup).forEach(([category, palettes]) => {
    const group = document.createElement("optgroup");
    group.label = category;

    Object.keys(palettes).forEach((paletteName) => {
      const option = document.createElement("option");
      option.value = getLUTOptionValue(category, paletteName);
      option.textContent = paletteName;
      group.appendChild(option);
    });

    select.appendChild(group);
  });

  select.value = getLUTOptionValue(INITIAL_LUT_CATEGORY, INITIAL_LUT_PALETTE);
}

function populateGameSelect(select) {
  select.innerHTML = "";

  const empty = document.createElement("option");
  empty.value = "";
  empty.textContent = "Choose game...";
  select.appendChild(empty);

  Object.keys(savedGames)
    .sort((a, b) => a.localeCompare(b))
    .forEach((name) => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      select.appendChild(option);
    });
}

async function loadCameras() {
  let permissionStream = null;

  try {
    permissionStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
  } catch {
    players.forEach((player) => setPlayerStatus(player, "Camera permission needed.", false));
  } finally {
    permissionStream?.getTracks().forEach((track) => track.stop());
  }

  const devices = await navigator.mediaDevices.enumerateDevices();
  const cameras = devices.filter((device) => device.kind === "videoinput");

  players.forEach((player) => {
    const previous = player.cameraSelect.value;
    player.cameraSelect.innerHTML = "";

    cameras.forEach((camera, index) => {
      const option = document.createElement("option");
      option.value = camera.deviceId;
      option.textContent = camera.label || `Camera ${index + 1}`;
      player.cameraSelect.appendChild(option);
    });

    if (cameras.some((camera) => camera.deviceId === previous)) {
      player.cameraSelect.value = previous;
    }

    if (player.cameraSelect.value) {
      startPlayerCamera(player).catch(() => {
        setPlayerStatus(player, "Could not start camera.", false);
      });
    }
  });
}

async function startPlayerCamera(player) {
  if (player.stream) {
    player.stream.getTracks().forEach((track) => track.stop());
  }

  player.stream = await navigator.mediaDevices.getUserMedia({
    video: {
      deviceId: player.cameraSelect.value
        ? { exact: player.cameraSelect.value }
        : undefined,
      width: { ideal: WIDTH },
      height: { ideal: HEIGHT },
    },
    audio: false,
  });

  player.video.srcObject = player.stream;
  await player.video.play();

  setPlayerStatus(player, "Camera running. Calibrate for best OCR.", true);
  startDrawLoop();
}

function calibratePlayer(player) {
  if (player.video.readyState < 2) {
    setPlayerStatus(player, "Start the camera first.", false);
    return;
  }

  player.ctx.drawImage(player.video, 0, 0, WIDTH, HEIGHT);

  const frame = player.ctx.getImageData(0, 0, WIDTH, HEIGHT);
  const samples = [];

  for (let i = 0; i < frame.data.length; i += 4) {
    samples.push(
      Math.round((frame.data[i] + frame.data[i + 1] + frame.data[i + 2]) / 3),
    );
  }

  player.thresholds = calculateThresholdsFromPalette(findFourShades(samples));
  player.calibrated = true;

  setPlayerStatus(player, "Calibrated.", true);
}

function findFourShades(samples) {
  const histogram = new Array(256).fill(0);

  samples.forEach((value) => {
    histogram[value]++;
  });

  const ranked = histogram
    .map((count, value) => ({ value, count }))
    .sort((a, b) => b.count - a.count);

  const peaks = [];

  for (const peak of ranked) {
    if (!peaks.some((value) => Math.abs(value - peak.value) < 10)) {
      peaks.push(peak.value);
    }

    if (peaks.length === 4) break;
  }

  return peaks.sort((a, b) => b - a);
}

function calculateThresholdsFromPalette(values) {
  const sortedDarkToBright = [...values].sort((a, b) => a - b);

  return [
    Math.round((sortedDarkToBright[0] + sortedDarkToBright[1]) / 2),
    Math.round((sortedDarkToBright[1] + sortedDarkToBright[2]) / 2),
    Math.round((sortedDarkToBright[2] + sortedDarkToBright[3]) / 2),
  ];
}

function processPlayerFrame(player) {
  if (player.video.readyState < 2) return;

  player.ctx.drawImage(player.video, 0, 0, WIDTH, HEIGHT);

  const frame = player.ctx.getImageData(0, 0, WIDTH, HEIGHT);
  const output = player.ctx.createImageData(WIDTH, HEIGHT);

  for (let i = 0; i < WIDTH * HEIGHT; i++) {
    const p = i * 4;
    const gray = (frame.data[p] + frame.data[p + 1] + frame.data[p + 2]) / 3;
    const value = quantizeGray(gray, player.thresholds);
    const color = player.palette[value];

    player.quantized[i] = value;
    output.data[p] = color.r;
    output.data[p + 1] = color.g;
    output.data[p + 2] = color.b;
    output.data[p + 3] = 255;
  }

  player.ctx.putImageData(output, 0, 0);
  updatePlayerOCR(player);
}

function quantizeGray(gray, thresholds) {
  if (gray < thresholds[0]) return 3;
  if (gray < thresholds[1]) return 2;
  if (gray < thresholds[2]) return 1;
  return 0;
}

function updatePlayerOCR(player) {
  if (!player.game) {
    player.activeScreen = null;
    player.values = [];
    return;
  }

  player.activeScreen =
    player.game.screens.find((screen) => screenMatches(player, screen)) || null;

  player.values = player.activeScreen
    ? getRegionValues(player, player.activeScreen)
    : [];
}

function screenMatches(player, screen) {
  return (
    Array.isArray(screen.identifiers) &&
    screen.identifiers.length > 0 &&
    screen.identifiers.every((identifier) => {
      const [x, y] = identifier.tile.split(",").map(Number);

      return tilesEqual(getTile(player, x, y), identifier.pixels || []);
    })
  );
}

function getRegionValues(player, screen) {
  return (screen.rois || []).map((region) => {
    const tileset = player.game.tilesets.find((item) => item.name === region.tileset);
    const labels = tileset
      ? (region.tiles || []).map((key) => {
          const [x, y] = key.split(",").map(Number);

          return findTileLabel(getTile(player, x, y), tileset) || "?";
        })
      : [];

    return {
      name: region.name,
      value: tileset ? formatRegionValue(labels, tileset.type) : "No tileset",
    };
  });
}

function getTile(player, tx, ty) {
  const pixels = [];

  for (let y = 0; y < TILE; y++) {
    for (let x = 0; x < TILE; x++) {
      pixels.push(player.quantized[(ty * TILE + y) * WIDTH + tx * TILE + x]);
    }
  }

  return pixels;
}

function tilesEqual(a, b) {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function findTileLabel(pixels, tileset) {
  const match = (tileset.tiles || []).find((tile) => {
    return tilesEqual(tile.pixels || [], pixels);
  });

  return match ? match.label : null;
}

function formatRegionValue(labels, type) {
  if (labels.length === 0) return "--";

  if (type === "counter") {
    return String(
      labels.reduce((sum, label) => sum + (parseInt(label, 10) || 0), 0),
    );
  }

  const value = labels.join("");

  return /^\d+$/.test(value) ? value.replace(/^0+/, "") || "0" : value;
}

function renderLiveReadout() {
  const liveReadout = document.getElementById("liveReadout");
  liveReadout.innerHTML = "";

  players.forEach((player) => {
    const section = document.createElement("section");
    section.className = "livePlayer";

    const heading = document.createElement("h2");
    heading.textContent = player.label;
    section.appendChild(heading);

    if (!player.game) {
      appendHint(section, "Choose a saved game.");
      liveReadout.appendChild(section);
      return;
    }

    if (!player.activeScreen) {
      appendHint(section, "No matching screen detected.");
      liveReadout.appendChild(section);
      return;
    }

    const screenName = document.createElement("div");
    screenName.className = "liveScreenName";
    screenName.textContent = player.activeScreen.name;
    section.appendChild(screenName);

    if (player.values.length === 0) {
      appendHint(section, "No regions configured.");
    }

    player.values.forEach((region) => {
      const row = document.createElement("div");
      row.className = "liveRegionRow";

      const name = document.createElement("span");
      name.textContent = region.name;

      const value = document.createElement("span");
      value.className = "liveRegionValue";
      value.textContent = region.value;

      row.appendChild(name);
      row.appendChild(value);
      section.appendChild(row);
    });

    liveReadout.appendChild(section);
  });
}

function appendHint(parent, text) {
  const hint = document.createElement("div");
  hint.className = "liveHint";
  hint.textContent = text;
  parent.appendChild(hint);
}

function setPlayerStatus(player, message, good) {
  player.status.textContent = message;
  player.status.classList.toggle("good", good);
  player.status.classList.toggle("bad", !good);
}

function startDrawLoop() {
  if (drawLoopStarted) return;

  drawLoopStarted = true;
  requestAnimationFrame(drawLoop);
}

function drawLoop() {
  players.forEach(processPlayerFrame);
  renderLiveReadout();
  requestAnimationFrame(drawLoop);
}

function setupPlayer(player) {
  populateGameSelect(player.gameSelect);
  populateLUTSelect(player.lutSelect);

  player.cameraSelect.onchange = () => {
    if (!player.cameraSelect.value) return;

    startPlayerCamera(player).catch(() => {
      setPlayerStatus(player, "Could not start camera.", false);
    });
  };

  player.gameSelect.onchange = () => {
    player.game = savedGames[player.gameSelect.value] || null;
    player.activeScreen = null;
    player.values = [];
    renderLiveReadout();
  };

  player.lutSelect.onchange = () => {
    const { category, paletteName } = parseLUTOptionValue(player.lutSelect.value);
    player.palette = getPalette(category, paletteName);
  };

  player.calibrateButton.onclick = () => {
    calibratePlayer(player);
  };
}

function init() {
  savedGames = getSavedGames();

  players.forEach(setupPlayer);
  renderLiveReadout();

  if (Object.keys(savedGames).length === 0) {
    players.forEach((player) => {
      setPlayerStatus(player, "No saved games found in local storage.", false);
    });
  }

  loadCameras();
}

init();
