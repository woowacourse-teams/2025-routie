interface UseWebSocketOptions<T> {
  url: string;
  token: string;
  subscribeDestination: string;
  publishDestination: string;
  onMessage?: (data: T) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

interface UseWebSocketReturn {
  send: (data: unknown) => void;
}

export type { UseWebSocketOptions, UseWebSocketReturn };
