const HISTOGRAM_HEIGHT = 260;
const HISTOGRAM_TICKS = [0, 64, 128, 192, 255];

let histogramDragIndex = null;

document.getElementById("calibrateButton").onclick = () => {
  runCalibration();
};

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

function findFourShades(samples) {
  const histogram = new Array(256).fill(0);

  samples.forEach((value) => {
    histogram[value]++;
  });

  const ranked = histogram
    .map((count, value) => ({ value, count }))
    .sort((a, b) => b.count - a.count);

  // Pick separated brightness peaks as candidate Game Boy shades.
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

function updateCalibrationStatus() {
  calibrationStatus.textContent = getCalibrationStatusSymbol();

  calibrationStatus.classList.toggle("good", calibrationQuality === "good");
  calibrationStatus.classList.toggle(
    "bad",
    calibrationQuality === "bad" || calibrationQuality === "none",
  );
}

function calculateThresholdsFromPalette(values) {
  const sortedDarkToBright = [...values].sort((a, b) => a - b);

  return [
    Math.round((sortedDarkToBright[0] + sortedDarkToBright[1]) / 2),
    Math.round((sortedDarkToBright[1] + sortedDarkToBright[2]) / 2),
    Math.round((sortedDarkToBright[2] + sortedDarkToBright[3]) / 2),
  ];
}

function getCalibrationStatusSymbol() {
  switch (calibrationQuality) {
    case "good":
      return "✓";

    case "ok":
      return "OK";

    case "bad":
      return "!";

    case "manual-thresholds":
      return "Man.";

    default:
      return "✖";
  }
}

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

    const color = getDisplayColor(best);

    output.data[p] = color.r;
    output.data[p + 1] = color.g;
    output.data[p + 2] = color.b;
    output.data[p + 3] = 255;
  }

  ctx.putImageData(output, 0, 0);
}

function redrawQuantizedCanvas() {
  const output = ctx.createImageData(WIDTH, HEIGHT);

  for (let i = 0; i < WIDTH * HEIGHT; i++) {
    const p = i * 4;
    const color = getDisplayColor(quantized[i]);

    output.data[p] = color.r;
    output.data[p + 1] = color.g;
    output.data[p + 2] = color.b;
    output.data[p + 3] = 255;
  }

  ctx.putImageData(output, 0, 0);
}

openCalibrationModalButton.onclick = () => {
  if (!calibrated) {
    runCalibration();
  }

  pendingCalibrationThresholds = calibrationThresholds.slice();

  calibrationModalOverlay.classList.remove("hidden");

  requestAnimationFrame(() => {
    drawCalibrationHistogram();
  });
};

saveCalibrationModalButton.onclick = () => {
  if (!pendingCalibrationThresholds) return;

  calibrationThresholds = pendingCalibrationThresholds.slice();

  calibrationMode = "manual-thresholds";
  calibrationQuality = "manual-thresholds";

  pendingCalibrationThresholds = null;

  updateCalibrationStatus();
  updateWorkflowUI();

  calibrationModalOverlay.classList.add("hidden");
};

discardCalibrationModalButton.onclick = () => {
  pendingCalibrationThresholds = null;

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

  const plotLeft = 32;
  const plotRight = width - 32;
  const plotTop = 38;
  const plotBottom = height - 52;

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

  drawHistogramTickGuides(ctx, plotLeft, plotTop, plotBottom, plotWidth);

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

  drawDetectedShadeMarkers(
    ctx,
    bins,
    max,
    plotLeft,
    plotBottom,
    plotWidth,
    plotHeight,
  );
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

function drawHistogramTickGuides(ctx, plotLeft, plotTop, plotBottom, plotWidth) {
  ctx.save();

  ctx.strokeStyle = "#d8d8d8";
  ctx.lineWidth = 1;

  HISTOGRAM_TICKS.forEach((value) => {
    const x = Math.round(plotLeft + (value / 255) * plotWidth) + 0.5;

    ctx.beginPath();
    ctx.moveTo(x, plotTop);
    ctx.lineTo(x, plotBottom + 22);
    ctx.stroke();
  });

  ctx.restore();
}

function drawHistogramThresholds(
  ctx,
  thresholds,
  plotLeft,
  plotTop,
  plotBottom,
  plotWidth,
) {
  ctx.save();

  ctx.strokeStyle = "#ff4444";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);

  thresholds.forEach((threshold) => {
    const x = Math.round(plotLeft + (threshold / 255) * plotWidth) + 0.5;

    ctx.beginPath();
    ctx.moveTo(x, plotTop);
    ctx.lineTo(x, plotBottom + 22);
    ctx.stroke();

    ctx.setLineDash([]);

    drawThresholdHandle(ctx, x, plotBottom + 14);

    ctx.setLineDash([4, 4]);
  });

  ctx.setLineDash([]);
  ctx.restore();
}

