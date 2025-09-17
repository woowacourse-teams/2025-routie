import { useCallback } from 'react';

import { usePolyline } from './usePolyline';
import { useRoutePlacesWithDetails } from './useRoutePlacesWithDetails';

import type { UsePolylineRendererProps } from '../types/map.types';

const usePolylineRenderer = ({ mapRef }: UsePolylineRendererProps) => {
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
