import { Zap } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-teal-900 to-cyan-950">
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
          <span className="bg-gradient-to-r from-cyan-400 to-teal-300 bg-clip-text text-transparent">
            Chiến thắng tốc độ
          </span>
        </h1>

        <p className="max-w-2xl text-base leading-relaxed text-gray-300 sm:text-lg">
          Không chỉ là may mắn. Hãy thể hiện kỹ năng tính toán của bạn trong
          các trận đấu PvP thời gian thực. Leo rank, tạo phòng và thách đấu bạn
          bè ngay hôm nay.
        </p>
      </div>
    </section>
  )
}
