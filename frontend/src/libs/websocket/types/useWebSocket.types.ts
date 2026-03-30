import type { IFrame } from '@stomp/stompjs';

interface UseWebSocketOptions<T> {
  url: string;
  token: string;
  subscribeDestination: string;
  publishDestination: string;
  onMessage?: (data: T) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (frame: IFrame) => void;
}

interface UseWebSocketReturn {
  send: (data: unknown) => boolean;
}

export type { UseWebSocketOptions, UseWebSocketReturn };
