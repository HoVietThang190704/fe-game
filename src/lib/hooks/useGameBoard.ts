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

  const setCellState = useCallback((cellId: string, state: "revealed" | "flagged" | "hit" | "missed") => {
    setBoard((prev) => {
      const [row, col] = cellId.split("-").map(Number);
      if (Number.isNaN(row) || Number.isNaN(col) || !prev.cells[row] || !prev.cells[row][col]) {
        return prev;
      }

      const next = {
        ...prev,
        cells: prev.cells.map((r) => r.map((c) => ({ ...c }))),
      };
      next.cells[row][col].state = state;
      return next;
    });
  }, []);

  const setRevealedCells = useCallback((cells: Array<{ x: number; y: number; adjacentMines: number }>) => {
    setBoard((prev) => {
      if (!Array.isArray(cells) || cells.length === 0) {
        return prev;
      }

      const next = {
        ...prev,
        cells: prev.cells.map((r) => r.map((c) => ({ ...c }))),
      };

      for (const cell of cells) {
        const row = cell?.x;
        const col = cell?.y;
        if (Number.isNaN(row) || Number.isNaN(col) || !next.cells[row] || !next.cells[row][col]) {
          continue;
        }

        next.cells[row][col].state = "revealed";
        next.cells[row][col].adjacentMines = Number.isFinite(cell?.adjacentMines) ? cell.adjacentMines : 0;
      }

      return next;
    });
  }, []);

  return {
    board,
    placeMinesOnBoard,
    reveal,
    flag,
    setCellState,
    setRevealedCells,
    reset,
  };
}
