"use strict";

const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6],            // diagonals
];

const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const modeEl = document.getElementById("mode");
const difficultyEl = document.getElementById("difficulty");
const difficultyLabel = document.getElementById("difficulty-label");
const scoreEls = {
  X: document.getElementById("score-x"),
  O: document.getElementById("score-o"),
  draw: document.getElementById("score-draw"),
};

let board = Array(9).fill(null);
let current = "X";
let gameOver = false;
let scores = { X: 0, O: 0, draw: 0 };

// ---------- Game logic ----------

function getWinner(b) {
  for (const [a, c, d] of WIN_LINES) {
    if (b[a] && b[a] === b[c] && b[a] === b[d]) {
      return { player: b[a], line: [a, c, d] };
    }
  }
  return null;
}

function isFull(b) {
  return b.every((cell) => cell !== null);
}

function emptyCells(b) {
  return b.map((v, i) => (v === null ? i : null)).filter((i) => i !== null);
}

// ---------- Computer player ----------

function randomMove(b) {
  const options = emptyCells(b);
  return options[Math.floor(Math.random() * options.length)];
}

// Minimax: O is the maximizing player, X is the minimizing player.
function minimax(b, isO, depth) {
  const result = getWinner(b);
  if (result) return result.player === "O" ? 10 - depth : depth - 10;
  if (isFull(b)) return 0;

  let best = isO ? -Infinity : Infinity;
  for (const i of emptyCells(b)) {
    b[i] = isO ? "O" : "X";
    const score = minimax(b, !isO, depth + 1);
    b[i] = null;
    best = isO ? Math.max(best, score) : Math.min(best, score);
  }
  return best;
}

function bestMove(b) {
  let bestScore = -Infinity;
  let move = null;
  for (const i of emptyCells(b)) {
    b[i] = "O";
    const score = minimax(b, false, 0);
    b[i] = null;
    if (score > bestScore) {
      bestScore = score;
      move = i;
    }
  }
  return move;
}

function computerTurn() {
  if (gameOver) return;
  const move =
    difficultyEl.value === "hard" ? bestMove(board) : randomMove(board);
  makeMove(move);
}

// ---------- UI ----------

function buildBoard() {
  boardEl.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("button");
    cell.className = "cell";
    cell.setAttribute("role", "gridcell");
    cell.setAttribute("aria-label", `Cell ${i + 1}`);
    cell.addEventListener("click", () => handleClick(i));
    boardEl.appendChild(cell);
  }
}

function render() {
  const cells = boardEl.children;
  board.forEach((value, i) => {
    cells[i].textContent = value ?? "";
    cells[i].className = "cell" + (value ? ` ${value.toLowerCase()}` : "");
    cells[i].disabled = gameOver || value !== null;
  });
}

function setStatus(text) {
  statusEl.textContent = text;
}

function updateScores() {
  scoreEls.X.textContent = scores.X;
  scoreEls.O.textContent = scores.O;
  scoreEls.draw.textContent = scores.draw;
}

function handleClick(i) {
  if (gameOver || board[i]) return;
  // In vs-computer mode the human is always X.
  if (modeEl.value === "cpu" && current === "O") return;
  makeMove(i);
}

function makeMove(i) {
  board[i] = current;
  const result = getWinner(board);

  if (result) {
    gameOver = true;
    scores[result.player]++;
    render();
    result.line.forEach((idx) => boardEl.children[idx].classList.add("win"));
    setStatus(`Player ${result.player} wins!`);
    updateScores();
    return;
  }

  if (isFull(board)) {
    gameOver = true;
    scores.draw++;
    render();
    setStatus("It's a draw!");
    updateScores();
    return;
  }

  current = current === "X" ? "O" : "X";
  render();
  setStatus(`Player ${current}'s turn`);

  if (modeEl.value === "cpu" && current === "O") {
    // Small delay so the computer's move feels natural.
    setTimeout(computerTurn, 400);
  }
}

function newGame() {
  board = Array(9).fill(null);
  current = "X";
  gameOver = false;
  render();
  setStatus("Player X's turn");
}

function resetScores() {
  scores = { X: 0, O: 0, draw: 0 };
  updateScores();
  newGame();
}

// ---------- Events ----------

modeEl.addEventListener("change", () => {
  difficultyLabel.hidden = modeEl.value !== "cpu";
  resetScores();
});
difficultyEl.addEventListener("change", resetScores);
document.getElementById("restart").addEventListener("click", newGame);
document.getElementById("reset-scores").addEventListener("click", resetScores);

buildBoard();
newGame();
updateScores();
