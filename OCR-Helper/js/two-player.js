const WIDTH = 160;
const HEIGHT = 144;
const TILE = 8;
const LOCAL_STORAGE_KEY = "gbOcrHelper.games";
const TWO_PLAYER_SETTINGS_KEY = "gbOcrHelper.twoPlayerSettings";
const TWO_PLAYER_RANDOM_NAMES_KEY = "gbOcrHelper.twoPlayerRandomNames";
const TWO_PLAYER_LEADERBOARD_PREFIX = "gbOcrHelper.twoPlayerLeaderboard.";
const TWO_PLAYER_ALL_TIME_KEY = "gbOcrHelper.twoPlayerLeaderboard.allTime";
const INTERCEPTOR_SETTINGS_URL = "GB-Interceptor-Settings/settings.json";
const DEFAULT_THRESHOLDS = [64, 128, 192];
const INITIAL_LUT_CATEGORY = "GB Standard Palettes";
const INITIAL_LUT_PALETTE = "MGB-001";
const DEFAULT_SCORE_METRIC_NAME = "score";
const MAX_VISIBLE_SCORES = 100;
const MAX_SESSION_SCORES = 100;
const DEFAULT_MIN_LEADERBOARD_SCORE = 0;
const MAX_NAME_ENTRY_QUEUE = 2;
const NAME_ENTRY_SECONDS = 30;
const NAME_ENTRY_IDLE_SECONDS = 10;
const MODULE_NAME_ENTRY_KEEPALIVE_SECONDS = 30;
const MAX_SCORE_NAME_LENGTH = 12;
const MAX_INLINE_LEADERBOARD_NAME_LENGTH = 10;
const DEFAULT_TRACKED_SCREEN_NAME = "A-Type";
const DEFAULT_SCREEN_DETECTION_GRACE_MS = 300;
const STARTUP_RESTART_REQUIRED_MS = 10000;
const GAME_RECOGNITION_WINDOW_MS = 20000;
const GAME_RECOGNITION_PENDING_MS = 5000;
const GAME_RECOGNITION_COUNTDOWN_MS = 10000;
const GAME_RECOGNITION_UNKNOWN_TOAST_MS = 1800;
const GAME_RECOGNITION_TOAST_MS = 3600;
const BOXART_IMAGE_BASE_PATH = "Games/boxart/bigger/";
const UNKNOWN_GAME_IMAGE_PATH = "assets/no_clue.png";
const SCORE_DUPLICATE_CONFINEMENT_MS = 30000;
const RANDOM_NAME_DUPLICATE_WINDOW_MS = 20000;
const DEFAULT_ALL_TIME_CAROUSEL_INTERVAL_SECONDS = 6;
const DEFAULT_ALL_TIME_CAROUSEL_DURATION_SECONDS = 6;
const ALL_TIME_CAROUSEL_MIN_ENTRY_COUNT = 5;
const ALL_TIME_CAROUSEL_MAX_ENTRY_COUNT = 20;
const NEW_GAME_RESET_CONFIRM_MS = 650;
const interceptorScreens = [];
const interceptorScreenMessages = {
  offline: {
    title: "Offline",
    body: "GAME BOY neu starten.",
    tone: "offline",
  },
  startup: {
    title: "MOMENT",
    body: "GAME BOY startet.",
    tone: "startup",
  },
  restartRequired: {
    title: "Neustart",
    body: "Bitte GAME BOY neu starten.",
    tone: "offline",
  },
  cable: {
    title: "Kabel",
    body: "USB/Batterien prüfen.",
    tone: "offline",
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

navigator.mediaDevices?.addEventListener("devicechange", () => {
  loadCameras();
});
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
let selectedScoreSettingId = "";
let selectedScoreScreenName = "";
let selectedScoreMetricName = "";
let selectedScoreMinScore = DEFAULT_MIN_LEADERBOARD_SCORE;
let selectedScoreValueLabel = "";
let selectedScoreStopScreenNames = [];
let highScoreHistoryGameName = "";
let highScoreHistorySettingKey = "";
let sessionScores = [];
let sessionScoreId = 0;
let randomPlayerNames = [];
const gameModuleAccordionOpenStates = new Map();
let scoreBoardSignature = "";
let useFastOCR = true;
let useNamePoolForRuns = false;
let rememberGame = true;
let scoreScrollDirection = 1;
let scoreScrollHoldUntil = 0;
let scoreScrollLastTime = 0;
let scoreScrollPhase = "";
let gameRecognitionActive = false;
let gameRecognitionStartedAt = 0;
let gameRecognitionDeadline = 0;
let gameRecognitionFallbackGameName = "";
let scoreBoardPointerInside = false;
let highScoreUndoTimer = null;
let pendingHighScoreUndo = null;
let allTimeCarouselInterval = null;
let allTimeCarouselHideTimer = null;
let allTimeCarouselVisible = false;
let allTimeCarouselEnabled = true;
let allTimeCarouselIntervalSeconds = DEFAULT_ALL_TIME_CAROUSEL_INTERVAL_SECONDS;
let allTimeCarouselDurationSeconds = DEFAULT_ALL_TIME_CAROUSEL_DURATION_SECONDS;
let allTimeScrollDirection = 1;
let allTimeScrollHoldUntil = 0;
let allTimeScrollLastTime = 0;
let allTimeScrollPhase = "";
let allTimeBoardPointerInside = false;
const historySelectionState = createRowSelectionState();
const namePoolSelectionState = createRowSelectionState();

const sharedGameSelect = document.getElementById("sharedGameSelect");
const scoreSettingSelect = document.getElementById("scoreSettingSelect");
const topGameSetup = document.querySelector(".topGameSetup");
const topGameSetupToggle = document.getElementById("topGameSetupToggle");
const importJSONButton = document.getElementById("importJSON");
const exportJSONButton = document.getElementById("exportJSON");
const rememberGameToggle = document.getElementById("rememberGame");
const importJSONFile = document.getElementById("importJSONFile");
const scoreBoard = document.getElementById("scoreBoard");
const leaderboardCarousel = document.getElementById("leaderboardCarousel");
const allTimeCarouselBoard = document.getElementById("allTimeCarouselBoard");
const highScoreCarouselEnabled = document.getElementById(
  "highScoreCarouselEnabled",
);
const highScoreCarouselInterval = document.getElementById(
  "highScoreCarouselInterval",
);
const highScoreCarouselDuration = document.getElementById(
  "highScoreCarouselDuration",
);
const leaderboardCarouselPrevious = document.getElementById(
  "leaderboardCarouselPrevious",
);
const leaderboardCarouselNext = document.getElementById(
  "leaderboardCarouselNext",
);
const leaderboardCarouselPosition = document.querySelector(
  ".leaderboardCarouselPosition",
);
const highScoreTitle = document.getElementById("highScoreTitle");
const highScoreSubtitle = document.getElementById("highScoreSubtitle");
const highScoreUndoToast = document.getElementById("highScoreUndoToast");
const openGameSettingsButton = document.getElementById("openGameSettings");
const openNamePoolButton = document.getElementById("openNamePool");
const useNamePoolForRunsToggles = [
  ...document.querySelectorAll(".randomNamesToggle input"),
];
const openInfoModalButton = document.getElementById("openInfoModal");
const showAchievementsButton = document.getElementById("showAchievements");
const showDaysButton = document.getElementById("showDays");
const achievementsModal = document.getElementById("achievementsModal");
const gameSettingsModal = document.getElementById("gameSettingsModal");
const namePoolModal = document.getElementById("namePoolModal");
const infoModal = document.getElementById("infoModal");
const daysModal = document.getElementById("daysModal");
const closeAchievementsModal = document.getElementById(
  "closeAchievementsModal",
);
const closeDaysModal = document.getElementById("closeDaysModal");
const closeGameSettingsModal = document.getElementById(
  "closeGameSettingsModal",
);
const closeNamePoolModal = document.getElementById("closeNamePoolModal");
const closeInfoModal = document.getElementById("closeInfoModal");
const achievementsModalContent = document.getElementById(
  "achievementsModalContent",
);
const daysModalContent = document.getElementById("daysModalContent");
const gameSettingsModalContent = document.getElementById(
  "gameSettingsModalContent",
);
const namePoolList = document.getElementById("namePoolList");
const namePoolInput = document.getElementById("namePoolInput");
const addNamePoolEntryButton = document.getElementById("addNamePoolEntry");
const importNamePoolButton = document.getElementById("importNamePool");
const exportNamePoolButton = document.getElementById("exportNamePool");
const deleteSelectedNamesButton = document.getElementById(
  "deleteSelectedNames",
);
const importNamePoolFile = document.getElementById("importNamePoolFile");
const gameSettingsFastOCR = document.getElementById("gameSettingsFastOCR");
const gameSettingsTitle = gameSettingsModal?.querySelector("h2");
let persistedSettings = getTwoPlayerSettings();
rememberGame = persistedSettings.rememberGame !== false;
allTimeCarouselEnabled = persistedSettings.allTimeCarousel?.enabled !== false;
allTimeCarouselIntervalSeconds = normalizeAllTimeCarouselInterval(
  persistedSettings.allTimeCarousel?.intervalSeconds,
);
allTimeCarouselDurationSeconds = normalizeAllTimeCarouselDuration(
  persistedSettings.allTimeCarousel?.durationSeconds,
  allTimeCarouselIntervalSeconds,
);
useNamePoolForRuns = persistedSettings.useNamePoolForRuns === true;

function getTodayDateKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function normalizeAllTimeCarouselInterval(value) {
  const seconds = Number(value);

  return Number.isFinite(seconds)
    ? Math.max(1, Math.min(3600, Math.round(seconds)))
    : DEFAULT_ALL_TIME_CAROUSEL_INTERVAL_SECONDS;
}

function normalizeAllTimeCarouselDuration(
  value,
  intervalSeconds = allTimeCarouselIntervalSeconds,
) {
  const seconds = Number(value);
  const fallback = Math.min(
    DEFAULT_ALL_TIME_CAROUSEL_DURATION_SECONDS,
    intervalSeconds,
  );

  return Number.isFinite(seconds)
    ? Math.max(1, Math.min(600, intervalSeconds, Math.round(seconds)))
    : fallback;
}

function getTodayLeaderboardKey() {
  return `${TWO_PLAYER_LEADERBOARD_PREFIX}${getTodayDateKey()}`;
}

function getLeaderboardStorageKey(dateKey) {
  return `${TWO_PLAYER_LEADERBOARD_PREFIX}${dateKey}`;
}

function createPlayerState(number, label, color) {
  const canvas = document.getElementById(`player${number}Canvas`);
  const title = document.getElementById(`player${number}Title`);
  const dymoColors = ["dymo-black", "dymo-red", "dymo-green", "dymo-blue"];

  title.classList.add(
    dymoColors[Math.floor(Math.random() * dymoColors.length)],
  );
  title.style.setProperty(
    "--dymo-rotation",
    `${(Math.random() * 4 - 2).toFixed(2)}deg`,
  );

  return {
    label,
    staticLabel: label,
    defaultLabel: label,
    color,
    title,
    nameInput: document.getElementById(`player${number}Name`),
    video: document.getElementById(`player${number}Video`),
    canvas,
    ctx: canvas.getContext("2d"),
    feedFrame: document
      .getElementById(`player${number}Canvas`)
      .closest(".feedFrame"),
    cameraSelect: document.getElementById(`player${number}Camera`),
    lutSelect: document.getElementById(`player${number}Lut`),
    lutSwatches: document.getElementById(`player${number}LutSwatches`),
    screenOverlay: document.getElementById(`player${number}ScreenOverlay`),
    screenOverlayToggle: document.getElementById(
      `player${number}ScreenOverlayEnabled`,
    ),
    calibrateButton: document.getElementById(`player${number}Calibrate`),
    status: document.getElementById(`player${number}Status`),
    achievementLayer: document.getElementById(`player${number}Achievements`),
    screenBadge: document.getElementById(`player${number}ScreenBadge`),
    currentRank: document.getElementById(`player${number}CurrentRank`),
    nameEntryPanel: document.getElementById(`player${number}NameEntry`),
    gameToast: document.getElementById(`player${number}GameToast`),
    gameToastTimer: null,
    gameRecognitionToastInterval: null,
    gameRecognitionToastPhase: "",
    fireworksOverlay: document.getElementById(`player${number}Fireworks`),
    fireworksTimer: null,
    fireworksFrame: null,
    fireworksCanvas: null,
    fireworks: [],
    interceptorOverlay: document.getElementById(
      `player${number}InterceptorOverlay`,
    ),
    stream: null,
    cameraRecoveryTimer: null,
    cameraRecovering: false,
    cableLost: false,
    startupScreenSince: null,
    startupScreenTimer: null,
    interceptorActive: false,
    signalReady: false,
    recognizedGameName: "",
    game: null,
    palette: getPalette(INITIAL_LUT_CATEGORY, INITIAL_LUT_PALETTE),
    thresholds: DEFAULT_THRESHOLDS.slice(),
    quantized: new Array(WIDTH * HEIGHT).fill(0),
    activeScreen: null,
    values: [],
    trackingValues: [],
    lastOCRValues: {},
    activeScreenLastVisibleAt: 0,
    trackedScoreScreenLastVisibleAt: 0,
    calibrated: false,
    runActive: false,
    assignedRunName: "",
    resolvedRunName: "",
    currentScore: null,
    currentGameScore: null,
    lastScore: null,
    finalizedScore: null,
    finalizedScoreGuard: null,
    scoreEntryId: null,
    newGameResetCandidate: null,
    runRestartBlocked: false,
    scoreStopScreenSince: null,
    lastVisibleRank: null,
    demoIndex: 0,
    demoKnown: false,
    demoLastValue: null,
    demoTime400Since: null,
    demoHeldMatched: false,
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
    game: rememberGame ? selectedGameName : "",
    rememberGame,
    selectedScoreSettingId,
    scoreSettings: persistedSettings.scoreSettings || {},
    useFastOCR,
    useNamePoolForRuns,
    allTimeCarousel: {
      enabled: allTimeCarouselEnabled,
      intervalSeconds: allTimeCarouselIntervalSeconds,
      durationSeconds: allTimeCarouselDurationSeconds,
    },
    players: players.map((player) => ({
      name: player.staticLabel || player.label,
      cameraId: player.cameraSelect.value,
      lut: player.lutSelect.value,
      palette: player.palette.map(rgbToHex),
      calibrated: player.calibrated,
      thresholds: player.thresholds,
      screenOverlayEnabled: player.screenOverlayToggle.checked,
    })),
  };

  persistedSettings = settings;
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

function getStoredRandomPlayerNames() {
  try {
    const names = JSON.parse(localStorage.getItem(TWO_PLAYER_RANDOM_NAMES_KEY));

    return normalizeRandomPlayerNames(names);
  } catch {
    return [];
  }
}

function setStoredRandomPlayerNames(names) {
  randomPlayerNames = normalizeRandomPlayerNames(names);
  localStorage.setItem(
    TWO_PLAYER_RANDOM_NAMES_KEY,
    JSON.stringify(randomPlayerNames),
  );
}

async function loadRandomPlayerNames() {
  const stored = getStoredRandomPlayerNames();

  if (stored.length > 0) {
    randomPlayerNames = stored;
    return;
  }

  try {
    const response = await fetch("data/player-names.json");
    const names = await response.json();

    randomPlayerNames = normalizeRandomPlayerNames(names);
  } catch {
    randomPlayerNames = [];
  }
}

function normalizeRandomPlayerNames(names) {
  if (!Array.isArray(names)) return [];

  const seen = new Set();

  return names
    .map((name) => normalizeRandomPlayerName(name))
    .filter((name) => {
      const key = normalizePlayerNameKey(name);

      if (!key || seen.has(key)) return false;

      seen.add(key);
      return true;
    });
}

function normalizeRandomPlayerName(name) {
  return String(name || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, MAX_SCORE_NAME_LENGTH)
    .toUpperCase();
}

function normalizePlayerNameKey(name) {
  return String(name || "")
    .trim()
    .toLowerCase();
}

function isKnownGameName(gameName) {
  return Boolean(
    gameName && Object.prototype.hasOwnProperty.call(savedGames, gameName),
  );
}

function getAllTimeLeaderboard() {
  try {
    const data =
      JSON.parse(localStorage.getItem(TWO_PLAYER_ALL_TIME_KEY)) || [];

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
  return Number(entry?.score) >= getScoreEntryMinScore(entry);
}

function getScoreEntryMinScore(entry) {
  return normalizeScoreMinScore(entry?.scoreMinScore);
}

function normalizeScoreMinScore(value) {
  const minScore = Number(value);

  return Number.isFinite(minScore)
    ? Math.max(0, Math.round(minScore))
    : DEFAULT_MIN_LEADERBOARD_SCORE;
}

function normalizeScoreValueLabel(value) {
  return String(value || "")
    .trim()
    .slice(0, 24);
}

function normalizeScoreStopScreen(value, gameData = selectedGame) {
  const screenName = String(value || "");

  if (!screenName) return "";

  return (gameData?.screens || []).some((screen) => screen.name === screenName)
    ? screenName
    : "";
}

function normalizeScoreStopScreens(value, gameData = selectedGame) {
  const values = Array.isArray(value)
    ? value
    : String(value || "")
        .split(",")
        .map((item) => item.trim());
  const seen = new Set();

  return values
    .map((item) => normalizeScoreStopScreen(item, gameData))
    .filter((screenName) => {
      if (!screenName || seen.has(screenName)) return false;

      seen.add(screenName);
      return true;
    });
}

function normalizeScoreFireworkScreens(value) {
  const values = Array.isArray(value) ? value : [];
  const validScreens = new Set(
    (selectedGame?.screens || []).map((screen) => screen.name).filter(Boolean),
  );
  const seen = new Set();

  return values
    .map((item) => String(item || "").trim())
    .filter((screenName) => {
      if (
        !screenName ||
        !validScreens.has(screenName) ||
        seen.has(screenName)
      ) {
        return false;
      }

      seen.add(screenName);
      return true;
    });
}

function normalizeScoreDemoMetric(value, screenName, gameData = selectedGame) {
  const metricName = String(value || "").trim();

  if (!metricName) return "";

  return getMetricNamesForGameScreen(gameData, screenName).includes(metricName)
    ? metricName
    : "";
}

function normalizeScoreDemoSequenceInput(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => Number(item))
      .filter((item) => Number.isFinite(item))
      .join(", ");
  }

  return parseScoreDemoSequence(value).join(", ");
}

function parseScoreDemoSequence(value) {
  return String(value || "")
    .replace(/[\[\]]/g, "")
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item !== "")
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isFinite(item));
}

function normalizeScoreDemoStartValue(value, sequenceInput) {
  const sequence = parseScoreDemoSequence(sequenceInput);
  const number = Number(value);

  if (!sequence.length) return "";
  if (Number.isFinite(number) && sequence.includes(number))
    return String(number);

  return String(sequence[0]);
}

function normalizeDemoDetectorConfig(
  value,
  screenName = selectedScoreScreenName,
  gameData = selectedGame,
) {
  const mode = value?.mode === "held" ? "held" : "sequence";
  const sequence = normalizeScoreDemoSequenceInput(
    value?.sequence ?? value?.demoSequence,
  );
  const rawMetric = String(value?.metric ?? value?.demoMetric ?? "").trim();
  const metric = screenName
    ? normalizeScoreDemoMetric(rawMetric, screenName, gameData)
    : rawMetric;
  const startValue = normalizeScoreDemoStartValue(
    value?.startValue ?? value?.demoStartValue,
    sequence,
  );
  const created =
    value?.created === true || value?.demoDetectorCreated === true;
  const stopScreens = normalizeScoreStopScreens(
    value?.stopScreens ?? value?.trackUntilScreens ?? value?.stopScreen,
    gameData,
  );
  const heldValue = String(value?.heldValue ?? value?.targetValue ?? "").trim();
  const holdMsValue = Number(value?.holdMs ?? value?.holdDurationMs);
  const holdMs = Number.isFinite(holdMsValue)
    ? Math.max(0, Math.round(holdMsValue))
    : 2000;
  const confirmOnScreenExit = value?.confirmOnScreenExit !== false;
  const hasUsableDetector = Boolean(
    metric && (mode === "held" ? heldValue : sequence),
  );

  return {
    created,
    enabled: created || hasUsableDetector,
    mode,
    metric,
    sequence,
    startValue,
    stopScreens,
    heldValue,
    holdMs,
    confirmOnScreenExit,
  };
}

function hasUsableDemoDetectorConfig(value = {}) {
  const metric = String(value.metric ?? value.demoMetric ?? "").trim();
  const mode =
    value.mode === "held" || value.demoMode === "held" ? "held" : "sequence";
  const sequence = normalizeScoreDemoSequenceInput(
    value.sequence ?? value.demoSequence,
  );
  const heldValue = String(
    value.heldValue ?? value.demoHeldValue ?? value.targetValue ?? "",
  ).trim();

  return Boolean(metric && (mode === "held" ? heldValue : sequence));
}

function hasDemoDetectorDraftValues(value = {}) {
  return Boolean(
    String(value.metric ?? value.demoMetric ?? "").trim() ||
    normalizeScoreDemoSequenceInput(value.sequence ?? value.demoSequence) ||
    String(value.startValue ?? value.demoStartValue ?? "").trim() ||
    String(
      value.heldValue ?? value.demoHeldValue ?? value.targetValue ?? "",
    ).trim() ||
    normalizeScoreStopScreens(
      value.stopScreens ?? value.demoStopScreens ?? value.trackUntilScreens,
    ).length,
  );
}

function getScoreDemoDetectorConfig(setting = getSelectedScoreSetting()) {
  const config = getResolvedDemoDetectorConfig(setting);
  const sequence = parseScoreDemoSequence(config?.sequence);
  const metric = normalizeScoreDemoMetric(
    config?.metric,
    selectedScoreScreenName,
  );
  const startValue = Number(config?.startValue);
  const heldValue = Number(config?.heldValue);

  if (!metric) {
    return null;
  }

  if (config.mode === "held") {
    if (!String(config.heldValue ?? "").trim() || !Number.isFinite(heldValue)) {
      return null;
    }

    return {
      mode: "held",
      metric,
      heldValue,
      holdMs: config.holdMs,
      confirmOnScreenExit: config.confirmOnScreenExit,
      stopScreens: config.stopScreens || [],
    };
  }

  if (sequence.length === 0 || !Number.isFinite(startValue)) return null;

  return {
    mode: "sequence",
    metric,
    sequence,
    startValue,
    startIndex: Math.max(0, sequence.indexOf(startValue)),
    stopScreens: config.stopScreens || [],
  };
}

function getResolvedDemoDetectorConfig(setting = getSelectedScoreSetting()) {
  const settingConfig = normalizeDemoDetectorConfig(
    {
      metric: setting?.demoMetric,
      sequence: setting?.demoSequence,
      startValue: setting?.demoStartValue,
      stopScreens: setting?.demoStopScreens,
      mode: setting?.demoMode,
      heldValue: setting?.demoHeldValue,
      holdMs: setting?.demoHoldMs,
      confirmOnScreenExit: setting?.demoConfirmOnScreenExit,
    },
    setting?.screen || selectedScoreScreenName,
  );

  if (hasUsableDemoDetectorConfig(settingConfig)) {
    return settingConfig;
  }

  const screen = getSelectedScoreScreen();
  const screenConfig = normalizeDemoDetectorConfig(
    screen?.demoDetector,
    screen?.name,
  );

  if (hasUsableDemoDetectorConfig(screenConfig)) {
    return screenConfig;
  }

  const gameConfig = normalizeDemoDetectorConfig(
    selectedGame?.demoDetector || selectedGame?.settings?.demoDetector,
    selectedScoreScreenName,
  );

  return hasUsableDemoDetectorConfig(gameConfig) ? gameConfig : null;
}

function getScoreEntryKey(entry) {
  return (
    entry.key ||
    [
      entry.date || getTodayDateKey(),
      entry.game || "game",
      entry.startedAt || entry.id || "score",
      entry.id || entry.score || "entry",
      entry.color || "",
    ].join("-")
  );
}

function serializeScoreEntry(entry) {
  return {
    id: entry.id,
    key: getScoreEntryKey(entry),
    date: entry.date || getTodayDateKey(),
    game: entry.game,
    scoreSettingKey: getScoreEntrySettingKey(entry),
    scoreScreen: entry.scoreScreen || "",
    scoreMetric: entry.scoreMetric || "",
    scoreMinScore: getScoreEntryMinScore(entry),
    scoreValueLabel: normalizeScoreValueLabel(entry.scoreValueLabel),
    scoreStopScreen: entry.scoreStopScreen || "",
    interruptedBeforeStopScreen: Boolean(entry.interruptedBeforeStopScreen),
    player: entry.player,
    name: entry.name || "",
    color: entry.color,
    playerSide: getScoreEntryPlayerSide(entry),
    score: entry.score,
    gameScore: Number.isFinite(Number(entry.gameScore))
      ? Number(entry.gameScore)
      : null,
    createdAt: Number(entry.createdAt) || Number(entry.startedAt) || Date.now(),
    startedAt: entry.startedAt,
  };
}

function saveTodayLeaderboard() {
  const entries = getSettledSessionEntries()
    .filter((entry) => isKnownGameName(entry.game))
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
        isLeaderboardScore(entry) &&
        isKnownGameName(entry.game)
      );
    })
    .forEach((entry) => {
      const groupKey = `${entry.game || ""}|${getScoreEntrySettingKey(entry)}`;
      const entries = grouped.get(groupKey) || [];

      entries.push(entry);
      grouped.set(groupKey, entries);
    });
  const entries = [...grouped.values()].flatMap((items) => {
    return items.sort(compareScoreEntries).slice(0, 20);
  });

  localStorage.setItem(TWO_PLAYER_ALL_TIME_KEY, JSON.stringify(entries));
}

