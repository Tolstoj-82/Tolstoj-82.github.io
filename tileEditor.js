//------------------------------------------------------------------------------------------
// get the pixel values from tiles in the ROM (0-3)
function getTileData(startAddress, nTiles, bitsPerPixel, tilesetTitle) {
    const pixelData = [];
    const addresses = [];
    let currentAddress = startAddress;
  
    const tileContainer = document.getElementById("tileContainer");
    tileContainer.innerHTML += "<p>" + tilesetTitle + " (ROM Entry Address = $" + startAddress + ", " + nTiles + " Tiles, " + bitsPerPixel + "BPP)<br></p>";
  
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
  }
  
  //------------------------------------------------------------------------------------------
  // gets pixel data from the ROM and displays them as tiles
  function displayTiles(pixelValues, tileAddress, bitsPerPixel) {
    const container = document.getElementById("tileContainer");
  
    const tileCount = Math.ceil(pixelValues.length / 8);
    let selectedTile = null;
  
    const wrapper = document.createElement("div");
    wrapper.className = "wrapper";
    wrapper.id = tileAddress[0];
  
    for (let t = 0; t < tileCount; t++) {
      const tile = document.createElement("div");
      tile.className = "tile";
      tile.id = "tileaddr-" + tileAddress[t];
      tile.setAttribute("data-BPP", bitsPerPixel);    
  
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
  
          pixel.classList.add(`col${digit}`);
  
          rowContainer.appendChild(pixel);
        }
  
        tile.appendChild(rowContainer);
      }
  
      container.appendChild(tile);
    }
  
    container.addEventListener("click", function (event) {
      const clickedTile = event.target.closest(".tile");
      
      if (clickedTile) {
        if (selectedTile !== null) {
          selectedTile.classList.remove("selected");
        }
        selectedTile = clickedTile;
        selectedTile.classList.add("selected");
        openTileDialog(clickedTile);
      }
    });
  }
  
  let isDialogOpen = false;
  
  //------------------------------------------------------------------------------------------
  // Modal that let's you edit tiles
  // THERE IS A LOT OF ROOM FOR IMPROVEMENT HERE!
  
  function openTileDialog(tile) {
    b = "2px solid black";
    o = "2px solid orange"
  
    if (isDialogOpen) return; // Dialog is already open, do nothing
  
    isDialogOpen = true;
  
    // Create a dialog container
    const dialogContainer = document.createElement("div");
    dialogContainer.className = "dialog-container";
    const dialogBox = document.createElement("div");
    dialogBox.className = "dialog-box";
  
    // Create the Tile
    const tileEditorText = document.createElement("div");
    tileEditorText.textContent = "Tile Editor";
    tileEditorText.className = "tile-editor-text";
    dialogBox.appendChild(tileEditorText);
  
    // Clone the selected tile and add it to the dialog box
    const clonedTile = tile.cloneNode(true);
    clonedTile.style.border = b;
    dialogBox.appendChild(clonedTile);
  
    // Create container for the color selector
    const divContainer = document.createElement("div");
    divContainer.className = "div-container";
    dialogBox.appendChild(divContainer);
  
    // Add the class "big" to all div elements with class "pixel" in the cloned tile
    const pixelDivs = clonedTile.getElementsByClassName("pixel");
    Array.from(pixelDivs).forEach((div) => {
      div.classList.add("big");
    });
  
    // Create color selector
    const clickableDivs = [];
    for (let i = 0; i < 4; i++) {
      const clickableDiv = document.createElement("div");
      clickableDiv.className = "clickable-div";
  
      // Get the background color from the color picker (not on the modal)
      const colorPicker = document.getElementById("color-picker-" + i);
      const backgroundColor = colorPicker.getAttribute("value");
  
      clickableDiv.style.backgroundColor = backgroundColor;
      clickableDiv.style.marginRight = "10px";
      clickableDiv.style.border = b;
  
      divContainer.appendChild(clickableDiv);
  
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
      clickableDivs.push(clickableDiv); // Add the clickable div to the array
    }
  
    // Check if clonedTile has data-BPP equal to 1
    if (clonedTile.getAttribute("data-BPP") === "1") {
      // Disable Colors 2 and 3 (1BPP)
      clickableDivs[1].classList.add("not-clickable-div");
      clickableDivs[2].classList.add("not-clickable-div");
    }
  
    // Set the first color as the current selection
    clickableDivs[0].style.border = o;
  
    let isMouseButtonDown = false;
  
    // Attach event listeners for pixel selection and coloring
    dialogBox.addEventListener("mousedown", handlePixelColoring);
    dialogBox.addEventListener("mousemove", handlePixelColoring);
    dialogBox.addEventListener("mouseup", () => {
      isMouseButtonDown = false;
    });
  
    dialogContainer.appendChild(dialogBox);
    document.body.appendChild(dialogContainer);
  
    // Add a slider to scale the tile
    const pixelSizeSlider = document.createElement("input");
    pixelSizeSlider.type = "range";
    pixelSizeSlider.min = "4";
    pixelSizeSlider.max = "30";
    pixelSizeSlider.value = "28"; // Initial pixel size value
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
  
    // Append the pixel size slider to the dialog box
    dialogBox.insertBefore(pixelSizeSlider, tileEditorText);
  
    function closeTileDialog() {
      document.body.removeChild(dialogContainer);
      isDialogOpen = false;
    }
  
    function handlePixelColoring(event) {
      const selectedPixel = event.target;
      if (selectedPixel.classList.contains("pixel")) {
        if (event.type === "mousedown") {
          isMouseButtonDown = true;
          setColorAndClass(selectedPixel);
        } else if (event.type === "mousemove" && isMouseButtonDown) {
          setColorAndClass(selectedPixel);
        }
      }
    }
    
    // Save changes
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save changes";
    dialogBox.appendChild(saveButton);
    saveButton.style.marginRight = "10px";
    saveButton.style.marginTop = "10px";
    saveButton.addEventListener("click", function () {
      // Get the modified tile from the dialog box
      const modifiedTile = dialogBox.querySelector(".tile-editor-text + div");
  
      // Remove the "big" class from the pixel divs of the modified tile
      const modifiedPixelDivs = modifiedTile.getElementsByClassName("pixel");
      Array.from(modifiedPixelDivs).forEach((div) => {
        div.classList.remove("big");
      });
  
      // Extract the bitsPerPixels value from the data-bpp attribute of the tile div
      const bitsPerPixels = parseInt(tile.getAttribute("data-bpp"));
  
      // Initialize the binVals array
      const binVals = [];
      const binVals2 = [];
      const hexVals = [];
      const hexVals2 = [];
  
      // Get the class names starting with "col" from the modified pixel divs
      Array.from(modifiedPixelDivs).forEach((div) => {
        const classNames = Array.from(div.classList);
        const colClass = classNames.find((className) => className.startsWith("col"));
        if (colClass) {
          let colNumber = colClass.slice(3);
          if (bitsPerPixels === 1) {
            colNumber /= 3;
            // Add the colNumber to binVals
            binVals.push(colNumber);
          } else {
            // Convert colNumber to a 2-digit binary value
            const binaryValue = parseInt(colNumber).toString(2).padStart(2, "0");
            binVals.push(binaryValue[0]);
            binVals2.push(binaryValue[1]);
            //console.log(binVals2);
          }
  
          // Check if binVals has 8 values
          if (binVals.length === 8) {
            // Join 8 values and make them a hex value
            const joinedValues = binVals.join("");
            const hexValue = parseInt(joinedValues, 2).toString(16).padStart(2, "0").toUpperCase();
            hexVals.push(hexValue);
            binVals.length = 0;
          }
  
          // Check if binVals2 has 8 values
          if (binVals2.length === 8) {
            // Join 8 values and make them a hex value
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
  
      // Replace the original tile with the modified tile
      tile.parentNode.replaceChild(modifiedTile, tile);
  
      closeTileDialog();
      
      // replace the values in the ROM
      startAddress = tile.id;
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
      
      
      scrollToAddress(startAddress);
  
      addToLog("Tile starting at address $" + startAddress + " was overwritten");
    });
  
    // Create the "Discard changes" button
    const discardButton = document.createElement("button");
    discardButton.textContent = "Discard changes";
    dialogBox.appendChild(discardButton);
    discardButton.addEventListener("click", function () {
      closeTileDialog();
    });
  
    function setColorAndClass(pixel) {
      const selectedDiv = clickableDivs.find((div) => div.style.border === o);
      const newIndex = clickableDivs.indexOf(selectedDiv);
      const selectedColor = selectedDiv ? selectedDiv.style.backgroundColor : "";
    
      pixel.style.backgroundColor = selectedColor;
      pixel.className = pixel.className.replace(/col\d/, "col" + newIndex);
    }
    
  }
  
  function updateColor(selector, color, colorPicker) {
    colorPicker.setAttribute('value', color);
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
      element.style.backgroundColor = color;
    });
  }