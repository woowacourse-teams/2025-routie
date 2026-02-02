import { useCallback } from 'react';

import type { MapRefType } from '@/domains/maps/types/api.types';

/**
 * 지도 이동 제어 훅
 */
const useMapNavigationControl = (map: MapRefType) => {
  const fitBoundsToMarkers = useCallback(
    (places: Array<{ latitude: number; longitude: number }>) => {
      if (!map.current || places.length === 0) return;

      const bounds = new window.kakao.maps.LatLngBounds();

      places.forEach((place) => {
        const position = new window.kakao.maps.LatLng(
          Number(place.latitude),
          Number(place.longitude),
        );
        bounds.extend(position);
      });

      setTimeout(() => {
        if (map.current) {
          map.current.setBounds(bounds);
        }
      }, 100);
    },
    [map],
  );

  const panToMarker = useCallback((lat: number, lng: number) => {
    if (!map.current) return;

    const position = new window.kakao.maps.LatLng(lat, lng);

    setTimeout(() => {
      if (map.current) {
        map.current.panTo(position);
      }
    }, 120);
  }, [map]);

  return { fitBoundsToMarkers, panToMarker };
};

export { useMapNavigationControl };
