"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getMatchHistory, MatchHistoryDTO } from "@/lib/api/match";
import {
  MatchHistoryDisplayRecord,
  MatchHistoryPageState,
  ResultFilter,
  SortField,
} from "@/components/dashboard/match-history/match-history.types";
import {
  formatDate,
  formatDuration,
  formatEloChange,
} from "@/components/dashboard/match-history/utils";
import { MatchHistoryTable } from "@/components/dashboard/match-history/MatchHistoryTable";
import { MatchStats } from "@/components/dashboard/match-history/MatchStats";
import { Pagination } from "@/components/dashboard/match-history/Pagination";

export default function MatchHistoryPage() {
  // Initialize accessToken with lazy initialization to avoid setState in effect
  const [accessToken] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  });

  const [state, setState] = useState<MatchHistoryPageState>({
    matches: [],
    isLoading: true,
    error: null,
    currentPage: 0,
    totalPages: 0,
    totalMatches: 0,
    pageSize: 10,
    sortField: "playedAt",
    sortOrder: "desc",
    resultFilter: "all",
  });

  // Format matches with display values
  const formatMatches = (
    matches: MatchHistoryDTO[],
  ): MatchHistoryDisplayRecord[] => {
    return matches.map((match) => ({
      ...match,
      formattedDate: formatDate(match.playedAt),
      formattedDuration: formatDuration(match.duration),
      formattedEloChange: formatEloChange(match.eloChange),
    }));
  };

  // Apply filters and sorting to matches
  const getFilteredAndSortedMatches = useCallback(
    (matches: MatchHistoryDisplayRecord[]): MatchHistoryDisplayRecord[] => {
      let filtered = matches;

      // Apply result filter
      if (state.resultFilter !== "all") {
        filtered = filtered.filter((m) => m.result === state.resultFilter);
      }

      // Apply sorting
      return filtered.sort((a, b) => {
        let aValue: number | string = 0;
        let bValue: number | string = 0;

        switch (state.sortField) {
          case "playedAt":
            aValue = new Date(a.playedAt).getTime();
            bValue = new Date(b.playedAt).getTime();
            break;
          case "duration":
            aValue = a.duration;
            bValue = b.duration;
            break;
          case "eloChange":
            aValue = a.eloChange;
            bValue = b.eloChange;
            break;
        }

        if (state.sortOrder === "asc") {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    },
    [state.sortField, state.sortOrder, state.resultFilter],
  );

  // Fetch on mount and page change
  useEffect(() => {
    if (!accessToken) return;

    // Create and call async function to fetch data
    const loadMatchHistory = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
        const response = await getMatchHistory(
          accessToken,
          state.currentPage,
          state.pageSize,
        );

        const formatted = formatMatches(response.content);

        setState((prev) => ({
          ...prev,
          matches: formatted,
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          totalMatches: response.totalElements,
          isLoading: false,
        }));
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load match history";
        setState((prev) => ({
          ...prev,
          error: errorMessage,
          isLoading: false,
        }));
      }
    };

    loadMatchHistory();
  }, [accessToken, state.currentPage, state.pageSize]);

  // Handle sort change
  const handleSortChange = (field: SortField) => {
    setState((prev) => ({
      ...prev,
      sortField: field,
      sortOrder:
        prev.sortField === field && prev.sortOrder === "desc" ? "asc" : "desc",
    }));
  };

  // Handle filter change
  const handleFilterChange = (filter: ResultFilter) => {
    setState((prev) => ({
      ...prev,
      resultFilter: filter,
      currentPage: 0, // Reset to first page when filter changes
    }));
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setState((prev) => ({
      ...prev,
      currentPage: page,
    }));
  };

  // Get filtered and sorted matches for display
  const displayedMatches = getFilteredAndSortedMatches(state.matches);

  if (!accessToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_15%,_rgba(5,209,255,0.16),_rgba(8,30,54,0.92)_60%)] text-sky-200 p-6 pt-4">
      <div className="mx-auto max-w-[1400px] flex flex-col gap-6">
        {/* Back Button Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-600/30 hover:border-slate-500/50 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-cyan-100">
              Match History
            </h1>
            <p className="text-sm text-slate-400">
              Review your past games and track your improvements
            </p>
          </div>
        </div>

        {/* Stats */}
        <MatchStats
          matches={displayedMatches}
          totalMatches={state.totalMatches}
        />

        {/* Error Message */}
        {state.error && (
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-4">
            <p className="text-rose-300 text-sm">{state.error}</p>
          </div>
        )}

        {/* Table */}
        <MatchHistoryTable
          matches={displayedMatches}
          isLoading={state.isLoading}
          sortField={state.sortField}
          sortOrder={state.sortOrder}
          resultFilter={state.resultFilter}
          onSortChange={handleSortChange}
          onFilterChange={handleFilterChange}
        />

        {/* Pagination */}
        {state.totalPages > 1 && (
          <Pagination
            currentPage={state.currentPage}
            totalPages={state.totalPages}
            onPageChange={handlePageChange}
            isLoading={state.isLoading}
          />
        )}

        {/* Empty State */}
        {!state.isLoading && displayedMatches.length === 0 && !state.error && (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🎮</div>
            <p className="text-slate-400 mb-2">
              {state.matches.length === 0
                ? "No matches yet"
                : "No matches found with current filters"}
            </p>
            <p className="text-xs text-slate-500">
              {state.matches.length === 0
                ? "Play some games to see your match history!"
                : "Try adjusting your filters"}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
