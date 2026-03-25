import type { DashboardState } from "./dashboard.types";

export const dashboardInitialState: DashboardState = {
  player: {
    username: "Player123",
    elo: 1250,
    winRate: 65.5,
    totalMatches: 142,
    wins: 93,
    losses: 49,
  },
  commands: [
    {
      id: "quick-match",
      title: "Quick Match",
      subtitle: "Find random opponent",
      colorClass: "border-cyan-400",
      iconName: "Play",
    },
    {
      id: "create-room",
      title: "Create Room",
      subtitle: "Play with friends",
      colorClass: "border-blue-400",
      iconName: "PlusCircle",
    },
    {
      id: "join-room",
      title: "Join Room",
      subtitle: "Enter friend\'s room",
      colorClass: "border-lime-400",
      iconName: "Crown",
    },
    {
      id: "match-history",
      title: "Match History",
      subtitle: "View past battles",
      colorClass: "border-amber-400",
      iconName: "Clock",
    },
  ],
  recentMatches: [
    { id: "#G-0452", opponent: "EnemyA", result: "Win", duration: "3m 20s" },
    { id: "#G-0451", opponent: "EnemyB", result: "Loss", duration: "4m 10s" },
    { id: "#G-0450", opponent: "EnemyC", result: "Win", duration: "2m 54s" },
    { id: "#G-0449", opponent: "EnemyD", result: "Win", duration: "3m 42s" },
  ],
};
