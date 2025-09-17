import { useCallback, useRef } from 'react';

import type {
  DrawMarkerProps,
  MarkerType,
  MapRefType,
  CustomOverlayType,
} from '@/domains/maps/types/api.types';
import { createCustomMarkerElement } from '@/domains/maps/utils/createCustomMarkerElement';

const useMapMarkerControl = (map: MapRefType) => {
  const markersRef = useRef<(MarkerType | CustomOverlayType)[]>([]);

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((marker) => {
      marker.setMap(null);
    });
    markersRef.current = [];
  }, []);

  const drawMarkers = useCallback(
    ({ place, routieSequence, onClick }: DrawMarkerProps) => {
      if (!map.current) return;

      const position = new window.kakao.maps.LatLng(
        place.latitude,
        place.longitude,
      );

      if (routieSequence) {
        const content = createCustomMarkerElement(routieSequence);

        const overlay = new window.kakao.maps.CustomOverlay({
          position,
          content,
          yAnchor: 0.5,
          xAnchor: 0.5,
        });

        overlay.setMap(map.current);

        if (onClick) {
          content.addEventListener('click', () => {
            onClick();
          });
        }
        markersRef.current.push(overlay);
        return overlay;
      } else {
        const marker = new window.kakao.maps.Marker({
          position,
          title: place.name,
        });

        marker.setMap(map.current);

        if (onClick) {
          window.kakao.maps.event.addListener(marker, 'click', () => {
            onClick();
          });
        }

        markersRef.current.push(marker);
        return marker;
      }
    },
    [map],
  );

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
    [],
  );

  const panToMarker = useCallback((lat: number, lng: number) => {
    if (!map.current) return;

    const position = new window.kakao.maps.LatLng(lat, lng);

    setTimeout(() => {
      map.current.panTo(position);
    }, 120);
  }, []);

  return { drawMarkers, fitBoundsToMarkers, clearMarkers, panToMarker };
};

export { useMapMarkerControl };
