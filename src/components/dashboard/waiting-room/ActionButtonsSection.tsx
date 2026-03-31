import { Button } from "@/src/components/ui/button";

interface ActionButtonsSectionProps {
  isHost: boolean;
  isReady: boolean;
  canStart: boolean;
  onToggleReady: () => void;
  onLeaveRoom?: () => void;
  onStartMatch?: () => void;
}

export function ActionButtonsSection({
  isHost,
  isReady,
  canStart,
  onToggleReady,
  onLeaveRoom,
  onStartMatch
}: ActionButtonsSectionProps) {
  return (
    <section className="grid gap-2 sm:grid-cols-2">
      <Button
        type="button"
        onClick={onLeaveRoom}
        className="h-10 rounded-lg border border-sky-200/35 bg-slate-900/60 text-sm font-bold text-cyan-100 hover:bg-slate-800/70"
      >
        Rời phòng
      </Button>
      
      {isHost ? (
        <Button
          type="button"
          onClick={onStartMatch}
          disabled={!canStart}
          className={`h-12 rounded-xl border text-base font-bold transition-all duration-300 ${
            canStart 
              ? "border-cyan-300/45 bg-cyan-500/20 text-cyan-100 hover:bg-cyan-500/35 shadow-[0_0_15px_rgba(6,182,212,0.3)]" 
              : "border-slate-700 bg-slate-800/40 text-slate-500 cursor-not-allowed"
          }`}
        >
          {canStart ? "Bắt đầu trận đấu" : "Chờ đối thủ sẵn sàng..."}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onToggleReady}
          className={`h-12 rounded-xl border text-base font-bold transition-all duration-300 ${
            isReady 
              ? "border-emerald-400/50 bg-emerald-500/20 text-emerald-100 hover:bg-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]" 
              : "border-amber-400/50 bg-amber-500/20 text-amber-100 hover:bg-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
          }`}
        >
          {isReady ? "Đã sẵn sàng" : "Sẵn sàng"}
        </Button>
      )}
    </section>
  );
}
