import type { MatchRecord } from "./dashboard.types";

interface Props {
  matches: MatchRecord[];
}

export function RecentMatches({ matches }: Props) {
  return (
    <div className="mt-6 rounded-xl border border-violet-300/30 bg-slate-900/55 p-4">
      <p className="text-sm font-semibold uppercase tracking-wide text-cyan-100">Recent Matches</p>
      <div className="mt-2 space-y-2 text-left text-xs">
        {matches.map((game) => (
          <div key={game.id} className="flex items-center justify-between rounded-lg border border-slate-500/20 bg-slate-900/60 px-3 py-2">
            <div>
              <p className="font-semibold text-sky-100">{game.id}</p>
              <p className="text-[11px] text-slate-200">vs {game.opponent}</p>
            </div>
            <div className="text-right">
              <p className={`text-sm font-black ${game.result === "Win" ? "text-lime-300" : game.result === "Loss" ? "text-rose-300" : "text-slate-100"}`}>
                {game.result}
              </p>
              <p className="text-[11px] text-slate-300">{game.duration}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
