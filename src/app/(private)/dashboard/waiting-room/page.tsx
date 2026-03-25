"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createPrivateMatch, leaveMatch } from "@/src/lib/api/match";
import { getMyProfile } from "@/src/lib/api/auth";
import { RoomPinSection } from "@/src/components/dashboard/waiting-room/RoomPinSection";
import { PlayerStatusSection } from "@/src/components/dashboard/waiting-room/PlayerStatusSection";
import { MatchSettingsSection } from "@/src/components/dashboard/waiting-room/MatchSettingsSection";
import { ActionButtonsSection } from "@/src/components/dashboard/waiting-room/ActionButtonsSection";

const ROOM_PIN_STORAGE_KEY = "currentRoomPin";
const ROOM_ID_STORAGE_KEY = "currentMatchId";
const LEFT_ROOM_FLAG = "leftRoom";

export default function WaitingRoomPage() {
  const router = useRouter();
  const [roomId, setRoomId] = useState<string | null>(null);
  const [roomPin, setRoomPin] = useState("----");
  const [playerName, setPlayerName] = useState("Người chơi");
  const [isCreatingRoom, setIsCreatingRoom] = useState(true);
  const [roomError, setRoomError] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const bootstrapRoom = async () => {
      try {
        setIsCreatingRoom(true);
        setRoomError(null);

        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          throw new Error("Thiếu access token. Vui lòng đăng nhập lại.");
        }

        const leftRoom = localStorage.getItem(LEFT_ROOM_FLAG) === "true";
        const cachedPin = localStorage.getItem(ROOM_PIN_STORAGE_KEY);
        const cachedRoomId = localStorage.getItem(ROOM_ID_STORAGE_KEY);

        if (leftRoom) {
          setRoomError("Bạn đã rời phòng trước đó. Vui lòng tạo phòng mới từ dashboard.");
          setIsCreatingRoom(false);
          return;
        }

        if (cachedPin && cachedRoomId) {
          setRoomPin(cachedPin);
          setRoomId(cachedRoomId);
          try {
            const profile = await getMyProfile(accessToken);
            if (!isMounted) return;
            const displayName =
              profile.name?.trim() || profile.username?.trim() || profile.email;
            if (displayName) {
              setPlayerName(displayName);
            }
          } catch {
            // ignore profile load errors here
          }
          return;
        }

        const room = await createPrivateMatch(accessToken);
        if (!isMounted) {
          return;
        }

        setRoomPin(room.pinCode);
        setRoomId(room.matchId);
        if (room.pinCode) {
          localStorage.setItem(ROOM_PIN_STORAGE_KEY, room.pinCode);
        }
        if (room.matchId) {
          localStorage.setItem(ROOM_ID_STORAGE_KEY, room.matchId);
        }

        try {
          const profile = await getMyProfile(accessToken);
          if (!isMounted) {
            return;
          }

          const displayName =
            profile.name?.trim() || profile.username?.trim() || profile.email;
          if (displayName) {
            setPlayerName(displayName);
          }
        } catch {}
      } catch (error: unknown) {
        if (!isMounted) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Không thể tạo phòng. Vui lòng thử lại.";

        const cachedPin = localStorage.getItem(ROOM_PIN_STORAGE_KEY);
        if (
          cachedPin &&
          message.toLowerCase().includes("already in an active match")
        ) {
          setRoomPin(cachedPin);
          setRoomError(null);
          return;
        }

        setRoomError(message);
      } finally {
        if (isMounted) {
          setIsCreatingRoom(false);
        }
      }
    };

    bootstrapRoom();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCopyPin = async () => {
    if (isCreatingRoom || roomError || roomPin === "----") {
      return;
    }

    localStorage.setItem(ROOM_PIN_STORAGE_KEY, roomPin);

    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(roomPin);
        setCopyStatus("Đã sao chép mã PIN");
        return;
      } catch {}
    }

    try {
      const textArea = document.createElement("textarea");
      textArea.value = roomPin;
      textArea.setAttribute("readonly", "");
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.select();

      const isCopied = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (!isCopied) {
        throw new Error("Copy command failed");
      }
      setCopyStatus("Đã sao chép mã PIN");
    } catch {
      setCopyStatus("Không thể sao chép tự động. Vui lòng copy thủ công.");
    }
  };

  useEffect(() => {
    if (!copyStatus) {
      return;
    }

    const timer = setTimeout(() => {
      setCopyStatus(null);
    }, 2200);

    return () => clearTimeout(timer);
  }, [copyStatus]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_15%,_rgba(5,209,255,0.16),_rgba(8,30,54,0.92)_60%)] p-4 text-sky-200">
      <div className="mx-auto flex w-full max-w-[960px] flex-col gap-5">
        <section className="rounded-2xl border border-sky-200/30 bg-slate-950/40 p-6 shadow-[0_0_32px_rgba(0,160,255,0.25)] backdrop-blur-lg">

          <div className="mb-6 text-center">
            <h1 className="text-4xl font-black tracking-wide text-cyan-200">PHÒNG CHỜ</h1>
            <p className="mt-2 text-sm text-sky-100/70">
            Đang chờ người chơi thứ hai tham gia...
            </p>
          </div>

          <RoomPinSection
            roomPin={roomPin}
            isCreatingRoom={isCreatingRoom}
            roomError={roomError}
            copyStatus={copyStatus}
            onCopyPin={handleCopyPin}
          />

          <PlayerStatusSection playerName={playerName} />

          <MatchSettingsSection />

          <ActionButtonsSection
            onLeaveRoom={async () => {
              if (!roomId) {
                setRoomError("Không có ID phòng để rời");
                return;
              }

              try {
                setIsCreatingRoom(true);
                const accessToken = localStorage.getItem("accessToken");
                if (!accessToken) {
                  throw new Error("Thiếu access token. Vui lòng đăng nhập lại.");
                }

                await leaveMatch(roomId, accessToken);

                localStorage.removeItem(ROOM_PIN_STORAGE_KEY);
                localStorage.removeItem(ROOM_ID_STORAGE_KEY);
                localStorage.setItem(LEFT_ROOM_FLAG, "true");
                setRoomPin("----");
                setRoomId(null);
                router.push("/dashboard");
              } catch (err: unknown) {
                setRoomError(err instanceof Error ? err.message : "Rời phòng thất bại");
              } finally {
                setIsCreatingRoom(false);
              }
            }}
            onStartMatch={() => {
              // TODO: Sẵn sàng logic (chuyển sang game / socket)
            }}
          />
        </section>
      </div>
    </main>
  );
}
