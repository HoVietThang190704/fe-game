import { useEffect, useState, useRef, useCallback } from 'react';
import { Client, Frame, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export interface StompMessage {
  type: string;
  payload: any;
}

interface WebSocketHookOptions {
  onMessage?: (message: StompMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
}

export const useGameWebSocket = (options: WebSocketHookOptions = {}) => {
  const { onMessage, onConnect, onDisconnect, onError } = options;
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clientRef = useRef<Client | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelayRef = useRef(1000);

  const connect = useCallback(() => {
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = process.env.NEXT_PUBLIC_API_URL?.replace('http://', '').replace('https://', '') || 'localhost:8080';
      const wsUrl = `${protocol}//${host}/ws-game`;

      const client = new Client({
        webSocketFactory: () => new SockJS(wsUrl),
        reconnectDelay: reconnectDelayRef.current,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          console.log('STOMP connected');
          setIsConnected(true);
          setError(null);
          reconnectAttemptsRef.current = 0;
          reconnectDelayRef.current = 1000;
          onConnect?.();

          // Subscribe to game updates
          client.subscribe('/topic/match/*', (message: Message) => {
            try {
              const body = JSON.parse(message.body);
              onMessage?.(body);
            } catch (e) {
              console.error('Failed to parse STOMP message:', e);
            }
          });
        },
        onDisconnect: () => {
          console.log('STOMP disconnected');
          setIsConnected(false);
          onDisconnect?.();
          attemptReconnect();
        },
        onStompError: (frame: Frame) => {
          console.error('STOMP error:', frame);
          setError('Connection error');
          onError?.(frame);
        },
      });

      client.activate();
      clientRef.current = client;
    } catch (e) {
      console.error('Failed to create STOMP client:', e);
      setError('Failed to connect');
      onError?.(e);
    }
  }, [onMessage, onConnect, onDisconnect, onError]);

  const attemptReconnect = useCallback(() => {
    if (reconnectAttemptsRef.current < maxReconnectAttempts) {
      reconnectAttemptsRef.current += 1;
      setTimeout(() => {
        console.log(`Reconnecting... (attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);
        connect();
      }, reconnectDelayRef.current);
      reconnectDelayRef.current = Math.min(reconnectDelayRef.current * 2, 10000);
    } else {
      setError('Failed to connect after multiple attempts');
    }
  }, [connect]);

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
    if (clientRef.current?.connected) {
      clientRef.current.deactivate();
      clientRef.current = null;
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
