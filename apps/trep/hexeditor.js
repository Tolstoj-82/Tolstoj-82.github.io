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
let activeBGMapDraft = null;
let sessionBGMapCounter = 0;
const sessionBGMaps = new Map();
let draggedBGMapRegionRow = null;
let visualBGMapRegionRow = null;
let visualBGMapRangeStart = null;
let bgPreviewRefreshFrame = null;
const dirtyBGMapPreviews = new Set();
let pendingHeaderCell = null;
let pendingBGMapBinImport = null;
let headerAddressesEnabled = false;
let gameGenieWarningActive = false;
const originalTetrisSha256 = "0D6535AEF23969C7E5AF2B077ACADDB4A445B3D0DF7BF34C8ACEF07B51B015C3";
const nonOriginalRomWarningStorageKey = "trep-hide-non-original-rom-warning";
const protectedRomAddresses = new Set(["01FD", "01FE", "01FF"]);
let defaultTileAddresses = null;
let defaultBGMapAddresses = null;
let defaultTileDefinitions = null;
let defaultBGMapDefinitions = null;
let defaultVramDefinitions = null;
const stagedRomFiles = new Map();
const metadataTileExportData = new Map();

const linkerTileSymbols = {
  "ABC": ["Gfx_Ascii", 0],
  "Game Play": ["Gfx_MenuScreens", 0],
  "Start Screen": ["Gfx_TitleScreen", 0],
  "Partial": ["Gfx_TitleScreen", 0],
  "Celebration": ["Gfx_RocketScene", 0x168]
};

const linkerBGMapSymbols = {
  "Copyright Screen": ["Layout_TitleScreen", 0],
  "Title Screen": ["Layout_GameMusicTypeScreen", 0],
  "Music Type": ["Layout_ATypeSelectionScreen", 0],
  "A-Type Select": ["Layout_BTypeSelectionScreen", 0],
  "B-Type Select": ["GameScreenLayout_Dancers", 0],
  "A-Playfield": ["Layout_ATypeInGame", 0],
  "B-Playfield": ["Layout_BTypeInGame", 0],
  "Mario & Luigi": ["Layout_2PlayerInGame", 0],
  "2P-Playfield": ["Layout_MarioScore", 0],
  "Celebration": ["Layout_MarioLuigiScreen", 0x63],
  "Score Counter": ["GameScreenLayout_ScoreTotals", 0],
  "Mario Score": ["Layout_MarioScore", 0x168],
  "Luigi Score": ["Layout_BricksAndLuigiScore", 0x168],
  "Platform": ["Layout_RocketScene", 0x168],
  "Pause": ["GameInnerScreenLayout_Pause", 0],
  "Game Over": ["GameInnerScreenLayout_GameOver", 0]
};

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

  document.getElementById("romFileInput").addEventListener("change", event => {
    stageRomFiles(Array.from(event.target.files));
    event.target.value = "";
  });
  document.getElementById("continueWithRomFiles").addEventListener("click", () => {
    validateFile(getEnabledStagedRomFiles());
  });
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
  initializeHeaderEditors();
  initializeHeaderAddressDialog();
  const nonOriginalRomDialog = document.getElementById("nonOriginalRomDialog");
  document.getElementById("closeNonOriginalRomDialog").addEventListener("click", () => nonOriginalRomDialog.close());
  nonOriginalRomDialog.addEventListener("close", () => {
    if (document.getElementById("hideNonOriginalRomWarning").checked) {
      localStorage.setItem(nonOriginalRomWarningStorageKey, "1");
    }
  });
  initializeToastCloseButtons();
  initializeBGMapList();
  initializeBGMapBinImportDialog();
  initializeBGMapLayoutControls();
  document.getElementById("toggleGGCodes").addEventListener("click", event => {
    const content = document.getElementById("ggCodesContent");
    content.hidden = false;
    event.currentTarget.setAttribute("aria-expanded", "true");
    event.currentTarget.hidden = true;
    document.getElementById("ggCodesInlineWarning").hidden = true;
  });

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

  const userPaletteNames = new Set([
    "CTWC UK 2024 (Lucy)",
    "Realistic GB (Tolstoj)",
    "Bright Super GB (Alecat)",
    "Candy Carnival (Alecat)",
    "Desert (Alecat)",
    "Pan Pride (Alecat)",
    "Ace Pride (Alecat)",
    "Trans Pride (Alecat)",
    "Bright GB (Alecat)"
  ]);
  const paletteGroups = [
    {
      label: "User Palettes",
      matches: name => userPaletteNames.has(name),
      optionLabel: name => name
    },
    {
      label: "GB Standard Palettes",
      matches: name => !userPaletteNames.has(name)
        && !name.startsWith("SGB-")
        && !name.startsWith("GBC:"),
      optionLabel: name => name
    },
    {
      label: "Super GB Palettes",
      matches: name => name.startsWith("SGB-"),
      optionLabel: name => name.slice(4)
    },
    {
      label: "GB Color Palettes",
      matches: name => name.startsWith("GBC:") && !name.startsWith("GBC: Pokémon"),
      optionLabel: name => name.slice(5)
    },
    {
      label: "GB Color Pokémon Palettes",
      matches: name => name.startsWith("GBC: Pokémon"),
      optionLabel: name => name.slice(5)
    }
  ];

  paletteGroups.forEach(groupDefinition => {
    const group = document.createElement("optgroup");
    group.label = groupDefinition.label;

    Object.keys(paletteLookup)
      .filter(groupDefinition.matches)
      .forEach(paletteName => {
        const option = document.createElement("option");
        option.value = paletteName;
        option.textContent = groupDefinition.optionLabel(paletteName);
        group.appendChild(option);
      });

    if (group.children.length > 0) dropdown.appendChild(group);
  });
  dropdown.value = "BGB Emulator";

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

    const files = Array.from(event.dataTransfer.files);
    if (!files.length) {
      return;
    }

    stageRomFiles(files);
  });
}

function romFileType(filename) {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".trep.json")) return ".trep.json";
  if (lower.endsWith(".gb")) return ".gb";
  if (lower.endsWith(".sym")) return ".sym";
  if (lower.endsWith(".map")) return ".map";
  return null;
}

function formatRomFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getEnabledStagedRomFiles() {
  return Array.from(stagedRomFiles.values())
    .map(entry => entry.file);
}

function validateStagedRomCombination(files = getEnabledStagedRomFiles()) {
  const counts = { ".gb": 0, ".sym": 0, ".map": 0, ".trep.json": 0 };
  files.forEach(file => counts[romFileType(file.name)]++);
  const hasOneEach = Object.values(counts).every(count => count <= 1);
  const valid = hasOneEach && counts[".gb"] === 1 && (
    files.length === 1
    || (files.length === 3 && counts[".sym"] === 1 && counts[".map"] === 1)
    || (files.length === 4 && counts[".sym"] === 1 && counts[".map"] === 1 && counts[".trep.json"] === 1)
  );
  let message = "Add a .gb file to continue.";
  if (valid && files.length === 1) message = "Ready: ROM only.";
  else if (valid && files.length === 3) message = "Ready: ROM with RGBDS linker files.";
  else if (valid && files.length === 4) message = "Ready: ROM with linker files and TREP metadata.";
  else if (counts[".gb"] > 1 || counts[".sym"] > 1 || counts[".map"] > 1 || counts[".trep.json"] > 1) {
    message = "Select only one file of each type.";
  } else if (counts[".gb"] === 1) {
    message = "Use the ROM alone, add both .sym and .map, or add all companion files.";
  }
  return { valid, message };
}

