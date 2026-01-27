import { useCallback } from 'react';

import type { UseMapRendererProps } from '@/domains/maps/types/map.types';

import { useMapNavigation } from './useMapNavigation';
import { usePolylineRenderer } from './usePolylineRenderer';

const useMapRenderer = ({
  mapRef,
  isInitialLoad,
  setIsInitialLoad,
}: UseMapRendererProps) => {
  const { handleInitialMapFitting, navigateToPlace } = useMapNavigation({
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

    // 2. 폴리라인 렌더링
    renderPolylines();
  }, [handleInitialMapFitting, renderPolylines]);

  return { renderMapElements, navigateToPlace };
};

export { useMapRenderer };
