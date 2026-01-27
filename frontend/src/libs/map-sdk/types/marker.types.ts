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

export type { MarkerItemType, MarkerClickHandlerType };
