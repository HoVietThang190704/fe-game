"use client";

import React, { useState, useCallback } from "react";
import { MineSetupPhase } from "@/src/components/game/MineSetupPhase";
import { GamePlayPhase } from "@/src/components/game/GamePlayPhase";
import { useGameSetup, useGameBoard } from "@/src/lib/hooks/useGameBoard";
import { createEmptyBoard, placeMines } from "@/src/lib/game/game.utils";

export default function GamePage() {
  const [gamePhase, setGamePhase] = useState<"setup" | "playing">("setup");
  const [currentPlayer, setCurrentPlayer] = useState<"you" | "opponent">("you");

  // Setup phase
  const { setupState, toggleCell, clearSelection, completeSetup } =
    useGameSetup(20);

  // Your board (opponent will find mines here)
  const yourBoard = useGameBoard(20);

  // Opponent board (you will find mines here)
  const opponentBoard = useGameBoard(20);

  // Stats
  const [stats, setStats] = useState({
    playerHits: 0,
    playerMisses: 0,
    opponentHits: 0,
    opponentMisses: 0,
  });

  // Handle setup confirmation
  const handleSetupComplete = useCallback(() => {
    completeSetup();

    // Place mines on your board based on selection
    yourBoard.placeMinesOnBoard(Array.from(setupState.selectedCells));

    // Simulate opponent placing mines
    const randomCells = new Set<string>();
    while (randomCells.size < 20) {
      const randomId = `${Math.floor(Math.random() * 10)}-${Math.floor(
        Math.random() * 10
      )}`;
      randomCells.add(randomId);
    }
    opponentBoard.placeMinesOnBoard(Array.from(randomCells));

    setGamePhase("playing");
  }, [completeSetup, setupState.selectedCells, yourBoard, opponentBoard]);

  // Handle cell click on opponent board
  const handleOpponentCellClick = useCallback(
    (cellId: string) => {
      if (currentPlayer !== "you") return;

      opponentBoard.reveal(cellId);

      // Logic to check result
      const [row, col] = cellId.split("-").map(Number);
      const cell = opponentBoard.board.cells[row][col];

      if (cell.state === "hit") {
        setStats((prev) => ({
          ...prev,
          playerHits: prev.playerHits + 1,
        }));
      } else {
        setStats((prev) => ({
          ...prev,
          playerMisses: prev.playerMisses + 1,
        }));
        // Turn ends
        setCurrentPlayer("opponent");
      }
    },
    [currentPlayer, opponentBoard]
  );

  // Handle right click on opponent board (flag)
  const handleOpponentCellRightClick = useCallback(
    (cellId: string, e: React.MouseEvent) => {
      e.preventDefault();
      if (currentPlayer !== "you") return;
      opponentBoard.flag(cellId);
    },
    [currentPlayer, opponentBoard]
  );

  // Handle power usage
  const handlePowerUse = useCallback(
    (boardSide: "left" | "right", powerIndex: 1 | 2 | 3) => {
      console.log(`Power ${powerIndex} used on ${boardSide} board`);
      // TODO: Implement actual power mechanics
    },
    []
  );

  // Handle reset
  const handleReset = useCallback(() => {
    setGamePhase("setup");
    setCurrentPlayer("you");
    yourBoard.reset();
    opponentBoard.reset();
    setStats({
      playerHits: 0,
      playerMisses: 0,
      opponentHits: 0,
      opponentMisses: 0,
    });
  }, [yourBoard, opponentBoard])

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_15%,_rgba(5,209,255,0.16),_rgba(8,30,54,0.92)_60%)] text-sky-200 p-4 sm:p-6">
      <div className="mx-auto max-w-[1600px]">
        {gamePhase === "setup" ? (
          <MineSetupPhase
            board={yourBoard.board}
            setupState={setupState}
            onCellClick={toggleCell}
            onClearSelection={clearSelection}
            onConfirm={handleSetupComplete}
          />
        ) : (
          <GamePlayPhase
            playerBoard={yourBoard.board}
            opponentBoard={opponentBoard.board}
            currentPlayer={currentPlayer}
            onCellClick={handleOpponentCellClick}
            onCellRightClick={handleOpponentCellRightClick}
            onReset={handleReset}
            stats={stats}
            playerData={{
              username: "You",
              avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=you",
              elo: 1250,
              winRate: 58,
            }}
            opponentData={{
              username: "Opponent",
              avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=opponent",
              elo: 1200,
              winRate: 55,
            }}
            onPowerUse={handlePowerUse}
          />
        )}
      </div>
    </main>
  );
}
