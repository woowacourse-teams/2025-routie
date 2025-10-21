import { useEffect, useRef } from 'react';

import { patchSseSubscription } from '@/libs/sse/apis/sseApi';
import { ensureStreamToken } from '@/libs/utils/token';

// 훅을 사용할 때 외부에서 넘기는 옵션 형태
export interface UseSseOptions<T> {
  url: string; // 구독할 SSE 엔드포인트
  eventName: string; // 듣고 싶은 이벤트 이름
  onMessage: (payload: T) => void; // 이벤트를 받았을 때 실행할 콜백
}

// 한 URL 연결에 등록된 리스너 1개의 정보
type ListenerEntry = {
  type: string; // 이벤트 이름
  handler: (event: MessageEvent<string>) => void; // EventSource가 호출하는 원시 콜백
};

// 한 URL에 대해 유지해야 하는 상태 묶음
type RegistryEntry = {
  source: EventSource | null; // 실제 EventSource 인스턴스 (없으면 끊어진 상태)
  listeners: ListenerEntry[]; // 이 URL을 구독 중인 리스너 목록
  reconnectTimer?: number; // 자동 재연결 예약 타이머 id
};

const RECONNECT_DELAY_MS = 3_000; // 연결이 끊겼을 때 다시 시도하기까지 기다릴 시간
const registry = new Map<string, RegistryEntry>(); // URL별 RegistryEntry를 보관하는 맵

// 주어진 URL로 EventSource를 열고 기본 동작을 붙인다
const openSource = (fullUrl: string, entry: RegistryEntry) => {
  const placeSseToken = ensureStreamToken();
  const source = new EventSource(`${fullUrl}?token=${placeSseToken}`); // 새로운 EventSource 생성
  entry.source = source; // 방금 만든 소스를 상태에 저장

  source.onopen = async () => {
    console.log(`[SSE] 연결 성공 (${`${fullUrl}?token=${placeSseToken}`})`);
    // 재연결 타이머가 걸려 있었다면 정상 연결 되었으니 취소한다
    if (entry.reconnectTimer) {
      window.clearTimeout(entry.reconnectTimer);
      entry.reconnectTimer = undefined;
    }

    try {
      await patchSseSubscription({
        subscriptionPath: `/routie-spaces/{routieSpaceIdentifier}/server-sent-events/subscriptions/{token}`,
        token: placeSseToken,
      });
    } catch (error) {
      console.error(`[SSE] 구독 PATCH 실패 (${fullUrl})`, error);
      source.close();
      entry.source = null;
      registry.delete(fullUrl);
    }
  };

  source.onerror = () => {
    console.warn(`[SSE] 연결 끊김 또는 오류 (${fullUrl})`);
    // 오류가 나면 현재 소스를 닫고 끊어진 상태로 표시한다
    source.close();
    entry.source = null;

    if (entry.listeners.length === 0) {
      // 더 이상 구독자가 없으면 맵에서도 제거하고 끝낸다
      registry.delete(fullUrl);
      return;
    }

    if (!entry.reconnectTimer) {
      // 아직 재연결 예약이 없다면 3초 뒤 다시 연결을 시도한다
      entry.reconnectTimer = window.setTimeout(() => {
        entry.reconnectTimer = undefined;
        openSource(fullUrl, entry);
      }, RECONNECT_DELAY_MS);
    }
  };

  // 이미 등록돼 있던 리스너들을 새로 열린 소스에도 다시 붙여준다
  entry.listeners.forEach(({ type, handler }) => {
    source.addEventListener(type, handler as EventListener);
  });
};

// URL에 해당하는 RegistryEntry를 찾아서 없으면 생성해 돌려준다
const registryEntry = (fullUrl: string) => {
  let entry = registry.get(fullUrl); // 기존 엔트리가 있는지 확인
  if (!entry) {
    entry = { source: null, listeners: [] }; // 없으면 새 엔트리 생성
    registry.set(fullUrl, entry);
  }

  if (!entry.source) {
    openSource(fullUrl, entry); // EventSource가 없으면 바로 연결을 연다
  }

  return entry; // 항상 실행 중인 엔트리를 반환
};

// 실제로 컴포넌트에서 사용하는 훅 정의
export const useSse = <T>({ url, eventName, onMessage }: UseSseOptions<T>) => {
  const handlerRef = useRef(onMessage); // 최신 onMessage를 기억하기 위한 ref

  useEffect(() => {
    handlerRef.current = onMessage; // onMessage가 바뀌면 ref에 최신 콜백을 저장
  }, [onMessage]);

  useEffect(() => {
    if (!url) return; // URL이 없다면 아무 작업도 하지 않는다

    const fullUrl = `${process.env.REACT_APP_API_URL}${url}`; // 실제로 요청할 전체 URL
    const type = eventName; // 이벤트 이름
    const entry = registryEntry(fullUrl); // 해당 URL의 RegistryEntry 확보

    const listener = (event: MessageEvent<string>) => {
      // 서버가 내려주는 data를 JSON으로 파싱해 보고 실패하면 원문 그대로 전달한다
      try {
        handlerRef.current(JSON.parse(event.data));
      } catch {
        handlerRef.current(event.data as unknown as T);
      }
    };

    entry.listeners.push({ type, handler: listener }); // 레지스트리에 리스너 정보를 보관
    entry.source?.addEventListener(type, listener as EventListener); // 실제 EventSource에도 리스너 등록

    return () => {
      // 컴포넌트가 언마운트 되면 리스너를 EventSource에서 제거한다
      entry.source?.removeEventListener(type, listener as EventListener);
      // 레지스트리에서도 해당 리스너 정보를 제거한다
      entry.listeners = entry.listeners.filter(
        (item) => item.handler !== listener,
      );

      if (entry.listeners.length > 0) return; // 아직 다른 리스너가 남아 있으면 연결 유지

      if (entry.reconnectTimer) {
        window.clearTimeout(entry.reconnectTimer); // 재연결 예약이 있으면 취소
        entry.reconnectTimer = undefined;
      }

      console.log(`[SSE] 연결 종료 (${fullUrl})`);
      entry.source?.close(); // 마지막 리스너라면 EventSource를 닫는다
      registry.delete(fullUrl); // 그리고 레지스트리에서 완전히 제거한다
    };
  }, [url, eventName]);
};
