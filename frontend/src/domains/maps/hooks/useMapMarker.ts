import { RefObject, useCallback, useRef } from 'react';

import createCustomMarkerElement from '../utils/createCustomMarkerElement';

import type { KakaoMapType } from '../types/KaKaoMap.types';

type Marker = InstanceType<typeof window.kakao.maps.Marker>;
type CustomOverlay = InstanceType<typeof window.kakao.maps.CustomOverlay>;

interface DrawMarkerProps {
  lat: number;
  lng: number;
  routieSequence?: number;
  onClick?: () => void;
}

type UseMapMarkerType = {
  map: RefObject<KakaoMapType>;
};

const useMapMarker = ({ map }: UseMapMarkerType) => {
  const markersRef = useRef<(Marker | CustomOverlay)[]>([]);

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((marker) => {
      marker.setMap(null);
    });
    markersRef.current = [];
  }, []);

  const drawMarkers = useCallback(
    ({ lat, lng, routieSequence, onClick }: DrawMarkerProps) => {
      if (!map.current) return;

      const position = new window.kakao.maps.LatLng(lat, lng);

      if (routieSequence) {
        const content = createCustomMarkerElement(routieSequence);

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
      } else {
        const marker = new window.kakao.maps.Marker({
          position,
        });

        marker.setMap(map.current);

        if (onClick) {
          window.kakao.maps.event.addListener(marker, 'click', onClick);
        }

        markersRef.current.push(marker);
        return marker;
      }
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
