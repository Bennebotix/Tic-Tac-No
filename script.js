let gameState = new Array(9).fill("_");
let currentPlayer = 1;
let gameEnded = false;

// tion to check game state
function score(gameState, player) {
  const winningPositions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const hasPlayerWon = winningPositions.some((position) => {
    let happened = position.every(
      (i) => gameState[i] === ["X", "O"][player - 1]
    );
    happened && show(position, player);
    return happened;
  });

  const hasPlayerLost = winningPositions.some((position) => {
    let happened = position.every(
      (i) => gameState[i] === ["X", "O"][player % 2]
    );
    happened && show(position, (player % 2) + 1);
    return happened;
  });

  if (hasPlayerWon) {
    return { state: "finalized", value: 10 };
  } else if (hasPlayerLost) {
    return { state: "finalized", value: -10 };
  } else if (gameState.every((cell) => cell !== "_")) {
    return { state: "finalized", value: -3 };
  }

  return { state: "stillGoing", value: 0 };
}

function show(position, player) {
  gameState.forEach((c, i) => {
    if (position.includes(i))
      document.querySelectorAll(".cell")[i].style.backgroundColor =
        player == 1 ? "green" : "red";
  });
}

function getMoves(gameState, player) {
  return gameState
    .map((cell, index) =>
      cell == "_" ? ["X", "O"][parseInt(player) - 1] + index : false
    )
    .filter((_) => _);
}

function state(gameState, moves) {
  let newGameState = [...gameState];
  moves.forEach((move) => {
    newGameState[move[1]] = move[0];
  });
  return newGameState;
}

function play(moveId) {
  if (!gameEnded && gameState[moveId[1]] == "_") {
    gameState[moveId[1]] = moveId[0];
    drawBoard();
    let result = score(gameState, currentPlayer);

    if (result.state == "finalized") {
      gameEnded = true;
    } else {
      if (moveId[0] == "X") O.play();
      currentPlayer = (currentPlayer % 2) + 1;
    }
  }
}

function drawBoard() {
  const rows = document.querySelectorAll(".row");
  rows.forEach((row) => {
    row.innerHTML = "";
  });
  gameState.forEach((cell, index) => {
    const cellDiv = document.createElement("div");
    cellDiv.classList.add("cell");
    cellDiv.innerHTML = `<span>${cell}</span>`;
    cellDiv.addEventListener("click", () =>
      play(["X", "O"][currentPlayer - 1] + index)
    );
    rows[Math.floor(index / 3)].appendChild(cellDiv);
  });
}

drawBoard();
