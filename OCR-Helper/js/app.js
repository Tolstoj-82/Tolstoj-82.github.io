const APP_TITLE = "GB OCR Tool";

document.title = APP_TITLE;

function drawLoop() {
  if (!snapshotPaused) {
    ctx.drawImage(video, 0, 0, WIDTH, HEIGHT);

    let frame = ctx.getImageData(0, 0, WIDTH, HEIGHT);

    processFrame(frame);
  }

  autoDetectScreen();
  updateIdentifierInfoStatus();
  renderROIReadout();

  requestAnimationFrame(drawLoop);
}

drawROIOverlay();
renderIdentifierInfo();
updateCalibrationStatus();
updateCaptureUI();
renderLUTControls();
renderTilesets();
updateWorkflowUI();
renderCaptureROIPicker();
renderSavedGameList();
updateScreenSetupTitle();
loadCameras();
