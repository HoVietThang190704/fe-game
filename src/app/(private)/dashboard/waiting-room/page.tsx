"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { createPrivateMatch, leaveMatch, getMatchState, getActiveMatch, MatchPlayer } from "@/src/lib/api/match";
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
  const [isReady, setIsReady] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [hostPlayer, setHostPlayer] = useState<MatchPlayer | null>(null);
  const [opponentPlayer, setOpponentPlayer] = useState<MatchPlayer | null>(null);
  const [isCreatingRoom, setIsCreatingRoom] = useState(true);
  const [roomError, setRoomError] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [matchHostId, setMatchHostId] = useState<string | null>(null);

  const stompClientRef = useRef<Client | null>(null);

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

        try {
          const profile = await getMyProfile(accessToken);
          console.log("Full User Profile:", profile); // Debugging log
          if (isMounted) {
            // Mapping currentUserId with fallbacks depending on backend field name
            const uid = profile._id || (profile as any).id || (profile as any).userId;
            setCurrentUserId(uid);
            console.log("Mapped currentUserId:", uid);

            const displayName =
              profile.name?.trim() || profile.username?.trim() || profile.email;
            if (displayName) {
              setPlayerName(displayName);
            }
          }
        } catch (err) {
          console.error("Profile load error:", err);
        }

        if (cachedPin && cachedRoomId) {
          setRoomPin(cachedPin);
          setRoomId(cachedRoomId);
        } else {
          let room;
          try {
            room = await createPrivateMatch(accessToken);
          } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "";
            if (message.toLowerCase().includes("already in an active match")) {
              const activeMatch = await getActiveMatch(accessToken);
              if (activeMatch && activeMatch.matchId) {
                const state = await getMatchState(activeMatch.matchId, accessToken);
                room = {
                  matchId: activeMatch.matchId,
                  pinCode: state.pinCode || "----"
                };
              } else {
                throw error;
              }
            } else {
              throw error;
            }
          }

          if (isMounted) {
            setRoomPin(room.pinCode);
            setRoomId(room.matchId);
            if (room.pinCode) localStorage.setItem(ROOM_PIN_STORAGE_KEY, room.pinCode);
            if (room.matchId) localStorage.setItem(ROOM_ID_STORAGE_KEY, room.matchId);
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
    return () => { isMounted = false; };
  }, []);

  const syncMatchState = async () => {
    if (!roomId) return;
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    try {
      const state = await getMatchState(roomId, accessToken);
      if (state.pinCode) {
        setRoomPin(state.pinCode);
        localStorage.setItem(ROOM_PIN_STORAGE_KEY, state.pinCode);
      }

      console.log("Sync Match State Data:", state); // Debugging log

      if (state.players) {
        const host = state.players.find((p) => p.userId === state.hostId || p.isHost);
        const opponent = state.players.find((p) => p.userId !== state.hostId && p.userId !== host?.userId);

        console.log("Identification Results:", { 
          stateHostId: state.hostId, 
          currentUserId, 
          isHostMatch: state.hostId === currentUserId,
          hostFound: host?.userId,
          opponentFound: opponent?.userId
        });

        if (host) {
          setHostPlayer({ ...host, isHost: true });
        }
        
        if (opponent) {
          setOpponentPlayer({ ...opponent, isHost: false });
          setOpponentName(opponent.displayName);
        } else {
          setOpponentPlayer(null);
          setOpponentName(null);
        }

        // Cập nhật isHost cho state cục bộ dựa trên ObjectId (hostId từ backend là ObjectId string)
        if (state.hostId && currentUserId) {
          const matching = state.hostId === currentUserId;
          setIsHost(matching);
        }
        
        const me = state.players.find(p => p.userId === currentUserId);
        if (me) {
          setIsReady(me.isReady);
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
    return () => clearInterval(interval);
  }, [roomId, currentUserId]);

  const handleToggleReady = () => {
    if (stompClientRef.current?.connected) {
      stompClientRef.current.publish({
        destination: "/app/toggle_ready",
        body: JSON.stringify({
          matchId: roomId,
          userId: currentUserId,
          ready: !isReady,
        }),
      });
      setIsReady(!isReady);
    }
  };

  useEffect(() => {
    if (!roomId) return;

    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8080";
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    const stompClient = new Client({
      webSocketFactory: () => new SockJS(`${serverUrl}/ws-game?token=${accessToken}`),
      connectHeaders: { Authorization: `Bearer ${accessToken}` },
      debug: (str) => console.log("STOMP: " + str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClientRef.current = stompClient;

    stompClient.onConnect = () => {
      console.log("STOMP connected!");
      setIsConnected(true);

      stompClient.subscribe(`/topic/match/${roomId}`, (message) => {
        if (message.body) {
          const data = JSON.parse(message.body);
          if (["PLAYER_JOINED", "PLAYER_LEFT", "ready_update"].includes(data.type)) {
            syncMatchState();
          } else if (data.type === "MATCH_STARTED" || data.type === "start_game") {
            router.push(`/game?matchId=${roomId}`);
          }
        }
      });

      stompClient.publish({
        destination: `/app/match/${roomId}/join`,
        body: JSON.stringify({ playerName: playerName }),
      });
    };

    stompClient.onStompError = (frame) => {
      console.error("STOMP Error:", frame.headers["message"]);
    };

    stompClient.onWebSocketClose = () => {
      setIsConnected(false);
    };

    stompClient.activate();

    return () => {
      if (accessToken && roomId) leaveMatch(roomId, accessToken).catch(() => {});
      stompClient.deactivate();
    };
  }, [roomId, router]);

  const handleCopyPin = async () => {
    if (isCreatingRoom || roomError || roomPin === "----") return;
    try {
      await navigator.clipboard.writeText(roomPin);
      setCopyStatus("Đã sao chép!");
    } catch {
      setCopyStatus("Lỗi copy!");
    }
  };

  useEffect(() => {
    if (!copyStatus) return;
    const timer = setTimeout(() => setCopyStatus(null), 2000);
    return () => clearTimeout(timer);
  }, [copyStatus]);

  const handleStartMatch = () => {
    if (stompClientRef.current?.connected) {
      stompClientRef.current.publish({
        destination: `/app/match/${roomId}/start`,
        body: JSON.stringify({}),
      });
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
            host={hostPlayer ?? { userId: matchHostId || "", displayName: "Chủ phòng", avatar: "", isReady: true, rank: 0, playerNumber: 1, health: 3 }}
            opponent={opponentPlayer}
          />

          <MatchSettingsSection />

          <ActionButtonsSection
            isHost={isHost}
            isReady={isReady}
            canStart={!!(opponentPlayer?.isReady) && isConnected}
            onToggleReady={handleToggleReady}
            onLeaveRoom={async () => {
              if (!roomId) return;
              try {
                const accessToken = localStorage.getItem("accessToken");
                if (accessToken) await leaveMatch(roomId, accessToken);
                localStorage.removeItem(ROOM_PIN_STORAGE_KEY);
                localStorage.removeItem(ROOM_ID_STORAGE_KEY);
                localStorage.setItem(LEFT_ROOM_FLAG, "true");
                router.push("/dashboard");
              } catch (err: any) {
                setRoomError(err.message);
              }
            }}
            onStartMatch={handleStartMatch}
          />
        </section>
      </div>
    </main>
  );
}
