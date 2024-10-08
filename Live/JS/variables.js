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
const gridRows = 18;
const blockSize = 8;

// DOM Elements
const canvas            = document.getElementById('canvas');
const context           = canvas.getContext('2d');
const slider            = document.getElementById('slider');
const sliderValue       = document.getElementById('sliderValue');
const gridContainer     = document.getElementById('grid-container');
const nextBoxContainer  = document.getElementById('next-box');
const recordButton      = document.getElementById('recordButton');
const minoMatrix        = document.getElementById('minoMatrix');
const recordingTextArea = document.getElementById('recording');
const cameraSelect      = document.getElementById('cameraSelect');
const videoElement      = document.getElementById('video');

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