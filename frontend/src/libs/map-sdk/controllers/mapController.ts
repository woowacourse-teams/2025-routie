import { mapSdkLoader } from '../core/MapSdkLoader';

import type {
  LatLngInstanceType,
  MapCreateOptions,
  MapInstanceType,
} from '../types/adapter.types';

/**
 * 지도 컨트롤러
 *
 * @description
 * Adapter를 통해 지도 생성/제어 기능을 제공합니다.
 * 컴포넌트에서 직접 window.kakao.maps를 사용하지 않고 이 컨트롤러를 통해 지도를 생성합니다.
 */
const mapController = {
  /**
   * 지도 인스턴스 생성
   *
   * @param container - 지도 컨테이너 DOM 요소
   * @param options - 지도 생성 옵션
   * @returns 지도 인스턴스
   *
   * @example
   * ```typescript
   * const map = mapController.createMap(containerRef.current, {
   *   center: { lat: 37.5, lng: 127.0 },
   *   level: 3,
   *   draggable: true,
   *   scrollwheel: true,
   * });
   * ```
   */
  createMap(container: HTMLElement, options: MapCreateOptions): MapInstanceType {
    const adapter = mapSdkLoader.getAdapter();
    return adapter.createMap(container, options);
  },

  /**
   * 지도 relayout 호출
   *
   * @description
   * 지도 컨테이너 크기가 변경된 후 호출하여 지도를 다시 그립니다.
   *
   * @param map - 지도 인스턴스
   *
   * @example
   * ```typescript
   * mapController.relayout(map);
   * ```
   */
  relayout(map: MapInstanceType): void {
    const adapter = mapSdkLoader.getAdapter();
    adapter.relayout(map);
  },

  /**
   * LatLng 객체 생성
   *
   * @param lat - 위도
   * @param lng - 경도
   * @returns LatLng 객체
   *
   * @example
   * ```typescript
   * const latLng = mapController.createLatLng(37.5, 127.0);
   * ```
   */
  createLatLng(lat: number, lng: number): LatLngInstanceType {
    const adapter = mapSdkLoader.getAdapter();
    return adapter.createLatLng(lat, lng);
  },
};

export { mapController };
