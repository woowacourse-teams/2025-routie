import { useCallback } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import type { UseMapNavigationProps } from '@/domains/maps/types/map.types';
import { usePlaceList } from '@/domains/places/hooks/usePlaceList';
import type { PlaceDataType } from '@/domains/places/types/place.types';

import { useMapMarkerControl } from './useMapMarkerControl';

const useMapNavigation = ({
  mapRef,
  isInitialLoad,
  setIsInitialLoad,
}: UseMapNavigationProps) => {
  const queryClient = useQueryClient();
  const { placeList } = usePlaceList();
  const addedPlaceId = queryClient.getQueryData(['addedPlaceId']);
  const { fitBoundsToMarkers, panToMarker } = useMapMarkerControl(mapRef);

  // 초기 로드 및 새로운 장소 추가 시 맵 피팅
  const handleInitialMapFitting = useCallback(() => {
    if (isInitialLoad && placeList && placeList.length > 0) {
      fitBoundsToMarkers(placeList);
      setIsInitialLoad(false);
    } else if (addedPlaceId && placeList) {
      const newPlace = placeList.find((place) => place.id === addedPlaceId);
      if (newPlace) {
        panToMarker(newPlace.latitude, newPlace.longitude);
        // 맵 피팅 후 addedPlaceId 초기화
        queryClient.setQueryData(['addedPlaceId'], null);
      }
    }
  }, [
    placeList,
    isInitialLoad,
    addedPlaceId,
    setIsInitialLoad,
    fitBoundsToMarkers,
    panToMarker,
    queryClient,
  ]);

  // 마커 클릭 시 해당 장소로 이동
  const navigateToPlace = useCallback(
    (place: PlaceDataType) => {
      panToMarker(place.latitude, place.longitude);
    },
    [panToMarker],
  );

  return {
    handleInitialMapFitting,
    navigateToPlace,
  };
};

export { useMapNavigation };
