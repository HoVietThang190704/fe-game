"use client";

import React from "react";
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
  User2,
} from "lucide-react";
import { useMyProfile } from "@/src/lib/hooks/useMyProfile";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { updateUserProfile } from "@/src/lib/api/user";
import { useState } from "react";

export default function MyProfilePage() {
  const { profile, loading, error } = useMyProfile();
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  React.useEffect(() => {
    if (profile && editMode) {
      setName(profile.name || "");
      setAvatarUrl(profile.avatar_url || "");
    }
  }, [editMode, profile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(135deg,#000000_6%,#581C87_52%,#000000_100%)] text-purple-300 text-lg">
        Đang tải hồ sơ...
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(135deg,#000000_6%,#581C87_52%,#000000_100%)] text-red-400 text-lg">
        {error ?? "Không tải được hồ sơ"}
      </div>
    );
  }

  // Sử dụng dữ liệu thực từ profile API
  const stats = {
    totalMatches: profile.totalMatches || 0,
    longestStreak: 0, // Chưa có trong API
    currentStreak: 0, // Chưa có trong API
    winCount: profile.wins || 0,
    lossCount: profile.losses || 0,
    bombsFlagged: 0, // Chưa có trong API
    bombsActivated: 0, // Chưa có trong API
    avgTime: "N/A",
  };

  // Tính tỷ lệ thắng từ dữ liệu thực
  const winRate = profile.winRate !== undefined 
    ? profile.winRate.toFixed(1) 
    : (stats.winCount + stats.lossCount > 0
      ? (
          (stats.winCount / (stats.winCount + stats.lossCount)) * 100
        ).toFixed(1)
      : 0);

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    try {
      await updateUserProfile({ name, avatar_url: avatarUrl });
      setEditMode(false);
      window.location.reload(); // reload to get new info
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="profile-theme min-h-screen bg-background p-4 sm:p-8 text-white font-sans transition-colors duration-500">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => router.back()}
          className="group mb-8 flex items-center gap-2 text-sm font-medium text-purple-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Quay lại trang chủ
        </button>
        <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="h-32 w-32 overflow-hidden rounded-2xl border-4 border-primary/50 rotate-3 transition-transform hover:rotate-0 shadow-lg">
                {profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.username}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-tr from-fuchsia-600 to-purple-600 flex items-center justify-center">
                    <User2 className="h-16 w-16 text-purple-200" />
                  </div>
                )}
              </div>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-black tracking-tight text-white">
                {profile.username}
              </h1>
              {editMode ? (
                <div className="mt-2 flex flex-col gap-2 items-center md:items-start">
                  <input
                    className="rounded px-2 py-1 text-black"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Tên hiển thị"
                  />
                  <input
                    className="rounded px-2 py-1 text-black"
                    value={avatarUrl}
                    onChange={e => setAvatarUrl(e.target.value)}
                    placeholder="Avatar URL"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      className="rounded bg-green-500 px-4 py-2 text-white font-bold hover:bg-green-600"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? "Đang lưu..." : "Lưu"}
                    </button>
                    <button
                      className="rounded bg-gray-400 px-4 py-2 text-white font-bold hover:bg-gray-500"
                      onClick={() => setEditMode(false)}
                      disabled={saving}
                    >
                      Hủy
                    </button>
                  </div>
                  {saveError && <div className="text-red-400 mt-2">{saveError}</div>}
                </div>
              ) : (
                <>
                  {profile.name && profile.name !== profile.username && (
                    <p className="mt-1 text-purple-300 text-sm">{profile.name}</p>
                  )}
                  <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-3">
                    <span className="flex items-center gap-1 text-sm font-bold text-yellow-400">
                      <TrendingUp className="h-4 w-4" /> {profile.rank} ELO
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-3">
                    <span className="flex items-center gap-1 text-sm text-purple-300">
                      Tham gia: {profile.joinDate}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <button className="flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-purple-950 transition hover:bg-purple-200 active:scale-95 mb-2">
              <Zap className="h-5 w-5 fill-current" />
              Lịch sử đấu
            </button>
            <button
              className="flex items-center justify-center gap-2 rounded-xl bg-purple-500 px-8 py-4 font-bold text-white transition hover:bg-purple-600 active:scale-95"
              onClick={() => setEditMode(true)}
              disabled={editMode}
            >
              Chỉnh sửa hồ sơ
            </button>
          </div>
        </div>

        <div className="rounded-[2rem] border border-accent/30 bg-primary/10 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-full bg-purple-500/20 p-2">
              <LayoutGrid className="h-5 w-5 text-purple-300" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Thống kê chi tiết
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-4 space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-sm">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 font-bold text-white/90">
                    <Shield className="h-5 w-5 text-emerald-400" /> Tỷ lệ
                    thắng/thua
                  </h3>
                  <span className="text-2xl font-black text-emerald-400">
                    {winRate}%
                  </span>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="mb-2 flex justify-between text-xs font-medium uppercase tracking-wider text-white/50">
                      <span>Thắng: {stats.winCount}</span>
                      <span>Thua: {stats.lossCount}</span>
                    </div>
                    <div className="flex h-4 overflow-hidden rounded-full bg-black/40 p-1 border border-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                        style={{ width: `${winRate}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-white/5 p-4 border border-white/5 transition hover:bg-white/10">
                      <p className="text-[10px] uppercase text-white/50">
                        Chuỗi hiện tại
                      </p>
                      <p className="text-xl font-bold text-orange-400">
                        {stats.currentStreak} 🔥
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white/5 p-4 border border-white/5 transition hover:bg-white/10">
                      <p className="text-[10px] uppercase text-white/50">
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

            <div className="md:col-span-4 rounded-3xl border border-white/10 bg-white/5 p-6 relative overflow-hidden group shadow-xl backdrop-blur-sm">
              <Bomb className="absolute -right-8 -top-8 h-32 w-32 text-white/5 transition-transform group-hover:scale-110" />
              <h3 className="mb-8 flex items-center gap-2 font-bold text-white/90">
                <Target className="h-5 w-5 text-cyan-400" /> Chỉ số gỡ bom
              </h3>

              <div className="space-y-8 relative z-10">
                <div className="flex justify-between items-center group">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white/60">Bom đã đặt cờ</span>
                    <span className="p-1.5 rounded-md bg-green-500/10 border border-green-500/20">
                      <Flag className="h-3.5 w-3.5 text-green-400 fill-green-400" />
                    </span>
                  </div>
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
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-sm text-white/70">Độ chính xác</span>
                    <span className="font-bold text-lime-400">
                      {stats.bombsFlagged > 0
                        ? (
                            (stats.bombsFlagged /
                              (stats.bombsFlagged +
                                stats.bombsActivated)) *
                            100
                          ).toFixed(1)
                        : 0}
                      %
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl bg-cyan-500/10 p-4 border border-cyan-500/20">
                  <p className="text-xs italic text-cyan-200 leading-relaxed">
                    &quot;Thống kê sẽ cập nhật sau mỗi trận đấu.&quot;
                  </p>
                </div>
              </div>
            </div>

            <div className="md:col-span-4 space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-sm">
                <h3 className="mb-6 flex items-center gap-2 font-bold text-white/90">
                  <BarChart3 className="h-5 w-5 text-pink-400" /> Hiệu suất nổi
                  bật
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 transition hover:bg-white/10">
                    <div className="rounded-lg bg-cyan-500/20 p-2">
                      <Clock className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-white/50">
                        Thời gian TB/Trận
                      </p>
                      <p className="font-bold text-white">
                        {stats.avgTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 transition hover:bg-white/10">
                    <div className="rounded-lg bg-yellow-500/20 p-2">
                      <Target className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-white/50">
                        Tổng trận đã chơi
                      </p>
                      <p className="font-bold text-white">
                        {stats.totalMatches}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 transition hover:bg-white/10">
                    <div className="rounded-lg bg-pink-500/20 p-2">
                      <Zap className="h-5 w-5 text-pink-400" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-white/50">
                        ELO hiện tại
                      </p>
                      <p className="font-bold text-white">{profile.rank}</p>
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
