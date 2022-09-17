const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const FPS = 100;

let ballX = 100;
let ballXSpeed = 5;
let ballY = 100;
let ballYSpeed = 6;

let mouseX = 0;
let mouseY = 0;

const brickRows = 10;
const brickCols = 10;
const brickHeight = 20;
const brickWidth = 100;
const brickGap = 2;
const brickColor = "blue";
let grid = new Array(brickRows * brickCols).fill(true);

grid = grid.map((brick) => {
  if (Math.random() < 0.5) {
    return (brick = true);
  } else {
    return (brick = false);
  }
});

const paddleHeight = 20;
const paddleWidth = 170;
const paddleDistFromBottom = 60;
let paddleX = canvas.width / 2 - paddleWidth / 2;
let paddleY = canvas.height - paddleDistFromBottom;

window.onload = () => {
  window.requestAnimationFrame(updateAll);
};

const updateMousePosition = (e) => {
  let root = document.documentElement;
  let rect = canvas.getBoundingClientRect();

  mouseX = e.clientX - rect.left - root.scrollLeft;
  mouseY = e.clientY - rect.top - root.scrollTop;

  paddleX = mouseX - paddleWidth / 2;
};

const getArrayIndex = (col, row) => {
  return brickCols * row + col;
};

const drawBricks = () => {
  for (let eachRow = 0; eachRow < brickRows; eachRow++) {
    for (let eachCol = 0; eachCol < brickCols; eachCol++) {
      let arrayIndex = getArrayIndex(eachCol, eachRow);

      if (grid[arrayIndex]) {
        createRect(
          brickWidth * eachCol,
          brickHeight * eachRow,
          brickWidth - brickGap,
          brickHeight - brickGap,
          brickColor
        );
      }
    }
  }
};

const inspectTool = (words, x, y, fillColor) => {
  ctx.fillStyle = fillColor;
  ctx.fillText(words, x, y);
};

document.addEventListener("mousemove", updateMousePosition);

const updateAll = () => {
  drawAll();
  moveAll();
  setTimeout(() => {
    window.requestAnimationFrame(updateAll);
  }, 1000 / FPS);
};

const createRect = (x, y, width, height, fillColor) => {
  ctx.fillStyle = fillColor;
  ctx.fillRect(x, y, width, height);
};

const createCircle = (x, y, radius, fillColor) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, true);
  ctx.fillStyle = fillColor;
  ctx.fill();
};

const drawAll = () => {
  createRect(0, 0, canvas.width, canvas.height, "black"); // canvas
  createCircle(ballX, ballY, 10, "white"); // ball
  createRect(paddleX, paddleY, paddleWidth, paddleHeight, "white"); // paddle
  drawBricks();

  inspectTool(
    `${Math.floor(mouseY / brickHeight)},${Math.floor(mouseX / brickWidth)}`,
    mouseX,
    mouseY,
    "yellow"
  );

  let ballBrickX = Math.floor(ballX / brickWidth);
  let ballBrickY = Math.floor(ballY / brickHeight);
  let indexUnderBall = getArrayIndex(ballBrickX, ballBrickY);

  if (
    ballBrickY >= 0 &&
    ballBrickY < brickCols &&
    ballBrickX >= 0 &&
    ballBrickX < brickRows
  ) {
    if (grid[indexUnderBall]) {
      ballYSpeed *= -1;
      grid[indexUnderBall] = false;
    }
  }
};

const moveAll = () => {
  ballX += ballXSpeed;
  ballY += ballYSpeed;

  if (ballY > canvas.height || ballY < 0) {
    ballYSpeed *= -1;
  }

  if (ballX > canvas.width || ballX < 0) {
    ballXSpeed *= -1;
  }

  let topEdgeY = canvas.height - paddleDistFromBottom;
  let bottomEdgeY = topEdgeY + paddleHeight;
  let leftEdgeX = paddleX;
  let rightEdgeX = paddleX + paddleWidth;

  if (
    ballY > topEdgeY &&
    ballY < bottomEdgeY &&
    ballX > leftEdgeX &&
    ballX < rightEdgeX
  ) {
    ballYSpeed *= -1;

    let centerOfPaddleX = paddleX + paddleWidth / 2;
    let ballDistFromCenterOfPaddleX = ballX - centerOfPaddleX;

    ballXSpeed = ballDistFromCenterOfPaddleX * 0.35;
  }
};
