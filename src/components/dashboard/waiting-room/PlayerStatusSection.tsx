import { Crown, CircleCheck, Gamepad2, HelpCircle, Clock3 } from "lucide-react";
import Image from "next/image";

type PlayerData = {
  userId: string;
  displayName: string;
  avatar?: string;
  isReady?: boolean;
  playerNumber?: number;
  health?: number;
};

interface PlayerStatusSectionProps {
  host?: PlayerData | null;
  opponent?: PlayerData | null;
}

export function PlayerStatusSection({ host, opponent }: PlayerStatusSectionProps) {
  const hostName = host?.displayName || "Bạn";
  const activeOpponent = opponent;

  return (
    <section className="mb-5 grid gap-3 md:grid-cols-2">
      {/* Article 1: Thông tin của BẠN (Chủ phòng) */}
      <article className={`rounded-xl border p-3 transition-colors duration-300 ${host?.isReady ? "border-emerald-400/40 bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.1)]" : "border-amber-400/30 bg-slate-900/50"}`}>
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-full border border-cyan-400/30 bg-cyan-500/10">
            {host?.avatar ? (
              <Image
                src={host.avatar}
                alt={hostName}
                fill
                className="object-cover"
              />
            ) : (
              <Gamepad2 className="size-6 text-cyan-200" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <p className="text-xl font-bold leading-none text-cyan-50">
                {hostName}
              </p>
              <Crown className="size-4 text-amber-300" />
            </div>
            <p className={`mt-1 inline-flex items-center gap-1 text-xs font-medium ${host?.isReady ? "text-emerald-300" : "text-amber-300"}`}>
              <CircleCheck className={`size-4 ${host?.isReady ? "opacity-100" : "opacity-40"}`} />
              {host?.isReady ? "Đã sẵn sàng" : "Đang chuẩn bị..."}
            </p>
          </div>
        </div>
      </article>

      {/* Article 2: Thông tin ĐỐI THỦ */}
      <article
        className={`rounded-xl border p-3 transition-all duration-300 ${
          activeOpponent 
            ? activeOpponent.isReady 
              ? "border-emerald-400/40 bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
              : "border-fuchsia-400/40 bg-slate-900/50 shadow-[0_0_15px_rgba(192,38,211,0.15)]"
            : "border-sky-200/20 bg-slate-900/30"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className={`relative h-12 w-12 overflow-hidden rounded-full border transition-colors duration-300 ${
            activeOpponent 
              ? activeOpponent.isReady ? "border-emerald-400/30 bg-emerald-500/10" : "border-fuchsia-400/30 bg-fuchsia-500/10"
              : "border-sky-200/20 bg-slate-950/40"
          }`}>
            {activeOpponent?.avatar ? (
              <Image
                src={activeOpponent.avatar}
                alt={activeOpponent.displayName}
                fill
                className="object-cover"
              />
            ) : activeOpponent ? (
              <Gamepad2 className="size-6 text-fuchsia-200" />
            ) : (
              <HelpCircle className="size-6 text-sky-100/30 animate-pulse" />
            )}
          </div>

          <div>
            <p className={`text-xl font-bold leading-none transition-colors duration-300 ${activeOpponent ? "text-cyan-50" : "text-sky-100/40 animate-pulse"}`}>
              {activeOpponent ? activeOpponent.displayName : "Đang chờ đối thủ..."}
            </p>

            <p className={`mt-1 inline-flex items-center gap-1.5 text-xs font-medium transition-colors duration-300 ${
              activeOpponent 
                ? activeOpponent.isReady ? "text-emerald-300" : "text-fuchsia-300" 
                : "text-sky-100/40"
            }`}>
              {activeOpponent ? (
                <>
                  <CircleCheck className={`size-4 ${activeOpponent.isReady ? "opacity-100" : "opacity-40"}`} />
                  {activeOpponent.isReady ? "Đã sẵn sàng" : "Đang chuẩn bị..."}
                </>
              ) : (
                <>
                  <Clock3 className="size-4 animate-spin-slow" />
                  <span>Đang tìm...</span>
                </>
              )}
            </p>
          </div>
        </div>
      </article>
    </section>
  );
}
