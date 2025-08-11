import { RefObject, useCallback } from 'react';

import type { KakaoMapType } from '../types/KaKaoMap.types';

const useMapMarker = ({ map }: { map: RefObject<KakaoMapType> }) => {
  const drawMarkers = useCallback((lat: number, lng: number) => {
    if (!map.current) return;

    const position = new window.kakao.maps.LatLng(lat, lng);

    const marker = new window.kakao.maps.Marker({
      position,
    });
    marker.setMap(map.current);
  }, []);

  const fitMapToMarkers = useCallback(
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

      map.current.setBounds(bounds);
    },
    [],
  );

  return { drawMarkers, fitMapToMarkers };
};

export default useMapMarker;
