"use client";

import React from "react";
import Link from "next/link";
import { Trophy, Bell, Settings2, Zap } from "lucide-react";

export function DashboardNavbar() {
  return (
    <header className="flex w-full items-center justify-between py-2 mb-2">
      {/* Logo Section */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.8)]">
          <Zap className="h-5 w-5 text-white fill-white" />
        </div>
        <h1 className="text-3xl font-black tracking-tighter text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.7)] uppercase italic">
          Minesweeper <span className="not-italic text-cyan-200">PvP</span>
        </h1>
      </div>

      {/* Actions Section */}
      <div className="flex items-center gap-3">
        <button
          className="group flex items-center gap-2 rounded-xl border border-cyan-500/20 bg-slate-900/40 px-5 py-2.5 text-xs font-black text-cyan-400 transition-all hover:bg-cyan-500/10 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:border-cyan-500/40"
          type="button"
        >
          <Trophy className="h-4 w-4 text-amber-500 fill-amber-500/20" />
          <span className="tracking-[0.2em] uppercase">Leaderboard</span>
        </button>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700/30 bg-slate-900/40 text-amber-400 transition-all hover:bg-slate-800 hover:text-amber-300 hover:border-amber-400/30"
          aria-label="Notifications"
          type="button"
        >
          <Bell className="h-5 w-5 fill-amber-400/10" />
        </button>

        <Link
          href="/dashboard/settings"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700/30 bg-slate-900/40 text-slate-400 transition-all hover:bg-slate-800 hover:text-slate-200"
          aria-label="Settings"
        >
          <Settings2 className="h-5 w-5" />
        </Link>
      </div>
    </header>
  );
}

export default DashboardNavbar;
