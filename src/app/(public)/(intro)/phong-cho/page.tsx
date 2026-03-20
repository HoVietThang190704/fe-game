"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Crown, Copy, Gamepad2, HelpCircle, Clock3, CircleCheck } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { createPrivateMatch } from "@/src/lib/api/match";
import { getMyProfile } from "@/src/lib/api/auth";

const ROOM_PIN_STORAGE_KEY = "currentRoomPin";

export default function WaitingRoomPage() {
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

        const room = await createPrivateMatch(accessToken);
        if (!isMounted) {
          return;
        }

        setRoomPin(room.pinCode);
        localStorage.setItem(ROOM_PIN_STORAGE_KEY, room.pinCode);
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
    <div className="public-screen flex items-center justify-center">
      <main className="glass-panel w-full max-w-4xl rounded-4xl px-6 py-7 text-white md:px-8 md:py-8">
        <div className="mb-7 flex items-center justify-center gap-4">
          <Image
            src="/images/Logo.png"
            alt="Minesweeper PvP"
            width={280}
            height={64}
            className="h-12 w-auto object-contain md:h-14"
            priority
          />
        </div>

        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Phòng chờ</h1>
          <p className="mt-2 text-sm text-white/75">
            Đang chờ người chơi thứ hai tham gia...
          </p>
        </div>

        <section className="glass-panel mb-6 rounded-3xl p-5 md:p-6">
          <p className="mb-3 text-center text-sm font-medium text-white/70">Mã PIN phòng</p>
          <div className="flex items-center justify-center gap-3">
            <div className="rounded-2xl bg-black/30 px-7 py-3 text-5xl font-extrabold tracking-[0.45em] md:text-6xl">
              {roomPin}
            </div>
            <Button
              type="button"
              size="icon"
              onClick={handleCopyPin}
              aria-label="Copy room pin"
              disabled={isCreatingRoom || roomPin === "----"}
              className="h-12 w-12 rounded-xl bg-fuchsia-500/90 text-white hover:bg-fuchsia-500"
            >
              <Copy className="size-5" />
            </Button>
          </div>
          {isCreatingRoom && (
            <p className="mt-3 text-center text-sm text-white/70">Đang tạo phòng...</p>
          )}
          {roomError && (
            <p className="mt-3 text-center text-sm text-red-300">{roomError}</p>
          )}
          {copyStatus && (
            <p className="mt-3 text-center text-sm text-emerald-300">{copyStatus}</p>
          )}
        </section>

        <section className="mb-6 grid gap-4 md:grid-cols-2">
          <article className="glass-panel rounded-3xl border-emerald-300/45 p-4">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-fuchsia-500/65">
                <Gamepad2 className="size-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-semibold leading-none">{playerName}</p>
                  <Crown className="size-5 text-amber-300" />
                </div>
                <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-300">
                  <CircleCheck className="size-4" />
                  Sẵn sàng
                </p>
              </div>
            </div>
          </article>

          <article className="glass-panel rounded-3xl p-4">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-pink-500/65">
                <HelpCircle className="size-7 text-white" />
              </div>
              <div>
                <p className="text-2xl font-semibold leading-none">Đang chờ...</p>
                <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-white/65">
                  <Clock3 className="size-4" />
                  Đang chờ...
                </p>
              </div>
            </div>
          </article>
        </section>

        <section className="glass-panel mb-6 rounded-3xl p-5 md:p-6">
          <h2 className="mb-4 text-2xl font-semibold">Cài đặt trận đấu</h2>
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            <div>
              <p className="text-sm text-white/65">Kích thước bản đồ</p>
              <p className="mt-1 text-2xl font-bold">10 x 10</p>
            </div>
            <div>
              <p className="text-sm text-white/65">Số lượng bom</p>
              <p className="mt-1 text-2xl font-bold">20 bom</p>
            </div>
            <div>
              <p className="text-sm text-white/65">Máu mỗi người</p>
              <p className="mt-1 text-2xl font-bold">3 máu</p>
            </div>
            <div>
              <p className="text-sm text-white/65">Thời gian mỗi lượt</p>
              <p className="mt-1 text-2xl font-bold">30 giây</p>
            </div>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          <Button
            type="button"
            className="h-12 rounded-2xl border border-white/30 bg-white/10 text-base font-semibold text-white hover:bg-white/20"
          >
            Rời phòng
          </Button>
          <Button
            type="button"
            className="h-12 rounded-2xl border-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-base font-semibold text-white hover:opacity-95"
          >
            Bắt đầu trận đấu
          </Button>
        </section>
      </main>
    </div>
  );
}
