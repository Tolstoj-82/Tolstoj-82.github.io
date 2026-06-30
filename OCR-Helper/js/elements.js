// Elements
//--------------------------------
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const newProjectButton = document.getElementById("newProject");
const autoDetectScreens = document.getElementById("autoDetectScreens");
const calibrationStatus = document.getElementById("calibrationStatus");
const identifierInfo = document.getElementById("identifierInfo");
const video = document.getElementById("video");
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
const importJSONButton = document.getElementById("importJSON");
const importJSONFile = document.getElementById("importJSONFile");
const savedGameSelect = document.getElementById("savedGameSelect");
const loadSavedGameButton = document.getElementById("loadSavedGame");
const saveGameLocalButton = document.getElementById("saveGameLocal");
const deleteSavedGameButton = document.getElementById("deleteSavedGame");

const modalOverlay = document.getElementById("modalOverlay");
const modalMessage = document.getElementById("modalMessage");
const modalOk = document.getElementById("modalOk");
const modalCancel = document.getElementById("modalCancel");
const modalInput = document.getElementById("modalInput");
const modalSelect = document.getElementById("modalSelect");

const shadeBoxes = [
  document.getElementById("shade0"),
  document.getElementById("shade1"),
  document.getElementById("shade2"),
  document.getElementById("shade3"),
];
