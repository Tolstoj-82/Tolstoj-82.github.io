// global variables defines initial mino and empty mino
let currentMino = "87";


//------------------------------------------------------------------------------------------
// Define the event listener function
function trackKeyPress(event) {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.target.closest("input, textarea, select, [contenteditable='true']")) return;

    const key = event.key.toUpperCase();
    let tileIndex = -1;
    if (/^[0-9]$/.test(key)) tileIndex = Number(key);
    if (/^[A-Z]$/.test(key)) tileIndex = key.charCodeAt(0) - 55;
    const cell = tileIndex >= 0
      ? document.querySelector(`#BG-vramgrid .BG-cell[id="${tileIndex.toString(16).padStart(2, "0").toUpperCase()}"]`)
      : null;
    if (cell !== null) {
      event.preventDefault();
      selectBGVramCell(cell);
    }
  }

function selectBGVramCell(cell) {
  if (!cell?.classList.contains("BG-cell")) return;
  document.querySelectorAll("#BG-vramgrid .BG-cell").forEach(otherCell => {
    otherCell.classList.remove("selected");
  });
  cell.classList.add("selected");
  currentMino = cell.id;
  document.getElementById("BG-vramgrid").style.borderColor = "rgb(158, 210, 144)";
}

function getSequentialBGVramCells(startId, count) {
  const cells = Array.from(document.querySelectorAll("#BG-vramgrid .BG-cell"));
  if (!cells.length || count < 1) return [];
  const startIndex = Math.max(0, cells.findIndex(cell => cell.id === startId));
  return Array.from({ length: count }, (_, offset) =>
    cells[(startIndex + offset) % cells.length]
  );
}
  
  // Function to enable key press tracking
  function enableKeyPressTracking() {
    document.addEventListener("keydown", trackKeyPress);
  }
  
  // Function to disable key press tracking
  function disableKeyPressTracking() {
    document.removeEventListener("keydown", trackKeyPress);
  }

//------------------------------------------------------------------------------------------
// create the background map
function addMatrix(cols, rows) {

    // Deconstruct the existing matrix
    const ol = document.getElementById("selectable");
    while (ol.firstChild) ol.removeChild(ol.firstChild);

    // Set the width and height dynamically
    const width = cols * 32;
    const height = rows * 32;
    ol.style.width = `${width}px`;
    ol.style.height = `${height}px`;

    for (let i = 1; i <= rows * cols; i++) {
        const li = document.createElement("li");
        const img = document.createElement("img");
        li.appendChild(img);
        li.classList.add("BG-stack");
        ol.appendChild(li);

    }
}


