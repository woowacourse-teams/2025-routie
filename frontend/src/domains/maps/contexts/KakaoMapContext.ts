import { createContext, useContext } from 'react';

import type { KakaoMap } from '../../../../kakao.d';

/**
 * 카카오 지도 컨텍스트 값 타입
 */
interface KakaoMapContextValue {
  /** 카카오 지도 인스턴스 */
  map: KakaoMap | null;
}

/**
 * 카카오 지도 컨텍스트
 *
 * @description
 * Map 컴포넌트 내부에서 지도 인스턴스에 접근하기 위한 컨텍스트입니다.
 * Map 컴포넌트 외부에서는 null을 반환합니다.
 */
const KakaoMapContext = createContext<KakaoMapContextValue | null>(null);

/**
 * 카카오 지도 인스턴스에 접근하는 훅
 *
 * @description
 * Map 컴포넌트의 자식 컴포넌트에서 지도 인스턴스에 접근할 때 사용합니다.
 * Map 컴포넌트 외부에서 사용하면 null을 반환합니다.
 *
 * @returns 카카오 지도 인스턴스 또는 null
 *
 * @example
 * ```typescript
 * const MapContent = () => {
 *   const map = useMap();
 *
 *   const handleCenter = () => {
 *     if (map) {
 *       const center = new window.kakao.maps.LatLng(37.5, 127.0);
 *       map.setCenter(center);
 *     }
 *   };
 *
 *   return <button onClick={handleCenter}>중심 이동</button>;
 * };
 *
 * // Map 컴포넌트 내부에서 사용
 * <Map center={{ lat: 37.5, lng: 127.0 }}>
 *   <MapContent />
 * </Map>
 * ```
 */
const useMap = (): KakaoMap | null => {
  const context = useContext(KakaoMapContext);
  return context?.map ?? null;
};

export default KakaoMapContext;
export { useMap };
export type { KakaoMapContextValue };
