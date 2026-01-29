import { render, act, cleanup } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { markerEngine } from '@/libs/map-sdk';
import KakaoMapContext from '@/libs/map-sdk/contexts/KakaoMapContext';

import MarkerLayer from '../MarkerLayer';

import type { KakaoMap } from '../../../../../../kakao.d';
import type { MarkerItemType } from '../MarkerLayer.types';

let mockOverlayContent: HTMLDivElement | null = null;

describe('MarkerLayer', () => {
  const addListener = vi.fn();
  const removeListener = vi.fn();
  const markerInstances: Array<{
    setMap: ReturnType<typeof vi.fn>;
    setPosition: ReturnType<typeof vi.fn>;
  }> = [];
  const overlayInstances: Array<{
    setMap: ReturnType<typeof vi.fn>;
    setPosition: ReturnType<typeof vi.fn>;
  }> = [];
  const markerHandlers = new Map<unknown, () => void>();

  beforeEach(() => {
    // fake timer 설정 (RAF 포함)
    vi.useFakeTimers();

    markerInstances.length = 0;
    overlayInstances.length = 0;
    markerHandlers.clear();

    window.kakao = {
      maps: {
        LatLng: class {
          constructor(
            private lat: number,
            private lng: number,
          ) {}
          getLat() {
            return this.lat;
          }
          getLng() {
            return this.lng;
          }
        },
        Marker: class {
          setMap = vi.fn();
          setPosition = vi.fn();
          constructor() {
            markerInstances.push(this);
          }
        },
        CustomOverlay: class {
          setMap = vi.fn();
          setPosition = vi.fn();
          constructor(options: { content: HTMLElement }) {
            overlayInstances.push(this);
            mockOverlayContent = options.content as HTMLDivElement;
          }
        },
        event: {
          addListener: (
            target: unknown,
            _event: string,
            handler: () => void,
          ) => {
            addListener(target, _event, handler);
            markerHandlers.set(target, handler);
          },
          removeListener: (
            target: unknown,
            event: string,
            handler: () => void,
          ) => {
            removeListener(target, event, handler);
          },
        },
      },
    } as unknown as typeof window.kakao;
  });

  afterEach(() => {
    cleanup();
    markerEngine.reset();
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  const renderWithMap = (
    items: MarkerItemType[],
    onClick?: (place: MarkerItemType['place']) => void,
  ) => {
    const map = {} as unknown as KakaoMap;

    // 엔진에 map 설정
    markerEngine.setMap(map);

    return render(
      <KakaoMapContext.Provider value={{ map }}>
        <MarkerLayer markerItems={items} onMarkerClick={onClick} />
      </KakaoMapContext.Provider>,
    );
  };

  it('markerItems에 따라 Marker/CustomOverlay를 생성하고 setMap을 호출한다', () => {
    const items: MarkerItemType[] = [
      {
        place: {
          id: 1,
          name: 'A',
          latitude: 37.5,
          longitude: 127.0,
        } as MarkerItemType['place'],
      },
      {
        place: {
          id: 2,
          name: 'B',
          latitude: 37.6,
          longitude: 127.1,
        } as MarkerItemType['place'],
        routieSequence: 2,
      },
    ];

    renderWithMap(items);

    // requestAnimationFrame 콜백 실행
    act(() => {
      vi.runAllTimers();
    });

    expect(markerInstances).toHaveLength(1);
    expect(overlayInstances).toHaveLength(1);
    expect(markerInstances[0].setMap).toHaveBeenCalled();
    expect(overlayInstances[0].setMap).toHaveBeenCalled();
  });

  it('언마운트 시 마커 제거와 이벤트 cleanup을 수행한다', () => {
    const items: MarkerItemType[] = [
      {
        place: {
          id: 1,
          name: 'A',
          latitude: 37.5,
          longitude: 127.0,
        } as MarkerItemType['place'],
      },
      {
        place: {
          id: 2,
          name: 'B',
          latitude: 37.6,
          longitude: 127.1,
        } as MarkerItemType['place'],
        routieSequence: 2,
      },
    ];

    const { unmount } = renderWithMap(items, vi.fn());

    // 마커 생성
    act(() => {
      vi.runAllTimers();
    });

    expect(markerInstances).toHaveLength(1);
    expect(overlayInstances).toHaveLength(1);

    const overlayElement = mockOverlayContent;
    const removeListenerSpy = overlayElement
      ? vi.spyOn(overlayElement, 'removeEventListener')
      : null;

    unmount();

    // 언마운트 후 flush
    act(() => {
      vi.runAllTimers();
    });

    expect(markerInstances[0].setMap).toHaveBeenCalledWith(null);
    expect(overlayInstances[0].setMap).toHaveBeenCalledWith(null);
    expect(removeListener).toHaveBeenCalled();
    if (removeListenerSpy) {
      expect(removeListenerSpy).toHaveBeenCalled();
    }
  });

  it('마커 클릭 시 onMarkerClick 콜백을 호출한다', () => {
    const handleClick = vi.fn();
    const items: MarkerItemType[] = [
      {
        place: {
          id: 1,
          name: 'A',
          latitude: 37.5,
          longitude: 127.0,
        } as MarkerItemType['place'],
      },
      {
        place: {
          id: 2,
          name: 'B',
          latitude: 37.6,
          longitude: 127.1,
        } as MarkerItemType['place'],
        routieSequence: 2,
      },
    ];

    renderWithMap(items, handleClick);

    // 마커 생성
    act(() => {
      vi.runAllTimers();
    });

    // 기본 마커 클릭
    const markerHandler = markerHandlers.get(markerInstances[0]);
    markerHandler?.();

    // 숫자 마커 클릭
    if (mockOverlayContent) {
      mockOverlayContent.click();
    }

    expect(handleClick).toHaveBeenCalledTimes(2);
  });
});
