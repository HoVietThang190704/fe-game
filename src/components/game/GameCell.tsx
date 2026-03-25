"use client";

import React from "react";
import type { GameCell } from "../../app/(private)/game/game.types";
import { Search, Flag, Bomb } from "lucide-react";

interface GameCellProps {
  cell: GameCell;
  isInteractive: boolean;
  onLeftClick: () => void;
  onRightClick: (e: React.MouseEvent) => void;
}

export const GameCellComponent: React.FC<GameCellProps> = ({
  cell,
  isInteractive,
  onLeftClick,
  onRightClick,
}) => {
  const getBackgroundColor = () => {
    switch (cell.state) {
      case "revealed":
        if (cell.adjacentMines === 0) {
          return "bg-sky-900/30";
        }
        return "bg-cyan-900/40";
      case "hit":
        return "bg-red-600/60 animate-pulse";
      case "missed":
        return "bg-slate-700/40";
      case "flagged":
        return "bg-amber-700/50";
      case "empty":
        return isInteractive ? "bg-slate-900/50 hover:bg-slate-800/50" : "bg-slate-900/50";
      default:
        return "bg-slate-900/50";
    }
  };

  const getContent = () => {
    if (cell.state === "revealed") {
      if (cell.isMine) return <Bomb className="w-4 h-4 text-red-400" />;
      if (cell.adjacentMines > 0) {
        const colorClass = [
          "",
          "text-blue-300",
          "text-cyan-300",
          "text-green-300",
          "text-yellow-300",
          "text-orange-300",
          "text-red-300",
          "text-red-400",
          "text-red-500",
        ][cell.adjacentMines];
        return (
          <span className={`font-bold text-sm ${colorClass}`}>
            {cell.adjacentMines}
          </span>
        );
      }
      return null;
    }

    if (cell.state === "flagged") {
      return <Flag className="w-4 h-4 text-amber-300" />;
    }

    if (cell.state === "hit") {
      return <Bomb className="w-4 h-4 text-red-200 animate-bounce" />;
    }

    return null;
  };

  return (
    <button
      onClick={onLeftClick}
      onContextMenu={onRightClick}
      disabled={!isInteractive || cell.state === "revealed" || cell.state === "hit"}
      className={`
        w-10 h-10 sm:w-12 sm:h-12
        border border-sky-200/20
        rounded-lg
        transition-all duration-200
        flex items-center justify-center
        font-semibold text-xs
        cursor-pointer
        ${getBackgroundColor()}
        ${
          isInteractive && cell.state !== "revealed" && cell.state !== "hit"
            ? "hover:shadow-[0_0_16px_rgba(0,160,255,0.3)]"
            : ""
        }
        disabled:cursor-not-allowed
      `}
    >
      {getContent()}
    </button>
  );
};
