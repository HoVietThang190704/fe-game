import { Zap } from "lucide-react"

export function HeroSection() {
  return (
    <section className="hero-section relative flex min-h-screen items-center justify-center">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 text-center">
        <div className="flex items-center gap-2 rounded-full border border-cyan-400/50 bg-cyan-400/10 px-4 py-1.5">
          <Zap className="h-3.5 w-3.5 text-cyan-400" />
          <span className="text-xs font-medium text-cyan-300">
            Game dò mìn đối kháng trực tuyến số 1
          </span>
        </div>

        <h1 className="text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
          <span className="text-white">Thách thức tư duy</span>
          <br />
          <span className="bg-gradient-to-r from-cyan-200 to-teal-100 bg-clip-text text-transparent">
            Chiến thắng tốc độ
          </span>
        </h1>

        <p className="max-w-2xl text-base leading-relaxed text-gray-300 sm:text-lg">
          Không chỉ là may mắn. Hãy thể hiện kỹ năng tính toán của bạn trong
          các trận đấu PvP thời gian thực. Leo rank, tạo phòng và thách đấu bạn
          bè ngay hôm nay.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="/login"
            className="rounded-xl bg-cyan-400 px-7 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-cyan-500/30 transition hover:-translate-y-0.5 hover:bg-cyan-300"
          >
            ⚡ Chơi Ngay
          </a>
          <a
            href="/docs"
            className="rounded-xl border border-teal-300/70 px-7 py-3 text-sm font-semibold text-cyan-100 transition hover:-translate-y-0.5 hover:bg-teal-800/30"
          >
            📄 Xem hướng dẫn
          </a>
        </div>
      </div>
    </section>
  )
}
