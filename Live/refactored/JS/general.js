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
    const gridContainer = document.querySelector('.grid-container');
    gridContainer.innerHTML = '';

    // Fill the grid with 180 cells (10x18)
    for (let i = 0; i < 180; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        gridContainer.appendChild(cell);
    }
}

function updateScheme() {
    scheme = themeSelect.value;
    const gridCells = document.querySelectorAll('.grid-cell');
    
    gridCells.forEach(cell => {
        cell.style.backgroundColor = scheme === 'GB' ? 'white' : 'black';
    });
}

themeSelect.addEventListener('change', updateScheme);



// Call the function to fill the grid
generatePlayfield();