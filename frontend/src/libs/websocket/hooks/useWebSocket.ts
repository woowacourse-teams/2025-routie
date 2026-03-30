import { useCallback, useEffect, useRef } from 'react';

import { Client } from '@stomp/stompjs';

import type {
  UseWebSocketOptions,
  UseWebSocketReturn,
} from '@/libs/websocket/types/useWebSocket.types';

const RECONNECT_DELAY_MS = 3_000;

const useWebSocket = <T>({
  url,
  token,
  subscribeDestination,
  publishDestination,
  onMessage,
  onConnect,
  onDisconnect,
  onError,
}: UseWebSocketOptions<T>): UseWebSocketReturn => {
  const clientRef = useRef<Client | null>(null);
  const onMessageRef = useRef(onMessage);
  const onConnectRef = useRef(onConnect);
  const onDisconnectRef = useRef(onDisconnect);
  const onErrorRef = useRef(onError);
  const publishDestinationRef = useRef(publishDestination);

  useEffect(() => {
    onMessageRef.current = onMessage;
    onConnectRef.current = onConnect;
    onDisconnectRef.current = onDisconnect;
    onErrorRef.current = onError;
    publishDestinationRef.current = publishDestination;
  }, [onMessage, onConnect, onDisconnect, onError, publishDestination]);

  useEffect(() => {
    if (!url || !token) return;

    const client = new Client({
      brokerURL: url,
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: RECONNECT_DELAY_MS,
      onConnect: () => {
        console.log(`[WS] 연결 성공 (${url})`);
        onConnectRef.current?.();

        client.subscribe(subscribeDestination, (message) => {
          try {
            onMessageRef.current?.(JSON.parse(message.body));
          } catch (_e) {
            onErrorRef.current?.({
              ...message,
              headers: { message: 'JSON 파싱 실패' },
            } as never);
          }
        });
      },
      onDisconnect: () => {
        console.warn(`[WS] 연결 종료 (${url})`);
        onDisconnectRef.current?.();
      },
      onStompError: (frame) => {
        console.error('[WS] STOMP 오류:', frame.headers['message']);
        onErrorRef.current?.(frame);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      void client.deactivate();
      clientRef.current = null;
    };
  }, [url, token, subscribeDestination]);

  const send = useCallback((data: unknown): boolean => {
    if (!clientRef.current?.connected) return false;

    clientRef.current.publish({
      destination: publishDestinationRef.current,
      body: JSON.stringify(data),
    });

    return true;
  }, []);

  return { send };
};

export { useWebSocket };
