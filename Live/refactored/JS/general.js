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

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('themeSelect').addEventListener('change', updateScheme);

    // Function to update the scheme based on dropdown selection
    function updateScheme() {
        const themeSelect = document.getElementById('themeSelect');
        scheme = themeSelect.value;
        const gridCells = document.querySelectorAll('.grid-cell');
        gridCells.forEach(cell => {
            cell.style.backgroundColor = scheme === 'GB' ? 'white' : 'black';
        });
    }

});

// Call the function to fill the grid
generatePlayfield();