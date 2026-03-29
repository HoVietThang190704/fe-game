"use client";

import React, { useCallback } from "react";
import { GameBoardComponent } from "./GameBoard";
import { GamePlayerInfo, type PlayerCardData } from "./GamePlayerInfo";
import { PowerButtons } from "./PowerButtons";
import { HPDisplay } from "./HPDisplay";
import { TurnTimer } from "./TurnTimer";
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
  playerHP?: number;
  opponentHP?: number;
  gameStatus?: "playing" | "won" | "lost";
  onTimeOut?: () => void;
  stats?: {
    playerHits: number;
    playerMisses: number;
    opponentHits: number;
    opponentMisses: number;
  };
  onPowerUse?: (boardSide: "left" | "right", powerIndex: 1 | 2 | 3) => void;
  turnTimeLeft?: number;
  playerShieldAvailable?: boolean;
  opponentShieldAvailable?: boolean;
}

export const GamePlayPhase: React.FC<GamePlayPhaseProps> = ({
  playerBoard,
  opponentBoard,
  currentPlayer,
  onCellClick,
  onCellRightClick,
  onReset,
  playerData = { username: "You" },
  opponentData = { username: "Opponent" },
  playerHP = 3,
  opponentHP = 3,
  gameStatus = "playing",
  onTimeOut,
  stats = {
    playerHits: 0,
    playerMisses: 0,
    opponentHits: 0,
    opponentMisses: 0,
  },
  onPowerUse,
  turnTimeLeft = 60,
  playerShieldAvailable = true,
  opponentShieldAvailable = true,
}) => {
  const isYourTurn = currentPlayer === "you";

  // Show game end modal when game ends
  if (gameStatus !== "playing") {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div
          className={`text-center p-12 rounded-2xl border-4 max-w-2xl ${
            gameStatus === "won"
              ? "bg-green-900/50 border-green-500/70"
              : "bg-red-900/50 border-red-500/70"
          }`}
        >
          <h2 className={`text-7xl font-bold mb-6 ${
            gameStatus === "won" ? "text-green-300" : "text-red-300"
          }`}>
            {gameStatus === "won" ? "🎉 VICTORY!" : "💀 DEFEAT!"}
          </h2>
          <p className={`text-2xl mb-8 ${
            gameStatus === "won" ? "text-green-200" : "text-red-200"
          }`}>
            {gameStatus === "won"
              ? "You found all opponent's mines!"
              : "You ran out of HP!"}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="gap-2 bg-slate-700/50 hover:bg-slate-600/50 border-slate-500/50 px-8 py-3 text-lg"
            variant="outline"
          >
            <RotateCcw className="w-5 h-5" />
            Play Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="text-center flex items-center justify-between gap-4">
        {/* Turn Indicator */}
        <div className={`px-6 py-2 rounded-full border-2 ${
          isYourTurn
            ? "border-green-400/50 bg-green-600/20 text-green-300"
            : "border-amber-400/50 bg-amber-600/20 text-amber-300"
        }`}>
          <span className="font-semibold text-sm">
            {isYourTurn ? "YOUR TURN" : "OPPONENT'S TURN"}
          </span>
        </div>
        <p className="text-sky-200/80 text-sm">Turn time left: {turnTimeLeft}s</p>
      </div>

      {/* Game Boards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Your board (left) */}
        <div className="space-y-4">
          {/* Your Player Info */}
          <div className="rounded-xl bg-slate-900/50 border border-cyan-500/30 p-4 shadow-[0_0_24px_rgba(34,211,238,0.15)]">
            <GamePlayerInfo player={playerData} hp={playerHP} />
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
            shieldAvailable={playerShieldAvailable}
          />
        </div>

        {/* Opponent board (right) */}
        <div className="space-y-4">
          {/* Opponent Player Info */}
          <div className="rounded-xl bg-slate-900/50 border border-amber-500/30 p-4 shadow-[0_0_24px_rgba(217,119,6,0.15)]">
            <GamePlayerInfo player={opponentData} hp={opponentHP} isOpponent={true} />
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
            shieldAvailable={opponentShieldAvailable}
          />
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
    </div>
  );
};
