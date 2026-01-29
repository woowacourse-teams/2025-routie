import type { PlaceDataType } from '@/domains/places/types/place.types';

/**
 * 마커 입력 데이터 타입
 */
interface MarkerItemType {
  /** 마커에 대응하는 장소 데이터 */
  place: PlaceDataType;
  /** Routie 순서 (선택) */
  routieSequence?: number;
}

/**
 * 마커 클릭 이벤트 핸들러 타입
 */
type MarkerClickHandlerType = (place: PlaceDataType) => void;

/**
 * MarkerLayer 컴포넌트 Props
 */
interface MarkerLayerProps {
  /** 렌더링할 마커 목록 */
  markerItems: MarkerItemType[];
  /** 마커 클릭 콜백 */
  onMarkerClick?: MarkerClickHandlerType;
}

export type { MarkerItemType, MarkerClickHandlerType, MarkerLayerProps };
