//------------------------------------------------------------------------------------------
// get the pixel values from tiles in the ROM (0-3)

// global variables
const b = "2px solid black";
const o = "2px solid orange";
let isMouseButtonDown = false;
let isDialogOpen = false;
let clickableDivs;
let selectedTile;
let tileToUpdate;
let tileImportState = null;
let lastTileImportUndo = null;

//------------------------------------------------------------------------------------------
// Draws all tiles from the ROM file
function getTileData(startAddress, nTiles, bitsPerPixel, tilesetTitle) {
  const pixelData = [];
  const addresses = [];
  let currentAddress = startAddress;

  const tileContainer = document.getElementById("tileContainer");

  // Add a title
  tileContainer.insertAdjacentHTML("beforeend", `
    <p><b>${tilesetTitle} (ROM Entry Address = ${startAddress}, ${nTiles} Tiles, ${bitsPerPixel}BPP)</b></p>`);

  // Check if tilesetTitle exists in the first entry of any object in spriteObjects
  const matchingTitles = Object.keys(spriteObjects).filter(title => spriteObjects[title][0] === tilesetTitle);

  // Add the dropdown and button if there were matching titles
  if (matchingTitles.length > 0) {
    let dropdownHTML = `<p><select id="sprites${tilesetTitle}" class="sprite-selector">`;
    dropdownHTML += `<option value="no">--Choose--</option>`;
    for (const title of matchingTitles) {
      dropdownHTML += `<option value="${title}">${title}</option>`;
    }
    dropdownHTML += '</select>&nbsp;';
    dropdownHTML += `<button class="load-sprite-button" data-selector-id="sprites${tilesetTitle}">Load Tile Group</button></p>`;
    dropdownHTML += '<br>';
    tileContainer.insertAdjacentHTML("beforeend", dropdownHTML);
  }

  // collect the pixel values for the tiles
  for (let i = 0; i < nTiles * 8 * bitsPerPixel; i++) {
    if (bitsPerPixel === 2 && i % 2 === 1) {
      continue; // Skip every other iteration when bitsPerPixel is 2
    }

    const currentTd = document.getElementById(currentAddress);
    const thisValue = currentTd.textContent;

    const nextAddress = (parseInt(currentAddress, 16) + 1).toString(16).toUpperCase();
    const nextTd = document.getElementById(nextAddress);
    const nextValue = nextTd.textContent;

    const thisBinary = parseInt(thisValue, 16).toString(2).padStart(8, '0');
    const nextBinary = parseInt(nextValue, 16).toString(2).padStart(8, '0');

    let pixelValues = "";

    for (let j = 0; j < 8; j++) {
      let decimalValue;
      if (bitsPerPixel === 2) {
        const concatenatedBinary = nextBinary[j] + thisBinary[j];
        decimalValue = parseInt(concatenatedBinary, 2);
      } else {
        // The factor 3 makes sure the dark pixel of the 1BPP tiles is black
        decimalValue = 3 * parseInt(thisBinary[j], 2);
      }
      pixelValues += decimalValue;
    }

    pixelData.push(pixelValues);

    if (bitsPerPixel === 1) {
      if (i % 8 === 0) {
        addresses.push(currentAddress);
      }
    } else {
      if (i % 16 === 0) {
        addresses.push(currentAddress);
      }
    }
  
    const skip = (bitsPerPixel === 2) ? 2 : 1;
    const nextTileAddress = (parseInt(currentAddress, 16) + skip).toString(16).toUpperCase();
    currentAddress = nextTileAddress;
  }

  // Add the PNG import button above the tiles.
  let nCols = getTileSetProperty(tilesetTitle, "width");
  let thisSetName = getTileSetProperty(tilesetTitle, "name");
  const importPngHTML = `<p class="tile-set-import-action"><button class="upload-tile-set-button" data-addresses="${addresses}" data-tile-count="${nTiles}" data-set-name="${thisSetName}" data-set-title="${tilesetTitle}" data-bpp="${bitsPerPixel}" data-column-count="${nCols}">▲ Upload tiles from a .png</button></p>`;
  tileContainer.insertAdjacentHTML("beforeend", importPngHTML);

  displayTiles(pixelData, addresses, bitsPerPixel, tilesetTitle);

  // Add a button to save the tile set as a PNG
  let savePngHTML = `<p class="tile-set-actions"><button class="secondary save-tile-set-button" data-addresses="${addresses}" data-tile-count="${nTiles}" data-set-name="${thisSetName}" data-column-count="${nCols}">▼ Download tile group as "${thisSetName}.png"</button></p>`;
  savePngHTML += "<br><hr>";
  tileContainer.insertAdjacentHTML("beforeend", savePngHTML);
  
}

document.addEventListener("input", event => {
  if (event.target.matches(".sprite-selector")) {
    loadObjectSprite(event.target.value, true);
  }
});

document.addEventListener("click", event => {
  const loadButton = event.target.closest(".load-sprite-button");
  if (loadButton) {
    loadObjectSprite(document.getElementById(loadButton.dataset.selectorId).value, false);
    return;
  }

  const saveButton = event.target.closest(".save-tile-set-button");
  if (saveButton) {
    saveTileSetAsPNG(
      saveButton.dataset.addresses,
      Number(saveButton.dataset.tileCount),
      saveButton.dataset.setName,
      Number(saveButton.dataset.columnCount)
    );
    return;
  }

  const uploadButton = event.target.closest(".upload-tile-set-button");
  if (uploadButton) {
    chooseTileSetPng(uploadButton);
  }
});

