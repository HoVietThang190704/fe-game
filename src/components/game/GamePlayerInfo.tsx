"use client";

import React from "react";
import { User2 } from "lucide-react";

export interface PlayerCardData {
  username: string;
  avatar_url?: string;
  elo?: number;
  winRate?: number;
}

interface GamePlayerInfoProps {
  player: PlayerCardData;
  isOpponent?: boolean;
}

export const GamePlayerInfo: React.FC<GamePlayerInfoProps> = ({
  player,
  isOpponent = false,
}) => {
  return (
    <div className="flex items-center gap-4">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-[0_0_20px_rgba(34,211,238,0.4)] flex items-center justify-center">
          {player.avatar_url ? (
            <img
              src={player.avatar_url}
              alt={player.username}
              className="h-full w-full object-cover"
            />
          ) : (
            <User2 className="h-8 w-8 sm:h-10 sm:w-10 text-blue-200" />
          )}
        </div>
      </div>

      {/* Player Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg sm:text-xl font-bold text-cyan-300 truncate">
            {player.username}
          </h3>
          {isOpponent && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-amber-600/20 text-amber-300 border border-amber-500/30">
              Opponent
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex gap-3 text-xs sm:text-sm">
          {player.elo && (
            <div className="px-3 py-1 rounded-lg bg-slate-900/40 border border-sky-500/30">
              <span className="text-amber-400 font-bold">⚔️ {player.elo}</span>
              <span className="text-sky-200/60 ml-1">ELO</span>
            </div>
          )}
          {player.winRate !== undefined && (
            <div className="px-3 py-1 rounded-lg bg-slate-900/40 border border-green-500/30">
              <span className="text-lime-400 font-bold">{player.winRate}%</span>
              <span className="text-sky-200/60 ml-1">Win</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
