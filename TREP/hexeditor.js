/////////////////////////////////////////////////////////////////////////////////////////
//
// ROM HEX Editor and Game Genie code patcher
// 
// Tolstoj & ChatGPT 2023
//
/////////////////////////////////////////////////////////////////////////////////////////

const disabledButtonText = "nothing to apply - add a code first";
let e_ggCode;
let e_romAddr;
let e_oldVal;
let e_newVal;
let e_applyCode;
let e_searchInput;
let autoApply = false;
let tileDataReady = Promise.resolve();
let activeBGMapName = "";
let bgPreviewRefreshFrame = null;
let pendingHeaderCell = null;
let headerAddressesEnabled = false;
const protectedRomAddresses = new Set(["01FD", "01FE", "01FF"]);

function isProtectedRomAddress(address) {
  return protectedRomAddresses.has(String(address).trim().toUpperCase().padStart(4, "0"));
}

// Initialize the pixelData array
let pixelData = [];

// toggle to automatically apply GG Codes
document.getElementById('autoApplyToggle').addEventListener('change', function() {
  autoApply = this.checked;
});

document.getElementById('addressesToggle').addEventListener('change', function() {
  toggleBGImages();
});

document.getElementById('tileBorders').addEventListener('change', function() {
  document.getElementById("tile-container")
    .classList.toggle("show-tile-borders", this.checked);
});

//------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
  
  // get the DOM elements
  e_ggCode = document.getElementById("ggCode");
  e_romAddr = document.getElementById("romAddr");
  e_oldVal = document.getElementById("oldVal");
  e_newVal = document.getElementById("newVal");
  e_applyCode = document.getElementById("applyCode");
  e_searchInput = document.getElementById("searchInput");

  document.getElementById("romFileInput").addEventListener("change", validateFile);
  initializeRomDropZone();
  e_applyCode.addEventListener("click", () => applyCode(true));
  document.getElementById("searchSequenceButton").addEventListener("click", searchSequenceInCode);
  document.getElementById("searchAddressInput").addEventListener("blur", formatSequenceInput);
  document.getElementById("slider").addEventListener("input", updateSliderValue);
  document.getElementById("navigateAddressButton").addEventListener("click", searchAndSelectCell);
  document.getElementById("createFileBtn").addEventListener("click", createFileFromHexData);
  document.getElementById("gameTitle").addEventListener("keydown", handleGameTitleKeydown);
  document.getElementById("gameTitle").addEventListener("blur", validateGameTitle);

  document.querySelectorAll(".tab[data-tab]").forEach(tabElement => {
    tabElement.addEventListener("click", event => openTab(event, tabElement.dataset.tab));
  });

  document.querySelectorAll(".color-picker").forEach((picker, index) => {
    picker.addEventListener("change", () => {
      updateColorPalette(`.col${index}`, picker.value, picker);
      scheduleBGMapPreviewRefresh();
    });
  });

  document.getElementById("saveButton").addEventListener("click", saveTilesAfterDrawing);
  document.getElementById("discardButton").addEventListener("click", discardChangesOnTiles);
  document.getElementById("closeTileEditorButton").addEventListener("click", discardChangesOnTiles);
  document.getElementById("applyBGMap").addEventListener("click", saveBGMap);
  document.getElementById("discardBGMap").addEventListener("click", closeBGModal);
  document.getElementById("closeBGMapButton").addEventListener("click", closeBGModal);
  document.getElementById("saveBGMapAsBIN").addEventListener("click", downloadBGMapAsBin);

  initializeHeaderEditors();
  initializeHeaderAddressDialog();
  initializeToastCloseButtons();
  initializeBGMapList();

  e_applyCode.setAttribute("title", disabledButtonText);


  // piece orientation (N,E,S,W)
  const selectElements = {
    pieceOri: { element: document.getElementById("pieceOri"), links: ".copyLink.pieceSpawn" },
    nClearedLines: { element: document.getElementById("nClearedLines"), link: document.getElementById("nClearedLinesCode") }
  };
  
  function handleSelectChange() {
    const selectedOptions = Object.values(selectElements).reduce((options, { element }) => {
      options[element.id] = parseInt(element.value, 16);
      return options;
    }, {});

    // Accessing selected option values
    const pieceOriValue = selectedOptions.pieceOri;
    const imageNames = {0: "n.png", 1: "e.png", 2: "s.png", 3: "w.png"};
    const orientationImage = document.getElementById("orientationImage")
    orientationImage.src = "images/" + imageNames[pieceOriValue];
   
    for (const key in selectElements) {
      const { element, links, link } = selectElements[key];
  
      if (key === "pieceOri") {
        const pieceLinks = document.querySelectorAll(links);
        pieceLinks.forEach(link => {
          const { textContent, dataset: { north } } = link;
          const updatedDigit = ((parseInt(north, 16) + selectedOptions.pieceOri) % 16).toString(16).toUpperCase();
          link.textContent = textContent.replace(/(\w)(\w)(.*)/, `$1${updatedDigit}$3`);
          link.classList.add('link-animation');
          setTimeout(() => link.classList.remove('link-animation'), 1010);
        });
      } else if (key === "nClearedLines") {
        const { textContent } = link;
        const updatedLinkText = textContent.replace(/^../, selectedOptions.nClearedLines.toString(16).padStart(2, '0')).toUpperCase();
        link.textContent = updatedLinkText;
        link.classList.remove('inactive');
        link.classList.add('link-animation');
        setTimeout(() => link.classList.remove('link-animation'), 1010);
      }
    }
 }
  
  for (const key in selectElements) {
    selectElements[key].element.addEventListener("change", handleSelectChange);
  }
  
  // Add event listener for "input" event
  e_ggCode.addEventListener("input", handleInput);

  let accordion = document.querySelector('.accordion');
  let panel = document.querySelector('.panel');

  accordion.addEventListener('click', function() {
    this.classList.toggle('active');
    panel.classList.toggle('active');

    let accordionSymbol = this.querySelector('.accordion-symbol');
    if (this.classList.contains('active')) {
      accordionSymbol.textContent = '-';
      panel.style.maxHeight = panel.scrollHeight + 'px';
    } else {
      accordionSymbol.textContent = '+';
      panel.style.maxHeight = 0;
    }

  });

  // pressing enter either applies a gg code or searches an address, depending on the scope
  document.addEventListener('keydown', function(event) {
    if (event.key === "Enter") {
      if (event.target === e_ggCode) {
        applyCode();
      } else if (event.target === e_searchInput) {
        searchAndSelectCell();
      }
    }
  });

  // Get all the link elements
  const copyLinks = document.querySelectorAll('.copyLink');

  function hasValidDisplayedGgCode(linkElement) {
    const code = linkElement.textContent.replace(/[-\s]/g, "").toUpperCase();
    return /^[0-9A-F]{6}$/.test(code) || /^[0-9A-F]{9}$/.test(code);
  }

  function updateCopyLinkState(linkElement) {
    const isValid = hasValidDisplayedGgCode(linkElement);
    linkElement.classList.toggle("inactive", !isValid);
    linkElement.setAttribute("aria-disabled", String(!isValid));
    if (isValid) {
      linkElement.removeAttribute("tabindex");
    } else {
      linkElement.setAttribute("tabindex", "-1");
    }
  }

  // Keep generated labels display-only until they contain a complete valid code.
  copyLinks.forEach(function(linkElement) {
    updateCopyLinkState(linkElement);
    new MutationObserver(() => updateCopyLinkState(linkElement)).observe(linkElement, {
      childList: true,
      characterData: true,
      subtree: true
    });

    linkElement.addEventListener('click', function(event) {
      event.preventDefault();
      if (!hasValidDisplayedGgCode(linkElement)) {
        return;
      }
      const textToCopy = linkElement.textContent;
      e_ggCode.value = textToCopy;

      // when a link is clicked add the GG code and make the link green if it worked
      handleInput();
      if (applyCode()) {
        this.classList.add('clicked');
      }
    });
  });

  // Get the dropdown element
  const dropdown = document.getElementById("palette-dropdown");

  // Iterate over the paletteLookup object keys and create an option for each palette
  for (const palette in paletteLookup) {
    // Create a new option element
    const option = document.createElement("option");

    // Set the option text to the palette name
    option.text = palette;

    // Append the option to the dropdown
    dropdown.add(option);
  }

  dropdown.addEventListener("change", function() {
    // Get the selected palette name
    const selectedPalette = this.value;
    
    // Get the color values for the selected palette
    const colors = paletteLookup[selectedPalette];
    
    // Set the color values to the color pickers
    for (let i = 0; i < colors.length; i++) {
      const colorPicker = document.getElementById(`color-picker-${i}`);
      colorPicker.value = "#" + colors[i];
      
      // Trigger the 'change' event to update the CSS class and any related elements
      colorPicker.dispatchEvent(new Event('change'));
    }
  });
});

