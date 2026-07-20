const finderState = {
  rom: null,
  fileName: "",
  bpp: 2,
  shift: 0,
  rowOffset: 0,
  rangeStart: 0,
  rangeEnd: 0,
  visibleTiles: [],
  selectedAddresses: new Set(),
  hiddenTiles: new Set(),
  assignedTiles: new Set(),
  sets: []
};

const finderPalette = ["#F8F8F8", "#A8A8A8", "#585858", "#080808"];
const finderElements = {};

document.addEventListener("DOMContentLoaded", () => {
  for (const id of [
    "finderRomInput", "finderStart", "finderEnd", "shiftLeft", "shiftRight", "shiftReset",
    "shiftValue", "rowPrevious", "rowNext", "rowReset", "rowValue",
    "showFinderRange", "restoreFinderTiles",
    "finderFileStatus", "finderSelectionStatus", "finderViewport", "finderTiles",
    "finderMarquee", "finderSetName", "finderSelectedRange", "addFinderSet",
    "finderSetList", "finderOutput", "copyFinderOutput", "downloadFinderOutput",
    "finderTileMenu"
  ]) finderElements[id] = document.getElementById(id);

  finderElements.finderRomInput.addEventListener("change", loadFinderRom);
  finderElements.showFinderRange.addEventListener("click", applyFinderRange);
  document.querySelectorAll('input[name="finderBpp"]').forEach(input => {
    input.addEventListener("change", () => {
      finderState.bpp = Number(input.value);
      finderState.rowOffset = 0;
      updateFinderRowControls();
      clearFinderSelection();
      renderFinderTiles();
    });
  });

  finderElements.shiftLeft.addEventListener("click", () => changeFinderShift(1));
  finderElements.shiftRight.addEventListener("click", () => changeFinderShift(-1));
  finderElements.shiftReset.addEventListener("click", () => changeFinderShift(-finderState.shift));
  finderElements.rowPrevious.addEventListener("click", () => changeFinderRow(1));
  finderElements.rowNext.addEventListener("click", () => changeFinderRow(-1));
  finderElements.rowReset.addEventListener("click", () => changeFinderRow(-finderState.rowOffset));
  finderElements.restoreFinderTiles.addEventListener("click", restoreDeletedFinderTiles);
  finderElements.finderViewport.addEventListener("keydown", event => {
    if ((event.key === "Delete" || event.key === "Backspace") && finderState.selectedAddresses.size) {
      event.preventDefault();
      deleteSelectedFinderTiles();
    }
  });
  finderElements.addFinderSet.addEventListener("click", addFinderSet);
  finderElements.copyFinderOutput.addEventListener("click", copyFinderOutput);
  finderElements.downloadFinderOutput.addEventListener("click", downloadFinderOutput);
  finderElements.finderSetList.addEventListener("click", handleFinderSetAction);
  finderElements.finderTileMenu.addEventListener("click", handleFinderTileMenu);
  document.addEventListener("pointerdown", event => {
    if (!event.target.closest("#finderTileMenu")) closeFinderTileMenu();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeFinderTileMenu();
  });
  window.addEventListener("blur", closeFinderTileMenu);
  finderElements.finderViewport.addEventListener("scroll", closeFinderTileMenu);
  bindFinderMarquee();
  updateFinderRowControls();
  updateFinderOutput();
});

async function loadFinderRom(event) {
  const file = event.target.files[0];
  if (!file) return;

  finderState.rom = new Uint8Array(await file.arrayBuffer());
  finderState.fileName = file.name.replace(/\.[^.]+$/, "");
  finderState.rangeStart = 0;
  finderState.rangeEnd = finderState.rom.length;
  finderState.shift = 0;
  finderState.rowOffset = 0;
  finderState.hiddenTiles.clear();
  finderState.assignedTiles.clear();
  finderState.sets = [];
  finderElements.finderStart.value = formatFinderAddress(finderState.rangeStart);
  finderElements.finderEnd.value = formatFinderAddress(finderState.rangeEnd - 1);
  finderElements.finderFileStatus.textContent = `${file.name} · ${finderState.rom.length.toLocaleString()} bytes`;
  updateFinderRowControls();
  clearFinderSelection();
  updateFinderOutput();
  renderFinderTiles();
}

