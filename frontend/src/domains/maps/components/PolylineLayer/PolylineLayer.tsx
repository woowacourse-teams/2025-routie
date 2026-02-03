import { Polyline } from '@/libs/map-sdk';

import { useRoutePlacesWithDetails } from '../../hooks/useRoutePlacesWithDetails';

import type { PolylineLayerProps } from './PolylineLayer.types';

/**
 * 폴리라인 레이어 컴포넌트
 *
 * @description
 * 루티 장소들을 연결하는 폴리라인을 렌더링합니다.
 * Map 컴포넌트 내부에서 사용해야 합니다.
 */
const PolylineLayer = ({
  strokeColor = '#3B82F6',
  strokeWeight = 4,
  strokeOpacity = 0.8,
  zIndex = 1,
}: PolylineLayerProps) => {
  const { routiePlacesWithDetails } = useRoutePlacesWithDetails();

  const path = routiePlacesWithDetails.map((place) => ({
    lat: place.latitude,
    lng: place.longitude,
  }));

  if (path.length < 2) return null;

  return (
    <Polyline
      path={path}
      strokeColor={strokeColor}
      strokeWeight={strokeWeight}
      strokeOpacity={strokeOpacity}
      zIndex={zIndex}
    />
  );
};

export default PolylineLayer;
