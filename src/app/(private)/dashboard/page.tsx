"use client";

import { useCallback, useState } from "react";
import { DashboardNavbar } from "@/src/components/dashboard/DashboardNavbar";
import { CommandCard } from "@/src/components/dashboard/CommandCard";
import { ProfileCard } from "@/src/components/dashboard/ProfileCard";
import { JoinRoomModal } from "@/src/components/dashboard/JoinRoomModal";
import { useDashboardData } from "@/src/lib/hooks/useDashboardData";

export default function DashboardPage() {
  const { data, loading, error } = useDashboardData();
  const [isJoinRoomModalOpen, setIsJoinRoomModalOpen] = useState(false);

  const handleCommand = useCallback((commandId: string) => {
    console.log("Command clicked:", commandId);

    switch (commandId) {
      case "join-room":
        setIsJoinRoomModalOpen(true);
        break;
      case "quick-match":
        // TODO: Implement quick match
        break;
      case "create-room":
        // TODO: Implement create room
        break;
      case "match-history":
        // TODO: Implement match history
        break;
      default:
        break;
    }
  }, []);

  const handleJoinRoomSubmit = async (pinCode: string) => {
    try {
      console.log("Joining room with PIN:", pinCode);
      // TODO: Call API to join room
      // const response = await fetch(`/api/matches/join`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ pinCode })
      // });
      // if (!response.ok) throw new Error('Failed to join room');
      // const result = await response.json();
      // Redirect to game or handle success
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to join room",
      );
    }
  };

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
