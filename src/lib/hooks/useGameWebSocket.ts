import { useEffect, useState, useRef, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export interface StompMessage {
  type: string;
  payload: any;
}

interface WebSocketHookOptions {
  matchId?: string;
  userId?: string; // Add userId to support personal matchmaking topics
  onMessage?: (message: StompMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
}

export const useGameWebSocket = (options: WebSocketHookOptions = {}) => {
  const { matchId, userId, onMessage, onConnect, onDisconnect, onError } = options;
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const stompClientRef = useRef<Client | null>(null);
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

  const disconnect = useCallback(() => {
    if (stompClientRef.current) {
      console.log("Disconnecting STOMP client...");
      stompClientRef.current.deactivate();
      stompClientRef.current = null;
      setIsConnected(false);
    }
  }, []);

  const connect = useCallback(() => {
    if (stompClientRef.current && stompClientRef.current.active) {
      return;
    }

    const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!accessToken) {
      setError("Missing access token");
      return;
    }

    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8080";
    // Spring Boot STOMP endpoint with SockJS fallback
    console.log("Connecting to WebSocket at:", serverUrl + "/ws-game?token=" + accessToken);
    const client = new Client({
      webSocketFactory: () => new SockJS(serverUrl + "/ws-game?token=" + accessToken),
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      debug: (str) => {
        console.log("STOMP Debug:", str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = (frame) => {
      console.log("STOMP Connected:", frame);
      setIsConnected(true);
      setError(null);
      onConnectRef.current?.();

      // Subscribe to match-specific topic
      if (matchId) {
        console.log(`Subscribing to /topic/match.${matchId}`);
        client.subscribe(`/topic/match.${matchId}`, (message) => {
          try {
            const body = JSON.parse(message.body);
            // Assuming the backend WsEvent has "type" and "payload"
            onMessageRef.current?.({
              type: body.type || "unknown",
              payload: body.payload || body,
            });
          } catch (e) {
            console.error("Failed to parse STOMP message", e);
          }
        });
      }

      // Subscribe to user-specific matchmaking topic
      if (userId) {
        console.log(`Subscribing to /topic/user.${userId}.matchmaking`);
        client.subscribe(`/topic/user.${userId}.matchmaking`, (message) => {
          try {
            const body = JSON.parse(message.body);
            onMessageRef.current?.({
              type: body.type || "match_found",
              payload: body.payload || body,
            });
          } catch (e) {
            console.error("Failed to parse matchmaking message", e);
          }
        });
      }
    };

    client.onStompError = (frame) => {
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Additional details: " + frame.body);
      setError("STOMP Error: " + frame.headers["message"]);
      onErrorRef.current?.(frame);
    };

    client.onWebSocketClose = () => {
      console.log("WebSocket connection closed");
      setIsConnected(false);
      onDisconnectRef.current?.();
    };

    client.activate();
    stompClientRef.current = client;
  }, [matchId, userId]);

  const send = useCallback((destination: string, body: any) => {
    if (stompClientRef.current && stompClientRef.current.connected) {
      // Standard STOMP publish
      stompClientRef.current.publish({
        destination,
        body: JSON.stringify(body),
      });
    } else {
      console.warn("Cannot send message: STOMP client not connected");
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    error,
    send,
    disconnect,
    reconnect: connect,
  };
};
