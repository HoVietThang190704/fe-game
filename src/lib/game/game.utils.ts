import type { GameCell, GameBoard } from "../../app/(private)/game/game.types";

const ROWS = 10;
const COLS = 10;
const BOARD_SIZE = 100;

// Create cell ID based on row, col
export function getCellId(row: number, col: number): string {
  return `${row}-${col}`;
}

// Parse cell ID to get row, col
export function parseCellId(id: string): [number, number] {
  const [row, col] = id.split("-").map(Number);
  return [row, col];
}

// Create empty board
export function createEmptyBoard(mineCount: number): GameBoard {
  const cells: GameCell[][] = [];
  
  for (let row = 0; row < ROWS; row++) {
    cells[row] = [];
    for (let col = 0; col < COLS; col++) {
      cells[row][col] = {
        id: getCellId(row, col),
        row,
        col,
        state: "empty",
        adjacentMines: 0,
        isMine: false,
      };
    }
  }

  return {
    cells,
    mineCount,
    revealedCount: 0,
    flaggedCount: 0,
  };
}

// Place mines at selected positions
export function placeMines(board: GameBoard, mineCells: string[]): GameBoard {
  const newBoard = JSON.parse(JSON.stringify(board)) as GameBoard;

  mineCells.forEach((cellId) => {
    const [row, col] = parseCellId(cellId);
    if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
      newBoard.cells[row][col].isMine = true;
    }
  });

  // Calculate adjacent mines for all cells
  calculateAdjacentMines(newBoard);

  return newBoard;
}

// Calculate number of mines around each cell
function calculateAdjacentMines(board: GameBoard): void {
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1],
  ];

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (!board.cells[row][col].isMine) {
        let count = 0;
        for (const [dr, dc] of directions) {
          const newRow = row + dr;
          const newCol = col + dc;
          if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS) {
            if (board.cells[newRow][newCol].isMine) {
              count++;
            }
          }
        }
        board.cells[row][col].adjacentMines = count;
      }
    }
  }
}

// Reveal cell (click on opponent's board)
export function revealCell(board: GameBoard, cellId: string): { board: GameBoard; result: "hit" | "miss" } {
  const [row, col] = parseCellId(cellId);
  const newBoard = JSON.parse(JSON.stringify(board)) as GameBoard;
  const cell = newBoard.cells[row][col];

  if (cell.state === "revealed" || cell.state === "flagged") {
    return { board: newBoard, result: "miss" };
  }

  cell.state = "revealed";

  if (cell.isMine) {
    cell.state = "hit";
    return { board: newBoard, result: "hit" };
  }

  // If adjacent mines = 0, reveal surrounding
  if (cell.adjacentMines === 0) {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1],
    ];

    const toReveal = [[row, col]];
    const revealed = new Set<string>();

    while (toReveal.length > 0) {
      const [r, c] = toReveal.shift()!;
      const id = getCellId(r, c);

      if (revealed.has(id)) continue;
      revealed.add(id);

      const current = newBoard.cells[r][c];
      if (current.state !== "revealed") {
        current.state = "revealed";
      }

      if (current.adjacentMines === 0) {
        for (const [dr, dc] of directions) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
            const neighborId = getCellId(nr, nc);
            if (!revealed.has(neighborId)) {
              toReveal.push([nr, nc]);
            }
          }
        }
      }
    }
  }

  newBoard.revealedCount++;
  return { board: newBoard, result: "miss" };
}

// Toggle flag on cell
export function toggleFlag(board: GameBoard, cellId: string): GameBoard {
  const [row, col] = parseCellId(cellId);
  const newBoard = JSON.parse(JSON.stringify(board)) as GameBoard;
  const cell = newBoard.cells[row][col];

  if (cell.state === "revealed" || cell.state === "hit") {
    return newBoard;
  }

  if (cell.state === "flagged") {
    cell.state = "empty";
    newBoard.flaggedCount--;
  } else if (newBoard.flaggedCount < newBoard.mineCount) {
    cell.state = "flagged";
    newBoard.flaggedCount++;
  }

  return newBoard;
}

// Check if game won (all mines revealed)
export function checkWinCondition(board: GameBoard): boolean {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = board.cells[row][col];
      if (cell.isMine && cell.state !== "hit") {
        return false;
      }
    }
  }
  return true;
}
