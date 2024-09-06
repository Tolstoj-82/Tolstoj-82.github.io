//---------------------------------------------------------------
// VARIABLES
//---------------------------------------------------------------
let intervalId;
let frameState = "";
let recordingFrameNumber = 0;
let isRecording = false;
let recordingData = [];
let lastFrameContent = '';
let frameStart = 0;
let scaleFactor = 8;
let scheme = "GB";

// DOM Elements
const slider = document.getElementById('slider');
const sliderValue = document.getElementById('sliderValue');
const gridContainer = document.getElementById('grid-container');
const recordButton = document.getElementById('recordButton');
const minoMatrix = document.getElementById('minoMatrix');
const recordingTextArea = document.getElementById('recording');
const cameraSelect = document.getElementById('cameraSelect');
const videoElement = document.getElementById('video');