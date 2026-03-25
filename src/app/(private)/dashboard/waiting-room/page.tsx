"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { createPrivateMatch, leaveMatch, getMatchState, MatchPlayer } from "@/src/lib/api/match";
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
  const [opponentName, setOpponentName] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [hostPlayer, setHostPlayer] = useState<MatchPlayer | null>(null);
  const [opponentPlayer, setOpponentPlayer] = useState<MatchPlayer | null>(null);
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
          setRoomError(
            "Bạn đã rời phòng trước đó. Vui lòng tạo phòng mới từ dashboard.",
          );
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

          setCurrentUserId(profile._id);

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

  const syncMatchState = async () => {
    if (!roomId) {
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.warn("No access token for match state sync");
      return;
    }

    try {
      const state = await getMatchState(roomId, accessToken);
      if (state.pinCode) {
        setRoomPin(state.pinCode);
        localStorage.setItem(ROOM_PIN_STORAGE_KEY, state.pinCode);
      }

      if (state.players && state.players.length > 0) {
        const host = state.players.find((p) => p.playerNumber === 1) ?? state.players[0];
        const opponent = state.players.find((p) => p.playerNumber !== host?.playerNumber);

        if (host) {
          setHostPlayer(host);
          if (host.displayName) {
            // if current user is host or no more accurate data
            if (host.userId === currentUserId) {
              setPlayerName(host.displayName);
            }
          }
        }

        if (opponent) {
          setOpponentPlayer(opponent);
          setOpponentName(opponent.displayName);
        } else {
          setOpponentPlayer(null);
          setOpponentName(null);
        }

        if (currentUserId) {
          const me = state.players.find((p) => p.userId === currentUserId);
          if (me?.displayName) {
            setPlayerName(me.displayName);
          }
        }
      }
    } catch (error) {
      console.error("fetch match state error", error);
    }
  };

  useEffect(() => {
    if (!roomId) return;

    syncMatchState();
    const interval = setInterval(syncMatchState, 4000);

    return () => {
      clearInterval(interval);
    };
  }, [roomId, currentUserId]);

  // ĐÃ SỬA LẠI HOÀN TOÀN THÀNH STOMP + SOCKJS CHO SPRING BOOT
  useEffect(() => {
    if (!roomId) return; // Chỉ chạy khi đã có ID phòng

    // Port mặc định của Spring Boot thường là 8080 (hoặc port bạn cấu hình)
    const serverUrl =
      process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8080";
    const accessToken = localStorage.getItem("accessToken");

    const stompClient = new Client({
      webSocketFactory: () => new SockJS(`${serverUrl}/ws`), // Đảm bảo backend có endpoint /ws
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`, // Truyền token nếu Spring Security yêu cầu
      },
      debug: (str) => {
        console.log("STOMP: " + str); // Hiển thị log kết nối ra console để dễ test
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    let isConnected = false;

    stompClient.onConnect = (frame) => {
      console.log("Đã kết nối STOMP qua SockJS thành công!");
      isConnected = true;

      // 1. Đăng ký lắng nghe kênh phòng (Topic)
      stompClient.subscribe(`/topic/match/${roomId}`, (message) => {
        if (message.body) {
          const data = JSON.parse(message.body);
          console.log("STOMP message received:", data);

          if (data.type === "PLAYER_JOINED") {
            console.log("Người chơi mới tham gia:", data);
            // Extract playerName from payload
            setOpponentName(data.payload?.playerName || data.playerName);
          } else if (data.type === "PLAYER_LEFT") {
            setOpponentName(null);
          } else if (data.type === "MATCH_STARTED") {
            // Chuyển sang màn hình chơi
            // router.push(`/game/${roomId}`);
          }
        }
      });

      // 2. Thông báo cho backend biết mình đã tham gia phòng
      stompClient.publish({
        destination: `/app/match/${roomId}/join`,
        body: JSON.stringify({
          playerName: playerName,
        }),
      });
    };

    stompClient.onStompError = (frame) => {
      console.error("Lỗi STOMP Server: " + frame.headers["message"]);
      console.error("Chi tiết: " + frame.body);
      isConnected = false;
    };

    // Kích hoạt kết nối
    stompClient.activate();

    // Cleanup khi component bị hủy (người dùng chuyển trang/tắt tab)
    return () => {
      // Use REST API for leaving instead of STOMP to avoid connection issues
      if (accessToken && roomId) {
        leaveMatch(roomId, accessToken).catch((error) => {
          console.error("Error leaving match:", error);
        });
      }

      // Gracefully close STOMP connection
      if (stompClient.active) {
        stompClient.deactivate();
      }
    };
  }, [roomId, router]); // Removed playerName from dependencies to avoid reconnections

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
            <h1 className="text-4xl font-black tracking-wide text-cyan-200">
              PHÒNG CHỜ
            </h1>
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

          <PlayerStatusSection
            host={hostPlayer ?? { userId: currentUserId ?? "", displayName: playerName, avatar: "", isReady: true }}
            opponent={opponentPlayer}
          />

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
                  throw new Error(
                    "Thiếu access token. Vui lòng đăng nhập lại.",
                  );
                }

                await leaveMatch(roomId, accessToken);

                localStorage.removeItem(ROOM_PIN_STORAGE_KEY);
                localStorage.removeItem(ROOM_ID_STORAGE_KEY);
                localStorage.setItem(LEFT_ROOM_FLAG, "true");
                setRoomPin("----");
                setRoomId(null);
                router.push("/dashboard");
              } catch (err: unknown) {
                setRoomError(
                  err instanceof Error ? err.message : "Rời phòng thất bại",
                );
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
