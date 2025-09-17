import { useCallback } from 'react';

import { usePolyline } from './usePolyline';
import { useRoutePlacesWithDetails } from './useRoutePlacesWithDetails';

import type { MapRefType } from '../types/KaKaoMap.types';

interface UsePolylineRendererProps {
  mapRef: MapRefType;
}

const usePolylineRenderer = ({
  mapRef,
}: UsePolylineRendererProps) => {
  const { routiePlacesWithDetails } = useRoutePlacesWithDetails();
  const { clearPolyline, loadPolyline } = usePolyline(mapRef);
  const renderPolylines = useCallback(() => {
    clearPolyline();
    routiePlacesWithDetails.forEach((place) => {
      loadPolyline(place.latitude, place.longitude);
    });
  }, [routiePlacesWithDetails, clearPolyline, loadPolyline]);

  return { renderPolylines };
};

export { usePolylineRenderer };
export type { UsePolylineRendererProps };