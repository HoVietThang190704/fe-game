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
      {/* Article 1: Thông tin của BẠN (Chủ phòng) - GIỮ NGUYÊN */}
      <article className="rounded-xl border border-emerald-300/40 bg-slate-900/50 p-3">
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
            <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-emerald-300">
              <CircleCheck className="size-4" />
              {host?.isReady ? "Sẵn sàng (Chủ)" : "Chưa sẵn sàng (Chủ)"}
            </p>
          </div>
        </div>
      </article>

      {/* Article 2: Thông tin ĐỐI THỦ - CẬP NHẬT LOGIC HÌNH ẢNH VÀ TEXT */}
      <article
        className={`rounded-2xl border bg-slate-900/50 p-4 transition-colors duration-300 ${activeOpponent ? "border-fuchsia-400/40" : "border-sky-200/20"}`}
      >
        <div className="flex items-center gap-4">
          {/* Phần Icon */}
          <div className="relative h-14 w-14 overflow-hidden rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10">
            {activeOpponent?.avatar ? (
              <Image
                src={activeOpponent.avatar}
                alt={activeOpponent.displayName}
                fill
                className="object-cover"
              />
            ) : activeOpponent ? (
              <Gamepad2 className="size-7 text-fuchsia-200" />
            ) : (
              <HelpCircle className="size-7 text-fuchsia-100/50 animate-pulse" />
            )}
          </div>

          {/* Phần Text */}
          <div>
            {/* Hiển thị Tên đối thủ hoặc "Đang chờ..." */}
            <p
              className={`text-2xl font-bold leading-none text-cyan-50 ${activeOpponent ? "" : "animate-pulse"}`}
            >
              {activeOpponent ? activeOpponent.displayName : "Đang chờ..."}
            </p>

            {/* Hiển thị trạng thái nhỏ bên dưới */}
            <p
              className={`mt-2 inline-flex items-center gap-1.5 text-sm ${activeOpponent ? "text-fuchsia-300" : "text-sky-100/65"}`}
            >
              {activeOpponent ? (
                <CircleCheck className="size-4" />
              ) : (
                <Clock3 className="size-4" />
              )}
              {activeOpponent ? "Đã tham gia" : "Đang chờ..."}
            </p>
          </div>
        </div>
      </article>
    </section>
  );
}
