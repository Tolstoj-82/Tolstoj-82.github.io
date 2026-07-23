function playBeep() {
    const beepSound = document.getElementById('beepSound');
    beepSound.currentTime = 0; // Rewind to start
    beepSound.play();
}

function tadaa() {
    const beepSound = document.getElementById('tadaa');
    beepSound.currentTime = 0; // Rewind to start
    beepSound.play();
}

const tetrominoes = {
    I: [
      [[2, 0], [2, 1], [2, 2], [2, 3]],
      [[0, 1], [1, 1], [2, 1], [3, 1]],
      [[2, 0], [2, 1], [2, 2], [2, 3]],
      [[0, 1], [1, 1], [2, 1], [3, 1]]

    ],
    O: [
      [[0, 0], [0, 1], [1, 0], [1, 1]],
      [[0, 0], [0, 1], [1, 0], [1, 1]],
      [[0, 0], [0, 1], [1, 0], [1, 1]],
      [[0, 0], [0, 1], [1, 0], [1, 1]]
    ],
    L: [
      [[1, 0], [1, 1], [1, 2], [0, 2]],
      [[0, 1], [1, 1], [2, 1], [2, 2]],
      [[1, 0], [1, 1], [1, 2], [2, 0]],
      [[0, 0], [0, 1], [1, 1], [2, 1]]
    ],
    J: [
      [[1, 0], [1, 1], [1, 2], [2, 2]],
      [[0, 1], [1, 1], [2, 1], [0, 2]],
      [[0, 0], [1, 0], [1, 1], [1, 2]],
      [[2, 0], [0, 1], [1, 1], [2, 1]]
    ],
    T: [
      [[0, 1], [1, 0], [1, 1], [1, 2]],
      [[0, 1], [1, 1], [2, 1], [1, 2]],
      [[1, 0], [1, 1], [1, 2], [2, 1]],
      [[1, 0], [0, 1], [1, 1], [2, 1]]
    ],
    S: [
      [[1, 0], [1, 1], [0, 1], [0, 2]],
      [[0, 1], [1, 1], [1, 2], [2, 2]],
      [[1, 0], [1, 1], [0, 1], [0, 2]],
      [[0, 1], [1, 1], [1, 2], [2, 2]]
    ],
    Z: [
      [[0, 0], [0, 1], [1, 1], [1, 2]],
      [[1, 1], [0, 2], [1, 2], [2, 1]],
      [[0, 0], [0, 1], [1, 1], [1, 2]],
      [[1, 1], [0, 2], [1, 2], [2, 1]]
    ]
  };


const sequence = ['I', 'O', 'L', 'T', 'S', 'Z', 'I', 'O', 'T', 'L'];
let pieceIndex = 0;
let nextPieceIndex = (pieceIndex + 1) % sequence.length;
let currentPiece = { shape: tetrominoes[sequence[pieceIndex]][0], x: 3, y: 1 };

const gameBoard = Array.from({ length: 15 }, (_, rowIndex) =>
  Array.from({ length: 10 }, (_, colIndex) => {
    // Mark border cells as occupied
    if (rowIndex === 0 || rowIndex === 14 || colIndex === 0 || colIndex === 9) {
      return 'occupied';
    }
    return null;
  })
);

// The placement region is 4x10, centered
const placementRegion = { startRow: 4, endRow: 15, startCol: 3, endCol: 6 };

function drawBoard() {
  const boardDiv = document.getElementById('game-container');
  boardDiv.innerHTML = ''; // Clear previous board

  // Draw the game board
  gameBoard.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const cellDiv = document.createElement('div');
      cellDiv.classList.add('cell');

      // Mark placed or border cells as active
      if (cell !== null) {
        cellDiv.classList.add('active');
      }

      if(
        rowIndex >= placementRegion.startRow &&
        rowIndex <= placementRegion.endRow &&
        colIndex >= placementRegion.startCol &&
        colIndex <= placementRegion.endCol
      ){
        cellDiv.classList.add('dot');
      }

      if (rowIndex === 0) {
        cellDiv.classList.add('aboveField');
      }
      if (rowIndex === placementRegion.endRow - 1) {
        cellDiv.classList.add('belowField');
      }
      if (colIndex === 0) {
        cellDiv.classList.add('left');
      }
      if (colIndex === 9) {
        cellDiv.classList.add('right');
      }

      boardDiv.appendChild(cellDiv);
    });
  });

  // Draw the current piece on the board
  currentPiece.shape.forEach(([y, x]) => {
    const pieceCellIndex = (currentPiece.y + y) * 10 + (currentPiece.x + x);
    if (pieceCellIndex >= 0 && pieceCellIndex < boardDiv.children.length) {
      const pieceCell = boardDiv.children[pieceCellIndex];
      pieceCell.classList.add('active');
    }
  });
}


