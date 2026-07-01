// Calibration
//--------------------------------

const HISTOGRAM_HEIGHT = 220;
const HISTOGRAM_TICKS = [0, 64, 128, 192, 255];

let histogramDragIndex = null;

document.getElementById("calibrateButton").onclick = () => {
  runCalibration();
};

// Sampling
//--------------------------------

function getFrameBrightnessSamples() {
  ctx.drawImage(video, 0, 0, WIDTH, HEIGHT);

  const frame = ctx.getImageData(0, 0, WIDTH, HEIGHT);
  const samples = [];

  for (let i = 0; i < frame.data.length; i += 4) {
    samples.push(
      Math.round((frame.data[i] + frame.data[i + 1] + frame.data[i + 2]) / 3),
    );
  }

  return samples;
}

// Auto calibration
//--------------------------------

function findFourShades(samples) {
  const histogram = new Array(256).fill(0);

  samples.forEach((value) => {
    histogram[value]++;
  });

  const ranked = histogram
    .map((count, value) => ({ value, count }))
    .sort((a, b) => b.count - a.count);

  const peaks = [];

  for (const peak of ranked) {
    if (!peaks.some((value) => Math.abs(value - peak.value) < 10)) {
      peaks.push(peak.value);
    }

    if (peaks.length === 4) break;
  }

  return peaks.sort((a, b) => b - a);
}

function assessCalibrationQuality(values) {
  if (!values || values.length !== 4) return "bad";

  const sortedDarkToBright = [...values].sort((a, b) => a - b);

  const distances = [
    sortedDarkToBright[1] - sortedDarkToBright[0],
    sortedDarkToBright[2] - sortedDarkToBright[1],
    sortedDarkToBright[3] - sortedDarkToBright[2],
  ];

  const minDistance = Math.min(...distances);

  if (minDistance >= 35) return "good";
  if (minDistance >= 18) return "ok";

  return "bad";
}

// Palette + thresholds
//--------------------------------

function updatePalette() {
  palette.sort((a, b) => b - a);

  for (let i = 0; i < 4; i++) {
    shadeBoxes[i].title = palette[i];

    shadeBoxes[i].style.background =
      `rgb(${palette[i]},${palette[i]},${palette[i]})`;

    shadeBoxes[i].classList.toggle("calibrated", calibrated);
  }

  calibrationStatus.textContent = getCalibrationStatusSymbol();

  calibrationStatus.classList.toggle("good", calibrationQuality === "good");
  calibrationStatus.classList.toggle(
    "bad",
    calibrationQuality === "bad" || calibrationQuality === "none",
  );

  validatePaletteOrder();
}

function calculateThresholdsFromPalette(values) {
  const sortedDarkToBright = [...values].sort((a, b) => a - b);

  return [
    Math.round((sortedDarkToBright[0] + sortedDarkToBright[1]) / 2),
    Math.round((sortedDarkToBright[1] + sortedDarkToBright[2]) / 2),
    Math.round((sortedDarkToBright[2] + sortedDarkToBright[3]) / 2),
  ];
}

function paletteFromThresholds(thresholds) {
  const sorted = [...thresholds].sort((a, b) => a - b);

  return [
    Math.round((sorted[2] + 255) / 2), // bright range
    Math.round((sorted[1] + sorted[2]) / 2),
    Math.round((sorted[0] + sorted[1]) / 2),
    Math.round(sorted[0] / 2), // dark range
  ];
}

function getCalibrationStatusSymbol() {
  switch (calibrationQuality) {
    case "good":
      return "✓";

    case "ok":
      return "△";

    case "bad":
      return "!";

    case "manual-thresholds":
      return "⇄";

    case "manual-pickers":
      return "✚";

    default:
      return "✖";
  }
}

function validatePaletteOrder() {
  if (!calibrationWarning) return;

  const isOrdered = palette.every((value, index) => {
    if (index === 0) return true;
    return palette[index - 1] >= value;
  });

  calibrationWarning.textContent = isOrdered
    ? ""
    : "Warning: shades are not ordered bright to dark.";
}

// Quantize
//--------------------------------

function processFrame(frame) {
  const output = ctx.createImageData(WIDTH, HEIGHT);

  for (let i = 0; i < WIDTH * HEIGHT; i++) {
    const p = i * 4;
    const gray = (frame.data[p] + frame.data[p + 1] + frame.data[p + 2]) / 3;

    let best = 0;

    if (gray < calibrationThresholds[0]) {
      best = 3;
    } else if (gray < calibrationThresholds[1]) {
      best = 2;
    } else if (gray < calibrationThresholds[2]) {
      best = 1;
    } else {
      best = 0;
    }

    quantized[i] = best;

    const value = palette[best];

    output.data[p] = value;
    output.data[p + 1] = value;
    output.data[p + 2] = value;
    output.data[p + 3] = 255;
  }

  ctx.putImageData(output, 0, 0);
}

