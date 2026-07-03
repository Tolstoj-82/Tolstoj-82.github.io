function isCurrentScreenVisible() {
  const screen = getActiveScreen();

  return (
    screen &&
    screen.identifiers.length > 0 &&
    screen.identifiers.every((identifier) => isIdentifierVisible(identifier))
  );
}

function isIdentifierVisible(identifier) {
  const [x, y] = identifier.tile.split(",").map(Number);
  const currentPixels = getTile(x, y);

  return tilesEqual(currentPixels, identifier.pixels);
}

function renderROIReadout() {
  const screen = getActiveScreen();

  roiReadout.innerHTML = "";

  if (!screen) {
    roiReadout.textContent = "No screen selected";
    return;
  }

  const title = document.createElement("div");
  title.className = "roiReadoutTitle";
  title.textContent = "Live OCR";

  roiReadout.appendChild(title);

  const screenVisible = isCurrentScreenVisible();
  const canReadScreen = screenVisible || screen.identifiers.length === 0;
  const ocrValues = {};

  updateAchievementScreenRun(screen, canReadScreen);

  screen.rois.forEach((roi) => {
    const row = document.createElement("div");
    row.className = "roiReadoutItem";

    const label = document.createElement("strong");
    label.textContent = `${roi.name}: `;

    const value = document.createElement("span");

    const tileset = tilesets.find((t) => t.id === roi.tilesetId);

    if (!tileset) {
      value.textContent = "--";
    } else if (canReadScreen) {
      const labels = sortTileKeysByReadingOrder(roi.tiles)
        .map((key) => {
          const [x, y] = key.split(",").map(Number);
          return findTileLabelInTileset(getTile(x, y), tileset);
        })
        .filter((label) => label !== null && label !== "");

      const found = formatROIValue(labels, tileset.type || "text-number");

      if (found !== "--") {
        lastOCRValues[roi.id] = found;
        ocrValues[roi.name] = found;
      }

      value.textContent = lastOCRValues[roi.id] || "--";
    } else {
      value.textContent = lastOCRValues[roi.id] || "--";
    }

    if (value.textContent !== "--") {
      ocrValues[roi.name] = value.textContent;
    }

    row.appendChild(label);
    row.appendChild(value);
    roiReadout.appendChild(row);
  });

  if (canReadScreen) {
    evaluateAchievements(screen, ocrValues);
  }
}
