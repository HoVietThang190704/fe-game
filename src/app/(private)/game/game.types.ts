// Game board cell types
export type CellState = "empty" | "mine" | "revealed" | "flagged" | "hit" | "missed";

export interface GameCell {
  id: string;
  row: number;
  col: number;
  state: CellState;
  adjacentMines: number;
  isMine: boolean;
}

// Game phases
export type GamePhase = "setup" | "playing" | "finished";

// Game status
export type GameStatus = "waiting" | "your_turn" | "opponent_turn" | "won" | "lost";

// Board representation
export interface GameBoard {
  cells: GameCell[][];
  mineCount: number;
  revealedCount: number;
  flaggedCount: number;
}

// Player info
export interface PlayerInfo {
  id: string;
  username: string;
  avatar: string;
  score: number;
}

// Game state
export interface GameState {
  gameId: string;
  phase: GamePhase;
  status: GameStatus;
  currentPlayer: PlayerInfo;
  opponent: PlayerInfo;
  playerBoard: GameBoard;
  opponentBoard: GameBoard;
  mines: number;
  moveHistory: Array<{
    player: string;
    row: number;
    col: number;
    result: "hit" | "miss";
    timestamp: number;
  }>;
}

// Setup phase state
export interface SetupState {
  selectedCells: Set<string>;
  mineCount: number;
  maxMines: number;
  completed: boolean;
}
