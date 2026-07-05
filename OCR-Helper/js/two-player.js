const WIDTH = 160;
const HEIGHT = 144;
const TILE = 8;
const LOCAL_STORAGE_KEY = "gbOcrHelper.games";
const TWO_PLAYER_SETTINGS_KEY = "gbOcrHelper.twoPlayerSettings";
const TWO_PLAYER_LEADERBOARD_PREFIX = "gbOcrHelper.twoPlayerLeaderboard.";
const TWO_PLAYER_ALL_TIME_KEY = "gbOcrHelper.twoPlayerLeaderboard.allTime";
const INTERCEPTOR_SETTINGS_URL = "GB-Interceptor-Settings/settings.json";
const DEFAULT_THRESHOLDS = [64, 128, 192];
const INITIAL_LUT_CATEGORY = "GB Standard Palettes";
const INITIAL_LUT_PALETTE = "MGB-001";
const SCORE_METRIC_NAME = "score";
const MAX_VISIBLE_SCORES = 100;
const MAX_SESSION_SCORES = 100;
const MIN_LEADERBOARD_SCORE = 10;
const MAX_NAME_ENTRY_QUEUE = 2;
const NAME_ENTRY_SECONDS = 30;
const NAME_ENTRY_IDLE_SECONDS = 10;
const MAX_SCORE_NAME_LENGTH = 12;
const TRACKED_SCREEN_NAME = "A-Type";
const DEMO_SCORE_SEQUENCE = [
  0, 1, 6, 14, 17, 21, 28, 33, 34, 38, 42, 48, 12048,
];
const DEMO_LABEL_SCORE = 28;
const interceptorScreens = [];
const interceptorScreenMessages = {
  offline: {
    title: "Ohoh, Verbindung verloren!",
    body: "Bitte den GAME BOY neu starten...",
    tone: "offline",
  },
  startup: {
    title: "MOMENT",
    body: "Geduld, der GAME BOY startet gerade auf.",
    tone: "startup",
  },
  cable: {
    title: "Verbindung verloren.",
    body: "USB Kabel erneut einstecken oder Batterien im GAME BOY wechseln.",
    tone: "offline",
    x: true,
  },
};
const fallbackInterceptorSettings = {
  screens: [
    {
      name: "offline",
      identifiers: [
        {
          tile: "14,0",
          pixels: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 3, 3, 3, 0, 0, 0,
            0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0,
            0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 0, 0,
          ],
        },
        {
          tile: "15,0",
          pixels: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0,
          ],
        },
        {
          tile: "17,0",
          pixels: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0,
          ],
        },
        {
          tile: "16,14",
          pixels: [
            3, 3, 3, 3, 1, 0, 0, 0, 3, 3, 3, 3, 2, 0, 0, 0, 3, 3, 3, 3, 3, 1, 0,
            0, 3, 3, 3, 3, 3, 3, 1, 0, 3, 3, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 3,
            3, 3, 2, 3, 3, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 3, 3,
          ],
        },
      ],
      rois: [],
      achievements: [],
    },
    {
      name: "startup",
      identifiers: [
        {
          tile: "14,0",
          pixels: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 3, 3, 3, 0, 0, 0,
            0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0,
            0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 0, 0,
          ],
        },
        {
          tile: "15,0",
          pixels: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0,
          ],
        },
        {
          tile: "17,0",
          pixels: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0,
          ],
        },
        {
          tile: "16,14",
          pixels: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          ],
        },
      ],
      rois: [],
      achievements: [],
    },
  ],
  tilesets: [],
};
const achievementTiers = [
  "beginner",
  "novice",
  "intermediate",
  "advanced",
  "expert",
  "pro",
  "god-tier",
];

const players = [
  createPlayerState(1, "Player 1", "blue"),
  createPlayerState(2, "Player 2", "red"),
];

let savedGames = {};
let drawLoopStarted = false;
let selectedGameName = "";
let selectedGame = null;
let sessionScores = [];
let sessionScoreId = 0;
let scoreBoardSignature = "";
let useFastOCR = true;
let scoreScrollDirection = 1;
let scoreScrollHoldUntil = 0;
let scoreScrollLastTime = 0;
let topGameSetupCloseTimer = null;

const sharedGameSelect = document.getElementById("sharedGameSelect");
const sharedGamePicker = sharedGameSelect.closest(".gameSelectWrap");
const sharedGameButton = document.getElementById("sharedGameButton");
const sharedGameList = document.getElementById("sharedGameList");
const topGameSetup = document.querySelector(".topGameSetup");
const importJSONButton = document.getElementById("importJSON");
const importJSONFile = document.getElementById("importJSONFile");
const scoreBoard = document.getElementById("scoreBoard");
const highScoreTitle = document.getElementById("highScoreTitle");
const fastOCRToggle = document.getElementById("fastOCRToggle");
const showAchievementsButton = document.getElementById("showAchievements");
const showDaysButton = document.getElementById("showDays");
const achievementsModal = document.getElementById("achievementsModal");
const daysModal = document.getElementById("daysModal");
const closeAchievementsModal = document.getElementById(
  "closeAchievementsModal",
);
const closeDaysModal = document.getElementById("closeDaysModal");
const achievementsModalContent = document.getElementById(
  "achievementsModalContent",
);
const daysModalContent = document.getElementById("daysModalContent");
let persistedSettings = getTwoPlayerSettings();

function getTodayDateKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getTodayLeaderboardKey() {
  return `${TWO_PLAYER_LEADERBOARD_PREFIX}${getTodayDateKey()}`;
}

function getLeaderboardStorageKey(dateKey) {
  return `${TWO_PLAYER_LEADERBOARD_PREFIX}${dateKey}`;
}

function createPlayerState(number, label, color) {
  const canvas = document.getElementById(`player${number}Canvas`);

  return {
    label,
    color,
    video: document.getElementById(`player${number}Video`),
    canvas,
    ctx: canvas.getContext("2d"),
    feedFrame: document
      .getElementById(`player${number}Canvas`)
      .closest(".feedFrame"),
    cameraSelect: document.getElementById(`player${number}Camera`),
    lutSelect: document.getElementById(`player${number}Lut`),
    calibrateButton: document.getElementById(`player${number}Calibrate`),
    status: document.getElementById(`player${number}Status`),
    achievementLayer: document.getElementById(`player${number}Achievements`),
    screenBadge: document.getElementById(`player${number}ScreenBadge`),
    currentRank: document.getElementById(`player${number}CurrentRank`),
    nameEntryPanel: document.getElementById(`player${number}NameEntry`),
    interceptorOverlay: document.getElementById(
      `player${number}InterceptorOverlay`,
    ),
    stream: null,
    cameraRecoveryTimer: null,
    cameraRecovering: false,
    cableLost: false,
    game: null,
    palette: getPalette(INITIAL_LUT_CATEGORY, INITIAL_LUT_PALETTE),
    thresholds: DEFAULT_THRESHOLDS.slice(),
    quantized: new Array(WIDTH * HEIGHT).fill(0),
    activeScreen: null,
    values: [],
    calibrated: false,
    runActive: false,
    currentScore: null,
    lastScore: null,
    finalizedScore: null,
    scoreEntryId: null,
    lastVisibleRank: null,
    demoIndex: 0,
    demoKnown: false,
    achievementReadableScreen: null,
    achievementRuntimeStates: new Map(),
    achievementToastQueue: [],
    achievementToastShowing: false,
  };
}

function getSavedGames() {
  try {
    const games = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {};

    return Object.fromEntries(
      Object.entries(games)
        .filter(([, data]) => isValidProjectData(data))
        .map(([name, data]) => [name, normalizeProjectData(data)]),
    );
  } catch {
    return {};
  }
}

function setSavedGames(games) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(games));
}

function getTwoPlayerSettings() {
  try {
    return JSON.parse(localStorage.getItem(TWO_PLAYER_SETTINGS_KEY)) || {};
  } catch {
    return {};
  }
}

function saveTwoPlayerSettings() {
  const settings = {
    game: selectedGameName,
    useFastOCR,
    players: players.map((player) => ({
      cameraId: player.cameraSelect.value,
      lut: player.lutSelect.value,
      calibrated: player.calibrated,
      thresholds: player.thresholds,
    })),
  };

  localStorage.setItem(TWO_PLAYER_SETTINGS_KEY, JSON.stringify(settings));
}

