import { render } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { kakaoMapAdapter } from '@/libs/map-sdk/adapters/kakaoMapAdapter';
import Polyline from '@/libs/map-sdk/components/Polyline/Polyline';
import * as useMapModule from '@/libs/map-sdk/hooks/useMap';

import type { KakaoMap, KakaoPolyline } from '../../../../../../kakao.d';

vi.mock('@/libs/map-sdk/adapters/kakaoMapAdapter', () => ({
  kakaoMapAdapter: {
    createPolyline: vi.fn(),
    removePolyline: vi.fn(),
    setPolylinePath: vi.fn(),
    setPolylineOptions: vi.fn(),
    createLatLng: vi.fn((lat, lng) => ({ lat, lng })),
  },
}));

const createMockMap = () =>
  ({
    getCenter: vi.fn(),
    getLevel: vi.fn(),
  }) as unknown as KakaoMap;

const createMockPolyline = () =>
  ({
    setMap: vi.fn(),
    setPath: vi.fn(),
    setStrokeColor: vi.fn(),
    setStrokeWeight: vi.fn(),
    setStrokeOpacity: vi.fn(),
    setStrokeStyle: vi.fn(),
    setZIndex: vi.fn(),
  }) as unknown as KakaoPolyline;

describe('Polyline', () => {
  const mockMap = createMockMap();
  const mockPolyline = createMockPolyline();

  beforeEach(() => {
    vi.spyOn(useMapModule, 'useMap').mockReturnValue(mockMap);
    vi.mocked(kakaoMapAdapter.createPolyline).mockReturnValue(mockPolyline);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('map이 준비되면 폴리라인을 생성한다', () => {
    const path = [
      { lat: 37.5, lng: 127.0 },
      { lat: 37.6, lng: 127.1 },
    ];

    render(<Polyline path={path} />);

    expect(kakaoMapAdapter.createPolyline).toHaveBeenCalledTimes(1);
    expect(kakaoMapAdapter.createPolyline).toHaveBeenCalledWith(mockMap, {
      path,
      strokeColor: '#F10000',
      strokeWeight: 3,
      strokeOpacity: 0.6,
      strokeStyle: 'solid',
      zIndex: undefined,
    });
  });

  it('언마운트 시 폴리라인을 제거한다', () => {
    const path = [
      { lat: 37.5, lng: 127.0 },
      { lat: 37.6, lng: 127.1 },
    ];

    const { unmount } = render(<Polyline path={path} />);

    unmount();

    expect(kakaoMapAdapter.removePolyline).toHaveBeenCalledWith(mockPolyline);
  });

  it('path가 변경되면 setPolylinePath를 호출한다', () => {
    const initialPath = [
      { lat: 37.5, lng: 127.0 },
      { lat: 37.6, lng: 127.1 },
    ];

    const { rerender } = render(<Polyline path={initialPath} />);

    const newPath = [
      { lat: 37.5, lng: 127.0 },
      { lat: 37.6, lng: 127.1 },
      { lat: 37.7, lng: 127.2 },
    ];

    rerender(<Polyline path={newPath} />);

    expect(kakaoMapAdapter.setPolylinePath).toHaveBeenCalledWith(
      mockPolyline,
      newPath,
    );
  });

  it('path가 2개 미만이면 폴리라인을 생성하지 않는다', () => {
    const path = [{ lat: 37.5, lng: 127.0 }];

    render(<Polyline path={path} />);

    expect(kakaoMapAdapter.createPolyline).not.toHaveBeenCalled();
  });

  it('스타일 옵션이 변경되면 setPolylineOptions를 호출한다', () => {
    const path = [
      { lat: 37.5, lng: 127.0 },
      { lat: 37.6, lng: 127.1 },
    ];

    const { rerender } = render(
      <Polyline path={path} strokeColor="#FF0000" strokeWeight={3} />,
    );

    rerender(<Polyline path={path} strokeColor="#00FF00" strokeWeight={5} />);

    expect(kakaoMapAdapter.setPolylineOptions).toHaveBeenCalledWith(
      mockPolyline,
      {
        strokeColor: '#00FF00',
        strokeWeight: 5,
        strokeOpacity: 0.6,
        strokeStyle: 'solid',
        zIndex: undefined,
      },
    );
  });

  it('map이 없으면 폴리라인을 생성하지 않는다', () => {
    vi.spyOn(useMapModule, 'useMap').mockReturnValue(null);

    const path = [
      { lat: 37.5, lng: 127.0 },
      { lat: 37.6, lng: 127.1 },
    ];

    render(<Polyline path={path} />);

    expect(kakaoMapAdapter.createPolyline).not.toHaveBeenCalled();
  });
});
