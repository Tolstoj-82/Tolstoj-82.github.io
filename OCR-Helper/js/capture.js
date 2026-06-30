// Tile capture
//--------------------------------

toggleCapture.onclick = () => {
  if (!capturing && captureROIIds.size === 0) {
    showAlert("Select at least one ROI to search.");
    return;
  }

  capturing = !capturing;
  updateCaptureUI();
};

function updateCaptureUI() {
  toggleCapture.textContent = capturing ? "⏹" : "▶";

  canvasContainer.classList.toggle("capturing", capturing);

  if (capturing) {
    captureBlink = false;

    document.title = "🔴 Capturing — Tile Capture Tool";

    captureBlinkTimer = setInterval(() => {
      captureBlink = !captureBlink;

      document.title = captureBlink
        ? "🔴 Capturing — Tile Capture Tool"
        : "⚫ Capturing — Tile Capture Tool";
    }, 500);
  } else {
    clearInterval(captureBlinkTimer);

    captureBlinkTimer = null;

    document.title = "Tile Capture Tool";
  }
}

setInterval(() => {
  if (!capturing) return;

  const selectedROIs = getActiveScreenROIs().filter((r) =>
    captureROIIds.has(r.id),
  );

  selectedROIs.forEach((r) => {
    r.tiles.forEach((id) => {
      let [x, y] = id.split(",");

      let pixels = getTile(Number(x), Number(y));

      let hash = pixels.join("");

      if (!uniqueTiles.has(hash)) {
        uniqueTiles.set(hash, {
          pixels,
          label: "",
        });

        renderTiles();
      }
    });
  });
}, 100);
