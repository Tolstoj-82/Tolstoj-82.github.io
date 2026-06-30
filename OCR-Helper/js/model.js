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
