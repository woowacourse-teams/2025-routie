import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import HashtagFilter from '@/domains/maps/components/HashtagFilter/HashtagFilter';
import KakaoMapLoadBoundary from '@/domains/maps/components/KakaoMapLoadBoundary/KakaoMapLoadBoundary';
import Map from '@/domains/maps/components/Map/Map';
import Marker from '@/domains/maps/components/Marker/Marker';
import NumberMarker from '@/domains/maps/components/Marker/NumberMarker';
import PlaceOverlayCard from '@/domains/maps/components/PlaceOverlayCard/PlaceOverlayCard';
import { useClickedPlace } from '@/domains/maps/hooks/useClickedPlace';
import { useCustomOverlay } from '@/domains/maps/hooks/useCustomOverlay';
import { useMap } from '@/domains/maps/hooks/useMap';
import { useMapNavigation } from '@/domains/maps/hooks/useMapNavigation';
import { useMapRenderer } from '@/domains/maps/hooks/useMapRenderer';
import { useRoutePlacesWithDetails } from '@/domains/maps/hooks/useRoutePlacesWithDetails';
import { useHashtagFilterContext } from '@/domains/places/contexts/useHashtagFilterContext';
import { usePlaceList } from '@/domains/places/hooks/usePlaceList';
import type { PlaceDataType } from '@/domains/places/types/place.types';
import { filterPlacesByHashtags } from '@/domains/places/utils/filterPlaces';



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
 * 마커는 Marker/NumberMarker 컴포넌트로 선언적 렌더링합니다.
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

  // 장소 데이터
  const { placeList } = usePlaceList();
  const { routiePlacesWithDetails } = useRoutePlacesWithDetails();
  const { selectedHashtags } = useHashtagFilterContext();

  const { containerEl, openAt, close } = useCustomOverlay(mapRef);
  const { clickedPlace, handleMapClick, handleMarkerClick } = useClickedPlace({
    openAt,
    close,
  });

  // 마커 클릭 시 지도 이동을 위한 navigateToPlace
  const { navigateToPlace } = useMapNavigation({
    mapRef,
    isInitialLoad,
    setIsInitialLoad,
  });

  const { renderMapElements } = useMapRenderer({
    mapRef,
    isInitialLoad,
    setIsInitialLoad,
  });

  // 마커 클릭 핸들러 (오버레이 표시 + 지도 이동)
  const handleMarkerClickWithNavigation = useCallback(
    (place: PlaceDataType) => {
      handleMarkerClick(place);
      navigateToPlace(place);
    },
    [handleMarkerClick, navigateToPlace],
  );

  // 필터링된 장소 목록 (기본 마커용 - routieSequence 없는 것만)
  const basicMarkerPlaces = useMemo(() => {
    if (!placeList) return [];

    const routiePlaceIds = new Set(routiePlacesWithDetails.map((rp) => rp.id));

    const filteredPlaces = filterPlacesByHashtags({
      places: placeList,
      selectedHashtags,
      priorityPlaceIds: [...routiePlaceIds],
    });

    // routieSequence가 없는 장소만 (기본 마커)
    return filteredPlaces.filter((place) => !routiePlaceIds.has(place.id));
  }, [placeList, routiePlacesWithDetails, selectedHashtags]);

  // 지도 클릭 이벤트 등록
  useEffect(() => {
    if (!map) return;

    window.kakao.maps.event.addListener(map, 'click', handleMapClick);

    return () => {
      window.kakao.maps.event.removeListener(map, 'click', handleMapClick);
    };
  }, [map, handleMapClick]);

  // 맵 요소 렌더링 (폴리라인, 맵 피팅 등 - 마커는 선언적 컴포넌트로 처리)
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

      {/* 기본 마커 - 선언적 Marker 컴포넌트 */}
      {basicMarkerPlaces.map((place) => (
        <Marker
          key={place.id}
          position={{ lat: place.latitude, lng: place.longitude }}
          title={place.name}
          onClick={() => handleMarkerClickWithNavigation(place)}
        />
      ))}

      {/* 숫자 마커 - 선언적 NumberMarker 컴포넌트 */}
      {routiePlacesWithDetails.map((place) => (
        <NumberMarker
          key={`number-${place.id}`}
          position={{ lat: place.latitude, lng: place.longitude }}
          sequence={place.sequence}
          onClick={() => handleMarkerClickWithNavigation(place)}
        />
      ))}

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
        <Map center={INITIAL_CENTER} level={INITIAL_LEVEL} css={KakaoMapContainerStyle}>
          <MapContent isSidebarOpen={isSidebarOpen} />
        </Map>
      </KakaoMapLoadBoundary>
    </div>
  );
};

export default KakaoMap;
