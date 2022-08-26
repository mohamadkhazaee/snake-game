const container = document.getElementById("container");
const sound = document.getElementById("audio");
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
  console.log(currentMove, prevMove);
  return currentMove;
}
window.addEventListener("keydown", checkKey);
function checkKey(e) {
  sound.play();
  DIRECTION = checkReverseMove(keyCodeMap[e.keyCode], DIRECTION);
  sound.currentTime = 0;
}

let snakeCurrenctPosition = [
  [1, 0],
  [2, 0],
  [3, 0],
  [4, 0],
];
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
  const snakePositions = new Set();
  for (const [x, y] of snake) {
    let position = x + "_" + y;
    snakePositions.add(position);
  }
  for (let i = 0; i < CELLS; i++) {
    for (let j = 0; j < CELLS; j++) {
      let position = i + "_" + j;
      let cell = pixels.get(position);
      if (snakePositions.has(position)) {
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
  // removing the tail
  snakeCurrenctPosition = snakeCurrenctPosition.filter(
    (_, index) => index !== 0
  );
  const head = snakeCurrenctPosition[snakeCurrenctPosition.length - 1];
  const nextHead = move(head, DIRECTION);
  snakeCurrenctPosition.push(nextHead);
  drawSnake(snakeCurrenctPosition);
}
setInterval(step, 300);