function getTodayLeaderboard() {
  try {
    const data =
      JSON.parse(localStorage.getItem(getTodayLeaderboardKey())) || [];

    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function getAllTimeLeaderboard() {
  try {
    const data = JSON.parse(localStorage.getItem(TWO_PLAYER_ALL_TIME_KEY)) || [];

    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function getSettledSessionEntries() {
  return sessionScores.filter((entry) => {
    return (
      isLeaderboardScore(entry) &&
      !entry.active &&
      !entry.nameEntry &&
      !entry.demo &&
      !entry.removingDemo
    );
  });
}

function isLeaderboardScore(entry) {
  return Number(entry?.score) >= MIN_LEADERBOARD_SCORE;
}

function getScoreEntryKey(entry) {
  return entry.key || `${entry.date || getTodayDateKey()}-${entry.game || "game"}-${entry.startedAt || Date.now()}-${entry.id || "score"}`;
}

function serializeScoreEntry(entry) {
  return {
    id: entry.id,
    key: getScoreEntryKey(entry),
    date: entry.date || getTodayDateKey(),
    game: entry.game,
    player: entry.player,
    name: entry.name || "",
    color: entry.color,
    score: entry.score,
    startedAt: entry.startedAt,
  };
}

function saveTodayLeaderboard() {
  const entries = getSettledSessionEntries()
    .map(serializeScoreEntry)
    .slice(0, MAX_SESSION_SCORES);

  localStorage.setItem(getTodayLeaderboardKey(), JSON.stringify(entries));
  saveAllTimeLeaderboard();
}

function saveAllTimeLeaderboard() {
  const byKey = new Map(
    getAllTimeLeaderboard().map((entry) => [getScoreEntryKey(entry), entry]),
  );

  getSettledSessionEntries().forEach((entry) => {
    const serialized = serializeScoreEntry(entry);

    byKey.set(serialized.key, serialized);
  });

  const grouped = new Map();

  [...byKey.values()]
    .filter((entry) => {
      return (
        entry &&
        Number.isFinite(Number(entry.score)) &&
        isLeaderboardScore(entry)
      );
    })
    .forEach((entry) => {
      const gameName = entry.game || "";
      const entries = grouped.get(gameName) || [];

      entries.push(entry);
      grouped.set(gameName, entries);
    });
  const entries = [...grouped.values()].flatMap((items) => {
    return items.sort(compareScoreEntries).slice(0, 20);
  });

  localStorage.setItem(TWO_PLAYER_ALL_TIME_KEY, JSON.stringify(entries));
}

function restoreTodayLeaderboard() {
  sessionScores = getTodayLeaderboard()
    .filter((entry) => {
      return entry && Number.isFinite(Number(entry.score)) && isLeaderboardScore(entry);
    })
    .map((entry) => ({
      id: Number(entry.id) || ++sessionScoreId,
      key: entry.key || getScoreEntryKey(entry),
      date: entry.date || getTodayDateKey(),
      game: entry.game || "",
      player: entry.player || entry.name || "Player",
      name: entry.name || "",
      color: entry.color === "red" ? "red" : "blue",
      score: Number(entry.score),
      active: false,
      demo: false,
      startedAt: Number(entry.startedAt) || Date.now(),
    }));

  sessionScoreId = sessionScores.reduce((max, entry) => {
    return Math.max(max, entry.id);
  }, sessionScoreId);
}

function getStoredLeaderboardDays() {
  const days = [];

  for (let index = 0; index < localStorage.length; index++) {
    const key = localStorage.key(index);

    if (!key?.startsWith(TWO_PLAYER_LEADERBOARD_PREFIX)) continue;
    if (key === TWO_PLAYER_ALL_TIME_KEY) continue;

    days.push(key.slice(TWO_PLAYER_LEADERBOARD_PREFIX.length));
  }

  return days.sort((a, b) => b.localeCompare(a));
}

function deleteStoredLeaderboardDay(dateKey) {
  localStorage.removeItem(getLeaderboardStorageKey(dateKey));

  if (dateKey === getTodayDateKey()) {
    sessionScores.forEach((entry) => {
      if (entry.nameEntry?.timer) {
        window.clearInterval(entry.nameEntry.timer);
      }
    });
    sessionScores = [];
    scoreBoardSignature = "";
    players.forEach(resetPlayerRun);
  }

  rebuildAllTimeLeaderboardFromDays();
}

function rebuildAllTimeLeaderboardFromDays() {
  const entries = [];

  getStoredLeaderboardDays().forEach((dateKey) => {
    try {
      const data =
        JSON.parse(localStorage.getItem(getLeaderboardStorageKey(dateKey))) || [];

      if (Array.isArray(data)) {
        entries.push(...data);
      }
    } catch {
      // Ignore malformed historical days.
    }
  });

  localStorage.setItem(
    TWO_PLAYER_ALL_TIME_KEY,
    JSON.stringify(
      [...entries
        .filter((entry) => {
          return (
            entry &&
            Number.isFinite(Number(entry.score)) &&
            isLeaderboardScore(entry)
          );
        })
        .reduce((groups, entry) => {
          const gameName = entry.game || "";
          const items = groups.get(gameName) || [];

          items.push(entry);
          groups.set(gameName, items);

          return groups;
        }, new Map())
        .values()].flatMap((items) => items.sort(compareScoreEntries).slice(0, 20)),
    ),
  );
}

function restorePlayerSettings(player, settings) {
  if (!settings) return;

  if (settings.lut) {
    player.lutSelect.value = settings.lut;

    if (player.lutSelect.value === settings.lut) {
      const { category, paletteName } = parseLUTOptionValue(settings.lut);
      player.palette = getPalette(category, paletteName);
    }
  }

  if (
    Array.isArray(settings.thresholds) &&
    settings.thresholds.length === DEFAULT_THRESHOLDS.length
  ) {
    player.thresholds = settings.thresholds.slice();
    player.calibrated = Boolean(settings.calibrated);
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

function populateSharedGameSelect() {
  const previous = selectedGameName || persistedSettings.game || "";

  sharedGameSelect.innerHTML = "";
  sharedGameList.replaceChildren();

  const empty = document.createElement("option");
  empty.value = "";
  empty.textContent = "Choose game...";
  sharedGameSelect.appendChild(empty);

  Object.keys(savedGames)
    .sort((a, b) => a.localeCompare(b))
    .forEach((name) => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      sharedGameSelect.appendChild(option);
      sharedGameList.appendChild(createGameListRow(name));
    });

  selectedGameName = savedGames[previous] ? previous : "";
  sharedGameSelect.value = selectedGameName;
  selectedGame = selectedGameName ? savedGames[selectedGameName] : null;
  players.forEach((player) => {
    player.game = selectedGame;
  });
  updateSharedGameButton();
  updateHighScoreTitle();
}

function createGameListRow(name) {
  const row = document.createElement("button");
  const label = document.createElement("span");
  const del = document.createElement("span");

  row.className = "gameSelectOption";
  row.type = "button";
  row.dataset.game = name;
  row.classList.toggle("selected", name === selectedGameName);
  label.textContent = name;
  del.className = "gameSelectDelete";
  del.textContent = "×";
  del.title = `Delete ${name}`;
  del.setAttribute("aria-label", `Delete ${name}`);

  del.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    deleteSavedGame(name);
  };

  row.onclick = () => {
    selectSharedGame(name);
    closeSharedGameList();
  };

  row.append(label, del);

  return row;
}

function updateSharedGameButton() {
  sharedGameButton.textContent = selectedGameName || "Choose game...";
  [...sharedGameList.querySelectorAll(".gameSelectOption")].forEach((option) => {
    option.classList.toggle("selected", option.dataset.game === selectedGameName);
  });
}

function toggleSharedGameList() {
  const open = sharedGameList.hidden;

  sharedGameList.hidden = !open;
  sharedGamePicker.classList.toggle("open", open);
  topGameSetup?.classList.add("open");
}

function closeSharedGameList() {
  sharedGameList.hidden = true;
  sharedGamePicker.classList.remove("open");
}

function closeTopGameSetup() {
  closeSharedGameList();
  topGameSetup?.classList.remove("open");
}

function scheduleTopGameSetupClose() {
  window.clearTimeout(topGameSetupCloseTimer);
  topGameSetupCloseTimer = window.setTimeout(closeTopGameSetup, 4000);
}

function keepTopGameSetupOpen() {
  window.clearTimeout(topGameSetupCloseTimer);
  topGameSetup?.classList.add("open");
}

function deleteSavedGame(name) {
  if (!name) return;

  if (!window.confirm(`Delete saved game "${name}"?`)) return;

  delete savedGames[name];
  setSavedGames(savedGames);

  if (selectedGameName === name) {
    selectSharedGame("");
  }

  populateSharedGameSelect();
  closeSharedGameList();
  saveTwoPlayerSettings();
}

function selectSharedGame(name) {
  clearNameEntryTimers();
  selectedGameName = name;
  selectedGame = savedGames[name] || null;
  scoreBoardSignature = "";

  players.forEach((player) => {
    player.game = selectedGame;
    resetPlayerRun(player);
    resetPlayerAchievements(player, { clearQueue: true });
    player.activeScreen = null;
    player.values = [];
    updateInterceptorOverlay(player);
  });

  sharedGameSelect.value = selectedGameName;
  updateSharedGameButton();
  updateHighScoreTitle();
  saveTwoPlayerSettings();
  updateAllPlayerStatuses();
  renderScoreBoard();
}

function clearNameEntryTimers() {
  let changed = false;

  sessionScores.forEach((entry) => {
    if (entry.nameEntry?.timer) {
      const value = entry.nameEntry.value.trim();

      if (value) {
        entry.name = value;
        entry.player = value;
      }

      window.clearInterval(entry.nameEntry.timer);
      delete entry.nameEntry;
      changed = true;
    }
  });

  if (changed) {
    saveTodayLeaderboard();
  }
}

function updateHighScoreTitle() {
  highScoreTitle.textContent = selectedGameName
    ? selectedGameName.toUpperCase()
    : "HIGH SCORE";
}

async function importProjectFiles(files) {
  const imported = [];

  for (const file of files) {
    try {
      const data = JSON.parse(await file.text());

      if (!isValidProjectData(data)) {
        window.alert(`${file.name} is not a valid OCR JSON.`);
        continue;
      }

      imported.push({
        name: data.game || file.name.replace(/\.json$/i, ""),
        timestamp: getProjectTimestamp(data, file),
        data: normalizeProjectData(data),
      });
    } catch {
      window.alert(`${file.name} could not be imported.`);
    }
  }

  if (imported.length === 0) return;

  const byName = new Map();

  imported.forEach((item, index) => {
    const current = byName.get(item.name);
    const ranked = { ...item, index };

    if (
      !current ||
      ranked.timestamp > current.timestamp ||
      (ranked.timestamp === current.timestamp && ranked.index > current.index)
    ) {
      byName.set(item.name, ranked);
    }
  });

  const kept = [...byName.values()];
  const overwrites = kept
    .filter((item) =>
      Object.prototype.hasOwnProperty.call(savedGames, item.name),
    )
    .map((item) => item.name);

  if (
    overwrites.length > 0 &&
    !window.confirm(`Overwrite saved game(s)?\n\n- ${overwrites.join("\n- ")}`)
  ) {
    return;
  }

  kept.forEach(({ name, data }) => {
    savedGames[name] = data;
  });

  setSavedGames(savedGames);
  selectedGameName = kept[0].name;
  populateSharedGameSelect();
  selectSharedGame(selectedGameName);
  saveTwoPlayerSettings();
}

function getProjectTimestamp(data, file) {
  const exportedAt = Date.parse(data.exportedAt || "");

  if (Number.isFinite(exportedAt)) return exportedAt;

  return file.lastModified || 0;
}

function isValidProjectData(data) {
  return data && Array.isArray(data.screens) && Array.isArray(data.tilesets);
}

function normalizeProjectData(data) {
  return {
    ...data,
    tilesets: (data.tilesets || []).map((tileset) => ({
      ...tileset,
      type: normalizeTilesetType(tileset.type),
      scanPixels: normalizeScanPixels(tileset.scanPixels),
      tiles: Array.isArray(tileset.tiles) ? tileset.tiles : [],
    })),
    screens: (data.screens || []).map((screen) => ({
      ...screen,
      identifiers: Array.isArray(screen.identifiers) ? screen.identifiers : [],
      rois: Array.isArray(screen.rois) ? screen.rois : [],
      achievements: normalizeImportedAchievements(screen.achievements),
    })),
  };
}

async function loadInterceptorSettings() {
  let settings = fallbackInterceptorSettings;

  if (window.location.protocol !== "file:") {
    try {
      const response = await fetch(INTERCEPTOR_SETTINGS_URL, {
        cache: "no-store",
      });

      if (response.ok) {
        settings = await response.json();
      }
    } catch {
      settings = fallbackInterceptorSettings;
    }
  }

  const data = normalizeProjectData(settings);
  const screens = (data.screens || []).filter((screen) => {
    return Object.prototype.hasOwnProperty.call(
      interceptorScreenMessages,
      normalizeScreenName(screen.name),
    );
  });

  interceptorScreens.splice(0, interceptorScreens.length, ...screens);
}

function getDetectableScreens(gameData) {
  return [...interceptorScreens, ...(gameData?.screens || [])];
}

function normalizeScreenName(name) {
  return String(name || "")
    .trim()
    .toLowerCase();
}

async function loadCameras() {
  let permissionStream = null;

  try {
    permissionStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
  } catch {
    players.forEach((player) =>
      setPlayerStatus(player, "Camera permission needed.", false),
    );
  } finally {
    permissionStream?.getTracks().forEach((track) => track.stop());
  }

  const devices = await navigator.mediaDevices.enumerateDevices();
  const cameras = devices.filter((device) => device.kind === "videoinput");

  players.forEach((player) => {
    const playerIndex = players.indexOf(player);
    const savedCameraId =
      persistedSettings.players?.[playerIndex]?.cameraId || "";
    const previous = player.cameraSelect.value || savedCameraId;

    player.cameraSelect.innerHTML = "";

    const empty = document.createElement("option");
    empty.value = "";
    empty.textContent = "Choose camera...";
    player.cameraSelect.appendChild(empty);

    cameras.forEach((camera, index) => {
      const option = document.createElement("option");
      option.value = camera.deviceId;
      option.textContent = camera.label || `Camera ${index + 1}`;
      player.cameraSelect.appendChild(option);
    });

    if (cameras.some((camera) => camera.deviceId === previous)) {
      player.cameraSelect.value = previous;
    }
  });

  updateCameraSelectAvailability();

  for (const player of players) {
    if (!player.cameraSelect.value || playerHasDuplicateCamera(player)) {
      continue;
    }

    try {
      await startPlayerCamera(player);
    } catch {
      setPlayerStatus(player, "Could not start camera.", false);
    }
  }

  updateAllPlayerStatuses();
}

async function startPlayerCamera(player) {
  stopCameraRecovery(player);

  if (player.stream) {
    stopPlayerStream(player);
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
  bindCameraRecovery(player);
  await player.video.play();

  player.cameraRecovering = false;
  updatePlayerStatus(player);
  saveTwoPlayerSettings();
  startDrawLoop();
}

function bindCameraRecovery(player) {
  player.stream.getVideoTracks().forEach((track) => {
    track.onended = () => {
      scheduleCameraRecovery(player);
    };

    track.onmute = () => {
      scheduleCameraRecovery(player);
    };
  });

  player.video.onstalled = () => {
    scheduleCameraRecovery(player);
  };

  player.video.onerror = () => {
    scheduleCameraRecovery(player);
  };
}

function scheduleCameraRecovery(player) {
  if (!player.cameraSelect.value || player.cameraRecoveryTimer) return;

  player.cameraRecovering = true;
  player.cableLost = true;
  setPlayerStatus(player, "", true);
  updateInterceptorOverlay(player);

  player.cameraRecoveryTimer = window.setInterval(() => {
    recoverPlayerCamera(player);
  }, 1500);
}

async function recoverPlayerCamera(player) {
  if (!player.cameraSelect.value || playerHasDuplicateCamera(player)) {
    stopCameraRecovery(player);
    updatePlayerStatus(player);
    return;
  }

  try {
    if (player.stream) {
      stopPlayerStream(player);
    }

    player.stream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: { exact: player.cameraSelect.value },
        width: { ideal: WIDTH },
        height: { ideal: HEIGHT },
      },
      audio: false,
    });

    player.video.srcObject = player.stream;
    bindCameraRecovery(player);
    await player.video.play();
    stopCameraRecovery(player);
    updatePlayerStatus(player);
  } catch {
    player.cableLost = true;
    setPlayerStatus(player, "", true);
    updateInterceptorOverlay(player);
  }
}

function stopCameraRecovery(player) {
  if (player.cameraRecoveryTimer) {
    window.clearInterval(player.cameraRecoveryTimer);
    player.cameraRecoveryTimer = null;
  }

  player.cameraRecovering = false;
}

function stopPlayerStream(player) {
  player.stream.getTracks().forEach((track) => {
    track.onended = null;
    track.onmute = null;
    track.stop();
  });
}

function updateCameraSelectAvailability() {
  players.forEach((player) => {
    const usedByOtherPlayer = new Set(
      players
        .filter((other) => other !== player)
        .map((other) => other.cameraSelect.value)
        .filter(Boolean),
    );

    [...player.cameraSelect.options].forEach((option) => {
      option.disabled =
        option.value !== "" && usedByOtherPlayer.has(option.value);
    });
  });
}

function playerHasDuplicateCamera(player) {
  return players.some((other) => {
    return (
      other !== player &&
      player.cameraSelect.value !== "" &&
      other.cameraSelect.value === player.cameraSelect.value
    );
  });
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

  updatePlayerStatus(player);
  saveTwoPlayerSettings();
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
  if (player.video.readyState < 2) {
    if (
      player.cameraSelect.value &&
      player.stream &&
      !player.cameraRecovering
    ) {
      const liveTrack = player.stream.getVideoTracks().some((track) => {
        return track.readyState === "live" && !track.muted;
      });

      if (!liveTrack) {
        scheduleCameraRecovery(player);
      }
    }

    return;
  }

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
    updatePlayerScreenBadge(player);
    updateInterceptorOverlay(player);
    resetPlayerRun(player);
    updatePlayerAchievementScreenRun(player, null, false);
    return;
  }

  const previousScreen = player.activeScreen;

  player.activeScreen =
    getDetectableScreens(player.game).find((screen) =>
      screenMatches(player, screen),
    ) || null;

  player.values = player.activeScreen
    ? getRegionValues(player, player.activeScreen)
    : [];

  updatePlayerScreenBadge(player);
  updateInterceptorOverlay(player);
  updatePlayerRun(player, previousScreen);
  updatePlayerAchievementScreenRun(
    player,
    player.activeScreen,
    Boolean(player.activeScreen),
  );
  evaluatePlayerAchievements(player);
}

function updatePlayerRun(player, previousScreen) {
  if (!isTrackedScreen(player.activeScreen)) {
    if (player.runActive && player.currentScore !== null) {
      finalizePlayerScore(player);
    }

    player.runActive = false;
    return;
  }

  const score = getPlayerScore(player);

  if (!player.runActive || previousScreen !== player.activeScreen) {
    if (!player.runActive && player.finalizedScore !== null) {
      resetPlayerRun(player);
    }

    player.runActive = true;
  }

  if (score === null) return;

  updateDemoTracking(player, score);

  if (player.lastScore !== null && score < player.lastScore) {
    finalizePlayerScore(player);
    resetPlayerRun(player);
    player.runActive = true;
  }

  player.currentScore = Math.max(player.currentScore ?? score, score);
  player.lastScore = score;
  player.finalizedScore = null;
  updateSessionScore(player, player.currentScore, {
    demo: player.demoKnown,
  });
}

function isTrackedScreen(screen) {
  return screen?.name === TRACKED_SCREEN_NAME;
}

function updatePlayerScreenBadge(player) {
  player.screenBadge.textContent = player.activeScreen?.name || "No screen";
  player.screenBadge.classList.toggle(
    "tracked",
    isTrackedScreen(player.activeScreen),
  );
}

function updateInterceptorOverlay(player) {
  const screenName = normalizeScreenName(player.activeScreen?.name);
  let message = interceptorScreenMessages[screenName];

  if (player.cableLost && (!screenName || screenName === "startup")) {
    message = interceptorScreenMessages.cable;
  } else if (player.cableLost && screenName && screenName !== "startup") {
    player.cableLost = false;
  }

  if (!message) {
    player.interceptorOverlay.hidden = true;
    player.interceptorOverlay.replaceChildren();
    player.interceptorOverlay.dataset.tone = "";
    return;
  }

  const title = document.createElement("strong");
  const body = document.createElement("span");
  const closeMark = document.createElement("div");

  title.textContent = message.title;
  body.textContent = message.body;
  closeMark.className = "interceptorX";
  closeMark.textContent = "×";
  closeMark.hidden = message.tone !== "offline";

  player.interceptorOverlay.dataset.tone = message.tone;
  player.interceptorOverlay.replaceChildren(closeMark, title, body);
  player.interceptorOverlay.hidden = false;
}

function getPlayerScore(player) {
  const scoreRegion = player.values.find((region) => {
    return (
      String(region.name || "")
        .trim()
        .toLowerCase() === SCORE_METRIC_NAME
    );
  });

  if (!scoreRegion) return null;

  const score = Number(String(scoreRegion.value).replace(/[^\d-]/g, ""));

  return Number.isFinite(score) ? score : null;
}

function finalizePlayerScore(player) {
  if (!selectedGameName || player.currentScore === null) return;

  player.finalizedScore = player.currentScore;
  finalizeSessionScore(player);
}

function resetPlayerRun(player) {
  player.runActive = false;
  player.currentScore = null;
  player.lastScore = null;
  player.finalizedScore = null;
  player.scoreEntryId = null;
  player.lastVisibleRank = null;
  player.demoIndex = 0;
  player.demoKnown = false;
}

function updateDemoTracking(player, score) {
  const demoLabelIndex = DEMO_SCORE_SEQUENCE.indexOf(DEMO_LABEL_SCORE);

  if (score === player.lastScore) return;

  if (score === DEMO_SCORE_SEQUENCE[player.demoIndex]) {
    player.demoIndex += 1;
  } else if (score === DEMO_SCORE_SEQUENCE[0]) {
    player.demoIndex = 1;
  } else if (!player.demoKnown) {
    player.demoIndex = 0;
  }

  if (score >= DEMO_LABEL_SCORE && player.demoIndex > demoLabelIndex) {
    player.demoKnown = true;
  }
}

function updateSessionScore(player, score, options = {}) {
  if (!selectedGameName) return;

  let entry = sessionScores.find((item) => item.id === player.scoreEntryId);

  if (!entry) {
    entry = {
      id: ++sessionScoreId,
      key: `${getTodayDateKey()}-${selectedGameName || "game"}-${Date.now()}-${sessionScoreId}`,
      date: getTodayDateKey(),
      player: player.label,
      color: player.color,
      score,
      active: true,
      demo: false,
      game: selectedGameName,
      startedAt: Date.now(),
    };
    player.scoreEntryId = entry.id;
    sessionScores.push(entry);
  }

  entry.score = score;
  entry.active = true;
  entry.demo = Boolean(options.demo);
  entry.player = entry.demo ? "Demo" : entry.name || player.label;
  trimSessionScores();
}

function finalizeSessionScore(player) {
  const entry = sessionScores.find((item) => item.id === player.scoreEntryId);

  if (!entry) return;

  entry.active = false;
  player.scoreEntryId = null;

  if (entry.demo) {
    removeDemoScoreEntry(entry);
  } else if (!isLeaderboardScore(entry)) {
    removeLowScoreEntry(entry);
  } else {
    maybeStartNameEntry(entry);

    if (!entry.nameEntry) {
      saveTodayLeaderboard();
    }
  }

  trimSessionScores();
}

function removeDemoScoreEntry(entry) {
  entry.removingDemo = true;
  scoreBoardSignature = "";
  renderScoreBoard();

  window.setTimeout(() => {
    sessionScores = sessionScores.filter((item) => item.id !== entry.id);
    scoreBoardSignature = "";
    saveTodayLeaderboard();
    renderScoreBoard();
  }, 520);
}

function removeLowScoreEntry(entry) {
  entry.removingDemo = true;
  scoreBoardSignature = "";
  renderScoreBoard();

  window.setTimeout(() => {
    sessionScores = sessionScores.filter((item) => item.id !== entry.id);
    scoreBoardSignature = "";
    saveTodayLeaderboard();
    renderScoreBoard();
  }, 520);
}

function trimSessionScores() {
  const activeIds = new Set(
    sessionScores.filter((item) => item.active).map((item) => item.id),
  );
  const pendingNameIds = new Set(
    sessionScores.filter((item) => item.nameEntry).map((item) => item.id),
  );
  const removingDemoIds = new Set(
    sessionScores.filter((item) => item.removingDemo).map((item) => item.id),
  );
  const topIds = new Set(
    [...sessionScores]
      .sort(compareScoreEntries)
      .slice(0, MAX_SESSION_SCORES)
      .map((item) => item.id),
  );

  sessionScores = sessionScores.filter((item) => {
    return (
      activeIds.has(item.id) ||
      pendingNameIds.has(item.id) ||
      removingDemoIds.has(item.id) ||
      topIds.has(item.id)
    );
  });
}

function maybeStartNameEntry(entry) {
  if (entry.demo || entry.nameEntry) return;
  if (!isLeaderboardScore(entry)) return;

  const queued = sessionScores.filter((item) => item.nameEntry).length;

  if (queued >= MAX_NAME_ENTRY_QUEUE) return;

  entry.nameEntry = {
    value: "",
    inputStarted: false,
    expiresAt: Date.now() + NAME_ENTRY_SECONDS * 1000,
    idleExpiresAt: null,
    timer: null,
  };

  entry.nameEntry.timer = window.setInterval(() => {
    const now = Date.now();

    if (now >= getNameEntryDeadline(entry)) {
      finishNameEntry(entry);
      return;
    }

    scoreBoardSignature = "";
    renderPlayerNameEntryPanels();
    renderScoreBoard();
  }, 250);

  scoreBoardSignature = "";
  renderScoreBoard();
}

function getSessionScoreRank(entry) {
  return (
    [...sessionScores]
      .filter((item) => {
        return !item.demo && !item.removingDemo && isLeaderboardScore(item);
      })
      .sort(compareScoreEntries)
      .findIndex((item) => item.id === entry.id) + 1
  );
}

function compareScoreEntries(a, b) {
  return b.score - a.score || b.startedAt - a.startedAt;
}

function handleNameEntryKey(e) {
  const entry = sessionScores.find((item) => item.nameEntry);

  if (!entry) return;

  if (e.key === "Enter") {
    e.preventDefault();
    finishNameEntry(entry);
    return;
  }

  if (e.key === "Backspace") {
    e.preventDefault();
    entry.nameEntry.value = entry.nameEntry.value.slice(0, -1);
    refreshNameEntry(entry);
    return;
  }

  if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;

  e.preventDefault();

  if (entry.nameEntry.value.length < MAX_SCORE_NAME_LENGTH) {
    entry.nameEntry.value += e.key.toUpperCase();
  }

  refreshNameEntry(entry);
}

function refreshNameEntry(entry) {
  entry.nameEntry.inputStarted = true;
  entry.nameEntry.idleExpiresAt = Date.now() + NAME_ENTRY_IDLE_SECONDS * 1000;
  scoreBoardSignature = "";
  renderPlayerNameEntryPanels();
  renderScoreBoard();
}

function finishNameEntry(entry) {
  if (!entry.nameEntry) return;

  const value = entry.nameEntry.value.trim();

  if (value) {
    entry.name = value;
    entry.player = value;
  }

  window.clearInterval(entry.nameEntry.timer);
  delete entry.nameEntry;
  saveTodayLeaderboard();
  scoreBoardSignature = "";
  renderScoreBoard();
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
    const tileset = player.game.tilesets.find(
      (item) => item.name === region.tileset,
    );
    const labels = tileset
      ? sortTileKeysByReadingOrder(region.tiles || [])
          .map((key) => {
            const [x, y] = key.split(",").map(Number);

            return findTileLabel(getTile(player, x, y), tileset);
          })
          .filter((label) => label !== null && label !== "")
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

function sortTileKeysByReadingOrder(keys) {
  return [...keys].sort((a, b) => {
    const [ax, ay] = a.split(",").map(Number);
    const [bx, by] = b.split(",").map(Number);

    return ay - by || ax - bx;
  });
}

function tilesEqual(a, b) {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function tilesEqualByScanPixels(a, b, scanPixels = null) {
  if (!scanPixels || scanPixels.length === 0) {
    return tilesEqual(a, b);
  }

  return scanPixels.every((index) => a[index] === b[index]);
}

function findTileLabel(pixels, tileset) {
  const scanPixels =
    useFastOCR && isUsableScanPixelSet(tileset.scanPixels)
      ? tileset.scanPixels
      : null;
  const match = (tileset.tiles || []).find((tile) => {
    return tilesEqualByScanPixels(tile.pixels || [], pixels, scanPixels);
  });

  return match ? match.label : null;
}

function isUsableScanPixelSet(scanPixels) {
  return (
    Array.isArray(scanPixels) &&
    scanPixels.length > 0 &&
    scanPixels.length < TILE * TILE
  );
}

function normalizeScanPixels(scanPixels) {
  if (!Array.isArray(scanPixels)) return [];

  return [...new Set(scanPixels.map(Number))]
    .filter(
      (index) => Number.isInteger(index) && index >= 0 && index < TILE * TILE,
    )
    .sort((a, b) => a - b);
}

function normalizeTilesetType(type) {
  return type === "counter" ? "counter" : "text-number";
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

function evaluatePlayerAchievements(player) {
  if (
    !player.activeScreen ||
    !Array.isArray(player.activeScreen.achievements)
  ) {
    return;
  }

  const valuesByName = getPlayerOCRValues(player);

  player.activeScreen.achievements.forEach((achievement, index) => {
    if (!achievement.metric) return;

    const state = getPlayerAchievementRuntimeState(
      player,
      player.activeScreen,
      achievement,
      index,
    );
    const currentValue = getPlayerAchievementOCRValue(
      valuesByName,
      achievement.metric,
    );

    if (currentValue === undefined) return;

    const met = achievementConditionMet(currentValue, achievement);

    if (!state.initialized) {
      state.initialized = true;
      state.wasMet = met;
      return;
    }

    if (!state.fired && met && !state.wasMet) {
      state.fired = true;
      enqueuePlayerAchievementToast(player, achievement);
    }

    state.wasMet = met;
  });
}

function getPlayerOCRValues(player) {
  return Object.fromEntries(
    player.values.map((region) => {
      return [String(region.name || "").trim(), region.value];
    }),
  );
}

function getPlayerAchievementOCRValue(valuesByName, metric) {
  if (valuesByName[metric] !== undefined) {
    return valuesByName[metric];
  }

  const normalizedMetric = String(metric || "").trim();
  const key = Object.keys(valuesByName).find((name) => {
    return name.trim() === normalizedMetric;
  });

  return key ? valuesByName[key] : undefined;
}

function updatePlayerAchievementScreenRun(player, screen, canReadScreen) {
  if (!screen || !canReadScreen) {
    player.achievementReadableScreen = null;
    return;
  }

  if (player.achievementReadableScreen === screen) return;

  player.achievementReadableScreen = screen;
  resetPlayerAchievementRuntimeForLifecycleScreen(player, screen, {
    clearQueue: true,
  });
}

function resetPlayerAchievements(player, options = {}) {
  const { clearQueue = false } = options;

  player.achievementReadableScreen = null;
  player.achievementRuntimeStates = new Map();

  if (clearQueue) {
    player.achievementToastQueue = [];
    player.achievementToastShowing = false;
    player.achievementLayer.innerHTML = "";
  }
}

function getPlayerAchievementRuntimeState(player, screen, achievement, index) {
  const key = getPlayerAchievementRuntimeKey(screen, achievement, index);

  if (!player.achievementRuntimeStates.has(key)) {
    player.achievementRuntimeStates.set(key, {
      initialized: false,
      fired: false,
      wasMet: false,
    });
  }

  return player.achievementRuntimeStates.get(key);
}

function resetPlayerAchievementRuntimeForLifecycleScreen(
  player,
  lifecycleScreen,
  options = {},
) {
  const { clearQueue = false } = options;

  (player.game?.screens || []).forEach((screen) => {
    (screen.achievements || []).forEach((achievement, index) => {
      if (
        !playerAchievementResetsOnLifecycleScreen(
          player,
          screen,
          achievement,
          lifecycleScreen,
        )
      ) {
        return;
      }

      player.achievementRuntimeStates.delete(
        getPlayerAchievementRuntimeKey(screen, achievement, index),
      );
    });
  });

  if (clearQueue) {
    player.achievementToastQueue = [];
  }
}

function getPlayerAchievementRuntimeKey(screen, achievement, index) {
  return `${screen.name}:${index}:${achievement.metric}:${achievement.comparer}:${achievement.value}`;
}

function playerAchievementResetsOnLifecycleScreen(
  player,
  screen,
  achievement,
  lifecycleScreen,
) {
  return normalizeAchievementResetScreens(achievement).some((resetScreen) => {
    if (resetScreen === "self") return lifecycleScreen === screen;

    return (player.game?.screens || []).some((item) => {
      return item.name === resetScreen && item === lifecycleScreen;
    });
  });
}

function normalizeAchievementResetScreens(achievement) {
  const resetScreens = Array.isArray(achievement?.resetScreens)
    ? achievement.resetScreens
    : [achievement?.resetScreen || "self"];
  const normalized = resetScreens.filter(Boolean);

  return normalized.length > 0 ? [...new Set(normalized)] : ["self"];
}

function normalizeAchievementTier(tier) {
  return achievementTiers.includes(tier) ? tier : "beginner";
}

function normalizeImportedAchievements(achievements) {
  if (!Array.isArray(achievements)) return [];

  return achievements.map((achievement, index) => ({
    id: achievement.id || Date.now() + 3000 + index,
    metric: achievement.metric || "",
    comparer: ["=", ">", ">=", "<", "<="].includes(achievement.comparer)
      ? achievement.comparer
      : "=",
    value: achievement.value ?? "",
    message: achievement.message || "",
    tier: normalizeAchievementTier(achievement.tier),
    resetScreens: normalizeAchievementResetScreens(achievement),
    _metricCommitted: true,
  }));
}

function achievementConditionMet(currentValue, achievement) {
  const current = String(currentValue).trim();
  const expected = String(achievement.value).trim();
  const leftNumber = Number(current);
  const rightNumber = Number(expected);
  const bothNumeric =
    current !== "" &&
    expected !== "" &&
    Number.isFinite(leftNumber) &&
    Number.isFinite(rightNumber);
  const left = bothNumeric ? leftNumber : current;
  const right = bothNumeric ? rightNumber : expected;

  switch (achievement.comparer) {
    case "=":
      return left === right;
    case ">":
      return bothNumeric && left > right;
    case ">=":
      return bothNumeric && left >= right;
    case "<":
      return bothNumeric && left < right;
    case "<=":
      return bothNumeric && left <= right;
    default:
      return false;
  }
}

function enqueuePlayerAchievementToast(player, achievement) {
  if (!player.achievementLayer) return;

  player.achievementToastQueue.push(achievement);
  showNextPlayerAchievementToast(player);
}

function showNextPlayerAchievementToast(player) {
  if (player.achievementToastShowing) return;
  if (player.achievementToastQueue.length === 0) return;
  if (!player.achievementLayer) return;

  player.achievementToastShowing = true;
  showPlayerAchievementToast(player, player.achievementToastQueue.shift());
}

function showPlayerAchievementToast(player, achievement) {
  const item = document.createElement("div");
  const tier = normalizeAchievementTier(achievement.tier);
  const symbol = document.createElement("div");
  const text = document.createElement("div");
  const header = document.createElement("div");
  const message = document.createElement("div");

  item.className = "playerAchievement";
  item.dataset.tier = tier;

  symbol.className = "playerAchievementSymbol";
  symbol.textContent = getAchievementSymbol(tier);

  header.className = "playerAchievementHeader";
  header.textContent = "Achievement";

  message.className = "playerAchievementMessage";
  message.textContent = achievement.message || "Achievement unlocked!";

  text.append(header, message);
  item.append(symbol, text);

  player.achievementLayer.appendChild(item);

  window.setTimeout(() => {
    item.classList.add("leaving");
  }, 3600);

  window.setTimeout(() => {
    item.remove();
    player.achievementToastShowing = false;
    showNextPlayerAchievementToast(player);
  }, 4300);
}

function getAchievementSymbol(tier) {
  switch (tier) {
    case "beginner":
      return "I";
    case "novice":
      return "II";
    case "intermediate":
      return "III";
    case "advanced":
      return "IV";
    case "expert":
      return "V";
    case "pro":
      return "★";
    case "god-tier":
      return "◆";
    default:
      return "★";
  }
}

function renderScoreBoard() {
  const rankedScores = getRankedSessionScores();
  const liveLeaderId = getLiveLeaderId();
  updateLiveLeaderCanvas(liveLeaderId);
  updatePlayerRankDisplays();
  renderPlayerNameEntryPanels();
  const nextSignature = `${selectedGameName}|${rankedScores
    .map((entry, index) => {
      return [
        index,
        entry.id,
        entry.score,
        entry.active,
        entry.player,
        entry.demo,
        entry.removingDemo,
        entry.nameEntry?.value || "",
        entry.nameEntry?.inputStarted || false,
        getNameEntrySecondsLeft(entry),
        getAllTimeRank(entry) || "",
      ].join(":");
    })
    .join("|")}`;

  if (nextSignature === scoreBoardSignature) {
    updateScoreBoardAutoScroll();
    return;
  }

  const previousPositions = new Map(
    [...scoreBoard.querySelectorAll(".highScoreBox")].map((item) => {
      return [item.dataset.scoreId, item.getBoundingClientRect().top];
    }),
  );
  const previousScroller = scoreBoard.querySelector(".scoreBoardScroll");
  const previousScrollTop = previousScroller?.scrollTop || 0;
  const skipRankMoveAnimation =
    rankedScores.some((entry) => entry.demo || entry.removingDemo) ||
    Boolean(scoreBoard.querySelector(".highScoreBox.demo, .highScoreBox.demoRemoving"));

  scoreBoardSignature = nextSignature;

  scoreBoard.replaceChildren();

  if (!selectedGameName) {
    appendScoreHint("Choose a game.");
    resetScoreBoardAutoScroll();
    return;
  }

  if (rankedScores.length === 0) {
    appendScoreHint("Waiting for scores.");
    resetScoreBoardAutoScroll();
    return;
  }

  renderRankedScoreBoxes(rankedScores);
  const nextScroller = scoreBoard.querySelector(".scoreBoardScroll");

  if (nextScroller) {
    nextScroller.scrollTop = Math.min(
      previousScrollTop,
      Math.max(0, nextScroller.scrollHeight - nextScroller.clientHeight),
    );
  }

  if (!skipRankMoveAnimation) {
    animateScoreRankChanges(previousPositions);
  }
  updateScoreBoardAutoScroll();
}

function renderRankedScoreBoxes(rankedScores) {
  const topScores = document.createElement("div");
  const scrollScores = document.createElement("div");

  topScores.className = "scoreBoardTop";
  scrollScores.className = "scoreBoardScroll";
  scoreBoard.append(topScores, scrollScores);

  rankedScores.forEach((entry, index) => {
    const box = createHighScoreBox(entry, index);
    const belongsInFixedTop = index < 3;

    (belongsInFixedTop ? topScores : scrollScores).appendChild(box);
  });
}

function createHighScoreBox(entry, index) {
  const box = document.createElement("div");
  const rank = document.createElement("div");
  const meta = document.createElement("div");
  const player = document.createElement("div");
  const score = document.createElement("strong");
  const podiumRank = getPodiumRank(entry, index);
  const allTimeRank = index < 3 ? getAllTimeRank(entry) : null;

  box.className = `highScoreBox highScoreBox-${entry.color}`;
  box.dataset.scoreId = String(entry.id);
  box.classList.toggle("finalized", !entry.active);
  box.classList.toggle("demo", Boolean(entry.demo));
  box.classList.toggle("demoRemoving", Boolean(entry.removingDemo));
  box.classList.toggle("nameEntry", Boolean(entry.nameEntry));
  box.classList.toggle("podium", podiumRank !== null);
  box.classList.toggle("podiumGold", podiumRank === 0);
  box.classList.toggle("podiumSilver", podiumRank === 1);
  box.classList.toggle("podiumBronze", podiumRank === 2);

  rank.className = "highScoreRank";
  rank.textContent = getScoreRankLabel(index, podiumRank);

  meta.className = "highScoreMeta";
  player.className = "highScorePlayer";
  player.textContent = getScoreEntryName(entry);
  meta.append(player);

  score.className = "highScoreValue";
  score.textContent = formatScore(entry.score);

  box.append(rank, meta, score);

  if (allTimeRank) {
    const allTime = document.createElement("div");

    allTime.className = "allTimeRank";
    allTime.textContent = `All time: #${allTimeRank}`;
    box.appendChild(allTime);
  }

  return box;
}

function resetScoreBoardAutoScroll() {
  scoreScrollDirection = 1;
  scoreScrollHoldUntil = 0;
  scoreScrollLastTime = 0;
}

function updateScoreBoardAutoScroll() {
  const scroller = scoreBoard.querySelector(".scoreBoardScroll");
  const now = performance.now();

  if (!scroller || scroller.scrollHeight <= scroller.clientHeight + 1) {
    resetScoreBoardAutoScroll();
    return;
  }

  if (!scoreScrollLastTime) {
    scoreScrollLastTime = now;
    return;
  }

  const deltaSeconds = Math.min((now - scoreScrollLastTime) / 1000, 0.05);
  scoreScrollLastTime = now;

  if (now < scoreScrollHoldUntil) return;

  const maxScroll = scroller.scrollHeight - scroller.clientHeight;
  const nextScroll = scroller.scrollTop + scoreScrollDirection * 34 * deltaSeconds;

  scroller.scrollTop = Math.max(0, Math.min(maxScroll, nextScroll));

  if (scroller.scrollTop <= 0) {
    scoreScrollDirection = 1;
    scoreScrollHoldUntil = now + 900;
  } else if (scroller.scrollTop >= maxScroll - 1) {
    scoreScrollDirection = -1;
    scoreScrollHoldUntil = now + 900;
  }
}

function getRankedSessionScores() {
  return [...sessionScores]
    .filter((entry) => {
      return (
        (!selectedGameName || entry.game === selectedGameName) &&
        (isLeaderboardScore(entry) || entry.removingDemo)
      );
    })
    .sort(compareScoreEntries)
    .slice(0, MAX_VISIBLE_SCORES);
}

function getLiveLeaderId() {
  const active = sessionScores
    .filter((entry) => {
      return (
        entry.active &&
        entry.game === selectedGameName &&
        isLeaderboardScore(entry) &&
        !entry.demo &&
        !entry.removingDemo
      );
    })
    .sort(compareScoreEntries);

  if (active.length === 0) return null;
  if (active.length > 1 && active[0].score === active[1].score) return null;

  return active[0].id;
}

function updateLiveLeaderCanvas(liveLeaderId) {
  const leader = sessionScores.find((entry) => entry.id === liveLeaderId);

  players.forEach((player) => {
    const activeEntry = sessionScores.find((entry) => {
      return entry.id === player.scoreEntryId && entry.active && !entry.demo;
    });
    const isAhead = Boolean(leader && leader.color === player.color);
    const isBehind = Boolean(leader && activeEntry && !isAhead);

    player.feedFrame.classList.toggle("liveAhead", isAhead);
    player.feedFrame.classList.toggle("liveBehind", isBehind);
  });
}

function updatePlayerRankDisplays() {
  const rankedEntries = [...sessionScores]
    .filter((entry) => {
      return (
        entry.game === selectedGameName &&
        !entry.demo &&
        !entry.removingDemo &&
        isLeaderboardScore(entry)
      );
    })
    .sort(compareScoreEntries);

  players.forEach((player) => {
    const entry = sessionScores.find((item) => item.id === player.scoreEntryId);
    const score = entry?.score ?? player.currentScore ?? 0;

    if (!selectedGameName || !player.runActive || score < MIN_LEADERBOARD_SCORE) {
      player.currentRank.hidden = true;
      player.currentRank.replaceChildren();
      player.lastVisibleRank = null;
      return;
    }

    if (entry?.demo) {
      player.currentRank.hidden = true;
      player.currentRank.replaceChildren();
      player.lastVisibleRank = null;
      return;
    }

    const rank = rankedEntries.findIndex((item) => item.id === entry?.id) + 1;
    const direction = getRankChangeDirection(player, rank);

    player.currentRank.hidden = false;
    renderCurrentRankCard(player.currentRank, entry, rank, direction);
  });
}

function renderPlayerNameEntryPanels() {
  players.forEach((player) => {
    const entry = getPlayerNameEntry(player);
    const panel = player.nameEntryPanel;

    if (!panel) return;

    if (!entry) {
      panel.hidden = true;
      panel.replaceChildren();
      return;
    }

    panel.hidden = false;
    panel.replaceChildren(...createPlayerNameEntryPanelContent(entry));
  });
}

function getPlayerNameEntry(player) {
  return sessionScores.find((entry) => {
    return entry.nameEntry && entry.color === player.color;
  });
}

function createPlayerNameEntryPanelContent(entry) {
  const label = document.createElement("div");
  const name = document.createElement("div");
  const timer = document.createElement("div");
  const secondsLeft = getNameEntrySecondsLeft(entry);

  label.className = "playerNameEntryLabel";
  label.textContent = "Schreib deinen Namen";
  name.className = "playerNameEntryValue";
  name.textContent = entry.nameEntry.value || "Benutze das Keyboard...";
  name.classList.toggle("empty", !entry.nameEntry.value);
  timer.className = "playerNameEntryTimer";
  timer.dataset.seconds = String(secondsLeft);
  timer.textContent = `${secondsLeft}s`;

  if (entry.nameEntry.inputStarted) {
    return [label, name];
  }

  return [label, name, timer];
}

function getRankChangeDirection(player, rank) {
  const previousRank = player.lastVisibleRank;

  player.lastVisibleRank = rank > 0 ? rank : null;

  if (!previousRank || !rank || previousRank === rank) return "";

  return rank < previousRank ? "up" : "down";
}

function renderCurrentRankCard(container, entry, rank, direction = "") {
  const podiumRank = rank >= 1 && rank <= 3 ? rank - 1 : null;
  const keepRise = !direction && container.classList.contains("rankRise");
  const keepDrop = !direction && container.classList.contains("rankDrop");
  const text = document.createElement("div");

  container.className = "currentRank";
  container.classList.toggle("podium", podiumRank !== null);
  container.classList.toggle("podiumGold", podiumRank === 0);
  container.classList.toggle("podiumSilver", podiumRank === 1);
  container.classList.toggle("podiumBronze", podiumRank === 2);
  container.classList.toggle("rankRise", keepRise);
  container.classList.toggle("rankDrop", keepDrop);

  text.className = "currentRankText";
  text.textContent = rank > 0 ? `Current Rank: #${rank}` : "Current Rank: ?";

  container.replaceChildren(text);

  if (direction) {
    triggerRankChangeAnimation(container, direction);
  }
}

function triggerRankChangeAnimation(container, direction) {
  const className = direction === "up" ? "rankRise" : "rankDrop";

  window.clearTimeout(container.rankAnimationTimer);
  container.classList.remove("rankRise", "rankDrop");
  void container.offsetWidth;
  container.classList.add(className);
  container.rankAnimationTimer = window.setTimeout(() => {
    container.classList.remove("rankRise", "rankDrop");
  }, 900);
}

function getPodiumRank(entry, index) {
  if (index > 2) return null;
  if (entry.demo || entry.removingDemo)
    return null;

  return index;
}

function getAllTimeRank(entry) {
  if (!entry || entry.demo || entry.removingDemo) return null;

  const allTime = getAllTimeLeaderboard()
    .filter((item) => item.game === entry.game && isLeaderboardScore(item))
    .sort(compareScoreEntries);
  const rank = allTime.findIndex((item) => {
    return getScoreEntryKey(item) === getScoreEntryKey(entry);
  });

  if (rank !== -1) return rank + 1;

  const hypothetical = [...allTime, serializeScoreEntry(entry)]
    .sort(compareScoreEntries)
    .findIndex((item) => getScoreEntryKey(item) === getScoreEntryKey(entry));

  return hypothetical !== -1 && hypothetical < 20 ? hypothetical + 1 : null;
}

function getScoreEntryName(entry) {
  if (entry.demo) return "Demo";
  if (entry.nameEntry?.value) return entry.nameEntry.value;
  if (entry.nameEntry) return formatScoreName(entry.player);

  return formatScoreName(entry.player);
}

function formatScoreName(name) {
  if (name === "Player 1" || name === "Player 2") return name.toUpperCase();

  return name || "Player";
}

function getNameEntrySecondsLeft(entry) {
  if (!entry.nameEntry) return "";

  const left = Math.ceil((getNameEntryDeadline(entry) - Date.now()) / 1000);

  return Math.max(0, left);
}

function getNameEntryDeadline(entry) {
  if (!entry.nameEntry) return 0;

  return entry.nameEntry.inputStarted
    ? entry.nameEntry.idleExpiresAt
    : entry.nameEntry.expiresAt;
}

function getScoreRankLabel(index, podiumRank) {
  return podiumRank === null ? `#${index + 1}` : "🏆";
}

function formatScore(score) {
  return Number(score).toLocaleString("en-US");
}

function appendScoreHint(text) {
  const empty = document.createElement("div");

  empty.className = "liveHint";
  empty.textContent = text;
  scoreBoard.appendChild(empty);
}

function openAchievementsModal() {
  renderAchievementsModal();
  achievementsModal.classList.remove("hidden");
}

function closeAchievementsModalDialog() {
  achievementsModal.classList.add("hidden");
}

function openDaysModal() {
  renderDaysModal();
  daysModal.classList.remove("hidden");
}

function closeDaysModalDialog() {
  daysModal.classList.add("hidden");
}

function renderDaysModal(openKeys = getOpenDaysModalKeys()) {
  const days = getStoredLeaderboardDays();
  const gameName = selectedGameName || "";

  daysModalContent.innerHTML = "";
  renderDaysExportButton(gameName);

  renderAllTimeSection(gameName, openKeys);

  if (!gameName) {
    const empty = document.createElement("div");

    empty.className = "dayHistoryEmpty";
    empty.textContent = "Choose a game first.";
    daysModalContent.appendChild(empty);
    return;
  }

  if (days.length === 0) {
    const empty = document.createElement("div");

    empty.className = "dayHistoryEmpty";
    empty.textContent = "No saved days.";
    daysModalContent.appendChild(empty);
    return;
  }

  days.forEach((dateKey) => {
    const entries = getLeaderboardEntriesForDay(dateKey).filter((entry) => {
      return entry.game === gameName && isLeaderboardScore(entry);
    });

    if (entries.length === 0) return;

    const details = document.createElement("details");
    const summary = document.createElement("summary");
    const meta = document.createElement("span");
    const del = document.createElement("button");
    const list = document.createElement("div");

    details.className = "dayHistoryItem";
    details.dataset.historyKey = `day:${dateKey}`;
    details.open = openKeys.has(details.dataset.historyKey);
    summary.className = "dayHistorySummary";
    list.className = "dayEntryList";
    summary.append(dateKey);
    meta.textContent = `${entries.length} score${entries.length === 1 ? "" : "s"}`;

    del.className = "dayDeleteButton";
    del.textContent = "Delete";
    del.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!window.confirm(`Delete ${gameName} scores for ${dateKey}?`)) return;

      deleteStoredLeaderboardDayGame(dateKey, gameName);
      renderDaysModal();
      renderScoreBoard();
    };

    summary.append(meta, del);
    details.append(summary, list);

    entries
      .sort(compareScoreEntries)
      .forEach((entry, index) => {
        list.appendChild(createDayEntryRow(dateKey, entry, `#${index + 1}`));
      });

    daysModalContent.appendChild(details);
  });

  if (!daysModalContent.querySelector(".dayHistoryItem:not(.allTimeHistory)")) {
    const empty = document.createElement("div");

    empty.className = "dayHistoryEmpty";
    empty.textContent = "No saved days for this game.";
    daysModalContent.appendChild(empty);
  }
}

function renderDaysExportButton(gameName) {
  const row = document.createElement("div");
  const importButton = document.createElement("button");
  const exportButton = document.createElement("button");
  const input = document.createElement("input");

  row.className = "daysModalActions";
  input.type = "file";
  input.accept = ".json,application/json";
  input.multiple = true;
  input.hidden = true;
  input.onchange = () => {
    importLeaderboardDaysDataFiles([...input.files]);
    input.value = "";
  };

  importButton.textContent = "Import Days Data";
  importButton.className = "button-black";
  importButton.onclick = () => input.click();

  exportButton.textContent = "Export Days Data";
  exportButton.className = "button-black";
  exportButton.disabled = !gameName;
  exportButton.onclick = () => exportLeaderboardDaysData(gameName);

  row.append(importButton, exportButton, input);
  daysModalContent.appendChild(row);
}

function renderAllTimeSection(gameName, openKeys) {
  const section = document.createElement("details");
  const summary = document.createElement("summary");
  const title = document.createElement("strong");
  const meta = document.createElement("span");
  const list = document.createElement("div");
  const entries = getAllTimeLeaderboard()
    .filter((entry) => entry.game === gameName && isLeaderboardScore(entry))
    .sort(compareScoreEntries)
    .slice(0, 20);

  section.className = "dayHistoryItem allTimeHistory";
  section.dataset.historyKey = "all-time";
  section.open = openKeys.has(section.dataset.historyKey);
  summary.className = "dayHistorySummary";
  title.textContent = "All Time Top 20";
  meta.textContent = `${entries.length} score${entries.length === 1 ? "" : "s"}`;
  list.className = "dayEntryList";
  summary.append(title, meta);
  section.append(summary, list);

  if (entries.length === 0) {
    const empty = document.createElement("div");

    empty.className = "dayHistoryEmpty";
    empty.textContent = "No all-time scores yet.";
    list.appendChild(empty);
  } else {
    entries.forEach((entry, index) => {
      list.appendChild(createAllTimeEntryRow(entry, `#${index + 1}`));
    });
  }

  daysModalContent.appendChild(section);
}

function createAllTimeEntryRow(entry, rankText) {
  const row = createScoreHistoryRow(entry, rankText, {
    showGame: false,
    editableName: true,
    dateKey: entry.date || getTodayDateKey(),
  });
  const del = document.createElement("button");

  del.className = "entryDeleteButton";
  del.textContent = "×";
  del.title = "Delete score";
  del.onclick = () => {
    if (!window.confirm(`Delete all-time score ${formatScore(entry.score)}?`)) return;

    deleteStoredLeaderboardEntry(entry.date || getTodayDateKey(), entry);
    renderDaysModal();
    renderScoreBoard();
  };

  row.appendChild(del);

  return row;
}

function createDayEntryRow(dateKey, entry, rankText) {
  const row = createScoreHistoryRow(entry, rankText, {
    showGame: false,
    editableName: true,
    dateKey,
  });
  const del = document.createElement("button");

  del.className = "entryDeleteButton";
  del.textContent = "×";
  del.title = "Delete score";
  del.onclick = () => {
    if (!window.confirm(`Delete score ${formatScore(entry.score)}?`)) return;

    deleteStoredLeaderboardEntry(dateKey, entry);
    renderDaysModal();
    renderScoreBoard();
  };

  row.appendChild(del);

  return row;
}

function createScoreHistoryRow(entry, rankText = "", options = {}) {
  const row = document.createElement("div");
  const rank = document.createElement("strong");
  const name = options.editableName
    ? document.createElement("input")
    : document.createElement("span");
  const game = document.createElement("span");
  const score = document.createElement("strong");
  const showGame = options.showGame !== false;

  row.className = "scoreHistoryRow";
  row.classList.toggle("noGame", !showGame);
  rank.className = "scoreHistoryRank";
  rank.textContent = rankText;
  name.className = options.editableName
    ? "scoreHistoryNameInput"
    : "scoreHistoryName";

  if (options.editableName) {
    name.value = entry.name || entry.player || "";
    name.placeholder = "Name";
    name.maxLength = MAX_SCORE_NAME_LENGTH;
    name.onchange = () => {
      updateStoredLeaderboardEntryName(
        options.dateKey || entry.date || getTodayDateKey(),
        entry,
        name.value,
      );
    };
  } else {
    name.textContent = formatScoreName(entry.name || entry.player || "Player");
  }

  game.className = "scoreHistoryGame";
  game.textContent = entry.game || "";
  score.className = "scoreHistoryScore";
  score.textContent = formatScore(entry.score);

  row.append(rank, name);

  if (showGame) {
    row.appendChild(game);
  }

  row.appendChild(score);

  return row;
}

function updateStoredLeaderboardEntryName(dateKey, entry, nextName) {
  const openKeys = getOpenDaysModalKeys();
  const key = getScoreEntryKey(entry);
  const cleanName = nextName.trim().slice(0, MAX_SCORE_NAME_LENGTH);
  const entries = getLeaderboardEntriesForDay(dateKey).map((item) => {
    if (getScoreEntryKey(item) !== key) return item;

    return {
      ...item,
      name: cleanName,
      player: cleanName || item.player,
    };
  });

  localStorage.setItem(getLeaderboardStorageKey(dateKey), JSON.stringify(entries));

  if (dateKey === getTodayDateKey()) {
    sessionScores = sessionScores.map((item) => {
      if (getScoreEntryKey(item) !== key) return item;

      return {
        ...item,
        name: cleanName,
        player: cleanName || item.player,
      };
    });
  }

  rebuildAllTimeLeaderboardFromDays();
  renderDaysModal(openKeys);
  scoreBoardSignature = "";
  renderScoreBoard();
}

function getOpenDaysModalKeys() {
  return new Set(
    [...daysModalContent.querySelectorAll(".dayHistoryItem[open]")]
      .map((item) => item.dataset.historyKey)
      .filter(Boolean),
  );
}

function exportLeaderboardDaysData(gameName) {
  const days = getStoredLeaderboardDays().map((dateKey) => {
    return {
      date: dateKey,
      entries: getLeaderboardEntriesForDay(dateKey).filter((entry) => {
        return entry.game === gameName && isLeaderboardScore(entry);
      }),
    };
  }).filter((day) => day.entries.length > 0);
  const data = {
    exportedAt: new Date().toISOString(),
    game: gameName,
    days,
    allTimeTop20: getAllTimeLeaderboard()
      .filter((entry) => entry.game === gameName && isLeaderboardScore(entry))
      .sort(compareScoreEntries)
      .slice(0, 20),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = `${gameName || "leaderboard"}-days.json`;
  link.click();
  URL.revokeObjectURL(link.href);
}

async function importLeaderboardDaysDataFiles(files) {
  if (files.length === 0) return;

  const result = {
    days: new Set(),
    entries: 0,
    files: 0,
  };

  try {
    for (const file of files) {
      const data = JSON.parse(await file.text());

      importLeaderboardDaysData(data, result);
      result.files += 1;
    }
  } catch (error) {
    window.alert(`Could not import day data.\n${error.message}`);
    return;
  }

  rebuildAllTimeLeaderboardFromDays();
  scoreBoardSignature = "";
  renderDaysModal();
  renderScoreBoard();
  window.alert(
    `Imported ${result.entries} score${result.entries === 1 ? "" : "s"} from ${result.days.size} day${result.days.size === 1 ? "" : "s"}.`,
  );
}

function importLeaderboardDaysData(data, result) {
  const gameName = String(data?.game || selectedGameName || "").trim();

  if (!gameName) {
    throw new Error("The imported file does not contain a game name.");
  }

  if (!Array.isArray(data?.days)) {
    throw new Error("The imported file does not contain day data.");
  }

  data.days.forEach((day) => {
    const dateKey = String(day?.date || "").trim();

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey) || !Array.isArray(day?.entries)) {
      throw new Error("One of the imported days has an invalid format.");
    }

    const importedEntries = day.entries
      .map((entry) => normalizeImportedLeaderboardEntry(entry, gameName, dateKey))
      .filter(Boolean);

    if (importedEntries.length === 0) return;

    mergeLeaderboardDayEntries(dateKey, importedEntries);
    result.days.add(dateKey);
    result.entries += importedEntries.length;
  });
}

function normalizeImportedLeaderboardEntry(entry, gameName, dateKey) {
  const score = Number(entry?.score);

  if (!Number.isFinite(score) || score < MIN_LEADERBOARD_SCORE) return null;

  const startedAt = Number(entry.startedAt) || Date.now();
  const id = Number(entry.id) || startedAt;
  const name = String(entry.name || entry.player || "")
    .trim()
    .slice(0, MAX_SCORE_NAME_LENGTH);
  const player = name || String(entry.player || "Player").trim() || "Player";
  const color = entry.color === "red" ? "red" : "blue";
  const normalized = {
    id,
    key: entry.key,
    date: dateKey,
    game: gameName,
    player,
    name,
    color,
    score,
    startedAt,
  };

  normalized.key = getScoreEntryKey(normalized);

  return normalized;
}

function mergeLeaderboardDayEntries(dateKey, importedEntries) {
  const byKey = new Map(
    getLeaderboardEntriesForDay(dateKey).map((entry) => [
      getScoreEntryKey(entry),
      entry,
    ]),
  );
  const serializedEntries = importedEntries.map(serializeScoreEntry);

  serializedEntries.forEach((entry) => {
    byKey.set(getScoreEntryKey(entry), entry);
  });

  localStorage.setItem(
    getLeaderboardStorageKey(dateKey),
    JSON.stringify([...byKey.values()]),
  );

  if (dateKey === getTodayDateKey()) {
    mergeImportedTodaySessionEntries(serializedEntries);
  }
}

function mergeImportedTodaySessionEntries(importedEntries) {
  const byKey = new Map(
    sessionScores.map((entry) => [getScoreEntryKey(entry), entry]),
  );

  importedEntries.forEach((entry) => {
    const key = getScoreEntryKey(entry);
    const existing = byKey.get(key);

    if (existing?.active || existing?.nameEntry) return;

    byKey.set(key, {
      ...entry,
      id: Number(entry.id) || ++sessionScoreId,
      active: false,
      demo: false,
      startedAt: Number(entry.startedAt) || Date.now(),
    });
  });

  sessionScores = [...byKey.values()];
  sessionScoreId = sessionScores.reduce((max, entry) => {
    return Math.max(max, Number(entry.id) || 0);
  }, sessionScoreId);
}

function deleteStoredLeaderboardEntry(dateKey, entry) {
  const key = getScoreEntryKey(entry);
  const nextEntries = getLeaderboardEntriesForDay(dateKey).filter((item) => {
    return getScoreEntryKey(item) !== key;
  });

  localStorage.setItem(
    getLeaderboardStorageKey(dateKey),
    JSON.stringify(nextEntries),
  );

  if (dateKey === getTodayDateKey()) {
    sessionScores = sessionScores.filter((item) => getScoreEntryKey(item) !== key);
  }

  rebuildAllTimeLeaderboardFromDays();
}

function deleteStoredLeaderboardDayGame(dateKey, gameName) {
  const nextEntries = getLeaderboardEntriesForDay(dateKey).filter((entry) => {
    return entry.game !== gameName;
  });

  if (nextEntries.length > 0) {
    localStorage.setItem(
      getLeaderboardStorageKey(dateKey),
      JSON.stringify(nextEntries),
    );
  } else {
    localStorage.removeItem(getLeaderboardStorageKey(dateKey));
  }

  if (dateKey === getTodayDateKey()) {
    sessionScores = sessionScores.filter((entry) => entry.game !== gameName);
  }

  rebuildAllTimeLeaderboardFromDays();
}

function getLeaderboardEntriesForDay(dateKey) {
  try {
    const data =
      JSON.parse(localStorage.getItem(getLeaderboardStorageKey(dateKey))) || [];

    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function renderAchievementsModal() {
  achievementsModalContent.innerHTML = "";

  if (!selectedGame) {
    achievementsModalContent.textContent = "Choose a game first.";
    return;
  }

  const screensWithAchievements = (selectedGame.screens || []).filter(
    (screen) => {
      return (
        Array.isArray(screen.achievements) && screen.achievements.length > 0
      );
    },
  );

  if (screensWithAchievements.length === 0) {
    achievementsModalContent.textContent =
      "This game has no achievements in its JSON.";
    return;
  }

  screensWithAchievements.forEach((screen) => {
    const section = document.createElement("section");
    const title = document.createElement("h3");

    section.className = "achievementModalScreen";
    title.textContent = screen.name || "Unnamed screen";
    section.appendChild(title);

    screen.achievements.forEach((achievement) => {
      const item = document.createElement("div");
      const condition = document.createElement("div");
      const tier = document.createElement("div");
      const message = document.createElement("div");

      item.className = "achievementModalItem";
      condition.className = "achievementModalCondition";
      condition.textContent = `${achievement.metric || "Metric"} ${achievement.comparer || "="} ${achievement.value ?? ""}`;

      tier.className = "achievementModalTier";
      tier.textContent = normalizeAchievementTier(achievement.tier);

      message.className = "achievementModalMessage";
      message.textContent = achievement.message || "Achievement unlocked!";

      item.append(condition, tier, message);
      section.appendChild(item);
    });

    achievementsModalContent.appendChild(section);
  });
}

function animateScoreRankChanges(previousPositions) {
  scoreBoard.querySelectorAll(".highScoreBox").forEach((item) => {
    const previousTop = previousPositions.get(item.dataset.scoreId);

    if (previousTop === undefined) return;

    const nextTop = item.getBoundingClientRect().top;
    const delta = previousTop - nextTop;

    if (Math.abs(delta) < 1) return;

    item.style.transform = `translateY(${delta}px)`;
    item.style.transition = "none";
    item.classList.add("moving");

    requestAnimationFrame(() => {
      item.style.transform = "";
      item.style.transition = "transform 0.35s ease";
      window.setTimeout(() => {
        item.classList.remove("moving");
      }, 360);
    });
  });
}

function setPlayerStatus(player, message, good) {
  player.status.textContent = message;
  player.status.classList.toggle("good", Boolean(good));
  player.status.classList.toggle("bad", message !== "" && !good);
}

function updatePlayerStatus(player) {
  if (!selectedGameName) {
    setPlayerStatus(player, "Choose a game.", false);
    return;
  }

  if (!player.cameraSelect.value || !player.stream) {
    setPlayerStatus(player, "Choose a camera.", false);
    return;
  }

  if (!player.calibrated) {
    setPlayerStatus(player, "Calibrate.", false);
    return;
  }

  setPlayerStatus(player, "", true);
}

function updateAllPlayerStatuses() {
  players.forEach(updatePlayerStatus);
}

function startDrawLoop() {
  if (drawLoopStarted) return;

  drawLoopStarted = true;
  requestAnimationFrame(drawLoop);
}

function drawLoop() {
  players.forEach(processPlayerFrame);
  renderScoreBoard();
  requestAnimationFrame(drawLoop);
}

function setupPlayer(player) {
  populateLUTSelect(player.lutSelect);
  restorePlayerSettings(
    player,
    persistedSettings.players?.[players.indexOf(player)],
  );

  player.cameraSelect.onchange = () => {
    if (playerHasDuplicateCamera(player)) {
      player.cameraSelect.value = "";
      updateCameraSelectAvailability();
      setPlayerStatus(player, "Choose a different camera.", false);
      saveTwoPlayerSettings();
      return;
    }

    updateCameraSelectAvailability();

    if (!player.cameraSelect.value) {
      updatePlayerStatus(player);
      saveTwoPlayerSettings();
      return;
    }

    startPlayerCamera(player).catch(() => {
      setPlayerStatus(player, "Could not start camera.", false);
    });
  };

  player.lutSelect.onchange = () => {
    const { category, paletteName } = parseLUTOptionValue(
      player.lutSelect.value,
    );
    player.palette = getPalette(category, paletteName);
    saveTwoPlayerSettings();
  };

  player.calibrateButton.onclick = () => {
    calibratePlayer(player);
  };
}

function setupSharedControls() {
  useFastOCR = persistedSettings.useFastOCR !== false;
  fastOCRToggle.checked = useFastOCR;
  populateSharedGameSelect();

  sharedGameButton.onclick = () => {
    toggleSharedGameList();
  };
  sharedGameButton.onkeydown = (e) => {
    if (e.key !== "ArrowDown" && e.key !== "Enter" && e.key !== " ") return;

    e.preventDefault();
    sharedGameList.hidden = false;
    sharedGamePicker.classList.add("open");
    topGameSetup?.classList.add("open");
  };
  topGameSetup?.addEventListener("pointerenter", keepTopGameSetupOpen);
  topGameSetup?.addEventListener("pointerleave", scheduleTopGameSetupClose);

  fastOCRToggle.onchange = () => {
    useFastOCR = fastOCRToggle.checked;
    saveTwoPlayerSettings();
  };

  importJSONButton.onclick = () => {
    importJSONFile.click();
  };

  importJSONFile.onchange = async (e) => {
    await importProjectFiles([...e.target.files]);
    importJSONFile.value = "";
  };

  showAchievementsButton.onclick = openAchievementsModal;
  showDaysButton.onclick = openDaysModal;
  closeAchievementsModal.onclick = closeAchievementsModalDialog;
  closeDaysModal.onclick = closeDaysModalDialog;
  achievementsModal.onclick = (e) => {
    if (e.target === achievementsModal) {
      closeAchievementsModalDialog();
    }
  };
  daysModal.onclick = (e) => {
    if (e.target === daysModal) {
      closeDaysModalDialog();
    }
  };

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !achievementsModal.classList.contains("hidden")) {
      closeAchievementsModalDialog();
      return;
    }

    if (e.key === "Escape" && !daysModal.classList.contains("hidden")) {
      closeDaysModalDialog();
      return;
    }

    if (
      achievementsModal.classList.contains("hidden") &&
      daysModal.classList.contains("hidden")
    ) {
      handleNameEntryKey(e);
    }
  });

  document.addEventListener("pointerdown", (e) => {
    if (topGameSetup && !topGameSetup.contains(e.target)) {
      closeTopGameSetup();
    }

    document.querySelectorAll(".settingsAccordion[open]").forEach((details) => {
      if (!details.contains(e.target)) {
        details.open = false;
      }
    });
  });
}

async function init() {
  savedGames = getSavedGames();
  restoreTodayLeaderboard();
  await loadInterceptorSettings();

  setupSharedControls();
  players.forEach(setupPlayer);
  updateAllPlayerStatuses();
  renderScoreBoard();
  startDrawLoop();

  if (Object.keys(savedGames).length === 0) {
    players.forEach((player) => {
      setPlayerStatus(player, "No saved games found in local storage.", false);
    });
  }

  loadCameras();
}

init();
