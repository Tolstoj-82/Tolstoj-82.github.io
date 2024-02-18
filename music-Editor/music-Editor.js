
let audioContext = null; // Declare audioContext outside the function

let playSymbol = "▶️";
let stopSymbol = "⏹️";
let pauseSymbol = "⏸️";

// Function to find the last selected octave value for a given row and column
function findLastOctave(row, col) {
    let prevRow = row - 1;
    while (prevRow >= 0) {
        const prevOctaveSelect = document.getElementById('octave_' + prevRow + '_' + col);
        if (prevOctaveSelect.value !== '') {
            return prevOctaveSelect.value;
        }
        prevRow--;
    }
    return '4'; // If no non-empty octave value is found above, default to '4'
}

// Track the currently playing tones on each channel
const activeTones = {
    1: null, // Square 1
    2: null, // Square 2
    3: null, // Wave
    4: null  // Noise
};


function makeTone(note, octave, channelNumber, lengthMs, waveForm = 1, volume = 0.5) {
    
    if (!audioContext) {
        // Create the AudioContext if it doesn't exist
        audioContext = new AudioContext();
    }
    
    const oscillatorTypes = ['sine', 'square', 'sawtooth', 'triangle'];

    function getFrequency(note, octave) {
        const notesMap = {
            'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13, 'E': 329.63,
            'F': 349.23, 'F#': 369.99, 'G': 392.00, 'G#': 415.30, 'A': 440.00,
            'A#': 466.16, 'B': 493.88
        };
        const baseFrequency = notesMap[note];
        return baseFrequency * Math.pow(2, octave - 4);
    }

    if (note === "X") {
        // Stop the oscillator if the note is "X"
        const previousTone = activeTones[channelNumber];
        if (previousTone) {
            previousTone.stop();
            delete activeTones[channelNumber]; // Remove reference
        }
        return; // Exit the function since no note needs to be played
    }

    const frequency = getFrequency(note, octave);
    const oscillator = audioContext.createOscillator();
    oscillator.type = oscillatorTypes[waveForm - 1];
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();

    // Stop the previous oscillator on the same channel, if any
    const previousTone = activeTones[channelNumber];
    if (previousTone) {
        previousTone.stop();
    }

    // Store the reference to the currently playing tone
    activeTones[channelNumber] = oscillator;

    // Stop the oscillator after the specified length in milliseconds
    oscillator.stop(audioContext.currentTime + (lengthMs / 1000));
}


document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("play-section").value = playSymbol;
    
    const gridContainer = document.querySelector('.grid-container');

    // Create selection options with empty selected by default
    const musicRows = 64;
    const musicCols = 5;
    const emptyOption = document.createElement('option');
    const notes = ['', 'X', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octaves = ['', '2', '3', '4', '5', '6'];
    const channels = ["Sq1_", "Sq2_", "Wav_", "Noise_"];

    // Populate the grid with selection options
    for (let i = 0; i < musicRows; i++) {
        for (let j = 0; j < musicCols; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if(j != 0){
                // Get the channel
                const channel = channels[j-1];
                // Get the cell ID
                const cellId = channel + i;

                // give the cell an ID
                cell.setAttribute('id', cellId);
                
                // Data rows
                const selectContainer = document.createElement('div');
                selectContainer.classList.add('select-container');
                const noteSelect = document.createElement('select');
                const octaveSelect = document.createElement('select');
                
                // add the note selection
                notes.forEach(note => {
                    const option = document.createElement('option');
                    option.value = note;
                    option.textContent = note;
                    noteSelect.appendChild(option);
                });

                // add the octave selection
                octaves.forEach(octave => {
                    const option = document.createElement('option');
                    option.value = octave;
                    option.textContent = octave;
                    octaveSelect.appendChild(option);
                });

                // Set IDs for select elements
                noteSelect.id = 'note_' + i + '_' + j;
                octaveSelect.id = 'octave_' + i + '_' + j;

                selectContainer.appendChild(noteSelect);
                selectContainer.innerHTML += "&nbsp;-&nbsp;";
                selectContainer.appendChild(octaveSelect);
                cell.appendChild(selectContainer);
            }else{
                cell.innerHTML = ("0" + i).slice(-2);
                cell.classList.add('number');
            }
            gridContainer.appendChild(cell);
        
        }   
    }

    // Now that all elements are appended, set up event listeners
    for (let i = 0; i < musicRows; i++) {
        for (let j = 0; j < musicCols; j++) {
            if (j != 0) {
                const noteSelect = document.getElementById('note_' + i + '_' + j);
                const octaveSelect = document.getElementById('octave_' + i + '_' + j);
    
                noteSelect.addEventListener('change', function () {
                    const lastOctave = findLastOctave(i, j);
                    if (octaveSelect.selectedIndex === 0 && lastOctave !== '') {
                        octaveSelect.value = lastOctave;
                    } else if (octaveSelect.selectedIndex === 0) {
                        octaveSelect.value = '4';
                    }
    
                    applyColorCoding(noteSelect, octaveSelect);
                });
    
                octaveSelect.addEventListener('change', function () {
                    applyColorCoding(noteSelect, octaveSelect);
                });
            }
        }
    }
    
    function applyColorCoding(noteSelect, octaveSelect) {
        if (noteSelect.value !== "" && octaveSelect.value !== "") {
            noteSelect.style.backgroundColor = "lightgreen";
            octaveSelect.style.backgroundColor = "lightgreen";
        } else if (noteSelect.value !== "" && octaveSelect.value === "") {
            noteSelect.style.backgroundColor = "lightgreen";
            octaveSelect.style.backgroundColor = "lightcoral";
        } else {
            noteSelect.style.backgroundColor = "";
            octaveSelect.style.backgroundColor = "";
        }
        
        if(noteSelect.value != "" &&  octaveSelect.value !=""){
            var selectedOption = document.getElementById("sq1-select").value;
            makeTone(noteSelect.value, octaveSelect.value, 1, 400, selectedOption);
        }
    }
});