function drawThresholdHandle(ctx, x, y) {
  const width = 20;
  const height = 14;
  const radius = 4;
  const left = x - width / 2;
  const top = y - height / 2;

  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#ff4444";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.roundRect(left, top, width, height, radius);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#ff4444";
  ctx.font = "bold 11px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("⋮⋮", x, y - 0.5);
}

function drawDetectedShadeMarkers(
  ctx,
  bins,
  max,
  plotLeft,
  plotBottom,
  plotWidth,
  plotHeight,
) {
  if (detectedCalibrationShades.length !== 4) return;

  ctx.save();

  ctx.font = "11px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";

  detectedCalibrationShades.forEach((shade) => {
    const x = plotLeft + (shade / 255) * plotWidth;
    const barHeight = (bins[shade] / max) * plotHeight;
    const tipY = Math.max(20, plotBottom - barHeight - 6);
    const topY = tipY - 10;

    ctx.fillStyle = "#000000";
    ctx.fillText(String(shade), x, topY - 3);

    ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(x, tipY);
    ctx.lineTo(x - 6, topY);
    ctx.lineTo(x + 6, topY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });

  ctx.restore();
}

function drawHistogramLabels(ctx, plotLeft, plotBottom, plotWidth) {
  ctx.fillStyle = "#000000";
  ctx.font = "12px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  HISTOGRAM_TICKS.forEach((value) => {
    const x = plotLeft + (value / 255) * plotWidth;
    ctx.fillText(String(value), x, plotBottom + 34);
  });
}

calibrationHistogram.addEventListener("mousedown", (e) => {
  if (!pendingCalibrationThresholds) {
    pendingCalibrationThresholds = calibrationThresholds.slice();
  }

  const value = getHistogramValueFromMouse(e);
  const thresholds = pendingCalibrationThresholds;

  // Drag the nearest threshold, but keep changes pending until Save.
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

  drawCalibrationHistogram();
});

window.addEventListener("mouseup", () => {
  histogramDragIndex = null;
});

function getHistogramValueFromMouse(e) {
  const rect = calibrationHistogram.getBoundingClientRect();

  const plotLeft = 32;
  const plotRight = rect.width - 32;
  const plotWidth = plotRight - plotLeft;

  const x = Math.max(plotLeft, Math.min(plotRight, e.clientX - rect.left));

  return Math.round(((x - plotLeft) / plotWidth) * 255);
}

resetCalibrationAutoButton.onclick = () => {
  pendingCalibrationThresholds = autoCalibrationThresholds.slice();

  selectedThresholdIndex = null;

  drawCalibrationHistogram();
};

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

  drawCalibrationHistogram();
});

function runCalibration() {
  const samples = getFrameBrightnessSamples();

  calibrationSamples = samples.slice();

  const detectedShades = findFourShades(samples);

  detectedCalibrationShades = detectedShades.slice();
  calibrationThresholds = calculateThresholdsFromPalette(detectedShades);
  autoCalibrationThresholds = calibrationThresholds.slice();

  calibrationMode = "auto";
  calibrationQuality = assessCalibrationQuality(detectedShades);

  calibrated = true;

  updateCalibrationStatus();
  updateWorkflowUI();
}