//------------------------------------------------------------------------------------------
// Given the user selection, add tiles to the playfield.
document.addEventListener("DOMContentLoaded", () => {
  const selectable = document.getElementById("selectable");
  const vramGrid = document.getElementById("BG-vramgrid");
  const backgroundMapContainer = document.querySelector(".BG-container");
  const borderToggle = document.getElementById("bgTileBorders");
  let selectionStart = null;
  let selectionStartedWithCtrl = false;
  let selectionMarquee = null;
  let copiedSelection = null;
  let copyOverlay = null;
  let copySourceOutline = null;
  let highlightedVramImage = null;
  let vramSelectionStart = null;
  let vramSelectionMarquee = null;
  const placementUndoStack = [];

  function clearCopySelection() {
    copiedSelection = null;
    selectable.querySelectorAll(".copy-source, .copy-target").forEach(item => item.classList.remove("copy-source", "copy-target"));
    copyOverlay?.remove();
    copyOverlay = null;
    copySourceOutline?.remove();
    copySourceOutline = null;
  }

  function getMapCell(event) {
    return document.elementFromPoint(event.clientX, event.clientY)?.closest("#selectable > li") || null;
  }

  function showCopyTarget(event) {
    if (!copiedSelection || !event.ctrlKey) return;
    const target = getMapCell(event);
    if (!target) return;
    const items = Array.from(selectable.children);
    const columns = Math.round(selectable.getBoundingClientRect().width / 32);
    const targetIndex = items.indexOf(target);
    const targetColumn = targetIndex % columns;
    const targetRow = Math.floor(targetIndex / columns);
    selectable.querySelectorAll(".copy-target").forEach(item => item.classList.remove("copy-target"));
    copiedSelection.targets = copiedSelection.tiles.map(tile => {
      const column = targetColumn + tile.column;
      const row = targetRow + tile.row;
      return column >= 0 && column < columns ? items[row * columns + column] : null;
    });
    copiedSelection.targets.forEach(item => item?.classList.add("copy-target"));
    const rect = target.getBoundingClientRect();
    copyOverlay.style.left = `${rect.left}px`;
    copyOverlay.style.top = `${rect.top}px`;
  }

  function beginCopyPlacement(selectedItems, sourceColumns = null) {
    const source = selectedItems[0].parentElement;
    const items = Array.from(source.children);
    const columns = sourceColumns || Math.round(source.getBoundingClientRect().width / 32);
    const indexes = selectedItems.map(item => items.indexOf(item));
    const minColumn = Math.min(...indexes.map(index => index % columns));
    const minRow = Math.min(...indexes.map(index => Math.floor(index / columns)));
    const maxColumn = Math.max(...indexes.map(index => index % columns));
    const maxRow = Math.max(...indexes.map(index => Math.floor(index / columns)));
    copiedSelection = {
      tiles: selectedItems.map(item => {
        const index = items.indexOf(item);
        const image = item.querySelector("img");
        return { column: index % columns - minColumn, row: Math.floor(index / columns) - minRow, tileId: image.dataset.tileId || item.id, src: image.src };
      }),
      targets: []
    };
    const sourceLeft = Math.min(...selectedItems.map(item => item.getBoundingClientRect().left));
    const sourceTop = Math.min(...selectedItems.map(item => item.getBoundingClientRect().top));
    const sourceRight = Math.max(...selectedItems.map(item => item.getBoundingClientRect().right));
    const sourceBottom = Math.max(...selectedItems.map(item => item.getBoundingClientRect().bottom));
    copySourceOutline = document.createElement("div");
    copySourceOutline.className = "bg-copy-source-outline";
    copySourceOutline.style.left = `${sourceLeft}px`;
    copySourceOutline.style.top = `${sourceTop}px`;
    copySourceOutline.style.width = `${sourceRight - sourceLeft}px`;
    copySourceOutline.style.height = `${sourceBottom - sourceTop}px`;
    document.body.appendChild(copySourceOutline);
    copyOverlay = document.createElement("div");
    copyOverlay.className = "bg-copy-overlay";
    copyOverlay.style.width = `${(maxColumn - minColumn + 1) * 32}px`;
    copyOverlay.style.height = `${(maxRow - minRow + 1) * 32}px`;
    copiedSelection.tiles.forEach(tile => {
      const image = document.createElement("img");
      image.src = tile.src;
      image.style.left = `${tile.column * 32}px`;
      image.style.top = `${tile.row * 32}px`;
      copyOverlay.appendChild(image);
    });
    document.body.appendChild(copyOverlay);
  }

  function placeCopiedSelection() {
    if (!copiedSelection || copiedSelection.targets.some(target => !target)) return;
    const undoChanges = copiedSelection.targets.map(item => {
      const image = item.querySelector("img");
      return { item, src: image.src, tileId: image.dataset.tileId };
    });
    copiedSelection.tiles.forEach((tile, index) => {
      const item = copiedSelection.targets[index];
      const image = item.querySelector("img");
      image.src = tile.src;
      image.dataset.tileId = tile.tileId;
      const label = item.querySelector(".BGtileID");
      if (label) label.textContent = tile.tileId;
    });
    placementUndoStack.push(undoChanges);
    clearCopySelection();
  }

  function undoLastPlacement() {
    const changes = placementUndoStack.pop();
    if (!changes) return;
    changes.forEach(({ item, src, tileId }) => {
      const image = item.querySelector("img");
      image.src = src;
      image.dataset.tileId = tileId;
      const label = item.querySelector(".BGtileID");
      if (label) label.textContent = tileId;
    });
  }

  function updateVramSelection(event) {
    if (!vramSelectionStart) return;
    const rect = {
      left: Math.min(vramSelectionStart.x, event.clientX), right: Math.max(vramSelectionStart.x, event.clientX),
      top: Math.min(vramSelectionStart.y, event.clientY), bottom: Math.max(vramSelectionStart.y, event.clientY)
    };
    vramGrid.querySelectorAll(".BG-cell").forEach(cell => {
      const bounds = cell.getBoundingClientRect();
      cell.classList.toggle("copy-selecting", bounds.right >= rect.left && bounds.left <= rect.right
        && bounds.bottom >= rect.top && bounds.top <= rect.bottom);
    });
    vramSelectionMarquee.style.left = `${rect.left}px`;
    vramSelectionMarquee.style.top = `${rect.top}px`;
    vramSelectionMarquee.style.width = `${rect.right - rect.left}px`;
    vramSelectionMarquee.style.height = `${rect.bottom - rect.top}px`;
  }

  vramGrid.addEventListener("pointerdown", event => {
    if (!event.ctrlKey || !event.target.closest(".BG-cell")) return;
    event.preventDefault();
    clearCopySelection();
    vramGrid.setPointerCapture(event.pointerId);
    vramSelectionStart = { x: event.clientX, y: event.clientY };
    vramGrid.querySelectorAll(".copy-selecting").forEach(cell => cell.classList.remove("copy-selecting"));
    vramSelectionMarquee = document.createElement("div");
    vramSelectionMarquee.className = "selection-marquee";
    document.body.appendChild(vramSelectionMarquee);
    updateVramSelection(event);
  });
  vramGrid.addEventListener("pointermove", updateVramSelection);
  vramGrid.addEventListener("pointerup", event => {
    if (!vramSelectionStart) return;
    const selectedCells = Array.from(vramGrid.querySelectorAll(".BG-cell.copy-selecting"));
    if (event.ctrlKey && selectedCells.length) beginCopyPlacement(selectedCells, 16);
    selectedCells.forEach(cell => cell.classList.remove("copy-selecting"));
    vramGrid.releasePointerCapture(event.pointerId);
    vramSelectionMarquee.remove();
    vramSelectionMarquee = null;
    vramSelectionStart = null;
  });

  function clearVramTileHighlight() {
    if (highlightedVramImage) {
      highlightedVramImage.classList.remove("highlighted");
      highlightedVramImage = null;
    }
    document.querySelectorAll("#BG-vramgrid img.highlighted").forEach(image => {
      image.classList.remove("highlighted");
    });
  }

  function highlightVramTileForMapImage(image) {
    clearVramTileHighlight();
    if (!image || isMouseButtonPressed) return;
    const tileId = image.dataset.tileId?.toUpperCase();
    if (!tileId) return;
    highlightedVramImage = document.querySelector(
      `#BG-vramgrid .BG-cell[id="${tileId}"] img`
    );
    highlightedVramImage?.classList.add("highlighted");
  }

  selectable.addEventListener("pointerover", event => {
    const image = event.target.closest("li img[data-tile-id]");
    if (image && event.buttons === 0) highlightVramTileForMapImage(image);
  });
  selectable.addEventListener("pointerout", event => {
    const image = event.target.closest("li img[data-tile-id]");
    if (image && !image.contains(event.relatedTarget)) clearVramTileHighlight();
  });
  selectable.addEventListener("pointerdown", () => {
    isMouseButtonPressed = true;
    clearVramTileHighlight();
  });
  selectable.addEventListener("pointerup", event => {
    isMouseButtonPressed = false;
    highlightVramTileForMapImage(event.target.closest("li img[data-tile-id]"));
  });
  selectable.addEventListener("pointerleave", clearVramTileHighlight);
  window.addEventListener("blur", () => {
    isMouseButtonPressed = false;
    clearVramTileHighlight();
  });

  borderToggle?.addEventListener("change", () => {
    backgroundMapContainer?.classList.toggle(
      "show-tile-borders",
      borderToggle.checked
    );
  });

  function updateSelection(event) {
    if (!selectionStart) return;

    const selectionRect = {
      left: Math.min(selectionStart.x, event.clientX),
      right: Math.max(selectionStart.x, event.clientX),
      top: Math.min(selectionStart.y, event.clientY),
      bottom: Math.max(selectionStart.y, event.clientY)
    };

    selectable.querySelectorAll("li").forEach(item => {
      const itemRect = item.getBoundingClientRect();
      const intersects = itemRect.right >= selectionRect.left
        && itemRect.left <= selectionRect.right
        && itemRect.bottom >= selectionRect.top
        && itemRect.top <= selectionRect.bottom;
      item.classList.toggle("ui-selecting", intersects);
    });

    selectionMarquee.style.left = `${selectionRect.left}px`;
    selectionMarquee.style.top = `${selectionRect.top}px`;
    selectionMarquee.style.width = `${selectionRect.right - selectionRect.left}px`;
    selectionMarquee.style.height = `${selectionRect.bottom - selectionRect.top}px`;
  }

  selectable.addEventListener("pointerdown", event => {
    if (!event.target.closest("li")) return;
    event.preventDefault();
    if (copiedSelection) {
      if (event.ctrlKey) placeCopiedSelection();
      else clearCopySelection();
      return;
    }
    selectable.setPointerCapture(event.pointerId);
    selectionStart = { x: event.clientX, y: event.clientY };
    selectionStartedWithCtrl = event.ctrlKey;
    selectable.querySelectorAll(".ui-selecting").forEach(item => item.classList.remove("ui-selecting"));
    selectionMarquee = document.createElement("div");
    selectionMarquee.className = "selection-marquee";
    document.body.appendChild(selectionMarquee);
    updateSelection(event);
  });

  selectable.addEventListener("pointermove", updateSelection);
  selectable.addEventListener("pointermove", showCopyTarget);
  selectable.addEventListener("pointerup", event => {
    if (!selectionStart) return;

    const selectedItems = Array.from(selectable.querySelectorAll(".ui-selecting"));
    const copyWasCancelled = selectionStartedWithCtrl && !event.ctrlKey;
    const isCopyGesture = selectionStartedWithCtrl && event.ctrlKey;
    const sourceCells = event.shiftKey && !isCopyGesture
      ? getSequentialBGVramCells(currentMino.toUpperCase(), selectedItems.length)
      : [];
    if (copyWasCancelled) {
      // Releasing Ctrl before placement makes the complete gesture a no-op.
    } else if (isCopyGesture && selectedItems.length) {
      beginCopyPlacement(selectedItems);
      showCopyTarget(event);
    } else {
      const undoChanges = [];
      selectedItems.forEach((item, index) => {
        const tileId = event.shiftKey
          ? sourceCells[index]?.id
          : currentMino.toUpperCase();
        const imageSource = tileId
          ? localStorage.getItem("tileImage-" + tileId)
          : null;
        if (imageSource) {
          const image = item.querySelector("img");
          undoChanges.push({ item, src: image.src, tileId: image.dataset.tileId });
          image.src = imageSource;
          image.dataset.tileId = tileId;

          const tileIdElement = item.querySelector(".BGtileID");
          if (tileIdElement) tileIdElement.textContent = tileId;
        }
        item.classList.remove("ui-selecting");
      });
      if (undoChanges.length) placementUndoStack.push(undoChanges);
    }
    selectedItems.forEach(item => item.classList.remove("ui-selecting"));
    if (event.shiftKey && sourceCells.length) {
      const nextCell = getSequentialBGVramCells(
        sourceCells[sourceCells.length - 1].id,
        2
      )[1];
      selectBGVramCell(nextCell);
    }

    selectable.releasePointerCapture(event.pointerId);
    selectionMarquee.remove();
    selectionMarquee = null;
    selectionStart = null;
    selectionStartedWithCtrl = false;
  });
  document.addEventListener("keyup", event => {
    if (event.key === "Control") clearCopySelection();
  });
  document.addEventListener("keydown", event => {
    const modal = document.getElementById("BG-myModal");
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z"
      && modal.style.display !== "none" && placementUndoStack.length) {
      event.preventDefault();
      clearCopySelection();
      undoLastPlacement();
    }
  });
  document.addEventListener("bgmaploaded", () => {
    placementUndoStack.length = 0;
    clearCopySelection();
  });
  const shortcutDialog = document.getElementById("bgShortcutHelpDialog");
  document.getElementById("openBGShortcutHelp")?.addEventListener("click", () => shortcutDialog.showModal());
  document.getElementById("closeBGShortcutHelp")?.addEventListener("click", () => shortcutDialog.close());
  window.addEventListener("blur", clearCopySelection);
});

