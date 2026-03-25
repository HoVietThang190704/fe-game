import { useCallback, useState, useEffect } from 'react';
import { useGameWebSocket } from './useGameWebSocket';
import { useGame, GameMove } from '@/src/lib/context/GameContext';

export const useGameLogic = (matchId: string, userId: string) => {
  const { gameState, updateGameState, addMove } = useGame();
  const { send, isConnected } = useGameWebSocket({
    onMessage: (message) => {
      if (message.type === 'GAME_START') {
        updateGameState({ status: 'PLAYING', gameBoard: message.payload });
      } else if (message.type === 'FLAG_TOGGLED') {
        updateGameState({ gameBoard: message.payload });
      } else if (message.type === 'MOVE_RESULT') {
        updateGameState({ gameBoard: message.payload });
      } else if (message.type === 'GAME_OVER') {
        updateGameState({ status: 'FINISHED', winnerId: message.payload.winnerId });
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

      send('/app/match.placeBombs', {
        matchId,
        userId,
        bombs: bombs.map((b) => ({ x: b.x, y: b.y })),
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

      send('/app/match.revealCell', {
        matchId,
        userId,
        x,
        y,
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

      send('/app/match.toggleFlag', {
        matchId,
        userId,
        x,
        y,
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
