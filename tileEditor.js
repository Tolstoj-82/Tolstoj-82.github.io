//------------------------------------------------------------------------------------------
// get the pixel values from tiles in the ROM (0-3)

function getTileData(startAddress, nTiles, bitsPerPixel, tilesetTitle) {
  const pixelData = [];
  const addresses = [];
  let currentAddress = startAddress;

  const tileContainer = document.getElementById("tileContainer");

  // Add accordion element
  tileContainer.innerHTML += `
    <p><b>${tilesetTitle} (ROM Entry Address = ${startAddress}, ${nTiles} Tiles, ${bitsPerPixel}BPP)</b></p>`;

  // Check if tilesetTitle exists in the first entry of any object in spriteObjects
  const matchingTitles = Object.keys(spriteObjects).filter(title => spriteObjects[title][0] === tilesetTitle);

  // Add the dropdown and button if there were matching titles
  if (matchingTitles.length > 0) {
    //let dropdownHTML = `<p><select id="sprites${tilesetTitle}" onchange="loadObjectSprite(this.value, true)">`;
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

    // Add an event listener to each tile-pixel...
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
        if (clickedPixel) {
          //alert([clickedTile.id.replace("tileaddr-", "")]);
          openTileDialog([clickedTile.id.replace("tileaddr-", "")]);
        }
      }
    }

    // ...add only if the element has none yet (I had massive redundancy before that)
    if (!container.hasListener) {
      container.addEventListener("click", handleClick);
      container.hasListener = true;
    }

  }
 
  //------------------------------------------------------------------------------------------
  // Modal that let's you edit tiles
  // THERE IS A LOT OF ROOM FOR IMPROVEMENT HERE!
  
  // Make sure to have an isDialogOpen variable to track the dialog state
  let isDialogOpen = false;
  let clickableDivs;
  
  function openTileDialog(tileIDs) {

    // Find the matching tiles based on the provided IDs
    const tilesToOpen = [];
    const allTiles = document.querySelectorAll(".tile");

    tileIDs.forEach((idPart) => {
      const matchingTile = Array.from(allTiles).find((tile) =>
        tile.id.includes("tileaddr-" + idPart)
      );

      if (matchingTile) tilesToOpen.push(matchingTile);
    });

    // Show the modal with the selected tiles
    const dialogContainer = document.getElementById("tileModal");
    dialogContainer.style.display = "block";

    const dialogBox = document.getElementById("dialog-box");

    // Clone the selected tiles and add them to the dialog box
    const b = "2px solid black";
    const o = "2px solid orange";
    tilesToOpen.forEach((tile, index) => {
      const clonedTile = tile.cloneNode(true);

      // Add the class "big" to all div elements with class "pixel" in the cloned tile
      const pixelDivs = clonedTile.getElementsByClassName("pixel");
      Array.from(pixelDivs).forEach((div) => {
        div.classList.add("big");
      });

      clonedTile.style.border = b;
      const tileContainer = document.getElementById("tile-container");
      tileContainer.appendChild(clonedTile);

      // Fetch colors from color pickers
      const colors = [];
      for (let i = 0; i < 4; i++) {
        const chosenColor = document.getElementById("color-picker-" + i).value;
        colors.push(chosenColor);
      }

      // Pass the colors array and the clonedTile to the generateColorSelector function
      generateColorSelector(colors, [clonedTile]); // Pass the cloned tile in an array
    });

    // Check if 1BPP. If so, deactivate colors 2 and 3
    clickableDivs = document.getElementsByClassName("clickable-div");
    if (tilesToOpen[0].getAttribute("data-BPP") === "1") {
      clickableDivs[1].classList.add("not-clickable-div");
      clickableDivs[2].classList.add("not-clickable-div");
    }

    // Set the first color as the current selection
    clickableDivs[0].style.border = o;

    // Attach event listeners for pixel selection and coloring
    let isMouseButtonDown = false;
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

    // Save changes
    const saveButton = document.getElementById("saveButton");
    saveButton.addEventListener("click", function () {
      // Get the modified tile from the dialog box
      const modifiedTile = document.getElementById("tile-container").firstElementChild;    

      let thisTileStartAddress;
      let bitsPerPixels;

      // only procede if there is a tile
      if (modifiedTile && modifiedTile.id) {
        thisTileStartAddress = modifiedTile.id.replace("tileaddr-", "");
        bitsPerPixels = parseInt(modifiedTile.getAttribute("data-bpp"));

        // Remove the "big" class from the pixel divs of the modified tile
        const modifiedPixelDivs = modifiedTile.getElementsByClassName("pixel");
        Array.from(modifiedPixelDivs).forEach((div) => {
          div.classList.remove("big");
        });

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

        // Replace the original tile with the modified tile
        if (tileToUpdate) {
          tileToUpdate.parentNode.replaceChild(modifiedTile, tileToUpdate);
        }

        closeTileDialog();

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

        scrollToAddress(startAddress);

        addToLog("Tile starting at address $" + startAddress + " was overwritten");
      }
    });

    // "Discard changes" button
    const discardButton = document.getElementById("discardButton");
    discardButton.addEventListener("click", function () {
      closeTileDialog();
    });
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
 

  function setColorAndClass(pixel) {
    const selectedDiv = clickableDivs.find((div) => div.style.border === o);
    const newIndex = clickableDivs.indexOf(selectedDiv);
    const selectedColor = selectedDiv ? selectedDiv.style.backgroundColor : "";

    pixel.style.backgroundColor = selectedColor;
    pixel.className = pixel.className.replace(/col\d/, "col" + newIndex);
  }
}
  function updateColor(selector, color, colorPicker) {
    colorPicker.style.backgroundColor = color;
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
      element.style.backgroundColor = color;
    });
  }

  function generateColorSelector(colors, clonedTiles) {
    const b = "2px solid black";
    const o = "2px solid orange";
  
    // Get the container where the color selectors will be added
    const colorSelectorContainer = document.querySelector(".color-selector-container");
    colorSelectorContainer.innerHTML = ''; // Clear existing content
  
    // Array to hold the clickable div elements
    const clickableDivs = [];
  
    colors.forEach((color, index) => {
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
  
          // Update the border color of pixels in each clonedTile with the selected color
          const selectedColor = clickableDiv.style.backgroundColor;
          clonedTiles.forEach((clonedTile) => {
            const pixelDivs = clonedTile.getElementsByClassName("pixel");
            Array.from(pixelDivs).forEach((div) => {
              div.style.borderColor = selectedColor;
            });
          });
        }
      });
  
      // Append the clickable div to the color selector container
      colorSelectorContainer.appendChild(clickableDiv);
      clickableDivs.push(clickableDiv); // Add the clickable div to the array
    });
  }
}