//------------------------------------------------------------------------------------------
// Collects the tiles, that go to the VRAM Grid
// These were assigned the data attribute "data-vram"
// containing the index 0-255 in the vram tile set
function loadTileContentToVRAMGrid() {
    
    // Clear existing cells in the VRAM grid
    const vramGrid = document.querySelector(".BG-vramgrid");
    vramGrid.innerHTML = "";

    let firstAvailableCell = null;

    // VRAM Grid (right)
    for (let i = 0; i < 256; i++) {
        let hexId = i.toString(16).padStart(2, "0").toUpperCase();
        let cell = document.createElement("div");
        
        let imageSrc = localStorage.getItem("tileImage-" + hexId);
        if (imageSrc) {
            cell.classList.add("BG-cell");
            cell.id = hexId;
            let img = document.createElement("img");
            img.src = imageSrc;
            img.style.width = "100%";
            img.style.height = "100%";
            img.style.imageRendering = "pixelated";
            cell.appendChild(img);
            if (!firstAvailableCell) firstAvailableCell = cell;
            cell.addEventListener("click", function() {
                selectBGVramCell(this);
            });
        }else{
            cell.classList.add("not-clickable-div");
        }

        vramGrid.appendChild(cell);

    }

    if (firstAvailableCell) firstAvailableCell.click();
}

