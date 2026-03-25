export type User = {
    _id: string;
    name: string;
    username: string;
    email: string;
    avatar_url?: string;
    rank: number;
    wins: number;
    losses: number;
    totalMatches: number;
    winRate: number;
    created?: { time: string };
    modified?: { time: string };
}