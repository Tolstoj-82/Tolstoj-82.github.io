/////////////////////////////////////////////////////////////////////////////////////////
//
// ROM HEX Editor and Game Genie code patcher
//
/////////////////////////////////////////////////////////////////////////////////////////
// 
// Todo:
// -----
// * Clean up the messy code and insert useful comments
// * Toast messages instead of the alerts
// * Only allow adresses from 0x0000-0x7FFF (well...)
// * Allow to load a ROM after one has been loaded before
// * functions gg2Addr() and addr2Gg(). Also improve it
// * Only show Address, Old and New, if a GG code has been entered (and is correct --> event listener)
// * Correct the global checksum (https://gbdev.io/pandocs/The_Cartridge_Header.html)
// * make sure the classes editing and edited are assigned correctly
// * only show the save option, when at least one modification has been made
// 
// Tasks for the future:
// --------------------
// * maybe make some tweaks easier
// * add a ROM map (https://datacrystal.romhacking.net/wiki/Tetris_(Game_Boy):ROM_map)
// * add a RAM map (https://datacrystal.romhacking.net/wiki/Tetris_(Game_Boy):RAM_map)
// * check out how difficult it is to work with ROMs that require ROM bank switching
//    * maybe the banks are at fixed positions - then it shouldn't be a problem
// * identify the tiles and make them editable
// * find the OP-codes and also show these in assembly style
// * identify tables (also tile maps)
// 
// Tolstoj & ChatGPT 2023
//
/////////////////////////////////////////////////////////////////////////////////////////


// everything that needs the site to be loaded goes in here
document.addEventListener('DOMContentLoaded', function() {
  
  // Get the input element
  const hexInput = document.getElementById("hexInput");
  
  // Add event listener for "input" event
  hexInput.addEventListener("input", handleInput);

  var accordion = document.querySelector('.accordion');
  var panel = document.querySelector('.panel');

  accordion.addEventListener('click', function() {
    this.classList.toggle('active');
    panel.classList.toggle('active');

    var accordionSymbol = this.querySelector('.accordion-symbol');
    if (this.classList.contains('active')) {
      accordionSymbol.textContent = '-';
      panel.style.maxHeight = panel.scrollHeight + 'px';
    } else {
      accordionSymbol.textContent = '+';
      panel.style.maxHeight = 0;
    }
  });

});

function searchAndSelectCell() {
  const searchInput = document.getElementById('searchInput');
  const address = searchInput.value.trim();
  scrollToAddress(address);
}