//------------------------------------------------------------------------------------------
// loads a VRAM Tile Set
// assigns data-vram attribute to the tile divs starting at 1 (max 256 tiles!)
// setToLoad is an array of arrays and can be found as "vRamTileSets" in the lookup tables
// these are "Start-Set", "Game Play-Set" or "Celebration-Set"
function assignVramTileSet(setToLoad, cacheImages = true) {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
      tile.removeAttribute('data-vram');
    });
  
    let vramIndex = 0;
  
    setToLoad.forEach(set => {
      const [start, nTiles, bitsPerPixel] = set;
    
      let currentId = parseInt(start, 16);
      const incrementValue = bitsPerPixel === 1 ? 8 : 16;
  
      for (let i = 0; i < nTiles; i++) {
        const currentIdHex = currentId.toString(16).toUpperCase();
        const tile = document.getElementById("tileaddr-" + currentIdHex);
        
        if (tile) {
            let vramValue = (i + vramIndex).toString(16).padStart(2, "0").toUpperCase();
            tile.setAttribute('data-vram', vramValue);

            if (cacheImages) saveTileToLocalStorage(vramValue);
        }        

        currentId += incrementValue;
      }
      vramIndex += nTiles;
    });


}

//------------------------------------------------------------------------------------------
// saves a tile to the local storage
// a tile div is made into an 8x8 px image
function saveTileToLocalStorage(vramAddress) {
  let canvas = document.createElement("canvas");
  canvas.width = 8;
  canvas.height = 8;
  let context = canvas.getContext("2d");

  let div = document.querySelector('.tile[data-vram="' + vramAddress + '"]');
  if (!div) return false;
  
  let pixels = div.getElementsByClassName("pixel");
  if (!pixels.length) return false;

  let pixelStyles = window.getComputedStyle(pixels[0]); // Get computed styles for the first pixel

  for (let i = 0; i < pixels.length; i++) {
    let pixel = pixels[i];
    let pixelStyles = window.getComputedStyle(pixel);
    let color = pixelStyles.backgroundColor;

    let x = i % 8;
    let y = Math.floor(i / 8);
    context.fillStyle = color;
    context.fillRect(x, y, 1, 1);
  }

  let imageDataURL = canvas.toDataURL();
  let localStorageKey = "tileImage-" + vramAddress;
  localStorage.setItem(localStorageKey, imageDataURL);
  return true;
}

