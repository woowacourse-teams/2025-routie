import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { kakaoMapAdapter } from '@/libs/map-sdk/adapters/kakaoMapAdapter';
import { MarkerEngine } from '@/libs/map-sdk/core/MarkerEngine';
import type { MarkerData } from '@/libs/map-sdk/core/MarkerEngine';
import type {
  CustomOverlayInstanceType,
  MapInstanceType,
  MarkerInstanceType,
} from '@/libs/map-sdk/types/adapter.types';

vi.mock('@/libs/map-sdk/adapters/kakaoMapAdapter', () => ({
  kakaoMapAdapter: {
    createMarker: vi.fn(),
    removeMarker: vi.fn(),
    setMarkerPosition: vi.fn(),
    addMarkerListener: vi.fn(),
    removeMarkerListener: vi.fn(),
    createCustomOverlay: vi.fn(),
    removeCustomOverlay: vi.fn(),
    setCustomOverlayPosition: vi.fn(),
  },
}));

const createMarkerData = (overrides: Partial<MarkerData> = {}): MarkerData => ({
  id: 'marker-1',
  position: { lat: 37.5, lng: 127.0 },
  type: 'basic',
  title: 'Marker',
  ...overrides,
});

describe('MarkerEngine', () => {
  let markerEngine: MarkerEngine;
  let map: MapInstanceType;
  let rafCallback: FrameRequestCallback | null;
  let requestAnimationFrameMock: ReturnType<typeof vi.fn>;
  let originalRequestAnimationFrame: typeof window.requestAnimationFrame;

  beforeEach(() => {
    markerEngine = new MarkerEngine();
    map = {} as MapInstanceType;
    markerEngine.setMap(map);

    rafCallback = null;
    originalRequestAnimationFrame = window.requestAnimationFrame;
    requestAnimationFrameMock = vi.fn((callback: FrameRequestCallback) => {
      rafCallback = callback;
      return 0;
    });

    Object.defineProperty(window, 'requestAnimationFrame', {
      value: requestAnimationFrameMock,
      writable: true,
    });
  });

  afterEach(() => {
    markerEngine.reset();
    window.requestAnimationFrame = originalRequestAnimationFrame;
    vi.clearAllMocks();
  });

  const flushRaf = () => {
    rafCallback?.(0);
    rafCallback = null;
  };

  it('여러 업데이트를 단일 RAF로 배치 처리한다', () => {
    const adapter = vi.mocked(kakaoMapAdapter);
    const markerInstances: MarkerInstanceType[] = [];

    adapter.createMarker.mockImplementation(() => {
      const instance = {} as MarkerInstanceType;
      markerInstances.push(instance);
      return instance;
    });

    // 여러 변경을 연속 호출해도 RAF 예약은 한 번만 발생한다.
    markerEngine.register(createMarkerData({ id: 'marker-1' }));
    markerEngine.register(
      createMarkerData({ id: 'marker-2', position: { lat: 37.6, lng: 127.1 } }),
    );
    markerEngine.update(
      createMarkerData({ id: 'marker-1', title: 'Marker Updated' }),
    );

    expect(requestAnimationFrameMock).toHaveBeenCalledTimes(1);

    flushRaf();

    expect(markerInstances).toHaveLength(2);
    expect(adapter.createMarker).toHaveBeenCalledTimes(2);
  });

  it('변경된 마커만 업데이트한다 (diff 최적화)', () => {
    const adapter = vi.mocked(kakaoMapAdapter);
    const markerInstances: MarkerInstanceType[] = [];

    adapter.createMarker.mockImplementation(() => {
      const instance = {} as MarkerInstanceType;
      markerInstances.push(instance);
      return instance;
    });

    // 초기 렌더링: 마커 2개 생성
    markerEngine.register(createMarkerData({ id: 'marker-1' }));
    markerEngine.register(
      createMarkerData({ id: 'marker-2', position: { lat: 37.6, lng: 127.1 } }),
    );
    flushRaf();

    adapter.createMarker.mockClear();
    adapter.setMarkerPosition.mockClear();
    requestAnimationFrameMock.mockClear();

    // marker-1은 변경 없음, marker-2만 위치 변경
    markerEngine.update(createMarkerData({ id: 'marker-1' }));
    markerEngine.update(
      createMarkerData({
        id: 'marker-2',
        position: { lat: 37.7, lng: 127.2 },
      }),
    );

    flushRaf();

    expect(requestAnimationFrameMock).toHaveBeenCalledTimes(1);
    expect(adapter.createMarker).not.toHaveBeenCalled();
    expect(adapter.setMarkerPosition).toHaveBeenCalledTimes(1);
    expect(adapter.setMarkerPosition).toHaveBeenCalledWith(markerInstances[1], {
      lat: 37.7,
      lng: 127.2,
    });
  });

  it('마커 타입 변경 시 재생성한다 (basic ↔ number)', () => {
    const adapter = vi.mocked(kakaoMapAdapter);
    const markerInstances: MarkerInstanceType[] = [];
    const overlayInstances: CustomOverlayInstanceType[] = [];

    adapter.createMarker.mockImplementation(() => {
      const instance = {} as MarkerInstanceType;
      markerInstances.push(instance);
      return instance;
    });

    adapter.createCustomOverlay.mockImplementation(() => {
      const instance = {} as CustomOverlayInstanceType;
      overlayInstances.push(instance);
      return instance;
    });

    // 기본 마커 생성 후 숫자 마커로 전환
    markerEngine.register(createMarkerData({ id: 'marker-1' }));
    flushRaf();

    adapter.removeMarker.mockClear();
    adapter.createCustomOverlay.mockClear();

    // basic -> number: 기존 마커 제거 후 오버레이 생성
    markerEngine.update(
      createMarkerData({
        id: 'marker-1',
        type: 'number',
        sequence: 1,
      }),
    );
    flushRaf();

    expect(adapter.removeMarker).toHaveBeenCalledWith(markerInstances[0]);
    expect(adapter.createCustomOverlay).toHaveBeenCalledTimes(1);

    adapter.removeCustomOverlay.mockClear();
    adapter.createMarker.mockClear();

    // number -> basic: 기존 오버레이 제거 후 마커 생성
    markerEngine.update(
      createMarkerData({
        id: 'marker-1',
        type: 'basic',
        sequence: undefined,
      }),
    );
    flushRaf();

    expect(adapter.removeCustomOverlay).toHaveBeenCalledWith(
      overlayInstances[0],
    );
    expect(adapter.createMarker).toHaveBeenCalledTimes(1);
  });
});
