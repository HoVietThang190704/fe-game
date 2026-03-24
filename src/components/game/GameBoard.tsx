"use client";

import React from "react";
import type { GameBoard } from "../../app/(private)/game/game.types";
import { GameCellComponent } from "./GameCell";

interface GameBoardProps {
  board: GameBoard;
  title: string;
  isInteractive?: boolean;
  onCellClick?: (cellId: string) => void;
  onCellRightClick?: (cellId: string, e: React.MouseEvent) => void;
  isSetupMode?: boolean;
  selectedCells?: Set<string>;
  onSetupCellClick?: (cellId: string) => void;
}

export const GameBoardComponent: React.FC<GameBoardProps> = ({
  board,
  title,
  isInteractive = false,
  onCellClick,
  onCellRightClick,
  isSetupMode = false,
  selectedCells = new Set(),
  onSetupCellClick,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg sm:text-xl font-bold text-cyan-300 tracking-wider">
          {title}
        </h3>
        <div className="flex gap-3 text-sm">
          <span className="text-sky-200">
            Mines: <span className="font-bold text-amber-300">{board.mineCount}</span>
          </span>
          <span className="text-sky-200">
            Flags: <span className="font-bold text-amber-300">{board.flaggedCount}</span>
          </span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900/40 to-slate-950/60 rounded-xl p-3 sm:p-4 border border-sky-200/20 shadow-[0_0_24px_rgba(0,160,255,0.15)]">
        <div className="flex justify-center overflow-x-auto">
          <div className="inline-grid gap-1 sm:gap-2" style={{ gridTemplateColumns: "repeat(11, minmax(0, 1fr))" }}>
            {/* Corner (empty) */}
            <div className="w-10 h-10 sm:w-12 sm:h-12" />

            {/* Top Headers (A-J) */}
            {Array.from({ length: 10 }, (_, i) => (
              <div
                key={`top-header-${i}`}
                className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center font-bold text-cyan-300 text-xs sm:text-sm"
              >
                {String.fromCharCode(65 + i)}
              </div>
            ))}

            {/* Left Headers (1-10) + Rows */}
            {board.cells.map((row, rowIdx) => (
              <React.Fragment key={`row-${rowIdx}`}>
                {/* Left Header (Row number) */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center font-bold text-cyan-300 text-xs sm:text-sm">
                  {rowIdx + 1}
                </div>

                {/* Cells */}
                {row.map((cell) => {
                  if (isSetupMode) {
                    const isSelected = selectedCells.has(cell.id);
                    return (
                      <button
                        key={cell.id}
                        onClick={() => onSetupCellClick?.(cell.id)}
                        className={`
                          w-10 h-10 sm:w-12 sm:h-12
                          border border-sky-200/20
                          rounded-lg
                          transition-all duration-200
                          ${
                            isSelected
                              ? "bg-red-600/60 shadow-[0_0_16px_rgba(239,68,68,0.5)] border-red-400/50"
                              : "bg-slate-900/50 hover:bg-slate-800/50 hover:shadow-[0_0_16px_rgba(0,160,255,0.3)]"
                          }
                        `}
                      >
                        {isSelected && (
                          <span className="text-red-200 font-bold text-xs">💣</span>
                        )}
                      </button>
                    );
                  }

                  return (
                    <GameCellComponent
                      key={cell.id}
                      cell={cell}
                      isInteractive={isInteractive}
                      onLeftClick={() => onCellClick?.(cell.id)}
                      onRightClick={(e) => {
                        e.preventDefault();
                        onCellRightClick?.(cell.id, e);
                      }}
                    />
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
