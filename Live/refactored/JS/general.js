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

// Function to refresh the list of devices
async function resetDevices() {
    const devicesList = await getConnectedDevices('videoinput');
    updateDeviceList(devicesList);
}

// Listen for changes in connected devices
navigator.mediaDevices.addEventListener('devicechange', resetDevices);

// Initial call to populate the device list
resetDevices();

function generatePlayfield() {
    // Fill the grid with 180 cells (10x18)
    const gridContainer = document.querySelector('.grid-container');
    gridContainer.innerHTML = '';

    for (let i = 0; i < 180; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        gridContainer.appendChild(cell);
    }

    // Nextbox
    const nextBox = document.querySelector('.next-box');
    nextBox.innerHTML = '';

    for (let i = 0; i < 16; i++) {
        const cell = document.createElement('div');
        cell.className = 'next-box-cell';
        nextBox.appendChild(cell);
    }
}

function updateScheme() {
    scheme = themeSelect.value;
    
    // playfield
    const gridCells = document.querySelectorAll('.grid-cell');
    gridCells.forEach(cell => {
        cell.style.backgroundColor = scheme === 'GB' ? 'white' : 'black';
    });

    // nextbox
    const nextBoxCells = document.querySelectorAll('.next-box-cell');
    nextBoxCells.forEach(cell => {
        cell.style.backgroundColor = scheme === 'GB' ? 'white' : 'black';
    });

}

themeSelect.addEventListener('change', updateScheme);

// Call the function to fill the grid
generatePlayfield();