// Histogram modal
//--------------------------------

openCalibrationModalButton.onclick = () => {
  if (!calibrated) {
    runCalibration();
  }

  pendingCalibrationThresholds = calibrationThresholds.slice();
  pendingPalette = palette.slice();

  calibrationModalOverlay.classList.remove("hidden");

  requestAnimationFrame(() => {
    drawCalibrationHistogram();
    validatePaletteOrder();
  });
};

saveCalibrationModalButton.onclick = () => {
  if (!pendingCalibrationThresholds || !pendingPalette) return;

  calibrationThresholds = pendingCalibrationThresholds.slice();
  palette = pendingPalette.slice();

  calibrationMode = "manual-thresholds";
  calibrationQuality = "manual-thresholds";

  pendingCalibrationThresholds = null;
  pendingPalette = null;

  updatePalette();
  updateWorkflowUI();

  calibrationModalOverlay.classList.add("hidden");
};

discardCalibrationModalButton.onclick = () => {
  pendingCalibrationThresholds = null;
  pendingPalette = null;

  calibrationModalOverlay.classList.add("hidden");
};

function setupHistogramCanvas() {
  const rect = calibrationHistogram.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  const cssWidth = Math.max(1, rect.width);
  const cssHeight = HISTOGRAM_HEIGHT;

  calibrationHistogram.width = Math.round(cssWidth * dpr);
  calibrationHistogram.height = Math.round(cssHeight * dpr);

  calibrationHistogramCtx.setTransform(1, 0, 0, 1, 0, 0);
  calibrationHistogramCtx.clearRect(
    0,
    0,
    calibrationHistogram.width,
    calibrationHistogram.height,
  );

  calibrationHistogramCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

  return {
    width: cssWidth,
    height: cssHeight,
  };
}

function drawCalibrationHistogram() {
  const ctx = calibrationHistogramCtx;
  const { width, height } = setupHistogramCanvas();

  const thresholds = (pendingCalibrationThresholds || calibrationThresholds)
    .slice(0, 3)
    .sort((a, b) => a - b);

  const plotLeft = 28;
  const plotRight = width - 28;
  const plotTop = 10;
  const plotBottom = height - 34;

  const plotWidth = plotRight - plotLeft;
  const plotHeight = plotBottom - plotTop;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  const bins = new Array(256).fill(0);

  calibrationSamples.forEach((value) => {
    const index = Math.max(0, Math.min(255, Math.round(value)));
    bins[index]++;
  });

  const max = Math.max(...bins, 1);

  ctx.fillStyle = "#2f8cff";

  bins.forEach((count, index) => {
    const x = plotLeft + (index / 255) * plotWidth;
    const barWidth = Math.max(1, plotWidth / 256);
    const barHeight = (count / max) * plotHeight;

    ctx.fillStyle = "#2f8cff";
    ctx.fillRect(x, plotBottom - barHeight, barWidth, barHeight);

    if (count > 0) {
      ctx.strokeStyle = "#1f5fa8";
      ctx.lineWidth = 1;
      ctx.strokeRect(x, plotBottom - barHeight, barWidth, barHeight);
    }
  });

  drawHistogramBaseline(ctx, plotLeft, plotRight, plotBottom);
  drawHistogramThresholds(
    ctx,
    thresholds,
    plotLeft,
    plotTop,
    plotBottom,
    plotWidth,
  );
  drawHistogramLabels(ctx, plotLeft, plotBottom, plotWidth);

  thresholdValues.textContent = thresholds.join(", ");
}

function drawHistogramBaseline(ctx, plotLeft, plotRight, plotBottom) {
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.moveTo(plotLeft, plotBottom + 0.5);
  ctx.lineTo(plotRight, plotBottom + 0.5);
  ctx.stroke();
}

function drawHistogramThresholds(
  ctx,
  thresholds,
  plotLeft,
  plotTop,
  plotBottom,
  plotWidth,
) {
  ctx.strokeStyle = "#ff4444";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);

  thresholds.forEach((threshold) => {
    const x = plotLeft + (threshold / 255) * plotWidth;

    ctx.beginPath();
    ctx.moveTo(x, plotTop);
    ctx.lineTo(x, plotBottom);
    ctx.stroke();

    ctx.setLineDash([]);

    ctx.fillStyle = "#ff4444";
    ctx.fillRect(x - 4, plotBottom + 5, 8, 8);

    ctx.setLineDash([4, 4]);
  });

  ctx.setLineDash([]);
}

