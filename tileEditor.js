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

//------------------------------------------------------------------------------------------
// Draws all tiles from the ROM file
function getTileData(startAddress, nTiles, bitsPerPixel, tilesetTitle) {
  const pixelData = [];
  const addresses = [];
  let currentAddress = startAddress;

  const tileContainer = document.getElementById("tileContainer");

  // Add a title
  tileContainer.innerHTML += `
    <p><b>${tilesetTitle} (ROM Entry Address = ${startAddress}, ${nTiles} Tiles, ${bitsPerPixel}BPP)</b></p>`;

  // Check if tilesetTitle exists in the first entry of any object in spriteObjects
  const matchingTitles = Object.keys(spriteObjects).filter(title => spriteObjects[title][0] === tilesetTitle);

  // Add the dropdown and button if there were matching titles
  if (matchingTitles.length > 0) {
    let dropdownHTML = `<p><select id="sprites${tilesetTitle}" oninput="loadObjectSprite(this.value, true)">`;
    dropdownHTML += `<option value="no">--Chose--</option>`;
    for (const title of matchingTitles) {
      dropdownHTML += `<option value="${title}">${title}</option>`;
    }
    dropdownHTML += '</select>&nbsp;';
    dropdownHTML += `<button onclick="loadObjectSprite(document.getElementById('sprites${tilesetTitle}').value, false)">Load Tile Group</button></p>`;
    tileContainer.innerHTML += dropdownHTML;
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

  displayTiles(pixelData, addresses, bitsPerPixel);

  // Add a button to save the tile set as a PNG
  let thisWidth = getTileSetProperty(tilesetTitle, "width");
  let thisSetName = getTileSetProperty(tilesetTitle, "name");
  let savePngHTML = `<p><button onclick="saveTileSet([${addresses.map(address => `'${address}'`).join(',')}], ${nTiles}, ${bitsPerPixel}, '${thisSetName}', ${thisWidth});" class="secondary">Save Tile Group as "${thisSetName}.png"</button></p>`;

  tileContainer.innerHTML += savePngHTML;
  
}

//------------------------------------------------------------------------------------------
// 
function saveTileSet(addresses, nTiles, bitsPerPixel, name, width) {
  console.log(addresses[0]);
  console.log(nTiles);
  console.log(bitsPerPixel);
  console.log(name);
  console.log(width);

  // Get the tileContainer div
  const tileContainer = document.getElementById("tileContainer");
  const tileDiv = tileContainer.querySelector("#tileaddr-" + addresses[0]);

  // Check if the tile div exists
  if (tileDiv) {
    // Get all pixel divs inside the tile div
    const pixelDivs = tileDiv.getElementsByClassName("pixel");

    // Loop through each pixel div
    for (let i = 0; i < pixelDivs.length; i++) {
      const pixelDiv = pixelDivs[i];
      const classes = pixelDiv.classList; // Get all classes of the pixel div

      // Loop through each class to find the one that starts with "col"
      for (let j = 0; j < classes.length; j++) {
        const className = classes[j];

        if (className.startsWith("col")) {
          const value = className.substring(3); // Extract the value after "col"
          console.log("Value after 'col':", exportColors[parseInt(value)]);
          break; // Stop the loop since we found the class we're looking for
        }
      }
    }
  }
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
// gets pixel data from the ROM and displays them as tiles
function displayTiles(pixelValues, tileAddress, bitsPerPixel) {
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
  var tileEditorText = document.getElementById('tile-editor-text');
  tileEditorText.textContent = "Tile Editor (" + setName + ")";

  // only show the toggle switch if there is more than one tile
  var toggleSwitchDiv = document.getElementById("tileBorderToggle");
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
    if (flags[index] == "en") {
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
    clonedTile.style.border = "none";
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
    
        // Adding a delay before executing is an ugly but necessary tweak to make sure the tile DOMs are loaded
        //setTimeout(() => {   

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

        //}, 200);
      }
    });
  }

  // Attach event listeners for pixel selection and coloring
  dialogBox.addEventListener("mousedown", handlePixelColoring);
  dialogBox.addEventListener("mousemove", handlePixelColoring);
  dialogBox.addEventListener("mouseup", () => {
    isMouseButtonDown = false;
  });

  dialogContainer.appendChild(dialogBox);
  document.body.appendChild(dialogContainer);

  // Add a slider to scale the tile
  const pixelSizeSlider = document.getElementById("pixelSizeSlider");
  pixelSizeSlider.addEventListener("input", function () {
    const pixelSize = pixelSizeSlider.value;
    const bigPixelStyle = `.pixel.big {
      width: ${pixelSize}px;
      height: ${pixelSize}px;
    }`;
    const styleElement = document.getElementById("pixel-size-style");
    styleElement.textContent = bigPixelStyle;
  });

  // Create a style element to hold the dynamic pixel size style
  const pixelSizeStyle = document.createElement("style");
  pixelSizeStyle.id = "pixel-size-style";
  document.head.appendChild(pixelSizeStyle);

  document.getElementById('tileBorders').checked = false;
}

//------------------------------------------------------------------------------------------
function handlePixelColoring(event) {
  const selectedPixel = event.target;
  if (selectedPixel.classList.contains("pixel") && !selectedPixel.classList.contains("cole")) {
    if (event.type === "mousedown") {
      isMouseButtonDown = true;
      setColorAndClass(selectedPixel);
    } else if (event.type === "mousemove" && isMouseButtonDown) {
      setColorAndClass(selectedPixel);
    }
  }
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
    for(i=0; i<nClones; i++){
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
      startAddress = thisTileStartAddress;
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
      if(i==(tilesArray.length-1)) scrollToAddress(startAddress);

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
// const gridElement = createDummyTile();
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