function initializeRomDropZone() {
  const input = document.getElementById("romFileInput");
  const dropZone = document.getElementById("wrapper2");
  let dragDepth = 0;

  dropZone.addEventListener("dragenter", event => {
    event.preventDefault();
    dragDepth++;
    dropZone.classList.add("drag-over");
  });

  dropZone.addEventListener("dragover", event => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  });

  dropZone.addEventListener("dragleave", event => {
    event.preventDefault();
    dragDepth = Math.max(0, dragDepth - 1);
    if (dragDepth === 0) {
      dropZone.classList.remove("drag-over");
    }
  });

  dropZone.addEventListener("drop", event => {
    event.preventDefault();
    dragDepth = 0;
    dropZone.classList.remove("drag-over");

    const file = event.dataTransfer.files[0];
    if (!file) {
      return;
    }

    const transfer = new DataTransfer();
    transfer.items.add(file);
    input.files = transfer.files;
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });
}

function initializeHeaderAddressDialog() {
  const dialog = document.getElementById("enableHeaderDialog");
  const confirmButton = document.getElementById("enableHeaderAddresses");
  const cancelButton = document.getElementById("cancelHeaderAddresses");

  confirmButton.addEventListener("click", () => {
    headerAddressesEnabled = true;
    document.querySelectorAll("#hexViewer .hexValueCell.header").forEach(cell => {
      if (isProtectedRomAddress(cell.id)) return;
      cell.contentEditable = "true";
      cell.classList.add("header-enabled");
    });
    dialog.close();
    pendingHeaderCell = null;
  });

  cancelButton.addEventListener("click", () => {
    pendingHeaderCell = null;
    dialog.close();
  });

  dialog.addEventListener("cancel", () => {
    pendingHeaderCell = null;
  });
}

function requestHeaderAddressAccess(cell) {
  if (headerAddressesEnabled) {
    return;
  }

  pendingHeaderCell = cell;
  const dialog = document.getElementById("enableHeaderDialog");
  if (!dialog.open) {
    dialog.showModal();
  }
}


//------------------------------------------------------------------------------------------
// Background-map previews and selection list
function initializeBGMapList() {
  const list = document.getElementById("bgMapList");

  for (const [name, mapInfo] of Object.entries(bgMaps)) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "bg-map-entry";
    button.dataset.bgMapName = name;

    const preview = document.createElement("img");
    preview.className = "bg-map-preview";
    preview.alt = `${name} preview`;

    const label = document.createElement("span");
    label.className = "bg-map-name";
    label.textContent = name;

    button.append(preview, label);
    button.addEventListener("click", () => getBGMap(mapInfo[0], name));
    list.appendChild(button);
  }
}

