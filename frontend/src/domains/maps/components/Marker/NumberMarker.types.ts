import type { LatLngLiteral } from '@/libs/map-sdk';

/**
 * NumberMarker 컴포넌트 Props
 */
interface NumberMarkerProps {
  /** 마커 위치 */
  position: LatLngLiteral;
  /** 표시할 숫자 (sequence) */
  sequence: number;
  /** 클릭 이벤트 핸들러 */
  onClick?: () => void;
  /** z-index */
  zIndex?: number;
}

export type { NumberMarkerProps };
