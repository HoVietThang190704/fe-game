import { Crown, CircleCheck, Gamepad2, HelpCircle, Clock3 } from "lucide-react";

interface PlayerStatusSectionProps {
  playerName: string;
}

export function PlayerStatusSection({ playerName }: PlayerStatusSectionProps) {
  return (
    <section className="mb-5 grid gap-3 md:grid-cols-2">
      <article className="rounded-xl border border-emerald-300/40 bg-slate-900/50 p-3">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-cyan-500/20">
            <Gamepad2 className="size-6 text-cyan-200" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <p className="text-xl font-bold leading-none text-cyan-50">{playerName}</p>
              <Crown className="size-4 text-amber-300" />
            </div>
            <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-emerald-300">
              <CircleCheck className="size-4" />
              Sẵn sàng
            </p>
          </div>
        </div>
      </article>

      <article className="rounded-2xl border border-sky-200/20 bg-slate-900/50 p-4">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-fuchsia-500/20">
            <HelpCircle className="size-7 text-fuchsia-200" />
          </div>
          <div>
            <p className="text-2xl font-bold leading-none text-cyan-50">Đang chờ...</p>
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-sky-100/65">
              <Clock3 className="size-4" />
              Đang chờ...
            </p>
          </div>
        </div>
      </article>
    </section>
  );
}
