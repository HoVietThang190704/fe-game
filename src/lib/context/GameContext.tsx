import { createContext, useContext, useCallback, useState, ReactNode } from 'react';

export interface GameMove {
  matchId: string;
  userId: string;
  type: 'revealCell' | 'toggleFlag' | 'placeBombs';
  x?: number;
  y?: number;
  bombs?: Array<{ x: number; y: number }>;
  timestamp: number;
}

export interface GameState {
  matchId: string;
  userId: string;
  status: 'PREPARATION' | 'PLAYING' | 'FINISHED';
  currentPlayerId: string;
  winnerId?: string;
  gameBoard: Record<string, any>;
  moves: GameMove[];
  error?: string;
}

interface GameContextType {
  gameState: GameState | null;
  setGameState: (state: GameState) => void;
  updateGameState: (partial: Partial<GameState>) => void;
  addMove: (move: GameMove) => void;
  clearGameState: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [gameState, setGameState] = useState<GameState | null>(null);

  const updateGameState = useCallback((partial: Partial<GameState>) => {
    setGameState((prev) => (prev ? { ...prev, ...partial } : null));
  }, []);

  const addMove = useCallback((move: GameMove) => {
    setGameState((prev) =>
      prev ? { ...prev, moves: [...prev.moves, move] } : null
    );
  }, []);

  const clearGameState = useCallback(() => {
    setGameState(null);
  }, []);

  return (
    <GameContext.Provider
      value={{
        gameState,
        setGameState,
        updateGameState,
        addMove,
        clearGameState,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};