function renderBGMapPreview(name) {
  const mapInfo = bgMaps[name];
  if (!mapInfo) return;

  const [startAddress, columns, rows, tileSetName, , gapValue] = mapInfo;
  assignVramTileSet(vRamTileSets[tileSetName], false);

  const previewScale = 2;
  const canvas = document.createElement("canvas");
  canvas.width = columns * 8 * previewScale;
  canvas.height = rows * 8 * previewScale;
  const context = canvas.getContext("2d");
  context.imageSmoothingEnabled = false;
  const colors = Array.from({ length: 4 }, (_, index) =>
    document.getElementById(`color-picker-${index}`).value
  );
  context.fillStyle = colors[0];
  context.fillRect(0, 0, canvas.width, canvas.height);

  const start = parseInt(startAddress, 16);
  const gap = gapValue ? parseInt(gapValue, 10) : 1;
  for (let index = 0; index < columns * rows; index++) {
    const address = (start + index * gap).toString(16).padStart(4, "0").toUpperCase();
    const romCell = document.getElementById(address);
    if (!romCell) continue;

    const tileId = romCell.textContent.trim().toUpperCase();
    const tile = document.querySelector(`.tile[data-vram="${tileId}"]`);
    if (!tile) continue;

    const tileX = (index % columns) * 8 * previewScale;
    const tileY = Math.floor(index / columns) * 8 * previewScale;
    tile.querySelectorAll(".pixel").forEach((pixel, pixelIndex) => {
      const colorClass = Array.from(pixel.classList).find(className => /^col[0-3]$/.test(className));
      const colorIndex = colorClass ? Number(colorClass.slice(3)) : 0;
      context.fillStyle = colors[colorIndex];
      context.fillRect(
        tileX + pixelIndex % 8 * previewScale,
        tileY + Math.floor(pixelIndex / 8) * previewScale,
        previewScale,
        previewScale
      );
    });
  }

  const entry = Array.from(document.querySelectorAll(".bg-map-entry"))
    .find(button => button.dataset.bgMapName === name);
  const preview = entry ? entry.querySelector(".bg-map-preview") : null;
  if (preview) preview.src = canvas.toDataURL("image/png");
}

function refreshBGMapPreviews() {
  for (const name of Object.keys(bgMaps)) renderBGMapPreview(name);
}

function scheduleBGMapPreviewRefresh() {
  if (!document.querySelector("#hexViewer .hexValueCell") || !document.querySelector(".tile")) return;
  cancelAnimationFrame(bgPreviewRefreshFrame);
  bgPreviewRefreshFrame = requestAnimationFrame(refreshBGMapPreviews);
}


//------------------------------------------------------------------------------------------
// save the bg map and close the modal
function saveBGMap(bgMap) {

  let olElement = document.getElementById("selectable");
  let imgElements = olElement.querySelectorAll("li img");
  let startAddress = document.getElementById("BGMapStartAddress").value;

  let currentAddress = parseInt(startAddress, 16);

  imgElements.forEach(function(imgElement) {

    let tileID = imgElement.getAttribute("data-tile-id");

    // Extract the number from the image ID (assuming the ID is in the format "bg-tile-X" where X is the number)
    let tileNumber = parseInt(imgElement.id.replace("bg-tile-", ""), 16);

    // Calculate the address based on the tile number and the starting address
    let hexAddress = (currentAddress + tileNumber).toString(16).toUpperCase().padStart(4, '0');

    let td = document.getElementById(hexAddress);
    if (td && !isProtectedRomAddress(hexAddress)) td.textContent = tileID;
  });

  closeBGModal();
  scrollToAddress(startAddress);
  document.getElementById("createFileBtn").removeAttribute("disabled");
  
  renderBGMapPreview(activeBGMapName);
  addToLog("Background map \"" + activeBGMapName + "\" overwritten.");
}



//-----------------------------------------------------------------------------------------
// save the bg map and close the modal
function downloadBGMapAsBin() {
  let olElement = document.getElementById("selectable");
  let imgElements = olElement.querySelectorAll("li img");
  let tileIDs = [];

  imgElements.forEach(function (imgElement) {
    let tileID = imgElement.getAttribute("data-tile-id");
    tileIDs.push(parseInt(tileID, 16)); // Ensure IDs are treated as numbers
    
  });

  let byteArray = new Uint8Array(tileIDs.length);


  for (let i = 0; i < tileIDs.length; i++) {
    byteArray[i] = tileIDs[i];
  }

  let blob = new Blob([byteArray], { type: "application/octet-stream" });
  let url = URL.createObjectURL(blob);

  let bgMapName = activeBGMapName;
  let bgMapInfo = bgMaps[bgMapName];
  let bgMapFileName = bgMapInfo[4];

  let a = document.createElement("a");
  a.href = url;
  a.download = bgMapFileName;

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  addToLog("BG Map Saved: \"" + bgMapName + "\" >> \"" + bgMapFileName + "\"");
}

//------------------------------------------------------------------------------------------
// close the bg map modal without saving
  function closeBGModal(){
    document.getElementById("BG-myModal").style.display = "none";
    
    // make sure, the key press event listeners are disabled once the modal closes
    disableKeyPressTracking();
  }

//------------------------------------------------------------------------------------------
// Adds text to the Log
function addToLog(logText){
  const log = document.getElementById("log");
  const entry = document.createElement("li");
  entry.textContent = logText + " (" + formattedTime() + ")";
  log.prepend(entry);
  enableDownload();
  updateChecksums(true);
}

//------------------------------------------------------------------------------------------
// enables download button if changes were made
function enableDownload() {
let button = document.getElementById("createFileBtn");
button.removeAttribute("disabled");
}

//------------------------------------------------------------------------------------------
// scrolls to and highlights address (User search)
function searchAndSelectCell() {
  const searchInput = document.getElementById('searchInput');
  const address = searchInput.value.trim();
  if(address !== "") scrollToAddress(address);
}

