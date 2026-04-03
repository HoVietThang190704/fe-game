"use client";

import React from "react";
import { MatchHistoryDisplayRecord } from "./match-history.types";

interface MatchStatsProps {
  matches: MatchHistoryDisplayRecord[];
  totalMatches: number;
}

export function MatchStats({ matches, totalMatches }: MatchStatsProps) {
  const winCount = matches.filter((m) => m.result === "win").length;
  const lossCount = matches.filter((m) => m.result === "lose").length;
  const drawCount = matches.filter((m) => m.result === "draw").length;
  const winRate =
    totalMatches > 0 ? ((winCount / totalMatches) * 100).toFixed(1) : "0";
  const totalEloChange = matches.reduce((sum, m) => sum + m.eloChange, 0);

  const stats = [
    {
      label: "Total Matches",
      value: totalMatches,
      color: "text-sky-100 bg-sky-500/10",
      icon: "🎮",
    },
    {
      label: "Wins",
      value: winCount,
      color: "text-lime-300 bg-lime-500/10",
      icon: "✓",
    },
    {
      label: "Losses",
      value: lossCount,
      color: "text-rose-300 bg-rose-500/10",
      icon: "✗",
    },
    {
      label: "Draw",
      value: drawCount,
      color: "text-slate-300 bg-slate-500/10",
      icon: "−",
    },
    {
      label: "Win Rate",
      value: `${winRate}%`,
      color: "text-cyan-100 bg-cyan-500/10",
      icon: "%",
    },
    {
      label: "ELO Change",
      value: totalEloChange > 0 ? `+${totalEloChange}` : `${totalEloChange}`,
      color:
        totalEloChange > 0
          ? "text-lime-300 bg-lime-500/10"
          : "text-rose-300 bg-rose-500/10",
      icon: "⬆",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className={`rounded-lg border border-slate-600/30 bg-slate-900/50 p-4 text-center hover:border-slate-500/50 transition-colors`}
        >
          <p className="text-2xl mb-1">{stat.icon}</p>
          <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">
            {stat.label}
          </p>
          <p className={`text-lg md:text-xl font-bold ${stat.color}`}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