function renderStagedRomFiles() {
  const staging = document.getElementById("romFileStaging");
  const body = document.getElementById("romFileTableBody");
  const status = document.getElementById("romFileStatus");
  const continueButton = document.getElementById("continueWithRomFiles");
  body.replaceChildren();
  const entries = Array.from(stagedRomFiles.values());
  staging.hidden = entries.length === 0;
  const slots = [
    { type: ".gb", label: "ROM file" },
    { type: ".map", label: "Linker map" },
    { type: ".sym", label: "Symbol file" },
    { type: ".trep.json", label: "TREP metadata" },
  ];
  slots.forEach(slot => {
    const entry = entries.find(candidate => candidate.type === slot.type);
    const entryKey = entry
      ? Array.from(stagedRomFiles.entries()).find(([, candidate]) => candidate === entry)?.[0]
      : null;
    const row = document.createElement("tr");
    row.classList.toggle("is-missing", !entry);
    const nameCell = document.createElement("td");
    nameCell.textContent = entry?.file.name || slot.label;
    const typeCell = document.createElement("td");
    typeCell.textContent = slot.type;
    const sizeCell = document.createElement("td");
    sizeCell.textContent = entry ? formatRomFileSize(entry.file.size) : "—";
    const readyCell = document.createElement("td");
    readyCell.className = "rom-file-ready";
    readyCell.textContent = entry ? "✓" : "";
    readyCell.setAttribute("aria-label", entry ? "File added" : "File missing");
    const removeCell = document.createElement("td");
    removeCell.className = "rom-file-remove-cell";
    if (entry && entryKey) {
      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className = "rom-file-remove";
      removeButton.textContent = "×";
      removeButton.setAttribute("aria-label", `Remove ${entry.file.name}`);
      removeButton.title = `Remove ${entry.file.name}`;
      removeButton.addEventListener("click", () => {
        stagedRomFiles.delete(entryKey);
        renderStagedRomFiles();
      });
      removeCell.appendChild(removeButton);
    }
    row.append(nameCell, typeCell, sizeCell, readyCell, removeCell);
    body.append(row);
  });
  updateStagedRomFileValidity();

  function updateStagedRomFileValidity() {
    const result = validateStagedRomCombination();
    continueButton.disabled = !result.valid;
    status.textContent = result.message;
    status.classList.toggle("is-valid", result.valid);
  }
}

