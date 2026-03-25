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

  // HP system (3 for each player)
  const [playerHP, setPlayerHP] = useState(3);
  const [opponentHP, setOpponentHP] = useState(3);
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">("playing");

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
        // Hit found a mine - opponent loses 1 HP
        setOpponentHP((prev) => {
          const newHP = prev - 1;
          if (newHP <= 0) {
            setGameStatus("won");
          }
          return newHP;
        });
      } else {
        setStats((prev) => ({
          ...prev,
          playerMisses: prev.playerMisses + 1,
        }));
        // Turn ends on miss
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

  // Handle timer timeout - lose 1 HP
  const handleTimeOut = useCallback(() => {
    setPlayerHP((prev) => {
      const newHP = prev - 1;
      if (newHP <= 0) {
        setGameStatus("lost");
      }
      return newHP;
    });
    // Opponent's turn continues if time runs out
  }, []);

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
    setCurrentPlayer("you");    setPlayerHP(3);
    setOpponentHP(3);
    setGameStatus("playing");    yourBoard.reset();
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
            playerHP={playerHP}
            opponentHP={opponentHP}
            gameStatus={gameStatus}
            onTimeOut={handleTimeOut}
            playerData={{
              username: "You",
              avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=you",
            }}
            opponentData={{
              username: "Opponent",
              avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=opponent",
            }}
            onPowerUse={handlePowerUse}
          />
        )}
      </div>
    </main>
  );
}
