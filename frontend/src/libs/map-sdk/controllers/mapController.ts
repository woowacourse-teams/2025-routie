import { kakaoMapAdapter } from '@/libs/map-sdk/adapters/kakaoMapAdapter';
import type {
  LatLngLiteral,
  MapInstanceType,
} from '@/libs/map-sdk/types/adapter.types';

const createMap = (
  container: HTMLDivElement,
  center: LatLngLiteral,
  level: number,
): MapInstanceType => {
  const centerInstance = kakaoMapAdapter.createLatLng(center.lat, center.lng);
  return kakaoMapAdapter.createMap(container, { center: centerInstance, level });
};

const relayout = (map: MapInstanceType) => {
  kakaoMapAdapter.relayout(map);
};

export { createMap, relayout };
