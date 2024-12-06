// Scatterplot Setup
const canvas = document.getElementById('scatterplot');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const MARGIN = 50; // Margin for axes

const X_MIN = 0;
const X_MAX = 300;
const Y_MIN = 0;
const Y_MAX = 1000000;

const dotImage = new Image();
const explosion = new Image(); // *
dotImage.src = 'airplane.png';
explosion.src = 'explosion.png'; // *

let points = []; // Start with an empty array of points
let currentSegment = []; // Points for the current game
let segments = []; // List of all segments
let lastNumbers = { score: 0, lines: 0 }; // Track previous numbers
let lastTopouts = []; // Store the last points before reset // *

// Colors for different segments
const colors = ['blue', 'red', 'green', 'orange', 'purple'];
let colorIndex = 0;

// Draw axes
function drawAxes() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  ctx.beginPath();
  // Main axes
  ctx.moveTo(MARGIN, HEIGHT - MARGIN);
  ctx.lineTo(WIDTH - MARGIN, HEIGHT - MARGIN); // X-axis bottom
  ctx.lineTo(WIDTH - MARGIN, MARGIN); // Y-axis right

  // Additional axes on top and left
  ctx.moveTo(MARGIN, HEIGHT - MARGIN);
  ctx.lineTo(MARGIN, MARGIN); // Y-axis left
  ctx.moveTo(MARGIN, MARGIN);
  ctx.lineTo(WIDTH - MARGIN, MARGIN); // X-axis top

  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Add axis labels
  ctx.font = '14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Lines', WIDTH / 2, HEIGHT - 10);
  ctx.save();
  ctx.translate(20, HEIGHT / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Score', 0, 0);
  ctx.restore();
}

// Scale point to canvas coordinates
function scalePoint(lines, score) {
  const x = MARGIN + ((lines - X_MIN) / (X_MAX - X_MIN)) * (WIDTH - 2 * MARGIN);
  const y = HEIGHT - MARGIN - ((score - Y_MIN) / (Y_MAX - Y_MIN)) * (HEIGHT - 2 * MARGIN);
  return { x, y };
}

// Draw all segments and the current segment
function drawPoints() {
  drawAxes();

  segments.forEach((segment, index) => {
    ctx.beginPath();
    ctx.strokeStyle = colors[index % colors.length];
    ctx.lineWidth = 1;
    for (let i = 1; i < segment.length; i++) {
      ctx.moveTo(segment[i - 1].x, segment[i - 1].y);
      ctx.lineTo(segment[i].x, segment[i].y);
    }
    ctx.stroke();
  });

  // Draw the current segment
  if (currentSegment.length > 1) {
    ctx.beginPath();
    ctx.strokeStyle = colors[colorIndex % colors.length];
    ctx.lineWidth = 1;
    for (let i = 1; i < currentSegment.length; i++) {
      ctx.moveTo(currentSegment[i - 1].x, currentSegment[i - 1].y);
      ctx.lineTo(currentSegment[i].x, currentSegment[i].y);
    }
    ctx.stroke();
  }

  // Draw the explosion image at last topouts
  lastTopouts.forEach((point) => {
    explosion.onload = () => {
      ctx.drawImage(explosion, point.x - explosion.width / 2, point.y - explosion.height / 2);
    };
    if (explosion.complete) {
      ctx.drawImage(explosion, point.x - explosion.width / 2, point.y - explosion.height / 2);
    }
  });

  // Draw the current point image
  if (currentSegment.length > 0) {
    const currentPoint = currentSegment[currentSegment.length - 1];
    dotImage.onload = () => {
      ctx.drawImage(dotImage, currentPoint.x - dotImage.width / 2, currentPoint.y - dotImage.height / 2);
    };
    if (dotImage.complete) {
      ctx.drawImage(dotImage, currentPoint.x - dotImage.width / 2, currentPoint.y - dotImage.height / 2);
    }
  }
}

// Update point based on score and level divs
function updatePoint() {
  const scoreDiv = document.getElementById('score');
  const linesDiv = document.getElementById('lines');

  let score = 0;
  let lines = 0;

  // Extract numbers from <p> elements inside scoreDiv
  const pElements = scoreDiv.getElementsByTagName('p');
  for (let p of pElements) {
    const textContent = p.textContent.trim();
    if (textContent.includes('Score')) {
      score = parseInt(textContent.replace(/[^\d]/g, ''), 10);
    } else if (textContent.includes('Lines')) {
      lines = parseInt(textContent.replace(/[^\d]/g, ''), 10);
    }
  }

  // Detect game reset
  if (lines === 0 && score === 0 && (lastNumbers.lines !== 0 || lastNumbers.score !== 0)) {
    // Save the current segment and start a new one
    if (currentSegment.length > 0) {
      const lastPoint = currentSegment[currentSegment.length - 1]; // Track last point before reset
      lastTopouts.push(lastPoint); // Save the last point before the reset // *
      segments.push(currentSegment);
      currentSegment = [];
      colorIndex++;
    }
  }

  // Update only if numbers are different from the previous ones
  if (lines !== lastNumbers.lines || score !== lastNumbers.score) {
    lastNumbers = { score, lines };

    const scaledPoint = scalePoint(lines, score);
    currentSegment.push(scaledPoint);
    drawPoints();
  }
}

// Monitor changes to score and level divs
const observer = new MutationObserver(updatePoint);
observer.observe(document.getElementById('score'), { childList: true, subtree: true });
observer.observe(document.getElementById('lines'), { childList: true, subtree: true });

// Initial render
drawAxes();
drawPoints();