import type { MarkerClickHandlerType, MarkerItemType } from '../../types/marker.types';

/**
 * MarkerLayer 컴포넌트 Props
 */
interface MarkerLayerProps {
  /** 렌더링할 마커 목록 */
  markerItems: MarkerItemType[];
  /** 마커 클릭 콜백 */
  onMarkerClick?: MarkerClickHandlerType;
}

export type { MarkerLayerProps };
