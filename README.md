# Tic-Tac-Toe

A browser-based Tic-Tac-Toe game built with plain HTML, CSS and JavaScript. No frameworks or build step needed.



## Features

- Two modes: **2 Players** or **vs Computer**
- Two difficulty levels: **Easy** (random moves) and **Hard** (unbeatable, uses the Minimax algorithm)
- Score tracking for X, O and draws
- Winning line highlighted
- Responsive layout that works on phones and desktops

## Run it locally

```bash
git clone https://github.com/<your-username>/tic-tac-toe.git
cd tic-tac-toe
```

Then open `index.html` in your browser. That's it.

## Project structure

```
tic-tac-toe/
├── index.html   # page structure
├── style.css    # styling
├── script.js    # game logic and computer player
└── README.md
```

## How the computer works

On Hard difficulty, the computer plays O and uses **Minimax**: it simulates every possible remaining game, assumes both players play perfectly, and picks the move with the best outcome. Depth is factored into the score so it prefers winning sooner and losing later. On a 3x3 board this is fast enough to run instantly, and the result is that you can draw against it but never beat it.

## Ideas for improvement

- Let the player choose X or O
- Add sound effects and a simple animation for wins
- Add a medium difficulty level
- Add a bigger board (4x4 or 5x5)
- Add online multiplayer

## License

MIT
