interface PolylineLayerProps {
  /** 선 색상 @default '#3B82F6' */
  strokeColor?: string;
  /** 선 굵기 @default 4 */
  strokeWeight?: number;
  /** 선 투명도 (0~1) @default 0.8 */
  strokeOpacity?: number;
  /** z-index (마커보다 낮게 설정) @default 1 */
  zIndex?: number;
}

export type { PolylineLayerProps };
