'use client';
import React from 'react';
import LeaderboardTop3 from '@/components/dashboard/leaderboard/LeaderboardTop3';
import LeaderboardTable from '@/components/dashboard/leaderboard/LeaderboardTable';
import LeaderboardUserBar from '@/components/dashboard/leaderboard/LeaderboardUserBar';
import LeaderboardBackButton from '@/components/dashboard/leaderboard/LeaderboardBackButton';

const players = [
  {
    rank: 1,
    avatar: '/images/avatars/mineking.png',
    name: 'MineKing',
    elo: 2150,
    winRate: 78.2,
    wins: 245,
    losses: 68,
  },
  {
    rank: 2,
    avatar: '/images/avatars/bombmaster.png',
    name: 'BombMaster',
    elo: 2048,
    winRate: 69.5,
    wins: 199,
    losses: 87,
  },
  {
    rank: 3,
    avatar: '/images/avatars/prosweeper.png',
    name: 'ProSweeper',
    elo: 1987,
    winRate: 64.9,
    wins: 170,
    losses: 92,
  },
  // ...
  {
    rank: 4,
    avatar: '/images/avatars/speedrunner.png',
    name: 'SpeedRunner',
    elo: 1865,
    winRate: 64.2,
    wins: 156,
    losses: 87,
  },
  {
    rank: 5,
    avatar: '/images/avatars/tacticalgamer.png',
    name: 'TacticalGamer',
    elo: 1789,
    winRate: 60.9,
    wins: 142,
    losses: 91,
  },
  {
    rank: 6,
    avatar: '/images/avatars/minelegend.png',
    name: 'MineLegend',
    elo: 1724,
    winRate: 58.3,
    wins: 134,
    losses: 96,
  },
  {
    rank: 7,
    avatar: '/images/avatars/sweeperpro.png',
    name: 'SweeperPro',
    elo: 1678,
    winRate: 55.1,
    wins: 128,
    losses: 104,
  },
  {
    rank: 8,
    avatar: '/images/avatars/player123.png',
    name: 'Player123 (Bạn)',
    elo: 1285,
    winRate: 65.5,
    wins: 89,
    losses: 47,
    isCurrentUser: true,
  },
  {
    rank: 9,
    avatar: '/images/avatars/bombhunter.png',
    name: 'BombHunter',
    elo: 1245,
    winRate: 57.1,
    wins: 89,
    losses: 67,
  },
  {
    rank: 10,
    avatar: '/images/avatars/quickdmine.png',
    name: 'QuickdMine',
    elo: 1198,
    winRate: 57.6,
    wins: 76,
    losses: 56,
  },
];

const currentUser = players.find((p) => p.isCurrentUser) || players[7];

const LeaderboardPage = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] pb-24">
      <LeaderboardBackButton />
      <div className="max-w-3xl mx-auto pt-8 px-2">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-cyan-300 mb-1 drop-shadow-[0_0_10px_rgba(34,211,238,0.7)] uppercase">
            Bảng xếp hạng
          </h1>
          <div className="text-cyan-100 text-sm opacity-80">Top những người chơi xuất sắc nhất</div>
        </div>
        <LeaderboardTop3 players={players.slice(0, 3)} />
        <LeaderboardTable players={players.slice(3)} currentUserRank={currentUser.rank} />
      </div>
      <LeaderboardUserBar
        rank={currentUser.rank}
        onProfileClick={() => {
          window.location.href = '/dashboard/myprofile';
        }}
      />
    </div>
  );
};

export default LeaderboardPage;