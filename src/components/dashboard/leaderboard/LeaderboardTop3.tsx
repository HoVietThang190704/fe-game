import React from 'react';

interface Player {
  rank: number;
  avatar: string;
  name: string;
  elo: number;
  winRate: number;
  wins: number;
  losses: number;
}

interface LeaderboardTop3Props {
  players: Player[]; 
}

const medalColors = [
  'from-cyan-400 to-cyan-200',
  'from-cyan-300 to-cyan-100',
  'from-cyan-700 to-cyan-400',
];

const borderColors = [
  'border-cyan-200',
  'border-cyan-300',
  'border-cyan-700',
];

const LeaderboardTop3: React.FC<LeaderboardTop3Props> = ({ players }) => {
  // Ensure correct order: 2nd, 1st, 3rd
  const displayOrder = [1, 0, 2];
  return (
    <div className="flex justify-center items-end gap-4 w-full mb-8">
      {displayOrder.map((idx, i) => {
        const p = players[idx];
        if (!p) return <div key={i} className="flex-1" />;
        const isCenter = idx === 0;
        // Dùng key duy nhất: userId nếu có, nếu không thì dùng combination rank+name
        const uniqueKey = `${p.rank}-${p.name}`;
        return (
          <div
            key={uniqueKey}
            className={`flex flex-col items-center flex-1 ${isCenter ? 'scale-110 z-10' : 'scale-100'} transition-transform`}
          >
            <div
              className={`rounded-full border-4 ${borderColors[idx]} bg-gradient-to-b ${medalColors[idx]} w-24 h-24 flex items-center justify-center mb-2 shadow-lg`}
            >
              {!!p.avatar ? (
                <img src={p.avatar} alt={p.name} className="w-20 h-20 rounded-full object-cover" />
              ) : null}
            </div>
            <div className="font-bold text-lg text-cyan-100 mb-1">{p.name}</div>
            <div className="text-cyan-300 font-bold text-xl">{p.elo}</div>
            <div className="flex gap-2 text-sm mt-1">
              <span className="text-cyan-400 font-semibold">{p.wins} Thắng</span>
              <span className="text-cyan-600 font-semibold">{p.losses} Thua</span>
            </div>
            <div className="text-cyan-200 text-xs mt-1">Tỉ lệ thắng: <span className="font-bold">{p.winRate}%</span></div>
          </div>
        );
      })}
    </div>
  );
};

export default LeaderboardTop3;
