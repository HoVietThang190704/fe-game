"use client";

import React from "react";
import Image from "next/image";
import {
  MatchHistoryDisplayRecord,
  ResultFilter,
  SortField,
  SortOrder,
} from "./match-history.types";
import { getResultBgColor, getResultColor, getEloColor } from "./utils";

interface MatchHistoryTableProps {
  matches: MatchHistoryDisplayRecord[];
  isLoading: boolean;
  sortField: SortField;
  sortOrder: SortOrder;
  resultFilter: ResultFilter;
  onSortChange: (field: SortField) => void;
  onFilterChange: (filter: ResultFilter) => void;
}

const TableHeader = ({
  label,
  field,
  currentField,
  currentOrder,
  onClick,
}: {
  label: string;
  field: SortField;
  currentField: SortField;
  currentOrder: SortOrder;
  onClick: (field: SortField) => void;
}) => (
  <button
    onClick={() => onClick(field)}
    className="flex items-center gap-1 hover:text-cyan-100 transition-colors"
  >
    <span>{label}</span>
    {currentField === field && (
      <span className="text-xs">{currentOrder === "asc" ? "↑" : "↓"}</span>
    )}
  </button>
);

export function MatchHistoryTable({
  matches,
  isLoading,
  sortField,
  sortOrder,
  resultFilter,
  onSortChange,
  onFilterChange,
}: MatchHistoryTableProps) {
  const resultFilters: Array<{
    value: ResultFilter;
    label: string;
    color: string;
  }> = [
    { value: "all", label: "All", color: "text-slate-100" },
    { value: "win", label: "Wins", color: "text-lime-300" },
    { value: "lose", label: "Losses", color: "text-rose-300" },
    { value: "draw", label: "Draws", color: "text-slate-300" },
  ];

  return (
    <div className="space-y-4">
      {/* Filter Buttons */}
      <div className="flex gap-2">
        {resultFilters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              resultFilter === filter.value
                ? `${filter.color} bg-slate-700 border border-cyan-400/50`
                : `${filter.color} bg-slate-800/50 border border-slate-600/30 hover:border-slate-500/50`
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-violet-300/30 bg-slate-900/55 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800/50 border-b border-violet-300/20">
            <tr className="text-left text-xs uppercase tracking-wide text-cyan-100">
              <th className="px-4 py-3">Match</th>
              <th className="px-4 py-3">Opponent</th>
              <th className="px-4 py-3">
                <TableHeader
                  label="Result"
                  field="playedAt"
                  currentField={sortField}
                  currentOrder={sortOrder}
                  onClick={onSortChange}
                />
              </th>
              <th className="px-4 py-3">
                <TableHeader
                  label="Duration"
                  field="duration"
                  currentField={sortField}
                  currentOrder={sortOrder}
                  onClick={onSortChange}
                />
              </th>
              <th className="px-4 py-3">
                <TableHeader
                  label="ELO Change"
                  field="eloChange"
                  currentField={sortField}
                  currentOrder={sortOrder}
                  onClick={onSortChange}
                />
              </th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {isLoading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-slate-400"
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                    Loading match history...
                  </div>
                </td>
              </tr>
            ) : matches.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-slate-400"
                >
                  No matches found. Start playing to build your history!
                </td>
              </tr>
            ) : (
              matches.map((match) => (
                <tr
                  key={match.matchId}
                  className="hover:bg-slate-800/30 transition-colors text-sm"
                >
                  <td className="px-4 py-3">
                    <p className="font-mono text-sky-100 text-xs">
                      {match.matchId}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {match.opponent.avatarUrl && (
                        <Image
                          src={match.opponent.avatarUrl}
                          alt={match.opponent.displayName}
                          width={24}
                          height={24}
                          className="rounded-full bg-slate-700"
                        />
                      )}
                      <span className="text-slate-100 font-medium">
                        {match.opponent.displayName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold uppercase ${getResultBgColor(match.result)} ${getResultColor(match.result)}`}
                    >
                      {match.result}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {match.formattedDuration}
                  </td>
                  <td
                    className={`px-4 py-3 font-semibold ${getEloColor(match.eloChange)}`}
                  >
                    {match.formattedEloChange}
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs">
                    {match.formattedDate}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
