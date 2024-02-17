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

function makeTone(note, octave, lengthMs, volume = 0.5, waveForm = 1) {
    const audioContext = new AudioContext();

    const oscillatorTypes = ['sine','square','sawtooth','triangle'];

    // Function to calculate the frequency of a given note in a given octave
    function getFrequency(note, octave) {
        const notesMap = {
            'C' : 261.63,
            'C#': 277.18,
            'D' : 293.66,
            'D#': 311.13,
            'E' : 329.63,
            'F' : 349.23,
            'F#': 369.99,
            'G' : 392.00,
            'G#': 415.30,
            'A' : 440.00,
            'A#': 466.16,
            'B' : 493.88
        };
        const baseFrequency = notesMap[note];
        return baseFrequency * Math.pow(2, octave - 4); // A4 is at 440Hz, each octave doubles the frequency
    }

    // Calculate frequency based on note and octave
    const frequency = getFrequency(note, octave);

    // Create an oscillator node
    const oscillator = audioContext.createOscillator();
    oscillator.type = oscillatorTypes[waveForm-1];
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

    // Create a gain node for volume control
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);

    // Connect oscillator to gain node and gain node to audio output
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Start the oscillator
    oscillator.start();

    // Stop the oscillator after the specified length in milliseconds
    oscillator.stop(audioContext.currentTime + (lengthMs / 1000));
}

document.addEventListener("DOMContentLoaded", function() {
    const gridContainer = document.querySelector('.grid-container');

    // Create selection options with empty selected by default
    const musicRows = 64;
    const musicCols = 5;
    const emptyOption = document.createElement('option');
    const notes = ['', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
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
            octaveSelect.style.backgroundColor = "lightcoral"; // Light red
        } else {
            noteSelect.style.backgroundColor = "";
            octaveSelect.style.backgroundColor = "";
        }
        
        if(noteSelect.value != "" &&  octaveSelect.value !=""){
            var selectedOption = document.getElementById("sq1-select").value;
            makeTone(noteSelect.value, octaveSelect.value, 400, selectedOption);
        }
    }
});