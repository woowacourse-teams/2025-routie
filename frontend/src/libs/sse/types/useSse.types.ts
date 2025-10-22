// 훅을 사용할 때 외부에서 넘기는 옵션 형태
interface UseSseOptions<T> {
  url: string; // 구독할 SSE 엔드포인트
  eventName: string; // 듣고 싶은 이벤트 이름
  onMessage: (payload: T) => void; // 이벤트를 받았을 때 실행할 콜백
}

// 한 URL 연결에 등록된 리스너 1개의 정보
interface ListenerEntry {
  type: string; // 이벤트 이름
  handler: (event: MessageEvent<string>) => void; // EventSource가 호출하는 원시 콜백
}

// 한 URL에 대해 유지해야 하는 상태 묶음
interface RegistryEntry {
  source: EventSource | null; // 실제 EventSource 인스턴스 (없으면 끊어진 상태)
  listeners: ListenerEntry[]; // 이 URL을 구독 중인 리스너 목록
  reconnectTimer?: number; // 자동 재연결 예약 타이머 id
}

export { UseSseOptions, RegistryEntry };