function restoreTodayLeaderboard() {
  sessionScores = getTodayLeaderboard()
    .filter((entry) => {
      return (
        entry &&
        Number.isFinite(Number(entry.score)) &&
        isLeaderboardScore(entry) &&
        isKnownGameName(entry.game)
      );
    })
    .map((entry) => ({
      id: Number(entry.id) || ++sessionScoreId,
      key: entry.key || getScoreEntryKey(entry),
      date: entry.date || getTodayDateKey(),
      game: entry.game || "",
      scoreSettingKey: getScoreEntrySettingKey(entry),
      scoreScreen: entry.scoreScreen || "",
      scoreMetric: entry.scoreMetric || "",
      scoreMinScore: getScoreEntryMinScore(entry),
      scoreValueLabel: normalizeScoreValueLabel(entry.scoreValueLabel),
      player: entry.player || entry.name || "Player",
      name: entry.name || "",
      color: entry.color === "red" ? "red" : "blue",
      playerSide: normalizeScoreEntryPlayerSide(entry.playerSide, entry.color),
      score: Number(entry.score),
      gameScore: Number.isFinite(Number(entry.gameScore))
        ? Number(entry.gameScore)
        : null,
      active: false,
      demo: false,
      createdAt:
        Number(entry.createdAt) || Number(entry.startedAt) || Date.now(),
      startedAt:
        Number(entry.startedAt) || Number(entry.createdAt) || Date.now(),
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

function cleanupUnknownGameLeaderboardData() {
  getStoredLeaderboardDays().forEach((dateKey) => {
    const knownEntries = getLeaderboardEntriesForDay(dateKey).filter(
      (entry) => {
        return isKnownGameName(entry.game) && isLeaderboardScore(entry);
      },
    );

    if (knownEntries.length > 0) {
      localStorage.setItem(
        getLeaderboardStorageKey(dateKey),
        JSON.stringify(knownEntries),
      );
    } else {
      localStorage.removeItem(getLeaderboardStorageKey(dateKey));
    }
  });

  sessionScores = sessionScores.filter((entry) => isKnownGameName(entry.game));
  rebuildAllTimeLeaderboardFromDays();
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
        JSON.parse(localStorage.getItem(getLeaderboardStorageKey(dateKey))) ||
        [];

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
      [
        ...entries
          .filter((entry) => {
            return (
              entry &&
              Number.isFinite(Number(entry.score)) &&
              isLeaderboardScore(entry) &&
              isKnownGameName(entry.game)
            );
          })
          .reduce((groups, entry) => {
            const groupKey = `${entry.game || ""}|${getScoreEntrySettingKey(entry)}`;
            const items = groups.get(groupKey) || [];

            items.push(entry);
            groups.set(groupKey, items);

            return groups;
          }, new Map())
          .values(),
      ].flatMap((items) => items.sort(compareScoreEntries).slice(0, 20)),
    ),
  );
}

function restorePlayerSettings(player, settings) {
  player.nameInput.value = player.label;
  updatePlayerLabel(player, settings?.name || player.label);
  player.screenOverlayToggle.checked = settings?.screenOverlayEnabled === true;
  player.screenOverlay.hidden = !player.screenOverlayToggle.checked;

  if (!settings) return;

  if (settings.lut) {
    player.lutSelect.value = settings.lut;

    if (player.lutSelect.value === settings.lut) {
      const { category, paletteName } = parseLUTOptionValue(settings.lut);
      player.palette = getPalette(category, paletteName);
    }
  }

  if (
    Array.isArray(settings.palette) &&
    settings.palette.length === player.palette.length
  ) {
    player.palette = settings.palette.map(hexToRgb);
  }

  if (
    Array.isArray(settings.thresholds) &&
    settings.thresholds.length === DEFAULT_THRESHOLDS.length
  ) {
    player.thresholds = settings.thresholds.slice();
    player.calibrated = Boolean(settings.calibrated);
  }
}

function updatePlayerLabel(player, label) {
  const fallback = player.defaultLabel;
  const clean =
    String(label || "")
      .trim()
      .slice(0, 18) || fallback;

  player.staticLabel = clean;
  if (!useNamePoolForRuns || !player.assignedRunName) {
    player.label = clean;
  }
  player.nameInput.value = clean;
  renderPlayerTitle(player, player.label);
  scoreBoardSignature = "";
}

function renderPlayerTitle(player, text) {
  let label = player.title.querySelector("span");

  if (!label) {
    label = document.createElement("span");
    player.title.replaceChildren(label);
  }

  label.textContent = text;
  label.dataset.text = text;
}

function assignRandomPlayerRunName(player) {
  if (player.assignedRunName) return;

  const name = useNamePoolForRuns
    ? getRandomAvailablePlayerName(player)
    : player.staticLabel || player.defaultLabel;

  player.assignedRunName = name;
  player.label = name;
  renderPlayerTitle(player, name);
  scoreBoardSignature = "";
}

function getRandomAvailablePlayerName(player) {
  const used = getLeaderboardNameSet();

  players.forEach((item) => {
    if (item !== player) used.add(normalizePlayerNameKey(item.label));
  });

  const available = randomPlayerNames.filter((name) => {
    return !used.has(normalizePlayerNameKey(name));
  });

  if (available.length > 0) {
    return available[Math.floor(Math.random() * available.length)];
  }

  for (let index = 0; index < 1000; index += 1) {
    const candidate = `RUN${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`;

    if (!used.has(normalizePlayerNameKey(candidate))) return candidate;
  }

  return player.defaultLabel;
}

function getLeaderboardNameSet() {
  const settingKey = getSelectedScoreSettingKey();
  const names = new Set();
  const collect = (entry) => {
    if (!isScoreEntryForSetting(entry, selectedGameName, settingKey)) return;

    const name = normalizePlayerNameKey(entry.name || entry.player);

    if (name) names.add(name);
  };

  sessionScores.forEach(collect);
  getStoredLeaderboardDays().forEach((dateKey) => {
    getLeaderboardEntriesForDay(dateKey).forEach(collect);
  });
  getAllTimeLeaderboard().forEach(collect);

  return names;
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

function rgbToHex(color) {
  return `#${[color.r, color.g, color.b]
    .map((value) =>
      Math.max(0, Math.min(255, value)).toString(16).padStart(2, "0"),
    )
    .join("")}`;
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

function renderPlayerLUTSwatches(player) {
  player.lutSwatches.replaceChildren();

  player.palette.forEach((color, index) => {
    const swatch = document.createElement("label");
    const input = document.createElement("input");

    swatch.className = "lutSwatch";
    swatch.style.background = `rgb(${color.r}, ${color.g}, ${color.b})`;
    swatch.title = rgbToHex(color);

    input.type = "color";
    input.value = rgbToHex(color);
    input.oninput = () => {
      player.palette = player.palette.map((item, itemIndex) => {
        return itemIndex === index ? hexToRgb(input.value) : item;
      });
      swatch.style.background = input.value;
      swatch.title = input.value;
      saveTwoPlayerSettings();
    };

    swatch.appendChild(input);
    player.lutSwatches.appendChild(swatch);
  });
}

function populateSharedGameSelect() {
  const previous =
    selectedGameName || (rememberGame ? persistedSettings.game : "") || "";

  sharedGameSelect.replaceChildren();

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
    });

  selectedGameName = savedGames[previous] ? previous : "";
  sharedGameSelect.value = selectedGameName;
  selectedGame = selectedGameName ? savedGames[selectedGameName] : null;
  players.forEach((player) => {
    player.game = selectedGame;
    player.lastOCRValues = {};
    player.activeScreenLastVisibleAt = 0;
    player.trackedScoreScreenLastVisibleAt = 0;
  });
  ensureGameScoreSettings();
  populateScoreSettingSelect();
  applySelectedScoreSetting();
  updateHighScoreTitle();
}

function getGameScoreSettingsRecord(gameName = selectedGameName) {
  persistedSettings.scoreSettings ||= {};
  persistedSettings.scoreSettings[gameName] ||= {
    selectedId: "",
    fastOCR: persistedSettings.useFastOCR !== false,
    items: [],
  };

  return persistedSettings.scoreSettings[gameName];
}

function ensureGameScoreSettings() {
  if (!selectedGameName || !selectedGame) {
    selectedScoreSettingId = "";
    selectedScoreScreenName = "";
    selectedScoreMetricName = "";
    selectedScoreStopScreenNames = [];
    selectedScoreMinScore = DEFAULT_MIN_LEADERBOARD_SCORE;
    selectedScoreValueLabel = "";
    useFastOCR = true;
    return;
  }

  const record = getGameScoreSettingsRecord();
  record.fastOCR ??= persistedSettings.useFastOCR !== false;

  if (record.items.length === 0) {
    record.items.push(createDefaultScoreSetting());
  }

  normalizeScoreSettingsRecord(record);

  if (!record.items.some((item) => item.id === record.selectedId)) {
    record.selectedId = record.items[0]?.id || "";
  }

  selectedScoreSettingId = record.selectedId;
}

function createDefaultScoreSetting() {
  const screenName = getDefaultScoreScreenName();
  const metricName = getDefaultScoreMetricName(screenName);

  return createScoreSetting(screenName, metricName);
}

function createScoreSetting(screenName, metricName) {
  return {
    id: `score-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: getGeneratedScoreSettingName(screenName, metricName),
    screen: screenName,
    metric: metricName,
    minScore: DEFAULT_MIN_LEADERBOARD_SCORE,
    valueLabel: "",
    stopScreen: "",
    stopScreens: [],
    fireworkScreens: [],
    demoMetric: "",
    demoSequence: "",
    demoStartValue: "",
    demoStopScreens: [],
    demoMode: "sequence",
    demoHeldValue: "",
    demoHoldMs: 2000,
    demoConfirmOnScreenExit: true,
    demoDetectorCreated: false,
    demoDetectorEnabled: false,
    moduleConfig: {},
  };
}

function getGeneratedScoreSettingName(screenName, metricName) {
  return screenName && metricName
    ? `${screenName} → ${metricName}`
    : "Leaderboard";
}

function getScoreSettingLabel(setting) {
  return getGeneratedScoreSettingName(setting.screen, setting.metric);
}

function normalizeSettingModuleConfig(setting) {
  const saved = setting?.moduleConfig || {};
  const normalized = {};

  const availableIds = new Set(
    getModulesForSetting(setting).map((module) => module.id),
  );

  getAttachedModulesForSetting(setting)
    .filter((module) => availableIds.has(module.id))
    .forEach((module) => {
      const moduleConfig = saved[module.id] || {};

      normalized[module.id] = getModuleConfigDefaults(module);
      Object.entries(moduleConfig).forEach(([key, value]) => {
        normalized[module.id][key] = String(value || "").trim();
      });
    });

  return normalized;
}

function getModuleConfigDefaults(module) {
  return Object.fromEntries(
    (module.configFields || []).map((field) => {
      return [field.key, String(field.defaultValue || "")];
    }),
  );
}

function getModulesForSetting(setting) {
  const context = {
    gameName: selectedGameName,
    selectedScreen: setting?.screen || "",
    selectedMetric: setting?.metric || "",
  };

  return (window.OcrGameModules?.items || []).filter((module) => {
    if (module.attachAnywhere === true) {
      return (
        typeof module.canAttach !== "function" || module.canAttach(context)
      );
    }

    if (typeof module.matches === "function" && !module.matches(context)) {
      return false;
    }

    if (typeof module.canAttach === "function") {
      return module.canAttach(context);
    }

    if (typeof module.matches === "function") {
      return module.matches(context);
    }

    return (
      (!module.game || module.game === context.gameName) &&
      (!module.screen || module.screen === context.selectedScreen) &&
      (!module.metric || module.metric === context.selectedMetric)
    );
  });
}

function getAttachedModulesForSetting(setting) {
  const moduleIds = Object.keys(setting?.moduleConfig || {});

  return moduleIds
    .map((id) =>
      window.OcrGameModules?.items.find((module) => module.id === id),
    )
    .filter(Boolean);
}

function getAvailableModulesForSetting(setting) {
  const attachedIds = new Set(Object.keys(setting?.moduleConfig || {}));

  return getModulesForSetting(setting).filter((module) => {
    return !attachedIds.has(module.id);
  });
}

function getModuleConfigForSetting(setting, module) {
  const defaults = getModuleConfigDefaults(module);
  const saved = setting?.moduleConfig?.[module.id] || {};

  return {
    ...defaults,
    ...Object.fromEntries(
      Object.entries(saved).map(([key, value]) => {
        return [key, String(value || "").trim()];
      }),
    ),
  };
}

function isModuleConfigComplete(setting, module) {
  const config = getModuleConfigForSetting(setting, module);

  return (module.configFields || []).every((field) => {
    return isModuleFieldValueValid(setting, module, field, config);
  });
}

function isModuleFieldValueValid(setting, module, field, config) {
  const value = String(config[field.key] || "").trim();

  if (!value && field.optional) return true;
  if (!value) return false;

  if (field.type === "screen") {
    return (selectedGame?.screens || []).some((screen) => {
      return String(screen.name || "").trim() === value;
    });
  }

  if (field.type === "roi") {
    const screenName = String(config[field.screenKey] || "").trim();

    if (!getRoiNamesForScreen(screenName).includes(value)) return false;
    return !isModuleRoiValueUsedByOtherField(module, field, setting, value);
  }

  return true;
}

function isModuleRoiValueUsedByOtherField(module, field, setting, value) {
  const config = setting ? getModuleConfigForSetting(setting, module) : {};
  const normalizedValue = String(value || "").trim();

  return (module.configFields || []).some((item) => {
    if (item.key === field.key || item.type !== "roi") return false;
    return String(config[item.key] || "").trim() === normalizedValue;
  });
}

function getScoreSettingComboKey(screenName, metricName) {
  return JSON.stringify([screenName || "", metricName || ""]);
}

function getSelectedScoreSettingKey() {
  return getScoreSettingComboKey(
    selectedScoreScreenName,
    selectedScoreMetricName,
  );
}

function getScoreEntrySettingKey(entry) {
  if (entry.scoreSettingKey) return entry.scoreSettingKey;
  if (entry.scoreScreen || entry.scoreMetric) {
    return getScoreSettingComboKey(entry.scoreScreen, entry.scoreMetric);
  }

  return "";
}

function getScoreEntrySettingLabel(entry) {
  return getGeneratedScoreSettingName(entry.scoreScreen, entry.scoreMetric);
}

function isScoreEntryForSetting(entry, gameName, settingKey) {
  if (entry.game !== gameName) return false;

  const entryKey = getScoreEntrySettingKey(entry);

  return entryKey
    ? entryKey === settingKey
    : settingKey === getDefaultHistorySettingKey(gameName);
}

function getDefaultHistorySettingKey(gameName) {
  return getScoreSettingsForHistoryGame(gameName)[0]?.key || "";
}

function getUsedScoreSettingComboKeys(exceptSettingId = "") {
  const record = selectedGameName ? getGameScoreSettingsRecord() : null;
  const used = new Set();

  (record?.items || []).forEach((item) => {
    if (item.id === exceptSettingId) return;
    if (!item.screen || !item.metric) return;

    used.add(getScoreSettingComboKey(item.screen, item.metric));
  });

  return used;
}

function getAvailableScoreSettingCombos(exceptSettingId = "") {
  const used = getUsedScoreSettingComboKeys(exceptSettingId);

  return getAllScoreSettingCombos().filter((combo) => {
    return !used.has(getScoreSettingComboKey(combo.screen, combo.metric));
  });
}

function getAllScoreSettingCombos() {
  return getAllScoreSettingCombosForGameData(selectedGame);
}

function getAllScoreSettingCombosForGameData(gameData) {
  const combos = [];

  (gameData?.screens || []).forEach((screen) => {
    const screenName = screen.name || "";

    getMetricNamesForGameScreen(gameData, screenName).forEach((metricName) => {
      combos.push({ screen: screenName, metric: metricName });
    });
  });

  return combos;
}

function createAvailableScoreSetting() {
  const preferred = createDefaultScoreSetting();
  const preferredKey = getScoreSettingComboKey(
    preferred.screen,
    preferred.metric,
  );
  const available = getAvailableScoreSettingCombos();
  const combo =
    available.find((item) => {
      return getScoreSettingComboKey(item.screen, item.metric) === preferredKey;
    }) || available[0];

  if (!combo) return null;

  return createScoreSetting(combo.screen, combo.metric);
}

function normalizeScoreSettingsRecord(record) {
  const seen = new Set();
  const valid = new Set(
    getAllScoreSettingCombos().map((item) => {
      return getScoreSettingComboKey(item.screen, item.metric);
    }),
  );

  record.items = record.items.filter((item) => {
    item.screen = String(item.screen || "");
    item.metric = String(item.metric || "");
    item.minScore = normalizeScoreMinScore(item.minScore);
    item.valueLabel = normalizeScoreValueLabel(item.valueLabel);
    item.stopScreens = normalizeScoreStopScreens(
      item.stopScreens ?? item.stopScreen,
    );
    item.stopScreen = item.stopScreens[0] || "";
    item.fireworkScreens = normalizeScoreFireworkScreens(item.fireworkScreens);
    item.demoMetric = normalizeScoreDemoMetric(item.demoMetric, item.screen);
    item.demoSequence = normalizeScoreDemoSequenceInput(item.demoSequence);
    item.demoStartValue = normalizeScoreDemoStartValue(
      item.demoStartValue,
      item.demoSequence,
    );
    item.demoStopScreens = normalizeScoreStopScreens(item.demoStopScreens);
    item.demoMode = item.demoMode === "held" ? "held" : "sequence";
    item.demoHeldValue = String(item.demoHeldValue ?? "").trim();
    item.demoHoldMs = Number.isFinite(Number(item.demoHoldMs))
      ? Math.max(0, Math.round(Number(item.demoHoldMs)))
      : 2000;
    item.demoConfirmOnScreenExit = item.demoConfirmOnScreenExit !== false;
    item.demoDetectorCreated = item.demoDetectorCreated === true;
    item.demoDetectorEnabled =
      item.demoDetectorCreated || hasUsableDemoDetectorConfig(item);
    item.moduleConfig = normalizeSettingModuleConfig(item);
    item.name = getScoreSettingLabel(item);

    const key = getScoreSettingComboKey(item.screen, item.metric);

    if (!item.screen || !item.metric || !valid.has(key) || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });

  if (record.items.length === 0) {
    const setting =
      createAvailableScoreSetting() || createDefaultScoreSetting();

    record.items.push(setting);
  }
}

function getDefaultScoreScreenName() {
  const screens = selectedGame?.screens || [];
  const names = screens.map((screen) => screen.name || "");

  return (
    names.find((name) => name === persistedSettings.scoreScreen) ||
    names.find((name) => name === DEFAULT_TRACKED_SCREEN_NAME) ||
    names[0] ||
    ""
  );
}

function getDefaultScoreMetricName(screenName) {
  const names = getMetricNamesForScreen(screenName);

  return (
    names.find((name) => name === persistedSettings.scoreMetric) ||
    names.find((name) => name.toLowerCase() === DEFAULT_SCORE_METRIC_NAME) ||
    names[0] ||
    ""
  );
}

function getMetricNamesForScreen(screenName) {
  return getRoiNamesForScreen(screenName);
}

function getRoiNamesForScreen(screenName) {
  return getMetricNamesForGameScreen(selectedGame, screenName);
}

function getMetricNamesForGameScreen(gameData, screenName) {
  const screen = (gameData?.screens || []).find((item) => {
    return item.name === screenName;
  });

  return [
    ...new Set(
      (screen?.rois || [])
        .map((roi) => String(roi.name || "").trim())
        .filter(Boolean),
    ),
  ];
}

function populateScoreSettingSelect() {
  const record = selectedGameName ? getGameScoreSettingsRecord() : null;
  const items = record?.items || [];

  scoreSettingSelect.replaceChildren();

  items.forEach((setting) => {
    const option = document.createElement("option");

    option.value = setting.id;
    option.textContent = getScoreSettingLabel(setting);
    scoreSettingSelect.appendChild(option);
  });

  scoreSettingSelect.value = selectedScoreSettingId;
  scoreSettingSelect.disabled = items.length === 0;
}

function selectScoreSetting(settingId) {
  const record = selectedGameName ? getGameScoreSettingsRecord() : null;

  if (!record?.items.some((setting) => setting.id === settingId)) return;

  record.selectedId = settingId;
  selectedScoreSettingId = settingId;
  scoreSettingSelect.value = settingId;
  applySelectedScoreSetting();
  updateHighScoreTitle();
  restartAllTimeCarouselCycle();
  scoreBoardSignature = "";
  resetScoringRuns();
  saveTwoPlayerSettings();
}

function applySelectedScoreSetting() {
  const record = selectedGameName ? getGameScoreSettingsRecord() : null;
  const setting = getSelectedScoreSetting();

  selectedScoreScreenName = setting?.screen || "";
  selectedScoreMetricName = setting?.metric || "";
  selectedScoreMinScore = normalizeScoreMinScore(setting?.minScore);
  selectedScoreValueLabel = normalizeScoreValueLabel(setting?.valueLabel);
  selectedScoreStopScreenNames = normalizeScoreStopScreens(
    setting?.stopScreens ?? setting?.stopScreen,
  );
  useFastOCR = record?.fastOCR !== false;
}

function getSelectedScoreSetting() {
  const record = selectedGameName ? getGameScoreSettingsRecord() : null;

  return (
    record?.items.find((item) => item.id === selectedScoreSettingId) || null
  );
}

function selectSharedGame(name, options = {}) {
  if (!options.preserveRecognitionState && options.source !== "recognition") {
    gameRecognitionActive = false;
    gameRecognitionStartedAt = 0;
    gameRecognitionDeadline = 0;
    gameRecognitionFallbackGameName = "";
    players.forEach(clearGameRecognitionToastTimers);
  }

  clearNameEntryTimers();
  selectedGameName = name;
  selectedGame = savedGames[name] || null;
  selectedScoreScreenName = selectedGame ? selectedScoreScreenName : "";
  selectedScoreMetricName = selectedGame ? selectedScoreMetricName : "";
  selectedScoreStopScreenNames = selectedGame
    ? selectedScoreStopScreenNames
    : [];
  highScoreHistoryGameName = isKnownGameName(name)
    ? name
    : getHighScoreHistoryGameName();
  scoreBoardSignature = "";

  players.forEach((player) => {
    player.game = selectedGame;
    player.recognizedGameName = selectedGameName;
    resetPlayerRun(player);
    resetPlayerAchievements(player, { clearQueue: true });
    player.activeScreen = null;
    player.activeScreenLastVisibleAt = 0;
    player.trackedScoreScreenLastVisibleAt = 0;
    player.lastOCRValues = {};
    player.values = [];
    player.trackingValues = [];
    updateInterceptorOverlay(player);
  });

  sharedGameSelect.value = selectedGameName;
  ensureGameScoreSettings();
  populateScoreSettingSelect();
  applySelectedScoreSetting();
  updateHighScoreTitle();
  restartAllTimeCarouselCycle();
  saveTwoPlayerSettings();
  updateAllPlayerStatuses();
  renderScoreBoard();

  if (options.source === "recognition" && selectedGame) {
    showGameRecognitionToast(options.player || players[0], selectedGameName);
  }
}

function startGameRecognitionWindow() {
  gameRecognitionFallbackGameName = selectedGameName;
  gameRecognitionActive = true;
  gameRecognitionStartedAt = Date.now();
  gameRecognitionDeadline = Date.now() + GAME_RECOGNITION_WINDOW_MS;
  players.forEach((player) => {
    player.recognizedGameName = "";
    player.gameRecognitionToastPhase = "";
  });
}

function updateGameRecognition(player) {
  if (!gameRecognitionActive) return;

  const now = Date.now();

  if (now > gameRecognitionDeadline) {
    finishGameRecognitionTimeout(player);
    return;
  }

  const match = findRecognizedGame(player);

  if (match) {
    gameRecognitionActive = false;
    gameRecognitionStartedAt = 0;
    player.recognizedGameName = match.name;
    players.forEach(clearGameRecognitionToastTimers);

    selectSharedGame(match.name, {
      source: "recognition",
      player,
    });
    return;
  }

  updateGameRecognitionProgressToast(player, now);
}

function finishGameRecognitionTimeout(player) {
  gameRecognitionActive = false;
  gameRecognitionStartedAt = 0;
  players.forEach((item) => {
    item.signalReady = false;
    item.feedFrame.classList.remove("signalReady");
  });

  if (
    gameRecognitionFallbackGameName &&
    gameRecognitionFallbackGameName !== selectedGameName &&
    savedGames[gameRecognitionFallbackGameName]
  ) {
    selectSharedGame(gameRecognitionFallbackGameName, {
      preserveRecognitionState: true,
    });
  }

  showGameRecognitionToast(player, "", {
    message: "Unknown Game!",
    recognitionFailed: true,
    unknownGame: true,
    duration: GAME_RECOGNITION_UNKNOWN_TOAST_MS,
  });
}

function updateGameRecognitionProgressToast(player, now = Date.now()) {
  if (!gameRecognitionStartedAt) return;

  const elapsed = now - gameRecognitionStartedAt;

  if (elapsed >= GAME_RECOGNITION_COUNTDOWN_MS) {
    const secondsLeft = Math.max(
      0,
      Math.ceil((gameRecognitionDeadline - now) / 1000),
    );
    const phase = `countdown:${secondsLeft}`;

    if (player.gameRecognitionToastPhase !== phase) {
      player.gameRecognitionToastPhase = phase;
      showGameRecognitionToast(player, "", {
        message: String(secondsLeft),
        recognitionFailed: true,
        unknownGame: true,
        persistent: true,
      });
    }
    return;
  }

  if (
    elapsed >= GAME_RECOGNITION_PENDING_MS &&
    player.gameRecognitionToastPhase !== "pending"
  ) {
    player.gameRecognitionToastPhase = "pending";
    showGameRecognitionToast(player, "", {
      message: "Game not recognized yet...",
      recognitionFailed: true,
      unknownGame: true,
      persistent: true,
    });
  }
}

function findRecognizedGame(player) {
  return Object.entries(savedGames)
    .map(([name, data]) => {
      const screenName = String(data.recognitionScreen || "").trim();
      const screen = screenName
        ? (data.screens || []).find((item) => item.name === screenName)
        : null;

      return { name, screen };
    })
    .find((item) => item.screen && screenMatches(player, item.screen));
}

function getBoxartImagePath(imageName) {
  return imageName
    ? `${BOXART_IMAGE_BASE_PATH}${encodeURIComponent(imageName)}`
    : "";
}

function showGameRecognitionToast(player, gameName, options = {}) {
  const toast = player.gameToast;
  const gameData = savedGames[gameName];

  if (!toast) return;

  clearGameRecognitionToastTimers(player);
  toast.replaceChildren();
  toast.classList.toggle(
    "wrongGame",
    Boolean(options.wrongGame || options.recognitionFailed),
  );
  toast.classList.toggle(
    "recognizedGame",
    !options.wrongGame && !options.recognitionFailed,
  );
  toast.classList.toggle("unknownGame", Boolean(options.recognitionFailed));

  if (options.unknownGame) {
    const imageBox = document.createElement("div");
    const image = document.createElement("img");

    imageBox.className = "gameRecognitionUnknownImageBox";
    image.src = UNKNOWN_GAME_IMAGE_PATH;
    image.alt = "";
    imageBox.appendChild(image);
    toast.appendChild(imageBox);
  } else if (!options.recognitionFailed && gameData?.boxartImage) {
    const image = document.createElement("img");

    image.src = getBoxartImagePath(gameData.boxartImage);
    image.alt = "";
    toast.appendChild(image);
  }

  const label = document.createElement("span");

  label.textContent =
    options.message ||
    (options.wrongGame ? `Wrong Game! ${gameName}` : gameName);
  toast.appendChild(label);
  toast.hidden = false;

  if (!options.persistent) {
    player.gameToastTimer = window.setTimeout(() => {
      toast.hidden = true;
      player.gameRecognitionToastPhase = "";
    }, options.duration || GAME_RECOGNITION_TOAST_MS);
  }
}

function clearGameRecognitionToastTimers(player) {
  window.clearTimeout(player.gameToastTimer);
  window.clearInterval(player.gameRecognitionToastInterval);
  player.gameToastTimer = null;
  player.gameRecognitionToastInterval = null;
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
    : "LEADERBOARD";
  highScoreSubtitle.textContent =
    selectedScoreScreenName && selectedScoreMetricName
      ? `(${selectedScoreScreenName} → ${selectedScoreMetricName})`
      : "";
  highScoreSubtitle.hidden = !highScoreSubtitle.textContent;
  exportJSONButton.disabled = !selectedGameName || !selectedGame;
}

function hasExportableProjectDemoDetector(value = {}) {
  const created = value.created === true || value.demoDetectorCreated === true;

  return (
    hasUsableDemoDetectorConfig(value) ||
    (created && hasDemoDetectorDraftValues(value))
  );
}

function getSelectedGameExportData() {
  const gameDemoDetector = selectedGame?.demoDetector || {};
  const screens = (selectedGame?.screens || []).map((screen) => {
    const { demoDetector, ...screenData } = screen;

    return hasExportableProjectDemoDetector(demoDetector)
      ? {
          ...screenData,
          demoDetector: serializeDemoDetectorConfig(demoDetector, selectedGame),
        }
      : screenData;
  });
  const { demoDetector, ...gameData } = selectedGame;

  return {
    ...gameData,
    exportVersion: 1,
    exportedAt: new Date().toISOString(),
    game: selectedGameName,
    ...(hasExportableProjectDemoDetector(gameDemoDetector)
      ? {
          demoDetector: serializeDemoDetectorConfig(
            gameDemoDetector,
            selectedGame,
          ),
        }
      : {}),
    screens,
  };
}

function stringifySelectedGameExport(data) {
  return JSON.stringify(data, null, 2).replace(
    /"pixels":\s*\[\s*([\d,\s]+?)\s*\]/gs,
    (_, values) => `"pixels": [${values.replace(/\s+/g, " ").trim()}]`,
  );
}

function exportSelectedGameJSON() {
  if (!selectedGameName || !selectedGame) {
    showAlert("Choose a game before exporting JSON.");
    return;
  }

  const blob = new Blob(
    [stringifySelectedGameExport(getSelectedGameExportData())],
    { type: "application/json" },
  );
  const link = document.createElement("a");
  const safeName =
    selectedGameName
      .replace(/[<>:"/\\|?*]+/g, "-")
      .replace(/\s+/g, " ")
      .trim() || "ocr-helper";

  link.href = URL.createObjectURL(blob);
  link.download = `${safeName}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}

async function importProjectFiles(files) {
  const imported = [];

  for (const file of files) {
    try {
      const data = JSON.parse(await file.text());

      if (!isValidProjectData(data)) {
        showAlert(`${file.name} is not a valid OCR JSON.`);
        continue;
      }

      imported.push({
        name: data.game || file.name.replace(/\.json$/i, ""),
        timestamp: getProjectTimestamp(data, file),
        data: normalizeProjectData(data),
      });
    } catch {
      showAlert(`${file.name} could not be imported.`);
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

  if (overwrites.length > 0) {
    showConfirm(
      `Overwrite saved game(s)?\n\n- ${overwrites.join("\n- ")}`,
      () => finishImportProjects(kept),
    );
    return;
  }

  finishImportProjects(kept);
}

function finishImportProjects(kept) {
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
    boxartImage: String(data.boxartImage || ""),
    boxartImages: Array.isArray(data.boxartImages)
      ? data.boxartImages.map((item) => String(item || "")).filter(Boolean)
      : data.boxartImage
        ? [String(data.boxartImage)]
        : [],
    demoDetector: normalizeImportedGameDemoDetector(data.demoDetector, data),
    recognitionScreen: String(data.recognitionScreen || ""),
    settings: normalizeGameSettings(data.settings),
    tilesets: (data.tilesets || []).map((tileset) => ({
      ...tileset,
      type: normalizeTilesetType(tileset.type),
      scanPixels: normalizeScanPixels(tileset.scanPixels),
      tiles: Array.isArray(tileset.tiles) ? tileset.tiles : [],
    })),
    screens: (data.screens || []).map((screen) => ({
      ...screen,
      identifierMatchCount: Number.isFinite(Number(screen.identifierMatchCount))
        ? Number(screen.identifierMatchCount)
        : "all",
      demoDetector: normalizeDemoDetectorConfig(
        screen.demoDetector,
        screen.name,
        data,
      ),
      identifiers: Array.isArray(screen.identifiers) ? screen.identifiers : [],
      rois: Array.isArray(screen.rois) ? screen.rois : [],
      achievements: normalizeImportedAchievements(screen.achievements),
    })),
  };
}

function normalizeGameSettings(settings = {}) {
  const grace = Number(settings.screenDetectionGraceMs);

  return {
    screenDetectionGraceMs: Number.isFinite(grace)
      ? Math.max(0, Math.min(1000, Math.round(grace)))
      : DEFAULT_SCREEN_DETECTION_GRACE_MS,
    stallOcrOnUnknownTiles: Boolean(settings.stallOcrOnUnknownTiles),
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

function waitForCameraRelease(ms = 250) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function isCameraAllocationError(err) {
  return (
    err?.name === "NotReadableError" ||
    /allocate|videosource|in use/i.test(err?.message || "")
  );
}

async function loadCameras() {
  const cameras = await getAvailableCameras();

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

async function getAvailableCameras() {
  let permissionStream = null;

  try {
    permissionStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
  } catch (err) {
    console.warn("Could not open default capture device:", err);
  } finally {
    permissionStream?.getTracks().forEach((track) => track.stop());
  }

  const devices = await navigator.mediaDevices.enumerateDevices();

  return devices.filter(
    (device) => device.kind === "videoinput" && device.deviceId,
  );
}

async function startPlayerCamera(player) {
  stopCameraRecovery(player);

  if (player.stream) {
    stopPlayerStream(player);
    player.video.srcObject = null;
  }

  const constraints = {
    video: {
      deviceId: player.cameraSelect.value
        ? { exact: player.cameraSelect.value }
        : undefined,
      width: { ideal: WIDTH },
      height: { ideal: HEIGHT },
    },
    audio: false,
  };

  try {
    player.stream = await navigator.mediaDevices.getUserMedia(constraints);
  } catch (err) {
    if (!isCameraAllocationError(err)) throw err;

    await waitForCameraRelease();
    player.stream = await navigator.mediaDevices.getUserMedia(constraints);
  }

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
      player.video.srcObject = null;
    }

    const constraints = {
      video: {
        deviceId: { exact: player.cameraSelect.value },
        width: { ideal: WIDTH },
        height: { ideal: HEIGHT },
      },
      audio: false,
    };

    try {
      player.stream = await navigator.mediaDevices.getUserMedia(constraints);
    } catch (err) {
      if (!isCameraAllocationError(err)) throw err;

      await waitForCameraRelease();
      player.stream = await navigator.mediaDevices.getUserMedia(constraints);
    }

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
    const emptyColor = player.palette[0];

    player.ctx.fillStyle = `rgb(${emptyColor.r}, ${emptyColor.g}, ${emptyColor.b})`;
    player.ctx.fillRect(0, 0, WIDTH, HEIGHT);

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
    player.activeScreen = detectInterceptorScreen(player);
    player.values = [];
    player.trackingValues = [];
    player.lastOCRValues = {};
    updatePlayerScreenBadge(player);
    updateInterceptorOverlay(player);
    updateGameRecognition(player);
    resetPlayerRun(player);
    updatePlayerAchievementScreenRun(player, null, false);
    return;
  }

  const previousScreen = player.activeScreen;
  const now = Date.now();
  const previousStillMatches =
    previousScreen && screenMatches(player, previousScreen);
  const previousInGrace =
    previousScreen &&
    player.activeScreenLastVisibleAt &&
    now - player.activeScreenLastVisibleAt <=
      player.game.settings.screenDetectionGraceMs;

  if (previousStillMatches) {
    player.activeScreen = previousScreen;
    player.activeScreenLastVisibleAt = now;
  } else if (previousInGrace) {
    player.activeScreen = previousScreen;
  } else {
    const matchedScreen = getDetectableScreens(player.game).find((screen) =>
      screenMatches(player, screen),
    );

    player.activeScreen = matchedScreen || null;
    player.activeScreenLastVisibleAt = matchedScreen ? now : 0;
  }

  player.values = player.activeScreen
    ? getRegionValues(player, player.activeScreen)
    : [];
  updateTrackedScoreScreenVisibility(player, now);
  player.trackingValues = getPlayerTrackingValues(player);

  updatePlayerScreenBadge(player);
  updateInterceptorOverlay(player);
  updateGameRecognition(player);

  if (!player.game) {
    updatePlayerRocketEffects(player);
    updatePlayerAchievementScreenRun(player, null, false);
    return;
  }

  updatePlayerRun(player, previousScreen);
  updateModuleNameEntry(player);
  updatePlayerRocketEffects(player);
  updatePlayerAchievementScreenRun(
    player,
    player.activeScreen,
    Boolean(player.activeScreen),
  );
  evaluatePlayerAchievements(player);
}

function detectInterceptorScreen(player) {
  return (
    interceptorScreens.find((screen) => screenMatches(player, screen)) || null
  );
}

function updatePlayerRun(player, previousScreen) {
  const pendingModuleNameEntry = hasPendingModuleNameEntry(player);
  const score = getPlayerMetricNumber(player, selectedScoreMetricName);
  const gameScore = getPlayerMetricNumber(player, "Score");
  const lines = getPlayerMetricNumber(player, "Lines");
  const canReadTrackedScore =
    score !== null && isTrackedScoreReadAllowed(player);

  updateDemoTracking(player, previousScreen);

  if (isScoreStopScreen(player.activeScreen)) {
    if (
      !isScoreStopScreen(previousScreen) ||
      player.scoreStopScreenSince === null
    ) {
      player.scoreStopScreenSince = Date.now();
      preserveActiveScoreRun(player);
      return;
    }

    if (Date.now() - player.scoreStopScreenSince < getScoreStopScreenHoldMs()) {
      preserveActiveScoreRun(player);
      return;
    }

    if (player.runActive && player.currentScore !== null) {
      finalizePlayerScore(player);
    }

    player.runActive = false;
    player.runRestartBlocked = true;
    return;
  }

  player.scoreStopScreenSince = null;

  if (
    selectedScoreStopScreenNames.length > 0 &&
    !isTrackedScreen(player.activeScreen) &&
    !canReadTrackedScore
  ) {
    preserveActiveScoreRun(player);
    return;
  }

  if (
    pendingModuleNameEntry &&
    !isTrackedScreen(player.activeScreen) &&
    !canReadTrackedScore
  ) {
    player.runActive = false;
    player.runRestartBlocked = true;
    return;
  }

  if (!isTrackedScreen(player.activeScreen) && !canReadTrackedScore) {
    if (player.runActive && player.currentScore !== null) {
      finalizePlayerScore(player);
    }

    player.runActive = false;
    player.runRestartBlocked = false;
    return;
  }

  if (
    player.runRestartBlocked &&
    !pendingModuleNameEntry &&
    selectedScoreStopScreenNames.length > 0 &&
    !isTrackedScreen(player.activeScreen) &&
    !isScoreStopScreen(player.activeScreen)
  ) {
    return;
  }

  if (
    player.runRestartBlocked &&
    !pendingModuleNameEntry &&
    !isNewGameStartSignal(score, gameScore, lines)
  ) {
    return;
  }

  if (
    player.runRestartBlocked &&
    isNewGameStartSignal(score, gameScore, lines)
  ) {
    player.runRestartBlocked = false;
  }

  if (
    !player.runActive &&
    player.finalizedScore !== null &&
    isNewGameStartSignal(score, gameScore, lines)
  ) {
    resetPlayerRun(player);
  }

  if (score === null) return;

  if (!player.runActive || previousScreen !== player.activeScreen) {
    if (!player.runActive && player.finalizedScore !== null) {
      resetPlayerRun(player);
    }

    player.runActive = true;
  }

  if (pendingModuleNameEntry) {
    finishPendingModuleNameEntry(player);
    player.runRestartBlocked = false;
  }

  if (!player.assignedRunName) {
    assignRandomPlayerRunName(player);
  }

  if (gameScore !== null) {
    player.currentGameScore = gameScore;
  }

  if (player.lastScore !== null && score < player.lastScore) {
    if (isNewGameStartSignal(score, gameScore, lines)) {
      if (!confirmNewGameResetSignal(player, score, gameScore, lines)) {
        preserveActiveScoreRun(player);
        return;
      }

      finalizePlayerScore(player);
      resetPlayerRun(player);
      player.runRestartBlocked = true;
      return;
    }
  }

  player.newGameResetCandidate = null;
  player.currentScore = score;
  player.lastScore = score;
  player.runRestartBlocked = false;
  updateSessionScore(player, player.currentScore, {
    demo: player.demoKnown,
    gameScore: player.currentGameScore,
  });
  if (!player.runRestartBlocked) {
    player.finalizedScore = null;
  }
}

function confirmNewGameResetSignal(player, score, gameScore, lines) {
  const now = Date.now();
  const key = JSON.stringify([score, gameScore, lines]);

  if (player.newGameResetCandidate?.key !== key) {
    player.newGameResetCandidate = {
      key,
      since: now,
    };
    return false;
  }

  return now - player.newGameResetCandidate.since >= NEW_GAME_RESET_CONFIRM_MS;
}

function preserveActiveScoreRun(player) {
  if (player.currentScore === null) return;

  player.runActive = true;
  player.runRestartBlocked = false;
  updateSessionScore(player, player.currentScore, {
    demo: player.demoKnown,
    gameScore: player.currentGameScore,
  });
  if (!player.runRestartBlocked) {
    player.finalizedScore = null;
  }
}

function getScoreStopScreenHoldMs() {
  const grace = Number(selectedGame?.settings?.screenDetectionGraceMs);

  return Number.isFinite(grace) ? Math.max(250, Math.min(grace, 1000)) : 500;
}

function isNewGameStartSignal(score, gameScore, lines) {
  const readableScore = gameScore ?? score;

  if (readableScore === null) return false;
  if (readableScore <= 0) return lines === null || lines <= 1;

  return readableScore <= 200 && lines !== null && lines <= 1;
}

function isTrackedScreen(screen) {
  return screen?.name === selectedScoreScreenName;
}

function isScoreStopScreen(screen) {
  return Boolean(
    selectedScoreStopScreenNames.length > 0 &&
    selectedScoreStopScreenNames.includes(screen?.name),
  );
}

function isDemoDetectorStopScreen(screen) {
  const screenName = screen?.name || "";

  if (!screenName) return false;

  return (
    getScoreDemoDetectorConfig()?.stopScreens.includes(screenName) || false
  );
}

function isEffectiveRunStopScreen(player, screen) {
  if (isScoreStopScreen(screen)) return true;
  if (!player.demoKnown) return false;

  return isDemoDetectorStopScreen(screen);
}

function isTrackedScoreReadAllowed(player) {
  if (isTrackedScreen(player.activeScreen)) return true;
  if (isScoreStopScreen(player.activeScreen)) return false;
  if (isInterceptorScreen(player.activeScreen)) return false;
  if (
    getMetricNumberFromValues(
      player.trackingValues,
      selectedScoreMetricName,
    ) !== null
  ) {
    return true;
  }
  if (selectedScoreStopScreenNames.length === 0) return false;

  return (
    player.trackedScoreScreenLastVisibleAt > 0 &&
    Date.now() - player.trackedScoreScreenLastVisibleAt <=
      player.game.settings.screenDetectionGraceMs
  );
}

function getSelectedScoreScreen() {
  if (!selectedGame || !selectedScoreScreenName) return null;

  return (
    selectedGame.screens.find((screen) => {
      return screen.name === selectedScoreScreenName;
    }) || null
  );
}

function getPlayerTrackingValues(player) {
  const scoreScreen = getSelectedScoreScreen();

  if (!scoreScreen) return player.values;
  if (isTrackedScreen(player.activeScreen)) return player.values;
  if (isScoreStopScreen(player.activeScreen)) return [];
  if (isInterceptorScreen(player.activeScreen)) return [];
  if (selectedScoreStopScreenNames.length === 0) return [];
  if (player.runActive || selectedScoreMetricName) {
    return getRegionValues(player, scoreScreen);
  }
  if (
    !player.trackedScoreScreenLastVisibleAt ||
    Date.now() - player.trackedScoreScreenLastVisibleAt >
      player.game.settings.screenDetectionGraceMs
  ) {
    return [];
  }

  return getRegionValues(player, scoreScreen);
}

function updateTrackedScoreScreenVisibility(player, now = Date.now()) {
  const scoreScreen = getSelectedScoreScreen();

  if (!scoreScreen) {
    player.trackedScoreScreenLastVisibleAt = 0;
    return;
  }

  if (
    isTrackedScreen(player.activeScreen) ||
    screenMatches(player, scoreScreen)
  ) {
    player.trackedScoreScreenLastVisibleAt = now;
  }
}

function isInterceptorScreen(screen) {
  return Boolean(
    screen &&
    Object.prototype.hasOwnProperty.call(
      interceptorScreenMessages,
      normalizeScreenName(screen.name),
    ),
  );
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
  const startupTimedOut = updateStartupScreenTimer(player, screenName);

  if (startupTimedOut) {
    message = interceptorScreenMessages.restartRequired;
  } else if (player.cableLost && (!screenName || screenName === "startup")) {
    message = interceptorScreenMessages.cable;
  } else if (player.cableLost && screenName && screenName !== "startup") {
    player.cableLost = false;
  }

  if (message?.tone === "startup") {
    player.signalReady = true;
  } else if (message) {
    player.signalReady = false;
  }

  player.feedFrame.classList.toggle("signalReady", player.signalReady);

  if (!message) {
    if (player.interceptorActive) {
      startGameRecognitionWindow();
    }

    player.interceptorActive = false;
    player.interceptorOverlay.hidden = true;
    player.interceptorOverlay.replaceChildren();
    player.interceptorOverlay.dataset.tone = "";
    return;
  }

  markScoreInterruptedBeforeStopScreen(player);

  player.interceptorActive = true;

  const title = document.createElement("strong");
  const body = document.createElement("span");

  title.textContent = message.title;
  body.textContent = message.body;

  player.interceptorOverlay.dataset.tone = message.tone;
  player.interceptorOverlay.replaceChildren(title, body);
  player.interceptorOverlay.hidden = false;
}

function markScoreInterruptedBeforeStopScreen(player) {
  if (selectedScoreStopScreenNames.length === 0) return;
  if (isScoreStopScreen(player.activeScreen)) return;

  // A module name-entry row is finalized, but it still represents this run.
  const entry =
    getPendingModuleNameEntry(player) ||
    getFinalizedGuardEntry(player) ||
    getActiveSessionScoreForPlayer(player);

  if (!entry || entry.interruptedBeforeStopScreen) return;

  if (entry.demo) {
    sessionScores = sessionScores.filter((item) => item.id !== entry.id);
    if (player.finalizedScoreGuard?.entryId === entry.id) {
      player.finalizedScoreGuard = null;
    }
    player.scoreEntryId = null;
    player.runActive = false;
    player.currentScore = null;
    player.currentGameScore = null;
    player.lastScore = null;
    player.finalizedScore = null;
    player.runRestartBlocked = true;
    player.scoreStopScreenSince = null;
    scoreBoardSignature = "";
    renderScoreBoard();
    return;
  }

  settleInterruptedScoreEntry(player, entry);
  entry.interruptedBeforeStopScreen = true;
  entry.active = false;
  player.scoreEntryId = null;
  player.runActive = false;
  player.currentScore = null;
  player.currentGameScore = null;
  player.lastScore = null;
  player.finalizedScore = null;
  player.runRestartBlocked = true;
  player.scoreStopScreenSince = null;
  saveTodayLeaderboard();
  scoreBoardSignature = "";
  renderScoreBoard();
}

function getPendingModuleNameEntry(player) {
  return (
    sessionScores
      .filter((entry) => {
        return (
          entry.nameEntry?.source === "module" &&
          entry.color === player.color &&
          entry.game === selectedGameName &&
          getScoreEntrySettingKey(entry) === getSelectedScoreSettingKey()
        );
      })
      .sort((a, b) => b.startedAt - a.startedAt || b.id - a.id)[0] || null
  );
}

function getFinalizedGuardEntry(player) {
  const guard = player.finalizedScoreGuard;

  if (!guard) return null;

  return (
    sessionScores.find((entry) => {
      return (
        entry.id === guard.entryId &&
        entry.game === guard.game &&
        Number(entry.score) === Number(guard.score) &&
        getScoreEntrySettingKey(entry) === guard.settingKey
      );
    }) || null
  );
}

function settleInterruptedScoreEntry(player, keepEntry) {
  const partialName = keepEntry.nameEntry?.value?.trim();

  if (partialName) {
    keepEntry.name = partialName;
    keepEntry.player = partialName;
    player.resolvedRunName = partialName;
  }

  if (keepEntry.nameEntry?.timer) {
    window.clearInterval(keepEntry.nameEntry.timer);
  }
  delete keepEntry.nameEntry;

  const duplicateKeys = new Set();

  // The only removable duplicate is the player's other currently tracked
  // entry. Equal historical scores are never treated as the same run.
  sessionScores = sessionScores.filter((entry) => {
    if (entry === keepEntry) return true;
    if (entry.removingDemo || entry.demo) return true;
    if (entry.date !== keepEntry.date) return true;
    if (entry.game !== keepEntry.game) return true;
    if (entry.color !== keepEntry.color) return true;
    if (Number(entry.score) !== Number(keepEntry.score)) return true;
    if (getScoreEntrySettingKey(entry) !== getScoreEntrySettingKey(keepEntry)) {
      return true;
    }

    const sameRun = entry.id === player.scoreEntryId;

    if (sameRun && entry.nameEntry?.timer) {
      window.clearInterval(entry.nameEntry.timer);
    }

    if (sameRun) {
      duplicateKeys.add(getScoreEntryKey(entry));
    }

    return !sameRun;
  });

  if (duplicateKeys.size > 0) {
    const allTimeEntries = getAllTimeLeaderboard().filter((entry) => {
      return !duplicateKeys.has(getScoreEntryKey(entry));
    });

    localStorage.setItem(
      TWO_PLAYER_ALL_TIME_KEY,
      JSON.stringify(allTimeEntries),
    );
  }

  player.finalizedScoreGuard = {
    entryId: keepEntry.id,
    score: keepEntry.score,
    game: keepEntry.game,
    settingKey: getScoreEntrySettingKey(keepEntry),
  };
}

function updateStartupScreenTimer(player, screenName) {
  if (screenName !== "startup") {
    clearStartupScreenTimer(player);
    return false;
  }

  if (player.startupScreenSince === null) {
    player.startupScreenSince = Date.now();
    player.startupScreenTimer = window.setTimeout(() => {
      updateInterceptorOverlay(player);
    }, STARTUP_RESTART_REQUIRED_MS);
  }

  return Date.now() - player.startupScreenSince >= STARTUP_RESTART_REQUIRED_MS;
}

function clearStartupScreenTimer(player) {
  player.startupScreenSince = null;

  if (!player.startupScreenTimer) return;

  window.clearTimeout(player.startupScreenTimer);
  player.startupScreenTimer = null;
}

function getPlayerMetricNumber(player, metricName) {
  const trackedScore = getMetricNumberFromValues(
    player.trackingValues,
    metricName,
  );

  if (trackedScore !== null) return trackedScore;

  return getMetricNumberFromValues(player.values, metricName);
}

function getMetricNumberFromValues(values, metricName) {
  if (!Array.isArray(values) || !values.length) return null;

  const scoreRegion = values.find((region) => {
    return (
      String(region.name || "")
        .trim()
        .toLowerCase() ===
      String(metricName || "")
        .trim()
        .toLowerCase()
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
  player.currentGameScore = null;
  player.assignedRunName = "";
  player.resolvedRunName = "";
  player.label = player.staticLabel || player.defaultLabel;
  renderPlayerTitle(player, player.label);
  player.lastScore = null;
  player.finalizedScore = null;
  player.finalizedScoreGuard = null;
  player.scoreEntryId = null;
  player.newGameResetCandidate = null;
  player.runRestartBlocked = false;
  player.scoreStopScreenSince = null;
  player.trackedScoreScreenLastVisibleAt = isTrackedScreen(player.activeScreen)
    ? Date.now()
    : 0;
  player.lastVisibleRank = null;
  player.demoIndex = 0;
  player.demoKnown = false;
  player.demoLastValue = null;
  player.demoTime400Since = null;
  player.demoHeldMatched = false;
}

function resetScoringRuns() {
  players.forEach((player) => {
    resetPlayerRun(player);
    updatePlayerScreenBadge(player);
  });
  scoreBoardSignature = "";
  renderScoreBoard();
}

function updateDemoTracking(player, previousScreen) {
  const config = getScoreDemoDetectorConfig();

  if (!config) {
    player.demoIndex = 0;
    player.demoKnown = false;
    player.demoLastValue = null;
    player.demoTime400Since = null;
    player.demoHeldMatched = false;
    return;
  }

  if (config.mode === "held") {
    updateHeldValueDemoTracking(player, config, previousScreen);
    return;
  }

  const value = getPlayerMetricNumber(player, config.metric);

  if (value === null || value === player.demoLastValue) return;

  player.demoLastValue = value;

  if (value === config.sequence[player.demoIndex]) {
    player.demoIndex += 1;
  } else if (value === config.sequence[0]) {
    player.demoIndex = 1;
    player.demoKnown = false;
  } else {
    player.demoIndex = 0;
    player.demoKnown = false;
  }

  if (player.demoIndex > config.startIndex) {
    player.demoKnown = true;
  }
}

function updateHeldValueDemoTracking(player, config, previousScreen) {
  const value = getPlayerMetricNumber(player, config.metric);
  const screenChanged = Boolean(
    previousScreen && previousScreen !== player.activeScreen,
  );

  if (screenChanged && config.confirmOnScreenExit && player.demoHeldMatched) {
    player.demoKnown = true;
    return;
  }

  if (value === config.heldValue) {
    if (player.demoTime400Since === null) {
      player.demoTime400Since = Date.now();
    }
    player.demoHeldMatched = true;
    if (Date.now() - player.demoTime400Since >= config.holdMs) {
      player.demoKnown = true;
    }
    return;
  }

  if (value !== null) {
    player.demoTime400Since = null;
    player.demoHeldMatched = false;
    player.demoKnown = false;
  }
}

function updateSessionScore(player, score, options = {}) {
  if (!selectedGameName) return;

  if (isBlockedByFinalizedScoreGuard(player, score)) {
    player.scoreEntryId = null;
    player.runRestartBlocked = true;
    return;
  }

  let entry = sessionScores.find((item) => item.id === player.scoreEntryId);

  if (!entry) {
    entry = getActiveSessionScoreForPlayer(player);
  }

  if (!entry && hasDuplicateSettledOrNameEntryScore(player, score)) {
    player.scoreEntryId = null;
    player.runRestartBlocked = true;
    return;
  }

  if (!entry) {
    const createdAt = Date.now();

    entry = {
      id: ++sessionScoreId,
      key: `${getTodayDateKey()}-${selectedGameName || "game"}-${createdAt}-${sessionScoreId}`,
      date: getTodayDateKey(),
      player: player.label,
      color: player.color,
      playerSide: getPlayerSide(player),
      score,
      gameScore: Number.isFinite(Number(options.gameScore))
        ? Number(options.gameScore)
        : null,
      active: true,
      demo: false,
      game: selectedGameName,
      scoreSettingKey: getSelectedScoreSettingKey(),
      scoreScreen: selectedScoreScreenName,
      scoreMetric: selectedScoreMetricName,
      scoreMinScore: selectedScoreMinScore,
      scoreValueLabel: selectedScoreValueLabel,
      scoreStopScreen: selectedScoreStopScreenNames[0] || "",
      scoreStopScreens: selectedScoreStopScreenNames.slice(),
      interruptedBeforeStopScreen: false,
      createdAt,
      startedAt: createdAt,
    };
    sessionScores.push(entry);
  }

  player.scoreEntryId = entry.id;
  entry.score = score;
  if (Number.isFinite(Number(options.gameScore))) {
    entry.gameScore = Number(options.gameScore);
  }
  entry.active = true;
  entry.scoreSettingKey = getSelectedScoreSettingKey();
  entry.scoreScreen = selectedScoreScreenName;
  entry.scoreMetric = selectedScoreMetricName;
  entry.scoreMinScore = selectedScoreMinScore;
  entry.scoreValueLabel = selectedScoreValueLabel;
  entry.scoreStopScreen = selectedScoreStopScreenNames[0] || "";
  entry.scoreStopScreens = selectedScoreStopScreenNames.slice();
  entry.demo = Boolean(options.demo);
  entry.player = entry.demo ? "Demo" : entry.name || player.label;
  removeDuplicateActiveSessionScores(player, entry);
  trimSessionScores();
}

function isBlockedByFinalizedScoreGuard(player, score) {
  const guard = player.finalizedScoreGuard;

  if (!guard) return false;
  if (guard.game !== selectedGameName) return false;
  if (guard.settingKey !== getSelectedScoreSettingKey()) return false;
  if (Number(guard.score) !== Number(score)) return false;

  const guardedEntry = sessionScores.find(
    (entry) => entry.id === guard.entryId,
  );

  return Boolean(
    guardedEntry &&
    !guardedEntry.active &&
    !guardedEntry.removingDemo &&
    Number(guardedEntry.score) === Number(score),
  );
}

function hasDuplicateSettledOrNameEntryScore(player, score) {
  const now = Date.now();
  const settingKey = getSelectedScoreSettingKey();

  return sessionScores.some((entry) => {
    if (entry.active || entry.removingDemo || entry.demo) return false;
    if (entry.date !== getTodayDateKey()) return false;
    if (entry.game !== selectedGameName) return false;
    if (entry.color !== player.color) return false;
    if (Number(entry.score) !== Number(score)) return false;
    if (getScoreEntrySettingKey(entry) !== settingKey) return false;
    if (entry.nameEntry) return true;

    const entryTime = Number(entry.startedAt) || now;

    return Math.abs(now - entryTime) <= SCORE_DUPLICATE_CONFINEMENT_MS;
  });
}

function getActiveSessionScoreForPlayer(player) {
  return (
    sessionScores
      .filter((entry) => isCurrentSessionScoreForPlayer(entry, player))
      .sort((a, b) => b.startedAt - a.startedAt || b.id - a.id)[0] || null
  );
}

function removeDuplicateActiveSessionScores(player, keepEntry) {
  sessionScores = sessionScores.filter((entry) => {
    return (
      entry === keepEntry || !isCurrentSessionScoreForPlayer(entry, player)
    );
  });
}

function removeDuplicateSettledScoreEntries(keepEntry) {
  const keepTime = Number(keepEntry.startedAt) || Date.now();

  sessionScores = sessionScores.filter((entry) => {
    if (entry === keepEntry) return true;
    if (entry.active || entry.removingDemo || entry.demo) {
      return true;
    }
    if (entry.date !== keepEntry.date) return true;
    if (entry.game !== keepEntry.game) return true;
    if (entry.color !== keepEntry.color) return true;
    if (Number(entry.score) !== Number(keepEntry.score)) return true;
    if (getScoreEntrySettingKey(entry) !== getScoreEntrySettingKey(keepEntry)) {
      return true;
    }

    const entryTime = Number(entry.startedAt) || keepTime;

    const duplicate =
      Math.abs(keepTime - entryTime) <= SCORE_DUPLICATE_CONFINEMENT_MS;

    if (duplicate && entry.nameEntry?.timer) {
      window.clearInterval(entry.nameEntry.timer);
    }

    return !duplicate;
  });
}

function isCurrentSessionScoreForPlayer(entry, player) {
  return (
    isCurrentSessionScore(entry) &&
    entry.game === selectedGameName &&
    entry.color === player.color
  );
}

function hasPendingModuleNameEntry(player) {
  return sessionScores.some((entry) => {
    return entry.nameEntry?.source === "module" && entry.color === player.color;
  });
}

function finishPendingModuleNameEntry(player) {
  const entry = sessionScores.find((item) => {
    return item.nameEntry?.source === "module" && item.color === player.color;
  });

  if (entry) {
    finishNameEntry(entry);
  }
}

function finalizeSessionScore(player) {
  const entry = sessionScores.find((item) => item.id === player.scoreEntryId);

  if (!entry) return;

  entry.active = false;
  player.finalizedScoreGuard = {
    entryId: entry.id,
    score: entry.score,
    game: entry.game,
    settingKey: getScoreEntrySettingKey(entry),
  };
  player.scoreEntryId = null;

  if (entry.demo) {
    removeDemoScoreEntry(entry);
  } else if (!isLeaderboardScore(entry)) {
    removeLowScoreEntry(entry);
  } else {
    removeDuplicateSettledScoreEntries(entry);
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
    players.forEach((player) => {
      if (player.finalizedScoreGuard?.entryId === entry.id) {
        player.finalizedScoreGuard = null;
      }
    });
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
    players.forEach((player) => {
      if (player.finalizedScoreGuard?.entryId === entry.id) {
        player.finalizedScoreGuard = null;
      }
    });
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

function dedupeActiveSessionScores() {
  const preferredIds = new Set(players.map((player) => player.scoreEntryId));
  const keepByKey = new Map();

  sessionScores.forEach((entry) => {
    if (!isCurrentSessionScore(entry)) return;

    const key = getCurrentSessionScoreKey(entry);
    const current = keepByKey.get(key);

    if (
      !current ||
      (preferredIds.has(entry.id) && !preferredIds.has(current.id)) ||
      (!preferredIds.has(current.id) &&
        (entry.startedAt > current.startedAt ||
          (entry.startedAt === current.startedAt && entry.id > current.id)))
    ) {
      keepByKey.set(key, entry);
    }
  });

  sessionScores = sessionScores.filter((entry) => {
    if (!isCurrentSessionScore(entry)) return true;

    return keepByKey.get(getCurrentSessionScoreKey(entry)) === entry;
  });
}

function getPlayerSide(player) {
  return players.indexOf(player) === 1 ? "right" : "left";
}

function normalizeScoreEntryPlayerSide(side, color = "") {
  if (side === "left" || side === "right") return side;

  return color === "red" ? "right" : "left";
}

function getScoreEntryPlayerSide(entry) {
  return normalizeScoreEntryPlayerSide(entry.playerSide, entry.color);
}

function getScoreEntryCreatedAt(entry) {
  return Number(entry.createdAt) || Number(entry.startedAt) || 0;
}

function getScoreEntryNameKey(entry) {
  return normalizePlayerNameKey(
    entry.nameEntry?.value || entry.name || entry.player || "",
  );
}

function reconcileRecentRandomNameDuplicates() {
  if (randomPlayerNames.length === 0) return false;

  const randomNameKeys = new Set(randomPlayerNames.map(normalizePlayerNameKey));
  const candidates = sessionScores.filter((entry) => {
    return (
      !entry.demo &&
      !entry.removingDemo &&
      entry.date === getTodayDateKey() &&
      Number.isFinite(Number(entry.score)) &&
      getScoreEntryCreatedAt(entry) > 0
    );
  });
  const removeIds = new Set();
  const replacements = new Map();

  for (let index = 0; index < candidates.length; index += 1) {
    const first = candidates[index];

    if (removeIds.has(first.id)) continue;

    for (
      let otherIndex = index + 1;
      otherIndex < candidates.length;
      otherIndex += 1
    ) {
      const second = candidates[otherIndex];

      if (removeIds.has(second.id)) continue;
      if (first.game !== second.game) continue;
      if (getScoreEntrySettingKey(first) !== getScoreEntrySettingKey(second)) {
        continue;
      }
      if (getScoreEntryPlayerSide(first) !== getScoreEntryPlayerSide(second)) {
        continue;
      }
      if (Number(first.score) !== Number(second.score)) continue;
      if (
        Math.abs(
          getScoreEntryCreatedAt(first) - getScoreEntryCreatedAt(second),
        ) > RANDOM_NAME_DUPLICATE_WINDOW_MS
      ) {
        continue;
      }

      const firstHasRandomName = randomNameKeys.has(
        getScoreEntryNameKey(first),
      );
      const secondHasRandomName = randomNameKeys.has(
        getScoreEntryNameKey(second),
      );

      if (firstHasRandomName === secondHasRandomName) continue;

      const randomEntry = firstHasRandomName ? first : second;
      const retainedEntry = firstHasRandomName ? second : first;

      removeIds.add(randomEntry.id);
      replacements.set(randomEntry.id, retainedEntry.id);
    }
  }

  if (removeIds.size === 0) return false;

  sessionScores.forEach((entry) => {
    if (removeIds.has(entry.id) && entry.nameEntry?.timer) {
      window.clearInterval(entry.nameEntry.timer);
    }
  });
  sessionScores = sessionScores.filter((entry) => !removeIds.has(entry.id));
  players.forEach((player) => {
    const removedEntryId = removeIds.has(player.scoreEntryId)
      ? player.scoreEntryId
      : removeIds.has(player.finalizedScoreGuard?.entryId)
        ? player.finalizedScoreGuard.entryId
        : null;

    if (removedEntryId === null) return;

    const retainedEntry = sessionScores.find(
      (entry) => entry.id === replacements.get(removedEntryId),
    );

    player.scoreEntryId = null;
    player.runRestartBlocked = Boolean(retainedEntry);
    player.finalizedScore = retainedEntry?.score ?? null;
    player.finalizedScoreGuard = retainedEntry
      ? {
          entryId: retainedEntry.id,
          score: retainedEntry.score,
          game: retainedEntry.game,
          settingKey: getScoreEntrySettingKey(retainedEntry),
        }
      : null;
  });

  return true;
}

function isCurrentSessionScore(entry) {
  return (
    entry.active &&
    !entry.nameEntry &&
    !entry.removingDemo &&
    entry.date === getTodayDateKey()
  );
}

function getCurrentSessionScoreKey(entry) {
  return `${entry.date}|${entry.color}`;
}

function maybeStartNameEntry(entry) {
  if (entry.demo || entry.nameEntry) return;
  if (!isLeaderboardScore(entry)) return;

  const source = getNameEntrySource(entry);

  if (source !== "module") return;

  const queued = sessionScores.filter((item) => item.nameEntry).length;

  if (queued >= MAX_NAME_ENTRY_QUEUE) return;

  entry.nameEntry = {
    value: "",
    inputStarted: false,
    expiresAt: Date.now() + NAME_ENTRY_SECONDS * 1000,
    idleExpiresAt: null,
    timer: null,
    source,
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
  const entry = sessionScores.find((item) => {
    return item.nameEntry && item.nameEntry.source !== "module";
  });

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

function getNameEntrySource(entry) {
  const player = players.find((item) => item.color === entry.color);

  if (!player) return "manual";

  return getMatchingGameModules(player).some((module) => {
    return typeof module.onNameEntryTick === "function";
  })
    ? "module"
    : "manual";
}

function updateModuleNameEntry(player) {
  const entry = sessionScores.find((item) => {
    return item.nameEntry?.source === "module" && item.color === player.color;
  });

  if (!entry) return;

  getMatchingGameModules(player).forEach((module) => {
    if (typeof module.onNameEntryTick !== "function") return;

    module.onNameEntryTick(createModuleContext(player, entry));
  });
}

function getMatchingGameModules(player) {
  const setting = getSelectedScoreSetting();

  return getAttachedModulesForSetting(setting);
}

function updatePlayerRocketEffects(player) {
  if (!player.fireworksOverlay) return;

  const active = isModuleRocketScreen(player);

  player.fireworksOverlay.hidden = !active;

  if (active) {
    startPlayerFireworks(player);
  } else {
    stopPlayerFireworks(player);
  }
}

function isModuleRocketScreen(player) {
  const setting = getSelectedScoreSetting();
  const screens = normalizeScoreFireworkScreens(setting?.fireworkScreens);
  const activeScreenName = player.activeScreen?.name || "";

  return Boolean(activeScreenName && screens.includes(activeScreenName));
}

function startPlayerFireworks(player) {
  if (player.fireworksFrame) return;

  const overlay = player.fireworksOverlay;

  if (!overlay) return;

  if (!player.fireworksCanvas) {
    player.fireworksCanvas = document.createElement("canvas");
    player.fireworksCanvas.className = "fireworksCanvas";
    overlay.appendChild(player.fireworksCanvas);
  }

  player.fireworks = [];
  player.fireworksLastSpawn = 0;
  player.fireworksFrame = requestAnimationFrame((time) => {
    updatePlayerFireworks(player, time);
  });
}

function stopPlayerFireworks(player) {
  if (player.fireworksFrame) {
    cancelAnimationFrame(player.fireworksFrame);
    player.fireworksFrame = null;
  }

  player.fireworks = [];
  player.fireworksOverlay?.replaceChildren();
  player.fireworksCanvas = null;
}

function updatePlayerFireworks(player, time) {
  const overlay = player.fireworksOverlay;
  const canvas = player.fireworksCanvas;

  if (!overlay || overlay.hidden || !canvas) {
    player.fireworksFrame = null;
    return;
  }

  const rect = overlay.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  if (
    canvas.width !== Math.max(1, Math.round(rect.width * dpr)) ||
    canvas.height !== Math.max(1, Math.round(rect.height * dpr))
  ) {
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
  }

  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  if (!player.fireworksLastSpawn || time - player.fireworksLastSpawn > 520) {
    spawnPlayerFirework(player, width, height);
    player.fireworksLastSpawn = time;
  }

  player.fireworks.forEach((firework) => updateFirework(firework, ctx));
  player.fireworks = player.fireworks
    .filter((firework) => {
      return !firework.done;
    })
    .slice(-8);

  player.fireworksFrame = requestAnimationFrame((nextTime) => {
    updatePlayerFireworks(player, nextTime);
  });
}

function spawnPlayerFirework(player, width, height) {
  const margin = width * 0.14;
  const x = margin + Math.random() * Math.max(1, width - margin * 2);
  const burstY = height * (0.24 + Math.random() * 0.42);

  player.fireworks.push({
    rocket: {
      x,
      y: height + 2,
      vx: (Math.random() - 0.5) * 1.4,
      vy: -(5.2 + Math.random() * 2.2),
      burstY,
      trail: [],
    },
    particles: [],
    color: getFireworkColor(),
    exploded: false,
    done: false,
  });
}

function updateFirework(firework, ctx) {
  if (!firework.exploded) {
    const rocket = firework.rocket;

    rocket.trail.push({ x: rocket.x, y: rocket.y });
    rocket.trail = rocket.trail.slice(-7);
    rocket.x += rocket.vx + (Math.random() - 0.5) * 0.5;
    rocket.y += rocket.vy;
    rocket.vy += 0.075;

    drawTrail(ctx, rocket.trail, "rgba(255, 209, 102, 0.78)", 2.4);
    drawCircle(ctx, rocket.x, rocket.y, 2.8, "rgba(255, 224, 142, 0.96)");

    if (rocket.y <= rocket.burstY || rocket.vy >= 0) {
      firework.exploded = true;
      firework.particles = createFireworkParticles(
        rocket.x,
        rocket.y,
        firework.color,
      );
    }
  }

  firework.particles.forEach((particle) => {
    particle.trail.push({ x: particle.x, y: particle.y });
    particle.trail = particle.trail.slice(-4);
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vx *= 0.93;
    particle.vy = particle.vy * 0.93 + 0.045;
    particle.life -= 0.032;

    drawTrail(
      ctx,
      particle.trail,
      `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${Math.max(0, particle.life)})`,
      particle.radius,
    );
    drawCircle(
      ctx,
      particle.x,
      particle.y,
      particle.radius,
      `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${Math.max(0, particle.life)})`,
    );
  });
  firework.particles = firework.particles.filter(
    (particle) => particle.life > 0,
  );
  firework.done = firework.exploded && firework.particles.length === 0;
}

function createFireworkParticles(x, y, color) {
  return Array.from({ length: 46 }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.4 + Math.random() * 4.2;

    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: 1.2 + Math.random() * 2,
      life: 0.82 + Math.random() * 0.34,
      color,
      trail: [],
    };
  });
}

function getFireworkColor() {
  const colors = [
    { r: 255, g: 209, b: 102 },
    { r: 239, g: 71, b: 111 },
    { r: 6, g: 214, b: 160 },
    { r: 80, g: 170, b: 255 },
    { r: 255, g: 255, b: 255 },
  ];

  return colors[Math.floor(Math.random() * colors.length)];
}

function drawTrail(ctx, trail, color, width) {
  if (trail.length < 2) return;

  ctx.beginPath();
  trail.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.stroke();
}

function drawCircle(ctx, x, y, radius, color) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

function createModuleContext(player, entry = null, options = {}) {
  return {
    gameName: selectedGameName,
    selectedScreen: selectedScoreScreenName,
    selectedMetric: selectedScoreMetricName,
    activeScreenName: player.activeScreen?.name || "",
    player,
    entry,
    score: options.score,
    values: player.values,
    trackingValues: player.trackingValues,
    getValue(name, source = "tracking") {
      const values =
        source === "active" ? player.values : player.trackingValues;

      return getModuleValue(values, name);
    },
    getScreenValues(screenName, readOptions = {}) {
      const screen = (player.game?.screens || []).find((item) => {
        return item.name === screenName;
      });

      return screen ? getRegionValues(player, screen, readOptions) : [];
    },
    getModuleConfig(module) {
      const setting = getSelectedScoreSetting();

      return setting
        ? getModuleConfigForSetting(setting, module)
        : getModuleConfigDefaults(module);
    },
    setNameValue(value) {
      if (!entry?.nameEntry) return;

      const nextValue = normalizeModuleNameValue(value);

      if (!nextValue || nextValue === entry.nameEntry.value) return;

      entry.nameEntry.value = nextValue;
      refreshNameEntry(entry);
    },
    keepNameEntryAlive(seconds = MODULE_NAME_ENTRY_KEEPALIVE_SECONDS) {
      if (!entry?.nameEntry) return;

      const nextDeadline = Date.now() + seconds * 1000;

      entry.nameEntry.expiresAt = Math.max(
        entry.nameEntry.expiresAt || 0,
        nextDeadline,
      );

      if (entry.nameEntry.inputStarted) {
        entry.nameEntry.idleExpiresAt = Math.max(
          entry.nameEntry.idleExpiresAt || 0,
          nextDeadline,
        );
      }
    },
    finishNameEntry() {
      if (entry?.nameEntry) {
        finishNameEntry(entry);
      }
    },
  };
}

function getModuleValue(values, name) {
  const match = (values || []).find((item) => {
    return (
      String(item.name || "")
        .trim()
        .toLowerCase() ===
      String(name || "")
        .trim()
        .toLowerCase()
    );
  });

  return String(match?.value || "").trim();
}

function normalizeModuleNameValue(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .slice(0, MAX_SCORE_NAME_LENGTH);
}

function finishNameEntry(entry) {
  if (!entry.nameEntry) return;

  const source = entry.nameEntry.source;
  const value = entry.nameEntry.value.trim();
  const hadExplicitName = Boolean(value);

  if (value) {
    entry.name = value;
    entry.player = value;
  }

  window.clearInterval(entry.nameEntry.timer);
  delete entry.nameEntry;
  releasePlayerAfterNameEntry(entry, { hadExplicitName, source });
  saveTodayLeaderboard();
  scoreBoardSignature = "";
  renderScoreBoard();
}

function releasePlayerAfterNameEntry(entry, options = {}) {
  const player = players.find((item) => item.color === entry.color);

  if (!player) return;

  const stillReadingSameMetric = isPlayerStillReadingEntryScore(player, entry);

  if (
    options.source === "module" &&
    !options.hadExplicitName &&
    stillReadingSameMetric
  ) {
    player.runRestartBlocked = true;
    player.finalizedScore = entry.score;
    return;
  }

  player.runRestartBlocked = false;
  player.finalizedScore = null;
  if (player.finalizedScoreGuard?.entryId === entry.id) {
    player.finalizedScoreGuard = null;
  }
}

function isPlayerStillReadingEntryScore(player, entry) {
  const values = [
    player.currentScore,
    player.finalizedScore,
    getPlayerMetricNumber(player, selectedScoreMetricName),
    getMetricNumberFromValues(player.trackingValues, selectedScoreMetricName),
  ];

  return values.some((value) => {
    return value !== null && Number(value) === Number(entry.score);
  });
}

function screenMatches(player, screen) {
  const required = getRequiredIdentifierCount(screen);

  return required > 0 && countVisibleIdentifiers(player, screen) >= required;
}

function getRequiredIdentifierCount(screen) {
  const identifierCount = screen?.identifiers?.length || 0;

  if (identifierCount === 0) return 0;

  const configured = Number(screen.identifierMatchCount);

  if (!Number.isFinite(configured)) return identifierCount;

  return Math.max(1, Math.min(identifierCount, Math.round(configured)));
}

function countVisibleIdentifiers(player, screen) {
  if (!Array.isArray(screen?.identifiers)) return 0;

  return screen.identifiers.filter((identifier) => {
    const [x, y] = identifier.tile.split(",").map(Number);

    return tilesEqual(getTile(player, x, y), identifier.pixels || []);
  }).length;
}

function getRegionValues(player, screen, options = {}) {
  return (screen.rois || []).map((region) => {
    const tileset = player.game.tilesets.find(
      (item) => item.name === region.tileset,
    );
    const labels = [];
    let hasUnknownTile = false;

    if (tileset) {
      sortTileKeysByReadingOrder(region.tiles || []).forEach((key) => {
        const [x, y] = key.split(",").map(Number);
        const label = findTileLabel(getTile(player, x, y), tileset, options);

        if (label === null) {
          hasUnknownTile = true;
          return;
        }

        if (label !== "") {
          labels.push(label);
        }
      });
    }

    const shouldStall =
      Boolean(player.game.settings?.stallOcrOnUnknownTiles) && hasUnknownTile;
    const value = tileset
      ? shouldStall
        ? player.lastOCRValues[region.name] || "--"
        : formatRegionValue(labels, tileset.type)
      : "No tileset";

    if (tileset && !shouldStall && value !== "--") {
      player.lastOCRValues[region.name] = value;
    }

    return {
      name: region.name,
      value,
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

function findTileLabel(pixels, tileset, options = {}) {
  const fastOCR = options.fastOCR ?? useFastOCR;
  const scanPixels =
    fastOCR && isUsableScanPixelSet(tileset.scanPixels)
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
    if (achievement.enabled === false) return;
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
    enabled: achievement.enabled !== false,
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

function getStoredAllTimeCarouselEntries() {
  const settingKey = getSelectedScoreSettingKey();

  if (!selectedGameName || !settingKey) return [];

  return getAllTimeLeaderboard()
    .filter((entry) => {
      return (
        isScoreEntryForSetting(entry, selectedGameName, settingKey) &&
        isLeaderboardScore(entry)
      );
    })
    .sort(compareScoreEntries)
    .slice(0, ALL_TIME_CAROUSEL_MAX_ENTRY_COUNT);
}

function getAllTimeCarouselDisplayEntries(storedEntries) {
  const settingKey = getSelectedScoreSettingKey();
  const byKey = new Map(
    storedEntries.map((entry) => [
      getScoreEntryKey(entry),
      { ...entry, carouselCurrentSide: "" },
    ]),
  );

  sessionScores
    .filter((entry) => {
      return (
        entry.active &&
        !entry.demo &&
        !entry.removingDemo &&
        isLeaderboardScore(entry) &&
        isScoreEntryForSetting(entry, selectedGameName, settingKey)
      );
    })
    .forEach((entry) => {
      byKey.set(getScoreEntryKey(entry), {
        ...entry,
        carouselCurrentSide: getScoreEntryPlayerSide(entry),
      });
    });

  return [...byKey.values()]
    .sort(compareScoreEntries)
    .slice(0, ALL_TIME_CAROUSEL_MAX_ENTRY_COUNT);
}

function formatAllTimeCarouselDate(dateKey) {
  const [year, month, day] = String(dateKey || "").split("-");

  return year && month && day ? `${day}.${month}.${year.slice(-2)}` : "—";
}

function createAllTimeCarouselCell(text, className = "") {
  const cell = document.createElement("span");

  cell.className = `allTimeCarouselCell ${className}`.trim();
  cell.textContent = text;

  return cell;
}

function renderAllTimeCarouselBoard() {
  const storedEntries = getStoredAllTimeCarouselEntries();
  const previousScrollTop =
    allTimeCarouselBoard.querySelector(".allTimeCarouselTable")?.scrollTop || 0;

  if (storedEntries.length < ALL_TIME_CAROUSEL_MIN_ENTRY_COUNT) {
    allTimeCarouselBoard.replaceChildren();
    return false;
  }

  const entries = getAllTimeCarouselDisplayEntries(storedEntries);
  const title = document.createElement("h2");
  const table = document.createElement("div");

  title.className = "allTimeCarouselTitle";
  title.textContent = "ALL TIME TOP 20";
  table.className = "allTimeCarouselTable";
  table.setAttribute("role", "list");
  table.setAttribute("aria-label", "All time top 20");

  entries.forEach((entry, index) => {
    const row = document.createElement("div");
    const identity = document.createElement("div");
    const scoreGroup = document.createElement("div");
    const rank = getCompetitionRank(entries, index);

    row.className = "allTimeCarouselRow";
    row.setAttribute("role", "listitem");
    identity.className = "allTimeCarouselIdentity";
    identity.append(
      createAllTimeCarouselCell(
        getScoreEntryName(entry),
        "allTimeCarouselName",
      ),
      createAllTimeCarouselCell(
        formatAllTimeCarouselDate(entry.date),
        "allTimeCarouselDate",
      ),
    );
    scoreGroup.className = "allTimeCarouselScoreGroup";
    scoreGroup.append(
      createAllTimeCarouselCell("Score", "allTimeCarouselScoreLabel"),
      createAllTimeCarouselCell(
        formatScore(entry.score),
        "allTimeCarouselScore",
      ),
    );
    if (rank === 1) row.classList.add("topGold");
    if (rank === 2) row.classList.add("topSilver");
    if (rank === 3) row.classList.add("topBronze");
    if (entry.carouselCurrentSide) {
      row.classList.add(`current-${entry.carouselCurrentSide}`);
    }
    row.append(
      createAllTimeCarouselCell(`#${rank}`, "allTimeCarouselRank"),
      identity,
      scoreGroup,
    );
    table.appendChild(row);
  });

  allTimeCarouselBoard.replaceChildren(title, table);
  if (allTimeCarouselVisible) {
    table.scrollTop = previousScrollTop;
    if (!allTimeScrollPhase) startAllTimeCarouselScrollCycle();
  } else {
    resetAllTimeCarouselAutoScroll();
  }
  return true;
}

function hideAllTimeCarousel() {
  window.clearTimeout(allTimeCarouselHideTimer);
  allTimeCarouselHideTimer = null;
  allTimeCarouselVisible = false;
  leaderboardCarousel.classList.remove("showAllTime");
  scoreBoard.setAttribute("aria-hidden", "false");
  allTimeCarouselBoard.setAttribute("aria-hidden", "true");
  resetAllTimeCarouselAutoScroll();
  updateLeaderboardCarouselNavigation();
}

function showAllTimeCarousel() {
  window.clearTimeout(allTimeCarouselInterval);
  allTimeCarouselInterval = null;

  if (!allTimeCarouselEnabled || !renderAllTimeCarouselBoard()) {
    hideAllTimeCarousel();
    scheduleAllTimeCarouselInterval();
    return;
  }

  allTimeCarouselVisible = true;
  leaderboardCarousel.classList.add("showAllTime");
  scoreBoard.setAttribute("aria-hidden", "true");
  allTimeCarouselBoard.setAttribute("aria-hidden", "false");
  updateLeaderboardCarouselNavigation();
  startAllTimeCarouselScrollCycle();
}

function startAllTimeCarouselScrollCycle() {
  window.clearTimeout(allTimeCarouselHideTimer);
  allTimeCarouselHideTimer = null;
  allTimeScrollDirection = 1;
  allTimeScrollHoldUntil = performance.now() + 1000;
  allTimeScrollLastTime = 0;
  allTimeScrollPhase = "down";

  const scroller = allTimeCarouselBoard.querySelector(".allTimeCarouselTable");

  if (scroller) scroller.scrollTop = 0;
}

function beginAllTimeCarouselFinalWait() {
  if (!allTimeCarouselVisible || allTimeScrollPhase === "waiting") return;

  allTimeScrollPhase = "waiting";
  window.clearTimeout(allTimeCarouselHideTimer);
  allTimeCarouselHideTimer = window.setTimeout(() => {
    hideAllTimeCarousel();
    scheduleAllTimeCarouselInterval();
  }, allTimeCarouselDurationSeconds * 1000);
}

function updateLeaderboardCarouselNavigation() {
  const available =
    allTimeCarouselEnabled &&
    getStoredAllTimeCarouselEntries().length >=
      ALL_TIME_CAROUSEL_MIN_ENTRY_COUNT;
  const dots = leaderboardCarouselPosition.children;

  leaderboardCarouselPrevious.disabled = !allTimeCarouselVisible;
  leaderboardCarouselNext.disabled = allTimeCarouselVisible || !available;
  dots[0]?.classList.toggle("active", !allTimeCarouselVisible);
  dots[1]?.classList.toggle("active", allTimeCarouselVisible);
}

function scheduleAllTimeCarouselInterval() {
  window.clearTimeout(allTimeCarouselInterval);
  allTimeCarouselInterval = null;

  if (!allTimeCarouselEnabled) return;

  scoreScrollDirection = 1;
  scoreScrollHoldUntil = performance.now() + 900;
  scoreScrollLastTime = 0;
  scoreScrollPhase = "down";

  const scroller = scoreBoard.querySelector(".scoreBoardScroll");

  if (scroller) scroller.scrollTop = 0;
}

function beginDailyCarouselWait() {
  if (
    !allTimeCarouselEnabled ||
    allTimeCarouselVisible ||
    scoreScrollPhase === "waiting"
  ) {
    return;
  }

  scoreScrollPhase = "waiting";
  window.clearTimeout(allTimeCarouselInterval);
  allTimeCarouselInterval = window.setTimeout(
    showAllTimeCarousel,
    allTimeCarouselIntervalSeconds * 1000,
  );
}

function showAllTimeCarouselManually() {
  showAllTimeCarousel();
}

function showLiveLeaderboardManually() {
  hideAllTimeCarousel();
  scheduleAllTimeCarouselInterval();
}

function syncHighScoreCarouselControls() {
  highScoreCarouselEnabled.checked = allTimeCarouselEnabled;
  highScoreCarouselInterval.value = String(allTimeCarouselIntervalSeconds);
  highScoreCarouselDuration.value = String(allTimeCarouselDurationSeconds);
  highScoreCarouselDuration.max = String(
    Math.min(600, allTimeCarouselIntervalSeconds),
  );
  highScoreCarouselInterval.disabled = !allTimeCarouselEnabled;
  highScoreCarouselDuration.disabled = !allTimeCarouselEnabled;
}

function updateHighScoreCarouselSettings() {
  allTimeCarouselEnabled = highScoreCarouselEnabled.checked;
  allTimeCarouselIntervalSeconds = normalizeAllTimeCarouselInterval(
    highScoreCarouselInterval.value,
  );
  allTimeCarouselDurationSeconds = normalizeAllTimeCarouselDuration(
    highScoreCarouselDuration.value,
    allTimeCarouselIntervalSeconds,
  );
  syncHighScoreCarouselControls();
  saveTwoPlayerSettings();
  restartAllTimeCarouselCycle();
}

function restartAllTimeCarouselCycle() {
  hideAllTimeCarousel();
  scheduleAllTimeCarouselInterval();
  updateLeaderboardCarouselNavigation();
}

function renderScoreBoard() {
  dedupeActiveSessionScores();

  if (reconcileRecentRandomNameDuplicates()) {
    saveTodayLeaderboard();
    rebuildAllTimeLeaderboardFromDays();
    scoreBoardSignature = "";
  }

  const rankedScores = getRankedSessionScores();
  const liveLeaderId = getLiveLeaderId();
  updateLiveLeaderCanvas(liveLeaderId);
  updatePlayerRankDisplays();
  renderPlayerNameEntryPanels();
  const nextSignature = `${selectedGameName}|${getSelectedScoreSettingKey()}|${rankedScores
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
        getScoreValueLabelForEntry(entry),
        entry.interruptedBeforeStopScreen ? "sad" : "",
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
    Boolean(
      scoreBoard.querySelector(
        ".highScoreBox.demo, .highScoreBox.demoRemoving",
      ),
    );

  scoreBoardSignature = nextSignature;
  updateLeaderboardCarouselNavigation();

  if (allTimeCarouselVisible && !renderAllTimeCarouselBoard()) {
    hideAllTimeCarousel();
    scheduleAllTimeCarouselInterval();
  }

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
    const displayRank = getCompetitionRank(rankedScores, index);
    const box = createHighScoreBox(entry, index, displayRank);
    const belongsInFixedTop = index < 3;

    (belongsInFixedTop ? topScores : scrollScores).appendChild(box);
  });
}

function createHighScoreBox(entry, index, displayRank) {
  const box = document.createElement("div");
  const rank = document.createElement("div");
  const meta = document.createElement("div");
  const player = document.createElement("div");
  const score = document.createElement("strong");
  const podiumRank = getPodiumRank(entry, index);
  const allTimeRank = index < 3 ? getAllTimeRank(entry) : null;
  const settledEntry =
    !entry.active && !entry.nameEntry && !entry.demo && !entry.removingDemo;
  const settledRankBand = settledEntry && podiumRank === null;

  box.className = `highScoreBox highScoreBox-${entry.color}`;
  box.dataset.scoreId = String(entry.id);
  box.dataset.createdAt = String(getScoreEntryCreatedAt(entry));
  box.dataset.playerSide = getScoreEntryPlayerSide(entry);
  box.classList.toggle("finalized", !entry.active);
  box.classList.toggle("currentScore", Boolean(entry.active));
  box.classList.toggle("demo", Boolean(entry.demo));
  box.classList.toggle("demoRemoving", Boolean(entry.removingDemo));
  box.classList.toggle("nameEntry", Boolean(entry.nameEntry));
  box.classList.toggle("podium", podiumRank !== null);
  box.classList.toggle("podiumGold", podiumRank === 0);
  box.classList.toggle("podiumSilver", podiumRank === 1);
  box.classList.toggle("podiumBronze", podiumRank === 2);
  box.classList.toggle("rankBandTop10", settledRankBand && index < 10);
  box.classList.toggle(
    "rankBandTop20",
    settledRankBand && index >= 10 && index < 20,
  );
  box.classList.toggle(
    "interruptedBeforeStop",
    Boolean(entry.interruptedBeforeStopScreen),
  );

  rank.className = "highScoreRank";
  rank.textContent = getScoreRankLabel(displayRank, podiumRank);

  meta.className = "highScoreMeta";
  player.className = "highScorePlayer";
  player.textContent = getScoreEntryName(entry);
  if (settledEntry) {
    player.classList.add("editable");
    player.tabIndex = 0;
    player.title = "Click to edit name";
    player.setAttribute("role", "button");
    player.setAttribute("aria-label", `Edit name ${getScoreEntryName(entry)}`);
    player.onclick = (event) => {
      event.stopPropagation();
      startHighScoreNameEdit(entry, player);
    };
    player.onkeydown = (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;

      event.preventDefault();
      startHighScoreNameEdit(entry, player);
    };
  }
  meta.append(player);

  if (allTimeRank) {
    const allTime = document.createElement("span");

    allTime.className = "allTimeRank";
    allTime.textContent = `All time: #${allTimeRank}`;
    meta.appendChild(allTime);
  }

  score.className = "highScoreValue";
  score.textContent = formatScoreValue(entry);

  box.append(rank, meta, score);

  if (settledEntry) {
    const deleteButton = document.createElement("button");

    deleteButton.type = "button";
    deleteButton.className = "highScoreDeleteButton roundDeleteButton";
    deleteButton.textContent = "×";
    deleteButton.title = "Delete leaderboard entry";
    deleteButton.setAttribute(
      "aria-label",
      `Delete ${getScoreEntryName(entry)} score ${formatScore(entry.score)}`,
    );
    deleteButton.onclick = (event) => {
      event.stopPropagation();
      deleteLeaderboardEntryWithUndo(entry);
    };
    box.appendChild(deleteButton);
  }

  if (entry.interruptedBeforeStopScreen) {
    const marker = document.createElement("div");

    marker.className = "scoreInterruptedMarker";
    marker.textContent = ":(";
    marker.title = "Interrupted before Track until screen";
    box.appendChild(marker);
  }

  return box;
}

function startHighScoreNameEdit(entry, label) {
  if (!label?.isConnected) return;

  const input = document.createElement("input");
  const originalName = String(entry.name || entry.player || "").trim();
  let canceled = false;

  input.type = "text";
  input.className = "highScorePlayerInput";
  input.value = originalName.slice(0, MAX_INLINE_LEADERBOARD_NAME_LENGTH);
  input.maxLength = MAX_INLINE_LEADERBOARD_NAME_LENGTH;
  input.setAttribute("aria-label", "Leaderboard name");
  input.onclick = (event) => event.stopPropagation();
  input.onkeydown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      input.blur();
      return;
    }

    if (event.key !== "Escape") return;

    event.preventDefault();
    canceled = true;
    input.blur();
  };
  input.onblur = () => {
    if (!input.isConnected) return;

    const nextName = input.value
      .trim()
      .slice(0, MAX_INLINE_LEADERBOARD_NAME_LENGTH)
      .toUpperCase();

    if (canceled || nextName === originalName || !nextName) {
      input.replaceWith(label);
      return;
    }

    updateStoredLeaderboardEntryName(
      entry.date || getTodayDateKey(),
      entry,
      nextName,
    );
  };

  label.replaceWith(input);
  input.focus();
  input.select();
}

function deleteLeaderboardEntryWithUndo(entry) {
  const dateKey = entry.date || getTodayDateKey();

  pendingHighScoreUndo = {
    dateKey,
    entry: serializeScoreEntry(entry),
  };
  deleteStoredLeaderboardEntry(dateKey, entry);
  showHighScoreUndoToast(entry);
  scoreBoardSignature = "";
  renderScoreBoard();
  if (!daysModal.classList.contains("hidden")) renderDaysModal();
}

function showHighScoreUndoToast(entry) {
  const text = document.createElement("span");
  const undo = document.createElement("button");

  window.clearTimeout(highScoreUndoTimer);
  text.textContent = `${getScoreEntryName(entry)} — ${formatScoreValue(entry)} deleted`;
  undo.type = "button";
  undo.className = "button-primary";
  undo.textContent = "Undo";
  undo.onclick = restorePendingHighScoreEntry;
  highScoreUndoToast.replaceChildren(text, undo);
  highScoreUndoToast.hidden = false;
  highScoreUndoTimer = window.setTimeout(clearHighScoreUndoToast, 6500);
}

function clearHighScoreUndoToast() {
  window.clearTimeout(highScoreUndoTimer);
  highScoreUndoTimer = null;
  pendingHighScoreUndo = null;
  highScoreUndoToast.hidden = true;
  highScoreUndoToast.replaceChildren();
}

function restorePendingHighScoreEntry() {
  if (!pendingHighScoreUndo) return;

  const { dateKey, entry } = pendingHighScoreUndo;
  const key = getScoreEntryKey(entry);
  const stored = getLeaderboardEntriesForDay(dateKey);

  if (!stored.some((item) => getScoreEntryKey(item) === key)) {
    stored.push(entry);
    localStorage.setItem(
      getLeaderboardStorageKey(dateKey),
      JSON.stringify(stored),
    );
  }

  if (
    dateKey === getTodayDateKey() &&
    !sessionScores.some((item) => getScoreEntryKey(item) === key)
  ) {
    sessionScores.push({
      ...entry,
      active: false,
      demo: false,
      removingDemo: false,
    });
    sessionScoreId = Math.max(sessionScoreId, Number(entry.id) || 0);
  }

  rebuildAllTimeLeaderboardFromDays();
  clearHighScoreUndoToast();
  scoreBoardSignature = "";
  renderScoreBoard();
  if (!daysModal.classList.contains("hidden")) renderDaysModal();
}

function resetScoreBoardAutoScroll() {
  scoreScrollDirection = 1;
  scoreScrollHoldUntil = 0;
  scoreScrollLastTime = 0;
  scoreScrollPhase = "";
}

function updateScoreBoardAutoScroll() {
  const scroller = scoreBoard.querySelector(".scoreBoardScroll");
  const now = performance.now();

  if (allTimeCarouselVisible) return;

  if (!scroller || scroller.scrollHeight <= scroller.clientHeight + 1) {
    if (scoreScrollPhase === "down") beginDailyCarouselWait();
    return;
  }

  if (scoreScrollPhase === "waiting") return;

  if (scoreBoardPointerInside) {
    scoreScrollLastTime = now;
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
  const nextScroll =
    scroller.scrollTop + scoreScrollDirection * 34 * deltaSeconds;

  scroller.scrollTop = Math.max(0, Math.min(maxScroll, nextScroll));

  if (scoreScrollPhase === "down" && scroller.scrollTop >= maxScroll - 1) {
    scoreScrollPhase = "up";
    scoreScrollDirection = -1;
    scoreScrollHoldUntil = now + 900;
  } else if (scoreScrollPhase === "up" && scroller.scrollTop <= 0) {
    scroller.scrollTop = 0;
    beginDailyCarouselWait();
  }
}

function resetAllTimeCarouselAutoScroll() {
  allTimeScrollDirection = 1;
  allTimeScrollHoldUntil = 0;
  allTimeScrollLastTime = 0;
  allTimeScrollPhase = "";
}

function updateAllTimeCarouselAutoScroll() {
  const scroller = allTimeCarouselBoard.querySelector(".allTimeCarouselTable");
  const now = performance.now();

  if (!allTimeCarouselVisible || !scroller) {
    resetAllTimeCarouselAutoScroll();
    return;
  }

  if (scroller.scrollHeight <= scroller.clientHeight + 1) {
    beginAllTimeCarouselFinalWait();
    return;
  }

  if (allTimeScrollPhase === "waiting") return;

  if (allTimeBoardPointerInside) {
    allTimeScrollLastTime = now;
    return;
  }

  if (!allTimeScrollLastTime) {
    allTimeScrollLastTime = now;
    return;
  }

  const deltaSeconds = Math.min((now - allTimeScrollLastTime) / 1000, 0.05);
  const maxScroll = scroller.scrollHeight - scroller.clientHeight;

  allTimeScrollLastTime = now;
  if (now < allTimeScrollHoldUntil) return;

  scroller.scrollTop = Math.max(
    0,
    Math.min(
      maxScroll,
      scroller.scrollTop + allTimeScrollDirection * 30 * deltaSeconds,
    ),
  );

  if (allTimeScrollPhase === "down" && scroller.scrollTop >= maxScroll - 1) {
    allTimeScrollPhase = "up";
    allTimeScrollDirection = -1;
    allTimeScrollHoldUntil = now + 1000;
  } else if (allTimeScrollPhase === "up" && scroller.scrollTop <= 0) {
    scroller.scrollTop = 0;
    beginAllTimeCarouselFinalWait();
  }
}

function getRankedSessionScores() {
  const settingKey = getSelectedScoreSettingKey();

  return [...sessionScores]
    .filter((entry) => {
      return (
        (!selectedGameName ||
          isScoreEntryForSetting(entry, selectedGameName, settingKey)) &&
        (entry.active || isLeaderboardScore(entry) || entry.removingDemo)
      );
    })
    .sort(compareScoreEntries)
    .slice(0, MAX_VISIBLE_SCORES);
}

function getLiveLeaderId() {
  const settingKey = getSelectedScoreSettingKey();
  const active = sessionScores
    .filter((entry) => {
      return (
        entry.active &&
        isScoreEntryForSetting(entry, selectedGameName, settingKey) &&
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
  const settingKey = getSelectedScoreSettingKey();
  const rankedEntries = [...sessionScores]
    .filter((entry) => {
      return (
        isScoreEntryForSetting(entry, selectedGameName, settingKey) &&
        !entry.demo &&
        !entry.removingDemo &&
        (entry.active || isLeaderboardScore(entry))
      );
    })
    .sort(compareScoreEntries);

  players.forEach((player) => {
    const entry = sessionScores.find((item) => item.id === player.scoreEntryId);
    const score = entry?.score ?? player.currentScore ?? 0;

    if (!selectedGameName || !player.runActive) {
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

    const rankIndex = rankedEntries.findIndex((item) => item.id === entry?.id);
    const rank =
      rankIndex === -1 ? 0 : getCompetitionRank(rankedEntries, rankIndex);
    const allTimeRank = entry && rank > 0 ? getAllTimeRank(entry) : null;
    const direction = getRankChangeDirection(player, rank);

    player.currentRank.hidden = false;
    renderCurrentRankCard(
      player.currentRank,
      entry,
      rank,
      allTimeRank,
      direction,
    );
  });
}

function renderPlayerNameEntryPanels() {
  players.forEach((player) => {
    const entry = getPlayerNameEntry(player);
    const panel = player.nameEntryPanel;

    if (!panel) return;

    if (!entry || entry.nameEntry?.source === "module") {
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

function renderCurrentRankCard(
  container,
  entry,
  rank,
  allTimeRank,
  direction = "",
) {
  const podiumRank = rank >= 1 && rank <= 3 ? rank - 1 : null;
  const keepChange = !direction && container.classList.contains("rankChanged");
  const text = document.createElement("div");
  const today = document.createElement("strong");

  container.className = "currentRank";
  container.classList.toggle("podium", podiumRank !== null);
  container.classList.toggle("podiumGold", podiumRank === 0);
  container.classList.toggle("podiumSilver", podiumRank === 1);
  container.classList.toggle("podiumBronze", podiumRank === 2);
  container.classList.toggle("rankChanged", keepChange);

  text.className = "currentRankText";
  today.className = "currentRankToday";
  today.textContent = rank > 0 ? `Current Rank: #${rank}` : "Current Rank: ?";
  text.appendChild(today);

  if (allTimeRank) {
    const allTime = document.createElement("span");

    allTime.className = "currentRankAllTime";
    allTime.textContent = ` (All time: #${allTimeRank})`;
    text.appendChild(allTime);
  }

  container.replaceChildren(text);

  if (direction) {
    triggerRankChangeAnimation(container);
  }
}

function triggerRankChangeAnimation(container) {
  window.clearTimeout(container.rankAnimationTimer);
  container.classList.remove("rankChanged");
  void container.offsetWidth;
  container.classList.add("rankChanged");
  container.rankAnimationTimer = window.setTimeout(() => {
    container.classList.remove("rankChanged");
  }, 900);
}

function getPodiumRank(entry, index) {
  if (index > 2) return null;
  if (entry.demo || entry.removingDemo) return null;

  return index;
}

function getAllTimeRank(entry) {
  if (!entry || entry.demo || entry.removingDemo) return null;

  const settingKey = getScoreEntrySettingKey(entry);
  const current = serializeScoreEntry(entry);
  const currentKey = getScoreEntryKey(current);
  const byKey = new Map();
  const candidates = [
    ...getAllTimeLeaderboard(),
    ...sessionScores.filter((item) => {
      return (
        isScoreEntryForSetting(item, entry.game, settingKey) &&
        !item.demo &&
        !item.removingDemo &&
        isLeaderboardScore(item)
      );
    }),
  ];

  candidates.forEach((item) => {
    if (
      isScoreEntryForSetting(item, entry.game, settingKey) &&
      isLeaderboardScore(item)
    ) {
      byKey.set(getScoreEntryKey(item), serializeScoreEntry(item));
    }
  });
  byKey.set(currentKey, current);

  const rank = [...byKey.values()]
    .sort(compareScoreEntries)
    .findIndex((item) => getScoreEntryKey(item) === currentKey);

  return rank !== -1 && rank < 20 ? rank + 1 : null;
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

function getCompetitionRank(entries, index) {
  const entry = entries[index];

  if (!entry) return index + 1;

  return (
    entries.filter((item) => Number(item.score) > Number(entry.score)).length +
    1
  );
}

function getScoreRankLabel(displayRank, podiumRank) {
  return podiumRank === null ? `#${displayRank}` : "🏆";
}

function formatScore(score) {
  return Number(score).toLocaleString("en-US");
}

function formatScoreValue(entry) {
  const score = formatScore(entry.score);
  const label = getScoreValueLabelForEntry(entry);

  return label ? `${label} ${score}` : score;
}

function getScoreValueLabelForEntry(entry) {
  const entryKey = getScoreEntrySettingKey(entry);

  if (
    selectedGameName &&
    isScoreEntryForSetting(
      entry,
      selectedGameName,
      getSelectedScoreSettingKey(),
    )
  ) {
    return selectedScoreValueLabel;
  }

  const settingKey = entryKey || getDefaultHistorySettingKey(entry.game);
  const setting = getScoreSettingsForHistoryGame(entry.game).find((item) => {
    return item.key === settingKey;
  });

  return normalizeScoreValueLabel(setting?.valueLabel || entry.scoreValueLabel);
}

function appendScoreHint(text) {
  const empty = document.createElement("div");

  empty.className = "liveHint";
  empty.textContent = text;
  scoreBoard.appendChild(empty);
}

function openGameSettingsModal() {
  renderGameSettingsModal();
  gameSettingsModal.classList.remove("hidden");
}

function closeGameSettingsModalDialog() {
  gameSettingsModal.classList.add("hidden");
}

function openNamePoolModal() {
  renderNamePoolModal();
  namePoolModal.classList.remove("hidden");
  namePoolInput.focus();
}

function closeNamePoolModalDialog() {
  namePoolModal.classList.add("hidden");
}

function openInfoModalDialog() {
  infoModal.classList.remove("hidden");
}

function closeInfoModalDialog() {
  infoModal.classList.add("hidden");
}

function renderNamePoolModal() {
  namePoolList.replaceChildren();
  updateDeleteSelectedNamePoolButton();

  if (randomPlayerNames.length === 0) {
    const empty = document.createElement("div");

    empty.className = "namePoolEmpty";
    empty.textContent = "No names yet.";
    namePoolList.appendChild(empty);
    return;
  }

  randomPlayerNames.forEach((name, index) => {
    const row = document.createElement("div");
    const number = document.createElement("span");
    const input = document.createElement("input");
    const del = document.createElement("button");

    row.className = "namePoolRow";
    row.dataset.nameIndex = String(index);
    row.tabIndex = 0;
    row.draggable = true;
    row.setAttribute("role", "checkbox");
    row.setAttribute("aria-checked", "false");
    row.setAttribute("aria-label", `Select name ${name}`);
    number.className = "namePoolNumber";
    number.textContent = `#${index + 1}`;
    input.type = "text";
    input.maxLength = MAX_SCORE_NAME_LENGTH;
    input.value = name;
    input.onchange = () => {
      updateNamePoolEntry(index, input.value);
    };
    del.type = "button";
    del.className = "namePoolDeleteButton roundDeleteButton";
    del.textContent = "×";
    del.title = "Delete name";
    del.setAttribute("aria-label", `Delete ${name}`);
    del.onclick = () => {
      randomPlayerNames.splice(index, 1);
      setStoredRandomPlayerNames(randomPlayerNames);
      renderNamePoolModal();
    };

    row.onpointerdown = (event) =>
      startWindowsRowSelection(
        event,
        row,
        namePoolList,
        ".namePoolRow",
        namePoolSelectionState,
        setNamePoolRowSelected,
        true,
      );
    row.onpointerenter = (event) => {
      continueWindowsRowSelection(
        event,
        row,
        namePoolList,
        ".namePoolRow",
        namePoolSelectionState,
        setNamePoolRowSelected,
      );
    };
    row.onkeydown = (event) => {
      if (event.key !== " " && event.key !== "Enter") return;

      event.preventDefault();
      setNamePoolRowSelected(row, !row.classList.contains("selected"));
    };
    row.ondragstart = (event) => {
      if (!row.classList.contains("selected")) {
        clearNamePoolSelection();
        setNamePoolRowSelected(row, true);
      }

      namePoolSelectionState.pendingSingle = null;
      namePoolSelectionState.pendingDeselect = false;
      namePoolSelectionState.nativeDragging = true;
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData(
        "application/x-ocr-helper-name-selection",
        "selected-player-names",
      );
      setSelectionDragGhost(
        event.dataTransfer,
        namePoolList.querySelectorAll(".namePoolRow.selected").length,
        "name",
      );
      setNamePoolDeleteDropMode(true);
    };
    row.ondragend = () => {
      namePoolSelectionState.nativeDragging = false;
      setNamePoolDeleteDropMode(false);
    };

    row.append(number, input, del);
    namePoolList.appendChild(row);
  });
}

function setNamePoolRowSelected(row, selected) {
  row.classList.toggle("selected", selected);
  row.setAttribute("aria-checked", String(selected));
  updateDeleteSelectedNamePoolButton();
}

function updateDeleteSelectedNamePoolButton() {
  if (!deleteSelectedNamesButton) return;

  const hasSelection = Boolean(
    namePoolList.querySelector(".namePoolRow.selected"),
  );

  deleteSelectedNamesButton.disabled = !hasSelection;
  deleteSelectedNamesButton.classList.toggle("visible", hasSelection);
}

function setNamePoolDeleteDropMode(active) {
  if (!deleteSelectedNamesButton) return;

  deleteSelectedNamesButton.classList.toggle("dropReady", active);
  deleteSelectedNamesButton.textContent = active
    ? "Drop here to delete"
    : "Delete selected";
}

function setSelectionDragGhost(dataTransfer, count, itemLabel) {
  const ghost = document.createElement("div");
  const label = count === 1 ? itemLabel : `${itemLabel}s`;

  ghost.className = "selectionDragGhost";
  ghost.textContent = `${count} selected ${label}`;
  document.body.appendChild(ghost);
  dataTransfer.setDragImage(
    ghost,
    ghost.offsetWidth / 2,
    ghost.offsetHeight / 2,
  );
  window.setTimeout(() => ghost.remove(), 0);
}

function deleteSelectedNamePoolEntries() {
  const indexes = [...namePoolList.querySelectorAll(".namePoolRow.selected")]
    .map((row) => Number(row.dataset.nameIndex))
    .filter((index) => Number.isInteger(index));

  if (indexes.length === 0) return;

  const selected = new Set(indexes);
  setStoredRandomPlayerNames(
    randomPlayerNames.filter((name, index) => !selected.has(index)),
  );
  setNamePoolDeleteDropMode(false);
  renderNamePoolModal();
}

function addNamePoolEntry() {
  const name = normalizeRandomPlayerName(namePoolInput.value);

  if (!name) return;

  const names = normalizeRandomPlayerNames([...randomPlayerNames, name]);

  setStoredRandomPlayerNames(names);
  namePoolInput.value = "";
  renderNamePoolModal();
}

function exportNamePoolData() {
  const data = {
    exportedAt: new Date().toISOString(),
    names: randomPlayerNames,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = "player-names.json";
  link.click();
  URL.revokeObjectURL(link.href);
}

async function importNamePoolDataFile(file) {
  if (!file) return;

  try {
    const data = JSON.parse(await file.text());
    const names = Array.isArray(data) ? data : data.names;
    const normalized = normalizeRandomPlayerNames(names);

    if (normalized.length === 0) {
      throw new Error("The file does not contain any usable names.");
    }

    setStoredRandomPlayerNames(normalized);
    renderNamePoolModal();
  } catch (error) {
    showAlert(`Could not import player names.\n${error.message}`);
  }
}

function updateNamePoolEntry(index, value) {
  const name = normalizeRandomPlayerName(value);

  if (!name) {
    renderNamePoolModal();
    return;
  }

  const nextNames = randomPlayerNames.slice();

  nextNames[index] = name;
  setStoredRandomPlayerNames(nextNames);
  renderNamePoolModal();
}

function setUseNamePoolForRuns(value) {
  useNamePoolForRuns = Boolean(value);
  persistedSettings.useNamePoolForRuns = useNamePoolForRuns;

  useNamePoolForRunsToggles.forEach((toggle) => {
    toggle.checked = useNamePoolForRuns;
  });

  resetScoringRuns();
  saveTwoPlayerSettings();
}

function renderGameSettingsModal() {
  gameSettingsModalContent.replaceChildren();
  renderGameSettingsFastOCRToggle();

  if (gameSettingsTitle) {
    gameSettingsTitle.textContent = selectedGameName
      ? `Game Settings (${selectedGameName})`
      : "Game Settings";
  }

  if (!selectedGameName || !selectedGame) {
    const empty = document.createElement("div");

    empty.className = "dayHistoryEmpty";
    empty.textContent = "Choose a game first.";
    gameSettingsModalContent.appendChild(empty);
    return;
  }

  ensureGameScoreSettings();
  normalizeGameModuleAccordionOpenStates();

  const toolbar = document.createElement("div");
  const importButton = document.createElement("button");
  const exportButton = document.createElement("button");
  const fileInput = document.createElement("input");
  const list = document.createElement("div");

  toolbar.className = "gameSettingsToolbar";
  importButton.textContent = "Import Settings";
  exportButton.textContent = "Export Settings";
  importButton.className = "button-black";
  exportButton.className = "button-black";
  fileInput.type = "file";
  fileInput.accept = ".json,application/json";
  fileInput.hidden = true;
  fileInput.onchange = async () => {
    await importGameScoreSettingsFile(fileInput.files?.[0]);
    fileInput.value = "";
  };

  importButton.onclick = () => fileInput.click();
  exportButton.onclick = exportGameScoreSettings;

  toolbar.append(importButton, exportButton, fileInput);
  gameSettingsModalContent.appendChild(toolbar);
  gameSettingsModalContent.appendChild(createGlobalDemoDetectorSettings());
  gameSettingsModalContent.appendChild(createGameSettingsSectionHeader());

  list.className = "gameSettingsList";
  createScreenSettingsSections(getGameScoreSettingsRecord().items).forEach(
    (section) => {
      list.appendChild(section);
    },
  );
  gameSettingsModalContent.appendChild(list);
}

function createGameSettingsSectionHeader() {
  const header = document.createElement("div");
  const title = document.createElement("h3");
  const addButton = document.createElement("button");
  const addDisabled = getAvailableScoreSettingCombos().length === 0;

  header.className = "gameSettingsSectionHeader";
  title.textContent = "Screen → Metric Settings";
  addButton.type = "button";
  addButton.className = "addActionButton";
  addButton.textContent = "+";
  addButton.dataset.addIcon = "+";
  addButton.ariaLabel = "Add setting";
  addButton.disabled = addDisabled;
  addButton.onclick = addGameScoreSetting;

  header.append(title, addButton);
  return header;
}

function addGameScoreSetting() {
  const record = getGameScoreSettingsRecord();
  const setting = createAvailableScoreSetting();

  if (!setting) {
    showAlert("All screen and metric combinations are already configured.");
    return;
  }

  record.items.push(setting);
  record.selectedId = setting.id;
  selectedScoreSettingId = setting.id;
  applySelectedScoreSetting();
  syncScoreSettingsAfterEdit({ resetRuns: true });
  renderGameSettingsModal();
}

function createGlobalDemoDetectorSettings() {
  const section = document.createElement("section");
  const title = document.createElement("h3");
  const globalArea = createDemoDetectorArea({
    title: "Global",
    config: selectedGame.demoDetector,
    screenName: null,
    metricNames: getMetricNamesForGame(selectedGame),
    onCreate: () => {
      selectedGame.demoDetector = createEmptyDemoDetectorConfig();
      persistSelectedGameData();
      renderGameSettingsModal();
    },
    onChange: (config) => {
      selectedGame.demoDetector = normalizeDemoDetectorConfig(
        config,
        null,
        selectedGame,
      );
      persistSelectedGameData();
    },
    onRemove: () => {
      selectedGame.demoDetector = {};
      persistSelectedGameData();
      renderGameSettingsModal();
    },
  });

  section.className = "gameDemoDetectorSettings";
  title.textContent = "Global Demo Detector";

  section.append(title, globalArea);
  return section;
}

function createScreenSettingsSections(settings) {
  const grouped = new Map();

  settings.forEach((setting) => {
    const screenName = setting.screen || "Unnamed screen";

    if (!grouped.has(screenName)) grouped.set(screenName, []);
    grouped.get(screenName).push(setting);
  });

  return [...grouped.entries()].map(([screenName, screenSettings]) => {
    return createScreenSettingsSection(screenName, screenSettings);
  });
}

function createScreenSettingsSection(screenName, settings) {
  const section = document.createElement("section");
  const header = document.createElement("div");
  const title = document.createElement("h3");
  const screenSettingsList = document.createElement("div");
  const screen = (selectedGame.screens || []).find((candidate) => {
    return candidate.name === screenName;
  });

  section.className = "screenSettingsSection";
  header.className = "screenSettingsSectionHeader";
  title.textContent = screenName || "Unnamed screen";
  screenSettingsList.className = "screenSettingsList";

  settings.forEach((setting) => {
    screenSettingsList.appendChild(createGameSettingBlock(setting));
  });

  header.appendChild(title);
  section.appendChild(header);

  if (screen) {
    section.appendChild(
      createDemoDetectorArea({
        title: "Screen demo detector",
        config: screen.demoDetector,
        screenName: screen.name,
        metricNames: getMetricNamesForScreen(screen.name),
        onCreate: () => {
          screen.demoDetector = createEmptyDemoDetectorConfig();
          persistSelectedGameData();
          renderGameSettingsModal();
        },
        onChange: (config) => {
          screen.demoDetector = normalizeDemoDetectorConfig(
            config,
            screen.name,
            selectedGame,
          );
          persistSelectedGameData();
        },
        onRemove: () => {
          screen.demoDetector = {};
          persistSelectedGameData();
          renderGameSettingsModal();
        },
      }),
    );
  }

  section.appendChild(screenSettingsList);
  return section;
}

function persistSelectedGameData() {
  if (!selectedGameName || !selectedGame) return;

  savedGames[selectedGameName] = selectedGame;
  setSavedGames(savedGames);
}

function getMetricNamesForGame(gameData) {
  return [
    ...new Set(
      (gameData?.screens || []).flatMap((screen) => {
        return getMetricNamesForGameScreen(gameData, screen.name);
      }),
    ),
  ];
}

function createEmptyDemoDetectorConfig(metric = "") {
  return {
    created: true,
    enabled: true,
    sequence: "",
    startValue: "",
    metric,
  };
}

function renderGameSettingsFastOCRToggle() {
  if (!gameSettingsFastOCR) return;

  gameSettingsFastOCR.replaceChildren();

  if (!selectedGameName || !selectedGame) {
    gameSettingsFastOCR.hidden = true;
    return;
  }

  const input = document.createElement("input");
  const slider = document.createElement("span");
  const text = document.createTextNode("Fast OCR");

  gameSettingsFastOCR.hidden = false;
  input.type = "checkbox";
  input.checked = getGameScoreSettingsRecord().fastOCR !== false;
  input.onchange = () => {
    getGameScoreSettingsRecord().fastOCR = input.checked;
    applySelectedScoreSetting();
    saveTwoPlayerSettings();
  };
  slider.className = "slider";
  gameSettingsFastOCR.append(input, slider, text);
}

function createGameSettingBlock(setting) {
  const block = document.createElement("details");
  const summary = document.createElement("summary");
  const title = document.createElement("strong");
  const del = createGameSettingDeleteButton(setting);
  const content = document.createElement("div");
  const contentTools = document.createElement("div");
  const addModule = document.createElement("div");

  block.className = "gameSettingBlock";
  block.classList.toggle("selected", setting.id === selectedScoreSettingId);
  block.open = setting.id === selectedScoreSettingId;
  summary.className = "gameSettingSummary";
  title.textContent = getScoreSettingLabel(setting);
  contentTools.className = "gameSettingContentTools";
  addModule.className = "gameModuleAddCell";
  addModule.dataset.settingId = setting.id;
  addModule.onclick = (event) => {
    event.stopPropagation();
  };
  renderAddModuleButton(addModule, setting);
  content.className = "gameSettingAccordionContent";
  contentTools.appendChild(addModule);
  content.appendChild(contentTools);
  content.appendChild(createGameScoreSettingRow(setting));
  createGameModuleSettingsRows(setting).forEach((row) => {
    content.appendChild(row);
  });
  summary.append(title, del);
  block.append(summary, content);

  return block;
}

function createGameSettingDeleteButton(setting) {
  const del = document.createElement("button");

  del.textContent = "×";
  del.className = "gameSettingsDeleteButton roundDeleteButton";
  del.title = "Delete setting";
  del.onclick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const record = getGameScoreSettingsRecord();

    if (record.items.length <= 1) {
      showAlert("At least one game setting is required.");
      return;
    }

    showConfirm(
      `Delete game setting "${getScoreSettingLabel(setting)}"?`,
      () => {
        record.items = record.items.filter((item) => item.id !== setting.id);
        if (record.selectedId === setting.id) {
          record.selectedId = record.items[0]?.id || "";
        }
        selectedScoreSettingId = record.selectedId;
        applySelectedScoreSetting();
        syncScoreSettingsAfterEdit({ resetRuns: true });
        renderGameSettingsModal();
      },
      null,
      "Delete",
      "Cancel",
    );
  };

  return del;
}

function createGameScoreSettingRow(setting) {
  const container = document.createElement("div");
  const firstLine = document.createElement("div");
  const optionsLine = document.createElement("div");
  const trackLine = document.createElement("div");
  const fireworksLine = document.createElement("div");
  const screen = document.createElement("select");
  const metric = document.createElement("select");
  const valueLabel = document.createElement("input");
  const labelExample = document.createElement("div");
  const minScore = document.createElement("input");
  const stopScreen = createScreenMultiSelectDropdown({
    values: setting.stopScreens ?? setting.stopScreen,
    emptyText: "No stop screen",
    onChange: (values) => {
      setting.stopScreens = normalizeScoreStopScreens(values);
      setting.stopScreen = setting.stopScreens[0] || "";
      syncScoreSettingsAfterEdit({ resetRuns: true });
    },
  });
  const fireworkScreens = createScreenMultiSelectDropdown({
    values: setting.fireworkScreens,
    emptyText: "No fireworks",
    onChange: (values) => {
      setting.fireworkScreens = normalizeScoreFireworkScreens(values);
      syncScoreSettingsAfterEdit();
    },
  });

  container.className = "gameSettingForm";

  populateScreenOptions(screen, setting.screen, setting.id);
  screen.onchange = () => {
    const nextMetric = getFirstAvailableMetricForScreen(
      screen.value,
      setting.id,
    );
    const comboChanged =
      setting.screen !== screen.value || setting.metric !== nextMetric;

    setting.screen = screen.value;
    setting.metric = nextMetric;
    setting.name = getScoreSettingLabel(setting);
    setting.stopScreens = normalizeScoreStopScreens(
      setting.stopScreens ?? setting.stopScreen,
    );
    setting.stopScreen = setting.stopScreens[0] || "";
    setting.fireworkScreens = normalizeScoreFireworkScreens(
      setting.fireworkScreens,
    );
    setting.demoMetric = normalizeScoreDemoMetric(
      setting.demoMetric,
      setting.screen,
    );
    setting.demoStartValue = normalizeScoreDemoStartValue(
      setting.demoStartValue,
      setting.demoSequence,
    );
    setting.moduleConfig = normalizeSettingModuleConfig(setting);
    syncScoreSettingsAfterEdit({ resetRuns: comboChanged });
    renderGameSettingsModal();
  };

  populateMetricOptions(metric, setting.screen, setting.metric, setting.id);
  metric.onchange = () => {
    const comboChanged = setting.metric !== metric.value;

    setting.metric = metric.value;
    setting.name = getScoreSettingLabel(setting);
    setting.moduleConfig = normalizeSettingModuleConfig(setting);
    syncScoreSettingsAfterEdit({ resetRuns: comboChanged });
    renderGameSettingsModal();
  };

  valueLabel.type = "text";
  valueLabel.maxLength = 24;
  valueLabel.value = normalizeScoreValueLabel(setting.valueLabel);
  valueLabel.placeholder = "";
  valueLabel.oninput = () => {
    updateMetricLabelExample(labelExample, setting.metric, valueLabel.value);
  };
  valueLabel.onchange = () => {
    setting.valueLabel = normalizeScoreValueLabel(valueLabel.value);
    valueLabel.value = setting.valueLabel;
    updateMetricLabelExample(labelExample, setting.metric, setting.valueLabel);
    syncScoreSettingsAfterEdit();
  };
  updateMetricLabelExample(labelExample, setting.metric, setting.valueLabel);

  minScore.type = "number";
  minScore.min = "0";
  minScore.step = "1";
  minScore.value = String(normalizeScoreMinScore(setting.minScore));
  minScore.onchange = () => {
    setting.minScore = normalizeScoreMinScore(minScore.value);
    minScore.value = String(setting.minScore);
    syncScoreSettingsAfterEdit();
  };

  firstLine.className = "gameSettingFormGrid threeColumns";
  firstLine.append(
    createSettingField("Screen", screen),
    createSettingField("Metric", metric),
    createSettingField("Label (LVL)", valueLabel),
  );
  firstLine.appendChild(labelExample);

  optionsLine.className = "gameSettingFormGrid optionalRows";
  optionsLine.append(createSettingField("Min Leaderboard", minScore));
  trackLine.className = "gameSettingFormGrid singleControlRow";
  trackLine.append(createSettingField("Track until", stopScreen));
  fireworksLine.className = "gameSettingFormGrid singleControlRow";
  fireworksLine.append(createSettingField("Fireworks", fireworkScreens));

  const demoArea = createDemoDetectorArea({
    title: "Demo detector",
    config: getSettingDemoDetectorConfig(setting),
    screenName: setting.screen,
    metricNames: getMetricNamesForScreen(setting.screen),
    onCreate: () => {
      setSettingDemoDetectorConfig(setting, createEmptyDemoDetectorConfig());
      syncScoreSettingsAfterEdit();
      renderGameSettingsModal();
    },
    onChange: (config) => {
      setSettingDemoDetectorConfig(setting, config);
      syncScoreSettingsAfterEdit();
    },
    onRemove: () => {
      clearSettingDemoDetectorConfig(setting);
      syncScoreSettingsAfterEdit();
      renderGameSettingsModal();
    },
  });

  container.append(firstLine, optionsLine, trackLine, fireworksLine, demoArea);
  return container;
}

function createSettingField(labelText, control, detail = null) {
  const label = document.createElement("div");
  const text = document.createElement("span");

  label.className = "gameSettingField";
  text.textContent = labelText;
  label.append(text, control);

  if (detail) {
    label.appendChild(detail);
  }

  return label;
}

function updateMetricLabelExample(node, metricName, labelValue) {
  const label = normalizeScoreValueLabel(labelValue);

  node.className = "gameSettingFieldHint";
  node.hidden = !label;
  node.textContent = label ? `Example: ${label} 12` : "";
}

function createDemoDetectorArea({
  title,
  config,
  screenName = null,
  metricNames,
  onCreate,
  onChange,
  onRemove,
}) {
  const area = document.createElement("div");
  const addButton = document.createElement("button");
  const normalized = normalizeDemoDetectorConfig(config, screenName);
  const hasDetector = isDemoDetectorConfigPresent(normalized);

  area.className = "demoDetectorArea";
  addButton.type = "button";
  addButton.className = "button-primary demoDetectorCreateButton";
  addButton.textContent = "+ Demo detector";
  addButton.dataset.addIcon = "+";
  addButton.ariaLabel = `Add ${title} demo detector`;
  addButton.onclick = onCreate;

  if (!hasDetector) {
    area.classList.add("empty");
    area.appendChild(addButton);
    return area;
  }

  area.appendChild(
    createDemoDetectorEditor({
      config: normalized,
      metricNames,
      onChange,
      onRemove,
    }),
  );

  return area;
}

function isDemoDetectorConfigPresent(config) {
  return Boolean(
    config?.created ||
    (config?.metric &&
      (config?.mode === "held" ? config?.heldValue : config?.sequence)),
  );
}

function createDemoDetectorEditor({ config, metricNames, onChange, onRemove }) {
  const block = document.createElement("div");
  const fields = document.createElement("div");
  const divider = document.createElement("hr");
  const remove = document.createElement("button");
  const sequence = document.createElement("input");
  const startValue = document.createElement("select");
  const metric = document.createElement("select");
  const mode = document.createElement("select");
  const heldValue = document.createElement("input");
  const holdMs = document.createElement("input");
  const confirmOnExit = document.createElement("select");
  const stopScreens = createScreenMultiSelectDropdown({
    values: config.stopScreens,
    emptyText: "No stop screen",
    onChange: (values) => {
      current.stopScreens = normalizeScoreStopScreens(values);
      onChange(current);
      updateDemoDetectorValidation(
        block,
        current,
        sequence,
        metric,
        stopScreens,
      );
    },
  });
  let current = {
    created: true,
    enabled: true,
    metric: config.metric || "",
    sequence: normalizeScoreDemoSequenceInput(config.sequence),
    startValue: normalizeScoreDemoStartValue(
      config.startValue,
      config.sequence,
    ),
    stopScreens: normalizeScoreStopScreens(config.stopScreens),
    mode: config.mode === "held" ? "held" : "sequence",
    heldValue: String(config.heldValue ?? ""),
    holdMs: Number.isFinite(Number(config.holdMs))
      ? Math.max(0, Number(config.holdMs))
      : 2000,
    confirmOnScreenExit: config.confirmOnScreenExit !== false,
  };

  block.className = "demoDetectorBlock";
  fields.className = "gameSettingFormGrid demoDetectorGrid";
  divider.className = "demoDetectorDivider";
  [
    ["sequence", "Sequence"],
    ["held", "Held value"],
  ].forEach(([value, label]) => {
    const option = document.createElement("option");

    option.value = value;
    option.textContent = label;
    mode.appendChild(option);
  });
  mode.value = current.mode;
  mode.onchange = () => {
    current.mode = mode.value;
    onChange(current);
    renderGameSettingsModal();
  };
  sequence.type = "text";
  sequence.placeholder = "";
  sequence.value = current.sequence;
  sequence.onchange = () => {
    current.sequence = normalizeScoreDemoSequenceInput(sequence.value);
    current.startValue = normalizeScoreDemoStartValue(
      current.startValue,
      current.sequence,
    );
    onChange(current);
    renderGameSettingsModal();
  };

  populateDemoStartValueOptionsFromSequence(
    startValue,
    current.sequence,
    current.startValue,
  );
  startValue.onchange = () => {
    current.startValue = normalizeScoreDemoStartValue(
      startValue.value,
      current.sequence,
    );
    onChange(current);
  };

  populateDemoMetricOptionsFromNames(metric, metricNames, current.metric);
  metric.onchange = () => {
    current.metric = metric.value;
    onChange(current);
    updateDemoDetectorValidation(block, current, sequence, metric, stopScreens);
  };
  heldValue.type = "text";
  heldValue.inputMode = "numeric";
  heldValue.value = current.heldValue;
  heldValue.onchange = () => {
    current.heldValue = heldValue.value.trim();
    onChange(current);
    renderGameSettingsModal();
  };
  holdMs.type = "number";
  holdMs.min = "0";
  holdMs.step = "100";
  holdMs.value = String(current.holdMs);
  holdMs.onchange = () => {
    current.holdMs = Math.max(0, Math.round(Number(holdMs.value) || 0));
    onChange(current);
  };
  [
    ["true", "Yes"],
    ["false", "No"],
  ].forEach(([value, label]) => {
    const option = document.createElement("option");

    option.value = value;
    option.textContent = label;
    confirmOnExit.appendChild(option);
  });
  confirmOnExit.value = String(current.confirmOnScreenExit);
  confirmOnExit.onchange = () => {
    current.confirmOnScreenExit = confirmOnExit.value === "true";
    onChange(current);
  };

  remove.type = "button";
  remove.className =
    "gameSettingsDeleteButton demoDetectorRemove roundDeleteButton";
  remove.textContent = "×";
  remove.title = "Remove demo detector";
  remove.onclick = () => {
    if (!hasDemoDetectorDraftValues(current)) {
      onRemove();
      return;
    }

    showConfirm(
      "Delete this demo detector?",
      onRemove,
      null,
      "Delete",
      "Cancel",
    );
  };

  const modeField = createSettingField("Detector mode", mode);
  modeField.classList.add("demoDetectorModeField");
  fields.append(modeField, divider);
  if (current.mode === "held") {
    fields.append(
      createSettingField("Metric", metric),
      createSettingField("Held value", heldValue),
      createSettingField("Hold duration (ms)", holdMs),
      createSettingField("Confirm on screen exit", confirmOnExit),
      createSettingField("Track until", stopScreens),
    );
  } else {
    fields.append(
      createSettingField("Demo detector (0, 1, 6, 14, 17)", sequence),
      createSettingField('Label as "Demo" starting at value', startValue),
      createSettingField("Metric", metric),
      createSettingField("Track until", stopScreens),
    );
  }
  block.append(fields, remove);
  updateDemoDetectorValidation(block, current, sequence, metric, stopScreens);
  return block;
}

function updateDemoDetectorValidation(
  block,
  config,
  sequence,
  metric,
  stopScreens,
) {
  const heldMode = config.mode === "held";
  const sequenceMissing =
    !heldMode && parseScoreDemoSequence(config.sequence).length === 0;
  const metricMissing = !String(config.metric || "").trim();
  const heldValueMissing = heldMode && !String(config.heldValue ?? "").trim();

  block.classList.toggle(
    "incomplete",
    sequenceMissing || metricMissing || heldValueMissing,
  );
  sequence.classList.toggle("invalid", sequenceMissing);
  metric.classList.toggle("invalid", metricMissing);
  stopScreens.classList.remove("invalid");
}

function getSettingDemoDetectorConfig(setting) {
  return {
    created: setting.demoDetectorCreated === true,
    enabled:
      setting.demoDetectorCreated === true ||
      Boolean(
        setting.demoMetric &&
        (setting.demoMode === "held"
          ? setting.demoHeldValue
          : setting.demoSequence),
      ),
    metric: setting.demoMetric || "",
    sequence: setting.demoSequence || "",
    startValue: setting.demoStartValue || "",
    stopScreens: setting.demoStopScreens || [],
    mode: setting.demoMode || "sequence",
    heldValue: setting.demoHeldValue || "",
    holdMs: setting.demoHoldMs ?? 2000,
    confirmOnScreenExit: setting.demoConfirmOnScreenExit !== false,
  };
}

function setSettingDemoDetectorConfig(setting, config) {
  setting.demoDetectorCreated =
    config.created === true || config.enabled === true;
  setting.demoDetectorEnabled =
    setting.demoDetectorCreated ||
    Boolean(
      config.metric &&
      (config.mode === "held" ? config.heldValue : config.sequence),
    );
  setting.demoMetric = config.metric || "";
  setting.demoSequence = normalizeScoreDemoSequenceInput(config.sequence);
  setting.demoStartValue = normalizeScoreDemoStartValue(
    config.startValue,
    setting.demoSequence,
  );
  setting.demoStopScreens = normalizeScoreStopScreens(config.stopScreens);
  setting.demoMode = config.mode === "held" ? "held" : "sequence";
  setting.demoHeldValue = String(config.heldValue ?? "").trim();
  setting.demoHoldMs = Number.isFinite(Number(config.holdMs))
    ? Math.max(0, Math.round(Number(config.holdMs)))
    : 2000;
  setting.demoConfirmOnScreenExit = config.confirmOnScreenExit !== false;
}

function clearSettingDemoDetectorConfig(setting) {
  setting.demoDetectorCreated = false;
  setting.demoDetectorEnabled = false;
  setting.demoMetric = "";
  setting.demoSequence = "";
  setting.demoStartValue = "";
  setting.demoStopScreens = [];
  setting.demoMode = "sequence";
  setting.demoHeldValue = "";
  setting.demoHoldMs = 2000;
  setting.demoConfirmOnScreenExit = true;
}

function createScreenMultiSelectDropdown({ values, emptyText, onChange }) {
  const root = document.createElement("div");
  const button = document.createElement("button");
  const menu = document.createElement("div");
  let selected = normalizeScoreStopScreens(values);

  root.className = "multiSelectDropdown";
  button.type = "button";
  button.className = "multiSelectDropdownButton";
  menu.className = "multiSelectDropdownMenu";
  menu.hidden = true;

  function updateButton() {
    button.textContent =
      selected.length > 1 ? "[Multi]" : selected[0] || emptyText;
    button.title = selected.length ? selected.join(", ") : emptyText;
  }

  function emitChange() {
    onChange(selected.slice());
    updateButton();
  }

  (selectedGame?.screens || []).forEach((screen) => {
    const screenName = screen.name || "";
    const option = document.createElement("button");

    option.type = "button";
    option.className = "multiSelectDropdownOption";
    option.classList.toggle("selected", selected.includes(screenName));
    option.textContent = screenName || "Unnamed screen";
    option.onclick = () => {
      selected = selected.includes(screenName)
        ? selected.filter((value) => value !== screenName)
        : [...selected, screenName];
      selected = normalizeScoreStopScreens(selected);
      option.classList.toggle("selected", selected.includes(screenName));
      emitChange();
    };
    menu.appendChild(option);
  });

  button.onclick = () => {
    menu.hidden = !menu.hidden;
  };

  root.addEventListener("focusout", (event) => {
    if (root.contains(event.relatedTarget)) return;

    menu.hidden = true;
  });

  updateButton();
  root.append(button, menu);
  return root;
}

function createGameModuleSettingsRows(setting) {
  return getAttachedModulesForSetting(setting)
    .filter(
      (module) =>
        Array.isArray(module.configFields) && module.configFields.length > 0,
    )
    .map((module) => createGameModuleSettingsRow(setting, module));
}

function normalizeGameModuleAccordionOpenStates() {
  const keys = getCurrentGameModuleAccordionKeys();
  let openKey = keys.find((key) => gameModuleAccordionOpenStates.get(key));

  if (!openKey && keys.length > 0) {
    openKey = keys[0];
  }

  keys.forEach((key) => {
    gameModuleAccordionOpenStates.set(key, key === openKey);
  });
}

function getCurrentGameModuleAccordionKeys() {
  if (!selectedGameName || !selectedGame) return [];

  return getGameScoreSettingsRecord().items.flatMap((setting) => {
    return getAttachedModulesForSetting(setting)
      .filter((module) => {
        return (
          Array.isArray(module.configFields) && module.configFields.length > 0
        );
      })
      .map((module) => getGameModuleAccordionKey(setting, module));
  });
}

function setOpenGameModuleAccordion(accordionKey, open) {
  if (open) {
    getCurrentGameModuleAccordionKeys().forEach((key) => {
      gameModuleAccordionOpenStates.set(key, key === accordionKey);
    });
    return;
  }

  gameModuleAccordionOpenStates.set(accordionKey, false);
}

function renderAddModuleButton(container, setting) {
  const modules = getAvailableModulesForSetting(setting);
  const button = document.createElement("button");

  container.replaceChildren();
  button.type = "button";
  button.className = "addModuleButton tooltipButton";
  button.textContent = "+";
  button.dataset.tooltip = modules.length
    ? "Add module"
    : "No matching modules available";
  button.setAttribute("aria-label", button.dataset.tooltip);
  button.disabled = modules.length === 0;
  button.onclick = () => {
    renderAddModuleMenu(container, setting, modules);
  };
  container.appendChild(button);
}

function closeOpenAddModuleMenus(target) {
  const openCells = [
    ...gameSettingsModalContent.querySelectorAll(".gameModuleAddCell"),
  ].filter((cell) => cell.querySelector(".addModuleMenu"));

  openCells.forEach((cell) => {
    if (cell.contains(target)) return;

    const setting = getGameScoreSettingsRecord().items.find((item) => {
      return item.id === cell.dataset.settingId;
    });

    if (setting) {
      renderAddModuleButton(cell, setting);
    } else {
      cell.replaceChildren();
    }
  });
}

function renderAddModuleMenu(container, setting, modules) {
  const button = document.createElement("button");
  const menu = document.createElement("div");

  container.replaceChildren();
  button.type = "button";
  button.className = "addModuleButton active tooltipButton";
  button.textContent = "+";
  button.dataset.tooltip = "Close modules";
  button.setAttribute("aria-label", button.dataset.tooltip);
  button.onclick = () => {
    renderAddModuleButton(container, setting);
  };
  menu.className = "addModuleMenu";
  modules.forEach((module) => {
    const item = document.createElement("button");

    item.type = "button";
    item.textContent = module.name || module.id;
    item.onclick = () => {
      setting.moduleConfig ||= {};
      setting.moduleConfig[module.id] = createInitialModuleConfig(
        setting,
        module,
      );
      setOpenGameModuleAccordion(
        getGameModuleAccordionKey(setting, module),
        true,
      );
      syncScoreSettingsAfterEdit();
      renderGameSettingsModal();
    };
    menu.appendChild(item);
  });
  container.append(button, menu);
}

function createGameModuleSettingsRow(setting, module) {
  const row = document.createElement("details");
  const summary = document.createElement("summary");
  const title = document.createElement("strong");
  const detach = document.createElement("button");
  const fields = document.createElement("div");
  const config = getModuleConfigForSetting(setting, module);
  const accordionKey = getGameModuleAccordionKey(setting, module);

  row.className = "gameModuleSettingsRow";
  row.classList.toggle("incomplete", !isModuleConfigComplete(setting, module));
  row.open = gameModuleAccordionOpenStates.has(accordionKey)
    ? gameModuleAccordionOpenStates.get(accordionKey)
    : true;
  row.addEventListener("toggle", () => {
    setOpenGameModuleAccordion(accordionKey, row.open);

    if (!row.open) return;

    gameSettingsModalContent
      .querySelectorAll(".gameModuleSettingsRow[open]")
      .forEach((details) => {
        if (details === row) return;

        details.open = false;
      });
  });
  title.textContent = `Module: ${module.name || module.id}`;
  detach.type = "button";
  detach.className = "gameModuleDetachButton roundDeleteButton";
  detach.textContent = "×";
  detach.title = "Detach module";
  detach.onclick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    showConfirm(
      `Detach module "${module.name || module.id}"?`,
      () => {
        delete setting.moduleConfig?.[module.id];
        syncScoreSettingsAfterEdit();
        renderGameSettingsModal();
      },
      null,
      "Detach",
      "Cancel",
    );
  };
  summary.append(title, detach);
  fields.className = "gameModuleSettingsFields";

  getOrderedModuleConfigFields(module).forEach((field) => {
    const label = document.createElement("label");
    const input = createModuleConfigInput(setting, module, field, config);
    const isValid = isModuleFieldValueValid(setting, module, field, config);
    const hasValue = String(config[field.key] || "").trim() !== "";

    label.textContent = field.label || field.key;
    label.className =
      field.type === "screen"
        ? "gameModuleFieldFull"
        : getModuleFieldGroup(field)
          ? `gameModuleField-${getModuleFieldGroup(field)}`
          : "";
    input.classList.toggle("validModuleValue", hasValue && isValid);
    label.appendChild(input);
    fields.appendChild(label);
  });

  row.append(summary, fields);
  return row;
}

function getGameModuleAccordionKey(setting, module) {
  return `${selectedGameName || ""}|${setting?.id || ""}|${module?.id || ""}`;
}

function getOrderedModuleConfigFields(module) {
  const fields = module.configFields || [];
  const screenFields = fields.filter((field) => field.type === "screen");
  const roiFields = fields.filter((field) => field.type === "roi");
  const otherFields = fields.filter((field) => {
    return field.type !== "screen" && field.type !== "roi";
  });
  const groupedRois = new Map();

  roiFields.forEach((field) => {
    const match = String(field.key || "").match(/^([a-zA-Z]+)(\d+)$/);
    const index = match?.[2] || "";

    if (!groupedRois.has(index)) groupedRois.set(index, []);
    groupedRois.get(index).push(field);
  });

  const orderedRois = [...groupedRois.entries()]
    .sort(([a], [b]) => Number(a || 0) - Number(b || 0))
    .flatMap(([, group]) => {
      return group.sort((a, b) => {
        const aIsName = String(a.key || "")
          .toLowerCase()
          .startsWith("name");
        const bIsName = String(b.key || "")
          .toLowerCase()
          .startsWith("name");

        if (aIsName === bIsName) return 0;
        return aIsName ? -1 : 1;
      });
    });

  return [...screenFields, ...orderedRois, ...otherFields];
}

function createModuleConfigInput(setting, module, field, config) {
  const input =
    field.type === "screen"
      ? document.createElement("select")
      : field.type === "roi"
        ? document.createElement("select")
        : document.createElement("input");

  if (field.type === "screen") {
    populateModuleScreenOptions(input, config[field.key]);
  } else if (field.type === "roi") {
    populateModuleRoiOptions(
      input,
      config[field.key],
      config[field.screenKey],
      field,
      module,
      setting,
    );
  } else {
    input.type = "text";
    input.value = config[field.key] || "";
    input.placeholder = String(field.defaultValue || "");
  }

  input.onchange = () => {
    setting.moduleConfig ||= {};
    setting.moduleConfig[module.id] = getModuleConfigForSetting(
      setting,
      module,
    );
    setting.moduleConfig[module.id][field.key] = input.value.trim();

    if (field.type === "screen") {
      autofillModuleRoiFields(setting, module, field);
    }

    syncScoreSettingsAfterEdit();
    renderGameSettingsModal();
  };

  return input;
}

function createInitialModuleConfig(setting, module) {
  const config = getModuleConfigDefaults(module);

  setting.moduleConfig ||= {};
  setting.moduleConfig[module.id] = config;
  (module.configFields || [])
    .filter((field) => field.type === "screen")
    .forEach((field) => {
      autofillModuleRoiFields(setting, module, field);
    });

  return config;
}

function autofillModuleRoiFields(setting, module, screenField) {
  const config = setting.moduleConfig?.[module.id];

  if (!config) return;

  const roiNames = getRoiNamesForScreen(config[screenField.key]);
  const roiByNormalizedName = new Map(
    roiNames.map((name) => [normalizeModuleFieldMatchName(name), name]),
  );
  const used = new Set(
    Object.entries(config)
      .filter(([key, value]) => {
        const field = (module.configFields || []).find(
          (item) => item.key === key,
        );

        return field?.type === "roi" && String(value || "").trim();
      })
      .map(([, value]) => String(value).trim()),
  );

  (module.configFields || [])
    .filter(
      (field) => field.type === "roi" && field.screenKey === screenField.key,
    )
    .forEach((field) => {
      const current = String(config[field.key] || "").trim();

      if (current && roiNames.includes(current)) return;

      const match =
        roiByNormalizedName.get(normalizeModuleFieldMatchName(field.label)) ||
        roiByNormalizedName.get(normalizeModuleFieldMatchName(field.key));

      if (!match || used.has(match)) return;

      config[field.key] = match;
      used.add(match);
    });
}

function normalizeModuleFieldMatchName(value) {
  const normalized = String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  return normalized
    .replace(/^names(?=\d)/, "name")
    .replace(/^scores(?=\d)/, "score");
}

function getModuleFieldGroup(field) {
  const match = String(field.key || "").match(/^([a-zA-Z]+)\d+$/);

  return match?.[1] || "";
}

function populateModuleScreenOptions(select, value) {
  const empty = document.createElement("option");

  select.replaceChildren();
  empty.value = "";
  empty.textContent = "Choose screen";
  select.appendChild(empty);
  (selectedGame?.screens || []).forEach((screen) => {
    const option = document.createElement("option");

    option.value = screen.name || "";
    option.textContent = screen.name || "Unnamed screen";
    select.appendChild(option);
  });
  select.value = value;
}

function populateModuleRoiOptions(
  select,
  value,
  screenName,
  field,
  module,
  setting,
) {
  const rois = getRoiNamesForScreen(screenName);
  const used = getUsedModuleRoiValues(module, field, setting);
  const empty = document.createElement("option");
  const allowedRois = rois.filter((roiName) => {
    return roiName === value || !used.has(roiName);
  });

  select.replaceChildren();
  empty.value = "";
  empty.textContent = screenName ? "Choose ROI" : "Choose screen first";
  select.appendChild(empty);
  allowedRois.forEach((roiName) => {
    const option = document.createElement("option");

    option.value = roiName;
    option.textContent = roiName;
    select.appendChild(option);
  });

  if (allowedRois.includes(value)) {
    select.value = value;
  } else {
    select.value = "";
  }
}

function getUsedModuleRoiValues(module, field, setting) {
  const config = setting ? getModuleConfigForSetting(setting, module) : {};
  const used = new Set();

  (module.configFields || []).forEach((item) => {
    if (item.key === field.key || item.type !== "roi") return;

    const value = String(config[item.key] || "").trim();

    if (value) used.add(value);
  });

  return used;
}

function populateScreenOptions(select, value, settingId) {
  select.replaceChildren();
  (selectedGame?.screens || []).forEach((screen) => {
    const screenName = screen.name || "";
    const metrics = getAvailableMetricNamesForScreen(screenName, settingId);

    if (metrics.length === 0 && screenName !== value) return;

    const option = document.createElement("option");

    option.value = screenName;
    option.textContent = screenName || "Unnamed screen";
    select.appendChild(option);
  });
  select.value = value;
}

function populateMetricOptions(select, screenName, value, settingId) {
  select.replaceChildren();
  getAvailableMetricNamesForScreen(screenName, settingId).forEach(
    (metricName) => {
      const option = document.createElement("option");

      option.value = metricName;
      option.textContent = metricName;
      select.appendChild(option);
    },
  );
  select.value = value;
}

function populateDemoMetricOptions(select, setting) {
  select.replaceChildren();

  const empty = document.createElement("option");
  empty.value = "";
  empty.textContent = "No demo metric";
  select.appendChild(empty);

  getMetricNamesForScreen(setting.screen).forEach((metricName) => {
    const option = document.createElement("option");

    option.value = metricName;
    option.textContent = metricName;
    select.appendChild(option);
  });

  select.value = normalizeScoreDemoMetric(setting.demoMetric, setting.screen);
}

function populateDemoMetricOptionsFromNames(select, names, value) {
  const uniqueNames = [...new Set((names || []).filter(Boolean))];

  select.replaceChildren();

  const empty = document.createElement("option");
  empty.value = "";
  empty.textContent = "No demo metric";
  select.appendChild(empty);

  uniqueNames.forEach((metricName) => {
    const option = document.createElement("option");

    option.value = metricName;
    option.textContent = metricName;
    select.appendChild(option);
  });

  select.value = uniqueNames.includes(value) ? value : "";
}

function populateDemoStartValueOptions(select, setting) {
  const sequence = parseScoreDemoSequence(setting.demoSequence);
  const selected = normalizeScoreDemoStartValue(
    setting.demoStartValue,
    setting.demoSequence,
  );

  select.replaceChildren();
  select.disabled = sequence.length === 0;

  if (sequence.length === 0) {
    const empty = document.createElement("option");

    empty.value = "";
    empty.textContent = "No sequence";
    select.appendChild(empty);
    return;
  }

  sequence.forEach((value) => {
    const option = document.createElement("option");

    option.value = String(value);
    option.textContent = String(value);
    select.appendChild(option);
  });

  select.value = selected;
}

function populateDemoStartValueOptionsFromSequence(
  select,
  sequenceInput,
  value,
) {
  const sequence = parseScoreDemoSequence(sequenceInput);
  const selected = normalizeScoreDemoStartValue(value, sequenceInput);

  select.replaceChildren();
  select.disabled = sequence.length === 0;

  if (sequence.length === 0) {
    const empty = document.createElement("option");

    empty.value = "";
    empty.textContent = "No sequence";
    select.appendChild(empty);
    return;
  }

  sequence.forEach((item) => {
    const option = document.createElement("option");

    option.value = String(item);
    option.textContent = String(item);
    select.appendChild(option);
  });

  select.value = selected;
}

function getAvailableMetricNamesForScreen(screenName, settingId) {
  const used = getUsedScoreSettingComboKeys(settingId);

  return getMetricNamesForScreen(screenName).filter((metricName) => {
    return !used.has(getScoreSettingComboKey(screenName, metricName));
  });
}

function getFirstAvailableMetricForScreen(screenName, settingId) {
  return getAvailableMetricNamesForScreen(screenName, settingId)[0] || "";
}

function syncScoreSettingsAfterEdit(options = {}) {
  populateScoreSettingSelect();
  applySelectedScoreSetting();
  updateActiveScoreEntryMetadata();
  updateHighScoreTitle();
  if (options.resetRuns) {
    resetScoringRuns();
  }
  saveTwoPlayerSettings();
}

function updateActiveScoreEntryMetadata() {
  const settingKey = getSelectedScoreSettingKey();

  sessionScores.forEach((entry) => {
    if (
      entry.game === selectedGameName &&
      getScoreEntrySettingKey(entry) === settingKey
    ) {
      entry.scoreMinScore = selectedScoreMinScore;
      entry.scoreValueLabel = selectedScoreValueLabel;
      entry.scoreStopScreen = selectedScoreStopScreenNames[0] || "";
      entry.scoreStopScreens = selectedScoreStopScreenNames.slice();
    }
  });
}

function exportGameScoreSettings() {
  const record = getGameScoreSettingsRecord();
  const gameDemoDetector = serializeDemoDetectorConfig(
    selectedGame?.demoDetector,
  );
  const screenDemoDetectors = getScreenDemoDetectorExportMap(selectedGame);
  const data = {
    exportVersion: 2,
    exportedAt: new Date().toISOString(),
    game: selectedGameName,
    fastOCR: record.fastOCR !== false,
    ...(hasSerializedDemoDetector(gameDemoDetector)
      ? { demoDetector: gameDemoDetector }
      : {}),
    ...(Object.keys(screenDemoDetectors).length > 0
      ? { screenDemoDetectors }
      : {}),
    settings: record.items.map(serializeScoreSetting),
    selectedId: record.selectedId,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = `${selectedGameName || "game"}-score-settings.json`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function serializeScoreSetting(item) {
  return {
    ...item,
    stopScreens: normalizeScoreStopScreens(item.stopScreens ?? item.stopScreen),
    fireworkScreens: normalizeScoreFireworkScreens(item.fireworkScreens),
    demoMetric: normalizeScoreDemoMetric(item.demoMetric, item.screen),
    demoSequence: normalizeScoreDemoSequenceInput(item.demoSequence),
    demoStartValue: normalizeScoreDemoStartValue(
      item.demoStartValue,
      item.demoSequence,
    ),
    demoStopScreens: normalizeScoreStopScreens(item.demoStopScreens),
    demoMode: item.demoMode === "held" ? "held" : "sequence",
    demoHeldValue: String(item.demoHeldValue ?? "").trim(),
    demoHoldMs: Number(item.demoHoldMs) || 2000,
    demoConfirmOnScreenExit: item.demoConfirmOnScreenExit !== false,
    demoDetectorCreated: item.demoDetectorCreated === true,
    demoDetectorEnabled:
      item.demoDetectorCreated === true || hasUsableDemoDetectorConfig(item),
    moduleConfig: item.moduleConfig || {},
  };
}

function serializeDemoDetectorConfig(config = {}, gameData = selectedGame) {
  const metric = String(config?.metric ?? config?.demoMetric ?? "").trim();
  const sequence = normalizeScoreDemoSequenceInput(
    config?.sequence ?? config?.demoSequence,
  );
  const startValue = normalizeScoreDemoStartValue(
    config?.startValue ?? config?.demoStartValue,
    sequence,
  );
  const created =
    config?.created === true || config?.demoDetectorCreated === true;
  const stopScreens = normalizeScoreStopScreens(
    config?.stopScreens ?? config?.trackUntilScreens ?? config?.stopScreen,
    gameData,
  );
  const mode = config?.mode === "held" ? "held" : "sequence";
  const heldValue = String(
    config?.heldValue ?? config?.targetValue ?? "",
  ).trim();
  const holdMs = Number.isFinite(Number(config?.holdMs))
    ? Math.max(0, Math.round(Number(config.holdMs)))
    : 2000;
  const confirmOnScreenExit = config?.confirmOnScreenExit !== false;

  return {
    created,
    enabled:
      created || Boolean(metric && (mode === "held" ? heldValue : sequence)),
    metric,
    sequence,
    startValue,
    stopScreens,
    mode,
    heldValue,
    holdMs,
    confirmOnScreenExit,
  };
}

function getScreenDemoDetectorExportMap(gameData) {
  return Object.fromEntries(
    (gameData?.screens || []).flatMap((screen) => {
      const config = serializeDemoDetectorConfig(screen.demoDetector, gameData);

      return hasSerializedDemoDetector(config)
        ? [[screen.name || "", config]]
        : [];
    }),
  );
}

function hasSerializedDemoDetector(config = {}) {
  const metric = String(config.metric || "").trim();
  const sequence = String(config.sequence || "").trim();
  const heldValue = String(config.heldValue || "").trim();
  const usable =
    config.mode === "held"
      ? Boolean(metric && heldValue)
      : Boolean(metric && sequence);
  const hasDraftValues = Boolean(
    metric ||
    sequence ||
    heldValue ||
    normalizeScoreStopScreens(config.stopScreens).length,
  );

  return Boolean((config.created === true && hasDraftValues) || usable);
}

async function importGameScoreSettingsFile(file) {
  if (!file) return;

  try {
    const data = JSON.parse(await file.text());

    if (data.game && data.game !== selectedGameName) {
      throw new Error("The settings belong to another game.");
    }

    if (!Array.isArray(data.settings)) {
      throw new Error("No settings list found.");
    }

    const record = getGameScoreSettingsRecord();
    record.fastOCR = data.fastOCR !== false;
    importGameDemoDetectorSettings(data);
    record.items = data.settings.map((item) => ({
      id:
        item.id ||
        `score-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: "",
      screen: String(item.screen || ""),
      metric: String(item.metric || ""),
      minScore: normalizeScoreMinScore(item.minScore),
      valueLabel: normalizeScoreValueLabel(item.valueLabel),
      stopScreens: normalizeScoreStopScreens(
        item.stopScreens ?? item.stopScreen,
      ),
      stopScreen:
        normalizeScoreStopScreens(item.stopScreens ?? item.stopScreen)[0] || "",
      fireworkScreens: normalizeScoreFireworkScreens(item.fireworkScreens),
      demoMetric: normalizeScoreDemoMetric(item.demoMetric, item.screen),
      demoSequence: normalizeScoreDemoSequenceInput(item.demoSequence),
      demoStartValue: normalizeScoreDemoStartValue(
        item.demoStartValue,
        item.demoSequence,
      ),
      demoStopScreens: normalizeScoreStopScreens(item.demoStopScreens),
      demoMode: item.demoMode === "held" ? "held" : "sequence",
      demoHeldValue: String(item.demoHeldValue ?? "").trim(),
      demoHoldMs: Number(item.demoHoldMs) || 2000,
      demoConfirmOnScreenExit: item.demoConfirmOnScreenExit !== false,
      demoDetectorCreated: item.demoDetectorCreated === true,
      demoDetectorEnabled:
        item.demoDetectorCreated === true || hasUsableDemoDetectorConfig(item),
      moduleConfig: item.moduleConfig || {},
    }));
    normalizeScoreSettingsRecord(record);
    record.selectedId = record.items.some((item) => item.id === data.selectedId)
      ? data.selectedId
      : record.items[0].id;
    selectedScoreSettingId = record.selectedId;
    applySelectedScoreSetting();
    syncScoreSettingsAfterEdit({ resetRuns: true });
    persistSelectedGameData();
    renderGameSettingsModal();
  } catch (error) {
    showAlert(`Could not import game settings.\n${error.message}`);
  }
}

function importGameDemoDetectorSettings(data) {
  if (!selectedGame) return;

  selectedGame.demoDetector = Object.prototype.hasOwnProperty.call(
    data,
    "demoDetector",
  )
    ? normalizeImportedGameDemoDetector(data.demoDetector)
    : {};

  const screenConfigs =
    data.screenDemoDetectors && typeof data.screenDemoDetectors === "object"
      ? data.screenDemoDetectors
      : {};

  (selectedGame.screens || []).forEach((screen) => {
    screen.demoDetector = Object.prototype.hasOwnProperty.call(
      screenConfigs,
      screen.name,
    )
      ? normalizeImportedGameDemoDetector(screenConfigs[screen.name])
      : {};
  });
}

function normalizeImportedGameDemoDetector(config, gameData = selectedGame) {
  return serializeDemoDetectorConfig(config, gameData);
}

function openAchievementsModal() {
  renderAchievementsModal();
  achievementsModal.classList.remove("hidden");
}

function closeAchievementsModalDialog() {
  achievementsModal.classList.add("hidden");
}

function openDaysModal() {
  syncHighScoreCarouselControls();
  renderDaysModal();
  daysModal.classList.remove("hidden");
}

function closeDaysModalDialog() {
  daysModal.classList.add("hidden");
}

function renderDaysModal(openKeys = getOpenDaysModalKeys()) {
  const days = getStoredLeaderboardDays();
  const gameName = getHighScoreHistoryGameName();
  const settingKey = getHighScoreHistorySettingKey(gameName);

  daysModalContent.innerHTML = "";
  renderHighScoreGamePicker(gameName);
  renderHighScoreSettingPicker(gameName, settingKey);
  renderDaysExportButton(gameName, settingKey);

  renderAllTimeSection(gameName, settingKey, openKeys);

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
      return (
        isScoreEntryForSetting(entry, gameName, settingKey) &&
        isLeaderboardScore(entry)
      );
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

    del.className = "dayDeleteButton button-danger";
    del.textContent = "Delete";
    del.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();

      showConfirm(
        `Delete ${gameName} scores for ${dateKey}?`,
        () => {
          deleteStoredLeaderboardDayGame(dateKey, gameName, settingKey);
          renderDaysModal();
          renderScoreBoard();
        },
        null,
        "Delete",
        "Cancel",
      );
    };

    summary.append(meta, del);
    details.append(summary, list);

    entries.sort(compareScoreEntries).forEach((entry, index) => {
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

function getHighScoreHistoryGameName() {
  if (isKnownGameName(highScoreHistoryGameName)) {
    return highScoreHistoryGameName;
  }

  if (isKnownGameName(selectedGameName)) {
    highScoreHistoryGameName = selectedGameName;
    return highScoreHistoryGameName;
  }

  highScoreHistoryGameName =
    Object.keys(savedGames).sort((a, b) => a.localeCompare(b))[0] || "";

  return highScoreHistoryGameName;
}

function getHighScoreHistorySettingKey(gameName) {
  const settings = getScoreSettingsForHistoryGame(gameName);

  if (settings.some((setting) => setting.key === highScoreHistorySettingKey)) {
    return highScoreHistorySettingKey;
  }

  const selectedKey =
    gameName === selectedGameName ? getSelectedScoreSettingKey() : "";

  highScoreHistorySettingKey =
    settings.find((setting) => setting.key === selectedKey)?.key ||
    settings[0]?.key ||
    "";

  return highScoreHistorySettingKey;
}

function getScoreSettingsForHistoryGame(gameName) {
  const gameData = savedGames[gameName];
  const validKeys = new Set(
    getAllScoreSettingCombosForGameData(gameData).map((combo) => {
      return getScoreSettingComboKey(combo.screen, combo.metric);
    }),
  );
  const seen = new Set();
  const record = persistedSettings.scoreSettings?.[gameName];
  const settings = [];

  (record?.items || []).forEach((item) => {
    const key = getScoreSettingComboKey(item.screen, item.metric);

    if (!validKeys.has(key) || seen.has(key)) return;

    seen.add(key);
    settings.push({
      key,
      screen: item.screen,
      metric: item.metric,
      minScore: normalizeScoreMinScore(item.minScore),
      valueLabel: normalizeScoreValueLabel(item.valueLabel),
      label: getGeneratedScoreSettingName(item.screen, item.metric),
    });
  });

  if (settings.length > 0) return settings;

  getAllScoreSettingCombosForGameData(gameData).forEach((combo) => {
    const key = getScoreSettingComboKey(combo.screen, combo.metric);

    if (seen.has(key)) return;

    seen.add(key);
    settings.push({
      key,
      screen: combo.screen,
      metric: combo.metric,
      minScore: DEFAULT_MIN_LEADERBOARD_SCORE,
      valueLabel: "",
      label: getGeneratedScoreSettingName(combo.screen, combo.metric),
    });
  });

  return settings;
}

function renderHighScoreGamePicker(gameName) {
  const row = document.createElement("label");
  const select = document.createElement("select");
  const gameNames = Object.keys(savedGames).sort((a, b) => a.localeCompare(b));

  row.className = "daysGamePicker";
  row.textContent = "Game";

  if (gameNames.length === 0) {
    const option = document.createElement("option");

    option.value = "";
    option.textContent = "No saved games";
    select.appendChild(option);
    select.disabled = true;
  } else {
    gameNames.forEach((name) => {
      const option = document.createElement("option");

      option.value = name;
      option.textContent = name;
      select.appendChild(option);
    });
  }

  select.value = gameName;
  select.onchange = () => {
    highScoreHistoryGameName = select.value;
    highScoreHistorySettingKey = "";
    renderDaysModal(new Set());
  };

  row.appendChild(select);
  daysModalContent.appendChild(row);
}

function renderHighScoreSettingPicker(gameName, settingKey) {
  const row = document.createElement("label");
  const select = document.createElement("select");
  const settings = getScoreSettingsForHistoryGame(gameName);

  row.className = "daysGamePicker";
  row.textContent = "Active Leaderboard";

  if (settings.length === 0) {
    const option = document.createElement("option");

    option.value = "";
    option.textContent = "No settings";
    select.appendChild(option);
    select.disabled = true;
  } else {
    settings.forEach((setting) => {
      const option = document.createElement("option");

      option.value = setting.key;
      option.textContent = setting.label;
      select.appendChild(option);
    });
  }

  select.value = settingKey;
  select.onchange = () => {
    highScoreHistorySettingKey = select.value;
    renderDaysModal(new Set());
  };

  row.appendChild(select);
  daysModalContent.appendChild(row);
}

function renderDaysExportButton(gameName, settingKey) {
  const row = document.createElement("div");
  const importButton = document.createElement("button");
  const exportButton = document.createElement("button");
  const deleteSelectedButton = document.createElement("button");
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
  exportButton.disabled = !gameName || !settingKey;
  exportButton.onclick = () => exportLeaderboardDaysData(gameName, settingKey);

  deleteSelectedButton.textContent = "Delete Selected";
  deleteSelectedButton.className =
    "button-danger historySelectionDelete historySelectionDeleteZone inactive";
  deleteSelectedButton.disabled = true;
  deleteSelectedButton.onclick = deleteSelectedHistoryEntries;
  deleteSelectedButton.addEventListener("dragover", (event) => {
    if (!historySelectionState.nativeDragging) return;

    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    deleteSelectedButton.classList.add("dragOver");
  });
  deleteSelectedButton.addEventListener("dragleave", () => {
    deleteSelectedButton.classList.remove("dragOver");
  });
  deleteSelectedButton.addEventListener("drop", (event) => {
    if (!historySelectionState.nativeDragging) return;

    event.preventDefault();
    historySelectionState.nativeDragging = false;
    deleteSelectedButton.classList.remove("dragOver");
    setHistoryDeleteDropMode(false);
    deleteSelectedHistoryEntries();
  });

  row.append(importButton, exportButton, deleteSelectedButton, input);
  daysModalContent.appendChild(row);
}

function getSelectedHistoryEntries() {
  return [
    ...daysModalContent.querySelectorAll(
      ".scoreHistoryRow.selectable.selected",
    ),
  ]
    .map((row) => {
      return {
        dateKey: row.dataset.dateKey,
        entryKey: row.dataset.entryKey,
      };
    })
    .filter((item) => item.dateKey && item.entryKey);
}

function deleteSelectedHistoryEntries() {
  const selected = getSelectedHistoryEntries();

  if (selected.length === 0) {
    showAlert("Select at least one score first.");
    return;
  }

  showConfirm(
    `Delete ${selected.length} selected score${selected.length === 1 ? "" : "s"}?`,
    () => {
      selected.forEach(({ dateKey, entryKey }) => {
        const entry = getLeaderboardEntriesForDay(dateKey).find((item) => {
          return getScoreEntryKey(item) === entryKey;
        });

        if (entry) {
          deleteStoredLeaderboardEntry(dateKey, entry);
        }
      });
      renderDaysModal();
      renderScoreBoard();
    },
    null,
    "Delete",
    "Cancel",
  );
}

function renderAllTimeSection(gameName, settingKey, openKeys) {
  const section = document.createElement("details");
  const summary = document.createElement("summary");
  const title = document.createElement("strong");
  const meta = document.createElement("span");
  const list = document.createElement("div");
  const entries = getAllTimeLeaderboard()
    .filter((entry) => {
      return (
        isScoreEntryForSetting(entry, gameName, settingKey) &&
        isLeaderboardScore(entry)
      );
    })
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
    selectable: true,
  });
  const del = document.createElement("button");

  del.className = "entryDeleteButton roundDeleteButton";
  del.textContent = "×";
  del.title = "Delete score";
  del.onclick = () => {
    showConfirm(
      `Delete all-time score ${formatScore(entry.score)}?`,
      () => {
        deleteStoredLeaderboardEntry(entry.date || getTodayDateKey(), entry);
        renderDaysModal();
        renderScoreBoard();
      },
      null,
      "Delete",
      "Cancel",
    );
  };

  row.appendChild(del);

  return row;
}

function createDayEntryRow(dateKey, entry, rankText) {
  const row = createScoreHistoryRow(entry, rankText, {
    showGame: false,
    editableName: true,
    dateKey,
    selectable: true,
  });
  const del = document.createElement("button");

  del.className = "entryDeleteButton roundDeleteButton";
  del.textContent = "×";
  del.title = "Delete score";
  del.onclick = () => {
    showConfirm(
      `Delete score ${formatScore(entry.score)}?`,
      () => {
        deleteStoredLeaderboardEntry(dateKey, entry);
        renderDaysModal();
        renderScoreBoard();
      },
      null,
      "Delete",
      "Cancel",
    );
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
  row.classList.toggle("selectable", Boolean(options.selectable));
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
  score.textContent = formatScoreValue(entry);

  if (options.selectable) {
    row.dataset.dateKey = options.dateKey || entry.date || getTodayDateKey();
    row.dataset.entryKey = getScoreEntryKey(entry);
    row.tabIndex = 0;
    row.draggable = true;
    row.setAttribute("role", "checkbox");
    row.setAttribute("aria-checked", "false");
    row.setAttribute("aria-label", `Select score ${formatScore(entry.score)}`);
    row.onpointerdown = (event) =>
      startWindowsRowSelection(
        event,
        row,
        daysModalContent,
        ".scoreHistoryRow.selectable",
        historySelectionState,
        setHistoryRowSelected,
        true,
      );
    row.onpointerenter = (event) => {
      continueWindowsRowSelection(
        event,
        row,
        daysModalContent,
        ".scoreHistoryRow.selectable",
        historySelectionState,
        setHistoryRowSelected,
      );
    };
    row.onkeydown = (event) => {
      if (event.key !== " " && event.key !== "Enter") return;

      event.preventDefault();
      setHistoryRowSelected(row, !row.classList.contains("selected"));
    };
    row.ondragstart = (event) => {
      if (!row.classList.contains("selected")) {
        clearHistorySelection();
        setHistoryRowSelected(row, true);
      }

      historySelectionState.pendingSingle = null;
      historySelectionState.pendingDeselect = false;
      historySelectionState.nativeDragging = true;
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData(
        "application/x-ocr-helper-score-selection",
        "selected-high-scores",
      );
      setSelectionDragGhost(
        event.dataTransfer,
        daysModalContent.querySelectorAll(
          ".scoreHistoryRow.selectable.selected",
        ).length,
        "score",
      );
      setHistoryDeleteDropMode(true);
    };
    row.ondragend = () => {
      historySelectionState.nativeDragging = false;
      setHistoryDeleteDropMode(false);
      daysModalContent
        .querySelector(".historySelectionDeleteZone")
        ?.classList.remove("dragOver");
    };
  }

  row.append(rank, name);

  if (showGame) {
    row.appendChild(game);
  }

  row.appendChild(score);

  return row;
}

function setHistoryRowSelected(row, selected) {
  row.classList.toggle("selected", selected);
  row.setAttribute("aria-checked", String(selected));
  updateHistorySelectionDeleteZone();
}

function createRowSelectionState() {
  return {
    active: false,
    anchor: null,
    dragStart: null,
    baseline: new Set(),
    dragValue: true,
    pendingSingle: null,
    pendingDeselect: false,
    nativeDragging: false,
  };
}

function startWindowsRowSelection(
  event,
  row,
  container,
  selector,
  state,
  setSelected,
  allowNativeDrag = false,
) {
  if (event.button !== 0 || isHistorySelectionInteractiveTarget(event.target)) {
    return;
  }

  const rows = [...container.querySelectorAll(selector)];
  const additive = event.ctrlKey || event.metaKey || event.shiftKey;
  const selectedBefore = new Set(
    rows.filter((item) => {
      return item.classList.contains("selected");
    }),
  );

  if (
    allowNativeDrag &&
    !additive &&
    !event.shiftKey &&
    selectedBefore.has(row)
  ) {
    state.active = false;
    state.pendingSingle = row;
    state.pendingDeselect = selectedBefore.size === 1;
    row.focus();
    return;
  }

  if (!allowNativeDrag) event.preventDefault();
  state.pendingSingle = null;
  state.pendingDeselect = false;

  state.active = true;
  state.dragStart = row;
  state.baseline = additive ? selectedBefore : new Set();
  state.dragValue = additive ? !row.classList.contains("selected") : true;
  applyWindowsRowDragRange(rows, row, state, setSelected);
  state.anchor = row;

  row.focus();
}

function continueWindowsRowSelection(
  event,
  row,
  container,
  selector,
  state,
  setSelected,
) {
  if (!state.active || !(event.buttons & 1)) return;

  applyWindowsRowDragRange(
    [...container.querySelectorAll(selector)],
    row,
    state,
    setSelected,
  );
}

function applyWindowsRowDragRange(rows, row, state, setSelected) {
  const start = rows.indexOf(state.dragStart);
  const end = rows.indexOf(row);

  if (start < 0 || end < 0) return;

  const rangeStart = Math.min(start, end);
  const rangeEnd = Math.max(start, end);

  rows.forEach((item, index) => {
    const inRange = index >= rangeStart && index <= rangeEnd;
    setSelected(item, inRange ? state.dragValue : state.baseline.has(item));
  });
}

function updateHistorySelectionDeleteZone() {
  const zone = daysModalContent.querySelector(".historySelectionDeleteZone");

  if (zone) {
    const hasSelection = Boolean(
      daysModalContent.querySelector(".scoreHistoryRow.selectable.selected"),
    );

    zone.disabled = !hasSelection;
    zone.classList.toggle("active", hasSelection);
    zone.classList.toggle("inactive", !hasSelection);
  }
}

function setHistoryDeleteDropMode(active) {
  const zone = daysModalContent.querySelector(".historySelectionDeleteZone");

  if (!zone) return;

  zone.classList.toggle("dropReady", active);
  zone.textContent = active ? "Drop here to delete" : "Delete Selected";
}

function clearNamePoolSelection() {
  namePoolList.querySelectorAll(".namePoolRow.selected").forEach((row) => {
    setNamePoolRowSelected(row, false);
  });
  namePoolSelectionState.anchor = null;
  namePoolSelectionState.pendingSingle = null;
  namePoolSelectionState.pendingDeselect = false;
}

function clearHistorySelection() {
  daysModalContent
    .querySelectorAll(".scoreHistoryRow.selectable.selected")
    .forEach((row) => setHistoryRowSelected(row, false));
  historySelectionState.anchor = null;
  historySelectionState.pendingSingle = null;
  historySelectionState.pendingDeselect = false;
}

function isHistorySelectionInteractiveTarget(target) {
  return Boolean(target.closest("input, button, select, textarea, a"));
}

function stopHistorySelectionDrag() {
  if (
    namePoolSelectionState.pendingSingle &&
    !namePoolSelectionState.nativeDragging
  ) {
    const keepRow = namePoolSelectionState.pendingSingle;

    namePoolList.querySelectorAll(".namePoolRow").forEach((row) => {
      setNamePoolRowSelected(
        row,
        row === keepRow && !namePoolSelectionState.pendingDeselect,
      );
    });
    namePoolSelectionState.anchor = keepRow;
  }

  namePoolSelectionState.pendingSingle = null;
  namePoolSelectionState.pendingDeselect = false;
  if (
    historySelectionState.pendingSingle &&
    !historySelectionState.nativeDragging
  ) {
    const keepRow = historySelectionState.pendingSingle;

    daysModalContent
      .querySelectorAll(".scoreHistoryRow.selectable")
      .forEach((row) => setHistoryRowSelected(row, row === keepRow));
    historySelectionState.anchor = keepRow;
  }

  historySelectionState.pendingSingle = null;
  historySelectionState.pendingDeselect = false;
  historySelectionState.active = false;
  namePoolSelectionState.active = false;
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

  localStorage.setItem(
    getLeaderboardStorageKey(dateKey),
    JSON.stringify(entries),
  );

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

function exportLeaderboardDaysData(gameName, settingKey) {
  const days = getStoredLeaderboardDays()
    .map((dateKey) => {
      return {
        date: dateKey,
        entries: getLeaderboardEntriesForDay(dateKey).filter((entry) => {
          return (
            isScoreEntryForSetting(entry, gameName, settingKey) &&
            isLeaderboardScore(entry)
          );
        }),
      };
    })
    .filter((day) => day.entries.length > 0);
  const setting = getScoreSettingsForHistoryGame(gameName).find((item) => {
    return item.key === settingKey;
  });
  const data = {
    exportedAt: new Date().toISOString(),
    game: gameName,
    scoreSettingKey: settingKey,
    scoreScreen: setting?.screen || "",
    scoreMetric: setting?.metric || "",
    scoreMinScore: normalizeScoreMinScore(setting?.minScore),
    scoreValueLabel: normalizeScoreValueLabel(setting?.valueLabel),
    days,
    allTimeTop20: getAllTimeLeaderboard()
      .filter((entry) => {
        return (
          isScoreEntryForSetting(entry, gameName, settingKey) &&
          isLeaderboardScore(entry)
        );
      })
      .sort(compareScoreEntries)
      .slice(0, 20),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = `${gameName || "leaderboard"}-${setting?.label || "scores"}-days.json`;
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
    showAlert(`Could not import day data.\n${error.message}`);
    return;
  }

  rebuildAllTimeLeaderboardFromDays();
  scoreBoardSignature = "";
  renderDaysModal();
  renderScoreBoard();
  showAlert(
    `Imported ${result.entries} score${result.entries === 1 ? "" : "s"} from ${result.days.size} day${result.days.size === 1 ? "" : "s"}.`,
  );
}

function importLeaderboardDaysData(data, result) {
  const gameName = String(data?.game || selectedGameName || "").trim();

  if (!gameName) {
    throw new Error("The imported file does not contain a game name.");
  }

  if (!isKnownGameName(gameName)) {
    throw new Error(
      `The imported scores belong to unknown game "${gameName}".`,
    );
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
      .map((entry) =>
        normalizeImportedLeaderboardEntry(entry, gameName, dateKey, data),
      )
      .filter(Boolean);

    if (importedEntries.length === 0) return;

    mergeLeaderboardDayEntries(dateKey, importedEntries);
    result.days.add(dateKey);
    result.entries += importedEntries.length;
  });
}

function normalizeImportedLeaderboardEntry(
  entry,
  gameName,
  dateKey,
  data = {},
) {
  const score = Number(entry?.score);
  const gameScore = Number(entry?.gameScore);
  const scoreMinScore = normalizeScoreMinScore(
    entry?.scoreMinScore ?? data.scoreMinScore,
  );
  const scoreValueLabel = normalizeScoreValueLabel(
    entry?.scoreValueLabel ?? data.scoreValueLabel,
  );

  if (!Number.isFinite(score) || score < scoreMinScore) return null;

  const createdAt =
    Number(entry.createdAt) || Number(entry.startedAt) || Date.now();
  const startedAt = Number(entry.startedAt) || createdAt;
  const id = Number(entry.id) || startedAt;
  const name = String(entry.name || entry.player || "")
    .trim()
    .slice(0, MAX_SCORE_NAME_LENGTH);
  const player = name || String(entry.player || "Player").trim() || "Player";
  const color = entry.color === "red" ? "red" : "blue";
  const playerSide = normalizeScoreEntryPlayerSide(entry.playerSide, color);
  const scoreScreen = String(
    entry.scoreScreen || data.scoreScreen || "",
  ).trim();
  const scoreMetric = String(
    entry.scoreMetric || data.scoreMetric || "",
  ).trim();
  const scoreSettingKey =
    entry.scoreSettingKey ||
    data.scoreSettingKey ||
    (scoreScreen || scoreMetric
      ? getScoreSettingComboKey(scoreScreen, scoreMetric)
      : "");
  const normalized = {
    id,
    key: entry.key,
    date: dateKey,
    game: gameName,
    scoreSettingKey,
    scoreScreen,
    scoreMetric,
    scoreMinScore,
    scoreValueLabel,
    player,
    name,
    color,
    playerSide,
    score,
    gameScore: Number.isFinite(gameScore) ? gameScore : null,
    interruptedBeforeStopScreen: Boolean(entry.interruptedBeforeStopScreen),
    createdAt,
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
      playerSide: normalizeScoreEntryPlayerSide(entry.playerSide, entry.color),
      createdAt:
        Number(entry.createdAt) || Number(entry.startedAt) || Date.now(),
      startedAt:
        Number(entry.startedAt) || Number(entry.createdAt) || Date.now(),
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
    sessionScores = sessionScores.filter(
      (item) => getScoreEntryKey(item) !== key,
    );
  }

  rebuildAllTimeLeaderboardFromDays();
}

function deleteStoredLeaderboardDayGame(dateKey, gameName, settingKey) {
  const nextEntries = getLeaderboardEntriesForDay(dateKey).filter((entry) => {
    return !isScoreEntryForSetting(entry, gameName, settingKey);
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
    sessionScores = sessionScores.filter((entry) => {
      return !isScoreEntryForSetting(entry, gameName, settingKey);
    });
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

    getAchievementModalMetricGroups(screen.achievements).forEach((group) => {
      const metricGroup = document.createElement("div");
      const metricTitle = document.createElement("h4");

      metricGroup.className = "achievementModalMetricGroup";
      metricTitle.textContent = group.metric;
      metricGroup.appendChild(metricTitle);
      group.achievements.forEach((achievement) => {
        metricGroup.appendChild(createAchievementModalItem(achievement));
      });
      section.appendChild(metricGroup);
    });

    achievementsModalContent.appendChild(section);
  });
}

function getAchievementModalMetricGroups(achievements) {
  const groups = new Map();

  achievements.forEach((achievement, sourceIndex) => {
    const metric = String(achievement.metric || "").trim() || "Unassigned";

    if (!groups.has(metric)) groups.set(metric, []);
    groups.get(metric).push({ achievement, sourceIndex });
  });

  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b, undefined, { sensitivity: "base" }))
    .map(([metric, entries]) => ({
      metric,
      achievements: entries
        .sort(compareAchievementModalEntries)
        .map((entry) => entry.achievement),
    }));
}

function compareAchievementModalEntries(a, b) {
  const aValue = String(a.achievement.value ?? "").trim();
  const bValue = String(b.achievement.value ?? "").trim();
  const aNumber = aValue === "" ? null : Number(aValue);
  const bNumber = bValue === "" ? null : Number(bValue);
  const aIsNumber = Number.isFinite(aNumber);
  const bIsNumber = Number.isFinite(bNumber);

  if (aIsNumber && bIsNumber && aNumber !== bNumber) return aNumber - bNumber;
  if (aIsNumber !== bIsNumber) return aIsNumber ? -1 : 1;

  const valueOrder = aValue.localeCompare(bValue, undefined, {
    sensitivity: "base",
  });

  return valueOrder || a.sourceIndex - b.sourceIndex;
}

function formatAchievementModalValue(value) {
  const text = String(value ?? "").trim();
  const number = Number(text);

  if (!text || !Number.isFinite(number)) return text;

  return number.toLocaleString("en-US", {
    maximumFractionDigits: 20,
  });
}

function createAchievementModalItem(achievement) {
  const item = document.createElement("div");
  const status = document.createElement("span");
  const condition = document.createElement("div");
  const tier = document.createElement("div");
  const message = document.createElement("div");

  item.className = "achievementModalItem";
  item.dataset.tier = normalizeAchievementTier(achievement.tier);
  item.tabIndex = 0;
  item.setAttribute("role", "switch");
  status.className = "achievementModalStatus";

  const updateState = () => {
    const active = achievement.enabled !== false;

    item.classList.toggle("disabled", !active);
    item.setAttribute("aria-checked", String(active));
    status.textContent = "Inactive";
    status.hidden = active;
  };
  const toggleAchievement = () => {
    achievement.enabled = achievement.enabled === false;
    updateState();
    persistSelectedGameData();
    players.forEach((player) => {
      player.achievementRuntimeStates.clear();
      player.achievementToastQueue = [];
    });
  };

  item.onclick = toggleAchievement;
  item.onkeydown = (event) => {
    if (event.key !== " " && event.key !== "Enter") return;

    event.preventDefault();
    toggleAchievement();
  };
  updateState();
  condition.className = "achievementModalCondition";
  condition.textContent = `${achievement.metric || "Metric"} ${achievement.comparer || "="} ${formatAchievementModalValue(achievement.value)}`;

  tier.className = "achievementModalTier";
  tier.textContent = normalizeAchievementTier(achievement.tier);

  message.className = "achievementModalMessage";
  message.textContent = achievement.message || "Achievement unlocked!";

  item.append(status, condition, tier, message);
  return item;
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
  const items = [
    {
      label: "Game",
      done: Boolean(selectedGameName),
    },
    {
      label: "Camera",
      done: Boolean(player.cameraSelect.value && player.stream),
    },
    {
      label: "Calibrated",
      done: Boolean(player.calibrated),
    },
  ];
  const list = document.createElement("ul");

  list.className = "playerStatusChecklist";

  items.forEach((item) => {
    const row = document.createElement("li");
    const check = document.createElement("span");
    const label = document.createElement("span");

    row.className = `playerStatusItem ${item.done ? "done" : "pending"}`;
    check.className = "playerStatusCheck";
    check.textContent = item.done ? "✓" : "!";
    label.textContent = item.label;

    row.append(check, label);
    list.appendChild(row);
  });

  player.status.replaceChildren(list);

  if (message) {
    const detail = document.createElement("div");

    detail.className = "playerStatusMessage";
    detail.textContent = message;
    player.status.appendChild(detail);
  }

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
  updateAllTimeCarouselAutoScroll();
  requestAnimationFrame(drawLoop);
}

function setupPlayer(player) {
  populateLUTSelect(player.lutSelect);
  restorePlayerSettings(
    player,
    persistedSettings.players?.[players.indexOf(player)],
  );
  renderPlayerLUTSwatches(player);

  player.screenOverlayToggle.onchange = () => {
    player.screenOverlay.hidden = !player.screenOverlayToggle.checked;
    saveTwoPlayerSettings();
  };

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
    renderPlayerLUTSwatches(player);
    saveTwoPlayerSettings();
  };

  player.calibrateButton.onclick = () => {
    calibratePlayer(player);
  };

  player.nameInput.oninput = () => {
    updatePlayerLabel(player, player.nameInput.value);
    saveTwoPlayerSettings();
    renderScoreBoard();
  };
}

function setupSharedControls() {
  populateSharedGameSelect();
  setupTopGameSetupPanel();

  rememberGameToggle.checked = rememberGame;
  rememberGameToggle.onchange = () => {
    rememberGame = rememberGameToggle.checked;
    saveTwoPlayerSettings();
  };

  sharedGameSelect.onchange = () => {
    selectSharedGame(sharedGameSelect.value);
  };

  scoreSettingSelect.onchange = () => {
    selectScoreSetting(scoreSettingSelect.value);
  };

  importJSONButton.onclick = () => {
    importJSONFile.click();
  };
  exportJSONButton.onclick = exportSelectedGameJSON;

  importJSONFile.onchange = async (e) => {
    await importProjectFiles([...e.target.files]);
    importJSONFile.value = "";
  };

  showAchievementsButton.onclick = openAchievementsModal;
  showDaysButton.onclick = openDaysModal;
  syncHighScoreCarouselControls();
  highScoreCarouselEnabled.onchange = updateHighScoreCarouselSettings;
  highScoreCarouselInterval.onchange = updateHighScoreCarouselSettings;
  highScoreCarouselDuration.onchange = updateHighScoreCarouselSettings;
  leaderboardCarouselPrevious.onclick = showLiveLeaderboardManually;
  leaderboardCarouselNext.onclick = showAllTimeCarouselManually;
  openGameSettingsButton.onclick = openGameSettingsModal;
  openNamePoolButton.onclick = openNamePoolModal;
  useNamePoolForRunsToggles.forEach((toggle) => {
    toggle.checked = useNamePoolForRuns;
    toggle.onchange = () => {
      setUseNamePoolForRuns(toggle.checked);
    };
  });
  openInfoModalButton.onclick = openInfoModalDialog;
  closeAchievementsModal.onclick = closeAchievementsModalDialog;
  closeDaysModal.onclick = closeDaysModalDialog;
  closeGameSettingsModal.onclick = closeGameSettingsModalDialog;
  closeNamePoolModal.onclick = closeNamePoolModalDialog;
  closeInfoModal.onclick = closeInfoModalDialog;
  addNamePoolEntryButton.onclick = addNamePoolEntry;
  importNamePoolButton.onclick = () => {
    importNamePoolFile.click();
  };
  importNamePoolButton.addEventListener("dragenter", (event) => {
    if (!event.dataTransfer?.types?.includes("Files")) return;

    event.preventDefault();
    importNamePoolButton.classList.add("dragOver");
  });
  importNamePoolButton.addEventListener("dragover", (event) => {
    if (!event.dataTransfer?.types?.includes("Files")) return;

    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    importNamePoolButton.classList.add("dragOver");
  });
  importNamePoolButton.addEventListener("dragleave", () => {
    importNamePoolButton.classList.remove("dragOver");
  });
  importNamePoolButton.addEventListener("drop", async (event) => {
    event.preventDefault();
    importNamePoolButton.classList.remove("dragOver");
    await importNamePoolDataFile(event.dataTransfer?.files?.[0]);
  });
  exportNamePoolButton.onclick = exportNamePoolData;
  deleteSelectedNamesButton.onclick = deleteSelectedNamePoolEntries;
  deleteSelectedNamesButton.addEventListener("dragover", (event) => {
    if (!namePoolSelectionState.nativeDragging) return;

    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    deleteSelectedNamesButton.classList.add("dragOver");
  });
  deleteSelectedNamesButton.addEventListener("dragleave", () => {
    deleteSelectedNamesButton.classList.remove("dragOver");
  });
  deleteSelectedNamesButton.addEventListener("drop", (event) => {
    if (!namePoolSelectionState.nativeDragging) return;

    event.preventDefault();
    deleteSelectedNamesButton.classList.remove("dragOver");
    namePoolSelectionState.nativeDragging = false;
    deleteSelectedNamePoolEntries();
  });
  namePoolList.addEventListener("dragover", (event) => {
    if (!namePoolSelectionState.nativeDragging) return;

    event.preventDefault();
    event.dataTransfer.dropEffect = "none";
  });
  namePoolList.addEventListener("drop", (event) => {
    if (!namePoolSelectionState.nativeDragging) return;

    event.preventDefault();
  });
  daysModalContent.addEventListener("dragover", (event) => {
    if (
      !historySelectionState.nativeDragging ||
      event.target.closest(".historySelectionDeleteZone")
    ) {
      return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = "none";
  });
  daysModalContent.addEventListener("drop", (event) => {
    if (
      !historySelectionState.nativeDragging ||
      event.target.closest(".historySelectionDeleteZone")
    ) {
      return;
    }

    event.preventDefault();
  });
  importNamePoolFile.onchange = async () => {
    await importNamePoolDataFile(importNamePoolFile.files?.[0]);
    importNamePoolFile.value = "";
  };
  namePoolInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;

    event.preventDefault();
    addNamePoolEntry();
  });
  achievementsModal.onclick = (e) => {
    if (e.target === achievementsModal) {
      closeAchievementsModalDialog();
    }
  };
  gameSettingsModal.onclick = (e) => {
    if (e.target === gameSettingsModal) {
      closeGameSettingsModalDialog();
    }
  };
  namePoolModal.onclick = (e) => {
    if (e.target === namePoolModal) {
      closeNamePoolModalDialog();
    }
  };
  infoModal.onclick = (e) => {
    if (e.target === infoModal) {
      closeInfoModalDialog();
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

    if (e.key === "Escape" && !gameSettingsModal.classList.contains("hidden")) {
      closeGameSettingsModalDialog();
      return;
    }

    if (e.key === "Escape" && !namePoolModal.classList.contains("hidden")) {
      closeNamePoolModalDialog();
      return;
    }

    if (e.key === "Escape" && !infoModal.classList.contains("hidden")) {
      closeInfoModalDialog();
    }
  });

  document.addEventListener("pointerdown", (e) => {
    if (
      !e.target.closest(".namePoolRow") &&
      !e.target.closest("#deleteSelectedNames")
    ) {
      clearNamePoolSelection();
    }
    if (
      !e.target.closest(".scoreHistoryRow.selectable") &&
      !e.target.closest(".historySelectionDeleteZone")
    ) {
      clearHistorySelection();
    }

    closeOpenAddModuleMenus(e.target);

    if (topGameSetup && !topGameSetup.contains(e.target)) {
      closeTopGameSetupPanel();
    }

  });
  document.addEventListener("pointerup", stopHistorySelectionDrag);
  document.addEventListener("pointercancel", stopHistorySelectionDrag);
  window.addEventListener("blur", stopHistorySelectionDrag);
  scoreBoard.addEventListener("pointerenter", () => {
    scoreBoardPointerInside = true;
    scoreScrollLastTime = performance.now();
  });
  scoreBoard.addEventListener("pointerleave", () => {
    scoreBoardPointerInside = false;
    scoreScrollLastTime = performance.now();
  });
  allTimeCarouselBoard.addEventListener("pointerenter", () => {
    allTimeBoardPointerInside = true;
    allTimeScrollLastTime = performance.now();
  });
  allTimeCarouselBoard.addEventListener("pointerleave", () => {
    allTimeBoardPointerInside = false;
    allTimeScrollLastTime = performance.now();
  });
}

function setupTopGameSetupPanel() {
  if (!topGameSetup || !topGameSetupToggle) return;

  topGameSetupToggle.addEventListener("click", () => {
    const open = !topGameSetup.classList.contains("open");

    topGameSetup.classList.toggle("open", open);
    topGameSetupToggle.setAttribute("aria-expanded", String(open));
    topGameSetupToggle.setAttribute(
      "aria-label",
      open ? "Close main menu" : "Open main menu",
    );
  });

  document.querySelectorAll(".settingsAccordion").forEach((details) => {
    details.addEventListener("toggle", () => {
      if (!details.open && details.contains(document.activeElement)) {
        document.activeElement.blur();
      }
    });
    details
      .querySelector(".playerSettingsClose")
      ?.addEventListener("click", () => {
        details.open = false;
      });
  });

}

function closeTopGameSetupPanel() {
  topGameSetup?.classList.remove("open");
  topGameSetupToggle?.setAttribute("aria-expanded", "false");
  topGameSetupToggle?.setAttribute("aria-label", "Open main menu");
}

async function init() {
  savedGames = getSavedGames();
  await loadRandomPlayerNames();
  cleanupUnknownGameLeaderboardData();
  restoreTodayLeaderboard();
  await loadInterceptorSettings();

  setupSharedControls();
  players.forEach(setupPlayer);
  updateAllPlayerStatuses();
  renderScoreBoard();
  restartAllTimeCarouselCycle();
  startDrawLoop();

  if (Object.keys(savedGames).length === 0) {
    players.forEach((player) => {
      setPlayerStatus(player, "No saved games found in local storage.", false);
    });
  }

  loadCameras();
}

init();
