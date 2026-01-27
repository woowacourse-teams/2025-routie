import { useEffect, useRef } from 'react';

import { useMap } from '../../hooks/useMap';
import { createCustomMarkerElement } from '../../utils/createCustomMarkerElement';

import type { MarkerLayerProps } from './MarkerLayer.types';

type MarkerEntry = {
  instance:
    | InstanceType<typeof window.kakao.maps.Marker>
    | InstanceType<typeof window.kakao.maps.CustomOverlay>;
  cleanup?: () => void;
};

/**
 * 마커 렌더링 전용 레이어 컴포넌트
 *
 * @description
 * markerItems 변경에 따라 카카오 마커/오버레이를 생성하고 cleanup 시 제거합니다.
 */
const MarkerLayer = ({ markerItems, onMarkerClick }: MarkerLayerProps) => {
  const map = useMap();
  const markersRef = useRef<MarkerEntry[]>([]);

  const clearMarkers = () => {
    markersRef.current.forEach(({ instance, cleanup }) => {
      instance.setMap(null);
      cleanup?.();
    });
    markersRef.current = [];
  };

  useEffect(() => {
    if (!map) return undefined;

    clearMarkers();

    markerItems.forEach((item) => {
      const position = new window.kakao.maps.LatLng(
        item.place.latitude,
        item.place.longitude,
      );

      if (item.routieSequence) {
        const content = createCustomMarkerElement(item.routieSequence);
        const overlay = new window.kakao.maps.CustomOverlay({
          position,
          content,
          yAnchor: 0.5,
          xAnchor: 0.5,
        });

        overlay.setMap(map);

        const handleClick = () => {
          onMarkerClick?.(item.place);
        };

        content.addEventListener('click', handleClick);

        markersRef.current.push({
          instance: overlay,
          cleanup: () => content.removeEventListener('click', handleClick),
        });
        return;
      }

      const marker = new window.kakao.maps.Marker({
        position,
        title: item.place.name,
      });

      marker.setMap(map);

      const handleClick = () => {
        onMarkerClick?.(item.place);
      };

      window.kakao.maps.event.addListener(marker, 'click', handleClick);

      markersRef.current.push({
        instance: marker,
        cleanup: () =>
          window.kakao.maps.event.removeListener(marker, 'click', handleClick),
      });
    });

    return () => {
      clearMarkers();
    };
  }, [map, markerItems, onMarkerClick]);

  return null;
};

export default MarkerLayer;