//------------------------------------------------------------------------------------------
// Save a tile set as a PNG, this is used to import into the disassembly
function saveTileSetAsPNG(address, nTiles, name, nCols) {
  
  let addresses = address.split(",");
  const nTileRows = Math.ceil(nTiles / nCols);
  const tileContainer = document.getElementById("tileContainer");

  // Calculate canvas dimensions based on the number of columns and rows
  const canvasWidth = nCols * 8;
  const canvasHeight = nTileRows * 8;

  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext("2d");

  // make sure there is a background color (backgroundcolor didn't work with all browsers somehow)
  let colorValue = exportColors[0];
  ctx.fillStyle = colorValue;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);


  // Iterate through each tile row
  for (let tileRow = 0; tileRow < nTileRows; tileRow++) {
    // Calculate the starting tile index for the current row
    const startTileIndex = tileRow * nCols;

    // Loop through each tile in the current row
    for (let tileIndex = startTileIndex; tileIndex < startTileIndex + nCols; tileIndex++) {
      const tileAddress = addresses[tileIndex];
      const tileDiv = tileContainer.querySelector("#tileaddr-" + tileAddress);

      if (tileDiv) {
        // Loop through each row of pixels in the tile
        for (let row = 0; row < 8; row++) {
          // Calculate the starting pixel number for the current row in the tile
          const startPixelNumber = row * 8;

          // Loop through the pixel divs in the current row
          for (let pixelNum = startPixelNumber; pixelNum < startPixelNumber + 8; pixelNum++) {
            const pixelDiv = tileDiv.querySelector(`[data-pixelnumber="${pixelNum}"]`);
            
            let colorValue = 0; // Default color value if not found in exportColors
            if (pixelDiv) {
              const classes = pixelDiv.classList;

              // Loop through each class to find the one that starts with "col"
              for (let j = 0; j < classes.length; j++) {
                const className = classes[j];

                // Extract the value after "col" <-- this is color, not columns!
                if (className.startsWith("col")) {
                  const value = className.substring(3);
                  colorValue = exportColors[parseInt(value)] || 0;
                  break;
                }
              }
            }

            // Calculate pixel position on the canvas
            const canvasX = (tileIndex % nCols) * 8 + (pixelNum % 8);
            const canvasY = tileRow * 8 + Math.floor(pixelNum / 8);

            // Set the pixel color on the canvas
            ctx.fillStyle = colorValue; // Use appropriate format for color value
            ctx.fillRect(canvasX, canvasY, 1, 1);
          }
        }
      }
    }
  }

  // Create a PNG image from the canvas and save it
  const dataURL = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = dataURL;
  a.download = name + ".png";
  a.click();
  displayToast("tileSetSaved");
  addToLog("Tile set was downloaded as \"" + name + ".png\"");
}

//------------------------------------------------------------------------------------------
// Function to get the corresponding value for a given tileSetTitle and property
function getTileSetProperty(tileSetTitle, property) {

  const index = tileExportData.oNames.indexOf(tileSetTitle);
  if (index !== -1) {
    switch (property) {
      case "name":
        return tileExportData.eNames[index];
      case "width":
        return tileExportData.widths[index];
      case "height":
        return tileExportData.heights[index];
      default:
        return "Invalid property!";
    }
  } else {
    return "Tile set not found!";
  }
}

//------------------------------------------------------------------------------------------
// Import an exported-format PNG and use its 8x8 tiles as replacements.

function chooseTileSetPng(button) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/png,.png";
  input.addEventListener("change", () => {
    const file = input.files[0];
    if (!file) return;
    if (file.type !== "image/png" && !file.name.toLowerCase().endsWith(".png")) {
      displayToast("invalidTilePng");
      return;
    }
    loadTileSetPng(file, button.dataset);
  }, { once: true });
  input.click();
}

