const WIDTH = 160;
const HEIGHT = 144;

const TILE = 8;

const TILES_X = WIDTH / TILE;
const TILES_Y = HEIGHT / TILE;

const SCALE = 4;

const DEFAULT_DISPLAY_PALETTE = ["#f0f0f0", "#a0a0a0", "#505050", "#000000"];
let displayPalette = DEFAULT_DISPLAY_PALETTE.slice();

function hexToRgb(hex) {
  const value = hex.replace("#", "");

  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function getDisplayColor(index) {
  return hexToRgb(displayPalette[index] || DEFAULT_DISPLAY_PALETTE[index]);
}

const roiColors = [
  "rgb(255, 99, 71)",
  "rgb(30, 144, 255)",
  "rgb(50, 205, 50)",
  "rgb(255, 0, 255)",
  "rgb(255, 215, 0)",
  "rgb(255, 140, 0)",
  "rgb(0, 206, 209)",
  "rgb(186, 85, 211)",
  "rgb(220, 20, 60)",
  "rgb(127, 255, 0)",
  "rgb(0, 191, 255)",
  "rgb(255, 105, 180)",
];

const screenColors = [
  "rgb(100, 149, 237)",
  "rgb(147, 112, 219)",
  "rgb(60, 179, 113)",
  "rgb(255, 165, 0)",
  "rgb(219, 112, 147)",
  "rgb(70, 130, 180)",
  "rgb(72, 209, 204)",
  "rgb(205, 133, 63)",
  "rgb(188, 143, 143)",
  "rgb(154, 205, 50)",
  "rgb(123, 104, 238)",
  "rgb(95, 158, 160)",
];

const tilesetTypes = [
  { value: "text-number", label: "Text/Number" },
  { value: "counter", label: "Counter (e.g. Hearts)" },
];
