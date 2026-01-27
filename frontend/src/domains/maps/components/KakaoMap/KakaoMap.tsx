import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import HashtagFilter from '@/domains/maps/components/HashtagFilter/HashtagFilter';
import KakaoMapLoadBoundary from '@/domains/maps/components/KakaoMapLoadBoundary/KakaoMapLoadBoundary';
import PlaceOverlayCard from '@/domains/maps/components/PlaceOverlayCard/PlaceOverlayCard';
import { useClickedPlace } from '@/domains/maps/hooks/useClickedPlace';
import { useCustomOverlay } from '@/domains/maps/hooks/useCustomOverlay';
import { useMapRenderer } from '@/domains/maps/hooks/useMapRenderer';
import { useMarkerRenderer } from '@/domains/maps/hooks/useMarkerRenderer';
import type { PlaceDataType } from '@/domains/places/types/place.types';
import { useMap, Map, MarkerLayer } from '@/libs/map-sdk';

import {
  KakaoMapContainerStyle,
  KakaoMapErrorStyle,
  KakaoMapLoadingStyle,
  KakaoMapWrapperStyle,
} from './KakaoMap.styles';

import type { KakaoMapProps } from './KakaoMap.types';
import type { KakaoMap as KakaoMapType } from '../../../../../kakao.d';

const INITIAL_CENTER = { lat: 37.554, lng: 126.97 };
const INITIAL_LEVEL = 7;

/**
 * 지도 로딩 중 표시되는 컴포넌트
 */
const MapLoading = () => (
  <Flex
    css={KakaoMapLoadingStyle}
    role="status"
    aria-label="지도 로딩 중"
    direction="column"
  >
    <Text variant="caption" css={{ textAlign: 'center' }}>
      지도를 불러오는 중...
    </Text>
  </Flex>
);

/**
 * 지도 로딩 에러 시 표시되는 컴포넌트
 * @param error - 에러 객체
 */
const MapError = ({ error }: { error: Error }) => (
  <Flex css={KakaoMapErrorStyle} direction="column" gap={0.8}>
    <Text variant="caption">{error.message}</Text>
  </Flex>
);

/**
 * 지도 내용 컴포넌트 (마커, 폴리라인, 오버레이 등)
 *
 * @description
 * Map 컴포넌트 내부에서 렌더링되며 useMap()을 통해 지도 인스턴스에 접근합니다.
 * 기존 훅들과의 호환성을 위해 mapRef 패턴을 유지합니다.
 *
 * @param props - 컴포넌트 Props
 * @param props.isSidebarOpen - 사이드바 열림 상태
 */
const MapContent = ({ isSidebarOpen }: { isSidebarOpen: boolean }) => {
  const map = useMap();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // 기존 훅들과 호환성을 위해 ref 패턴 유지
  const mapRef = useRef<KakaoMapType | null>(null);
  mapRef.current = map;

  const { containerEl, openAt, close } = useCustomOverlay(mapRef);
  const { clickedPlace, handleMapClick, handleMarkerClick } = useClickedPlace({
    openAt,
    close,
  });
  const { renderMapElements, navigateToPlace } = useMapRenderer({
    mapRef,
    isInitialLoad,
    setIsInitialLoad,
  });
  const { markerItems } = useMarkerRenderer();

  const handleMarkerClickWithNavigate = useCallback(
    (place: PlaceDataType) => {
      handleMarkerClick(place);
      navigateToPlace(place);
    },
    [handleMarkerClick, navigateToPlace],
  );

  // 지도 클릭 이벤트 등록
  useEffect(() => {
    if (!map) return;

    window.kakao.maps.event.addListener(map, 'click', handleMapClick);

    return () => {
      window.kakao.maps.event.removeListener(map, 'click', handleMapClick);
    };
  }, [map, handleMapClick]);

  // 맵 요소 렌더링 (마커, 폴리라인 등)
  useEffect(() => {
    if (!map) return;
    renderMapElements();
  }, [map, renderMapElements]);

  // 사이드바 토글 시 relayout 호출
  useEffect(() => {
    if (!map) return;

    const timeoutId = setTimeout(() => {
      map.relayout();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [map, isSidebarOpen]);

  return (
    <>
      <HashtagFilter isSidebarOpen={isSidebarOpen} />
      <MarkerLayer
        markerItems={markerItems}
        onMarkerClick={handleMarkerClickWithNavigate}
      />
      {containerEl &&
        clickedPlace &&
        createPortal(
          <PlaceOverlayCard place={clickedPlace} onClose={handleMapClick} />,
          containerEl,
        )}
    </>
  );
};

/**
 * 카카오 지도 메인 컴포넌트
 *
 * @description
 * 카카오 지도를 렌더링하는 메인 컴포넌트입니다.
 * SDK 로딩 상태를 관리하고 지도 및 관련 UI를 표시합니다.
 *
 * @param props - 컴포넌트 Props
 * @param props.isSidebarOpen - 사이드바 열림 상태 (relayout 트리거용)
 *
 * @example
 * ```tsx
 * <KakaoMap isSidebarOpen={isSidebarOpen} />
 * ```
 */
const KakaoMap = ({ isSidebarOpen }: KakaoMapProps) => {
  return (
    <div css={KakaoMapWrapperStyle}>
      <KakaoMapLoadBoundary
        fallback={<MapLoading />}
        errorFallback={(error) => <MapError error={error} />}
      >
        <Map
          center={INITIAL_CENTER}
          level={INITIAL_LEVEL}
          css={KakaoMapContainerStyle}
        >
          <MapContent isSidebarOpen={isSidebarOpen} />
        </Map>
      </KakaoMapLoadBoundary>
    </div>
  );
};

export default KakaoMap;
