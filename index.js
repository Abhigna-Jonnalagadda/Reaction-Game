const gameContainer = document.getElementById("gameContainer");
const gridContainer = document.getElementById("gridContainer");
const gameOverContainer = document.getElementById("gameOverContainer");
const gameOver = document.getElementById("gameOver");
const leaderBoardContainer = document.getElementById("leaderBoardContainer");
const leaderboardTable = document.getElementById("leaderboardTable");
const viewLeaderBoard = document.getElementById("viewLeaderBoard");
const scoreElement = document.getElementById("score");
const startElement = document.getElementById("start");
const levelElement = document.getElementById("level");
const zeroPlays = document.getElementById("zeroPlays");
const backToHomePageBtn = document.getElementById("backToHomePageBtn");
const playBtn = document.getElementById("playBtn");
let numberOfSquares = 0;
let score = 0;
const gold = "#FFD700";
const silver = "#C0C0C0";
const bronze = "#CD7F32";

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addSquares() {
  const currentSquareRoot = Math.floor(Math.sqrt(numberOfSquares));
  const nextPerfectSquare = Math.pow(currentSquareRoot + 1, 2);
  const squaresToAdd = nextPerfectSquare - numberOfSquares;

  for (let i = 0; i < squaresToAdd; i++) {
    numberOfSquares++;
    const newSquare = document.createElement("div");
    newSquare.classList.add("square");
    newSquare.id = numberOfSquares;
    gridContainer.appendChild(newSquare);
  }

  const gridSize = Math.sqrt(nextPerfectSquare);
  gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  const squareSize = 300 / gridSize;
  const squares = document.querySelectorAll(".square");
  squares.forEach((square) => {
    square.style.width = `${squareSize}px`;
    square.style.height = `${squareSize}px`;
  });
}

function addNineSquares() {
  for (let i = 0; i < 3; i++) {
    addSquares();
  }
}

function addScore() {
  let scores = JSON.parse(localStorage.getItem("scores")) || [];
  const now = new Date();
  const month = now.toLocaleString("en-US", { month: "short" });
  const day = now.getDate();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  const formattedDateTime = `${month} ${day} - ${hours}:${formattedMinutes}${ampm}`;

  const newScore = { timeStamp: formattedDateTime, score: score };
  scores.push(newScore);
  localStorage.setItem("scores", JSON.stringify(scores));
}

function handleTileClick() {}

let tile,
  tileElement,
  timerId,
  time = 3000;

let level = 1;

function startNewGame() {
  gameOverContainer.classList.add("hide");
  gridContainer.innerHTML = "";
  numberOfSquares = 0;
  addNineSquares();
  score = 0;
  provideNewTileToClick();
}

function provideNewTileToClick() {
  if (score > 0 && score % 10 === 0) {
    addSquares();
    level += 1;
    levelElement.innerHTML = level;
  }
  if (score > 0 && score % 20 === 0) {
    time -= time / level;
  }
  tile = getRandomInt(1, numberOfSquares);
  tileElement = document.getElementById(tile);
  tileElement.classList.add("tile-to-be-clicked");
  tileElement.addEventListener("click", isClicked);
  timerId = setTimeout(notClicked, time);
}

function notClicked() {
  tileElement.removeEventListener("click", isClicked);
  scoreElement.innerHTML = score;
  startElement.innerHTML = "Restart";
  gameOverContainer.classList.remove("hide");
  addScore();
}
function isClicked() {
  clearTimeout(timerId);
  score += 1;
  scoreElement.innerHTML = score;
  tileElement.classList.remove("tile-to-be-clicked");
  tileElement.removeEventListener("click", isClicked);

  provideNewTileToClick();
}

function showLeaderBoard() {
  gameContainer.classList.add("hide");
  leaderBoardContainer.classList.remove("hide");
  const scores = JSON.parse(localStorage.getItem("scores")) || [];
  if (scores.length === 0) {
    zeroPlays.classList.remove("hide");
  } else {
    zeroPlays.classList.add("hide");
    scores.sort((a, b) => b.score - a.score);
    for (let i = 0; i < scores.length; i++) {
      let trElement = document.createElement("tr");
      let tdElement1 = document.createElement("td");
      let tdElement2 = document.createElement("td");
      let tdElement3 = document.createElement("td");
      const iconElement = document.createElement("i");
      iconElement.classList.add("fa-solid", "fa-crown");
      iconElement.style.color = "#964B00";
      tdElement1.appendChild(iconElement);
      tdElement2.textContent = scores[i].timeStamp;
      tdElement3.textContent = scores[i].score;
      trElement.append(tdElement1, tdElement2, tdElement3);
      leaderboardTable.appendChild(trElement);
    }
    const firstTdIcon = document.querySelector(
      "table tr:first-child td:first-child i"
    );
    const secondTdIcon = document.querySelector(
      "table tr:nth-child(2) td:first-child i"
    );
    const thirdTdIcon = document.querySelector(
      "table tr:nth-child(3) td:first-child i"
    );
    firstTdIcon.style.color = gold;
    secondTdIcon.style.color = silver;
    thirdTdIcon.style.color = bronze;
  }
}

addNineSquares();

viewLeaderBoard.addEventListener("click", showLeaderBoard);

startElement.addEventListener("click", startNewGame);

startElement.addEventListener("click", () => {
  gameOver.classList.remove("hide");
});

backToHomePageBtn.addEventListener("click", () => {
  gameContainer.classList.remove("hide");
  leaderBoardContainer.classList.add("hide");
});

playBtn.addEventListener("click", () => {
  gameContainer.classList.remove("hide");
  leaderBoardContainer.classList.add("hide");
  startNewGame();
});
