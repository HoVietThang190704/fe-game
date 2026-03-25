"use client";

import React from "react";
import { GameBoardComponent } from "./GameBoard";
import type { GameBoard, SetupState } from "../../app/(private)/game/game.types";
import { Button } from "@/src/components/ui/button";
import { Trash2, CheckCircle } from "lucide-react";

interface MineSetupPhaseProps {
  board: GameBoard;
  setupState: SetupState;
  onCellClick: (cellId: string) => void;
  onClearSelection: () => void;
  onConfirm: () => void;
}

export const MineSetupPhase: React.FC<MineSetupPhaseProps> = ({
  board,
  setupState,
  onCellClick,
  onClearSelection,
  onConfirm,
}) => {
  const isComplete = setupState.selectedCells.size === setupState.maxMines;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl sm:text-4xl font-bold text-cyan-300 tracking-wider">
            PLACE MINES
          </h2>
          <p className="text-sky-200/80">
            Select {setupState.maxMines} cells to place mines for opponent
          </p>
        </div>

        {/* Progress */}
        <div className="bg-slate-950/40 rounded-xl p-4 border border-sky-200/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sky-200 font-semibold">
              Progress: {setupState.selectedCells.size} / {setupState.maxMines}
            </span>
            <span className="text-2xl font-bold text-cyan-300">
              {Math.round((setupState.selectedCells.size / setupState.maxMines) * 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-900/50 rounded-full h-3 overflow-hidden border border-sky-200/20">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-red-500 transition-all duration-300"
              style={{
                width: `${(setupState.selectedCells.size / setupState.maxMines) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Game Board */}
        <GameBoardComponent
          board={board}
          title="YOUR BOARD"
          isSetupMode={true}
          selectedCells={setupState.selectedCells}
          onSetupCellClick={onCellClick}
        />

        {/* Controls */}
        <div className="flex gap-3 justify-center flex-wrap">
          <Button
            onClick={onClearSelection}
            disabled={setupState.selectedCells.size === 0}
            className="gap-2 bg-slate-700/50 hover:bg-slate-600/50 border-slate-500/50"
            variant="outline"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </Button>
          <Button
            onClick={onConfirm}
            disabled={!isComplete}
            className={`gap-2 min-w-40 ${
              isComplete
                ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white"
                : "bg-slate-700/30 text-slate-500 cursor-not-allowed"
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            Complete ({setupState.selectedCells.size === setupState.maxMines ? "✓" : "✗"})
          </Button>
        </div>

        {/* Info */}
        <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-4 text-center">
          <p className="text-cyan-200 text-sm">
            Click to select cells, then press "Complete" to send to opponent
          </p>
        </div>
      </div>
    </div>
  );
};
