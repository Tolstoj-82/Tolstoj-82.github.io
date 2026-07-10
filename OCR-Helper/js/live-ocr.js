function isCurrentScreenVisible() {
  const screen = getActiveScreen();

  return Boolean(screen && screenMatchesByIdentifiers(screen));
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

  const now = Date.now();
  const screenVisible = isCurrentScreenVisible();

  if (screenVisible) {
    activeScreenLastVisibleAt = now;
  }

  const canReadScreen =
    screenVisible ||
    screen.identifiers.length === 0 ||
    (activeScreenLastVisibleAt > 0 &&
      now - activeScreenLastVisibleAt <= getScreenDetectionGraceMs());
  const ocrValues = {};

  updateAchievementScreenRun(screen, canReadScreen);

  screen.rois.forEach((roi) => {
    const row = document.createElement("div");
    row.className = "roiReadoutItem";

    const label = document.createElement("strong");
    label.textContent = `${roi.name}: `;

    const value = document.createElement("span");
    let stalled = false;

    const tileset = tilesets.find((t) => t.id === roi.tilesetId);

    if (!tileset) {
      value.textContent = "--";
    } else if (canReadScreen) {
      const labels = [];
      let hasUnknownTile = false;

      sortTileKeysByReadingOrder(roi.tiles).forEach((key) => {
          const [x, y] = key.split(",").map(Number);
          const label = findTileLabelInTileset(getTile(x, y), tileset);

          if (label === null) {
            hasUnknownTile = true;
            return;
          }

          if (label !== "") {
            labels.push(label);
          }
        });

      const shouldStall =
        game.settings?.stallOcrOnUnknownTiles && hasUnknownTile;
      stalled = shouldStall;

      const found = shouldStall
        ? lastOCRValues[roi.id] || "--"
        : formatROIValue(labels, tileset.type || "text-number");

      if (!shouldStall && found !== "--") {
        lastOCRValues[roi.id] = found;
      }

      value.textContent = lastOCRValues[roi.id] || "--";
    } else {
      value.textContent = lastOCRValues[roi.id] || "--";
    }

    value.classList.toggle("roiReadoutValueStalled", stalled);

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
