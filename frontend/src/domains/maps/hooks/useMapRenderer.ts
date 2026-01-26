import { useCallback } from 'react';

import type { UseMapRendererProps } from '@/domains/maps/types/map.types';

import { useMapNavigation } from './useMapNavigation';
import { usePolylineRenderer } from './usePolylineRenderer';

const useMapRenderer = ({
  mapRef,
  isInitialLoad,
  setIsInitialLoad,
}: Omit<UseMapRendererProps, 'handleMarkerClick'>) => {
  const { handleInitialMapFitting } = useMapNavigation({
    mapRef,
    isInitialLoad,
    setIsInitialLoad,
  });

  const { renderPolylines } = usePolylineRenderer({
    mapRef,
  });

  const renderMapElements = useCallback(() => {
    // 1. 맵 피팅 (첫 로드 시 또는 새로운 장소 추가 시)
    handleInitialMapFitting();

    // 2. 폴리라인 렌더링 (마커는 선언적 컴포넌트로 처리)
    renderPolylines();
  }, [handleInitialMapFitting, renderPolylines]);

  return { renderMapElements };
};

export { useMapRenderer };
