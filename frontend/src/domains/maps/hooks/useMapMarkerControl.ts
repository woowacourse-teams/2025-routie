import { useCallback, useRef } from 'react';

import type {
  DrawMarkerProps,
  MapRefType,
  CustomOverlayType,
} from '@/domains/maps/types/api.types';
import { createCustomMarkerElement } from '@/domains/maps/utils/createCustomMarkerElement';

const useMapMarkerControl = (map: MapRefType) => {
  // 숫자 마커(CustomOverlay)만 관리 - 기본 마커는 Marker 컴포넌트에서 관리
  const markersRef = useRef<CustomOverlayType[]>([]);

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((marker) => {
      marker.setMap(null);
    });
    markersRef.current = [];
  }, []);

  /**
   * 숫자 마커 (routieSequence가 있는 경우)만 그립니다.
   * 기본 마커는 Marker 컴포넌트로 선언적 렌더링합니다.
   */
  const drawMarkers = useCallback(
    ({ place, routieSequence, onClick }: DrawMarkerProps) => {
      if (!map.current) return;

      // routieSequence가 없으면 기본 마커 → Marker 컴포넌트에서 처리
      if (!routieSequence) return;

      const position = new window.kakao.maps.LatLng(
        place.latitude,
        place.longitude,
      );

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
    // map은 ref 객체로 변경되지 않으므로 의존성에서 제외해도 안전함
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const panToMarker = useCallback((lat: number, lng: number) => {
    if (!map.current) return;

    const position = new window.kakao.maps.LatLng(lat, lng);

    setTimeout(() => {
      if (map.current) {
        map.current.panTo(position);
      }
    }, 120);
    // map은 ref 객체로 변경되지 않으므로 의존성에서 제외해도 안전함
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { drawMarkers, fitBoundsToMarkers, clearMarkers, panToMarker };
};

export { useMapMarkerControl };
