import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import KakaoMapContext from '../../contexts/KakaoMapContext';
import { mapController } from '../../controllers/mapController';

import type { MapProps } from './Map.types';
import type { KakaoMap } from '../../../../../kakao.d';

/**
 * 선언적 카카오 지도 컴포넌트
 *
 * @description
 * 카카오 지도를 선언적으로 렌더링하는 컴포넌트입니다.
 * center, level 등의 props를 통해 지도 상태를 제어할 수 있습니다.
 * KakaoMapProvider 내부에서 사용해야 합니다.
 *
 * @param props - 컴포넌트 Props
 * @param props.center - 지도 중심 좌표 { lat, lng }
 * @param props.level - 지도 확대 레벨 (1~14) @default 3
 * @param props.className - Emotion 스타일 클래스
 * @param props.children - 자식 컴포넌트 (지도 위에 렌더링)
 * @param props.draggable - 드래그 가능 여부 @default true
 * @param props.scrollwheel - 스크롤 확대/축소 가능 여부 @default true
 * @param props.onClick - 지도 클릭 이벤트 핸들러
 * @param props.onDragEnd - 드래그 종료 이벤트 핸들러
 * @param props.onZoomChanged - 확대/축소 변경 이벤트 핸들러
 * @param props.onMapReady - 지도 인스턴스 생성 완료 콜백
 * @param ref - 지도 컨테이너 DOM 요소 ref
 *
 * @example
 * ```tsx
 * <KakaoMapProvider fallback={<Loading />}>
 *   <Map
 *     center={{ lat: 37.554, lng: 126.97 }}
 *     level={7}
 *     className={mapStyle}
 *     onClick={handleClick}
 *     onMapReady={(map) => console.log('Map ready:', map)}
 *   >
 *     <MapContent />
 *   </Map>
 * </KakaoMapProvider>
 * ```
 */
const Map = forwardRef<HTMLDivElement, MapProps>(
  (
    {
      center,
      level = 3,
      className,
      children,
      draggable = true,
      scrollwheel = true,
      onClick,
      onDragEnd,
      onZoomChanged,
      onMapReady,
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<KakaoMap | null>(null);
    const isInitializedRef = useRef(false);

    // ref 전달
    useImperativeHandle(ref, () => containerRef.current!, []);

    // 초기값을 ref에 저장 (의존성 배열 없이 초기화 시에만 사용)
    const initialCenterRef = useRef(center);
    const initialLevelRef = useRef(level);
    const initialDraggableRef = useRef(draggable);
    const initialScrollwheelRef = useRef(scrollwheel);
    const onMapReadyRef = useRef(onMapReady);
    onMapReadyRef.current = onMapReady;

    // 지도 인스턴스 생성 (useLayoutEffect로 DOM 렌더링 직후 실행)
    useLayoutEffect(() => {
      if (!containerRef.current || isInitializedRef.current) return;

      const mapInstance = mapController.createMap(containerRef.current, {
        center: {
          lat: initialCenterRef.current.lat,
          lng: initialCenterRef.current.lng,
        },
        level: initialLevelRef.current,
        draggable: initialDraggableRef.current,
        scrollwheel: initialScrollwheelRef.current,
      });

      isInitializedRef.current = true;
      setMap(mapInstance);

      // 컨테이너 크기 변경 후 relayout 호출
      setTimeout(() => {
        mapController.relayout(mapInstance);
      }, 0);

      onMapReadyRef.current?.(mapInstance);
    }, []);

    // center 변경 감지 → panTo
    useEffect(() => {
      if (!map) return;

      const currentCenter = map.getCenter();
      const newCenter = new window.kakao.maps.LatLng(center.lat, center.lng);

      // 좌표가 실제로 변경된 경우에만 panTo 호출
      if (
        currentCenter.getLat() !== newCenter.getLat() ||
        currentCenter.getLng() !== newCenter.getLng()
      ) {
        map.panTo(newCenter);
      }
    }, [map, center.lat, center.lng]);

    // level 변경 감지 → setLevel
    useEffect(() => {
      if (!map) return;

      const currentLevel = map.getLevel();
      if (currentLevel !== level) {
        map.setLevel(level);
      }
    }, [map, level]);

    // draggable 변경 감지
    useEffect(() => {
      if (!map) return;
      map.setDraggable(draggable);
    }, [map, draggable]);

    // scrollwheel 변경 감지
    useEffect(() => {
      if (!map) return;
      map.setZoomable(scrollwheel);
    }, [map, scrollwheel]);

    // 이벤트 리스너 등록/해제 - click
    useEffect(() => {
      if (!map || !onClick) return;

      window.kakao.maps.event.addListener(map, 'click', onClick);
      return () => {
        window.kakao.maps.event.removeListener(map, 'click', onClick);
      };
    }, [map, onClick]);

    // 이벤트 리스너 등록/해제 - dragend
    useEffect(() => {
      if (!map || !onDragEnd) return;

      window.kakao.maps.event.addListener(map, 'dragend', onDragEnd);
      return () => {
        window.kakao.maps.event.removeListener(map, 'dragend', onDragEnd);
      };
    }, [map, onDragEnd]);

    // 이벤트 리스너 등록/해제 - zoom_changed
    useEffect(() => {
      if (!map || !onZoomChanged) return;

      window.kakao.maps.event.addListener(map, 'zoom_changed', onZoomChanged);
      return () => {
        window.kakao.maps.event.removeListener(
          map,
          'zoom_changed',
          onZoomChanged,
        );
      };
    }, [map, onZoomChanged]);

    // Context 값 메모이제이션
    const contextValue = useMemo(() => ({ map }), [map]);

    return (
      <KakaoMapContext.Provider value={contextValue}>
        <div
          ref={containerRef}
          className={className}
          role="img"
          aria-label="카카오 지도"
          tabIndex={0}
        />
        {map && children}
      </KakaoMapContext.Provider>
    );
  },
);

Map.displayName = 'Map';

export default Map;
