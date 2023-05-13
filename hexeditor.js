/////////////////////////////////////////////////////////////////////////////////////////
//
// ROM HEX Editor and Game Genie code patcher
//
/////////////////////////////////////////////////////////////////////////////////////////
// 
// Known issues:
// -------------
// * Bigger files mess up the performance (continuous loading?)
// * Flakey behavior with the loading animation
// * Flakey behavior with the drag handle on the game genie modal
// * Flakey behavior with the toast message height
//
// Todo:
// -----
// * Clean up the mess!!!
//   1) global variables
//   2) get DOM elements (in DOM elements ready envent listener)
//   3) event listeners
// * Only allow adresses from 0x0000-0x7FFF (well...)
// * functions gg2Addr() and addr2Gg(). Also improve it
// * Correct the global checksum (https://gbdev.io/pandocs/The_Cartridge_Header.html)
// * make sure the classes "editing" and "edited" are assigned correctly
// * only show the save option, when at least one modification has been made
// 
// Tasks for the future:
// --------------------
// * make the header data editable
// * maybe make some tweaks easier
// * add a ROM map (https://datacrystal.romhacking.net/wiki/Tetris_(Game_Boy):ROM_map)
// * add a RAM map (https://datacrystal.romhacking.net/wiki/Tetris_(Game_Boy):RAM_map)
// * check out how difficult it is to work with ROMs that require ROM bank switching
//    * maybe the banks are at fixed positions - then it shouldn't be a problem
// * identify the tiles and make them editable
// 
// Tasks for the distant future (mabe?):
// -------------------------------------
// * find the OP-codes and also show these in assembly style
// * identify tables and tile maps
// 
// Tolstoj & ChatGPT 2023
//
/////////////////////////////////////////////////////////////////////////////////////////

const disabledButtonText = "nothing to apply - add a code first";
let e_ggCode;

// everything that needs the site to be loaded goes in here
document.addEventListener('DOMContentLoaded', function() {

  // get the DOM elements
  e_ggCode = document.getElementById("ggCode");
  e_romAddr = document.getElementById("romAddr");
  e_oldVal = document.getElementById("oldVal");
  e_newVal = document.getElementById("newVal");
  e_applyCode = document.getElementById("applyCode");
  e_searchInput = document.getElementById("searchInput");

  e_applyCode.setAttribute("title", disabledButtonText);
 
  // for the game genie code that only spawns 1 piece type, this can change the orientation
  const e_pieceOri = document.getElementById("pieceOri");

  e_pieceOri.addEventListener("change", function() {
    const selectedOption = parseInt(e_pieceOri.value, 16);
  
    const links = document.querySelectorAll(".copyLink.pieceSpawn");
  
    links.forEach(link => {
      const linkText = link.textContent;
      const originalDigit = parseInt(link.dataset.north, 16);
      const updatedDigit = ((originalDigit + selectedOption) % 16).toString(16).toUpperCase();
      const updatedLinkText = linkText.replace(/(\w)(\w)(.*)/, `$1${updatedDigit}$3`);
      link.textContent = updatedLinkText;
  
      // Add animation class to the link element after a small delay
      setTimeout(() => {
        link.classList.add('link-animation');
      }, 10);
  
      // Remove the animation class after animation completes
      setTimeout(() => {
        link.classList.remove('link-animation');
      }, 1010);
    });
  });

  // Add event listener for "input" event
  e_ggCode.addEventListener("input", handleInput);

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

  // Get all the link elements
  const copyLinks = document.querySelectorAll('.copyLink');

// Add click event listener to each link
copyLinks.forEach(function(linkElement) {
  linkElement.addEventListener('click', function(event) {
    event.preventDefault();
    const textToCopy = linkElement.textContent;
    e_ggCode.value = textToCopy;

    // when a link is clicked add the GG code and make the link green if it worked
    handleInput();
    if (applyCode()) {
      this.classList.add('clicked');
      //this.classList.add('green');
    }
  });
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

    // add the file name to the field patchRomName
    var patchRomNameInput = document.getElementById("patchRomName");
    var fileNameWithoutExtension = file.name.replace(".gb", "");
    patchRomNameInput.value = fileNameWithoutExtension + "-modified";

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
      const addressID = i.toString(16).toUpperCase().padStart(4, '0');
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
    const log = document.getElementById("log");
    log.value = logText + "\n" + log.value;
  }

  function scrollToAddress(address) {
    
    returnValue = false;
    oriAddr = address;
    address = parseInt(address, 16) - 16;
    oriAddr = parseInt(oriAddr, 16);
    address = address.toString(16).toUpperCase().padStart(4, '0');
    oriAddr = oriAddr.toString(16).toUpperCase().padStart(4, '0');
    
    address = address.slice(0, -1) + "0";
    const anchorElement = document.getElementById(address);

    // check it the address exists - if not show red toast
    if (anchorElement) {
      
      anchorElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Apply the pulsate animation after a slight delay
      setTimeout(function() {
        const tdElement = document.getElementById(oriAddr);
        tdElement.style.animation = 'pulsate 2s';
  
        // Reset the animation after it completes
        tdElement.addEventListener('animationend', function () {
          tdElement.style.animation = '';
        });

      }, 500); // Adjust the delay as needed
      
      returnValue = true;

    } else {
      
      // show message and erase the non-sensical input
      displayToast("wrongAddress");
      const searchInput = document.getElementById("searchInput");
      searchInput.value = "";
      searchInput.focus();

    }
    
    return returnValue;
  }
  
  
  function showLoadingAnimation() {
    document.getElementById("loadingAnimation").style.display = "block";
    document.getElementById("wrapper2").style.display = "none";
  }

  function hideLoadingAnimation() {
    document.getElementById("loadingAnimation").style.display = "none";
  }