function applyFinderRange() {
  if (!finderState.rom) return;
  const start = parseFinderAddress(finderElements.finderStart.value);
  const inclusiveEnd = parseFinderAddress(finderElements.finderEnd.value);
  if (start === null || inclusiveEnd === null || start > inclusiveEnd || start >= finderState.rom.length) {
    finderElements.finderFileStatus.textContent = "Enter a valid hexadecimal address range.";
    return;
  }

  finderState.rangeStart = start;
  finderState.rangeEnd = Math.min(inclusiveEnd + 1, finderState.rom.length);
  finderState.rowOffset = 0;
  updateFinderRowControls();
  finderElements.finderStart.value = formatFinderAddress(finderState.rangeStart);
  finderElements.finderEnd.value = formatFinderAddress(finderState.rangeEnd - 1);
  clearFinderSelection();
  renderFinderTiles();
}

function parseFinderAddress(value) {
  const normalized = value.trim().replace(/^\$|^0x/i, "");
  return /^[0-9a-f]+$/i.test(normalized) ? Number.parseInt(normalized, 16) : null;
}

function formatFinderAddress(value) {
  const width = finderState.rom && finderState.rom.length > 0x10000 ? 6 : 4;
  return Math.max(0, value).toString(16).toUpperCase().padStart(width, "0");
}

function changeFinderShift(delta) {
  finderState.shift = Math.max(-8, Math.min(8, finderState.shift + delta));
  finderElements.shiftValue.value = finderState.shift > 0 ? `+${finderState.shift}` : finderState.shift;
  finderElements.shiftValue.textContent = finderElements.shiftValue.value;
  renderFinderTiles();
  renderFinderSetList();
}

function changeFinderRow(delta) {
  const minimumOffset = finderState.rom
    ? Math.max(-7, -Math.floor(finderState.rangeStart / finderState.bpp))
    : 0;
  finderState.rowOffset = Math.max(minimumOffset, Math.min(7, finderState.rowOffset + delta));
  updateFinderRowControls();
  clearFinderSelection();
  renderFinderTiles();
}

function updateFinderRowControls() {
  const minimumOffset = finderState.rom
    ? Math.max(-7, -Math.floor(finderState.rangeStart / finderState.bpp))
    : 0;
  finderElements.rowValue.value = finderState.rowOffset;
  finderElements.rowValue.textContent = finderState.rowOffset > 0 ? `+${finderState.rowOffset}` : finderState.rowOffset;
  finderElements.rowPrevious.disabled = finderState.rowOffset === 7;
  finderElements.rowNext.disabled = finderState.rowOffset === minimumOffset;
  finderElements.rowReset.disabled = finderState.rowOffset === 0;
}

function shiftedFinderByte(address) {
  if (!finderState.rom || address < 0 || address >= finderState.rom.length) return 0;
  const byte = finderState.rom[address];
  if (finderState.shift === 0) return byte;
  if (finderState.shift > 0) {
    const amount = finderState.shift;
    const next = finderState.rom[address + 1] || 0;
    return ((byte << amount) & 0xFF) | (next >> (8 - amount));
  }
  const amount = -finderState.shift;
  const previous = finderState.rom[address - 1] || 0;
  return (byte >> amount) | ((previous << (8 - amount)) & 0xFF);
}

function decodeFinderTile(address, bpp = finderState.bpp) {
  const pixels = new Uint8Array(64);
  for (let row = 0; row < 8; row++) {
    const low = shiftedFinderByte(address + row * bpp);
    const high = bpp === 2 ? shiftedFinderByte(address + row * bpp + 1) : 0;
    for (let column = 0; column < 8; column++) {
      const mask = 1 << (7 - column);
      pixels[row * 8 + column] = bpp === 2
        ? (low & mask ? 1 : 0) | (high & mask ? 2 : 0)
        : (low & mask ? 3 : 0);
    }
  }
  return pixels;
}

function drawFinderTile(canvas, address, bpp = finderState.bpp) {
  canvas.width = 8;
  canvas.height = 8;
  const context = canvas.getContext("2d");
  context.imageSmoothingEnabled = false;
  const pixels = decodeFinderTile(address, bpp);
  for (let index = 0; index < pixels.length; index++) {
    context.fillStyle = finderPalette[pixels[index]];
    context.fillRect(index % 8, Math.floor(index / 8), 1, 1);
  }
}

