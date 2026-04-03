import { MatchHistoryDTO } from "@/lib/api/match";

export type MatchHistoryDisplayRecord = MatchHistoryDTO & {
  formattedDate: string;
  formattedDuration: string;
  formattedEloChange: string;
};

export type SortField = "playedAt" | "duration" | "eloChange";
export type SortOrder = "asc" | "desc";
export type ResultFilter = "all" | "win" | "lose" | "draw";

export interface MatchHistoryPageState {
  matches: MatchHistoryDisplayRecord[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalMatches: number;
  pageSize: number;
  sortField: SortField;
  sortOrder: SortOrder;
  resultFilter: ResultFilter;
}
