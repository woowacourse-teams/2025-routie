import { render } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { mapController } from '../../../controllers/mapController';
import Map from '../Map';

import type { KakaoMap } from '../../../../../../kakao.d';

vi.mock('../../../controllers/mapController', () => ({
  mapController: {
    createMap: vi.fn(),
    relayout: vi.fn(),
  },
}));

const createMockMap = () =>
  ({
    getCenter: vi.fn(() => ({
      getLat: () => 37.5,
      getLng: () => 127.0,
    })),
    getLevel: vi.fn(() => 3),
    panTo: vi.fn(),
    setLevel: vi.fn(),
    setDraggable: vi.fn(),
    setZoomable: vi.fn(),
    relayout: vi.fn(),
  }) as unknown as KakaoMap;

describe('Map', () => {
  const addListener = vi.fn();
  const removeListener = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();

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
        event: {
          addListener,
          removeListener,
        },
      },
    } as unknown as typeof window.kakao;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('마운트 시 mapController.createMap과 relayout을 호출한다', () => {
    const mockMap = createMockMap();

    const mockedMapController = vi.mocked(mapController);
    mockedMapController.createMap.mockReturnValue(mockMap);

    render(<Map center={{ lat: 37.5, lng: 127.0 }} level={3} />);

    expect(mockedMapController.createMap).toHaveBeenCalledTimes(1);

    vi.runAllTimers();

    expect(mockedMapController.relayout).toHaveBeenCalledWith(mockMap);
  });

  it('언마운트 시 click 이벤트 리스너를 제거한다', () => {
    const mockMap = createMockMap();
    const handleClick = vi.fn();

    const mockedMapController = vi.mocked(mapController);
    mockedMapController.createMap.mockReturnValue(mockMap);

    const { unmount } = render(
      <Map center={{ lat: 37.5, lng: 127.0 }} onClick={handleClick} />,
    );

    expect(addListener).toHaveBeenCalledWith(mockMap, 'click', handleClick);

    unmount();

    expect(removeListener).toHaveBeenCalledWith(mockMap, 'click', handleClick);
  });
});
