
'use client';
import React from 'react';

interface LeaderboardUserBarProps {
  rank: number;
  onProfileClick: () => void;
}

const LeaderboardUserBar: React.FC<LeaderboardUserBarProps> = ({ rank, onProfileClick }) => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-cyan-900 to-cyan-700 flex items-center justify-between px-6 py-3 z-20 shadow-lg">
      <div className="text-cyan-100 font-semibold text-base">
        Hạng của bạn: <span className="text-cyan-300 font-bold">#{rank}</span>
      </div>
      <button
        className="bg-cyan-400 hover:bg-cyan-300 text-slate-900 font-bold px-4 py-2 rounded-lg transition-colors shadow"
        onClick={onProfileClick}
      >
        Xem hồ sơ
      </button>
    </div>
  );
};

export default LeaderboardUserBar;
