import { render } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { kakaoMapAdapter } from '@/libs/map-sdk/adapters/kakaoMapAdapter';
import OverlayLayer from '@/libs/map-sdk/components/OverlayLayer/OverlayLayer';
import * as useMapModule from '@/libs/map-sdk/hooks/useMap';

import type { KakaoMap } from '../../../../../../kakao.d';

vi.mock('@/libs/map-sdk/adapters/kakaoMapAdapter', () => ({
  kakaoMapAdapter: {
    createCustomOverlay: vi.fn(),
    removeCustomOverlay: vi.fn(),
    setCustomOverlayPosition: vi.fn(),
  },
}));

const createMockMap = () =>
  ({
    getCenter: vi.fn(),
    getLevel: vi.fn(),
  }) as unknown as KakaoMap;

describe('OverlayLayer', () => {
  const mockMap = createMockMap();
  const mockOverlay = {};

  beforeEach(() => {
    vi.spyOn(useMapModule, 'useMap').mockReturnValue(mockMap);
    vi.mocked(kakaoMapAdapter.createCustomOverlay).mockReturnValue(mockOverlay as never);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('map이 준비되면 오버레이를 생성한다', () => {
    const overlayItem = {
      id: 1,
      position: { lat: 37.5, lng: 127.0 },
      content: <div>content</div>,
      xAnchor: 0.5,
      yAnchor: 1,
      zIndex: 100,
      clickable: true,
    };

    render(<OverlayLayer overlayItem={overlayItem} />);

    expect(kakaoMapAdapter.createCustomOverlay).toHaveBeenCalledTimes(1);
    const [mapArg, optionsArg] = vi.mocked(
      kakaoMapAdapter.createCustomOverlay,
    ).mock.calls[0];
    expect(mapArg).toBe(mockMap);
    expect(optionsArg.position).toEqual(overlayItem.position);
    expect(optionsArg.xAnchor).toBe(0.5);
    expect(optionsArg.yAnchor).toBe(1);
    expect(optionsArg.zIndex).toBe(100);
    expect(optionsArg.clickable).toBe(true);
    expect(optionsArg.content).toBeInstanceOf(HTMLElement);
  });

  it('position이 변경되면 setCustomOverlayPosition을 호출한다', () => {
    const overlayItem = {
      id: 1,
      position: { lat: 37.5, lng: 127.0 },
      content: <div>content</div>,
    };

    const { rerender } = render(
      <OverlayLayer overlayItem={overlayItem} />,
    );

    const nextOverlayItem = {
      id: 1,
      position: { lat: 37.6, lng: 127.1 },
      content: <div>content</div>,
    };

    rerender(<OverlayLayer overlayItem={nextOverlayItem} />);

    expect(kakaoMapAdapter.setCustomOverlayPosition).toHaveBeenCalledWith(
      mockOverlay,
      nextOverlayItem.position,
    );
  });

  it('overlayItem이 제거되면 오버레이를 제거한다', () => {
    const overlayItem = {
      id: 1,
      position: { lat: 37.5, lng: 127.0 },
      content: <div>content</div>,
    };

    const { rerender } = render(
      <OverlayLayer overlayItem={overlayItem} />,
    );

    rerender(<OverlayLayer overlayItem={null} />);

    expect(kakaoMapAdapter.removeCustomOverlay).toHaveBeenCalledWith(mockOverlay);
  });
});
