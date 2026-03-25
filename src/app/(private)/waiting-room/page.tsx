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
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_15%,_rgba(5,209,255,0.16),_rgba(8,30,54,0.92)_60%)] p-6 pt-4 text-sky-200">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6">
        <section className="rounded-2xl border border-sky-200/30 bg-slate-950/40 p-6 shadow-[0_0_32px_rgba(0,160,255,0.25)] backdrop-blur-lg">
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
            <h1 className="text-4xl font-black tracking-wide text-cyan-200">PHÒNG CHỜ</h1>
            <p className="mt-2 text-sm text-sky-100/70">
            Đang chờ người chơi thứ hai tham gia...
            </p>
          </div>

          <section className="mb-6 rounded-2xl border border-sky-300/20 bg-slate-900/40 p-5 md:p-6">
            <p className="mb-3 text-center text-sm font-semibold tracking-widest text-cyan-200/80">MÃ PIN PHÒNG</p>
            <div className="flex items-center justify-center gap-3">
              <div className="rounded-2xl bg-slate-950/70 px-7 py-3 text-5xl font-extrabold tracking-[0.45em] text-cyan-100 md:text-6xl">
                {roomPin}
              </div>
              <Button
                type="button"
                size="icon"
                onClick={handleCopyPin}
                aria-label="Copy room pin"
                disabled={isCreatingRoom || roomPin === "----"}
                className="h-12 w-12 rounded-xl border border-cyan-300/40 bg-cyan-500/20 text-cyan-100 hover:bg-cyan-500/35"
              >
                <Copy className="size-5" />
              </Button>
            </div>
            {isCreatingRoom && (
              <p className="mt-3 text-center text-sm text-sky-100/70">Đang tạo phòng...</p>
            )}
            {roomError && (
              <p className="mt-3 text-center text-sm text-red-300">{roomError}</p>
            )}
            {copyStatus && (
              <p className="mt-3 text-center text-sm text-emerald-300">{copyStatus}</p>
            )}
          </section>

          <section className="mb-6 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-emerald-300/40 bg-slate-900/50 p-4">
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-cyan-500/20">
                  <Gamepad2 className="size-7 text-cyan-200" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold leading-none text-cyan-50">{playerName}</p>
                    <Crown className="size-5 text-amber-300" />
                  </div>
                  <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-300">
                    <CircleCheck className="size-4" />
                    Sẵn sàng
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-sky-200/20 bg-slate-900/50 p-4">
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-fuchsia-500/20">
                  <HelpCircle className="size-7 text-fuchsia-200" />
                </div>
                <div>
                  <p className="text-2xl font-bold leading-none text-cyan-50">Đang chờ...</p>
                  <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-sky-100/65">
                    <Clock3 className="size-4" />
                    Đang chờ...
                  </p>
                </div>
              </div>
            </article>
          </section>

          <section className="mb-6 rounded-2xl border border-sky-200/20 bg-slate-900/45 p-5 md:p-6">
            <h2 className="mb-4 text-3xl font-black tracking-wide text-cyan-300">CÀI ĐẶT TRẬN ĐẤU</h2>
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              <div>
                <p className="text-sm text-sky-100/65">Kích thước bản đồ</p>
                <p className="mt-1 text-2xl font-bold text-cyan-100">10 x 10</p>
              </div>
              <div>
                <p className="text-sm text-sky-100/65">Số lượng bom</p>
                <p className="mt-1 text-2xl font-bold text-cyan-100">20 bom</p>
              </div>
              <div>
                <p className="text-sm text-sky-100/65">Máu mỗi người</p>
                <p className="mt-1 text-2xl font-bold text-cyan-100">3 máu</p>
              </div>
              <div>
                <p className="text-sm text-sky-100/65">Thời gian mỗi lượt</p>
                <p className="mt-1 text-2xl font-bold text-cyan-100">30 giây</p>
              </div>
            </div>
          </section>

          <section className="grid gap-3 sm:grid-cols-2">
            <Button
              type="button"
              className="h-12 rounded-xl border border-sky-200/35 bg-slate-900/60 text-base font-bold text-cyan-100 hover:bg-slate-800/70"
            >
              Rời phòng
            </Button>
            <Button
              type="button"
              className="h-12 rounded-xl border border-cyan-300/45 bg-cyan-500/20 text-base font-bold text-cyan-100 hover:bg-cyan-500/35"
            >
              Bắt đầu trận đấu
            </Button>
          </section>
        </section>
      </div>
    </main>
  );
}
