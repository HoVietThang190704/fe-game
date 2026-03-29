import type { PlayerStats } from "./dashboard.types";
import { User2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  player: PlayerStats;
}

export function ProfileCard({ player }: Props) {
  const router = useRouter();
  return (
    <article className="rounded-2xl border border-cyan-400/20 bg-slate-950/40 p-6 shadow-[0_0_35px_rgba(34,211,238,0.15)] backdrop-blur-xl">
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-[0_0_20px_rgba(34,211,238,0.4)]">
          {player.avatar_url ? (
            <img
              src={player.avatar_url}
              alt={player.username}
              className="h-full w-full object-cover"
            />
          ) : (
            <User2 className="h-12 w-12 text-blue-200" />
          )}
        </div>
        <p className="text-3xl font-black tracking-tight text-cyan-50">
          {player.username}
        </p>
        <div className="mt-1 flex items-center justify-center gap-2 text-sm font-bold text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]">
          <span>⚔️</span> {player.elo} ELO
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-cyan-500/10 bg-slate-900/40 p-4 text-center">
          <p className="text-xl font-black text-lime-400">{player.winRate}%</p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-100/60">
            Win Rate
          </p>
        </div>
        <div className="rounded-xl border border-cyan-500/10 bg-slate-900/40 p-4 text-center">
          <p className="text-xl font-black text-sky-400">
            {player.totalMatches}
          </p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-100/60">
            Matches
          </p>
        </div>
      </div>

      <button
        onClick={() => {
          router.push("/dashboard/myprofile");
        }}
        className="mt-6 w-full rounded-xl border border-cyan-500/30 bg-cyan-950/20 py-3 text-xs font-black tracking-[0.3em] uppercase text-cyan-400 transition-all hover:bg-cyan-500/10 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
        type="button"
      >
        View Profile
      </button>

      <div className="mt-10">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300/80 mb-4">
          Statistics
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-bold text-slate-400">Wins:</span>
            <span className="font-black text-lime-400 text-lg">
              {player.wins}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm border-t border-slate-800/50 pt-4">
            <span className="font-bold text-slate-400">Losses:</span>
            <span className="font-black text-amber-500 text-lg">
              {player.losses}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
