import { Zap } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted to-background">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 text-center">
        <div className="flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5">
          <Zap className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium text-primary">
            Game dò mìn đối kháng trực tuyến số 1
          </span>
        </div>

        <h1 className="text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
          <span className="text-foreground">Thách thức tư duy</span>
          <br />
          <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
            Chiến thắng tốc độ
          </span>
        </h1>

        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Không chỉ là may mắn. Hãy thể hiện kỹ năng tính toán của bạn trong
          các trận đấu PvP thời gian thực. Leo rank, tạo phòng và thách đấu bạn
          bè ngay hôm nay.
        </p>
      </div>
    </section>
  )
}