function validateFile(event) {
  var file = event.target.files[0];

  // Check if a file is selected
  if (!file) {
    alert('Please select a file.');
    return false;
  }

  // Check the file extension
  var fileExtension = file.name.split('.').pop().toLowerCase();
  if (fileExtension !== 'gb') {
    alert('Only .gb files are allowed.');
    hideLoadingAnimation();
    return false;
  }

  // Check the file size
  var fileSize = file.size / 1024; // in KB
  if (fileSize > 3000) {
    alert('File size should be less than or equal to 3 MB.');
    hideLoadingAnimation();
    return false;
  }

    // Show loading animation
    showLoadingAnimation();

  // Read the file data
  var reader = new FileReader();
  reader.onload = function (event) {
    // File loading completed
    hideLoadingAnimation();

    var fileData = event.target.result;
    var hexData = convertToHex(fileData);
      
      // Create a MutationObserver to detect changes in the table
      var observer = new MutationObserver(function(mutationsList) {
        for (var mutation of mutationsList) {
          if (mutation.type === 'childList' && mutation.target.id === 'hexViewer' && mutation.target.childNodes.length > 0) {
            // Table has been populated, get the title
            obtainHeaderData();
            
            // Disconnect the observer after obtaining the title
            observer.disconnect();
          }
        }
      });

      // Start observing changes in the table
      observer.observe(document.getElementById('hexViewer'), { childList: true });

      // Display or process the hex data
      displayHexData(hexData);

      // change the view wrapper = content / wrapper 2 = chose file
      document.getElementById('wrapper').style.display = 'block';
      document.getElementById('wrapper2').style.display = 'none';
    };

    reader.readAsArrayBuffer(file);

    return true;

  }

  function createFileFromHexData() {
    const table = document.getElementById('hexViewer');
    const rows = table.rows;

    // Create a Uint8Array to hold the file data
    const fileSize = (rows.length - 1) * 16;
    const fileData = new Uint8Array(fileSize);

    for (let i = 1; i < rows.length; i++) {
      const cells = rows[i].cells;

      for (let j = 1; j < cells.length; j++) {
        const cell = cells[j];
        const hexValue = cell.textContent || '00';
        const byteValue = parseInt(hexValue, 16);
        fileData[(i - 1) * 16 + (j - 1)] = byteValue;
      }
    }

    // Create a Blob from the Uint8Array
    const blob = new Blob([fileData]);

    // Create a download link and trigger the download
    newFileName = 'modified_ROM.gb';
    fileNameFromInput = document.getElementById("patchRomName").value + ".gb";
    if(fileNameFromInput != "") newFileName = fileNameFromInput;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = newFileName;
    link.click();
  }

  function convertToHex(fileData) {
    const view = new DataView(fileData);
    const hexValues = [];

    for (let i = 0; i < view.byteLength; i++) {
      const hex = view.getUint8(i).toString(16).toUpperCase().padStart(2, '0');
      hexValues.push(hex);
    }

    return hexValues;
  }

  function displayHexData(hexData) {
    const table = document.getElementById('hexViewer');
    table.innerHTML = '';

    // Create the header row
    const headerRow = table.insertRow();
    headerRow.id = 'headerRow';
    const addressHeader = document.createElement('th');
    addressHeader.textContent = '$';
    headerRow.appendChild(addressHeader);

    for (let i = 0; i < 16; i++) {
      const hexDigit = i.toString(16).toUpperCase();
      const headerCell = document.createElement('th');
      headerCell.textContent = hexDigit;
      headerRow.appendChild(headerCell);
    }

    for (let i = 0; i < hexData.length; i += 16) {
      const row = table.insertRow(); // Add this line to create a new row
      const addressCell = row.insertCell();
      const hexValueCells = [];

      const address = i.toString(16).toUpperCase().padStart(4, '0').slice(0,3) + "_";
      const addressID = i.toString(16).toUpperCase().padStart(4, '0');//address.slice(0, 3) + (parseInt(address.slice(-1), 16) - 1).toString(16).toUpperCase();
      addressCell.innerHTML = `<a href="#${addressID}"></a>${address}`;
      addressCell.className = "baseAddress";
      addressCell.id = address;

      for (let j = 0; j < 16; j++) {
        const hexValue = hexData[i + j] || '';
        const hexValueCell = row.insertCell();
        hexValueCell.className = 'hexValueCell';
        hexValueCell.textContent = hexValue;
        hexValueCell.contentEditable = true;
        const cellID = addressID.slice(0, 3) + j.toString(16).toUpperCase();
        hexValueCell.id = cellID;
        hexValueCells.push(hexValueCell);
      }

      hexValueCells.forEach(cell => {
        cell.addEventListener('input', function(event) {
          const cell = event.target;
          cell.classList.add('editing');
          if (!cell.hasAttribute('data-previous-value')) {
            cell.setAttribute('data-previous-value', cell.textContent);
          }
        });

        cell.addEventListener('blur', function(event) {
          const cell = event.target;
          const value = cell.textContent;

          // Validate input
          if (!/^[0-9A-Fa-f]{0,2}$/.test(value)) {
            cell.textContent = value.slice(0, 2);
            return;
          }

          // Remove any leading zeros
          cell.textContent = value.toUpperCase().padStart(2, '0').slice(-2);

          // Check if the value has changed
          const previousValue = cell.getAttribute('data-previous-value');
          cell.removeAttribute('data-previous-value');
          cell.classList.remove('editing');

          if (previousValue !== cell.textContent) {
            cell.classList.add('edited');
          } else {
            cell.classList.remove('edited');
          }
        });
      });
    }
  }

  function addToLog(logText){
    
    const logDiv = document.getElementById("log");
    const newLineText = document.createTextNode(logText);
    const lineBreak = document.createElement("br");

    // Append the new text node and line break to the div
    logDiv.appendChild(newLineText);
    logDiv.appendChild(lineBreak);
  }

  function scrollToAddress(address) {
    address = (parseInt("0x" + address, 16) - 16).toString(16).toUpperCase();
    while(address.length < 4){
        address = "0" + address;
    }
    address = address.slice(0, -1) + "0";
    const anchorElement = document.getElementById(address);
    anchorElement.scrollIntoView({ behavior: 'smooth' });
  }
  
  function showLoadingAnimation() {
    document.getElementById("loadingAnimation").style.display = "block";
    document.getElementById("wrapper2").style.display = "none";
  }

  function hideLoadingAnimation() {
    document.getElementById("loadingAnimation").style.display = "none";
  }