const container = document.getElementById("container");
const sound = document.getElementById("audio");
let snakeCurrenctPosition = [
  [1, 0],
  [2, 0],
  [3, 0],
  [4, 0],
];
let food = [10, 15];
const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
function changeFood() {
  let temp = [random(0, SIZE), random(0, SIZE)];
  let tempPosition = temp[0] + "_" + temp[1];
  let snakePositions = getSnakePositionsSet(snakeCurrenctPosition);
  if (snakePositions.has(tempPosition)) {
    changeFood();
  } else {
    food = temp;
  }
  console.log(food);
}
const pixels = new Map();
const CELLS = 20;
const SIZE = 25;
let DIRECTION = "DOWN";
const keyCodeMap = {
  38: "UP",
  40: "DOWN",
  37: "LEFT",
  39: "RIGHT",
};
function checkReverseMove(currentMove, prevMove) {
  if (currentMove === "LEFT" && prevMove === "RIGHT") {
    return prevMove;
  }
  if (currentMove === "UP" && prevMove === "DOWN") {
    return prevMove;
  }
  if (currentMove === "DOWN" && prevMove === "RIGHT") {
    prevMove;
  }
  if (currentMove === "RIGHT" && prevMove === "LEFT") {
    return prevMove;
  }
  return currentMove;
}
window.addEventListener("keydown", checkKey);
function checkKey(e) {
  sound.play();
  DIRECTION = checkReverseMove(keyCodeMap[e.keyCode], DIRECTION);
  sound.currentTime = 0;
}
function getSnakePositionsSet(snake) {
  const snakePositions = new Set();
  for (const [x, y] of snake) {
    let position = x + "_" + y;
    snakePositions.add(position);
  }
  return snakePositions;
}
function initializeBoard() {
  for (let i = 0; i < CELLS; i++) {
    for (let j = 0; j < CELLS; j++) {
      const cell = document.createElement("div");
      cell.style.width = `${SIZE}px`;
      cell.style.height = `${SIZE}px`;
      cell.style.position = "absolute";
      cell.style.left = `${SIZE * i}px`;
      cell.style.top = `${SIZE * j}px`;
      cell.style.border = "1px dashed black";
      let position = i + "_" + j;
      pixels.set(position, cell);
      container.appendChild(cell);
    }
  }
}
initializeBoard();
function drawSnake(snake) {
  const snakePositions = getSnakePositionsSet(snake);
  for (let i = 0; i < CELLS; i++) {
    for (let j = 0; j < CELLS; j++) {
      let position = i + "_" + j;
      let foodPosition = food[0] + "_" + food[1];
      let cell = pixels.get(position);
      if (snakePositions.has(position) || foodPosition === position) {
        cell.style.backgroundColor = "black";
      } else {
        cell.style.backgroundColor = "white";
      }
    }
  }
}
drawSnake(snakeCurrenctPosition);

function move([a, b], direction) {
  switch (direction) {
    case "DOWN":
      return [a, b + 1];
    case "UP":
      return [a, b - 1];
    case "RIGHT":
      return [a + 1, b];
    case "LEFT":
      return [a - 1, b];
  }
}
function step() {
  const head = snakeCurrenctPosition[snakeCurrenctPosition.length - 1];
  const nextHead = move(head, DIRECTION);
  if (!checkValidHead(snakeCurrenctPosition, nextHead)) {
    stopGame();
    return;
  }
  snakeCurrenctPosition.push(nextHead);
  // removing the tail
  let nextHeadPosition = nextHead[0] + "_" + nextHead[1];
  let foodPosition = food[0] + "_" + food[1];
  if (foodPosition !== nextHeadPosition) {
    snakeCurrenctPosition = snakeCurrenctPosition.filter(
      (_, index) => index !== 0
    );
  } else {
    changeFood();
  }
  drawSnake(snakeCurrenctPosition);
}
function checkValidHead(snake, [top, left]) {
  if (top < 0 || top >= CELLS) {
    console.log(top, left);

    return false;
  }
  if (left < 0 || left >= CELLS) {
    return false;
  }
  let position = top + "_" + left;
  let snakePositions = getSnakePositionsSet(snake);
  if (snakePositions.has(position)) {
    return false;
  }
  return true;
}
function stopGame() {
  clearInterval(interval);
  container.style.borderColor = "red";
}
const interval = setInterval(step, 100);
