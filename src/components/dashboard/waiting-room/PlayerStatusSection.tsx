import { Crown, CircleCheck, Gamepad2, HelpCircle, Clock3 } from "lucide-react";

interface PlayerStatusSectionProps {
  playerName: string;
  opponentName?: string | null; // Prop bạn vừa thêm
}

// 1. Destructure opponentName ở đây
export function PlayerStatusSection({
  playerName,
  opponentName,
}: PlayerStatusSectionProps) {
  return (
    <section className="mb-5 grid gap-3 md:grid-cols-2">
      {/* Article 1: Thông tin của BẠN (Chủ phòng) - GIỮ NGUYÊN */}
      <article className="rounded-xl border border-emerald-300/40 bg-slate-900/50 p-3">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-cyan-500/20">
            <Gamepad2 className="size-6 text-cyan-200" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <p className="text-xl font-bold leading-none text-cyan-50">
                {playerName}
              </p>
              <Crown className="size-4 text-amber-300" />
            </div>
            <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-emerald-300">
              <CircleCheck className="size-4" />
              Sẵn sàng (Chủ)
            </p>
          </div>
        </div>
      </article>

      {/* Article 2: Thông tin ĐỐI THỦ - CẬP NHẬT LOGIC HÌNH ẢNH VÀ TEXT */}
      <article
        className={`rounded-2xl border bg-slate-900/50 p-4 transition-colors duration-300 ${opponentName ? "border-fuchsia-400/40" : "border-sky-200/20"}`}
      >
        <div className="flex items-center gap-4">
          {/* Phần Icon */}
          <div className="grid h-14 w-14 place-items-center rounded-full bg-fuchsia-500/20">
            {opponentName ? (
              // Nếu có người chơi 2: Hiện icon tay cầm
              <Gamepad2 className="size-7 text-fuchsia-200" />
            ) : (
              // Nếu đang chờ: Hiện icon hỏi chấm (kèm hiệu ứng nhấp nháy animate-pulse)
              <HelpCircle className="size-7 text-fuchsia-100/50 animate-pulse" />
            )}
          </div>

          {/* Phần Text */}
          <div>
            {/* Hiển thị Tên đối thủ hoặc "Đang chờ..." */}
            <p
              className={`text-2xl font-bold leading-none text-cyan-50 ${opponentName ? "" : "animate-pulse"}`}
            >
              {opponentName ? opponentName : "Đang chờ..."}
            </p>

            {/* Hiển thị trạng thái nhỏ bên dưới */}
            <p
              className={`mt-2 inline-flex items-center gap-1.5 text-sm ${opponentName ? "text-fuchsia-300" : "text-sky-100/65"}`}
            >
              {opponentName ? (
                // Có người rồi thì hiện tích xanh
                <CircleCheck className="size-4" />
              ) : (
                // Đang chờ thì hiện đồng hồ
                <Clock3 className="size-4" />
              )}
              {opponentName ? "Đã tham gia" : "Đang chờ..."}
            </p>
          </div>
        </div>
      </article>
    </section>
  );
}
