import { useRef } from 'react';

import type { MapRefType } from '@/domains/maps/types/api.types';

const usePolyline = (map: MapRefType) => {
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
