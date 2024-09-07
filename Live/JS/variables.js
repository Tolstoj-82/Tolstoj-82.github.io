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
const greyValuesArray = [32, 96, 160, 224];

// DOM Elements
const slider = document.getElementById('slider');
const sliderValue = document.getElementById('sliderValue');
const gridContainer = document.getElementById('grid-container');
const recordButton = document.getElementById('recordButton');
const minoMatrix = document.getElementById('minoMatrix');
const recordingTextArea = document.getElementById('recording');
const cameraSelect = document.getElementById('cameraSelect');
const videoElement = document.getElementById('video');

function showToast(message) {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = message.replace(/\n/g, '<br>'); // \n = <br>
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 4000);
}