function renderFinderTiles() {
  const container = finderElements.finderTiles;
  container.replaceChildren();
  finderState.visibleTiles = [];
  const renderVersion = (finderState.renderVersion || 0) + 1;
  finderState.renderVersion = renderVersion;
  if (!finderState.rom) {
    return;
  }

  const bytesPerTile = finderState.bpp * 8;
  const alignedStart = finderState.rangeStart + finderState.rowOffset * finderState.bpp;
  const tileCount = Math.max(0, Math.floor((finderState.rangeEnd - alignedStart) / bytesPerTile));
  const visibleTileIndexes = [];
  const excludedRanges = buildFinderExcludedRanges();
  let excludedRangeIndex = 0;
  for (let tileIndex = 0; tileIndex < tileCount; tileIndex++) {
    const address = alignedStart + tileIndex * bytesPerTile;
    const effectiveAddress = address + Math.trunc(finderState.shift / 8);
    while (excludedRangeIndex < excludedRanges.length
      && excludedRanges[excludedRangeIndex].end <= effectiveAddress) excludedRangeIndex++;
    const excludedRange = excludedRanges[excludedRangeIndex];
    const overlapsExcludedBytes = excludedRange
      && excludedRange.start < effectiveAddress + bytesPerTile
      && excludedRange.end > effectiveAddress;
    if (!overlapsExcludedBytes) visibleTileIndexes.push(tileIndex);
  }

  finderElements.restoreFinderTiles.disabled = finderState.hiddenTiles.size === 0;
  let rendered = 0;
  const renderChunk = () => {
    if (finderState.renderVersion !== renderVersion) return;
    const fragment = document.createDocumentFragment();
    const chunkEnd = Math.min(rendered + 500, visibleTileIndexes.length);
    for (; rendered < chunkEnd; rendered++) {
      const address = alignedStart + visibleTileIndexes[rendered] * bytesPerTile;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "finder-tile";
      button.dataset.address = address;
      button.title = `$${formatFinderAddress(address)} · ${finderState.bpp}BPP`;
      if (finderState.selectedAddresses.has(address)) button.classList.add("selected");
      const canvas = document.createElement("canvas");
      drawFinderTile(canvas, address);
      button.appendChild(canvas);
      button.addEventListener("click", event => toggleFinderTile(button, event));
      button.addEventListener("contextmenu", event => openFinderTileMenu(event, address));
      finderState.visibleTiles.push(button);
      fragment.appendChild(button);
    }
    container.appendChild(fragment);
    finderElements.finderFileStatus.textContent = rendered < visibleTileIndexes.length
      ? `${finderState.fileName} · rendering ${rendered.toLocaleString()} of ${visibleTileIndexes.length.toLocaleString()} tiles…`
      : `${finderState.fileName} · ${finderState.rom.length.toLocaleString()} bytes · ${visibleTileIndexes.length.toLocaleString()} tiles shown`;
    if (rendered < visibleTileIndexes.length) requestAnimationFrame(renderChunk);
  };
  renderChunk();
}

function finderTileKey(address) {
  return `${finderState.bpp}:${address + Math.trunc(finderState.shift / 8)}`;
}

function buildFinderExcludedRanges() {
  const ranges = [];
  for (const tileKey of [...finderState.hiddenTiles, ...finderState.assignedTiles]) {
    const [bpp, address] = tileKey.split(":").map(Number);
    if (!Number.isInteger(bpp) || !Number.isInteger(address)) continue;
    ranges.push({ start:address, end:address + bpp * 8 });
  }
  ranges.sort((left, right) => left.start - right.start || left.end - right.end);
  const merged = [];
  for (const range of ranges) {
    const previous = merged[merged.length - 1];
    if (previous && range.start <= previous.end) previous.end = Math.max(previous.end, range.end);
    else merged.push({ ...range });
  }
  return merged;
}

