import { RefObject, useCallback, useRef } from 'react';

import type { KakaoMapType } from '../types/KaKaoMap.types';
import { clear } from 'console';

type Marker = InstanceType<typeof window.kakao.maps.Marker>;

const useMapMarker = ({ map }: { map: RefObject<KakaoMapType> }) => {
  const markersRef = useRef<Marker[]>([]);

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((marker) => {
      marker.setMap(null);
    });
    markersRef.current = [];
  }, []);

  const drawMarkers = useCallback(
    (lat: number, lng: number, onClick?: () => void) => {
      if (!map.current) return;

      const position = new window.kakao.maps.LatLng(lat, lng);
      const marker = new window.kakao.maps.Marker({
        position,
      });
      marker.setMap(map.current);

      if (onClick) {
        window.kakao.maps.event.addListener(marker, 'click', onClick);
      }

      markersRef.current.push(marker);
      return marker;
    },
    [map],
  );

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

  const fitMapToMarker = useCallback((lat: number, lng: number) => {
    if (!map.current) return;

    const bounds = new window.kakao.maps.LatLngBounds();

    const position = new window.kakao.maps.LatLng(lat, lng);

    console.log(position);

    bounds.extend(position);
    map.current.panTo(bounds);
  }, []);

  return { drawMarkers, fitMapToMarkers, clearMarkers, fitMapToMarker };
};

export default useMapMarker;
