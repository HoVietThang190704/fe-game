export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    if (hours === 0) {
      const minutes = Math.floor(diffMs / (1000 * 60));
      return `${minutes}m ago`;
    }
    return `${hours}h ago`;
  }

  if (diffDays === 1) {
    return "Yesterday";
  }

  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  }

  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }

  return `${secs}s`;
}

export function getResultColor(result: "win" | "lose" | "draw"): string {
  switch (result) {
    case "win":
      return "text-lime-300";
    case "lose":
      return "text-rose-300";
    case "draw":
      return "text-slate-300";
    default:
      return "text-slate-100";
  }
}

export function getResultBgColor(result: "win" | "lose" | "draw"): string {
  switch (result) {
    case "win":
      return "bg-lime-500/10";
    case "lose":
      return "bg-rose-500/10";
    case "draw":
      return "bg-slate-500/10";
    default:
      return "bg-slate-500/10";
  }
}

export function formatEloChange(eloChange: number): string {
  if (eloChange === 0) {
    return "0";
  }
  return eloChange > 0 ? `+${eloChange}` : `${eloChange}`;
}

export function getEloColor(eloChange: number): string {
  if (eloChange > 0) {
    return "text-lime-300";
  }
  if (eloChange < 0) {
    return "text-rose-300";
  }
  return "text-slate-300";
}
