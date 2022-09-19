const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const FPS = 100;

let mouseX = 0;
let mouseY = 0;

let ballX = 400;
let ballXSpeed = 5;
let ballY = 400;
let ballYSpeed = 6;

const paddleHeight = 20;
const paddleWidth = 150;
const paddleDistFromBottom = 60;

const brickRows = 8;
const brickCols = 8;
const brickWidth = 100;
const brickHeight = 20;
const brickGap = 2;

let grid = new Array(brickRows * brickCols).fill(true);
grid = grid.map((brick) => {
  if (Math.random() < 0.5) {
    return (brick = true);
  } else {
    return (brick = false);
  }
});

let paddleX = canvas.width / 2 + paddleWidth / 2;
let paddleY = canvas.height - paddleDistFromBottom;

const updateMousePosition = (e) => {
  let rect = canvas.getBoundingClientRect();
  let root = document.documentElement;

  mouseX = e.clientX - rect.left - root.scrollLeft;
  mouseY = e.clientY - rect.top - root.scrollTop;

  paddleX = mouseX - paddleWidth / 2;
};

document.addEventListener("mousemove", updateMousePosition);

const updateAll = () => {
  drawAll();
  moveAll();
  setTimeout(() => {
    window.requestAnimationFrame(updateAll);
  }, 1000 / FPS);
};

window.onload = () => {
  window.requestAnimationFrame(updateAll);
};

const getArrayIndex = (row, col) => {
  return brickRows * row + col;
};

const drawBricks = () => {
  for (let i = 0; i < brickRows; i++) {
    for (let j = 0; j < brickCols; j++) {
      let arrayIndex = getArrayIndex(i, j);

      if (grid[arrayIndex]) {
        createRect(
          brickWidth * j,
          brickHeight * i,
          brickWidth - brickGap,
          brickHeight - brickGap,
          "blue"
        );
      }
    }
  }
};

const drawAll = () => {
  createRect(0, 0, canvas.width, canvas.height, "black"); // canvas
  createRect(paddleX, paddleY, paddleWidth, paddleHeight, "white"); // paddle
  drawBricks(); // bricks
  createCircle(ballX, ballY, 10, "white"); // ball

  let ballBrickX = Math.floor(ballX / brickWidth);
  let ballBrickY = Math.floor(ballY / brickHeight);
  let indexUnderBall = getArrayIndex(ballBrickY, ballBrickX);

  if (
    ballBrickX >= 0 &&
    ballBrickX < brickRows &&
    ballBrickY >= 0 &&
    ballBrickY < brickCols
  ) {
    if (grid[indexUnderBall]) {
      grid[indexUnderBall] = false;
      ballYSpeed *= -1;
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

  let topEdgeOfPaddleY = canvas.height - paddleDistFromBottom;
  let bottomEdgeOfPaddleY = topEdgeOfPaddleY + paddleHeight;
  let leftEdgeOfPaddleX = paddleX;
  let rightEdgeOfPaddleX = paddleX + paddleWidth;

  if (
    ballY > topEdgeOfPaddleY &&
    ballY < bottomEdgeOfPaddleY &&
    ballX > leftEdgeOfPaddleX &&
    ballX < rightEdgeOfPaddleX
  ) {
    ballYSpeed *= -1;

    let centerOfPaddleX = paddleX + paddleWidth / 2;
    let ballDistFromCenterOfPaddle = ballX - centerOfPaddleX;

    ballXSpeed = ballDistFromCenterOfPaddle * 0.35;
  }
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
