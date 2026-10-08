(() => {
"use strict";
const cropDialog = document.getElementById("cropDialog");
const cropStage = document.getElementById("cropStage");
const cropSelection = document.getElementById("cropSelection");
const cropSize = document.getElementById("cropSize");
let cropState = null;
let cropDrag = null;
function requestLogoCrop(image) {
  return new Promise((resolve) => {
    const width = image.naturalWidth,
      height = image.naturalHeight;
    const size = Math.min(width, height);
    cropState = {
      image,
      width,
      height,
      size,
      x: (width - size) / 2,
      y: (height - size) / 2,
      resolve,
    };
    const preview = document.getElementById("cropImage");
    preview.width = width;
    preview.height = height;
    preview.getContext("2d").drawImage(image, 0, 0);
    cropStage.style.aspectRatio = width + " / " + height;
    cropStage.style.width =
      "min(100%, " + Math.min(440, (320 * width) / height) + "px)";
    cropSize.min = String(Math.min(16, size));
    cropSize.max = String(size);
    updateCrop();
    cropDialog.showModal();
    cropSelection.focus();
  });
}
function updateCrop() {
  if (!cropState) return;
  const c = cropState;
  c.size = Math.max(
    Number(cropSize.min),
    Math.min(Math.min(c.width, c.height), c.size),
  );
  c.x = Math.max(0, Math.min(c.width - c.size, c.x));
  c.y = Math.max(0, Math.min(c.height - c.size, c.y));
  Object.assign(cropSelection.style, {
    left: (c.x / c.width) * 100 + "%",
    top: (c.y / c.height) * 100 + "%",
    width: (c.size / c.width) * 100 + "%",
    height: (c.size / c.height) * 100 + "%",
  });
  cropSize.value = String(Math.round(c.size));
}
function finishLogoCrop(apply) {
  if (!cropState) return;
  const c = cropState;
  let result = null;
  if (apply) {
    result = document.createElement("canvas");
    result.width = result.height = Math.min(
      256,
      Math.max(1, Math.round(c.size)),
    );
    result
      .getContext("2d")
      .drawImage(
        c.image,
        c.x,
        c.y,
        c.size,
        c.size,
        0,
        0,
        result.width,
        result.height,
      );
  }
  if (cropDrag && cropSelection.hasPointerCapture(cropDrag.pointer))
    cropSelection.releasePointerCapture(cropDrag.pointer);
  cropDrag = null;
  cropState = null;
  cropDialog.close();
  document.getElementById("cropImage").width = 0;
  c.resolve(result);
}
document
  .getElementById("applyCropBtn")
  .addEventListener("click", () => finishLogoCrop(true));
for (const id of ["cancelCropBtn", "closeCropBtn"])
  document
    .getElementById(id)
    .addEventListener("click", () => finishLogoCrop(false));
cropDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  finishLogoCrop(false);
});
cropDialog.addEventListener("close", () => {
  if (!cropDialog.open && cropState) finishLogoCrop(false);
});
cropSize.addEventListener("input", () => {
  if (!cropState) return;
  const delta = cropState.size - Number(cropSize.value);
  cropState.x += delta / 2;
  cropState.y += delta / 2;
  cropState.size = Number(cropSize.value);
  updateCrop();
});
cropSelection.addEventListener("keydown", (event) => {
  if (
    !cropState ||
    !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)
  )
    return;
  event.preventDefault();
  const step = event.shiftKey ? 10 : 1;
  cropState.x +=
    event.key === "ArrowLeft" ? -step : event.key === "ArrowRight" ? step : 0;
  cropState.y +=
    event.key === "ArrowUp" ? -step : event.key === "ArrowDown" ? step : 0;
  updateCrop();
});
cropSelection.addEventListener("pointerdown", (event) => {
  if (!cropState || event.button !== 0) return;
  event.preventDefault();
  cropSelection.focus();
  cropDrag = {
    pointer: event.pointerId,
    corner: event.target.dataset.corner,
    clientX: event.clientX,
    clientY: event.clientY,
    x: cropState.x,
    y: cropState.y,
    size: cropState.size,
  };
  cropSelection.setPointerCapture(event.pointerId);
});
cropSelection.addEventListener("pointermove", (event) => {
  if (!cropState || !cropDrag || cropDrag.pointer !== event.pointerId) return;
  const rect = cropStage.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const dx =
    ((event.clientX - cropDrag.clientX) * cropState.width) / rect.width;
  const dy =
    ((event.clientY - cropDrag.clientY) * cropState.height) / rect.height;
  const start = cropDrag;
  if (!start.corner) {
    cropState.x = start.x + dx;
    cropState.y = start.y + dy;
  } else {
    const west = start.corner.includes("w"),
      north = start.corner.includes("n");
    const anchorX = start.x + (west ? start.size : 0),
      anchorY = start.y + (north ? start.size : 0);
    const delta =
      Math.abs(dx) > Math.abs(dy)
        ? dx * (west ? -1 : 1)
        : dy * (north ? -1 : 1);
    const limit = Math.min(
      west ? anchorX : cropState.width - anchorX,
      north ? anchorY : cropState.height - anchorY,
    );
    cropState.size = Math.max(
      Number(cropSize.min),
      Math.min(limit, start.size + delta),
    );
    cropState.x = west ? anchorX - cropState.size : anchorX;
    cropState.y = north ? anchorY - cropState.size : anchorY;
  }
  updateCrop();
});
for (const type of ["pointerup", "pointercancel", "lostpointercapture"])
  cropSelection.addEventListener(type, (event) => {
    if (cropDrag?.pointer !== event.pointerId) return;
    cropDrag = null;
    if (cropSelection.hasPointerCapture(event.pointerId))
      cropSelection.releasePointerCapture(event.pointerId);
  });

window.QRGenerator["logo-crop"] = {requestLogoCrop};
})();
