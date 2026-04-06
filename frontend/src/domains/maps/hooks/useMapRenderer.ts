import { useCallback } from 'react';

import type { UseMapRendererProps } from '@/domains/maps/types/map.types';

import { useMapNavigation } from './useMapNavigation';

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

  const renderMapElements = useCallback(() => {
    // 맵 피팅 (첫 로드 시 또는 새로운 장소 추가 시)
    handleInitialMapFitting();
  }, [handleInitialMapFitting]);

  return { renderMapElements, navigateToPlace };
};

export { useMapRenderer };
