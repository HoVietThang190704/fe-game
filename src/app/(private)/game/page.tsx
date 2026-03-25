"use client";

import React, { useState, useCallback, useEffect, Suspense } from "react";
import { MineSetupPhase } from "@/src/components/game/MineSetupPhase";
import { GamePlayPhase } from "@/src/components/game/GamePlayPhase";
import { GameWrapper } from "@/src/components/game/GameWrapper";
import { useGameSetup, useGameBoard } from "@/src/lib/hooks/useGameBoard";
import { useGameLogic } from "@/src/lib/hooks/useGameLogic";
import { useGame } from "@/src/lib/context/GameContext";
import { createEmptyBoard, placeMines } from "@/src/lib/game/game.utils";
import { Spinner } from "@/src/components/ui/spinner";
import { useSearchParams } from "next/navigation";

function GamePageContent() {
  const searchParams = useSearchParams();
  const matchId = searchParams.get("matchId") || "default-match";
  const userId = searchParams.get("userId") || "default-user";

  const [gamePhase, setGamePhase] = useState<"setup" | "playing">("setup");
  const [currentPlayer, setCurrentPlayer] = useState<"you" | "opponent">("you");
  const { gameState, updateGameState } = useGame();
  const { isConnected, placeBombs, revealCell, toggleFlag } = useGameLogic(matchId, userId);

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
    if (!isConnected) {
      alert("WebSocket not connected. Please wait and try again.");
      return;
    }

    completeSetup();

    // Convert selected cells to coordinates
    const bombCoordinates = Array.from(setupState.selectedCells).map((cellId) => {
      const [x, y] = cellId.split("-").map(Number);
      return { x, y };
    });

    // Place mines on your board based on selection
    yourBoard.placeMinesOnBoard(Array.from(setupState.selectedCells));

    // Send bombs to backend
    placeBombs(bombCoordinates);

    // Update game state
    updateGameState({ status: "PREPARATION", matchId, userId });
    setGamePhase("playing");
  }, [
    completeSetup,
    setupState.selectedCells,
    yourBoard,
    placeBombs,
    isConnected,
    matchId,
    userId,
    updateGameState,
  ]);

  // Handle cell click on opponent board
  const handleOpponentCellClick = useCallback(
    (cellId: string) => {
      if (currentPlayer !== "you" || !isConnected) return;

      const [row, col] = cellId.split("-").map(Number);

      // Send reveal cell to backend
      revealCell(row, col);

      // Optimistic update
      opponentBoard.reveal(cellId);

      // Logic to check result
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
    [currentPlayer, opponentBoard, revealCell, isConnected]
  );

  // Handle right click on opponent board (flag)
  const handleOpponentCellRightClick = useCallback(
    (cellId: string, e: React.MouseEvent) => {
      e.preventDefault();
      if (currentPlayer !== "you" || !isConnected) return;

      const [row, col] = cellId.split("-").map(Number);

      // Send toggle flag to backend
      toggleFlag(row, col);

      // Optimistic update
      opponentBoard.flag(cellId);
    },
    [currentPlayer, opponentBoard, toggleFlag, isConnected]
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

export default function GamePage() {
  return (
    <GameWrapper>
      <Suspense fallback={<Spinner />}>
        <GamePageContent />
      </Suspense>
    </GameWrapper>
  );
}