//------------------------------------------------------------------------------------------
// Checksums
function updateChecksums(updateInRom) {
  let headerChecksum = 0;
  const hexValueCellElements = document.querySelectorAll('.hexValueCell');

  hexValueCellElements.forEach(element => {
    const hexValue = parseInt(element.textContent.trim(), 16);
    if (!isNaN(hexValue)) {
      if (element.id >= '0134' && element.id <= '014C') { // ignore the global checksum addresses for the header checksum
        headerChecksum -= hexValue + 1;
      }
    }
  });

  headerChecksum &= 0xFF; // Keep only the lower 8 bits

  const headerChecksumField = document.getElementById('headerChecksum');
  headerChecksumField.value = headerChecksum.toString(16).toUpperCase().padStart(2, '0');

  let globalChecksum = 0;

  hexValueCellElements.forEach(element => {
    const hexValue = parseInt(element.textContent.trim(), 16);
    if (!isNaN(hexValue)) {
      if (element.id !== '014E' && element.id !== '014F') {
        globalChecksum += hexValue;
      }
    }
  });

  globalChecksum &= 0xFFFF; // Keep only the lower 16 bits

  const globalChecksumField = document.getElementById('globalChecksum');
  globalChecksumField.value = globalChecksum.toString(16).toUpperCase().padStart(4, '0');

  if (updateInRom) {
    const checksumDigits = headerChecksum.toString(16).toUpperCase().padStart(2, '0');
    const td014D = document.getElementById('014D');
    td014D.textContent = checksumDigits;

    const digits014E = globalChecksum.toString(16).toUpperCase().padStart(4, '0').slice(0, 2);
    const digits014F = globalChecksum.toString(16).toUpperCase().padStart(4, '0').slice(2, 4);

    const td014E = document.getElementById('014E');
    const td014F = document.getElementById('014F');
    td014E.textContent = digits014E;
    td014F.textContent = digits014F;
  }
}

//------------------------------------------------------------------------------------------
// Game title changes in header data
function handleGameTitleKeydown(event) {
  if (event.key === 'Enter') {
    event.target.blur();
  }
}

function validateGameTitle(event) {
  const gameTitleCell = document.getElementById('gameTitle');
  const titleBefore = gameTitleCell.getAttribute('data-titleBefore');

  const input = event.target.textContent.trim().toUpperCase();
  const validInput = input.replace(/[^A-Z]/g, '').slice(0, 16);

  if (validInput.length === 0 || validInput !== input) {
    gameTitleCell.textContent = titleBefore;
    gameTitleCell.setAttribute('data-titleBefore', titleBefore);
    displayToast('invalidGameTitle');
    return;
  }

  const previousTitle = (titleBefore || '').trim().toUpperCase();
  gameTitleCell.textContent = validInput;
  gameTitleCell.setAttribute('data-titleBefore', validInput);

  if (validInput === previousTitle) return;

  const gameTitle = validInput;
  let hexValues = '';
  let currentIndex = 0;

  for (let i = 0; i < 16; i++) {
    const cellID = '01' + (0x34 + i).toString(16).padStart(2, '0').toUpperCase();
    const targetCell = document.getElementById(cellID);
    if (targetCell) {
      targetCell.textContent = '';
      if (currentIndex < gameTitle.length) {
        const char = gameTitle[currentIndex];
        const asciiCode = char.charCodeAt(0);
        const hexValue = asciiCode.toString(16).padStart(2, '0').toUpperCase();
        targetCell.textContent = hexValue;
        currentIndex++;
        hexValues += hexValue;
      } else {
        targetCell.textContent = '00';
      }
    }
  }

  displayToast('gameTitleChanged');
  const logMessage = 'Game title changed to "' + gameTitle + '"';
  addToLog(logMessage);
  updateChecksums(true);
  scrollToAddress("0134");
}

