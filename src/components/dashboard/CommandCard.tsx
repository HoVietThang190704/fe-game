import { Crown, Clock, Gamepad2, PlusCircle, Hash } from "lucide-react";
import type { CommandCard as CommandCardType } from "./dashboard.types";

const ICON_MAPPING: Record<string, React.ComponentType<{ className?: string }>> = {
  Play: Gamepad2,
  PlusCircle,
  Crown,
  Clock,
  Hash, // Adding Hash for Join Room if needed
};

interface Props {
  card: CommandCardType;
  onClick?: (id: string) => void;
}

export function CommandCard({ card, onClick }: Props) {
  const Icon = ICON_MAPPING[card.iconName] || Gamepad2;

  // Map icon names from data to proper icons if they differ
  let DisplayIcon = Icon;
  if (card.id === 'join-room') DisplayIcon = Hash;

  return (
    <button
      onClick={() => onClick?.(card.id)}
      className={`group relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border ${card.colorClass}/30 bg-slate-900/40 p-10 text-center transition-all hover:shadow-[0_0_40px_rgba(34,211,238,0.2)] hover:border-${card.colorClass.split('-')[1]}-400/60 hover:brightness-110 active:scale-95`}
      aria-label={card.title}
      type="button"
    >
      <div className={`p-3 rounded-2xl bg-slate-950/50 shadow-inner group-hover:scale-110 transition-transform duration-300`}>
        <DisplayIcon className={`h-10 w-10 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]`} />
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="text-xl font-black tracking-[0.2em] uppercase text-cyan-100 drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">
          {card.title}
        </span>
        <p className="text-xs font-bold tracking-widest text-sky-200/60 uppercase">
          {card.subtitle}
        </p>
      </div>
      
      {/* Decorative corner glow */}
      <div className={`absolute -right-8 -top-8 h-16 w-16 bg-cyan-400/10 blur-2xl group-hover:bg-cyan-400/20 transition-colors`} />
    </button>
  );
}
