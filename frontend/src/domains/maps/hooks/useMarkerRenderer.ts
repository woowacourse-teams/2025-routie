import { useMemo } from 'react';

import { useHashtagFilterContext } from '@/domains/places/contexts/useHashtagFilterContext';
import { usePlaceList } from '@/domains/places/hooks/usePlaceList';
import { filterPlacesByHashtags } from '@/domains/places/utils/filterPlaces';
import type { MarkerItemType } from '@/libs/map-sdk';

import { useRoutePlacesWithDetails } from './useRoutePlacesWithDetails';

const useMarkerRenderer = () => {
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

export { useMarkerRenderer };
