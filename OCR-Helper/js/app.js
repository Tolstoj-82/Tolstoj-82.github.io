// Main loop
//--------------------------------

function drawLoop() {
  ctx.drawImage(video, 0, 0, WIDTH, HEIGHT);

  let frame = ctx.getImageData(0, 0, WIDTH, HEIGHT);

  processFrame(frame);
  autoDetectScreen();
  renderIdentifierInfo();
  renderROIReadout();

  requestAnimationFrame(drawLoop);
}

drawROIOverlay();
renderIdentifierInfo();
updatePalette();
updateCaptureUI();
renderTilesets();
updateWorkflowUI();
renderCaptureROIPicker();
renderSavedGameList();

document.querySelectorAll(".lutBox").forEach((box) => {
  box.style.width = "40px";
  box.style.height = "40px";
  box.style.border = "2px solid white";
  box.style.cursor = "pointer";
  box.style.background = "#222";

  box.onclick = async () => {
    let i = Number(box.dataset.i);

    // simple browser color picker
    let input = document.createElement("input");
    input.type = "color";

    input.oninput = () => {
      lut[i] = input.value;

      box.style.background = input.value;
    };

    input.click();
  };
});