function deleteSelectedFinderTiles() {
  for (const address of finderState.selectedAddresses) {
    finderState.hiddenTiles.add(finderTileKey(address));
  }
  clearFinderSelection();
  renderFinderTiles();
  finderElements.finderViewport.focus();
}

function restoreDeletedFinderTiles() {
  finderState.hiddenTiles.clear();
  clearFinderSelection();
  renderFinderTiles();
}

function openFinderTileMenu(event, address) {
  event.preventDefault();
  finderState.contextAddress = address;
  const menu = finderElements.finderTileMenu;
  menu.hidden = false;
  const margin = 8;
  const left = Math.min(event.clientX, window.innerWidth - menu.offsetWidth - margin);
  const top = Math.min(event.clientY, window.innerHeight - menu.offsetHeight - margin);
  menu.style.left = `${Math.max(margin, left)}px`;
  menu.style.top = `${Math.max(margin, top)}px`;
  menu.querySelector("button").focus();
}

function closeFinderTileMenu() {
  if (finderElements.finderTileMenu) finderElements.finderTileMenu.hidden = true;
}

function handleFinderTileMenu(event) {
  const action = event.target.closest("button[data-delete-side]");
  if (!action || !Number.isInteger(finderState.contextAddress)) return;
  const bytesPerTile = finderState.bpp * 8;
  const alignedStart = finderState.rangeStart + finderState.rowOffset * finderState.bpp;
  const tileCount = Math.floor((finderState.rangeEnd - alignedStart) / bytesPerTile);
  for (let tileIndex = 0; tileIndex < tileCount; tileIndex++) {
    const address = alignedStart + tileIndex * bytesPerTile;
    const shouldDelete = action.dataset.deleteSide === "before"
      ? address < finderState.contextAddress
      : address > finderState.contextAddress;
    if (shouldDelete) finderState.hiddenTiles.add(finderTileKey(address));
  }
  closeFinderTileMenu();
  clearFinderSelection();
  renderFinderTiles();
}

function toggleFinderTile(button, event) {
  if (finderState.marqueeMoved) return;
  const address = Number(button.dataset.address);
  if (!event.ctrlKey && !event.metaKey && !event.shiftKey) finderState.selectedAddresses.clear();
  if (finderState.selectedAddresses.has(address)) finderState.selectedAddresses.delete(address);
  else finderState.selectedAddresses.add(address);
  syncFinderSelectionClasses();
}

function bindFinderMarquee() {
  const viewport = finderElements.finderViewport;
  viewport.addEventListener("pointerdown", event => {
    if (event.button !== 0 || event.target.closest(".finder-tile")) return;
    event.preventDefault();
    viewport.focus({ preventScroll:true });
    const bounds = viewport.getBoundingClientRect();
    finderState.marqueeStart = {
      x: event.clientX - bounds.left + viewport.scrollLeft,
      y: event.clientY - bounds.top + viewport.scrollTop
    };
    finderState.marqueeAdd = event.ctrlKey || event.metaKey;
    finderState.marqueeMoved = false;
    if (!finderState.marqueeAdd) finderState.selectedAddresses.clear();
    viewport.setPointerCapture(event.pointerId);
  });

  viewport.addEventListener("pointermove", event => {
    if (!finderState.marqueeStart) return;
    const bounds = viewport.getBoundingClientRect();
    const current = {
      x: event.clientX - bounds.left + viewport.scrollLeft,
      y: event.clientY - bounds.top + viewport.scrollTop
    };
    const left = Math.min(finderState.marqueeStart.x, current.x);
    const top = Math.min(finderState.marqueeStart.y, current.y);
    const width = Math.abs(current.x - finderState.marqueeStart.x);
    const height = Math.abs(current.y - finderState.marqueeStart.y);
    finderState.marqueeMoved = width > 3 || height > 3;
    Object.assign(finderElements.finderMarquee.style, {
      left: `${left}px`, top: `${top}px`, width: `${width}px`, height: `${height}px`
    });
    finderElements.finderMarquee.hidden = false;

    const selectionRect = { left, top, right:left + width, bottom:top + height };
    for (const tile of finderState.visibleTiles) {
      const tileBounds = tile.getBoundingClientRect();
      const tileRect = {
        left:tileBounds.left - bounds.left + viewport.scrollLeft,
        top:tileBounds.top - bounds.top + viewport.scrollTop,
        right:tileBounds.right - bounds.left + viewport.scrollLeft,
        bottom:tileBounds.bottom - bounds.top + viewport.scrollTop
      };
      const intersects = selectionRect.left < tileRect.right && selectionRect.right > tileRect.left
        && selectionRect.top < tileRect.bottom && selectionRect.bottom > tileRect.top;
      const address = Number(tile.dataset.address);
      if (intersects) finderState.selectedAddresses.add(address);
      else if (!finderState.marqueeAdd) finderState.selectedAddresses.delete(address);
    }
    syncFinderSelectionClasses();
  });

  const finishMarquee = event => {
    if (!finderState.marqueeStart) return;
    finderState.marqueeStart = null;
    finderElements.finderMarquee.hidden = true;
    if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
    setTimeout(() => { finderState.marqueeMoved = false; }, 0);
  };
  viewport.addEventListener("pointerup", finishMarquee);
  viewport.addEventListener("pointercancel", finishMarquee);
}

