"use client";

import { Trophy, Home, Play } from "lucide-react";
import { Button } from "@/src/components/ui/button";

interface PlayerResult {
  name: string;
  eloChange: number;
  newRank: number;
  isWinner: boolean;
}

interface MatchStats {
  duration: string; // e.g., "5:32"
  moves: number;
  bombsStepped: number;
}

interface ResultScreenProps {
  playerResult: PlayerResult;
  matchStats: MatchStats;
  onBackHome: () => void;
  onPlayAgain: () => void;
}

export function ResultScreen({
  playerResult,
  matchStats,
  onBackHome,
  onPlayAgain,
}: ResultScreenProps) {
  const { name, eloChange, newRank, isWinner } = playerResult;
  const { duration, moves, bombsStepped } = matchStats;
  //profile-theme min-h-screen bg-background p-4 sm:p-8 text-white font-sans transition-colors duration-500
  return (
    <div className="min-h-screen bg-purple-700 flex items-center justify-center p-4 font-sans text-white">
      <div className="w-full max-w-2xl">
        {/* Main Card */}
        <div className="rounded-3xl border border-red-900/30 bg-gradient-to-br from-purple-800/60 to-purple-900/80 p-8 backdrop-blur-xl shadow-[0_0_60px_rgba(168,85,247,0.3)]">
          {/* Trophy Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full blur-2xl opacity-60" />
              <div className="relative bg-gradient-to-b from-orange-400 to-orange-500 rounded-full p-6 shadow-[0_0_30px_rgba(249,115,22,0.5)]">
                <Trophy size={48} className="text-white drop-shadow-lg" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-center text-4xl font-bold text-white mb-2 tracking-wide">
            Trận đấu kết thúc!
          </h1>
          <p className="text-center text-purple-200 mb-8 text-lg">
            Kết quả trận đấu
          </p>

          {/* Player Cards Container */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Winner Card */}
            {isWinner ? (
              <div className="rounded-2xl border-2 border-emerald-400/60 bg-gradient-to-br from-slate-700/40 to-slate-800/40 p-6 backdrop-blur-sm shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                <div className="text-center">
                  <p className="text-emerald-400 font-bold text-sm mb-4 tracking-widest">
                    CHIẾN THẮNG
                  </p>

                  {/* Avatar */}
                  <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.4)]">
                      <span className="text-2xl">🎮</span>
                    </div>
                  </div>

                  {/* Player Name */}
                  <h3 className="text-white text-xl font-bold mb-2">{name}</h3>

                  {/* ELO Change */}
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-emerald-400 font-bold">
                      +{Math.abs(eloChange)} ELO
                    </span>
                    <span className="text-emerald-400 text-lg">↗</span>
                  </div>

                  {/* Rank */}
                  <p className="text-purple-300 text-sm">Rank mới: {newRank}</p>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-red-400/60 bg-gradient-to-br from-slate-700/40 to-slate-800/40 p-6 backdrop-blur-sm shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                <div className="text-center">
                  <p className="text-red-400 font-bold text-sm mb-4 tracking-widest">
                    THẤT BẠI
                  </p>

                  {/* Avatar */}
                  <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                      <span className="text-2xl">🎯</span>
                    </div>
                  </div>

                  {/* Player Name */}
                  <h3 className="text-white text-xl font-bold mb-2">{name}</h3>

                  {/* ELO Change */}
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-red-400 font-bold">
                      {eloChange} ELO
                    </span>
                    <span className="text-red-400 text-lg">↘</span>
                  </div>

                  {/* Rank */}
                  <p className="text-purple-300 text-sm">Rank mới: {newRank}</p>
                </div>
              </div>
            )}

            {/* Opponent Card - Always show as defeat */}
            <div className="rounded-2xl border-2 border-red-400/60 bg-gradient-to-br from-slate-700/40 to-slate-800/40 p-6 backdrop-blur-sm shadow-[0_0_30px_rgba(239,68,68,0.2)]">
              <div className="text-center">
                <p className="text-red-400 font-bold text-sm mb-4 tracking-widest">
                  THẤT BẠI
                </p>

                {/* Avatar */}
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                    <span className="text-2xl">🎯</span>
                  </div>
                </div>

                {/* Opponent Name */}
                <h3 className="text-white text-xl font-bold mb-2">Opponent</h3>

                {/* ELO Change */}
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-red-400 font-bold">
                    -{Math.abs(eloChange)} ELO
                  </span>
                  <span className="text-red-400 text-lg">↘</span>
                </div>

                {/* Rank */}
                <p className="text-purple-300 text-sm">
                  Rank mới: {newRank - 70}
                </p>
              </div>
            </div>
          </div>

          {/* Match Statistics */}
          <div className="rounded-2xl border border-purple-400/30 bg-purple-500/10 p-6 mb-8 backdrop-blur-sm">
            <h3 className="text-center text-purple-200 font-semibold mb-6 text-lg">
              Thống kê trận đấu
            </h3>
            <div className="grid grid-cols-3 gap-6">
              {/* Duration */}
              <div className="text-center">
                <p className="text-4xl font-bold text-white mb-2">{duration}</p>
                <p className="text-purple-300 text-sm">Thời gian</p>
              </div>

              {/* Moves */}
              <div className="text-center">
                <p className="text-4xl font-bold text-white mb-2">{moves}</p>
                <p className="text-purple-300 text-sm">Nước đi</p>
              </div>

              {/* Bombs */}
              <div className="text-center">
                <p className="text-4xl font-bold text-white mb-2">
                  {bombsStepped}
                </p>
                <p className="text-purple-300 text-sm">Bom dẫm phải</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={onBackHome}
              className="w-full rounded-xl border-2 border-purple-400/40 bg-purple-600/30 px-6 py-4 font-bold text-purple-200 transition-all hover:bg-purple-600/50 hover:border-purple-300/60 hover:text-purple-100 active:scale-95 flex items-center justify-center gap-2"
            >
              <Home size={20} />
              Về sánh chính
            </button>
            <button
              onClick={onPlayAgain}
              className="w-full rounded-xl bg-gradient-to-r from-pink-600 to-pink-500 px-6 py-4 font-bold text-white transition-all hover:from-pink-500 hover:to-pink-400 active:scale-95 shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] flex items-center justify-center gap-2"
            >
              <Play size={20} />
              Chơi ván mới
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
