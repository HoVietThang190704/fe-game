"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Shield, Swords, Timer, XCircle } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { findRandomMatch, cancelRandomMatch, getActiveMatch } from "@/src/lib/api/match";
import { getUserProfile } from "@/src/lib/api/user";

type BoardSize = "small" | "medium" | "large";
type SearchStatus = "idle" | "searching" | "matched" | "error";

type CurrentUser = {
  id: string;
  username?: string;
  name?: string;
  email?: string;
};

const BOARD_LABEL: Record<BoardSize, string> = {
  small: "Nhỏ (8x8)",
  medium: "Trung bình (10x10)",
  large: "Lớn (12x12)",
};

export default function QuickMatchPage() {
  const router = useRouter();
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [boardSize, setBoardSize] = useState<BoardSize>("medium");
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [user, setUser] = useState<CurrentUser | null>(null);

  const accessToken = useMemo(() => {
    if (typeof window === "undefined") {
      return null;
    }
    return localStorage.getItem("accessToken");
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      if (!accessToken) {
        router.replace("/login");
        return;
      }

      try {
        const profile = (await getUserProfile("id,username,name,email")) as unknown as CurrentUser;
        if (!mounted) {
          return;
        }

        if (!profile?.id) {
          throw new Error("Không lấy được thông tin người chơi");
        }

        setUser(profile);
      } catch (err: unknown) {
        if (!mounted) {
          return;
        }

        const message = err instanceof Error ? err.message : "Không thể tải thông tin người dùng";
        setError(message);
        setStatus("error");
      }
    };

    loadUser();
    return () => {
      mounted = false;
    };
  }, [accessToken, router]);

  useEffect(() => {
    if (status !== "searching") {
      return;
    }

    const timerId = window.setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [status]);

  useEffect(() => {
    if (status !== "searching" || !accessToken || !user?.id) {
      return;
    }

    let disposed = false;
    const pollingId = window.setInterval(async () => {
      try {
        const activeMatch = await getActiveMatch(accessToken);
        if (disposed || !activeMatch?.matchId) {
          return;
        }

        setStatus("matched");
        router.push(`/game?matchId=${encodeURIComponent(activeMatch.matchId)}&userId=${encodeURIComponent(user.id)}`);
      } catch (err: unknown) {
        if (disposed) {
          return;
        }

        const message = err instanceof Error ? err.message : "Không thể kiểm tra trạng thái ghép trận";
        setError(message);
        setStatus("error");
      }
    }, 3000);

    return () => {
      disposed = true;
      window.clearInterval(pollingId);
    };
  }, [status, accessToken, user?.id, router]);

  const startSearch = useCallback(async () => {
    if (!accessToken || !user?.id) {
      setError("Vui lòng đăng nhập lại để tìm trận");
      setStatus("error");
      return;
    }

    try {
      setStatus("searching");
      setError(null);
      setElapsed(0);
      await findRandomMatch(accessToken, boardSize);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Không thể bắt đầu tìm trận";
      setError(message);
      setStatus("error");
    }
  }, [accessToken, boardSize, user?.id]);

  const cancelSearch = useCallback(async () => {
    if (!accessToken) {
      return;
    }

    try {
      await cancelRandomMatch(accessToken);
      setStatus("idle");
      setElapsed(0);
      setError(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Không thể hủy tìm trận";
      setError(message);
      setStatus("error");
    }
  }, [accessToken]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_15%,_rgba(5,209,255,0.16),_rgba(8,30,54,0.92)_60%)] p-6 text-sky-200">
      <div className="mx-auto max-w-3xl rounded-2xl border border-sky-200/30 bg-slate-950/45 p-6 shadow-[0_0_32px_rgba(0,160,255,0.25)] backdrop-blur-lg md:p-8">
        <h1 className="text-4xl font-black tracking-wide text-cyan-200">GHÉP TRẬN NGẪU NHIÊN</h1>
        <p className="mt-2 text-sky-100/75">Hệ thống sẽ tìm đối thủ gần rank và ghép trận tự động.</p>

        <section className="mt-7 grid gap-4 md:grid-cols-3">
          {(Object.keys(BOARD_LABEL) as BoardSize[]).map((size) => (
            <button
              key={size}
              type="button"
              disabled={status === "searching"}
              onClick={() => setBoardSize(size)}
              className={`rounded-xl border px-4 py-3 text-left transition ${
                boardSize === size
                  ? "border-cyan-300 bg-cyan-500/20 text-cyan-100"
                  : "border-sky-200/30 bg-slate-900/60 text-sky-100/80 hover:bg-slate-800/70"
              } ${status === "searching" ? "cursor-not-allowed opacity-60" : ""}`}
            >
              <p className="font-bold">{BOARD_LABEL[size]}</p>
              <p className="mt-1 text-xs opacity-80">Chế độ tìm trận công khai</p>
            </button>
          ))}
        </section>

        <section className="mt-6 rounded-xl border border-sky-200/25 bg-slate-900/45 p-4">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="inline-flex items-center gap-2"><Shield className="size-4" /> Người chơi: {user?.name || user?.username || user?.email || "-"}</span>
            <span className="inline-flex items-center gap-2"><Swords className="size-4" /> Trạng thái: {status === "idle" ? "Sẵn sàng" : status === "searching" ? "Đang tìm đối thủ" : status === "matched" ? "Đã ghép trận" : "Lỗi"}</span>
            <span className="inline-flex items-center gap-2"><Timer className="size-4" /> Thời gian chờ: {elapsed}s</span>
          </div>
        </section>

        {status === "searching" ? (
          <div className="mt-6 flex gap-3">
            <Button type="button" className="h-12 flex-1 border border-cyan-300/45 bg-cyan-500/20 text-base font-bold text-cyan-100 hover:bg-cyan-500/35">
              <Loader2 className="mr-2 size-4 animate-spin" /> Đang tìm trận...
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={cancelSearch}
              className="h-12 border-red-300/45 bg-red-500/10 text-red-200 hover:bg-red-500/20"
            >
              <XCircle className="mr-2 size-4" /> Hủy
            </Button>
          </div>
        ) : (
          <div className="mt-6 flex gap-3">
            <Button
              type="button"
              onClick={startSearch}
              className="h-12 flex-1 border border-cyan-300/45 bg-cyan-500/20 text-base font-bold text-cyan-100 hover:bg-cyan-500/35"
            >
              Bắt đầu tìm trận
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard")}
              className="h-12 border-sky-200/40 bg-slate-900/60 text-cyan-100 hover:bg-slate-800/70"
            >
              Quay lại
            </Button>
          </div>
        )}

        {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
      </div>
    </main>
  );
}
