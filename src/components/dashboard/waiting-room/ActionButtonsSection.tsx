import { Button } from "@/src/components/ui/button";

interface ActionButtonsSectionProps {
  onLeaveRoom?: () => void;
  onStartMatch?: () => void;
}

export function ActionButtonsSection({ onLeaveRoom, onStartMatch }: ActionButtonsSectionProps) {
  return (
    <section className="grid gap-2 sm:grid-cols-2">
      <Button
        type="button"
        onClick={onLeaveRoom}
        className="h-10 rounded-lg border border-sky-200/35 bg-slate-900/60 text-sm font-bold text-cyan-100 hover:bg-slate-800/70"
      >
        Rời phòng
      </Button>
      <Button
        type="button"
        onClick={onStartMatch}
        className="h-12 rounded-xl border border-cyan-300/45 bg-cyan-500/20 text-base font-bold text-cyan-100 hover:bg-cyan-500/35"
      >
        Bắt đầu trận đấu
      </Button>
    </section>
  );
}
