import { useCallback } from 'react';

import type { UseMarkerRendererProps } from '@/domains/maps/types/map.types';
import { useHashtagFilterContext } from '@/domains/places/contexts/useHashtagFilterContext';
import { usePlaceList } from '@/domains/places/hooks/usePlaceList';
import { filterPlacesByHashtags } from '@/domains/places/utils/filterPlaces';

import { useMapMarkerControl } from './useMapMarkerControl';
import { useRoutePlacesWithDetails } from './useRoutePlacesWithDetails';

const useMarkerRenderer = ({
  mapRef,
  handleMarkerClick,
}: UseMarkerRendererProps) => {
  const { placeList } = usePlaceList();
  const { routiePlacesWithDetails } = useRoutePlacesWithDetails();
  const { clearMarkers, drawMarkers } = useMapMarkerControl(mapRef);
  const { selectedHashtags } = useHashtagFilterContext();

  const renderMarkers = useCallback(() => {
    clearMarkers();

    const routiePlaceIds = routiePlacesWithDetails.map((rp) => rp.id);

    const filteredPlaces = placeList
      ? filterPlacesByHashtags({
          places: placeList,
          selectedHashtags,
          priorityPlaceIds: routiePlaceIds,
        })
      : [];

    filteredPlaces.forEach((place) => {
      const routiePlace = routiePlacesWithDetails.find(
        (rp) => rp.id === place.id,
      );
      const routieSequence = routiePlace?.sequence;

      drawMarkers({
        place,
        routieSequence,
        onClick: () => handleMarkerClick(place),
      });
    });
  }, [
    placeList,
    routiePlacesWithDetails,
    handleMarkerClick,
    clearMarkers,
    drawMarkers,
    selectedHashtags,
  ]);

  return { renderMarkers };
};

export { useMarkerRenderer };
