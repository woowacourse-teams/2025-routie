import { RefObject, useCallback, useRef } from 'react';

import type { KakaoMapType } from '../types/KaKaoMap.types';

type Marker = InstanceType<typeof window.kakao.maps.Marker>;

interface DrawMarkerProps {
  lat: number;
  lng: number;
  index: number;
  onClick?: () => void;
}

const useMapMarker = ({ map }: { map: RefObject<KakaoMapType> }) => {
  const markersRef = useRef<Marker[]>([]);

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((marker) => {
      marker.setMap(null);
    });
    markersRef.current = [];
  }, []);

  const drawMarkers = useCallback(
    ({ lat, lng, index, onClick }: DrawMarkerProps) => {
      if (!map.current) return;

      const position = new window.kakao.maps.LatLng(lat, lng);

      const content = document.createElement('div');
      content.className = 'marker-label';
      content.innerText = String(index);

      const overlay = new window.kakao.maps.CustomOverlay({
        position,
        content,
        yAnchor: 1,
      });

      overlay.setMap(map.current);

      if (onClick) {
        content.addEventListener('click', onClick);
      }

      markersRef.current.push(overlay);
      return overlay;
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
