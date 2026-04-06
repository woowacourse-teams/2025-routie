import { useEffect, useId, useRef } from 'react';

import { markerEngine } from '../../core/MarkerEngine';

import type { MarkerProps } from './Marker.types';

/**
 * 선언적 마커 컴포넌트
 *
 * @description
 * 카카오 지도에 마커를 선언적으로 렌더링하는 컴포넌트입니다.
 * 내부적으로 MarkerEngine에 등록/수정/해제 요청만 보내고,
 * 실제 SDK 마커 생성은 엔진이 담당합니다.
 *
 * @param props - 컴포넌트 Props
 * @param props.position - 마커 위치 { lat, lng }
 * @param props.title - 마커 제목 (툴팁)
 * @param props.onClick - 클릭 이벤트 핸들러
 *
 * @example
 * ```tsx
 * <Map center={{ lat: 37.5, lng: 127.0 }}>
 *   <Marker
 *     position={{ lat: 37.5, lng: 127.0 }}
 *     title="서울"
 *     onClick={() => console.log('clicked')}
 *   />
 * </Map>
 * ```
 */
const Marker = ({ position, title, onClick }: MarkerProps) => {
  const reactId = useId();
  const markerId = `marker-${reactId}`;
  const onClickRef = useRef(onClick);

  // onClick ref 업데이트
  onClickRef.current = onClick;

  // 마운트 시 등록, 언마운트 시 해제
  useEffect(() => {
    markerEngine.register({
      id: markerId,
      position,
      type: 'basic',
      title,
      onClick: () => onClickRef.current?.(),
    });

    return () => {
      markerEngine.unregister(markerId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markerId]);

  // props 변경 시 업데이트
  useEffect(() => {
    markerEngine.update({
      id: markerId,
      position,
      type: 'basic',
      title,
      onClick: () => onClickRef.current?.(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markerId, position.lat, position.lng, title]);

  return null;
};

Marker.displayName = 'Marker';

export default Marker;
