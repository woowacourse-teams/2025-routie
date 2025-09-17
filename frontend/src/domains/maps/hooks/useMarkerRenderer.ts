import { useCallback } from 'react';

import { usePlaceList } from '@/domains/places/hooks/usePlaceList';
import type { PlaceDataType } from '@/domains/places/types/place.types';

import { useMapControl } from './useMapControl';
import { useRoutePlacesWithDetails } from './useRoutePlacesWithDetails';

import type { MapRefType } from '../types/KaKaoMap.types';

interface UseMarkerRendererProps {
  mapRef: MapRefType;
  handleMarkerClick: (place: PlaceDataType) => void;
}

const useMarkerRenderer = ({
  mapRef,
  handleMarkerClick,
}: UseMarkerRendererProps) => {
  const { placeList } = usePlaceList();
  const { routiePlacesWithDetails } = useRoutePlacesWithDetails();
  const { clearMarkers, drawMarkers } = useMapControl(mapRef);
  const renderMarkers = useCallback(() => {
    clearMarkers();
    placeList?.forEach((place) => {
      const routiePlace = routiePlacesWithDetails.find(rp => rp.id === place.id);
      const routieSequence = routiePlace?.sequence;

      drawMarkers({
        place,
        routieSequence,
        onClick: () => handleMarkerClick(place),
      });
    });
  }, [placeList, routiePlacesWithDetails, handleMarkerClick, clearMarkers, drawMarkers]);

  return { renderMarkers };
};

export { useMarkerRenderer };
export type { UseMarkerRendererProps };