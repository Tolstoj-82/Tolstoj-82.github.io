// Calibration
//--------------------------------

document.getElementById("calibrateButton").onclick = () => {
  ctx.drawImage(video, 0, 0, WIDTH, HEIGHT);

  let frame = ctx.getImageData(0, 0, WIDTH, HEIGHT);

  let samples = [];

  for (let i = 0; i < frame.data.length; i += 4) {
    samples.push(
      Math.round((frame.data[i] + frame.data[i + 1] + frame.data[i + 2]) / 3),
    );
  }

  palette = findFourShades(samples);

  calibrated = true;
  updatePalette();
  updateWorkflowUI();
};

// Find 4 histogram peaks
//--------------------------------

function findFourShades(samples) {
  let histogram = new Array(256).fill(0);

  samples.forEach((v) => {
    histogram[v]++;
  });

  let ranked = [];

  for (let i = 0; i < 256; i++) {
    ranked.push({
      value: i,

      count: histogram[i],
    });
  }

  ranked.sort((a, b) => b.count - a.count);

  let peaks = [];

  for (let p of ranked) {
    if (!peaks.some((x) => Math.abs(x - p.value) < 10)) {
      peaks.push(p.value);
    }

    if (peaks.length === 4) break;
  }

  return peaks.sort((a, b) => a - b);
}

function updatePalette() {
  palette.sort((a, b) => b - a);

  for (let i = 0; i < 4; i++) {
    shadeBoxes[i].title = palette[i];

    shadeBoxes[i].style.background =
      `rgb(${palette[i]},${palette[i]},${palette[i]})`;

    shadeBoxes[i].classList.toggle("calibrated", calibrated);
  }

  calibrationStatus.textContent = calibrated ? "✓" : "✖";
  calibrationStatus.classList.toggle("good", calibrated);
  calibrationStatus.classList.toggle("bad", !calibrated);
}

// Quantize
//--------------------------------

function processFrame(frame) {
  let output = ctx.createImageData(WIDTH, HEIGHT);

  for (let i = 0; i < WIDTH * HEIGHT; i++) {
    let p = i * 4;

    let gray = (frame.data[p] + frame.data[p + 1] + frame.data[p + 2]) / 3;

    let best = 0;

    let dist = 9999;

    palette.forEach((v, index) => {
      let d = Math.abs(gray - v);

      if (d < dist) {
        dist = d;

        best = index;
      }
    });

    quantized[i] = best;

    let value = palette[best];

    output.data[p] = value;
    output.data[p + 1] = value;
    output.data[p + 2] = value;
    output.data[p + 3] = 255;
  }

  ctx.putImageData(output, 0, 0);
}
