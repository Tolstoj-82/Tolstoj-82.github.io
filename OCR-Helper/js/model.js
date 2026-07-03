let drawLoopRunning = false;
let lastOCRValues = {};
let highlightedIdentifierTile = null;
let highlightedIdentifierIntensity = 0;
let captureROIIds = new Set();
let captureStartTime = null;
let stream = null;

let calibrated = false;
let cameraReady = false;

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

let autoDetectEnabled = false;
let showRegions = true;
let snapshotPaused = false;

let calibrationSamples = [];
let detectedCalibrationShades = [];
let calibrationThresholds = [64, 128, 192];
let calibrationMode = "auto";
let calibrationQuality = "none";
let pendingCalibrationThresholds = null;

let autoCalibrationThresholds = [64, 128, 192];
let selectedThresholdIndex = null;

let selectedTiles = new Map();
let tileSelectionSource = null;

let tileSelectionDrag = null;

let selectedSavedGameName = "";
