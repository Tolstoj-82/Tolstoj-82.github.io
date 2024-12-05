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
dotImage.src = 'airplane.png';

let points = [{ x: MARGIN, y: HEIGHT - MARGIN }]; // Start at P0 = [0,0]

let lastNumbers = { score: 0, lines: 0 }; // Track previous numbers

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

// Draw all points and connecting lines
function drawPoints() {
  drawAxes();

  ctx.beginPath();
  ctx.strokeStyle = 'blue';
  ctx.lineWidth = 1;
  for (let i = 1; i < points.length; i++) {
    ctx.moveTo(points[i - 1].x, points[i - 1].y);
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();

  // Draw the current point image
  const currentPoint = points[points.length - 1];
  dotImage.onload = () => {
    ctx.drawImage(dotImage, currentPoint.x - dotImage.width / 2, currentPoint.y - dotImage.height / 2);
  };
  if (dotImage.complete) {
    ctx.drawImage(dotImage, currentPoint.x - dotImage.width / 2, currentPoint.y - dotImage.height / 2);
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
      // Extract the number from the Score <p> element
      score = parseInt(textContent.replace(/[^\d]/g, ''), 10);
    } else if (textContent.includes('Lines')) {
      // Extract the number from the Lines <p> element
      lines = parseInt(textContent.replace(/[^\d]/g, ''), 10);
    }
  }
  // Update only if numbers are different from the previous ones
  if (lines !== lastNumbers.lines || score !== lastNumbers.score) {
    lastNumbers = { score, lines };

    const scaledPoint = scalePoint(lines, score);
    points.push(scaledPoint);
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
