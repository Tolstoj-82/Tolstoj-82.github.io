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
  // Palette changes only affect display colors, not stored tile values.
  updateGridOverlayContrast();
  redrawQuantizedCanvas();
  renderTiles();
  renderTilesets();
  renderIdentifierInfo();
}

function getRelativeLuminance(color) {
  const channels = [color.r, color.g, color.b].map((value) => {
    const normalized = value / 255;

    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });

  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function getContrastRatio(a, b) {
  const light = Math.max(getRelativeLuminance(a), getRelativeLuminance(b));
  const dark = Math.min(getRelativeLuminance(a), getRelativeLuminance(b));

  return (light + 0.05) / (dark + 0.05);
}

function updateGridOverlayContrast() {
  const paletteColors = displayPalette.map(hexToRgb);
  const candidates = [
    { r: 255, g: 255, b: 255 },
    { r: 0, g: 0, b: 0 },
    { r: 255, g: 0, b: 255 },
    { r: 0, g: 255, b: 255 },
    { r: 255, g: 255, b: 0 },
  ];

  const best = candidates
    .map((candidate) => ({
      color: candidate,
      minContrast: Math.min(
        ...paletteColors.map((color) => getContrastRatio(candidate, color)),
      ),
    }))
    .sort((a, b) => b.minContrast - a.minContrast)[0].color;

  const outline = getRelativeLuminance(best) > 0.5
    ? { r: 0, g: 0, b: 0 }
    : { r: 255, g: 255, b: 255 };

  canvasContainer.style.setProperty(
    "--grid-line-color",
    `rgba(${best.r}, ${best.g}, ${best.b}, 0.78)`,
  );
  canvasContainer.style.setProperty(
    "--grid-outline-color",
    `rgba(${outline.r}, ${outline.g}, ${outline.b}, 0.65)`,
  );
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
