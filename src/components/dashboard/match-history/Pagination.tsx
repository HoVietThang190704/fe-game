"use client";

import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
}: PaginationProps) {
  const pages = [];
  const startPage = Math.max(0, currentPage - 2);
  const endPage = Math.min(totalPages - 1, currentPage + 2);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(Math.max(0, currentPage - 1))}
        disabled={currentPage === 0 || isLoading}
        className="px-3 py-1.5 rounded-lg border border-slate-600/30 hover:border-slate-500/50 disabled:opacity-50 disabled:cursor-not-allowed text-sm text-slate-400 hover:text-slate-100 transition-colors"
      >
        ← Previous
      </button>

      <div className="flex gap-1">
        {startPage > 0 && (
          <>
            <button
              onClick={() => onPageChange(0)}
              disabled={isLoading}
              className="w-8 h-8 rounded-lg border border-slate-600/30 hover:border-slate-500/50 text-sm text-slate-400 hover:text-slate-100 transition-colors"
            >
              1
            </button>
            {startPage > 1 && <span className="text-slate-500">...</span>}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            disabled={isLoading}
            className={`w-8 h-8 rounded-lg border text-sm font-medium transition-colors ${
              currentPage === page
                ? "bg-cyan-500 border-cyan-400 text-slate-900"
                : "border-slate-600/30 hover:border-slate-500/50 text-slate-400 hover:text-slate-100"
            }`}
          >
            {page + 1}
          </button>
        ))}

        {endPage < totalPages - 1 && (
          <>
            {endPage < totalPages - 2 && (
              <span className="text-slate-500">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages - 1)}
              disabled={isLoading}
              className="w-8 h-8 rounded-lg border border-slate-600/30 hover:border-slate-500/50 text-sm text-slate-400 hover:text-slate-100 transition-colors"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
        disabled={currentPage === totalPages - 1 || isLoading}
        className="px-3 py-1.5 rounded-lg border border-slate-600/30 hover:border-slate-500/50 disabled:opacity-50 disabled:cursor-not-allowed text-sm text-slate-400 hover:text-slate-100 transition-colors"
      >
        Next →
      </button>
    </div>
  );
}
