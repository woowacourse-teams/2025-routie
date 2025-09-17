import { useCallback } from 'react';

import type { PlaceDataType } from '@/domains/places/types/place.types';

import { useMapNavigation } from './useMapNavigation';
import { useMarkerRenderer } from './useMarkerRenderer';
import { usePolylineRenderer } from './usePolylineRenderer';

import type { MapRefType } from '../types/KaKaoMap.types';

interface UseMapRendererProps {
  mapRef: MapRefType;
  isInitialLoad: boolean;
  setIsInitialLoad: (value: boolean) => void;
  handleMarkerClick: (place: PlaceDataType) => void;
}

const useMapRenderer = ({
  mapRef,
  isInitialLoad,
  setIsInitialLoad,
  handleMarkerClick,
}: UseMapRendererProps) => {
  const { handleInitialMapFitting, navigateToPlace } = useMapNavigation({
    mapRef,
    isInitialLoad,
    setIsInitialLoad,
  });

  const { renderMarkers } = useMarkerRenderer({
    mapRef,
    handleMarkerClick: (place: PlaceDataType) => {
      // 마커 클릭 시: 오버레이 표시 + 맵 이동
      handleMarkerClick(place);
      navigateToPlace(place);
    },
  });

  const { renderPolylines } = usePolylineRenderer({
    mapRef,
  });

  const renderMapElements = useCallback(() => {
    // 1. 맵 피팅 (첫 로드 시 또는 새로운 장소 추가 시)
    handleInitialMapFitting();

    // 2. 마커 렌더링
    renderMarkers();

    // 3. 폴리라인 렌더링
    renderPolylines();
  }, [handleInitialMapFitting, renderMarkers, renderPolylines]);

  return { renderMapElements };
};

export { useMapRenderer };
export type { UseMapRendererProps };