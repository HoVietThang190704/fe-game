"use client";

import React, { useCallback } from "react";
import { GameBoardComponent } from "./GameBoard";
import { GamePlayerInfo, type PlayerCardData } from "./GamePlayerInfo";
import { PowerButtons } from "./PowerButtons";
import type { GameBoard } from "../../app/(private)/game/game.types";
import { Button } from "@/src/components/ui/button";
import { RotateCcw, Zap } from "lucide-react";

interface GamePlayPhaseProps {
  playerBoard: GameBoard;
  opponentBoard: GameBoard;
  currentPlayer: "you" | "opponent";
  onCellClick: (cellId: string) => void;
  onCellRightClick: (cellId: string, e: React.MouseEvent) => void;
  onReset: () => void;
  playerData?: PlayerCardData;
  opponentData?: PlayerCardData;
  stats?: {
    playerHits: number;
    playerMisses: number;
    opponentHits: number;
    opponentMisses: number;
  };
  onPowerUse?: (boardSide: "left" | "right", powerIndex: 1 | 2 | 3) => void;
}

export const GamePlayPhase: React.FC<GamePlayPhaseProps> = ({
  playerBoard,
  opponentBoard,
  currentPlayer,
  onCellClick,
  onCellRightClick,
  onReset,
  playerData = { username: "You", elo: 1200, winRate: 55 },
  opponentData = { username: "Opponent", elo: 1250, winRate: 58 },
  stats = {
    playerHits: 0,
    playerMisses: 0,
    opponentHits: 0,
    opponentMisses: 0,
  },
  onPowerUse,
}) => {
  const isYourTurn = currentPlayer === "you";

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl sm:text-4xl font-bold text-cyan-300 tracking-wider">
          MATCH
        </h2>
        <div className={`inline-block px-6 py-2 rounded-full border-2 ${
          isYourTurn
            ? "border-green-400/50 bg-green-600/20 text-green-300"
            : "border-amber-400/50 bg-amber-600/20 text-amber-300"
        }`}>
          <span className="font-semibold">
            {isYourTurn ? "YOUR TURN" : "OPPONENT'S TURN"}
          </span>
        </div>
      </div>

      {/* Game Boards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Your board (left) */}
        <div className="space-y-4">
          {/* Your Player Info */}
          <div className="rounded-xl bg-slate-900/50 border border-cyan-500/30 p-4 shadow-[0_0_24px_rgba(34,211,238,0.15)]">
            <GamePlayerInfo player={playerData} />
          </div>

          {/* Your Board (Attack Opponent) */}
          <div className="rounded-xl bg-slate-950/40 border border-sky-200/20 p-4 shadow-[0_0_32px_rgba(0,160,255,0.15)]">
            <GameBoardComponent
              board={opponentBoard}
              title="YOUR BOARD"
              isInteractive={isYourTurn}
              onCellClick={onCellClick}
              onCellRightClick={onCellRightClick}
            />
          </div>

          {/* Power Buttons */}
          <PowerButtons
            onPower1={() => onPowerUse?.("left", 1)}
            onPower2={() => onPowerUse?.("left", 2)}
            onPower3={() => onPowerUse?.("left", 3)}
            disabled={!isYourTurn}
          />

          {/* Your Stats (Attack Results) */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-2 text-center">
              <p className="text-red-300 text-xs uppercase tracking-wider">Hits</p>
              <p className="text-lg font-bold text-red-400">{stats.playerHits}</p>
            </div>
            <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-2 text-center">
              <p className="text-blue-300 text-xs uppercase tracking-wider">Misses</p>
              <p className="text-lg font-bold text-blue-400">{stats.playerMisses}</p>
            </div>
          </div>
        </div>

        {/* Opponent board (right) */}
        <div className="space-y-4">
          {/* Opponent Player Info */}
          <div className="rounded-xl bg-slate-900/50 border border-amber-500/30 p-4 shadow-[0_0_24px_rgba(217,119,6,0.15)]">
            <GamePlayerInfo player={opponentData} isOpponent={true} />
          </div>

          {/* Opponent Board (Your Defense) */}
          <div className="rounded-xl bg-slate-950/40 border border-sky-200/20 p-4 shadow-[0_0_32px_rgba(0,160,255,0.15)]">
            <GameBoardComponent
              board={playerBoard}
              title="OPPONENT'S BOARD"
              isInteractive={false}
            />
          </div>

          {/* Power Buttons */}
          <PowerButtons
            onPower1={() => onPowerUse?.("right", 1)}
            onPower2={() => onPowerUse?.("right", 2)}
            onPower3={() => onPowerUse?.("right", 3)}
            disabled={currentPlayer !== "opponent"}
          />

          {/* Opponent Stats (Defense Results) */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-2 text-center">
              <p className="text-red-300 text-xs uppercase tracking-wider">Hits</p>
              <p className="text-lg font-bold text-red-400">{stats.opponentHits}</p>
            </div>
            <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-2 text-center">
              <p className="text-blue-300 text-xs uppercase tracking-wider">Misses</p>
              <p className="text-lg font-bold text-blue-400">{stats.opponentMisses}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-4 text-center space-y-2">
        <p className="text-cyan-200 text-sm">
          <Zap className="inline w-4 h-4 mr-1" />
          Left-click to reveal | Right-click (or Ctrl+Click) to flag
        </p>
        <p className="text-sky-200/60 text-xs">
          {isYourTurn
            ? "Find opponent's mines - click on the board on the left"
            : "Waiting for opponent to find your mines..."}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center">
        <Button
          onClick={onReset}
          className="gap-2 bg-slate-700/50 hover:bg-slate-600/50 border-slate-500/50"
          variant="outline"
        >
          <RotateCcw className="w-4 h-4" />
          Play Again
        </Button>
      </div>
    </div>
  );
};
