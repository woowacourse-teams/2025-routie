import { memo, useEffect, useLayoutEffect, useMemo, useRef } from 'react';

import { kakaoMapAdapter } from '../../adapters/kakaoMapAdapter';
import { useMap } from '../../hooks/useMap';
import { createCustomMarkerElement } from '../../utils/createCustomMarkerElement';

import type { NumberMarkerProps } from './NumberMarker.types';
import type { CustomOverlayInstanceType } from '../../types/adapter.types';

/**
 * 선언적 숫자 마커 컴포넌트
 *
 * @description
 * 카카오 지도에 숫자가 표시된 마커를 선언적으로 렌더링하는 컴포넌트입니다.
 * CustomOverlay를 사용하여 커스텀 스타일의 숫자 마커를 표시합니다.
 * Map 컴포넌트의 자식으로 사용해야 합니다.
 * 컴포넌트가 언마운트되면 마커가 자동으로 제거됩니다.
 *
 * @param props - 컴포넌트 Props
 * @param props.position - 마커 위치 { lat, lng }
 * @param props.sequence - 표시할 숫자
 * @param props.onClick - 클릭 이벤트 핸들러
 *
 * @example
 * ```tsx
 * <Map center={{ lat: 37.5, lng: 127.0 }}>
 *   <NumberMarker
 *     position={{ lat: 37.5, lng: 127.0 }}
 *     sequence={1}
 *     onClick={() => console.log('clicked')}
 *   />
 * </Map>
 * ```
 */
const NumberMarker = memo(
  ({ position, sequence, onClick }: NumberMarkerProps) => {
    const map = useMap();
    const overlayRef = useRef<CustomOverlayInstanceType | null>(null);
    const contentRef = useRef<HTMLElement | null>(null);
    const onClickRef = useRef(onClick);

    // onClick ref 업데이트 (핸들러 변경 시 리스너 재등록 방지)
    onClickRef.current = onClick;

    // 마커 요소 메모이제이션 (sequence 변경 시에만 재생성)
    const content = useMemo(() => createCustomMarkerElement(sequence), [sequence]);

    // 오버레이 생성 (최초 1회 또는 sequence 변경 시)
    useLayoutEffect(() => {
      if (!map) return;

      const overlay = kakaoMapAdapter.createCustomOverlay(map, {
        position,
        content,
        xAnchor: 0.5,
        yAnchor: 0.5,
      });

      overlayRef.current = overlay;
      contentRef.current = content;

      // cleanup: 오버레이 제거
      return () => {
        kakaoMapAdapter.removeCustomOverlay(overlay);
        overlayRef.current = null;
        contentRef.current = null;
      };
      // content가 변경되면 (sequence 변경) 오버레이 재생성
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map, content]);

    // position 변경 감지 → 위치 업데이트
    useEffect(() => {
      if (!overlayRef.current) return;

      kakaoMapAdapter.setCustomOverlayPosition(overlayRef.current, position);
      // position 객체 참조가 아닌 실제 좌표 값이 변경될 때만 실행
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [position.lat, position.lng]);

    // click 이벤트 리스너
    useEffect(() => {
      const contentElement = contentRef.current;
      if (!contentElement) return;

      const handleClick = () => {
        onClickRef.current?.();
      };

      contentElement.addEventListener('click', handleClick);

      return () => {
        contentElement.removeEventListener('click', handleClick);
      };
    }, [content]); // content가 변경되면 리스너 재등록

    // UI를 렌더링하지 않음
    return null;
  },
  (prevProps, nextProps) => {
    // true 반환 = 리렌더링 스킵
    // onClick은 내부에서 ref로 처리하므로 비교하지 않음
    return (
      prevProps.position.lat === nextProps.position.lat &&
      prevProps.position.lng === nextProps.position.lng &&
      prevProps.sequence === nextProps.sequence
    );
  },
);

NumberMarker.displayName = 'NumberMarker';

export default NumberMarker;
