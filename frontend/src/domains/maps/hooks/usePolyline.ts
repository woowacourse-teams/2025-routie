import { RefObject, useRef } from 'react';

import type { KakaoMapType } from '../types/KaKaoMap.types';

// TODO: useMapMarkerProps랑 동일한 타입으로 추상화 필요해 보임
const usePolyline = ({ map }: { map: RefObject<KakaoMapType> }) => {
  const pathPoints = useRef<any[]>([]);
  const polylineRef = useRef<any>(null);

  const loadPolyline = (lat: number, lng: number) => {
    if (!map.current) return;

    pathPoints.current.push(new window.kakao.maps.LatLng(lat, lng));

    if (polylineRef.current) {
      polylineRef.current.setMap(null);
    }

    polylineRef.current = new window.kakao.maps.Polyline({
      map: map.current,
      path: pathPoints.current,
      strokeWeight: 3,
      strokeColor: 'purple',
      strokeOpacity: 0.7,
      strokeStyle: 'solid',
    });

    return polylineRef.current;
  };

  const clearPolyline = () => {
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }
    pathPoints.current = [];
  };

  return { loadPolyline, clearPolyline };
};

export { usePolyline };
