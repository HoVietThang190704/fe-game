"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardNavbar } from "@/src/components/dashboard/DashboardNavbar";
import { CommandCard } from "@/src/components/dashboard/CommandCard";
import { ProfileCard } from "@/src/components/dashboard/ProfileCard";
import { JoinRoomModal } from "@/src/components/dashboard/JoinRoomModal";
import { useDashboardData } from "@/src/lib/hooks/useDashboardData";
import { createPrivateMatch, joinPrivateMatch } from "@/src/lib/api/match";

const ROOM_PIN_STORAGE_KEY = "currentRoomPin";
const ROOM_ID_STORAGE_KEY = "currentMatchId";
const LEFT_ROOM_FLAG = "leftRoom";

export default function DashboardPage() {
  const router = useRouter();
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [roomError, setRoomError] = useState<string | null>(null);
  const { data, loading, error } = useDashboardData();
  const [isJoinRoomModalOpen, setIsJoinRoomModalOpen] = useState(false);

  const handleCommand = useCallback(
    async (commandId: string) => {
      if (commandId === "quick-match") {
        router.push("/dashboard/quick-match");
        return;
      }

      if (commandId === "join-room") {
        setIsJoinRoomModalOpen(true);
        return;
      }

      if (commandId === "create-room") {
        setCreatingRoom(true);
        setRoomError(null);

        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          setRoomError("Thiếu access token. Vui lòng đăng nhập lại.");
          setCreatingRoom(false);
          return;
        }

        try {
          const room = await createPrivateMatch(accessToken);

          if (room.pinCode) {
            localStorage.setItem(ROOM_PIN_STORAGE_KEY, room.pinCode);
          }
          if (room.matchId) {
            localStorage.setItem(ROOM_ID_STORAGE_KEY, room.matchId);
          }
          localStorage.setItem(LEFT_ROOM_FLAG, "false");

          router.push("/dashboard/waiting-room");
        } catch (err: unknown) {
          setRoomError(
            err instanceof Error ? err.message : "Không thể tạo phòng.",
          );
          console.error("Create room failed", err);
        } finally {
          setCreatingRoom(false);
        }

        return;
      }

      console.log("Command clicked:", commandId);
    },
    [router],
  );

  // LOGIC JOIN PHÒNG ĐÃ ĐƯỢC CẬP NHẬT Ở ĐÂY
  const handleJoinRoomSubmit = useCallback(
    async (pinCode: string) => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Thiếu access token. Vui lòng đăng nhập lại.");
      }

      try {
        // 1. Gọi API tham gia phòng
        const room = await joinPrivateMatch(pinCode, accessToken);

        // 2. BẮT BUỘC: Lưu thông tin phòng vào localStorage TRƯỚC khi chuyển trang
        if (room.pinCode) {
          localStorage.setItem(ROOM_PIN_STORAGE_KEY, room.pinCode);
        }
        if (room.matchId) {
          localStorage.setItem(ROOM_ID_STORAGE_KEY, room.matchId);
        }
        localStorage.setItem(LEFT_ROOM_FLAG, "false");

        // 3. Chuyển hướng sang trang phòng chờ
        router.push("/dashboard/waiting-room");
      } catch (err: unknown) {
        throw new Error(
          err instanceof Error
            ? err.message
            : "Không thể tham gia phòng. Kiểm tra lại mã PIN.",
        );
      }
    },
    [router],
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-cyan-200">
        Đang tải dashboard...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-red-300">
        Lỗi tải dashboard: {error ?? "Không có dữ liệu"}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_15%,_rgba(5,209,255,0.16),_rgba(8,30,54,0.92)_60%)] text-sky-200 p-6 pt-4">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4">
        <DashboardNavbar />

        <section className="grid gap-6 xl:grid-cols-[360px_1fr]">
          <ProfileCard player={data.player} />

          <article className="rounded-2xl border border-sky-200/30 bg-slate-950/40 p-6 shadow-[0_0_32px_rgba(0,160,255,0.25)] backdrop-blur-lg">
            <h2 className="mb-5 text-3xl font-bold tracking-widest text-cyan-300">
              COMMAND CENTER
            </h2>
            {roomError && (
              <div className="mb-4 rounded-lg border border-red-400/40 bg-red-500/10 p-3 text-sm font-medium text-red-200">
                {roomError}
              </div>
            )}
            <div className="grid gap-4 md:grid-cols-2">
              {data.commands.map((card) => (
                <CommandCard
                  key={card.id}
                  card={card}
                  onClick={handleCommand}
                />
              ))}
            </div>
          </article>
        </section>
      </div>

      {/* Join Room Modal */}
      <JoinRoomModal
        isOpen={isJoinRoomModalOpen}
        onClose={() => setIsJoinRoomModalOpen(false)}
        onSubmit={handleJoinRoomSubmit}
      />
    </main>
  );
}