function clearFinderSelection() {
  finderState.selectedAddresses.clear();
  syncFinderSelectionClasses();
}

function syncFinderSelectionClasses() {
  for (const tile of finderState.visibleTiles) {
    tile.classList.toggle("selected", finderState.selectedAddresses.has(Number(tile.dataset.address)));
  }
  const selected = [...finderState.selectedAddresses].sort((a, b) => a - b);
  const bytesPerTile = finderState.bpp * 8;
  if (!selected.length) {
    finderElements.finderSelectionStatus.textContent = "No tiles selected";
    finderElements.finderSelectedRange.textContent = "—";
    finderElements.addFinderSet.disabled = true;
    return;
  }
  const start = selected[0];
  const end = selected[selected.length - 1] + bytesPerTile - 1;
  const expectedCount = (selected[selected.length - 1] - start) / bytesPerTile + 1;
  const contiguous = expectedCount === selected.length;
  finderElements.finderSelectionStatus.textContent = `${selected.length} tile${selected.length === 1 ? "" : "s"} selected${contiguous ? "" : " (range contains gaps)"}`;
  finderElements.finderSelectedRange.textContent = `$${formatFinderAddress(start)}–$${formatFinderAddress(end)}`;
  finderElements.addFinderSet.disabled = !contiguous;
}

function addFinderSet() {
  const selected = [...finderState.selectedAddresses].sort((a, b) => a - b);
  const name = finderElements.finderSetName.value.trim();
  if (!selected.length) return;
  if (!name) {
    finderElements.finderSetName.focus();
    return;
  }
  if (finderState.sets.some(set => set.name.toLowerCase() === name.toLowerCase())) {
    finderElements.finderSetName.setCustomValidity("Each tileset needs a unique name.");
    finderElements.finderSetName.reportValidity();
    finderElements.finderSetName.setCustomValidity("");
    return;
  }
  const wholeByteShift = Math.trunc(finderState.shift / 8);
  const tileKeys = selected.map(address => finderTileKey(address));
  finderState.sets.push({
    name,
    start:selected[0] + wholeByteShift,
    count:selected.length,
    bpp:finderState.bpp,
    shift:finderState.shift - wholeByteShift * 8,
    tileKeys
  });
  tileKeys.forEach(tileKey => finderState.assignedTiles.add(tileKey));
  finderElements.finderSetName.value = "";
  clearFinderSelection();
  renderFinderSetList();
  updateFinderOutput();
  renderFinderTiles();
}