function loadTileSetPng(file, setData) {
  const image = new Image();
  const objectUrl = URL.createObjectURL(file);

  image.addEventListener("load", () => {
    URL.revokeObjectURL(objectUrl);
    if (image.naturalWidth % 8 !== 0 || image.naturalHeight % 8 !== 0) {
      displayToast("invalidTilePng");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.drawImage(image, 0, 0);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const columns = canvas.width / 8;
    const rows = canvas.height / 8;
    const bitsPerPixel = Number(setData.bpp);
    const tiles = [];
    let hasTwoBitColors = false;

    for (let tileY = 0; tileY < rows; tileY++) {
      for (let tileX = 0; tileX < columns; tileX++) {
        const pixels = [];
        for (let y = 0; y < 8; y++) {
          for (let x = 0; x < 8; x++) {
            const pixelOffset = (((tileY * 8 + y) * canvas.width) + tileX * 8 + x) * 4;
            const sourceColorIndex = closestExportColor(
              imageData.data[pixelOffset],
              imageData.data[pixelOffset + 1],
              imageData.data[pixelOffset + 2],
              2
            );
            if (sourceColorIndex === 1 || sourceColorIndex === 2) {
              hasTwoBitColors = true;
            }
            pixels.push(bitsPerPixel === 1
              ? (sourceColorIndex === 0 ? 0 : 3)
              : sourceColorIndex);
          }
        }
        tiles.push(pixels);
      }
    }

    if (bitsPerPixel === 1 && hasTwoBitColors) {
      displayToast("wrongTilePngBpp");
      return;
    }

    const tileCount = Number(setData.tileCount);
    const expectedColumns = Number(setData.columnCount);
    tileImportState = {
      setTitle: setData.setTitle,
      setName: setData.setName,
      addresses: setData.addresses.split(","),
      bitsPerPixel,
      tileCount,
      expectedColumns,
      expectedWidth: expectedColumns * 8,
      expectedHeight: Math.ceil(tileCount / expectedColumns) * 8,
      imageWidth: canvas.width,
      imageHeight: canvas.height,
      columns,
      tiles
    };
    renderTileImportDialog(file.name);
  }, { once: true });

  image.addEventListener("error", () => {
    URL.revokeObjectURL(objectUrl);
    displayToast("invalidTilePng");
  }, { once: true });
  image.src = objectUrl;
}

function closestExportColor(red, green, blue, bitsPerPixel) {
  const allowedIndexes = bitsPerPixel === 1 ? [0, 3] : [0, 1, 2, 3];
  let closestIndex = allowedIndexes[0];
  let closestDistance = Infinity;

  for (const index of allowedIndexes) {
    const color = exportColors[index].slice(1);
    const exportRed = parseInt(color.slice(0, 2), 16);
    const exportGreen = parseInt(color.slice(2, 4), 16);
    const exportBlue = parseInt(color.slice(4, 6), 16);
    const distance = (red - exportRed) ** 2
      + (green - exportGreen) ** 2
      + (blue - exportBlue) ** 2;
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  }

  return closestIndex;
}

function renderTileImportDialog(fileName) {
  const dialog = document.getElementById("tileImportDialog");
  const grid = document.getElementById("tileImportGrid");
  const replaceAllButton = document.getElementById("replaceEntireTileSet");
  document.getElementById("tileImportTitle").textContent = `Import tiles: ${tileImportState.setTitle}`;
  document.getElementById("tileImportInfo").textContent =
    `${fileName}: ${tileImportState.imageWidth}×${tileImportState.imageHeight}px, `
    + `${tileImportState.tiles.length} tiles`;
  grid.innerHTML = "";
  grid.style.gridTemplateColumns = `repeat(${tileImportState.columns}, 36px)`;

  tileImportState.tiles.forEach((pixels, index) => {
    const tile = document.createElement("div");
    tile.className = "imported-tile";
    tile.draggable = true;
    tile.dataset.importTileIndex = index;
    tile.title = `Tile ${index + 1}`;

    for (const colorIndex of pixels) {
      const pixel = document.createElement("span");
      pixel.className = `pixel col${colorIndex}`;
      const picker = document.getElementById(`color-picker-${colorIndex}`);
      pixel.style.backgroundColor = picker ? picker.value : exportColors[colorIndex];
      tile.appendChild(pixel);
    }

    tile.addEventListener("dragstart", event => {
      event.dataTransfer.effectAllowed = "copy";
      event.dataTransfer.setData("text/plain", String(index));
    });
    grid.appendChild(tile);
  });

  replaceAllButton.hidden = !(
    tileImportState.imageWidth === tileImportState.expectedWidth
    && tileImportState.imageHeight === tileImportState.expectedHeight
  );

  if (!dialog.open) dialog.show();
}

function initializeTileImportDialog() {
  const dialog = document.getElementById("tileImportDialog");
  const handle = document.getElementById("tileImportDragHandle");

  document.getElementById("closeTileImportDialog").addEventListener("click", () => dialog.close());
  document.getElementById("replaceEntireTileSet").addEventListener("click", replaceEntireTileSetFromImport);
  document.querySelector("#tileImportUndo .toast-undo").addEventListener("click", undoLastTileImport);

  document.getElementById("tileContainer").addEventListener("dragover", event => {
    const target = event.target.closest(".tile[data-tileset-title]");
    if (!isValidTileImportTarget(target)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    clearTileImportTargets();
    target.dataset.importTarget = "true";
  });

  document.getElementById("tileContainer").addEventListener("dragleave", event => {
    const target = event.target.closest(".tile[data-import-target]");
    if (target && !target.contains(event.relatedTarget)) {
      delete target.dataset.importTarget;
    }
  });

  document.getElementById("tileContainer").addEventListener("drop", event => {
    const target = event.target.closest(".tile[data-tileset-title]");
    clearTileImportTargets();
    if (!isValidTileImportTarget(target)) return;
    event.preventDefault();
    const tileIndex = Number(event.dataTransfer.getData("text/plain"));
    if (!Number.isInteger(tileIndex) || !tileImportState.tiles[tileIndex]) return;
    replaceImportedTiles([{ target, pixels: tileImportState.tiles[tileIndex] }], false);
  });

  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let dragging = false;
  handle.addEventListener("pointerdown", event => {
    if (event.target.closest("button")) return;
    const bounds = dialog.getBoundingClientRect();
    dragOffsetX = event.clientX - bounds.left;
    dragOffsetY = event.clientY - bounds.top;
    dragging = true;
    handle.setPointerCapture(event.pointerId);
  });
  handle.addEventListener("pointermove", event => {
    if (!dragging) return;
    const maxLeft = Math.max(0, window.innerWidth - dialog.offsetWidth);
    const maxTop = Math.max(0, window.innerHeight - dialog.offsetHeight);
    dialog.style.left = `${Math.min(maxLeft, Math.max(0, event.clientX - dragOffsetX))}px`;
    dialog.style.top = `${Math.min(maxTop, Math.max(0, event.clientY - dragOffsetY))}px`;
  });
  handle.addEventListener("pointerup", () => {
    dragging = false;
  });
  handle.addEventListener("pointercancel", () => {
    dragging = false;
  });
}

function isValidTileImportTarget(target) {
  return Boolean(
    target
    && tileImportState
    && target.dataset.tilesetTitle === tileImportState.setTitle
  );
}

function clearTileImportTargets() {
  document.querySelectorAll(".tile[data-import-target]").forEach(tile => {
    delete tile.dataset.importTarget;
  });
}

function replaceEntireTileSetFromImport() {
  if (!tileImportState) return;
  const replacements = tileImportState.addresses.slice(0, tileImportState.tileCount)
    .map((address, index) => ({
      target: document.getElementById(`tileaddr-${address}`),
      pixels: tileImportState.tiles[index]
    }))
    .filter(replacement => replacement.target && replacement.pixels);
  replaceImportedTiles(replacements, true);
}

function replaceImportedTiles(replacements, isEntireSet) {
  const undoActions = replacements.map(({ target, pixels }) => replaceOneImportedTile(target, pixels));
  lastTileImportUndo = { actions: undoActions, setTitle: tileImportState.setTitle };
  updateChecksums(false);
  scheduleBGMapPreviewRefresh();

  const toast = document.getElementById("tileImportUndo");
  toast.querySelector("span").textContent = isEntireSet
    ? `${undoActions.length} tiles were replaced.`
    : "A tile was replaced.";
  displayToast("tileImportUndo");
  addToLog(isEntireSet
    ? `${undoActions.length} tiles in "${tileImportState.setTitle}" were replaced from PNG`
    : `Tile starting at address $${undoActions[0].address} was replaced from PNG`);
}

function replaceOneImportedTile(target, pixels) {
  const address = target.id.replace("tileaddr-", "");
  const bitsPerPixel = Number(target.dataset.bpp);
  const oldPixels = getTilePixelValues(target);
  const oldBytes = readTileBytes(address, bitsPerPixel);
  const oldEditedStates = readTileEditedStates(address, bitsPerPixel);
  setTilePixelValues(target, pixels);
  writeTileBytes(address, encodeTilePixels(pixels, bitsPerPixel));
  return { target, address, bitsPerPixel, oldPixels, oldBytes, oldEditedStates };
}

function getTilePixelValues(tile) {
  return Array.from(tile.querySelectorAll(".pixel")).map(pixel => {
    const colorClass = Array.from(pixel.classList).find(className => /^col[0-3]$/.test(className));
    return colorClass ? Number(colorClass.slice(3)) : 0;
  });
}

function setTilePixelValues(tile, pixels) {
  const pixelElements = tile.querySelectorAll(".pixel");
  pixelElements.forEach((pixel, index) => {
    const colorIndex = pixels[index] ?? 0;
    pixel.className = `pixel col${colorIndex}`;
    const picker = document.getElementById(`color-picker-${colorIndex}`);
    pixel.style.backgroundColor = picker ? picker.value : exportColors[colorIndex];
  });
}

function encodeTilePixels(pixels, bitsPerPixel) {
  const bytes = [];
  for (let row = 0; row < 8; row++) {
    const rowPixels = pixels.slice(row * 8, row * 8 + 8);
    if (bitsPerPixel === 1) {
      const binary = rowPixels.map(value => value === 0 ? "0" : "1").join("");
      bytes.push(parseInt(binary, 2).toString(16).padStart(2, "0").toUpperCase());
    } else {
      const lowBits = rowPixels.map(value => value & 1).join("");
      const highBits = rowPixels.map(value => (value >> 1) & 1).join("");
      bytes.push(parseInt(lowBits, 2).toString(16).padStart(2, "0").toUpperCase());
      bytes.push(parseInt(highBits, 2).toString(16).padStart(2, "0").toUpperCase());
    }
  }
  return bytes;
}

function readTileBytes(address, bitsPerPixel) {
  const byteCount = bitsPerPixel === 1 ? 8 : 16;
  const start = parseInt(address, 16);
  return Array.from({ length: byteCount }, (_, index) => {
    const cellId = (start + index).toString(16).toUpperCase().padStart(4, "0");
    return document.getElementById(cellId)?.textContent || "00";
  });
}

function readTileEditedStates(address, bitsPerPixel) {
  const byteCount = bitsPerPixel === 1 ? 8 : 16;
  const start = parseInt(address, 16);
  return Array.from({ length: byteCount }, (_, index) => {
    const cellId = (start + index).toString(16).toUpperCase().padStart(4, "0");
    return document.getElementById(cellId)?.classList.contains("edited") || false;
  });
}

function writeTileBytes(address, bytes) {
  const start = parseInt(address, 16);
  bytes.forEach((value, index) => {
    const cellId = (start + index).toString(16).toUpperCase().padStart(4, "0");
    const cell = document.getElementById(cellId);
    if (cell) {
      cell.textContent = value;
      cell.classList.add("edited");
    }
  });
}

function undoLastTileImport() {
  if (!lastTileImportUndo) return;
  for (const action of lastTileImportUndo.actions) {
    setTilePixelValues(action.target, action.oldPixels);
    writeTileBytes(action.address, action.oldBytes);
    const start = parseInt(action.address, 16);
    action.oldEditedStates.forEach((wasEdited, index) => {
      const cellId = (start + index).toString(16).toUpperCase().padStart(4, "0");
      document.getElementById(cellId)?.classList.toggle("edited", wasEdited);
    });
  }
  updateChecksums(false);
  scheduleBGMapPreviewRefresh();
  addToLog(`PNG tile replacement in "${lastTileImportUndo.setTitle}" was undone`);
  lastTileImportUndo = null;
  if (currentToast === document.getElementById("tileImportUndo")) dismissCurrentToast();
}

document.addEventListener("DOMContentLoaded", initializeTileImportDialog);

//------------------------------------------------------------------------------------------
// gets pixel data from the ROM and displays them as tiles
function displayTiles(pixelValues, tileAddress, bitsPerPixel, tilesetTitle) {
  const container = document.getElementById("tileContainer");

  const tileCount = Math.ceil(pixelValues.length / 8);
  selectedTile = null;

  const wrapper = document.createElement("div");
  wrapper.className = "wrapper";
  wrapper.id = tileAddress[0];

  for (let t = 0; t < tileCount; t++) {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.id = "tileaddr-" + tileAddress[t];
    tile.setAttribute("data-bpp", bitsPerPixel);    
    tile.dataset.tilesetTitle = tilesetTitle;

    let pixelCount = 0;

    for (let row = 0; row < 8; row++) {
      const rowIndex = t * 8 + row;
      if (rowIndex >= pixelValues.length) {
        break;
      }

      const rowValue = pixelValues[rowIndex].toString().padStart(8, "0");

      const rowContainer = document.createElement("div");
      rowContainer.className = "row";

      for (let col = 0; col < 8; col++) {
        const digit = rowValue[col];

        const pixel = document.createElement("div");
        pixel.className = "pixel";
        
        pixel.setAttribute("data-pixelNumber", pixelCount);
        
        pixel.classList.add(`col${digit}`);

        rowContainer.appendChild(pixel);
        pixelCount++;
      }

      tile.appendChild(rowContainer);
    }

    container.appendChild(tile);
  }

  // ...add only if the element has none yet (I had massive redundancy before that)
  if (!container.hasListener) {
    container.addEventListener("click", handleClick);
    container.hasListener = true;
  }
}

//------------------------------------------------------------------------------------------
// If you click in a tile (a pixel in the tile actually), open the tile dialog
function handleClick(event) {
  const clickedTile = event.target.closest(".tile");

  if (clickedTile) {
    event.stopPropagation(); // Prevent unnecessary propagation

    if (selectedTile !== null) {
      selectedTile.classList.remove("selected");
    }
    selectedTile = clickedTile;
    selectedTile.classList.add("selected");

    const clickedPixel = event.target.closest(".pixel");
    
    const parentTile = clickedPixel.closest(".tile");
    let tileNumber = "?";
    if (parentTile) {
      const tileID = parentTile.id;
      tileNumber = tileID.replace("tileaddr-", "");
    }

    if (clickedPixel) {
      openTileDialog([clickedTile.id.replace("tileaddr-","")],[""], "Tile #" + tileNumber);
    }
  }
}

//------------------------------------------------------------------------------------------
// Modal that let's you edit tiles
// THERE IS A LOT OF ROOM FOR IMPROVEMENT HERE!

function openTileDialog(tileIDs, flags, setName) {

  // Change the set name
  let tileEditorText = document.getElementById('tile-editor-text');
  tileEditorText.textContent = "Tile Editor: " + setName;

  // only show the toggle switch if there is more than one tile
  let toggleSwitchDiv = document.getElementById("tileBorderToggle");
  if(tileIDs.length <= 1) toggleSwitchDiv.style.display = "none";
  else toggleSwitchDiv.style.display = "block";

  const countMap = {};

  // Get the unique tiles and count how many of these there are in this tile set.
  // This is important to identify duplicates
  for (const tileID of tileIDs) {
    if (tileID !== "" && !countMap.hasOwnProperty(tileID)) {
      countMap[tileID] = [0, 0];
    }
  }  

  // Find the matching tiles based on the provided IDs
  const tilesToOpen = [];
  const allTiles = document.querySelectorAll(".tile");

  tileIDs.forEach((idPart) => {
    const matchingTile = Array.from(allTiles).find((tile) => tile.id.includes("tileaddr-" + idPart));
    if (matchingTile) tilesToOpen.push(matchingTile);
  });

  // Show the modal with the selected tiles
  const dialogContainer = document.getElementById("tileModal");
  dialogContainer.style.display = "block";

  const dialogBox = document.getElementById("dialog-box");

  // Create a new wrapper div with class "tile-row"
  let currentRow = document.createElement("div");
  currentRow.classList.add("tile-row");

  // Clone the selected tiles and add them to the dialog box
  tilesToOpen.forEach((tile, index) => {

    // new line
    let newLine = false;
    if (flags[index].includes("n")) newLine = true; // Update the newLine flag if "n" is found in the flags

    // Just some stupid replacements
    if (flags[index] === "en") {
      flags[index] = "e";
      newLine = true;
    }

    // Check if the flag for the current tile is "n" and start a new row if needed
    if (newLine) {
      // Append the current row to the container before starting a new row
      const tileContainer = document.getElementById("tile-container");
      tileContainer.appendChild(currentRow);

      // Create a new row for the next set of tiles
      currentRow = document.createElement("div");
      currentRow.classList.add("tile-row");
      newLine = false;
    }

    let clonedTile;
    // Check if the flag contains "e" (empty) create a dummy tile
    if (flags[index].includes("e")) {
      clonedTile = createDummyTile();
      thisTileAddr = "";
    } else {
      clonedTile = tile.cloneNode(true);
      let splitID = clonedTile.id.split("-");
      let thisTileAddr = splitID[1];

      countMap[thisTileAddr][1]++;
      clonedTile.id = "tileaddr-" + thisTileAddr + "-clone" + countMap[thisTileAddr][1];
    }

    // Check if the flag contains "x" (mirror horizontally)
    if (flags[index].includes("x")) {
      clonedTile.classList.add("mirror-x");
    }

    // Check if the flag contains "y" (mirror vertically)
    if (flags[index].includes("y")) {
      clonedTile.classList.add("mirror-y");
    }

    // Add the class "big" to all div elements with class "pixel" in the cloned tile
    const pixelDivs = clonedTile.getElementsByClassName("pixel");
    Array.from(pixelDivs).forEach((div) => {
      div.classList.add("big");
    });

    // Check if the flag for the current tile is "n" and start a new row if needed
    if (flags[index] === "n") {
      
      // Append the current row to the container before starting a new row
      const tileContainer = document.getElementById("tile-container");
      tileContainer.appendChild(currentRow);

      // Create a new row for the next set of tiles
      currentRow = document.createElement("div");
      currentRow.classList.add("tile-row");
    }

    // Append the cloned tile to the current row
    currentRow.appendChild(clonedTile);

    // Fetch colors from color pickers
    const colors = [];
    for (let i = 0; i < 4; i++) {
      const chosenColor = document.getElementById("color-picker-" + i).value;
      colors.push(chosenColor);
    }

    // Pass the colors array and the clonedTile to the generateColorSelector function
    generateColorSelector(colors, clonedTile); // Pass the cloned tile in an array
  });

  // add the data attribute nclones to the tile
  let dataBppValue;
  if (tilesToOpen.length > 0) {
    tilesToOpen.forEach((tile, index) => {
      // Fetch the data-bpp value only if the tile is not empty
      if (!flags[index].includes("e") && tile.id.indexOf("-") >= 0) {
        let splitID = tile.id.split("-");
        let thisTileAddr = splitID[1];
    
          // After the loop, append the last row (if any) to the container
          const tileContainer = document.getElementById("tile-container");
          tileContainer.appendChild(currentRow);

          for (let i = 1; i <= countMap[thisTileAddr][1]; i++) {
            let thisID = "tileaddr-" + thisTileAddr.toString() + "-clone" + i.toString();
            let thisLoadedTile = document.getElementById(thisID);

            if (thisLoadedTile) {
              thisLoadedTile.setAttribute("data-nclones", countMap[thisTileAddr][1]);
              if (thisLoadedTile.hasAttribute("data-bpp")) {
                dataBppValue = thisLoadedTile.getAttribute("data-bpp");
              }
            }
          }
          
          tileToUpdate = tilesToOpen[0];
        
          // Check if 1BPP. If so, deactivate colors 2 and 3
          clickableDivs = document.getElementsByClassName("clickable-div");
          
          if (dataBppValue === "1") {
            clickableDivs[1].classList.add("not-clickable-div");
            clickableDivs[2].classList.add("not-clickable-div");
          }

          // Set the first color as the current selection
          clickableDivs[0].style.border = o;

      }
    });
  }

  // Bind painting once. Pointer state is also cleared when the pointer leaves the
  // editor, so releasing outside the modal cannot leave painting stuck on.
  if (!dialogBox.dataset.paintBound) {
    dialogBox.addEventListener("pointerdown", handlePixelColoring);
    dialogBox.addEventListener("pointermove", handlePixelColoring);
    dialogBox.addEventListener("pointerleave", stopPixelColoring);
    dialogBox.addEventListener("pointercancel", stopPixelColoring);
    document.addEventListener("pointerup", stopPixelColoring);
    window.addEventListener("blur", stopPixelColoring);
    dialogBox.dataset.paintBound = "true";
  }

  dialogContainer.appendChild(dialogBox);
  document.body.appendChild(dialogContainer);

  // Add a slider to scale the tile
  const pixelSizeSlider = document.getElementById("pixelSizeSlider");
  const currentPixel = dialogBox.querySelector(".pixel.big");
  const currentPixelSize = currentPixel ? parseFloat(getComputedStyle(currentPixel).width) : 8;
  pixelSizeSlider.value = Math.min(
    Number(pixelSizeSlider.max),
    Math.max(Number(pixelSizeSlider.min), currentPixelSize)
  );
  dialogBox.style.setProperty("--tile-pixel-size", `${pixelSizeSlider.value}px`);
  document.getElementById("pixelSizeValue").value = `${pixelSizeSlider.value}×`;

  if (!pixelSizeSlider.dataset.zoomBound) {
    pixelSizeSlider.addEventListener("input", function () {
      dialogBox.style.setProperty("--tile-pixel-size", `${this.value}px`);
      document.getElementById("pixelSizeValue").value = `${this.value}×`;
    });
    pixelSizeSlider.dataset.zoomBound = "true";
  }

  document.getElementById('tileBorders').checked = false;
  document.getElementById("tile-container").classList.remove("show-tile-borders");
}

//------------------------------------------------------------------------------------------
function handlePixelColoring(event) {
  if (event.type === "pointermove" && !(event.buttons & 1)) {
    stopPixelColoring();
    return;
  }

  const selectedPixel = event.target;
  if (selectedPixel.classList.contains("pixel") && !selectedPixel.classList.contains("cole")) {
    if (event.type === "pointerdown" && event.button === 0) {
      event.preventDefault();
      isMouseButtonDown = true;
      setColorAndClass(selectedPixel);
    } else if (event.type === "pointermove" && isMouseButtonDown) {
      event.preventDefault();
      setColorAndClass(selectedPixel);
    }
  }
}

function stopPixelColoring() {
  isMouseButtonDown = false;
}

//------------------------------------------------------------------------------------------

function setColorAndClass(pixel) {
  const clickableDivs = Array.from(document.querySelectorAll(".clickable-div"));
  const selectedDiv = clickableDivs.find((div) => div.style.border === o);
  const newIndex = clickableDivs.indexOf(selectedDiv);
  const selectedColor = selectedDiv ? selectedDiv.style.backgroundColor : "";

  let pixelnumber = pixel.getAttribute("data-pixelnumber");

  // Get the outermost parent div containing the "pixel" div
  const currentTile = pixel.closest(".row").closest("[data-nclones]");

  if (currentTile) {
    const currentTileID = currentTile.id;
    const nClones = currentTile.getAttribute("data-nclones");
    let thisPixel = document.getElementById(currentTileID).querySelector(`[data-pixelnumber="${pixelnumber}"]`);
    for(let i = 0; i < nClones; i++){
      let cloneIDParts = currentTileID.split('-');
      cloneIDParts[cloneIDParts.length - 1] = "clone" + (i + 1).toString();
      let cloneID = cloneIDParts.join('-');
      let clonePixel = document.getElementById(cloneID).querySelector(`[data-pixelnumber="${pixelnumber}"]`);
      clonePixel.style.backgroundColor = selectedColor;
      clonePixel.className = pixel.className.replace(/col\d/, "col" + newIndex);  
    }
  }

}

//------------------------------------------------------------------------------------------
function generateColorSelector(colors, clonedTile) {

  // Get the container where the color selectors will be added
  const colorSelectorContainer = document.querySelector(".color-selector-container");
  colorSelectorContainer.innerHTML = ''; // Clear existing content

  // Array to hold the clickable div elements
  const clickableDivs = [];

  colors.forEach((color) => {
    const clickableDiv = document.createElement("div");
    clickableDiv.className = "clickable-div";
    clickableDiv.style.backgroundColor = color;
    clickableDiv.style.marginRight = "10px";
    clickableDiv.style.border = b;

    // Add click event listener to the color selector
    clickableDiv.addEventListener("click", function () {
      
      // Check if the clickable div does not have the class "not-clickable-div" (1BPP can only have 2 options)
      if (!clickableDiv.classList.contains("not-clickable-div")) {
        clickableDivs.forEach((div) => {
          div.style.border = b;
        });
          
        clickableDiv.style.border = o;
      }
    });

    // Append the clickable div to the color selector container
    colorSelectorContainer.appendChild(clickableDiv);
    clickableDivs.push(clickableDiv); // Add the clickable div to the array
  });
}

//------------------------------------------------------------------------------------------
function closeTileDialog() {
  // Hide the modal instead of removing it from the body
  const dialogContainer = document.getElementById("tileModal");
  const tileDiv = document.getElementById("tile-container");

  dialogContainer.style.display = "none";
  tileDiv.innerHTML = ''; // Clear the dialog box content
  isDialogOpen = false;
  
  // Remove the class "selected" from all divs with class "tile"
  const tiles = document.querySelectorAll(".tile");
  tiles.forEach((currTile) => {
    currTile.classList.remove("selected");
    currTile.removeAttribute("style")
  });
  
  tileToUpdate = null;
}

//------------------------------------------------------------------------------------------
// THIS MAKES NO SENSE! :-D <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// "Discard changes" button
function discardChangesOnTiles(){
  closeTileDialog();
}

//------------------------------------------------------------------------------------------
// Save changes made to tiles
function saveTilesAfterDrawing(){
  
  // Get the tile-container element
  const tileContainer = document.getElementById("tile-container");
  const tilesArray = Array.from(tileContainer.querySelectorAll(".tile"));
  let modifiedTile;
  let thisTileStartAddress;
  let bitsPerPixels;

  for(let i = 0; i<tilesArray.length; i++){
    // only procede if there is a tile and this tile is the first clone
    modifiedTile = tilesArray[i];
    if (modifiedTile && modifiedTile.id && modifiedTile.id.endsWith("-clone1")) {

      // Remove "tileaddr-" and "-clone" from the ID to get the tile address
      thisTileStartAddress = modifiedTile.id.replace("tileaddr-", "").replace("-clone1", "");
      bitsPerPixels = parseInt(modifiedTile.getAttribute("data-bpp"));

      // Remove the "big" and "-clone"
      const modifiedPixelDivs = modifiedTile.getElementsByClassName("pixel");
      const binVals = [];
      const binVals2 = [];
      const hexVals = [];
      const hexVals2 = [];

      modifiedTile.id = modifiedTile.id.replace("-clone1", "");
      modifiedTile.removeAttribute("data-nclones");
      modifiedTile.style.border = "";

      Array.from(modifiedPixelDivs).forEach((div) => {
        div.classList.remove("big");

        const classNames = Array.from(div.classList);
        const colClass = classNames.find((className) => className.startsWith("col"));
        if (colClass) {
          let colNumber = colClass.slice(3);
          if (bitsPerPixels === 1) {
            colNumber /= 3;
            binVals.push(colNumber);
          } else {
            const binaryValue = parseInt(colNumber).toString(2).padStart(2, "0");
            binVals.push(binaryValue[0]);
            binVals2.push(binaryValue[1]);
          }

          // Check if binVals has 8 values, join them and make them a hex value
          if (binVals.length === 8) {
            const joinedValues = binVals.join("");
            const hexValue = parseInt(joinedValues, 2).toString(16).padStart(2, "0").toUpperCase();
            hexVals.push(hexValue);
            binVals.length = 0;
          }

          // Check if binVals2 has 8 values, join them and make them a hex value
          if (binVals2.length === 8) {
            const joinedValues2 = binVals2.join("");
            const hexValue2 = parseInt(joinedValues2, 2).toString(16).padStart(2, "0").toUpperCase();
            hexVals2.push(hexValue2);
            binVals2.length = 0;
          }
        }
      });

      if (bitsPerPixels === 2) {
        const combinedHexVals = [];
      
        for (let i = 0; i < hexVals.length; i++) {
          combinedHexVals.push(hexVals2[i]);
          combinedHexVals.push(hexVals[i]);
        }
      
        hexVals.splice(0, hexVals.length, ...combinedHexVals);

      }
      
      closeTileDialog();

      tileToUpdate = document.getElementById("tileaddr-" + thisTileStartAddress);

      // Replace the original tile with the modified tile
      if (tileToUpdate) {
        tileToUpdate.parentNode.replaceChild(modifiedTile, tileToUpdate);
      }

      // replace the values in the ROM
      const startAddress = thisTileStartAddress;
      let currentAddress = startAddress;

      for (let i = 0; i < hexVals.length; i++) {
        let cellId = currentAddress.toUpperCase();
        let cell = document.querySelector(`td.hexValueCell[id="${cellId}"]`);

        if (cell) {
          cell.textContent = hexVals[i];
        }

        // Increment currentAddress to the next higher hexadecimal value
        let currentNumber = parseInt(currentAddress, 16);
        currentNumber++;
        currentAddress = currentNumber.toString(16).toUpperCase().padStart(4, '0');
      }

      // only scroll for the last entry, otherwise it's overkill
      if(i === tilesArray.length - 1) scrollToAddress(startAddress);

      addToLog("Tile starting at address $" + startAddress + " was overwritten");
    }
  }
}

//------------------------------------------------------------------------------------------
// After selecting a color palette, all tile pixels are changed
function updateColorPalette(selector, color, colorPicker) {
  colorPicker.style.backgroundColor = color;
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    element.style.backgroundColor = color;
  });
}

