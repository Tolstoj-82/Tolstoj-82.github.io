// State
//--------------------------------
let drawLoopRunning = false;
let lastOCRValues = {};
let highlightedIdentifierTile = null;
let highlightedIdentifierIntensity = 0;
let captureROIIds = new Set();
let captureStartTime = null;
let stream = null;

let calibrated = false;
let palette = [240, 160, 80, 0];
let lut = [null, null, null, null];
let applyLUT = false;
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
let calibrationReminder = false;

let calibrationSamples = [];
let calibrationThresholds = [64, 128, 192];
let calibrationMode = "auto";
let calibrationQuality = "none";
let pendingCalibrationThresholds = null;
let pendingPalette = null;

let autoCalibrationThresholds = [64, 128, 192];
let autoCalibrationPalette = [240, 160, 80, 0];
let selectedThresholdIndex = null;

let selectedTiles = new Map();
let tileSelectionSource = null;
let tileSelectionBox = null;

let tileSelectionDrag = null;

let tileSelectionDragStartIds = new Set();
