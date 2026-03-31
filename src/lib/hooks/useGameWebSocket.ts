import { useEffect, useState, useRef, useCallback } from 'react';
import { Client, Frame, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export interface StompMessage {
  type: string;
  payload: any;
}

interface WebSocketHookOptions {
  matchId?: string;
  onMessage?: (message: StompMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
}

export const useGameWebSocket = (options: WebSocketHookOptions = {}) => {
  const { matchId, onMessage, onConnect, onDisconnect, onError } = options;
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clientRef = useRef<Client | null>(null);
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
    try {
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8080';
      const wsUrl = `${serverUrl.replace(/\/$/, '')}/ws-game`;

      const client = new Client({
        webSocketFactory: () => new SockJS(wsUrl),
        reconnectDelay: 2000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          console.log('STOMP connected');
          setIsConnected(true);
          setError(null);
          onConnectRef.current?.();

          // Subscribe to game updates for the current match only
          client.subscribe(`/topic/match.${matchId}`, (message: Message) => {
            try {
              const body = JSON.parse(message.body);
              onMessageRef.current?.(body);
            } catch (e) {
              console.error('Failed to parse STOMP message:', e);
            }
          });
        },
        onDisconnect: () => {
          console.log('STOMP disconnected');
          setIsConnected(false);
          onDisconnectRef.current?.();
        },
        onStompError: (frame: Frame) => {
          console.error('STOMP error:', frame);
          setError('Connection error');
          onErrorRef.current?.(frame);
        },
      });

      clientRef.current = client;
      client.activate();
    } catch (e) {
      console.error('Failed to create STOMP client:', e);
      setError('Failed to connect');
      onErrorRef.current?.(e);
    }
  }, [matchId]);

  const send = useCallback((destination: string, body: any) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({
        destination,
        body: JSON.stringify(body),
      });
    } else {
      console.warn('STOMP client not connected');
    }
  }, []);

  const disconnect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.deactivate();
      clientRef.current = null;
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
