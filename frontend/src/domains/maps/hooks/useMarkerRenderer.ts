import { useCallback } from 'react';

import { useHashtagFilterContext } from '@/domains/maps/contexts/useHashtagFilterContext';
import type { UseMarkerRendererProps } from '@/domains/maps/types/map.types';
import { usePlaceList } from '@/domains/places/hooks/usePlaceList';

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

    const filteredPlaces = placeList?.filter((place) => {
      if (routiePlaceIds.includes(place.id)) return true;

      if (selectedHashtags.length === 0) return true;

      return place.hashtags?.some((hashtag) =>
        selectedHashtags.includes(hashtag),
      );
    });

    filteredPlaces?.forEach((place) => {
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
