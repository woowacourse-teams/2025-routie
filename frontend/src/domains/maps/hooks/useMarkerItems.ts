import { useMemo } from 'react';

import type { MarkerItemType } from '@/domains/maps/components/MarkerLayer/MarkerLayer.types';
import { useHashtagFilterContext } from '@/domains/places/contexts/useHashtagFilterContext';
import { usePlaceList } from '@/domains/places/hooks/usePlaceList';
import { filterPlacesByHashtags } from '@/domains/places/utils/filterPlaces';

import { useRoutePlacesWithDetails } from './useRoutePlacesWithDetails';

/**
 * 마커 입력 데이터 생성 훅
 */
const useMarkerItems = () => {
  const { placeList } = usePlaceList();
  const { routiePlacesWithDetails } = useRoutePlacesWithDetails();
  const { selectedHashtags } = useHashtagFilterContext();

  const markerItems = useMemo<MarkerItemType[]>(() => {
    if (!placeList) return [];

    const routiePlaceIds = routiePlacesWithDetails.map((rp) => rp.id);

    const filteredPlaces = filterPlacesByHashtags({
      places: placeList,
      selectedHashtags,
      priorityPlaceIds: routiePlaceIds,
    });

    return filteredPlaces.map((place) => {
      const routiePlace = routiePlacesWithDetails.find(
        (rp) => rp.id === place.id,
      );

      return {
        place,
        routieSequence: routiePlace?.sequence,
      };
    });
  }, [placeList, routiePlacesWithDetails, selectedHashtags]);

  return { markerItems };
};

export { useMarkerItems };