// Variable to track if the function is in progress
var isPlaying = false;

function playSection() {

    // If the function is already running, stop it
    if (isPlaying) {
        isPlaying = false;
        document.getElementById("play-section").value = playSymbol;
        resetBackground();
        return;
    }

    // Update the button text to "Stop"
    document.getElementById("play-section").value = stopSymbol;
    isPlaying = true;

    var sq1Enabled = document.getElementById("sq1-toggle").checked;
    var sq2Enabled = document.getElementById("sq2-toggle").checked;
    var waveEnabled = document.getElementById("wave-toggle").checked;
    var noiseEnabled = document.getElementById("noise-toggle").checked;

    var sq1WaveForm = document.getElementById("sq1-select").value;
    var sq2WaveForm = document.getElementById("sq2-select").value;

    var bpm = parseInt(document.getElementById("bpm-number").value);
    var duration = (60000 / bpm) / 4; // Divide the duration by 4 to make it four times faster

    var i = 0;

    function loop() {

        // If the function is no longer playing, stop the loop
        if (!isPlaying) {
            document.getElementById("play-section").value = playSymbol;
            resetBackground();
            return;
        }

        // Reset the background color for all elements
        resetBackground();

        // Setting background color based on checkbox values for the current index i
        document.getElementById("Sq1_" + i).style.backgroundColor = sq1Enabled ? "lightgreen" : "lightgrey";
        document.getElementById("Sq2_" + i).style.backgroundColor = sq2Enabled ? "lightgreen" : "lightgrey";
        document.getElementById("Wav_" + i).style.backgroundColor = waveEnabled ? "lightgreen" : "lightgrey";
        document.getElementById("Noise_" + i).style.backgroundColor = noiseEnabled ? "lightgreen" : "lightgrey";
        
        // Getting selected note and octave values for Sq1
        const noteSq1 = document.getElementById("note_" + i + "_1").value;
        const octaveSq1 = document.getElementById("octave_" + i + "_1").value;
        const noteSq2 = document.getElementById("note_" + i + "_2").value;
        const octaveSq2 = document.getElementById("octave_" + i + "_2").value;
        const noteWav = document.getElementById("note_" + i + "_3").value;
        const octaveWav = document.getElementById("octave_" + i + "_3").value;
        const noteNoise = document.getElementById("note_" + i + "_4").value;
        const octaveNoise = document.getElementById("octave_" + i + "_4").value;

        // Checking if both note and octave are selected
        if (noteSq1 && octaveSq1 && sq1Enabled) {
            makeTone(noteSq1, parseInt(octaveSq1), 1, 400, sq1WaveForm);
        }
        if (noteSq2 && octaveSq2 && sq2Enabled) {
            makeTone(noteSq2, parseInt(octaveSq2), 2, 400, sq2WaveForm);
        }
        if (noteWav && octaveWav && waveEnabled) {
            makeTone(noteWav, parseInt(octaveWav), 3, 400, 1);
        }
        if (noteNoise && octaveNoise && noiseEnabled) {
            makeTone(noteNoise, parseInt(octaveNoise), 4, 400, 2);
        }

        i++;

        // Stop the loop if it reaches the end
        if (i < 64 && isPlaying) {
            setTimeout(loop, duration);
        } else {
            document.getElementById("play-section").value = playSymbol;
            setTimeout(resetBackground, duration);
        }
    }

    // Start the loop
    loop();
}

// Function to reset the background color of all elements
function resetBackground() {
    for (var j = 0; j < 64; j++) {
        document.getElementById("Sq1_" + j).style.backgroundColor = "";
        document.getElementById("Sq2_" + j).style.backgroundColor = "";
        document.getElementById("Wav_" + j).style.backgroundColor = "";
        document.getElementById("Noise_" + j).style.backgroundColor = "";
    }
}