"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Socket, io } from "socket.io-client";
import { createPrivateMatch, getActiveMatch, getMatchState, leaveMatch, MatchPlayer, startMatch } from "@/src/lib/api/match";
import { getMyProfile } from "@/src/lib/api/auth";
import { RoomPinSection } from "@/src/components/dashboard/waiting-room/RoomPinSection";
import { PlayerStatusSection } from "@/src/components/dashboard/waiting-room/PlayerStatusSection";
import { MatchSettingsSection } from "@/src/components/dashboard/waiting-room/MatchSettingsSection";
import { ActionButtonsSection } from "@/src/components/dashboard/waiting-room/ActionButtonsSection";

const ROOM_PIN_STORAGE_KEY = "currentRoomPin";
const ROOM_ID_STORAGE_KEY = "currentMatchId";
const LEFT_ROOM_FLAG = "leftRoom";

type ProfileResponse = {
  _id?: string;
  id?: string;
  userId?: string;
  name?: string;
  username?: string;
  email?: string;
};

export default function WaitingRoomPage() {
  const router = useRouter();
  const [roomId, setRoomId] = useState<string | null>(null);
  const [roomPin, setRoomPin] = useState("----");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [hostPlayer, setHostPlayer] = useState<MatchPlayer | null>(null);
  const [opponentPlayer, setOpponentPlayer] = useState<MatchPlayer | null>(null);
  const [isCreatingRoom, setIsCreatingRoom] = useState(true);
  const [roomError, setRoomError] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);

  const socketRef = useRef<Socket | null>(null);

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

        const profile = await getMyProfile(accessToken) as ProfileResponse;
        if (isMounted) {
          const uid = profile._id || profile.id || profile.userId || null;
          setCurrentUserId(uid);
        }

        if (cachedPin && cachedRoomId) {
          setRoomPin(cachedPin);
          setRoomId(cachedRoomId);
          return;
        }

        let room;
        try {
          room = await createPrivateMatch(accessToken);
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : "";
          if (!message.toLowerCase().includes("already in an active match")) {
            throw error;
          }

          const activeMatch = await getActiveMatch(accessToken);
          if (!activeMatch?.matchId) {
            throw error;
          }

          const state = await getMatchState(activeMatch.matchId, accessToken);
          room = {
            matchId: activeMatch.matchId,
            pinCode: state.pinCode || "----",
          };
        }

        if (isMounted) {
          setRoomPin(room.pinCode);
          setRoomId(room.matchId);
          if (room.pinCode) {
            localStorage.setItem(ROOM_PIN_STORAGE_KEY, room.pinCode);
          }
          if (room.matchId) {
            localStorage.setItem(ROOM_ID_STORAGE_KEY, room.matchId);
          }
        }
      } catch (error: unknown) {
        if (isMounted) {
          const message = error instanceof Error ? error.message : "Không thể tạo phòng.";
          setRoomError(message);
        }
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

  const syncMatchState = async () => {
    if (!roomId) {
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return;
    }

    try {
      const state = await getMatchState(roomId, accessToken);

      if (state.pinCode) {
        setRoomPin(state.pinCode);
        localStorage.setItem(ROOM_PIN_STORAGE_KEY, state.pinCode);
      }

      const host = state.players.find((player) => player.userId === state.hostId || player.isHost);
      const opponent = state.players.find((player) => player.userId !== state.hostId && player.userId !== host?.userId);

      setHostPlayer(host ? { ...host, isHost: true } : null);
      setOpponentPlayer(opponent ? { ...opponent, isHost: false } : null);

      if (state.hostId && currentUserId) {
        setIsHost(state.hostId === currentUserId);
      }

      const me = state.players.find((player) => player.userId === currentUserId);
      if (me) {
        setIsReady(me.isReady);
      }
    } catch {
      setRoomError("Không thể đồng bộ trạng thái phòng.");
    }
  };

  useEffect(() => {
    if (!roomId) {
      return;
    }

    syncMatchState();
    const interval = setInterval(syncMatchState, 4000);

    return () => {
      clearInterval(interval);
    };
  }, [roomId, currentUserId]);

  const handleToggleReady = () => {
    if (!socketRef.current?.connected || !roomId) {
      return;
    }

    socketRef.current.emit("toggle_ready", {
      matchId: roomId,
      ready: !isReady,
    });
    setIsReady(!isReady);
  };

  useEffect(() => {
    if (!roomId) {
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return;
    }

    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8080";
    const socket = io(serverUrl, {
      auth: { token: accessToken },
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("join_room", { matchId: roomId });
    });

    socket.on("player_joined", syncMatchState);
    socket.on("player_left", syncMatchState);
    socket.on("ready_update", syncMatchState);
    socket.on("match_state", syncMatchState);
    socket.on("start_game", () => {
      router.push(`/game?matchId=${roomId}`);
    });
    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId, router]);

  const handleCopyPin = async () => {
    if (isCreatingRoom || roomError || roomPin === "----") {
      return;
    }

    try {
      await navigator.clipboard.writeText(roomPin);
      setCopyStatus("Đã sao chép!");
    } catch {
      setCopyStatus("Lỗi copy!");
    }
  };

  useEffect(() => {
    if (!copyStatus) {
      return;
    }

    const timer = setTimeout(() => setCopyStatus(null), 2000);
    return () => clearTimeout(timer);
  }, [copyStatus]);

  const handleStartMatch = async () => {
    if (!roomId) {
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setRoomError("Thiếu access token. Vui lòng đăng nhập lại.");
      return;
    }

    try {
      await startMatch(roomId, accessToken);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Không thể bắt đầu trận";
      setRoomError(message);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_15%,_rgba(5,209,255,0.16),_rgba(8,30,54,0.92)_60%)] p-4 text-sky-200">
      <div className="mx-auto flex w-full max-w-[960px] flex-col gap-5">
        <section className="rounded-2xl border border-sky-200/30 bg-slate-950/40 p-6 shadow-2xl backdrop-blur-lg">
          <div className="mb-6 text-center">
            <h1 className="text-4xl font-black tracking-wide text-cyan-200">PHÒNG CHỜ</h1>
            <p className="mt-2 text-sm text-sky-100/70">Đang chờ đối thủ...</p>
          </div>

          <RoomPinSection
            roomPin={roomPin}
            isCreatingRoom={isCreatingRoom}
            roomError={roomError}
            copyStatus={copyStatus}
            onCopyPin={handleCopyPin}
          />

          <PlayerStatusSection
            host={hostPlayer ?? { userId: "", displayName: "Chủ phòng", avatar: "", isReady: true, rank: 0, playerNumber: 1, health: 3 }}
            opponent={opponentPlayer}
          />

          <MatchSettingsSection />

          <ActionButtonsSection
            isHost={isHost}
            isReady={isReady}
            canStart={Boolean(opponentPlayer?.isReady) && isConnected}
            onToggleReady={handleToggleReady}
            onLeaveRoom={async () => {
              if (!roomId) {
                return;
              }

              try {
                const accessToken = localStorage.getItem("accessToken");
                if (accessToken) {
                  await leaveMatch(roomId, accessToken);
                }
                localStorage.removeItem(ROOM_PIN_STORAGE_KEY);
                localStorage.removeItem(ROOM_ID_STORAGE_KEY);
                localStorage.setItem(LEFT_ROOM_FLAG, "true");
                router.push("/dashboard");
              } catch (error: unknown) {
                const message = error instanceof Error ? error.message : "Không thể rời phòng";
                setRoomError(message);
              }
            }}
            onStartMatch={handleStartMatch}
          />
        </section>
      </div>
    </main>
  );
}
