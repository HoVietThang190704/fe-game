import React from 'react';

interface Player {
  rank: number;
  avatar: string;
  name: string;
  elo: number;
  wins: number;
  losses: number;
  winRate: number;
  isCurrentUser?: boolean;
}

interface LeaderboardTableProps {
  players: Player[];
  currentUserRank: number;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ players, currentUserRank }) => {
  return (
    <div className="overflow-x-auto max-h-96 rounded-lg shadow-md bg-slate-900/60">
      <table className="min-w-full text-sm text-left text-cyan-100">
        <thead className="bg-slate-800 sticky top-0 z-10">
          <tr>
            <th className="px-4 py-2">Hạng</th>
            <th className="px-4 py-2">Người chơi</th>
            <th className="px-4 py-2 text-cyan-300">ELO</th>
            <th className="px-4 py-2 text-cyan-400 hidden md:table-cell">Thắng</th>
            <th className="px-4 py-2 text-cyan-600 hidden md:table-cell">Thua</th>
            <th className="px-4 py-2">Tỉ lệ thắng</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 7 }).map((_, idx) => {
            const p = players[idx];
            const displayRank = idx + 4;
            if (p) {
              const uniqueKey = `${displayRank}-${p.name}`;
              return (
                <tr
                  key={uniqueKey}
                  className={
                    p.isCurrentUser
                      ? 'bg-cyan-900/60 font-bold'
                      : 'hover:bg-slate-800 transition-colors'
                  }
                >
                  <td className="px-4 py-2">#{displayRank}</td>
                  <td className="px-4 py-2 flex items-center gap-2">
                    {!!p.avatar ? (
                      <img src={p.avatar} alt={p.name} className="w-7 h-7 rounded-full object-cover" />
                    ) : null}
                    {p.name}
                  </td>
                  <td className="px-4 py-2 text-cyan-300 font-semibold">{p.elo}</td>
                  <td className="px-4 py-2 text-cyan-400 font-semibold hidden md:table-cell">{p.wins}</td>
                  <td className="px-4 py-2 text-cyan-600 font-semibold hidden md:table-cell">{p.losses}</td>
                  <td className="px-4 py-2">{p.winRate}%</td>
                </tr>
              );
            } else {
              return (
                <tr key={`empty-${displayRank}`} className="text-cyan-700/60">
                  <td className="px-4 py-2">#{displayRank}</td>
                  <td className="px-4 py-2 flex items-center gap-2 italic">—</td>
                  <td className="px-4 py-2">—</td>
                  <td className="px-4 py-2 hidden md:table-cell">—</td>
                  <td className="px-4 py-2 hidden md:table-cell">—</td>
                  <td className="px-4 py-2">—</td>
                </tr>
              );
            }
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;
