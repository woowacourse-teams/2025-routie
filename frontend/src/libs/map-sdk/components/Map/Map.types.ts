import type { ReactNode } from 'react';

import type { KakaoMap } from '../../../../../kakao.d';
import type { SerializedStyles } from '@emotion/react';

/**
 * 위경도 좌표 타입
 */
interface LatLng {
  /** 위도 */
  lat: number;
  /** 경도 */
  lng: number;
}

/**
 * Map 컴포넌트 Props
 */
interface MapProps {
  /** 지도 중심 좌표 */
  center: LatLng;
  /** 지도 확대 레벨 (1~14, 숫자가 작을수록 확대) @default 3 */
  level?: number;
  /** Emotion 스타일 클래스 */
  className?: string;
  /** Emotion css prop */
  css?: SerializedStyles;
  /** 자식 컴포넌트 (지도 위에 렌더링) */
  children?: ReactNode;
  /** 마우스 드래그로 지도 이동 가능 여부 @default true */
  draggable?: boolean;
  /** 마우스 스크롤로 확대/축소 가능 여부 @default true */
  scrollwheel?: boolean;
  /** 지도 클릭 이벤트 핸들러 */
  onClick?: () => void;
  /** 지도 드래그 종료 이벤트 핸들러 */
  onDragEnd?: () => void;
  /** 지도 확대/축소 변경 이벤트 핸들러 */
  onZoomChanged?: () => void;
  /** 지도 인스턴스 생성 완료 시 호출되는 콜백 */
  onMapReady?: (map: KakaoMap) => void;
}

export type { MapProps, LatLng };
