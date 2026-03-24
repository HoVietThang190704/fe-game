"use client";

import { useState, useCallback } from "react";
import type { GameBoard, SetupState } from "../../app/(private)/game/game.types";
import { createEmptyBoard, placeMines, revealCell, toggleFlag } from "../game/game.utils";

// Hook to manage setup phase
export function useGameSetup(mineCount: number = 20) {
  const [setupState, setSetupState] = useState<SetupState>({
    selectedCells: new Set(),
    mineCount,
    maxMines: mineCount,
    completed: false,
  });

  const toggleCell = useCallback((cellId: string) => {
    setSetupState((prev) => {
      const newSelected = new Set(prev.selectedCells);

      if (newSelected.has(cellId)) {
        newSelected.delete(cellId);
      } else if (newSelected.size < prev.maxMines) {
        newSelected.add(cellId);
      }

      return {
        ...prev,
        selectedCells: newSelected,
      };
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSetupState((prev) => ({
      ...prev,
      selectedCells: new Set(),
    }));
  }, []);

  const completeSetup = useCallback(() => {
    setSetupState((prev) => ({
      ...prev,
      completed: true,
    }));
  }, []);

  return {
    setupState,
    toggleCell,
    clearSelection,
    completeSetup,
  };
}

// Hook to manage game board
export function useGameBoard(mineCount: number = 20) {
  const [board, setBoard] = useState<GameBoard>(() =>
    createEmptyBoard(mineCount)
  );

  const placeMinesOnBoard = useCallback((mineCells: string[]) => {
    setBoard((prev) => placeMines(prev, mineCells));
  }, []);

  const reveal = useCallback((cellId: string) => {
    setBoard((prev) => {
      const { board: newBoard } = revealCell(prev, cellId);
      return newBoard;
    });
  }, []);

  const flag = useCallback((cellId: string) => {
    setBoard((prev) => toggleFlag(prev, cellId));
  }, []);

  const reset = useCallback(() => {
    setBoard(createEmptyBoard(mineCount));
  }, [mineCount]);

  return {
    board,
    placeMinesOnBoard,
    reveal,
    flag,
    reset,
  };
}
