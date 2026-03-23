export type CommandCard = {
  id: string;
  title: string;
  subtitle: string;
  colorClass: string;
  iconName: string;
};

export type MatchRecord = {
  id: string;
  opponent: string;
  result: "Win" | "Loss" | "Draw";
  duration: string;
};

export type PlayerStats = {
  username: string;
  elo: number;
  winRate: number;
  totalMatches: number;
  wins: number;
  losses: number;
};

export type DashboardState = {
  player: PlayerStats;
  commands: CommandCard[];
  recentMatches: MatchRecord[];
};
