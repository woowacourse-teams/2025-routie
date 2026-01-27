import { memo, useEffect, useLayoutEffect, useRef } from 'react';

import { useMap } from '@/domains/maps/hooks/useMap';
import { kakaoMapAdapter } from '@/libs/map-sdk';
import type { MarkerInstanceType } from '@/libs/map-sdk';

import type { MarkerProps } from './Marker.types';

// 🔬 리렌더링 측정용 (테스트 후 삭제)
let markerRenderCount = 0;

/**
 * 선언적 마커 컴포넌트
 *
 * @description
 * 카카오 지도에 마커를 선언적으로 렌더링하는 컴포넌트입니다.
 * Map 컴포넌트의 자식으로 사용해야 합니다.
 * 컴포넌트가 언마운트되면 마커가 자동으로 제거됩니다.
 * memo로 감싸서 position/title이 변경될 때만 리렌더링됩니다.
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
const Marker = memo(({ position, title, onClick }: MarkerProps) => {
  // 🔬 리렌더링 측정용 (테스트 후 삭제)
  markerRenderCount += 1;
  console.log(`[Marker "${title}"] render count: ${markerRenderCount}`);

  const map = useMap();
  const markerRef = useRef<MarkerInstanceType | null>(null);
  const onClickRef = useRef(onClick);

  // onClick ref 업데이트 (핸들러 변경 시 리스너 재등록 방지)
  onClickRef.current = onClick;

  // 마커 생성 (최초 1회)
  useLayoutEffect(() => {
    if (!map) return;

    const marker = kakaoMapAdapter.createMarker(map, {
      position,
      title,
    });

    markerRef.current = marker;

    // cleanup: 마커 제거
    return () => {
      kakaoMapAdapter.removeMarker(marker);
      markerRef.current = null;
    };
    // 의존성: map만 (position 변경은 별도 effect에서 처리)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  // position 변경 감지 → 위치 업데이트
  useEffect(() => {
    if (!markerRef.current) return;

    kakaoMapAdapter.setMarkerPosition(markerRef.current, position);
    // position 객체 참조가 아닌 실제 좌표 값이 변경될 때만 실행
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position.lat, position.lng]);

  // click 이벤트 리스너
  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;

    const handleClick = () => {
      onClickRef.current?.();
    };

    kakaoMapAdapter.addMarkerListener(marker, 'click', handleClick);

    return () => {
      kakaoMapAdapter.removeMarkerListener(marker, 'click', handleClick);
    };
  }, [map]); // map이 변경되면 마커가 재생성되므로 리스너도 재등록

  // UI를 렌더링하지 않음
  return null;
}, (prevProps, nextProps) => {
  // true 반환 = 리렌더링 스킵
  // onClick은 내부에서 ref로 처리하므로 비교하지 않음
  return (
    prevProps.position.lat === nextProps.position.lat &&
    prevProps.position.lng === nextProps.position.lng &&
    prevProps.title === nextProps.title
  );
});

Marker.displayName = 'Marker';

export default Marker;
