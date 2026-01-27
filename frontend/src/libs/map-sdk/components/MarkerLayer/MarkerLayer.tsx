import { useMap } from '../../hooks/useMap';

import type { MarkerLayerProps } from './MarkerLayer.types';

/**
 * 마커 렌더링 전용 레이어 컴포넌트
 *
 * @description
 * 현재는 스켈레톤 단계로, map 인스턴스 접근 여부만 확인합니다.
 */
const MarkerLayer = (_props: MarkerLayerProps) => {
  useMap();
  return null;
};

export default MarkerLayer;
