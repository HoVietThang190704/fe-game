import { Player } from '@/components/dashboard/leaderboard/Leaderboard.types';

export interface LeaderboardApiResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    topPlayers: Array<{
      userId: string;
      displayName: string;
      avatar: string;
      rank: number;
      wins: number;
      losses: number;
      winRate: number;
    }>;
    userRank: number;
    userPosition: number;
  };
}

export async function fetchLeaderboard(token?: string): Promise<LeaderboardApiResponse> {
  const url = `${process.env.NEXT_PUBLIC_API_URL || ''}/api/leaderboard`;
  console.log('Leaderboard API URL:', url);
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch leaderboard');
  return res.json();
}

export function mapLeaderboardToPlayers(apiData: LeaderboardApiResponse['data'], currentUserId?: string): Player[] {
  return apiData.topPlayers.map((p) => ({
    rank: p.rank,
    avatar: p.avatar,
    name: p.displayName,
    elo: p.rank, // Nếu backend trả về elo thì sửa lại, tạm dùng rank
    winRate: p.winRate,
    wins: p.wins,
    losses: p.losses,
    isCurrentUser: currentUserId ? p.userId === currentUserId : false,
  }));
}
