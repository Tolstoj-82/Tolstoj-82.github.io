const INITIAL_LUT_CATEGORY = "GB Standard Palettes";
const INITIAL_LUT_PALETTE = "MGB-001";

function getLUTOptionValue(category, paletteName) {
  return `${category}::${paletteName}`;
}

function parseLUTOptionValue(value) {
  const [category, paletteName] = value.split("::");

  return { category, paletteName };
}

function setDisplayPaletteFromLUT(category, paletteName) {
  const colors = paletteLookup[category]?.[paletteName];

  if (!colors) return;

  displayPalette = [...colors].reverse();
  refreshDisplayPalette();
}

function refreshDisplayPalette() {
  renderLUTSwatches();
  refreshPaletteSurfaces();
}

function refreshPaletteSurfaces() {
  redrawQuantizedCanvas();
  renderTiles();
  renderTilesets();
  renderIdentifierInfo();
}

function renderLUTControls() {
  lutPaletteSelect.innerHTML = "";

  Object.entries(paletteLookup).forEach(([category, palettes]) => {
    const group = document.createElement("optgroup");
    group.label = category;

    Object.keys(palettes).forEach((paletteName) => {
      const option = document.createElement("option");
      option.value = getLUTOptionValue(category, paletteName);
      option.textContent = paletteName;
      group.appendChild(option);
    });

    lutPaletteSelect.appendChild(group);
  });

  lutPaletteSelect.value = getLUTOptionValue(
    INITIAL_LUT_CATEGORY,
    INITIAL_LUT_PALETTE,
  );

  lutPaletteSelect.onchange = () => {
    const { category, paletteName } = parseLUTOptionValue(
      lutPaletteSelect.value,
    );

    setDisplayPaletteFromLUT(category, paletteName);
  };

  setDisplayPaletteFromLUT(INITIAL_LUT_CATEGORY, INITIAL_LUT_PALETTE);
}

function renderLUTSwatches() {
  lutSwatches.innerHTML = "";

  displayPalette.forEach((color, index) => {
    const swatch = document.createElement("label");
    swatch.className = "lutSwatch";
    swatch.style.backgroundColor = color;
    swatch.title = color;

    const input = document.createElement("input");
    input.type = "color";
    input.value = color;

    input.oninput = () => {
      displayPalette[index] = input.value;
      swatch.style.backgroundColor = input.value;
      swatch.title = input.value;
      refreshPaletteSurfaces();
    };

    swatch.appendChild(input);
    lutSwatches.appendChild(swatch);
  });
}