function drawNextPiece(noPiece = false) {
  const nextPieceBoard = document.getElementById('next-piece-board');
  nextPieceBoard.innerHTML = ''; // Clear previous next piece board

  if (noPiece) {
    return;
  }

  // Draw the next piece
  tetrominoes[sequence[nextPieceIndex]][0].forEach(([y, x]) => {
    const nextCell = document.createElement('div');
    nextCell.classList.add('next-cell');
    nextCell.classList.add('next-active');
    nextCell.style.gridRowStart = y + 1;
    nextCell.style.gridColumnStart = x + 1;
    nextPieceBoard.appendChild(nextCell);
  });
}

function rotatePiece(direction) {
  const currentShapeIndex = tetrominoes[sequence[pieceIndex]].indexOf(currentPiece.shape);
  const newShapeIndex = (currentShapeIndex + direction + tetrominoes[sequence[pieceIndex]].length) % tetrominoes[sequence[pieceIndex]].length;
  currentPiece.shape = tetrominoes[sequence[pieceIndex]][newShapeIndex];
  drawBoard();
}

function movePiece(dx, dy) {
  if (!collision(dx, dy)) {
    currentPiece.x += dx;
    currentPiece.y += dy;
    drawBoard();
  }
}

function collision(dx, dy) {
  return currentPiece.shape.some(([y, x]) => {
    const newX = currentPiece.x + x + dx;
    const newY = currentPiece.y + y + dy;
    return (
      newX < 0 ||
      newX >= 10 ||
      newY < 0 ||
      newY >= 15 ||
      (newY >= 0 && gameBoard[newY][newX] !== null)
    );
  });
}

function canPlacePiece() {
  return currentPiece.shape.every(([y, x]) => {
    const newY = currentPiece.y + y;
    const newX = currentPiece.x + x;
    return (
      newY >= placementRegion.startRow && newY <= placementRegion.endRow &&
      newX >= placementRegion.startCol && newX <= placementRegion.endCol
    );
  });
}

function placePiece() {
  if (canPlacePiece()) {
    currentPiece.shape.forEach(([y, x]) => {
      const newY = currentPiece.y + y;
      const newX = currentPiece.x + x;
      if (newY >= 0 && newY < 15 && newX >= 0 && newX < 10) {
        gameBoard[newY][newX] = 'occupied'; // Mark cell as occupied
      }
    });

    checkWin();

    if (pieceIndex < sequence.length - 1) {
      pieceIndex = nextPieceIndex;
      nextPieceIndex = (pieceIndex + 1) % sequence.length;
      currentPiece = { shape: tetrominoes[sequence[pieceIndex]][0], x: 3, y: 1 };
      if (pieceIndex == sequence.length - 1) drawNextPiece(true);
      else drawNextPiece();
      drawBoard();
      beep(500, 30);
    }
  }
}

function checkWin() {
  const isWin = gameBoard.slice(placementRegion.startRow, placementRegion.endRow + 1).every(row =>
    row.slice(placementRegion.startCol, placementRegion.endCol + 1).every(cell => cell)
  );
  if (isWin) {
    tadaa();
    alert("Congratulations!");

  }
}

function resetGame() {
  gameBoard.forEach(row => row.fill(null));
  pieceIndex = 0;
  nextPieceIndex = (pieceIndex + 1) % sequence.length;
  currentPiece = { shape: tetrominoes[sequence[pieceIndex]][0], x: 3, y: 1 };
  drawNextPiece();
  drawBoard();
  collision(0,0);
}


// Keyboard controls
document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowLeft':
      movePiece(-1, 0);
      playBeep();
      break;
    case 'ArrowRight':
      movePiece(1, 0);
      playBeep();
      break;
    case 'ArrowDown':
      movePiece(0, 1);
      playBeep();
      break;
    case 'ArrowUp':
      movePiece(0, -1);
      playBeep();
      break;
    case 'z':
      rotatePiece(-1); // CCW
      playBeep();
      break;
    case 'x':
      rotatePiece(1); // CW
      playBeep();
      break;
    case 'Enter':
      placePiece();
      playBeep();
      break;
    case 'r':
      resetGame();
      break;
  }
});

// Start the game
drawBoard();
drawNextPiece();
