import { RefObject, useCallback, useRef } from 'react';

import type { KakaoMapType } from '../types/KaKaoMap.types';

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
    (
      place: { latitude: number; longitude: number; title: string },
      onClick?: () => void,
    ) => {
      if (!map.current) return;

      const position = new window.kakao.maps.LatLng(
        place.latitude,
        place.longitude,
      );
      const marker = new window.kakao.maps.Marker({
        position,
        title: place.title,
      });
      marker.setMap(map.current);

      if (onClick) {
        window.kakao.maps.event.addListener(marker, 'click', () => {
          onClick();
          fitMapToMarker(place.latitude, place.longitude);
        });
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

      setTimeout(() => {
        if (map.current) {
          map.current.setBounds(bounds);
        }
      }, 100);
    },
    [],
  );

  const fitMapToMarker = useCallback((lat: number, lng: number) => {
    if (!map.current) return;

    const position = new window.kakao.maps.LatLng(lat, lng);

    setTimeout(() => {
      map.current.panTo(position);
    }, 120);
  }, []);

  return { drawMarkers, fitMapToMarkers, clearMarkers, fitMapToMarker };
};

export default useMapMarker;