//------------------------------------------------------------------------------------------
// Loads a ROM file
function validateFile(event) {

  const maxFileSize = 3000; // files can't be bigger than that

  let file = event.target.files[0];

  // Check if a file is selected
  if (!file) {
    alert('Please select a file.');
    return false;
  }

  // Check the file extension
  let fileExtension = file.name.split('.').pop().toLowerCase();
  if (fileExtension !== 'gb') {
    alert('Only .gb files are allowed.');
    hideLoadingAnimation();
    return false;
  }

  // Check the file size
  let fileSize = file.size / 1024; // in KB
  if (fileSize > maxFileSize) {
    alert('File size should be less than or equal to ' + round(maxFileSize/1000) + ' MB.');
    hideLoadingAnimation();
    return false;
  }

  // add the file name to the field patchRomName
  let patchRomNameInput = document.getElementById("patchRomName");
  let fileNameWithoutExtension = file.name.replace(".gb", "");
  patchRomNameInput.value = fileNameWithoutExtension + "-modified";

  // Show loading animation
  showLoadingAnimation();

  // Read the file data
  let reader = new FileReader();
  reader.onload = function (event) {
    // File loading completed
    hideLoadingAnimation();

    let fileData = event.target.result;
    let hexData = convertToHex(fileData);
      
      // Create a MutationObserver to detect changes in the table
      let observer = new MutationObserver(function(mutationsList) {
        for (let mutation of mutationsList) {
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
        const hexValue = isProtectedRomAddress(cell.id)
          ? cell.getAttribute('data-original-value') || cell.textContent || '00'
          : cell.textContent || '00';
        const byteValue = parseInt(hexValue, 16);
        fileData[(i - 1) * 16 + (j - 1)] = byteValue;
      }
    }

    // Create a Blob from the Uint8Array
    const blob = new Blob([fileData]);

    // Create a download link and trigger the download
    let newFileName = 'modified_ROM.gb';
    const fileNameFromInput = document.getElementById("patchRomName").value + ".gb";
    if(fileNameFromInput !== "") newFileName = fileNameFromInput;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = newFileName;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 0);
    displayToast("GLHF");
    addToLog(`Game saved as "${newFileName}"`);
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
      const row = table.insertRow();
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
      
        const cellID = addressID.slice(0, 3) + j.toString(16).toUpperCase();
        hexValueCell.id = cellID;
        hexValueCells.push(hexValueCell);
        
        if (isProtectedRomAddress(cellID)) {
          hexValueCell.contentEditable = "false";
          hexValueCell.classList.add("protected-rom-byte");
          hexValueCell.setAttribute("aria-readonly", "true");
          hexValueCell.title = "This ROM byte is permanently locked.";
          hexValueCell.setAttribute("data-original-value", hexValue);
        // header data
        } else if (cellID >= '0000' && cellID <= '014F'){
          hexValueCell.classList.add('header');
          hexValueCell.contentEditable = headerAddressesEnabled;
          hexValueCell.classList.toggle("header-enabled", headerAddressesEnabled);
          hexValueCell.addEventListener("click", () => requestHeaderAddressAccess(hexValueCell));
        } else {
          hexValueCell.contentEditable = true;
        }
        
        // checksum data
        if (cellID === '014D' || cellID === '014E' || cellID === '014F') hexValueCell.classList.add('checksum');

      }
      
      hexValueCells.forEach(cell => {
        if (isProtectedRomAddress(cell.id)) return;

        cell.addEventListener('focus', function(event) {
          const cell = event.target;
          cell.setAttribute('data-previous-value', cell.textContent);
          cell.textContent = '';
        });

        // Set data-previous-value attribute on page load if it's a valid 2-digit hex value
        const originalValue = cell.textContent;
        if (/^[0-9A-Fa-f]{2}$/.test(originalValue)) {
          cell.setAttribute('data-previous-value', originalValue);
        }

        cell.addEventListener('input', function(event) {
          const cell = event.target;
          let value = cell.textContent;

          // Remove non-hex characters
          value = value.replace(/[^0-9A-Fa-f]/g, '');

          if (value.length > 1) {
            // Restrict length to 2 digits
            value = value.slice(0, 2);

            // Remove any leading zeros and convert to uppercase
            value = value.padStart(2, '0').slice(-2).toUpperCase();
          }

          cell.textContent = value;
          const selection = window.getSelection();
          const range = document.createRange();
          range.selectNodeContents(cell);
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);
        });

        // pressing Enter leaves the cell
        cell.addEventListener('keydown', function(event) {
          if (event.key === 'Enter') {
            event.target.blur();
          }
        });

        cell.addEventListener('blur', function(event) {
          const cell = event.target;
          let value = cell.textContent;
          const previousValue = cell.getAttribute('data-previous-value');

          // Check if the value is not a valid 2-digit hex value
          if (!/^[0-9A-Fa-f]{2}$/.test(value)) {
            // Restore original value
            cell.textContent = previousValue || '';
            if (value.length > 0) {
              displayToast("hexValueRestored");
            }
            return;
          }

          value = value.toUpperCase();
          cell.textContent = value;

          // Check if the value has changed
          if (previousValue && previousValue.toLowerCase() !== value.toLowerCase()) {
            cell.classList.add('edited');
            const gameGenieCode = addrToGgCode(cell.id, value, previousValue);
            addToLog("Address $" + cell.id + " | " + previousValue + " > " + value
              + ", manually altered | GG: " + gameGenieCode);
          } else {
            cell.classList.remove('edited');
          }

          cell.setAttribute('data-previous-value', value);
        });

      });
      
    }

    // update the checksums, but no need to write them to the ROM yet
    updateChecksums(false);
    
    // Open the modal at the beginning 
    // wait 1 second - like this the positioning should be correct
    const openModalButton = document.getElementById("openModalButton");
    tileDataReady = new Promise(resolve => {
        // Load tile data from the lookup table before BG maps can use it.
        for (const setName in tileAddressesInROM) {
          const [address, length, bPP, showTiles] = tileAddressesInROM[setName];
          if (showTiles) getTileData(address, length, bPP, setName);
        }

        // Apply the initial palette before BG-map tiles are rendered to canvases.
        document.getElementById("palette-dropdown").dispatchEvent(new Event("change"));

        resolve();
    });

    setTimeout(() => openModalButton.click(), 1000);

    wipeTilesFromLocalStorage();

  }

  // Loading animation
  function showLoadingAnimation() {
    document.getElementById("loadingAnimation").style.display = "block";
    document.getElementById("wrapper2").style.display = "none";
  }

  function hideLoadingAnimation() {
    document.getElementById("loadingAnimation").style.display = "none";
  }

  //------------------------------------------------------------------------------------------
  // Scrolls to and highlights an address
  function scrollToAddress(address, nCells = 1) {
    let returnValue = false;
  
    if(nCells > 120) nCells = 120; // make sure there are never more than 120 cells to highlight (actually 7*16 = 112 would be enough) 

    // only do, if the address is hex
    if (/^[0-9a-fA-F]+$/.test(address)) { 
      const oriAddr = parseInt(address, 16);
      let subtractor = 0;
      if (oriAddr > 15) subtractor = 16;
  
      address = (oriAddr - subtractor).toString(16).toUpperCase().padStart(4, '0');
  
      const targetAddress = address.slice(0, -1) + "0";
      const anchorElement = document.getElementById(targetAddress);
   
      // check if the address exists - if not, show red toast
      if (anchorElement) {
        if (subtractor === 0) {
          // If subtractor is 0, smooth scroll to the top of the table-wrapper
          const tableWrapper = document.querySelector('.table-wrapper');
          tableWrapper.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          // If subtractor is not 0, scroll to the anchor element
          anchorElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
  
        // Apply the pulsate animation after a slight delay
        setTimeout(function() {
          if (oriAddr === 0x0134) {
            for (let i = 0; i < nCells; i++) {
              const cellId = 0x0134 + i;
              const tdElement = document.getElementById(cellId.toString(16).toUpperCase().padStart(4, '0'));
              if (tdElement) {
                tdElement.style.animation = 'pulsate 2s';
  
                // Reset the animation after it completes
                tdElement.addEventListener('animationend', function() {
                  tdElement.style.animation = '';
                });
              }
            }
          } else {
            for (let i = 0; i < nCells; i++) {
              const cellId = oriAddr + i;
              const tdElement = document.getElementById(cellId.toString(16).toUpperCase().padStart(4, '0'));
              if (tdElement) {
                tdElement.style.animation = 'pulsate 2s';
  
                // Reset the animation after it completes
                tdElement.addEventListener('animationend', function() {
                  tdElement.style.animation = '';
                });
              }
            }
          }
        }, 500); // Adjust the delay as needed
  
        returnValue = true;
      } else {
        // show message and erase the non-sensical input
        displayToast("wrongAddress");
        const searchInput = document.getElementById("searchInput");
        searchInput.value = "";
        searchInput.focus();
      }
    }
  
    return returnValue;
  }
  
  
//------------------------------------------------------------------------------------------
// display a toast
let toastQueue = [];
const maxToastQueueLen = 3; // maximum size of the toastQueue
const toastDisplayDuration = 2500;
const toastTransitionDuration = 300;
let currentToast = null;
let toastHideTimer = null;
let toastAdvanceTimer = null;

function initializeToastCloseButtons() {
  document.querySelectorAll(".toast").forEach(toast => {
    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "toast-close";
    closeButton.setAttribute("aria-label", "Dismiss notification");
    closeButton.innerHTML = "&times;";
    closeButton.addEventListener("click", dismissCurrentToast);
    toast.appendChild(closeButton);
  });
}

function displayToast(id) {
  toastQueue.push(id);

  if (toastQueue.length > maxToastQueueLen) {
    toastQueue.splice(maxToastQueueLen);
  }

  if (toastQueue.length === 1) {
    showNextToast();
  }
}

function showNextToast() {
  if (!toastQueue.length) return;

  const toast = document.getElementById(toastQueue[0]);
  if (!toast) {
    toastQueue.shift();
    showNextToast();
    return;
  }

  currentToast = toast;
  const displayDuration = Number(toast.dataset.duration) || toastDisplayDuration;
  toast.style.setProperty("--toast-duration", `${displayDuration}ms`);
  requestAnimationFrame(() => toast.classList.add("show"));

  toastHideTimer = setTimeout(dismissCurrentToast, displayDuration);
}

function dismissCurrentToast() {
  if (!currentToast) return;

  clearTimeout(toastHideTimer);
  clearTimeout(toastAdvanceTimer);
  currentToast.classList.remove("show");

  toastAdvanceTimer = setTimeout(() => {
    toastQueue.shift();
    currentToast = null;
    showNextToast();
  }, toastTransitionDuration);
}

//------------------------------------------------------------------------------------------
// populates header data 
let headerFieldDefinitions;

function appendHeaderOptions(select, values) {
  for (const [code, description] of Object.entries(values)) {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = description;
    select.appendChild(option);
  }
}

function writeHeaderByte(address, value) {
  if (isProtectedRomAddress(address)) return false;
  const cell = document.getElementById(address);
  if (!cell) return false;
  cell.textContent = value;
  cell.classList.add("edited");
  return true;
}

function initializeHeaderEditors() {
  headerFieldDefinitions = {
    thisCgbFlag: { address: "0143", values: cgbFlag },
    thisSgbFlag: {
      address: "0146",
      values: {
        "00": "No Super Game Boy enhancements",
        "03": "Supports Super Game Boy enhancements"
      }
    },
    thisCartridgeType: { address: "0147", values: cartridgeType },
    thisRomSize: { address: "0148", values: romSize },
    thisRamSize: { address: "0149", values: ramSize },
    thisDestinationCode: { address: "014A", values: destinationCode }
  };

  for (const [selectId, definition] of Object.entries(headerFieldDefinitions)) {
    const select = document.getElementById(selectId);
    appendHeaderOptions(select, definition.values);
    select.addEventListener("change", () => {
      if (!writeHeaderByte(definition.address, select.value)) return;
      updateChecksums(true);
      addToLog(`Header $${definition.address} changed to ${select.value}`);
    });
  }

  const licenseeSelect = document.getElementById("licenseeCode");
  const oldCodes = document.createElement("optgroup");
  oldCodes.label = "Old licensee codes";
  appendHeaderOptions(oldCodes, oldLicenseeCode);
  Array.from(oldCodes.children).forEach(option => option.value = `old:${option.value}`);
  licenseeSelect.appendChild(oldCodes);

  const newCodes = document.createElement("optgroup");
  newCodes.label = "New licensee codes";
  appendHeaderOptions(newCodes, newLicenseeCode);
  Array.from(newCodes.children).forEach(option => option.value = `new:${option.value}`);
  licenseeSelect.appendChild(newCodes);

  licenseeSelect.addEventListener("change", () => {
    const [format, code] = licenseeSelect.value.split(":");
    if (format === "old") {
      if (!writeHeaderByte("014B", code)) return;
    } else {
      if (!writeHeaderByte("014B", "33")) return;
      writeHeaderByte("0144", code.charCodeAt(0).toString(16).padStart(2, "0").toUpperCase());
      writeHeaderByte("0145", code.charCodeAt(1).toString(16).padStart(2, "0").toUpperCase());
    }
    updateChecksums(true);
    addToLog(`Licensee code changed to ${code} (${format})`);
  });
}

function obtainHeaderData() {
  
  // (1) Game title
  let gameTitle = "";
  let i = 308;
  let thisHex = "";

  while (true) {
      const thisAddress = i.toString(16).padStart(4, "0");
      const element = document.getElementById(thisAddress);

      if (!element) {
          break; // Exit the loop if the element does not exist
      }

      thisHex = element.textContent;
      if (i === 323 || thisHex === "00") {
          break; // Exit the loop if the end condition is met
      }

      const thisAsciiValue = String.fromCharCode(parseInt(thisHex, 16));
      gameTitle += thisAsciiValue;
      i++;
  }

  // (2) Header data
  const cgbCode = document.getElementById("0143").textContent;
  const sgbCode = document.getElementById("0146").textContent;
  const cartridgeCode = document.getElementById("0147").textContent;
  const romSizeCode = document.getElementById("0148").textContent;
  const ramSizeCode = document.getElementById("0149").textContent;
  const destinationCodeValue = document.getElementById("014A").textContent;

  const licensee = document.getElementById("014B").textContent;
  let licenseeValue;
  if (licensee !== "33") {
      licenseeValue = `old:${licensee}`;
  } else {
      const firstCharacter = String.fromCharCode(parseInt(document.getElementById("0144").textContent, 16));
      const secondCharacter = String.fromCharCode(parseInt(document.getElementById("0145").textContent, 16));
      licenseeValue = `new:${firstCharacter}${secondCharacter}`;
  }

  // Populate the second column of the existing table with header data
  document.getElementById("gameTitle").textContent = gameTitle;
  document.getElementById("gameTitle").setAttribute('data-titleBefore', gameTitle);
  document.getElementById("thisCgbFlag").value = cgbCode;
  document.getElementById("thisSgbFlag").value = sgbCode;
  document.getElementById("thisCartridgeType").value = cartridgeCode;
  document.getElementById("thisRomSize").value = romSizeCode;
  document.getElementById("thisRamSize").value = ramSizeCode;
  document.getElementById("thisDestinationCode").value = destinationCodeValue;
  document.getElementById("licenseeCode").value = licenseeValue;
}

//------------------------------------------------------------------------------------------

// this woks, but now we need to make sure, the correct VRAM is loaded
async function getBGMap(id, bgMap) {

  await tileDataReady;
  activeBGMapName = bgMap;
  document.querySelectorAll(".bg-map-entry").forEach(entry => {
    entry.classList.toggle("active", entry.dataset.bgMapName === bgMap);
  });

  // delete previous VRAM Tile Set
  wipeTilesFromLocalStorage();

  // enable key press tracking, this enables quick access certain tiles 
  enableKeyPressTracking();
  
  // assign new VRAM Tile Set
  assignVramTileSet(vRamTileSets[bgMaps[bgMap][3]]);
  
  // Call the function to load tile content into VRAM grid
  loadTileContentToVRAMGrid();
  
  addMatrix(bgMaps[bgMap][1], bgMaps[bgMap][2]);

  const startIndex = parseInt(id, 16);
  const gap = bgMaps[bgMap][5] ? parseInt(bgMaps[bgMap][5]) : 1; // Default gap is 1 if not specified

  document.getElementById("BG-myModal").style.display = "flex";

  const selectableList = document.getElementById("selectable");
  const imageElements = selectableList.getElementsByTagName("img");

  let displayIndex = 0; // Initialize a separate index for displayed images

  for (let i = 0; i < imageElements.length; i++) {
    const cellId = (startIndex + displayIndex).toString(16).padStart(4, '0').toUpperCase();
    const cellContent = document.getElementById(cellId).textContent;
    const bgTileId = displayIndex.toString(16).padStart(2,'0').toUpperCase();
    
    if (cellContent.trim() !== "") { // Check if the cell is not empty
      // the image needs an ID / also make sure it's upscaled using point filtering (pixel perfect)
      imageElements[i].setAttribute("id", "bg-tile-" + bgTileId);
      imageElements[i].style.imageRendering = "pixelated";
      //
      displayTileImageFromLocalStorage(cellContent, "bg-tile-" + bgTileId);
    }

    // Increment the display index by gap if the cell is not empty
    if (cellContent.trim() !== "") {
      displayIndex += gap;
    }
  }

  document.getElementById("BGMapStartAddress").value = id;

  let button = document.getElementById("saveBGMapAsBIN");
  const thisMapName = bgMaps[bgMap][4];
  let suffix = "";
  if(thisMapName !== "undefined") suffix = " as \"" + thisMapName  + "\"";
  button.innerHTML = "▼ Download" + suffix;
}

//------------------------------------------------------------------------------------------
// tab group
function openTab(event, tabName) {
  let i, tabContent, tab;

  tabContent = document.getElementsByClassName("tab-content");
  for (i = 0; i < tabContent.length; i++) {
    tabContent[i].style.display = "none";
  }

  tab = document.getElementsByClassName("tab");
  for (i = 0; i < tab.length; i++) {
    tab[i].className = tab[i].className.replace(" active", "");
  }

  document.getElementById(tabName).style.display = "block";

  event.currentTarget.className += " active";

  // add the correct color to the tiles
  if(tabName === "tab3") document.getElementById("palette-dropdown").dispatchEvent(new Event("change"));
}


//------------------------------------------------------------------------------------------
// Function to load the tiles of an object (e.g. sprite)
function loadObjectSprite(objectName, highlightOnly) {
  
  if(objectName === "no") return;

  const objectData = spriteObjects[objectName];
  
  // Remove the "highlighted" class from all tiles before proceeding
  const allTiles = document.getElementsByClassName('tile');
  for (let i = 0; i < allTiles.length; i++) {
    allTiles[i].classList.remove('highlighted');
  }

  // assign some variables
  const romTileSet = objectData[0];
  const startingAddressHex = tileAddressesInROM[romTileSet][0];
  const startingAddress = parseInt(startingAddressHex, 16);
  const bitsPerPixel = tileAddressesInROM[romTileSet][2];

  // arrays
  const tileAddresses = [];
  const flags = [];

  // Loop through all consecutive entries of objects[objectName]
  for (let i = 1; i < objectData.length; i++) {
    let entry = String(objectData[i]);
    let flag = "";
    let isTile = true;

    // for some reason this is required (0 could be any existing tile number)
    if(entry === "e"){
      entry = "0-e";
      isTile = false;
    }else if(entry === "e-n"){
      entry = "0-en";
      isTile = false;
    } 

    // if the entry contains flags...
    if (entry.includes("-")) {
      const splitEntry = entry.split("-");
      entry = splitEntry[0];
      flag = splitEntry[1];
    }

    let combinedValue = "";
    if(isTile) combinedValue = (startingAddress + 8 * parseInt(entry) * bitsPerPixel).toString(16).toUpperCase().padStart(4, '0');

    if(highlightOnly){
      // Highlight the corresponding tile with animation
      let tileElement = document.getElementById(`tileaddr-${combinedValue}`);
      if(flag === "e") tileElement = null;

      if (tileElement) {
        tileElement.classList.add('highlighted');

        // Remove the "highlighted" class after the animation completes
        setTimeout(() => {
          tileElement.classList.remove('highlighted');
        }, 1000); // 1000ms (1 second) is the duration of the animation
      }
    }else{
      tileAddresses.push(combinedValue);
      flags.push(flag);
    }

  }

  if(!highlightOnly) openTileDialog(tileAddresses, flags, objectName);
}

//------------------------------------------------------------------------------------------
// Search for the occurance of a sequence inside the game's code 

function hexViewerSearch(searchString, searchValues) {
  const cells = document.querySelectorAll('#hexViewer .hexValueCell');

  // Step 1: Create an array of [ID, displayedValue] pairs
  const cellValues = Array.from(cells).map(cell => {
      const id = cell.id;
      const displayedValue = cell.textContent.trim().toUpperCase();
      return [id, displayedValue];
  });

  // Step 2: Search for consecutive sequences based on the search string
  let foundSequences = [];

  // Check if there are at least two values in the search string
  if (searchValues.length >= 2) {
      for (let i = 0; i < cellValues.length - searchValues.length + 1; i++) {
          const sequenceToCheck = cellValues.slice(i, i + searchValues.length);
          const matchingSequence = sequenceToCheck.every((pair, index) => {
              return searchValues[index] === '*' || pair[1] === searchValues[index];
          });

          if (matchingSequence) {
              foundSequences.push(sequenceToCheck[0][0]);
          }
      }
  }

  return foundSequences;
}

function searchSequenceInCode() {
  const searchInput = document.getElementById('searchAddressInput');
  const searchResult = document.getElementById('searchResult');

  // Clear previous result and remove the 'visited' class from all links
  searchResult.innerHTML = '';
  
  const links = document.querySelectorAll('#searchResult a');
  links.forEach(link => link.classList.remove('visited'));

  // Get the search string from the input field
  const searchString = searchInput.value.trim();

  // Check if the search string is not empty
  if (searchString !== '') {
    const searchValues = parseHexSequence(searchString);
    if (!searchValues) {
      searchInput.classList.add("input-invalid");
      return;
    }
    searchInput.classList.remove("input-invalid");

    // Adjust search values based on the slider value
    const adjustedSearchValues = adjustSearchValues(searchValues);

    const foundSequences = hexViewerSearch(searchString, adjustedSearchValues);

    // Display the result
    if (foundSequences.length > 0) {
      const resultDiv = document.getElementById('searchResult');
      resultDiv.innerHTML = 'Skip:' + slider.value + ' → ';

      // Create comma-separated links for each found address
      const links = foundSequences.map(address => {
        const link = document.createElement('a');
        link.href = 'javascript:void(0)';
        link.textContent = '$' + address;

        // Add a click event listener to scroll to the address
        link.addEventListener('click', () => {
          scrollToAddress(address, adjustedSearchValues.length);
          link.classList.add('visited');
          sessionStorage.setItem(`visited_${address}`, 'true');
        });

        return link;
      });

      // Append links to the result div
      links.forEach((link, index) => {
        resultDiv.appendChild(link);
        // Add a comma after each link, except for the last one
        if (index < links.length - 1) {
          resultDiv.appendChild(document.createTextNode(', '));
        }
      });
    } else {
      searchResult.innerHTML = 'Skip:' + slider.value + ' → No such sequence found.';
    }
  } else {
    searchResult.innerHTML = ''; // Clear the result div if the search string is empty
  }
}

// Function to adjust search values based on the slider value
function adjustSearchValues(values) {
  const adjustedValues = [];
  const wildcard = '*';
  const sliderValue = slider.value;

  for (let i = 0; i < values.length; i++) {
    adjustedValues.push(values[i]);

    // Check if it's not the last element
    if (i < values.length - 1) {
      for (let j = 1; j <= sliderValue; j++) {
        adjustedValues.push(wildcard);
      }
    }
  }

  return adjustedValues;
}

// horizontal slider for the gaps
function updateSliderValue() {
  let slider = document.getElementById("slider");
  let valueDisplay = document.getElementById("slider-value");

  valueDisplay.textContent = "Skip: " + slider.value;
}

function parseHexSequence(input) {
  const compactInput = input.toUpperCase().replace(/[,;\s-]+/g, "");
  if (!compactInput || !/^[0-9A-F*]+$/.test(compactInput)) return null;

  const values = [];
  for (let index = 0; index < compactInput.length;) {
    if (compactInput[index] === "*") {
      values.push("*");
      index++;
      continue;
    }

    const byte = compactInput.slice(index, index + 2);
    if (!/^[0-9A-F]{2}$/.test(byte)) return null;
    values.push(byte);
    index += 2;
  }

  return values;
}

function formatSequenceInput(event) {
  const input = event.currentTarget;
  if (!input.value.trim()) {
    input.classList.remove("input-invalid");
    return;
  }

  const values = parseHexSequence(input.value);
  input.classList.toggle("input-invalid", !values);
  if (values) input.value = values.join(", ");
}
