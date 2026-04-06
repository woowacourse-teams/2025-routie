import type { LatLngLiteral } from '../../types/adapter.types';

interface PolylineProps {
  /** 폴리라인 경로 좌표 배열 (최소 2개 이상) */
  path: LatLngLiteral[];
  /** 선 색상 @default '#F10000' */
  strokeColor?: string;
  /** 선 굵기 @default 3 */
  strokeWeight?: number;
  /** 선 투명도 (0~1) @default 0.6 */
  strokeOpacity?: number;
  /** z-index */
  zIndex?: number;
}

export type { PolylineProps };
