import { useCallback } from 'react';
import { useGameWebSocket } from './useGameWebSocket';
import { useGame, GameMove } from '@/src/lib/context/GameContext';

interface GameLogicOptions {
  onStartGame?: (payload: any) => void;
  onMoveResult?: (payload: any) => void;
  onTurnSwitched?: (payload: any) => void;
  onTurnTimeout?: (payload: any) => void;
  onGameOver?: (payload: any) => void;
  onReadyUpdate?: (payload: any) => void;
}

export const useGameLogic = (matchId: string, userId: string, options: GameLogicOptions = {}) => {
  const { updateGameState, addMove } = useGame();
  const { send, isConnected } = useGameWebSocket({
    matchId,
    onConnect: () => {
      send('/app/join_room', { matchId });
    },
    onMessage: (message) => {
      if (message.type === 'start_game') {
        options.onStartGame?.(message.payload);
      } else if (message.type === 'move_result') {
        options.onMoveResult?.(message.payload);
      } else if (message.type === 'turn_switched') {
        options.onTurnSwitched?.(message.payload);
      } else if (message.type === 'turn_timeout') {
        options.onTurnTimeout?.(message.payload);
      } else if (message.type === 'game_over') {
        updateGameState({ status: 'FINISHED', winnerId: message.payload?.winnerId });
        options.onGameOver?.(message.payload);
      } else if (message.type === 'ready_update') {
        options.onReadyUpdate?.(message.payload);
      }
    },
  });

  const placeBombs = useCallback(
    (bombs: Array<{ x: number; y: number }>) => {
      const move: GameMove = {
        matchId,
        userId,
        type: 'placeBombs',
        bombs,
        timestamp: Date.now(),
      };

      send('/app/place_bombs', {
        matchId,
        userId,
        bombs,
      });

      addMove(move);
    },
    [matchId, userId, send, addMove]
  );

  const revealCell = useCallback(
    (x: number, y: number) => {
      const move: GameMove = {
        matchId,
        userId,
        type: 'revealCell',
        x,
        y,
        timestamp: Date.now(),
      };

      send('/app/send_move', {
        matchId,
        userId,
        x,
        y,
        action: 'open',
      });

      addMove(move);
    },
    [matchId, userId, send, addMove]
  );

  const toggleFlag = useCallback(
    (x: number, y: number) => {
      const move: GameMove = {
        matchId,
        userId,
        type: 'toggleFlag',
        x,
        y,
        timestamp: Date.now(),
      };

      send('/app/send_move', {
        matchId,
        userId,
        x,
        y,
        action: 'flag',
      });

      addMove(move);
    },
    [matchId, userId, send, addMove]
  );

  return {
    isConnected,
    placeBombs,
    revealCell,
    toggleFlag,
  };
};
