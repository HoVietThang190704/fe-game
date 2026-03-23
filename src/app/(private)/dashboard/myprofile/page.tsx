"use client";

import {
  ArrowLeft,
  Zap,
  Target,
  Shield,
  Bomb,
  TrendingUp,
  Clock,
  BarChart3,
  LayoutGrid,
  Flag,
} from "lucide-react";

export default function MyProfilePage() {
  const stats = {
    username: "Player123",
    rank: "Thạc sĩ Đỏ Min",
    elo: 1250,
    joinDate: "01/01/2024",
    totalMatches: 142,
    longestStreak: 12,
    currentStreak: 5,
    winCount: 93,
    lossCount: 41,
    bombsFlagged: 1234,
    bombsActivated: 123,
    avgTime: "4:32",
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#000000_6%,#581C87_52%,#000000_100%)] p-4 sm:p-8 text-white font-sans">
      <div className="mx-auto max-w-6xl">
        {/* Header Navigation */}
        <button className="group mb-8 flex items-center gap-2 text-sm font-medium text-purple-400 transition hover:text-white">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Quay lại trang chủ
        </button>

        {/* TOP SECTION: User Identity */}
        <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-6 rounded-3xl border border-purple-500/20 bg-purple-900/20 p-8 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="h-32 w-32 overflow-hidden rounded-2xl border-4 border-purple-500/50 rotate-3 transition-transform hover:rotate-0">
                <div className="h-full w-full bg-gradient-to-tr from-fuchsia-600 to-purple-600" />
              </div>
              <div className="absolute -bottom-2 -right-2 rounded-lg bg-yellow-500 px-2 py-1 text-[10px] font-bold text-black shadow-lg">
                LEVEL 42
              </div>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-black tracking-tight text-white">
                {stats.username}
              </h1>
              <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-3">
                <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-bold text-purple-300 border border-purple-500/30">
                  {stats.rank}
                </span>
                <span className="flex items-center gap-1 text-sm font-bold text-yellow-400">
                  <TrendingUp className="h-4 w-4" /> {stats.elo} ELO
                </span>
              </div>
              <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-3">
                <span className="flex items-center gap-1 text-sm font-bold text-white-400">
                  Tham gia: {stats.joinDate}
                </span>
              </div>
            </div>
          </div>
          <button className="flex w-full md:w-auto items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-purple-950 transition hover:bg-purple-200 active:scale-95">
            <Zap className="h-5 w-5 fill-current" />
            Lịch sử đấu
          </button>
        </div>

        {/* BOTTOM SECTION: Detailed Stats Layout */}
        <div className="rounded-[2rem] border border-purple-500/20 bg-[#25143a]/60 p-6 sm:p-10 shadow-2xl backdrop-blur-sm">
          {/* Tiêu đề tổng quát của ô bao quanh */}
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-full bg-purple-500/20 p-2">
              <LayoutGrid className="h-5 w-5 text-purple-300" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Thống kê chi tiết
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* 1. Thống kê Tỉ lệ Thắng (Bên trái) */}
            <div className="md:col-span-4 space-y-6">
              <div className="rounded-3xl border border-purple-500/10 bg-gradient-to-b from-purple-900/40 to-transparent p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 font-bold text-purple-200">
                    <Shield className="h-5 w-5 text-emerald-400" /> Tỷ lệ
                    thắng/thua
                  </h3>
                  <span className="text-2xl font-black text-emerald-400">
                    {stats.winCount > 0
                      ? (
                          (stats.winCount /
                            (stats.winCount + stats.lossCount)) *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </span>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="mb-2 flex justify-between text-xs font-medium uppercase tracking-wider text-purple-400">
                      <span>Thắng: {stats.winCount}</span>
                      <span>Thua: {stats.lossCount}</span>
                    </div>
                    <div className="flex h-4 overflow-hidden rounded-full bg-purple-950/50 p-1 border border-purple-500/20">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                        style={{
                          width: `${
                            stats.winCount + stats.lossCount > 0
                              ? (
                                  (stats.winCount /
                                    (stats.winCount + stats.lossCount)) *
                                  100
                                ).toFixed(1)
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-purple-900/30 p-4 border border-purple-500/10">
                      <p className="text-[10px] uppercase text-purple-400">
                        Chuỗi hiện tại
                      </p>
                      <p className="text-xl font-bold text-orange-400">
                        {stats.currentStreak} 🔥
                      </p>
                    </div>
                    <div className="rounded-2xl bg-purple-900/30 p-4 border border-purple-500/10">
                      <p className="text-[10px] uppercase text-purple-400">
                        Chuỗi kỷ lục
                      </p>
                      <p className="text-xl font-bold text-fuchsia-400">
                        {stats.longestStreak}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Thống kê Bom (Trung tâm) */}
            <div className="md:col-span-4 rounded-3xl border border-purple-500/20 bg-purple-900/40 p-6 relative overflow-hidden group">
              <Bomb className="absolute -right-8 -top-8 h-32 w-32 text-purple-500/10 transition-transform group-hover:scale-110" />
              <h3 className="mb-8 flex items-center gap-2 font-bold text-purple-200">
                <Target className="h-5 w-5 text-cyan-400" /> Chỉ số gỡ bom
              </h3>

              <div className="space-y-8 relative z-10">
                <div className="flex justify-between items-center group">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-purple-200/70">
                      Bom đã đặt cờ
                    </span>
                    <span className="p-1.5 rounded-md bg-green-500/10 border border-green-500/20">
                      <Flag className="h-3.5 w-3.5 text-green-400 fill-green-400" />
                    </span>
                  </div>
                  {/* Số để màu trắng cho nổi bật và sang trọng */}
                  <span className="text-2xl font-black text-white group-hover:text-green-400 transition-colors">
                    {stats.bombsFlagged}
                  </span>
                </div>

                <div className="grid gap-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      Bom đã kích hoạt
                      <span className="inline-flex items-center justify-center p-1.5 rounded-md bg-rose-500/20 animate-pulse">
                        <Bomb className="h-3.5 w-3.5 text-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
                      </span>
                    </div>
                    <span className="text-rose-500 font-black text-2xl tracking-tight">
                      {stats.bombsActivated}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-purple-500/10 pb-2">
                    <span className="text-sm text-purple-300 text-opacity-80">
                      Độ chính xác
                    </span>
                    <span className="font-bold text-lime-400">
                      {stats.bombsFlagged > 0
                        ? (
                            (stats.bombsFlagged /
                              (stats.bombsFlagged + stats.bombsActivated)) *
                            100
                          ).toFixed(1)
                        : 0}
                      %
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl bg-cyan-500/10 p-4 border border-cyan-500/20">
                  <p className="text-xs italic text-cyan-200 leading-relaxed">
                    "Chuyên gia trong việc xử lý các bẫy nổ cấp độ Thạc sĩ."
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Hiệu suất & Nổi bật (Bên phải) */}
            <div className="md:col-span-4 space-y-6">
              <div className="rounded-3xl border border-purple-500/10 bg-gradient-to-tr from-purple-900/40 to-fuchsia-900/20 p-6">
                <h3 className="mb-6 flex items-center gap-2 font-bold text-purple-200">
                  <BarChart3 className="h-5 w-5 text-pink-400" /> Hiệu suất nổi
                  bật
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 transition hover:bg-white/10">
                    <div className="rounded-lg bg-cyan-500/20 p-2">
                      <Clock className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-purple-400">
                        Thời gian TB/Trận
                      </p>
                      <p className="font-bold text-white">{stats.avgTime}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 transition hover:bg-white/10">
                    <div className="rounded-lg bg-yellow-500/20 p-2">
                      <Target className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-purple-400">
                        Thành tích đặc biệt
                      </p>
                      <p className="font-bold text-white">Tác động anh dũng</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 transition hover:bg-white/10">
                    <div className="rounded-lg bg-pink-500/20 p-2">
                      <Zap className="h-5 w-5 text-pink-400" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-purple-400">
                        Danh hiệu
                      </p>
                      <p className="font-bold text-white">Bất bại vinh quang</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