//------------------------------------------------------------------------------------------
// exchanges src of images (BG Map) also adds the address in a DIV. This can be toggled.
let isMouseButtonPressed = false;

function displayTileImageFromLocalStorage(tileAddress, imgId) {
  let localStorageKey = "tileImage-" + tileAddress;
  let imageDataURL = localStorage.getItem(localStorageKey);

  if (imageDataURL) {
    let img = document.getElementById(imgId);
    if (img) {
      img.src = imageDataURL;
      img.setAttribute("data-tile-ID", tileAddress);

      // Get the parent <li> element of the img
      let liElement = img.parentNode;
      if (liElement) {
        // Clear existing content of the <li> element
        liElement.innerHTML = '';

        // Create a <div> element for the tileAddress and make it invisible
        let divElement = document.createElement('div');
        divElement.textContent = tileAddress;
        divElement.classList.add('BGtileID');
        divElement.style.display = 'none';

        // Append the img and the div to the <li> element
        liElement.appendChild(img);
        liElement.appendChild(divElement);

      }
    }
  }
}

//------------------------------------------------------------------------------------------
// wipes images from local storage
// tiles 00 to FF
function wipeTilesFromLocalStorage() {
    for (let i = 0; i < 256; i++) {
      const imageID = i.toString(16).padStart(2, '0').toUpperCase();
      const key = 'tileImage-' + imageID;
      if (localStorage.getItem(key)) localStorage.removeItem(key);
    }
}

//------------------------------------------------------------------------------------------
// Toggles the visibility in the BG Map (image or address)
function toggleBGImages() {
  let olElement = document.getElementById("selectable");
  if (!olElement) return;

  let liElements = olElement.getElementsByTagName("li");
  for (let i = 0; i < liElements.length; i++) {
      let imgElement = liElements[i].querySelector("img");
      let bgDiv = liElements[i].querySelector(".BGtileID");
      if (imgElement && bgDiv) {
          if (imgElement.style.display === "none") {
              imgElement.style.display = "block";
              bgDiv.style.display = "none";
          } else {
              imgElement.style.display = "none";
              bgDiv.style.display = "block";
          }
      }
  }
}
