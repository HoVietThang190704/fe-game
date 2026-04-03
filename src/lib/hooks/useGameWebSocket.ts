import { useEffect, useState, useRef, useCallback } from "react";
import { Socket, io } from "socket.io-client";

export interface StompMessage {
  type: string;
  payload: unknown;
}

interface WebSocketHookOptions {
  matchId?: string;
  onMessage?: (message: StompMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: unknown) => void;
}

export const useGameWebSocket = (options: WebSocketHookOptions = {}) => {
  const { matchId, onMessage, onConnect, onDisconnect, onError } = options;
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const onMessageRef = useRef(onMessage);
  const onConnectRef = useRef(onConnect);
  const onDisconnectRef = useRef(onDisconnect);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onMessageRef.current = onMessage;
    onConnectRef.current = onConnect;
    onDisconnectRef.current = onDisconnect;
    onErrorRef.current = onError;
  }, [onMessage, onConnect, onDisconnect, onError]);

  const connect = useCallback(() => {
    if (!matchId) {
      return;
    }

    const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!accessToken) {
      setError("Missing access token");
      return;
    }

    try {
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8080";
      const socket = io(serverUrl, {
        auth: { token: accessToken },
        transports: ["websocket", "polling"],
      });

      socketRef.current = socket;

      socket.on("connect", () => {
        setIsConnected(true);
        setError(null);
        socket.emit("join_room", { matchId });
        onConnectRef.current?.();
      });

      socket.on("disconnect", () => {
        setIsConnected(false);
        onDisconnectRef.current?.();
      });

      socket.on("connect_error", (eventError) => {
        setError("Connection error");
        onErrorRef.current?.(eventError);
      });

      const forwardEvents = [
        "start_game",
        "move_result",
        "turn_switched",
        "turn_timeout",
        "game_over",
        "ready_update",
        "match_state",
        "player_joined",
        "player_left",
        "timer_tick",
      ];

      forwardEvents.forEach((eventName) => {
        socket.on(eventName, (payload: unknown) => {
          onMessageRef.current?.({ type: eventName, payload });
        });
      });

      socket.on("error", (payload: unknown) => {
        onErrorRef.current?.(payload);
      });
    } catch (e) {
      setError("Failed to connect");
      onErrorRef.current?.(e);
    }
  }, [matchId]);

  const send = useCallback((destination: string, body: unknown) => {
    const socket = socketRef.current;
    if (!socket?.connected) {
      return;
    }

    const eventName = destination.replace(/^\/app\//, "");
    socket.emit(eventName, body);
  }, []);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    if (!matchId) {
      return;
    }
    connect();

    return () => {
      disconnect();
    };
  }, [matchId, connect, disconnect]);

  return {
    isConnected,
    error,
    send,
    disconnect,
    reconnect: connect,
  };
};
