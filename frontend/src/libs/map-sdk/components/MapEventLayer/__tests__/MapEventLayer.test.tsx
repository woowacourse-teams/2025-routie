import { render } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import MapEventLayer from '@/libs/map-sdk/components/MapEventLayer/MapEventLayer';
import * as useMapModule from '@/libs/map-sdk/hooks/useMap';

import type { KakaoMap } from '../../../../../../kakao.d';

const createMockMap = () =>
  ({
    getCenter: vi.fn(),
    getLevel: vi.fn(),
  }) as unknown as KakaoMap;

describe('MapEventLayer', () => {
  const mockMap = createMockMap();
  const addListener = vi.fn();
  const removeListener = vi.fn();

  beforeEach(() => {
    vi.spyOn(useMapModule, 'useMap').mockReturnValue(mockMap);

    window.kakao = {
      maps: {
        event: {
          addListener,
          removeListener,
        },
      },
    } as unknown as typeof window.kakao;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('전달된 이벤트 핸들러를 등록한다', () => {
    const onClick = vi.fn();
    const onDragEnd = vi.fn();

    render(<MapEventLayer onClick={onClick} onDragEnd={onDragEnd} />);

    expect(addListener).toHaveBeenCalledWith(mockMap, 'click', onClick);
    expect(addListener).toHaveBeenCalledWith(mockMap, 'dragend', onDragEnd);
    expect(addListener).toHaveBeenCalledTimes(2);
  });

  it('언마운트 시 등록된 이벤트 핸들러를 제거한다', () => {
    const onClick = vi.fn();
    const onZoomChanged = vi.fn();

    const { unmount } = render(
      <MapEventLayer onClick={onClick} onZoomChanged={onZoomChanged} />,
    );

    unmount();

    expect(removeListener).toHaveBeenCalledWith(mockMap, 'click', onClick);
    expect(removeListener).toHaveBeenCalledWith(
      mockMap,
      'zoom_changed',
      onZoomChanged,
    );
  });
});