function renderFinderSetList() {
  finderElements.finderSetList.replaceChildren();
  finderState.sets.forEach((set, index) => {
    const card = document.createElement("article");
    card.className = "finder-set-card";
    card.draggable = true;
    card.dataset.index = index;
    const info = document.createElement("div");
    const name = document.createElement("div");
    name.className = "finder-set-name";
    name.textContent = set.name;
    const meta = document.createElement("div");
    meta.className = "finder-set-meta";
    meta.textContent = `$${formatFinderAddress(set.start)} · ${set.count} tiles · ${set.bpp}BPP${set.shift ? ` · shift ${set.shift > 0 ? "+" : ""}${set.shift}` : ""}`;
    const preview = document.createElement("div");
    preview.className = "finder-set-preview";
    const bytesPerTile = set.bpp * 8;
    for (let tile = 0; tile < Math.min(set.count, 7); tile++) {
      const canvas = document.createElement("canvas");
      const oldShift = finderState.shift;
      finderState.shift = set.shift;
      drawFinderTile(canvas, set.start + tile * bytesPerTile, set.bpp);
      finderState.shift = oldShift;
      preview.appendChild(canvas);
    }
    info.append(name, meta, preview);

    const actions = document.createElement("div");
    actions.className = "finder-set-actions";
    actions.innerHTML = `<button type="button" data-action="up" aria-label="Move up">↑</button>
      <button type="button" data-action="down" aria-label="Move down">↓</button>
      <button type="button" class="secondary" data-action="remove" aria-label="Remove">×</button>`;
    card.append(info, actions);
    bindFinderSetDrag(card);
    finderElements.finderSetList.appendChild(card);
  });
}

function handleFinderSetAction(event) {
  const button = event.target.closest("button[data-action]");
  const card = event.target.closest(".finder-set-card");
  if (!button || !card) return;
  const index = Number(card.dataset.index);
  if (button.dataset.action === "remove") {
    finderState.sets.splice(index, 1);
    rebuildAssignedFinderTiles();
  }
  else if (button.dataset.action === "up" && index > 0) moveFinderSet(index, index - 1);
  else if (button.dataset.action === "down" && index < finderState.sets.length - 1) moveFinderSet(index, index + 1);
  renderFinderSetList();
  updateFinderOutput();
}

function rebuildAssignedFinderTiles() {
  finderState.assignedTiles.clear();
  for (const set of finderState.sets) {
    for (const tileKey of set.tileKeys || []) finderState.assignedTiles.add(tileKey);
  }
  renderFinderTiles();
}

function moveFinderSet(from, to) {
  const [set] = finderState.sets.splice(from, 1);
  finderState.sets.splice(to, 0, set);
}

function bindFinderSetDrag(card) {
  card.addEventListener("dragstart", event => {
    finderState.draggedSet = Number(card.dataset.index);
    card.classList.add("dragging");
    event.dataTransfer.effectAllowed = "move";
  });
  card.addEventListener("dragend", () => {
    card.classList.remove("dragging");
    document.querySelectorAll(".drop-before").forEach(item => item.classList.remove("drop-before"));
  });
  card.addEventListener("dragover", event => {
    event.preventDefault();
    card.classList.add("drop-before");
  });
  card.addEventListener("dragleave", () => card.classList.remove("drop-before"));
  card.addEventListener("drop", event => {
    event.preventDefault();
    const target = Number(card.dataset.index);
    const source = finderState.draggedSet;
    if (Number.isInteger(source) && source !== target) moveFinderSet(source, target > source ? target - 1 : target);
    renderFinderSetList();
    updateFinderOutput();
  });
}

function updateFinderOutput() {
  const lines = finderState.sets.map(set => {
    const escapedName = set.name.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    const shiftNote = set.shift ? ` /* bit shift ${set.shift > 0 ? "+" : ""}${set.shift} */` : "";
    return `  "${escapedName}": ["${formatFinderAddress(set.start)}", ${set.count}, ${set.bpp}, true]${shiftNote}`;
  });
  finderElements.finderOutput.value = lines.length
    ? `const tileAddressesInROM = {\n${lines.join(",\n")}\n};`
    : "const tileAddressesInROM = {};";
}

async function copyFinderOutput() {
  const output = finderElements.finderOutput;
  try {
    await navigator.clipboard.writeText(output.value);
  } catch {
    output.focus();
    output.select();
    document.execCommand("copy");
    output.setSelectionRange(0, 0);
  }
  const original = finderElements.copyFinderOutput.textContent;
  finderElements.copyFinderOutput.textContent = "Copied";
  setTimeout(() => { finderElements.copyFinderOutput.textContent = original; }, 1200);
}

function downloadFinderOutput() {
  const blob = new Blob([finderElements.finderOutput.value + "\n"], { type:"text/javascript" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${finderState.fileName || "game"}-tile-settings.js`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 0);
}
