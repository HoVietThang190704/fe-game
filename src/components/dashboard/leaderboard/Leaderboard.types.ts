export interface Player {
  rank: number;
  avatar: string;
  name: string;
  elo: number;
  winRate: number;
  wins: number;
  losses: number;
  isCurrentUser?: boolean;
}
