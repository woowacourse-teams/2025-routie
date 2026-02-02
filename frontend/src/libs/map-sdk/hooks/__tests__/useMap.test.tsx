import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import KakaoMapContext from '@/libs/map-sdk/contexts/KakaoMapContext';
import { useMap } from '@/libs/map-sdk/hooks/useMap';

import type { KakaoMap } from '../../../../../kakao.d';

describe('useMap', () => {
  it('Provider 내부에서는 map 인스턴스를 반환한다', () => {
    const mockMap = {} as KakaoMap;

    const { result } = renderHook(() => useMap(), {
      wrapper: ({ children }) => (
        <KakaoMapContext.Provider value={{ map: mockMap }}>
          {children}
        </KakaoMapContext.Provider>
      ),
    });

    expect(result.current).toBe(mockMap);
  });

  it('Provider 외부에서는 null을 반환한다', () => {
    const { result } = renderHook(() => useMap());

    expect(result.current).toBeNull();
  });
});