//------------------------------------------------------------------------------------------
// Function to create the 8x8 dummy tile grid dynamically
// Usage:
// document.getElementById("gridContainer").appendChild(gridElement);
function createDummyTile() {

  // Create a container element for the grid
  const gridContainer = document.createElement("div");
  gridContainer.classList.add("tile", "dummy");

  // Add the data-bpp attribute to the gridContainer
  gridContainer.setAttribute("data-bpp", "0");

  // Create the rows and columns with nested loops
  for (let i = 0; i < 8; i++) {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row");

    for (let j = 0; j < 8; j++) {
      const pixelDiv = document.createElement("div");
      pixelDiv.classList.add("pixel", "cole");
      rowDiv.appendChild(pixelDiv);
    }
    gridContainer.appendChild(rowDiv);
  }

  return gridContainer;
}

//------------------------------------------------------------------------------------------
// Function to create the preview of a screen
// Usage:

function makeScreen(tileSeq, xDim, yDim, outputName) {
  // Create a canvas element
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Calculate the dimensions of the resulting image
  const tileWidth = 32;
  const tileHeight = 32;
  const resultWidth = xDim * tileWidth;
  const resultHeight = yDim * tileHeight;

  // Set the canvas dimensions
  canvas.width = resultWidth;
  canvas.height = resultHeight;

  // Loop through the tiles and draw them on the canvas
  let x = 0;
  let y = 0;
  for (let i = 0; i < tileSeq.length; i++) {
      // Load the tile image from local storage
      const tileImg = new Image();
      tileImg.src = 'path_to_your_local_storage/' + tileSeq[i];

      // Draw the tile image on the canvas
      ctx.drawImage(tileImg, x * tileWidth, y * tileHeight);

      // Move to the next position
      x++;
      if (x >= xDim) {
          x = 0;
          y++;
      }
  }

  // Scale the canvas down to width=400px
  const scaleFactor = 400 / resultWidth;
  const scaledWidth = resultWidth * scaleFactor;
  const scaledHeight = resultHeight * scaleFactor;
  const scaledCanvas = document.createElement('canvas');
  const scaledCtx = scaledCanvas.getContext('2d');
  scaledCanvas.width = scaledWidth;
  scaledCanvas.height = scaledHeight;
  scaledCtx.drawImage(canvas, 0, 0, scaledWidth, scaledHeight);

  // Convert the scaled canvas to an image and save it to local storage
  const scaledImg = scaledCanvas.toDataURL('image/png');
  localStorage.setItem(outputName, scaledImg);
}
