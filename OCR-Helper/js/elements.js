const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const newProjectButton = document.getElementById("newProject");
const autoDetectScreens = document.getElementById("autoDetectScreens");
const showRegionsToggle = document.getElementById("showRegionsToggle");
const useOptimizedScanToggle = document.getElementById(
  "useOptimizedScanToggle",
);
const snapshotToggle = document.getElementById("snapshotToggle");
const snapshotLibraryButton = document.getElementById("snapshotLibraryButton");
const calibrationStatus = document.getElementById("calibrationStatus");
const activeScreenTitle = document.getElementById("activeScreenTitle");
const identifierInfo = document.getElementById("identifierInfo");
const identifierSection = document.getElementById("identifierSection");
const identifierInfoContent = document.getElementById("identifierInfoContent");
const video = document.getElementById("video");
const cameraSelect = document.getElementById("cameraSelect");
const tilesContainer = document.getElementById("tilesContainer");
const roiList = document.getElementById("roiList");
const jsonOutput = document.getElementById("jsonOutput");
const tileCount = document.getElementById("tileCount");
const canvasContainer = document.querySelector(".canvasContainer");
const toggleCapture = document.getElementById("toggleCapture");
const uploadTileImageButton = document.getElementById("uploadTileImage");
const uploadTileImageFile = document.getElementById("uploadTileImageFile");
const tileImageModalOverlay = document.getElementById("tileImageModalOverlay");
const tileImagePreview = document.getElementById("tileImagePreview");
const tileImageInvert = document.getElementById("tileImageInvert");
const confirmTileImageImport = document.getElementById(
  "confirmTileImageImport",
);
const cancelTileImageImport = document.getElementById("cancelTileImageImport");
const tileDeleteZone = document.getElementById("tileDeleteZone");
const tilesetContainer = document.getElementById("tilesetContainer");
const addTilesetButton = document.getElementById("addTileset");
const workflowHint = document.getElementById("workflowHint");
const roiReadout = document.getElementById("roiReadout");
const captureROIPicker = document.getElementById("captureROIPicker");
const addAchievementButton = document.getElementById("addAchievement");
const achievementList = document.getElementById("achievementList");
const achievementToastLayer = document.getElementById("achievementToastLayer");
const importJSONButton = document.getElementById("importJSON");
const importJSONFile = document.getElementById("importJSONFile");
const savedGameDropdownButton = document.getElementById(
  "savedGameDropdownButton",
);
const savedGameMenu = document.getElementById("savedGameMenu");
const loadSavedGameButton = document.getElementById("loadSavedGame");
const saveGameLocalButton = document.getElementById("saveGameLocal");
const gameNameInput = document.getElementById("gameName");
const gameNameSuggestions = document.getElementById("gameNameSuggestions");
const gameBoxartButton = document.getElementById("gameBoxartButton");
const gameRecognitionScreenInput = document.getElementById(
  "gameRecognitionScreen",
);
const jsonHighlight = document.getElementById("jsonHighlight");
const lutPaletteSelect = document.getElementById("lutPaletteSelect");
const lutSwatches = document.getElementById("lutSwatches");
const screenGraceMsInput = document.getElementById("screenGraceMs");
const stallOcrOnUnknownTilesToggle = document.getElementById(
  "stallOcrOnUnknownTiles",
);
const identifierMatchCountInput = document.getElementById(
  "identifierMatchCount",
);
const snapshotModalOverlay = document.getElementById("snapshotModalOverlay");
const closeSnapshotModalButton = document.getElementById("closeSnapshotModal");
const snapshotList = document.getElementById("snapshotList");

const modalOverlay = document.getElementById("modalOverlay");
const modalMessage = document.getElementById("modalMessage");
const modalOk = document.getElementById("modalOk");
const modalCancel = document.getElementById("modalCancel");
const modalInput = document.getElementById("modalInput");
const modalSelect = document.getElementById("modalSelect");
const modalChoices = document.getElementById("modalChoices");

const calibrationModalOverlay = document.getElementById(
  "calibrationModalOverlay",
);
const openCalibrationModalButton = document.getElementById(
  "openCalibrationModal",
);
const calibrationHistogram = document.getElementById("calibrationHistogram");
const calibrationHistogramCtx = calibrationHistogram.getContext("2d");
const thresholdValues = document.getElementById("thresholdValues");
const saveCalibrationModalButton = document.getElementById(
  "saveCalibrationModal",
);
const discardCalibrationModalButton = document.getElementById(
  "discardCalibrationModal",
);
const resetCalibrationAutoButton = document.getElementById(
  "resetCalibrationAuto",
);

const tileSelectionBoxElement = document.getElementById("tileSelectionBox");
