"use client";

import React, { useState, useCallback, useEffect, Suspense } from "react";
import { MineSetupPhase } from "@/src/components/game/MineSetupPhase";
import { GamePlayPhase } from "@/src/components/game/GamePlayPhase";
import { GameWrapper } from "@/src/components/game/GameWrapper";
import { useGameSetup, useGameBoard } from "@/src/lib/hooks/useGameBoard";
import { useGameLogic } from "@/src/lib/hooks/useGameLogic";
import { useGame } from "@/src/lib/context/GameContext";
import { getActiveMatch } from "@/src/lib/api/match";
import { Spinner } from "@/src/components/ui/spinner";
import { useRouter, useSearchParams } from "next/navigation";

function GamePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const matchId = searchParams.get("matchId") || "default-match";
  const userId = searchParams.get("userId") || "default-user";

  const [gamePhase, setGamePhase] = useState<"setup" | "waiting" | "countdown" | "playing" | "finished">("setup");
  const [currentPlayer, setCurrentPlayer] = useState<"you" | "opponent">("you");
  const [turnTimeLimit, setTurnTimeLimit] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [countdownLeft, setCountdownLeft] = useState(3);
  const [hearts, setHearts] = useState({ you: 3, opponent: 3 });
  const [shields, setShields] = useState({ you: true, opponent: true });
  const [winner, setWinner] = useState<"you" | "opponent" | null>(null);
  const [winnerEloDelta, setWinnerEloDelta] = useState(20);
  const [loserEloDelta, setLoserEloDelta] = useState(-10);
  const [shieldNotice, setShieldNotice] = useState<string | null>(null);
  const { updateGameState } = useGame();

  // Setup phase
  const { setupState, toggleCell, clearSelection, completeSetup } =
    useGameSetup(20);

  // Your board (opponent will find mines here)
  const yourBoard = useGameBoard(20);

  // Opponent board (you will find mines here)
  const opponentBoard = useGameBoard(20);

  const toCellId = useCallback((x: number, y: number) => `${x}-${y}`, []);

  const startPlayCountdown = useCallback(
    (nextCurrentTurnId?: string | null, nextTurnTimeLimit?: number) => {
      const limit = nextTurnTimeLimit ?? 60;
      setTurnTimeLimit(limit);
      setTimeLeft(limit);
      setCountdownLeft(3);
      setCurrentPlayer(nextCurrentTurnId === userId ? "you" : "opponent");
      setGamePhase("countdown");
      setWinner(null);
      updateGameState({
        status: "PLAYING",
        matchId,
        userId,
        currentPlayerId: nextCurrentTurnId ?? undefined,
      });
    },
    [matchId, updateGameState, userId]
  );

  const { isConnected, placeBombs, revealCell, toggleFlag } = useGameLogic(matchId, userId, {
    onStartGame: (payload) => {
      startPlayCountdown(payload?.currentTurn, payload?.turnTimeLimit ?? 60);
    },
    onMoveResult: (payload) => {
      const cellId = toCellId(payload?.x, payload?.y);
      const isYourMove = payload?.userId === userId;
      const targetBoard = isYourMove ? opponentBoard : yourBoard;

      if (payload?.action === "flag") {
        targetBoard.setCellState(cellId, "flagged");
        return;
      }

      if (payload?.result === "bomb") {
        targetBoard.setCellState(cellId, "hit");
      } else if (payload?.result === "shield_blocked") {
        targetBoard.setCellState(cellId, "hit");
      } else if (Array.isArray(payload?.revealedCells) && payload.revealedCells.length > 0) {
        targetBoard.setRevealedCells(payload.revealedCells);
      } else {
        targetBoard.setCellState(cellId, "revealed");
      }

      if (payload?.shieldBlocked) {
        setShields((prev) => ({
          ...prev,
          [isYourMove ? "you" : "opponent"]: false,
        }));
        setShieldNotice(isYourMove
          ? "Energy Shield cua ban da chan 1 qua bom!"
          : "Doi thu da kich hoat Energy Shield va chan 1 qua bom!");
      }

      if (isYourMove) {
        if (payload?.result === "bomb") {
          setHearts((prev) => ({ ...prev, you: payload?.health ?? Math.max(0, prev.you - 1) }));
          setStats((prev) => ({ ...prev, playerHits: prev.playerHits + 1 }));
        } else if (payload?.result === "shield_blocked") {
          setStats((prev) => ({ ...prev, playerHits: prev.playerHits + 1 }));
        } else {
          setStats((prev) => ({ ...prev, playerMisses: prev.playerMisses + 1 }));
        }
      } else {
        if (payload?.result === "bomb") {
          setHearts((prev) => ({ ...prev, opponent: payload?.health ?? Math.max(0, prev.opponent - 1) }));
          setStats((prev) => ({ ...prev, opponentHits: prev.opponentHits + 1 }));
        } else if (payload?.result === "shield_blocked") {
          setStats((prev) => ({ ...prev, opponentHits: prev.opponentHits + 1 }));
        } else {
          setStats((prev) => ({ ...prev, opponentMisses: prev.opponentMisses + 1 }));
        }
      }
    },
    onTurnSwitched: (payload) => {
      setCurrentPlayer(payload?.currentTurn === userId ? "you" : "opponent");
      const limit = payload?.turnTimeLimit ?? turnTimeLimit;
      setTurnTimeLimit(limit);
      setTimeLeft(limit);
    },
    onTurnTimeout: (payload) => {
      const isYou = payload?.userId === userId;
      setHearts((prev) => ({
        ...prev,
        [isYou ? "you" : "opponent"]: payload?.health ?? Math.max(0, prev[isYou ? "you" : "opponent"] - 1),
      }));
    },
    onGameOver: (payload) => {
      const winnerSide = payload?.winnerId === userId ? "you" : "opponent";
      setWinner(winnerSide);
      setWinnerEloDelta(payload?.winnerEloDelta ?? 20);
      setLoserEloDelta(payload?.loserEloDelta ?? -10);
      setGamePhase("finished");
    },
  });

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

    // Visual hint on local setup board
    yourBoard.placeMinesOnBoard(Array.from(setupState.selectedCells));

    // Send bombs to backend
    placeBombs(bombCoordinates);

    // Enter waiting state until both players complete setup and backend emits start_game
    updateGameState({ status: "PREPARATION", matchId, userId });
    setGamePhase("waiting");
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

      // Server decides hit/miss and turn switching
    },
    [currentPlayer, revealCell, isConnected]
  );

  // Handle right click on opponent board (flag)
  const handleOpponentCellRightClick = useCallback(
    (cellId: string, e: React.MouseEvent) => {
      e.preventDefault();
      if (currentPlayer !== "you" || !isConnected) return;

      const [row, col] = cellId.split("-").map(Number);

      // Send toggle flag to backend
      toggleFlag(row, col);

      // Server syncs flag state
    },
    [currentPlayer, toggleFlag, isConnected]
  );

  useEffect(() => {
    if (!shieldNotice) {
      return;
    }

    const timer = window.setTimeout(() => setShieldNotice(null), 2500);
    return () => window.clearTimeout(timer);
  }, [shieldNotice]);

  useEffect(() => {
    if (gamePhase !== "finished") {
      return;
    }

    const timer = window.setTimeout(() => {
      router.push("/dashboard");
    }, 3500);

    return () => window.clearTimeout(timer);
  }, [gamePhase, router]);

  useEffect(() => {
    if (gamePhase !== "countdown") {
      return;
    }

    const timer = window.setInterval(() => {
      setCountdownLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          setGamePhase("playing");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [gamePhase]);

  useEffect(() => {
    if (gamePhase !== "playing") {
      return;
    }
    const timer = window.setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [gamePhase, currentPlayer]);

  useEffect(() => {
    if (gamePhase !== "waiting") {
      return;
    }

    const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!accessToken) {
      return;
    }

    let disposed = false;
    const intervalId = window.setInterval(async () => {
      try {
        const active = await getActiveMatch(accessToken);
        if (disposed || !active || active.matchId !== matchId) {
          return;
        }
        if ((active.status || "").toUpperCase() === "PLAYING") {
          startPlayCountdown(active.currentPlayerId, 60);
        }
      } catch {
        // Keep waiting state and retry on next tick.
      }
    }, 2000);

    return () => {
      disposed = true;
      window.clearInterval(intervalId);
    };
  }, [gamePhase, matchId, startPlayCountdown, userId]);

  // Handle power usage
  const handlePowerUse = useCallback(
    (boardSide: "left" | "right", powerIndex: 1 | 2 | 3) => {
      console.log(`Power ${powerIndex} used on ${boardSide} board`);
      // TODO: Implement actual power mechanics
    },
    []
  );

  const handleTimeOut = useCallback(() => {
    console.log("Turn time out!");
    // The server will handle actual turn switching and health reduction via the onTurnTimeout event
  }, []);

  // Handle reset
  const handleReset = () => {
    setGamePhase("setup");
    setCurrentPlayer("you");
    setTurnTimeLimit(60);
    setTimeLeft(60);
    setCountdownLeft(3);
    setHearts({ you: 3, opponent: 3 });
    setShields({ you: true, opponent: true });
    setWinnerEloDelta(20);
    setLoserEloDelta(-10);
    setShieldNotice(null);
    setWinner(null);
    yourBoard.reset();
    opponentBoard.reset();
    setStats({
      playerHits: 0,
      playerMisses: 0,
      opponentHits: 0,
      opponentMisses: 0,
    });
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_15%,_rgba(5,209,255,0.16),_rgba(8,30,54,0.92)_60%)] text-sky-200 p-4 sm:p-6">
      <div className="mx-auto max-w-[1600px]">
        {shieldNotice && gamePhase === "playing" && (
          <section className="mx-auto mb-4 max-w-2xl rounded-lg border border-sky-300/40 bg-sky-900/35 p-3 text-center text-sm font-semibold text-sky-100">
            {shieldNotice}
          </section>
        )}
        {gamePhase === "setup" ? (
          <MineSetupPhase
            board={yourBoard.board}
            setupState={setupState}
            onCellClick={toggleCell}
            onClearSelection={clearSelection}
            onConfirm={handleSetupComplete}
          />
        ) : gamePhase === "waiting" ? (
          <section className="mx-auto max-w-2xl rounded-xl border border-cyan-400/30 bg-slate-950/45 p-8 text-center">
            <h2 className="text-2xl font-bold text-cyan-200">CHO DOI THU DAT BOM</h2>
            <p className="mt-3 text-sky-100/80">Ban da dat bom xong. Tran dau se bat dau ngay khi doi thu hoan tat.</p>
            <p className="mt-4 text-sm text-sky-300">WebSocket: {isConnected ? "Da ket noi" : "Dang ket noi..."}</p>
          </section>
        ) : gamePhase === "countdown" ? (
          <section className="mx-auto max-w-2xl rounded-xl border border-emerald-400/30 bg-slate-950/45 p-8 text-center">
            <h2 className="text-2xl font-bold text-emerald-200">BAT DAU TRAN SAU</h2>
            <p className="mt-3 text-sky-100/80">Ca hai nguoi choi da dat bom xong. Chuan bi vao tran PVP.</p>
            <div className="mt-6 text-6xl font-extrabold tracking-widest text-emerald-300">{countdownLeft}</div>
          </section>
        ) : gamePhase === "playing" ? (
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
              elo: 1250,
              winRate: 58,
              hearts: hearts.you,
            }}
            opponentData={{
              username: "Opponent",
              avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=opponent",
              elo: 1200,
              winRate: 55,
              hearts: hearts.opponent,
            }}
            playerShieldAvailable={shields.you}
            opponentShieldAvailable={shields.opponent}
            onPowerUse={handlePowerUse}
            turnTimeLeft={timeLeft}
          />
        ) : (
          <section className="mx-auto max-w-2xl rounded-xl border border-cyan-400/30 bg-slate-950/45 p-8 text-center">
            <h2 className="text-2xl font-bold text-cyan-200">TRAN DA KET THUC</h2>
            <p className="mt-3 text-sky-100/80">
              {winner === "you" ? "Ban da chien thang!" : "Ban da thua. Thu lai van may nao!"}
            </p>
            <div className="mt-6 rounded-lg border border-sky-400/20 bg-slate-900/40 p-4 text-left">
              <p className="text-sm text-sky-300">Ket qua ELO</p>
              <p className="mt-2 text-base text-emerald-300">Nguoi thang: +{winnerEloDelta} ELO</p>
              <p className="text-base text-rose-300">Nguoi thua: {loserEloDelta} ELO</p>
              <p className="mt-3 text-xs text-sky-200/70">Dang quay ve dashboard trong vai giay...</p>
            </div>
            <button
              onClick={handleReset}
              className="mt-6 rounded-lg border border-cyan-400/40 bg-cyan-500/20 px-5 py-2 text-cyan-100 hover:bg-cyan-500/30"
            >
              Choi lai
            </button>
          </section>
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
