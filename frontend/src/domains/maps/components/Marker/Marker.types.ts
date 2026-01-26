import type { LatLngLiteral } from '@/libs/map-sdk';

/**
 * Marker 컴포넌트 Props
 */
interface MarkerProps {
  /** 마커 위치 */
  position: LatLngLiteral;
  /** 마커 제목 (툴팁) */
  title?: string;
  /** 클릭 이벤트 핸들러 */
  onClick?: () => void;
  /** 클릭 가능 여부 @default true */
  clickable?: boolean;
  /** 드래그 가능 여부 @default false */
  draggable?: boolean;
  /** 투명도 (0~1) */
  opacity?: number;
  /** z-index */
  zIndex?: number;
}

export type { MarkerProps };