function drawHistogramLabels(ctx, plotLeft, plotBottom, plotWidth) {
  ctx.fillStyle = "#000000";
  ctx.font = "12px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  HISTOGRAM_TICKS.forEach((value) => {
    const x = plotLeft + (value / 255) * plotWidth;
    ctx.fillText(String(value), x, plotBottom + 18);
  });
}

// Histogram interaction
//--------------------------------

calibrationHistogram.addEventListener("mousedown", (e) => {
  if (!pendingCalibrationThresholds) {
    pendingCalibrationThresholds = calibrationThresholds.slice();
  }

  const value = getHistogramValueFromMouse(e);
  const thresholds = pendingCalibrationThresholds;

  histogramDragIndex = thresholds.reduce((closestIndex, threshold, index) => {
    return Math.abs(threshold - value) <
      Math.abs(thresholds[closestIndex] - value)
      ? index
      : closestIndex;
  }, 0);

  selectedThresholdIndex = histogramDragIndex;
});

window.addEventListener("mousemove", (e) => {
  if (histogramDragIndex === null) return;

  const value = Math.max(1, Math.min(254, getHistogramValueFromMouse(e)));

  pendingCalibrationThresholds[histogramDragIndex] = value;
  pendingCalibrationThresholds.sort((a, b) => a - b);

  pendingPalette = paletteFromThresholds(pendingCalibrationThresholds);

  drawCalibrationHistogram();
});

window.addEventListener("mouseup", () => {
  histogramDragIndex = null;
});

function getHistogramValueFromMouse(e) {
  const rect = calibrationHistogram.getBoundingClientRect();

  const plotLeft = 28;
  const plotRight = rect.width - 28;
  const plotWidth = plotRight - plotLeft;

  const x = Math.max(plotLeft, Math.min(plotRight, e.clientX - rect.left));

  return Math.round(((x - plotLeft) / plotWidth) * 255);
}

function getCalibrationQualityText() {
  switch (calibrationQuality) {
    case "good":
      return "✓ Good calibration";

    case "ok":
      return "△ Acceptable calibration";

    case "bad":
      return "! Poor calibration";

    case "manual-thresholds":
      return "⇄ Manual thresholds";

    default:
      return "✖ Not calibrated";
  }
}

resetCalibrationAutoButton.onclick = () => {
  pendingCalibrationThresholds = autoCalibrationThresholds.slice();
  pendingPalette = autoCalibrationPalette.slice();

  selectedThresholdIndex = null;

  drawCalibrationHistogram();
};

function drawHistogramRegions(
  ctx,
  thresholds,
  plotLeft,
  plotTop,
  plotBottom,
  plotWidth,
) {
  const xs = [
    plotLeft,
    plotLeft + (thresholds[0] / 255) * plotWidth,
    plotLeft + (thresholds[1] / 255) * plotWidth,
    plotLeft + (thresholds[2] / 255) * plotWidth,
    plotLeft + plotWidth,
  ];

  const alphas = [0.18, 0.13, 0.08, 0.04];

  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = `rgba(0, 0, 0, ${alphas[i]})`;
    ctx.fillRect(xs[i], plotTop, xs[i + 1] - xs[i], plotBottom - plotTop);
  }
}

window.addEventListener("keydown", (e) => {
  if (calibrationModalOverlay.classList.contains("hidden")) return;
  if (selectedThresholdIndex === null) return;
  if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;

  e.preventDefault();

  if (!pendingCalibrationThresholds) {
    pendingCalibrationThresholds = calibrationThresholds.slice();
  }

  const delta = e.key === "ArrowLeft" ? -1 : 1;
  const step = e.shiftKey ? delta * 5 : delta;

  pendingCalibrationThresholds[selectedThresholdIndex] += step;
  pendingCalibrationThresholds[selectedThresholdIndex] = Math.max(
    1,
    Math.min(254, pendingCalibrationThresholds[selectedThresholdIndex]),
  );

  pendingCalibrationThresholds.sort((a, b) => a - b);
  pendingPalette = paletteFromThresholds(pendingCalibrationThresholds);

  drawCalibrationHistogram();
});

function runCalibration() {
  const samples = getFrameBrightnessSamples();

  calibrationSamples = samples.slice();

  palette = findFourShades(samples);
  calibrationThresholds = calculateThresholdsFromPalette(palette);

  autoCalibrationThresholds = calibrationThresholds.slice();
  autoCalibrationPalette = palette.slice();

  calibrationMode = "auto";
  calibrationQuality = assessCalibrationQuality(palette);

  calibrated = true;
  calibrationReminder = false;

  updatePalette();
  updateWorkflowUI();
}