function stageRomFiles(files) {
  files.forEach(file => {
    const type = romFileType(file.name);
    if (!type) return;
    for (const [key, entry] of stagedRomFiles) {
      if (entry.type === type) stagedRomFiles.delete(key);
    }
    stagedRomFiles.set(file.name.toLowerCase(), { file, type });
  });
  renderStagedRomFiles();
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
  list.replaceChildren();

  for (const [name, mapInfo] of Object.entries(bgMaps)) {
    const item = document.createElement("section");
    item.className = "bg-map-item";

    const label = document.createElement("div");
    label.className = "bg-map-name";
    label.textContent = name;

    const previewButton = document.createElement("button");
    previewButton.type = "button";
    previewButton.className = "bg-map-entry";
    previewButton.dataset.bgMapName = name;
    previewButton.setAttribute("aria-label", `Edit ${name}`);

    const preview = document.createElement("img");
    preview.className = "bg-map-preview";
    preview.alt = `${name} preview`;

    const actions = document.createElement("div");
    actions.className = "bg-map-actions";

    const downloadButton = document.createElement("button");
    downloadButton.type = "button";
    downloadButton.className = "secondary";
    downloadButton.textContent = `⇩ Download as "${mapInfo[4]}"`;
    downloadButton.addEventListener("click", () => downloadBGMapAsBin(name));

    const uploadButton = document.createElement("button");
    uploadButton.type = "button";
    uploadButton.className = "upload-tile-set-button upload-bg-map-button";
    uploadButton.textContent = "⇧ Upload a .bin";
    uploadButton.addEventListener("click", () => chooseBGMapBin(name));

    previewButton.appendChild(preview);
    previewButton.addEventListener("click", () => getBGMap(mapInfo[0], name));
    actions.append(downloadButton, uploadButton);
    item.append(label, previewButton, actions);
    list.appendChild(item);
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

function getBGMapEditorBytes() {
  return Uint8Array.from(document.querySelectorAll("#selectable li img"), image =>
    parseInt(image.dataset.tileId || "00", 16) || 0
  );
}

function downloadBytesAsBin(bytes, filename) {
  const url = URL.createObjectURL(new Blob([bytes], { type: "application/octet-stream" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || "background-map.bin";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function createSessionBGMapPreview(map) {
  assignVramTileSet(vRamTileSets[map.tileSet], false);
  const scale = 2;
  const canvas = document.createElement("canvas");
  canvas.width = map.columns * 8 * scale;
  canvas.height = map.rows * 8 * scale;
  const context = canvas.getContext("2d");
  context.imageSmoothingEnabled = false;
  const colors = Array.from({ length: 4 }, (_, index) =>
    document.getElementById(`color-picker-${index}`).value
  );
  context.fillStyle = colors[0];
  context.fillRect(0, 0, canvas.width, canvas.height);
  map.bytes.forEach((byte, index) => {
    const tileId = byte.toString(16).padStart(2, "0").toUpperCase();
    const tile = document.querySelector(`.tile[data-vram="${tileId}"]`);
    if (!tile) return;
    const tileX = (index % map.columns) * 8 * scale;
    const tileY = Math.floor(index / map.columns) * 8 * scale;
    tile.querySelectorAll(".pixel").forEach((pixel, pixelIndex) => {
      const colorClass = Array.from(pixel.classList).find(name => /^col[0-3]$/.test(name));
      context.fillStyle = colors[colorClass ? Number(colorClass.slice(3)) : 0];
      context.fillRect(
        tileX + pixelIndex % 8 * scale,
        tileY + Math.floor(pixelIndex / 8) * scale,
        scale,
        scale
      );
    });
  });
  return canvas.toDataURL("image/png");
}

function chooseSessionBGMapBin(key) {
  const map = sessionBGMaps.get(key);
  if (!map) return;
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".bin,application/octet-stream";
  input.addEventListener("change", async () => {
    const file = input.files[0];
    if (!file) return;
    const expectedSize = map.columns * map.rows;
    if (file.size !== expectedSize) {
      displayToast("invalidBGMapBinSize");
      return;
    }
    map.bytes = new Uint8Array(await file.arrayBuffer());
    sessionBGMaps.set(key, map);
    renderSessionBGMapList();
    displayToast("bgMapBinImported");
    addToLog(`Session background map "${map.copyName}" was loaded from "${file.name}"`);
  }, { once: true });
  input.click();
}

function storeActiveSessionBGMap() {
  if (!activeBGMapDraft?.exportOnly || !activeBGMapDraft.copyName) return;
  const key = activeBGMapDraft.sessionKey
    || `copy:${Date.now()}`;
  activeBGMapDraft.sessionKey = key;
  sessionBGMaps.set(key, {
    ...activeBGMapDraft,
    bytes: getBGMapEditorBytes()
  });
  renderSessionBGMapList();
}

function renderSessionBGMapList() {
  const section = document.getElementById("sessionBGMapsSection");
  const list = document.getElementById("sessionBGMapList");
  list.replaceChildren();
  section.hidden = sessionBGMaps.size === 0;
  sessionBGMaps.forEach((map, key) => {
    const item = document.createElement("section");
    item.className = "bg-map-item";
    const label = document.createElement("div");
    label.className = "bg-map-name";
    label.textContent = map.copyName;
    const meta = document.createElement("div");
    meta.className = "bg-map-session-meta";
    meta.textContent = `${map.columns}×${map.rows} tiles · ${map.tileSet} · ${map.filename}${map.sessionOnly ? "" : ` · Copy of ${map.name}`}`;
    const previewButton = document.createElement("button");
    previewButton.type = "button";
    previewButton.className = "bg-map-entry";
    previewButton.setAttribute("aria-label", `Open ${map.name}`);
    const preview = document.createElement("img");
    preview.className = "bg-map-preview";
    preview.alt = `${map.name} preview`;
    preview.src = createSessionBGMapPreview(map);
    previewButton.appendChild(preview);
    previewButton.addEventListener("click", () => openSessionBGMap(key));
    const actions = document.createElement("div");
    actions.className = "bg-map-actions";
    const downloadButton = document.createElement("button");
    downloadButton.type = "button";
    downloadButton.className = "secondary";
    downloadButton.textContent = map.filename
      ? `⇩ Download as "${map.filename}"`
      : "⇩ Download .bin";
    downloadButton.addEventListener("click", () => downloadBytesAsBin(map.bytes, map.filename));
    const uploadButton = document.createElement("button");
    uploadButton.type = "button";
    uploadButton.className = "upload-tile-set-button upload-bg-map-button";
    uploadButton.textContent = "⇧ Upload a .bin";
    uploadButton.addEventListener("click", () => chooseSessionBGMapBin(key));
    actions.append(downloadButton, uploadButton);
    item.append(label, meta, previewButton, actions);
    list.appendChild(item);
  });
  if (activeBGMapDraft?.tileSet && vRamTileSets[activeBGMapDraft.tileSet]) {
    assignVramTileSet(vRamTileSets[activeBGMapDraft.tileSet], false);
  }
}

async function openSessionBGMap(key) {
  await tileDataReady;
  const stored = sessionBGMaps.get(key);
  if (!stored) return;
  activeBGMapName = stored.name;
  activeBGMapDraft = { ...stored, bytes: undefined };
  document.dispatchEvent(new Event("bgmaploaded"));
  populateBGMapEditorSettings(stored.name, [null, stored.columns, stored.rows, stored.tileSet, stored.filename]);
  wipeTilesFromLocalStorage();
  assignVramTileSet(vRamTileSets[stored.tileSet]);
  loadTileContentToVRAMGrid();
  addMatrix(stored.columns, stored.rows);
  document.querySelectorAll("#selectable li img").forEach((image, index) => {
    const tileId = (stored.bytes[index] ?? stored.emptyTileId ?? 0).toString(16).padStart(2, "0").toUpperCase();
    image.id = `bg-tile-${index.toString(16).padStart(2, "0").toUpperCase()}`;
    image.style.imageRendering = "pixelated";
    displayTileImageFromLocalStorage(tileId, image.id);
    if (!image.dataset.tileId) image.dataset.tileId = tileId;
  });
  setBGMapExportOnly(true);
  document.getElementById("BG-myModal").style.display = "flex";
  enableKeyPressTracking();
}

function createBGMapRegionRow(name, definition) {
  const totalTiles = Number(definition[1]);
  const row = document.createElement("div");
  row.className = "bg-map-region-row tile-set-settings";
  row.dataset.regionName = name;

  row.setAttribute("role", "checkbox");
  row.setAttribute("aria-checked", "false");
  row.tabIndex = 0;
  const handle = document.createElement("span");
  handle.className = "bg-map-region-handle";
  handle.textContent = "⋮⋮";
  handle.title = "Drag to change VRAM order";
  handle.draggable = true;
  const title = document.createElement("span");
  title.textContent = `${name} (${totalTiles} tiles)`;

  const startLabel = document.createElement("label");
  startLabel.textContent = "Start ";
  const start = document.createElement("input");
  start.type = "number";
  start.className = "bg-map-region-start";
  start.min = "0";
  start.max = String(Math.max(0, totalTiles - 1));
  start.value = "0";
  startLabel.appendChild(start);

  const countLabel = document.createElement("label");
  countLabel.textContent = "Tiles ";
  const count = document.createElement("input");
  count.type = "number";
  count.className = "bg-map-region-count";
  count.min = "1";
  count.max = String(totalTiles);
  count.value = String(totalTiles);
  countLabel.appendChild(count);

  const visualButton = document.createElement("button");
  visualButton.type = "button";
  visualButton.className = "secondary bg-map-region-visual-button";
  visualButton.textContent = "Choose visually…";
  visualButton.addEventListener("click", () => openBGMapVisualRangeDialog(row));

  const toggleSelected = () => {
    const selected = row.classList.toggle("is-selected");
    row.setAttribute("aria-checked", String(selected));
  };
  row.addEventListener("click", event => {
    if (event.target.closest("input, button, label, .bg-map-region-handle")) return;
    toggleSelected();
  });
  row.addEventListener("keydown", event => {
    if ((event.key === " " || event.key === "Enter") && event.target === row) {
      event.preventDefault();
      toggleSelected();
    }
  });
  handle.addEventListener("dragstart", event => {
    draggedBGMapRegionRow = row;
    row.classList.add("is-dragging");
    event.dataTransfer.effectAllowed = "move";
  });
  handle.addEventListener("dragend", () => {
    row.classList.remove("is-dragging");
    draggedBGMapRegionRow = null;
  });
  row.addEventListener("dragover", event => {
    if (!draggedBGMapRegionRow || draggedBGMapRegionRow === row) return;
    event.preventDefault();
    const before = event.clientY < row.getBoundingClientRect().top + row.offsetHeight / 2;
    row.parentElement.insertBefore(draggedBGMapRegionRow, before ? row : row.nextElementSibling);
  });
  row.append(handle, title, startLabel, countLabel, visualButton);
  return row;
}

function openBGMapVisualRangeDialog(row) {
  visualBGMapRegionRow = row;
  visualBGMapRangeStart = null;
  const name = row.dataset.regionName;
  const definition = tileAddressesInROM[name];
  const totalTiles = Number(definition[1]);
  const bytesPerTile = Number(definition[2]) === 1 ? 8 : 16;
  const baseAddress = parseInt(definition[0], 16);
  const grid = document.getElementById("bgMapVisualRangeGrid");
  grid.replaceChildren();
  document.getElementById("bgMapVisualRangeTitle").textContent = `Choose ${name} tiles`;
  document.getElementById("bgMapVisualRangeStatus").textContent = "Select the first tile.";
  for (let index = 0; index < totalTiles; index++) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "secondary bg-map-visual-tile";
    button.dataset.tileIndex = index;
    const address = (baseAddress + index * bytesPerTile).toString(16).toUpperCase();
    const sourceTile = document.getElementById(`tileaddr-${address}`);
    if (sourceTile) {
      const preview = sourceTile.cloneNode(true);
      preview.removeAttribute("id");
      preview.removeAttribute("data-vram");
      preview.querySelectorAll("[id]").forEach(element => element.removeAttribute("id"));
      button.appendChild(preview);
    }
    const number = document.createElement("span");
    number.textContent = String(index);
    button.appendChild(number);
    button.addEventListener("click", () => selectBGMapVisualRangeTile(index));
    grid.appendChild(button);
  }
  document.getElementById("bgMapVisualRangeDialog").showModal();
}

function selectBGMapVisualRangeTile(index) {
  const buttons = Array.from(document.querySelectorAll("#bgMapVisualRangeGrid .bg-map-visual-tile"));
  if (visualBGMapRangeStart === null) {
    visualBGMapRangeStart = index;
    buttons.forEach(button => button.classList.toggle("is-first", Number(button.dataset.tileIndex) === index));
    document.getElementById("bgMapVisualRangeStatus").textContent = "Select the last tile.";
    return;
  }
  const first = Math.min(visualBGMapRangeStart, index);
  const last = Math.max(visualBGMapRangeStart, index);
  visualBGMapRegionRow.querySelector(".bg-map-region-start").value = first;
  visualBGMapRegionRow.querySelector(".bg-map-region-count").value = last - first + 1;
  visualBGMapRegionRow.classList.add("is-selected");
  visualBGMapRegionRow.setAttribute("aria-checked", "true");
  buttons.forEach(button => {
    const tileIndex = Number(button.dataset.tileIndex);
    button.classList.toggle("is-range", tileIndex >= first && tileIndex <= last);
  });
  document.getElementById("bgMapVisualRangeDialog").close();
  visualBGMapRegionRow = null;
  visualBGMapRangeStart = null;
}

function showBGMapRegionError(message = "") {
  const error = document.getElementById("BGMapTileRegionError");
  error.textContent = message;
  error.hidden = !message;
}

function buildCustomBGMapTileSet() {
  const rows = Array.from(document.querySelectorAll("#BGMapTileRegions .bg-map-region-row"));
  const selected = [];
  let combinedCount = 0;
  for (const row of rows) {
    if (!row.classList.contains("is-selected")) continue;
    const name = row.dataset.regionName;
    const definition = tileAddressesInROM[name];
    const available = Number(definition[1]);
    const startInput = row.querySelector(".bg-map-region-start");
    const countInput = row.querySelector(".bg-map-region-count");
    const start = Number(startInput.value);
    const count = Number(countInput.value);
    if (!Number.isInteger(start) || !Number.isInteger(count)
      || start < 0 || count < 1 || start + count > available) {
      showBGMapRegionError(`${name}: the selected range must stay within its ${available}-tile ROM group.`);
      startInput.reportValidity();
      return null;
    }
    combinedCount += count;
    if (combinedCount > 256) {
      showBGMapRegionError("A VRAM tileset can contain no more than 256 tiles.");
      return null;
    }
    const bytesPerTile = Number(definition[2]) === 1 ? 8 : 16;
    const address = (parseInt(definition[0], 16) + start * bytesPerTile)
      .toString(16).toUpperCase().padStart(4, "0");
    selected.push({
      name,
      start,
      count,
      definition: [address, count, definition[2], ...definition.slice(3)]
    });
  }
  if (!selected.length) {
    showBGMapRegionError("Select at least one ROM tile group.");
    return null;
  }
  showBGMapRegionError();
  return selected;
}

function populateBGMapEditorSettings(mapName, suppliedMapInfo = null) {
  const mapInfo = suppliedMapInfo || bgMaps[mapName];
  const select = document.getElementById("BGMapTileset");
  select.replaceChildren();
  const seen = new Set();
  Object.entries(bgMaps).forEach(([name, info]) => {
    if (seen.has(info[3])) return;
    seen.add(info[3]);
    select.add(new Option(`From BG map: ${name}`, info[3]));
  });
  Object.keys(vRamTileSets).forEach(name => {
    if (!seen.has(name)) select.add(new Option(`Tileset: ${name}`, name));
  });
  select.add(new Option("Custom Tile Editor regions…", "__custom__"));
  select.value = mapInfo[3];
  document.getElementById("BGMapWidth").value = mapInfo[1];
  document.getElementById("BGMapHeight").value = mapInfo[2];
  document.getElementById("BGMapCopyName").value = activeBGMapDraft?.copyName || "";

  const regions = document.getElementById("BGMapTileRegions");
  regions.replaceChildren();
  Object.entries(tileAddressesInROM).forEach(([name, definition]) => {
    regions.appendChild(createBGMapRegionRow(name, definition));
  });
  if (activeBGMapDraft?.customRegions?.length) {
    activeBGMapDraft.customRegions.forEach(region => {
      const row = Array.from(regions.children)
        .find(candidate => candidate.dataset.regionName === region.name);
      if (!row) return;
      row.classList.add("is-selected");
      row.setAttribute("aria-checked", "true");
      row.querySelector(".bg-map-region-start").value = region.start;
      row.querySelector(".bg-map-region-count").value = region.count;
      regions.appendChild(row);
    });
  }
  showBGMapRegionError();
  regions.hidden = true;
}

function setBGMapExportOnly(exportOnly) {
  activeBGMapDraft.exportOnly = exportOnly;
  document.getElementById("applyBGMap").hidden = exportOnly;
  document.getElementById("saveSessionBGMap").hidden = !exportOnly;
  document.getElementById("BGMapExportNotice").hidden = !exportOnly;
  document.getElementById("openBGMapSettings").textContent = exportOnly && activeBGMapDraft.copyName
    ? "Edit copy…"
    : "Create copy…";
}

function findKnownEmptyTileId(bytes = new Uint8Array()) {
  const uniformTileIds = Array.from(document.querySelectorAll(".tile[data-vram]"))
    .filter(tile => {
      const pixels = Array.from(tile.querySelectorAll(".pixel"));
      if (!pixels.length) return false;
      const firstColor = Array.from(pixels[0].classList).find(name => /^col[0-3]$/.test(name));
      return firstColor && pixels.every(pixel => pixel.classList.contains(firstColor));
    })
    .map(tile => tile.dataset.vram.toUpperCase());
  if (!uniformTileIds.length) {
    return document.querySelector(`#BG-vramgrid .BG-cell[id="${currentMino}"]`) ? currentMino : "00";
  }
  const counts = new Map(uniformTileIds.map(id => [id, 0]));
  bytes.forEach(byte => {
    const id = byte.toString(16).padStart(2, "0").toUpperCase();
    if (counts.has(id)) counts.set(id, counts.get(id) + 1);
  });
  return uniformTileIds.sort((a, b) => counts.get(b) - counts.get(a))[0];
}

function rebuildBGMapDraft(columns, rows, tileSetName) {
  const oldBytes = getBGMapEditorBytes();
  const oldColumns = activeBGMapDraft.columns;
  const oldRows = activeBGMapDraft.rows;
  activeBGMapDraft.columns = columns;
  activeBGMapDraft.rows = rows;
  activeBGMapDraft.tileSet = tileSetName;
  wipeTilesFromLocalStorage();
  assignVramTileSet(vRamTileSets[tileSetName]);
  loadTileContentToVRAMGrid();
  const emptyTileId = findKnownEmptyTileId(oldBytes);
  activeBGMapDraft.emptyTileId = emptyTileId;
  addMatrix(columns, rows);
  const images = document.querySelectorAll("#selectable li img");
  images.forEach((image, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const oldIndex = row < oldRows && column < oldColumns ? row * oldColumns + column : -1;
    const tileId = oldIndex >= 0
      ? oldBytes[oldIndex].toString(16).padStart(2, "0").toUpperCase()
      : emptyTileId;
    image.id = `bg-tile-${index.toString(16).padStart(2, "0").toUpperCase()}`;
    image.style.imageRendering = "pixelated";
    displayTileImageFromLocalStorage(tileId, image.id);
    if (!image.dataset.tileId) image.dataset.tileId = tileId;
  });
  setBGMapExportOnly(true);
}

function initializeBGMapLayoutControls() {
  const tileset = document.getElementById("BGMapTileset");
  const settingsDialog = document.getElementById("bgMapSettingsDialog");
  tileset.addEventListener("change", () => {
    document.getElementById("BGMapTileRegions").hidden = tileset.value !== "__custom__";
    showBGMapRegionError();
  });
  document.getElementById("openBGMapSettings").addEventListener("click", () => {
    const editingCopy = activeBGMapDraft.exportOnly && Boolean(activeBGMapDraft.copyName);
    document.getElementById("bgMapSettingsTitle").textContent = editingCopy
      ? "Edit background map copy"
      : "Create background map copy";
    document.getElementById("applyBGMapSettings").textContent = editingCopy
      ? "Apply changes"
      : "Create copy";
    document.getElementById("BGMapWidth").value = activeBGMapDraft.columns;
    document.getElementById("BGMapHeight").value = activeBGMapDraft.rows;
    const copyNameInput = document.getElementById("BGMapCopyName");
    copyNameInput.value = editingCopy ? activeBGMapDraft.copyName || "" : "";
    tileset.value = activeBGMapDraft.customRegions ? "__custom__" : activeBGMapDraft.tileSet;
    document.getElementById("BGMapTileRegions").hidden = tileset.value !== "__custom__";
    showBGMapRegionError();
    settingsDialog.showModal();
    copyNameInput.focus();
  });
  document.getElementById("applyBGMapSettings").addEventListener("click", () => {
    const editingStoredCopy = activeBGMapDraft.exportOnly && Boolean(activeBGMapDraft.copyName);
    const widthInput = document.getElementById("BGMapWidth");
    const heightInput = document.getElementById("BGMapHeight");
    const columns = Number(widthInput.value);
    const rows = Number(heightInput.value);
    const copyNameInput = document.getElementById("BGMapCopyName");
    let copyName = copyNameInput.value.trim();
    if (copyName.toLowerCase().endsWith(".bin")) copyName = copyName.slice(0, -4).trim();
    copyNameInput.value = copyName;
    const filename = copyName ? `${copyName}.bin` : "";
    if (!widthInput.reportValidity() || !heightInput.reportValidity()
      || !copyNameInput.reportValidity()
      || !Number.isInteger(columns) || columns < 1 || columns > 32
      || !Number.isInteger(rows) || rows < 1 || rows > 32) return;
    let tileSetName = tileset.value;
    let customRegions = null;
    if (tileSetName === "__custom__") {
      customRegions = buildCustomBGMapTileSet();
      if (!customRegions) return;
      tileSetName = `Session custom ${Date.now()}`;
      vRamTileSets[tileSetName] = customRegions.map(region => region.definition);
      tileset.add(new Option("Custom Tile Editor regions", tileSetName));
    }
    const changed = !activeBGMapDraft.exportOnly
      || columns !== activeBGMapDraft.columns
      || rows !== activeBGMapDraft.rows
      || tileSetName !== activeBGMapDraft.tileSet
      || filename !== activeBGMapDraft.filename
      || JSON.stringify(customRegions?.map(({ name, start, count }) => ({ name, start, count })))
        !== JSON.stringify(activeBGMapDraft.customRegions || null);
    activeBGMapDraft.copyName = copyName;
    activeBGMapDraft.filename = filename;
    activeBGMapDraft.customRegions = customRegions
      ? customRegions.map(({ name, start, count }) => ({ name, start, count }))
      : null;
    if (changed) rebuildBGMapDraft(columns, rows, tileSetName);
    if (!editingStoredCopy) storeActiveSessionBGMap();
    settingsDialog.close();
  });
  document.getElementById("cancelBGMapSettings").addEventListener("click", () => settingsDialog.close());
  document.getElementById("cancelBGMapVisualRange").addEventListener("click", () => {
    document.getElementById("bgMapVisualRangeDialog").close();
    visualBGMapRegionRow = null;
    visualBGMapRangeStart = null;
  });
  document.getElementById("saveSessionBGMap").addEventListener("click", () => {
    if (!activeBGMapDraft.copyName) {
      document.getElementById("openBGMapSettings").click();
      return;
    }
    storeActiveSessionBGMap();
    addToLog(`Session background map "${activeBGMapDraft.copyName}" saved.`);
    closeBGModal();
  });
  document.getElementById("newSessionBGMap").addEventListener("click", async () => {
    await tileDataReady;
    const firstSet = Object.keys(vRamTileSets)[0];
    if (!firstSet) return;
    const name = `New BG Map ${++sessionBGMapCounter}`;
    const filename = "";
    activeBGMapName = name;
    activeBGMapDraft = { name, columns:20, rows:18, tileSet:firstSet, filename, exportOnly:true, sessionOnly:true, sessionKey:`new:${sessionBGMapCounter}` };
    populateBGMapEditorSettings(name, [null, 20, 18, firstSet, filename]);
    wipeTilesFromLocalStorage();
    assignVramTileSet(vRamTileSets[firstSet]);
    loadTileContentToVRAMGrid();
    const emptyTileId = findKnownEmptyTileId();
    activeBGMapDraft.emptyTileId = emptyTileId;
    addMatrix(20, 18);
    document.querySelectorAll("#selectable li img").forEach((image, index) => {
      image.id = `bg-tile-${index.toString(16).padStart(2, "0").toUpperCase()}`;
      image.style.imageRendering = "pixelated";
      displayTileImageFromLocalStorage(emptyTileId, image.id);
      if (!image.dataset.tileId) image.dataset.tileId = emptyTileId;
    });
    setBGMapExportOnly(true);
    storeActiveSessionBGMap();
    document.getElementById("BG-myModal").style.display = "flex";
    enableKeyPressTracking();
    document.getElementById("openBGMapSettings").click();
  });
}

async function isVerifiedOriginalTetrisRom(file) {
  if (file.size !== 32768) return false;
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (bytes[0x014D] !== 0x0A || bytes[0x014E] !== 0x16 || bytes[0x014F] !== 0xBF) return false;
  if (!globalThis.crypto?.subtle) return false;
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  const sha256 = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("").toUpperCase();
  return sha256 === originalTetrisSha256;
}

function rgbdsRomOffset(bank, address) {
  if (bank === 0) return address < 0x4000 ? address : null;
  if (address < 0x4000 || address > 0x7FFF) return null;
  return bank * 0x4000 + address - 0x4000;
}

function findLinkerRomMismatch(symbols, romSize) {
  const outside = Array.from(symbols, ([name, offset]) => ({ name, offset }))
    .filter(symbol => !symbol.name.endsWith(".end") && symbol.offset >= romSize)
    .sort((a, b) => a.offset - b.offset);
  return outside[0] || null;
}

function parseRgbdsSymbols(symText = "", mapText = "") {
  const symbols = new Map();
  for (const line of symText.split(/\r?\n/)) {
    const match = line.match(/^\s*([0-9A-Fa-f]+):([0-9A-Fa-f]{4})\s+([^;\s]+)/);
    if (!match) continue;
    const offset = rgbdsRomOffset(parseInt(match[1], 16), parseInt(match[2], 16));
    if (offset !== null && !symbols.has(match[3])) symbols.set(match[3], offset);
  }

  let mapBank = null;
  for (const line of mapText.split(/\r?\n/)) {
    const bankMatch = line.match(/^ROM(?:0|X) bank #(\d+):/i);
    if (bankMatch) mapBank = Number(bankMatch[1]);
    const labelMatch = line.match(/^\s*\$([0-9A-Fa-f]{4})\s*=\s*([^\s]+)/);
    if (!labelMatch || mapBank === null || symbols.has(labelMatch[2])) continue;
    const offset = rgbdsRomOffset(mapBank, parseInt(labelMatch[1], 16));
    if (offset !== null) symbols.set(labelMatch[2], offset);
  }
  return symbols;
}

function parseTrepMetadata(text = "") {
  const metadata = JSON.parse(text);
  if (metadata?.format !== "trep-metadata" || metadata?.version !== 1) {
    throw new Error('The metadata file must use format "trep-metadata" and version 1.');
  }
  if (!Array.isArray(metadata.backgroundMaps)) {
    throw new Error("The metadata file must contain a backgroundMaps array.");
  }
  return metadata;
}

function applyTrepTileMetadata(metadata, symbols, romSize) {
  if (!Array.isArray(metadata.tileRegions) || !Array.isArray(metadata.tileSets)) return 0;

  const definitions = {};
  metadataTileExportData.clear();
  for (const region of metadata.tileRegions) {
    const name = String(region.name || "").trim();
    const start = metadataRomOffset(region.symbol, symbols)
      ?? metadataRomOffset(region.start, symbols);
    const tileCount = Number(region.tileCount);
    const bitsPerPixel = Number(region.bitsPerPixel);
    const bytesPerTile = bitsPerPixel === 1 ? 8 : bitsPerPixel === 2 ? 16 : 0;
    if (!name || start === null || !Number.isInteger(tileCount) || tileCount < 1 || !bytesPerTile) {
      throw new Error(`Invalid tile-region definition${name ? ` for "${name}"` : ""}.`);
    }
    if (start + tileCount * bytesPerTile > romSize) {
      throw new Error(`Tile region "${name}" lies outside the selected ROM.`);
    }
    definitions[name] = [
      start.toString(16).toUpperCase().padStart(4, "0"),
      tileCount,
      bitsPerPixel,
      region.show !== false
    ];
    const filename = String(region.filename || "").trim();
    if (filename) {
      metadataTileExportData.set(name, {
        name: filename.replace(/\.png$/i, ""),
        width: Number(region.width) || null,
      });
    }
  }

  const sets = {};
  for (const tileSet of metadata.tileSets) {
    const name = String(tileSet.name || "").trim();
    if (!name || !Array.isArray(tileSet.regions) || !tileSet.regions.length) {
      throw new Error(`Invalid tile-set definition${name ? ` for "${name}"` : ""}.`);
    }
    sets[name] = tileSet.regions.map(regionName => {
      if (!definitions[regionName]) {
        throw new Error(`Tile set "${name}" refers to unknown region "${regionName}".`);
      }
      return definitions[regionName];
    });
  }

  Object.keys(tileAddressesInROM).forEach(key => delete tileAddressesInROM[key]);
  Object.assign(tileAddressesInROM, definitions);
  Object.keys(vRamTileSets).forEach(key => delete vRamTileSets[key]);
  Object.assign(vRamTileSets, sets);
  return Object.keys(definitions).length + Object.keys(sets).length;
}

function metadataRomOffset(value, symbols) {
  if (typeof value === "number" && Number.isInteger(value) && value >= 0) return value;
  if (typeof value === "string") {
    if (symbols.has(value)) return symbols.get(value);
    if (/^0x[0-9a-f]+$/i.test(value)) return parseInt(value.slice(2), 16);
    if (/^[0-9a-f]+$/i.test(value)) return parseInt(value, 16);
  }
  return null;
}

function applyTrepMetadata(metadata, symbols, romSize) {
  let resolved = 0;
  // Explicit project metadata is authoritative. Linker-only loading builds an
  // inferred background-map catalog first; keeping those inferred entries
  // here leaves duplicate rows whose generated tile-set names no longer exist
  // after applyTrepTileMetadata replaces the tile definitions.
  Object.keys(bgMaps).forEach(key => delete bgMaps[key]);
  for (const definition of metadata.backgroundMaps) {
    const name = String(definition.name || "").trim();
    const start = metadataRomOffset(definition.symbol, symbols)
      ?? metadataRomOffset(definition.start, symbols);
    const width = Number(definition.width);
    const height = Number(definition.height);
    const visibleSize = width * height;
    const fileSize = definition.fileSize == null ? visibleSize : Number(definition.fileSize);
    const tileSet = String(definition.tileSet || "").trim();
    if (!name || start === null || !Number.isInteger(width) || width < 1
      || !Number.isInteger(height) || height < 1
      || !Number.isInteger(fileSize) || fileSize < visibleSize || !tileSet) {
      throw new Error(`Invalid background-map definition${name ? ` for "${name}"` : ""}.`);
    }
    if (start + fileSize > romSize) {
      throw new Error(`Background map "${name}" lies outside the selected ROM.`);
    }
    if (!vRamTileSets[tileSet]) {
      throw new Error(`Background map "${name}" refers to unknown tile set "${tileSet}".`);
    }
    const filename = String(definition.filename || `${name.replace(/\s+/g, "_")}.bin`);
    bgMaps[name] = [
      start.toString(16).toUpperCase().padStart(4, "0"),
      width,
      height,
      tileSet,
      filename,
      null,
      fileSize,
    ];
    resolved++;
  }
  initializeBGMapList();
  return resolved;
}

function applyLinkerAddressSettings(symbols) {
  if (!defaultTileAddresses) {
    defaultTileAddresses = Object.fromEntries(Object.entries(tileAddressesInROM).map(([name, data]) => [name, data[0]]));
    defaultBGMapAddresses = Object.fromEntries(Object.entries(bgMaps).map(([name, data]) => [name, data[0]]));
    defaultTileDefinitions = Object.fromEntries(Object.entries(tileAddressesInROM).map(([name, data]) => [name, [...data]]));
    defaultBGMapDefinitions = Object.fromEntries(Object.entries(bgMaps).map(([name, data]) => [name, [...data]]));
    defaultVramDefinitions = Object.fromEntries(Object.entries(vRamTileSets).map(([name, sets]) => [
      name,
      sets.map(set => Object.entries(tileAddressesInROM).find(([, definition]) => definition === set)?.[0])
    ]));
  }
  restoreDefinitionObject(tileAddressesInROM, defaultTileDefinitions);
  restoreDefinitionObject(bgMaps, defaultBGMapDefinitions);
  restoreVramDefinitions();

  if (symbols.size) return buildLinkerSidebarDefinitions(symbols);

  let resolved = 0;
  for (const [name, [symbol, delta]] of Object.entries(linkerTileSymbols)) {
    if (!symbols.has(symbol) || !tileAddressesInROM[name]) continue;
    tileAddressesInROM[name][0] = (symbols.get(symbol) + delta).toString(16).toUpperCase().padStart(4, "0");
    resolved++;
  }
  for (const [name, [symbol, delta]] of Object.entries(linkerBGMapSymbols)) {
    if (!symbols.has(symbol) || !bgMaps[name]) continue;
    bgMaps[name][0] = (symbols.get(symbol) + delta).toString(16).toUpperCase().padStart(4, "0");
    resolved++;
  }
  initializeBGMapList();
  return resolved;
}

function restoreDefinitionObject(target, defaults, nested = false) {
  Object.keys(target).forEach(key => delete target[key]);
  Object.entries(defaults).forEach(([key, value]) => {
    target[key] = nested ? value.map(item => [...item]) : [...value];
  });
}

function restoreVramDefinitions() {
  Object.keys(vRamTileSets).forEach(key => delete vRamTileSets[key]);
  Object.entries(defaultVramDefinitions).forEach(([setName, groupNames]) => {
    vRamTileSets[setName] = groupNames.map(name => tileAddressesInROM[name]).filter(Boolean);
  });
}

function linkerDisplayName(symbol) {
  return symbol
    .replace(/^(?:Gfx_|Layout_|GameScreenLayout_|GameInnerScreenLayout_)/, "")
    .replace(/_/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .trim();
}

function inferLayoutDimensions(symbol, byteLength) {
  const explicit = {
    GameInnerScreenLayout_Pause: [10, 3],
    GameScreenLayout_ScoreTotals: [10, 18],
    GameInnerScreenLayout_GameOver: [8, 6]
  };
  if (explicit[symbol]) return explicit[symbol];
  const normalized = [byteLength, byteLength - 1].find(length => [360, 180, 120, 80, 48].includes(length));
  if (normalized === 360) return [20, 18];
  if (normalized === 180) return [10, 18];
  if (normalized === 120) return [20, 6];
  if (normalized === 80) return [20, 4];
  if (normalized === 48) return [8, 6];
  return null;
}

function buildLinkerSidebarDefinitions(symbols) {
  Object.keys(tileAddressesInROM).forEach(key => delete tileAddressesInROM[key]);
  Object.keys(bgMaps).forEach(key => delete bgMaps[key]);
  Object.keys(vRamTileSets).forEach(key => delete vRamTileSets[key]);

  const gfxGroups = [];
  for (const [symbol, start] of symbols) {
    if (!/^Gfx_[^.]+$/.test(symbol) || !symbols.has(`${symbol}.end`)) continue;
    const end = symbols.get(`${symbol}.end`);
    const bpp = /ascii/i.test(symbol) ? 1 : 2;
    const tileCount = Math.floor((end - start) / (bpp === 1 ? 8 : 16));
    if (tileCount < 1) continue;
    const name = linkerDisplayName(symbol);
    tileAddressesInROM[name] = [start.toString(16).toUpperCase().padStart(4, "0"), tileCount, bpp, true];
    gfxGroups.push({ symbol, name, start, end, definition: tileAddressesInROM[name] });
  }
  gfxGroups.sort((a, b) => a.start - b.start);
  const asciiGroup = gfxGroups.find(group => /ascii/i.test(group.symbol));
  const titleGroup = gfxGroups.find(group => /title/i.test(group.symbol));
  const menuGroup = gfxGroups.find(group => /menu/i.test(group.symbol));
  const rocketGroup = gfxGroups.find(group => /rocket/i.test(group.symbol));
  gfxGroups.forEach(group => {
    const setName = `${group.name}-Set`;
    vRamTileSets[setName] = [group.definition];
    group.setName = setName;
  });
  if (asciiGroup && titleGroup) {
    vRamTileSets[titleGroup.setName] = [asciiGroup.definition, titleGroup.definition];
  }
  if (asciiGroup && menuGroup) {
    const menuSet = [asciiGroup.definition];
    if (titleGroup) {
      const prefixName = `${titleGroup.name} Menu Prefix`;
      const prefixTiles = Math.min(9, titleGroup.definition[1]);
      tileAddressesInROM[prefixName] = [titleGroup.definition[0], prefixTiles, titleGroup.definition[2], false];
      menuSet.push(tileAddressesInROM[prefixName]);
    }
    menuSet.push(menuGroup.definition);
    vRamTileSets[menuGroup.setName] = menuSet;
  }
  if (rocketGroup) vRamTileSets[rocketGroup.setName] = [rocketGroup.definition];

  const layoutPattern = /^(?:Layout_|GameScreenLayout_|GameInnerScreenLayout_)[^.]+$/;
  const layouts = Array.from(symbols, ([symbol, start]) => ({ symbol, start }))
    .filter(item => layoutPattern.test(item.symbol))
    .sort((a, b) => a.start - b.start);
  const boundaries = [...layouts, ...gfxGroups.map(group => ({ symbol: group.symbol, start: group.start }))]
    .sort((a, b) => a.start - b.start);
  layouts.forEach(layout => {
    const next = boundaries.find(boundary => boundary.start > layout.start);
    if (!next) return;
    const dimensions = inferLayoutDimensions(layout.symbol, next.start - layout.start);
    if (!dimensions) return;
    const preferredGroup = /^Layout_TitleScreen$/i.test(layout.symbol)
      ? titleGroup
      : /mario score|luigi score|bricks|rocket/i.test(linkerDisplayName(layout.symbol))
        ? rocketGroup
        : menuGroup || gfxGroups[0];
    if (!preferredGroup) return;
    const name = linkerDisplayName(layout.symbol);
    bgMaps[name] = [layout.start.toString(16).toUpperCase().padStart(4, "0"), dimensions[0], dimensions[1], preferredGroup.setName, `${name.replace(/\s+/g, "_")}.bin`];
  });
  initializeBGMapList();
  return gfxGroups.length + Object.keys(bgMaps).length;
}

function markBGMapPreviewsForTileAddresses(addresses) {
  const numericAddresses = addresses.map(address => parseInt(address, 16));
  for (const [mapName, mapInfo] of Object.entries(bgMaps)) {
    const tileSets = vRamTileSets[mapInfo[3]] || [];
    const isAffected = tileSets.some(([start, count, bitsPerPixel]) => {
      const first = parseInt(start, 16);
      const bytesPerTile = Number(bitsPerPixel) === 1 ? 8 : 16;
      const end = first + Number(count) * bytesPerTile;
      return numericAddresses.some(address => address >= first && address < end);
    });
    if (isAffected) dirtyBGMapPreviews.add(mapName);
  }
}

function refreshDirtyBGMapPreviews() {
  for (const name of dirtyBGMapPreviews) renderBGMapPreview(name);
  dirtyBGMapPreviews.clear();
}

function scheduleBGMapPreviewRefresh() {
  if (!document.querySelector("#hexViewer .hexValueCell") || !document.querySelector(".tile")) return;
  cancelAnimationFrame(bgPreviewRefreshFrame);
  bgPreviewRefreshFrame = requestAnimationFrame(refreshBGMapPreviews);
}


//------------------------------------------------------------------------------------------
// save the bg map and close the modal
async function saveBGMap() {
  const placementOverlay = document.getElementById("tilePlacementOverlay");
  const placementTitle = placementOverlay?.querySelector("h2");
  let overlayShown = false;
  const overlayDelay = window.setTimeout(() => {
    if (!placementOverlay) return;
    if (placementTitle) placementTitle.textContent = "Placing Background Map...";
    placementOverlay.hidden = false;
    overlayShown = true;
  }, 300);

  try {
    let olElement = document.getElementById("selectable");
    let imgElements = Array.from(olElement.querySelectorAll("li img"));
    let startAddress = document.getElementById("BGMapStartAddress").value;

    let currentAddress = parseInt(startAddress, 16);

    for (let index = 0; index < imgElements.length; index++) {
      const imgElement = imgElements[index];

      let tileID = imgElement.getAttribute("data-tile-id");

      // Extract the number from the image ID (assuming the ID is in the format "bg-tile-X" where X is the number)
      let tileNumber = parseInt(imgElement.id.replace("bg-tile-", ""), 16);

      // Calculate the address based on the tile number and the starting address
      let hexAddress = (currentAddress + tileNumber).toString(16).toUpperCase().padStart(4, '0');

      let td = document.getElementById(hexAddress);
      if (td && !isProtectedRomAddress(hexAddress)) td.textContent = tileID;

      if (index > 0 && index % 64 === 0) {
        await new Promise(resolve => window.setTimeout(resolve, 0));
      }
    }

    closeBGModal();
    scrollToAddress(startAddress);
    document.getElementById("createFileBtn").removeAttribute("disabled");

    renderBGMapPreview(activeBGMapName);
    addToLog("Background map \"" + activeBGMapName + "\" overwritten.");
  } finally {
    window.clearTimeout(overlayDelay);
    if (placementOverlay && overlayShown) placementOverlay.hidden = true;
  }
}



//-----------------------------------------------------------------------------------------
// Download a background map directly from its ROM address range.
function downloadBGMapAsBin(bgMapName) {
  const [startAddress, columns, rows, , bgMapFileName, gapValue, fileSize] = bgMaps[bgMapName];
  const start = parseInt(startAddress, 16);
  const gap = gapValue ? parseInt(gapValue, 10) : 1;
  const byteArray = new Uint8Array(fileSize || columns * rows);
  for (let index = 0; index < byteArray.length; index++) {
    const address = (start + index * gap).toString(16).toUpperCase().padStart(4, "0");
    byteArray[index] = parseInt(document.getElementById(address).textContent, 16);
  }

  let blob = new Blob([byteArray], { type: "application/octet-stream" });
  let url = URL.createObjectURL(blob);

  let a = document.createElement("a");
  a.href = url;
  a.download = bgMapFileName;

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  addToLog("BG Map Saved: \"" + bgMapName + "\" >> \"" + bgMapFileName + "\"");
}

function chooseBGMapBin(bgMapName) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".bin,application/octet-stream";
  input.addEventListener("change", async () => {
    const file = input.files[0];
    if (!file) return;
    const [, columns, rows, , , , fileSize] = bgMaps[bgMapName];
    const expectedSize = fileSize || columns * rows;
    if (file.size !== expectedSize) {
      displayToast("invalidBGMapBinSize");
      return;
    }

    pendingBGMapBinImport = {
      bgMapName,
      fileName: file.name,
      bytes: new Uint8Array(await file.arrayBuffer())
    };
    document.getElementById("importBGMapBinMessage").textContent =
      `Replace "${bgMapName}" with the ${expectedSize}-byte file "${file.name}"?`;
    document.getElementById("importBGMapBinDialog").showModal();
  }, { once: true });
  input.click();
}

function initializeBGMapBinImportDialog() {
  const dialog = document.getElementById("importBGMapBinDialog");
  document.getElementById("confirmBGMapBinImport").addEventListener("click", () => {
    if (pendingBGMapBinImport) {
      const { bgMapName, fileName, bytes } = pendingBGMapBinImport;
      const [startAddress, , , , , gapValue] = bgMaps[bgMapName];
      const start = parseInt(startAddress, 16);
      const gap = gapValue ? parseInt(gapValue, 10) : 1;

      bytes.forEach((byte, index) => {
        const address = (start + index * gap).toString(16).toUpperCase().padStart(4, "0");
        const cell = document.getElementById(address);
        const value = byte.toString(16).toUpperCase().padStart(2, "0");
        if (cell && cell.textContent !== value) {
          cell.textContent = value;
          cell.classList.add("edited");
        }
      });

      document.getElementById("createFileBtn").removeAttribute("disabled");
      updateChecksums(false);
      renderBGMapPreview(bgMapName);
      displayToast("bgMapBinImported");
      addToLog(`Background map "${bgMapName}" was imported from "${fileName}"`);
    }
    pendingBGMapBinImport = null;
    dialog.close();
  });
  document.getElementById("cancelBGMapBinImport").addEventListener("click", () => {
    pendingBGMapBinImport = null;
    dialog.close();
  });
  dialog.addEventListener("cancel", () => {
    pendingBGMapBinImport = null;
  });
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
async function validateFile(selectedFiles) {

  const maxFileSize = 3000; // files can't be bigger than that

  let file = selectedFiles.find(candidate => candidate.name.toLowerCase().endsWith(".gb"));

  // Check if a file is selected
  if (!file) {
    alert('Please select a file.');
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

  const symFile = selectedFiles.find(candidate => candidate.name.toLowerCase().endsWith(".sym"));
  const mapFile = selectedFiles.find(candidate => candidate.name.toLowerCase().endsWith(".map"));
  const metadataFile = selectedFiles.find(candidate => candidate.name.toLowerCase().endsWith(".trep.json"));
  const isVerifiedOriginalRom = await isVerifiedOriginalTetrisRom(file);
  gameGenieWarningActive = !isVerifiedOriginalRom;
  const showAddressCompatibilityWarning = !isVerifiedOriginalRom
    && !symFile
    && !mapFile
    && !metadataFile
    && localStorage.getItem(nonOriginalRomWarningStorageKey) !== "1";
  const ggTab = document.querySelector('.tab[data-tab="tab1"]');
  ggTab?.classList.toggle("linker-caution", gameGenieWarningActive);
  if (ggTab) ggTab.title = gameGenieWarningActive ? "Game Genie addresses may not match this ROM" : "";
  const ggContent = document.getElementById("ggCodesContent");
  const ggButton = document.getElementById("toggleGGCodes");
  ggContent.hidden = gameGenieWarningActive;
  ggButton.hidden = !gameGenieWarningActive;
  ggButton.setAttribute("aria-expanded", String(!gameGenieWarningActive));
  document.getElementById("ggCodesInlineWarning").hidden = !gameGenieWarningActive;
  let resolvedLinkerAddresses = 0;
  let resolvedMetadataTiles = 0;
  let resolvedMetadataMaps = 0;
  let loadedLinkerSymbols = null;
  if (symFile || mapFile) {
    const [symText, mapText] = await Promise.all([
      symFile ? symFile.text() : "",
      mapFile ? mapFile.text() : ""
    ]);
    const linkerSymbols = parseRgbdsSymbols(symText, mapText);
    loadedLinkerSymbols = linkerSymbols;
    const mismatch = findLinkerRomMismatch(linkerSymbols, file.size);
    if (mismatch) {
      hideLoadingAnimation();
      document.getElementById("wrapper2").style.display = "block";
      alert(`These linker files do not fit the selected ROM. Symbol "${mismatch.name}" resolves to ROM offset $${mismatch.offset.toString(16).toUpperCase()}, outside the ${file.size}-byte GB file. Select linker files produced by the same build.`);
      return false;
    }
    resolvedLinkerAddresses = applyLinkerAddressSettings(linkerSymbols);
  } else {
    applyLinkerAddressSettings(new Map());
  }
  if (metadataFile) {
    try {
      const metadata = parseTrepMetadata(await metadataFile.text());
      resolvedMetadataTiles = applyTrepTileMetadata(metadata, loadedLinkerSymbols || new Map(), file.size);
      resolvedMetadataMaps = applyTrepMetadata(metadata, loadedLinkerSymbols || new Map(), file.size);
    } catch (error) {
      hideLoadingAnimation();
      document.getElementById("wrapper2").style.display = "block";
      alert(`TREP metadata could not be loaded: ${error.message}`);
      return false;
    }
  }

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
      if (symFile || mapFile) {
        addToLog(`${resolvedLinkerAddresses} tile/BG-map addresses resolved from RGBDS linker files`);
      }
      if (metadataFile) {
        if (resolvedMetadataTiles) {
          addToLog(`${resolvedMetadataTiles} tile regions/sets loaded from ${metadataFile.name}`);
        }
        addToLog(`${resolvedMetadataMaps} BG maps loaded from ${metadataFile.name}`);
      }
      if (!isVerifiedOriginalRom) {
        document.querySelector('.tab[data-tab="tab2"]')?.click();
      }
      document.dispatchEvent(new CustomEvent("trepromloaded", { detail: {
        bytes: new Uint8Array(fileData),
        symbols: loadedLinkerSymbols ? Array.from(loadedLinkerSymbols) : []
      } }));
      if (showAddressCompatibilityWarning) {
        setTimeout(() => {
          const dialog = document.getElementById("nonOriginalRomDialog");
          if (!dialog.open) {
            document.getElementById("hideNonOriginalRomWarning").checked = false;
            dialog.showModal();
          }
        }, 1100);
      }
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
  window.scrollToAddress = scrollToAddress;
  
  
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
  activeBGMapDraft = {
    name: bgMap,
    columns: bgMaps[bgMap][1],
    rows: bgMaps[bgMap][2],
    tileSet: bgMaps[bgMap][3],
    filename: bgMaps[bgMap][4],
    exportOnly: false,
    sessionOnly: false
  };
  populateBGMapEditorSettings(bgMap);
  setBGMapExportOnly(false);
  document.dispatchEvent(new Event("bgmaploaded"));
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

}

//------------------------------------------------------------------------------------------
// tab group
function openTab(event, tabName) {
  const selectedTab = event.currentTarget;
  if (selectedTab.classList.contains("active")) return;

  document.querySelectorAll(".tab-content").forEach(content => {
    content.style.display = content.id === tabName ? "block" : "none";
  });

  document.querySelectorAll(".tab[data-tab]").forEach(tab => {
    tab.classList.toggle("active", tab === selectedTab);
  });

  const sharedPalette = document.getElementById("sharedPalette");
  sharedPalette.hidden = tabName === "tab1" || tabName === "tab4";
  if (tabName === "tab2") refreshDirtyBGMapPreviews();
}


//------------------------------------------------------------------------------------------
// Function to load the tiles of an object (e.g. sprite)
function loadObjectSprite(objectName, highlightOnly) {
  
  if(objectName === "no") return;

  const objectData = spriteObjects[objectName];
  
  // Only touch tiles that are currently highlighted.
  document.querySelectorAll(".tile.highlighted").forEach(tile => {
    tile.classList.remove("highlighted");
  });

  // assign some variables
  const romTileSet = objectData[0];
  const renderedTileSet = Array.from(document.querySelectorAll(".tile-set-section"))
    .find(section => section.dataset.tilesetSection === romTileSet);
  const startingAddressHex = renderedTileSet?.dataset.currentAddress || tileAddressesInROM[romTileSet][0];
  const startingAddress = parseInt(startingAddressHex, 16);
  const bitsPerPixel = Number(renderedTileSet?.dataset.currentBpp || tileAddressesInROM[romTileSet][2]);

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
