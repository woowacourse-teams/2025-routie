import { useEffect, useRef } from 'react';

import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import { useRoutieContext } from '@/domains/routie/contexts/useRoutieContext';
import { usePlaceListContext } from '@/layouts/PlaceList/contexts/PlaceListContext';

import { useKakaoMapInit } from '../hooks/useKakaoMapInit';
import { useKakaoMapSDK } from '../hooks/useKakaoMapSDK';
import useMapMarker from '../hooks/useMapMarker';
import usePolyline from '../hooks/usePolyline';

import {
  KakaoMapContainerStyle,
  KakaoMapErrorStyle,
  KakaoMapLoadingStyle,
  KakaoMapWrapperStyle,
} from './KakaoMap.styles';

import type { KakaoMapProps } from '../types/KaKaoMap.types';

const KakaoMap = ({
  lat = 37.5665,
  lng = 126.978,
  level = 3,
}: KakaoMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { placeList } = usePlaceListContext();
  const { routieIdList } = useRoutieContext();

  const routiePlaces = placeList
    .filter((place) => routieIdList.includes(place.id))
    .sort((a, b) => routieIdList.indexOf(a.id) - routieIdList.indexOf(b.id));

  const { sdkReady, sdkError } = useKakaoMapSDK();
  const { mapRef, mapState, errorMessage } = useKakaoMapInit({
    containerRef: mapContainerRef,
    sdkReady,
    lat,
    lng,
    level,
  });
  const { fitMapToMarkers, drawMarkers } = useMapMarker({
    map: mapRef,
  });
  const { loadPolyline, clearPolyline } = usePolyline({
    map: mapRef,
  });

  const finalError = sdkError || errorMessage;
  const finalMapState = sdkError ? 'error' : mapState;

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    placeList.forEach((place) => {
      drawMarkers(Number(place.latitude), Number(place.longitude));
    });

    fitMapToMarkers(placeList);
  }, [mapRef.current, drawMarkers, placeList]);

  useEffect(() => {
    fitMapToMarkers(placeList);
    clearPolyline();

    routiePlaces.forEach((place) => {
      loadPolyline(Number(place.latitude), Number(place.longitude));
    });
  }, [loadPolyline, fitMapToMarkers, routiePlaces]);

  return (
    <div css={KakaoMapWrapperStyle}>
      {/* 실제 지도 컨테이너 */}
      <div
        ref={mapContainerRef}
        css={KakaoMapContainerStyle}
        role="img"
        aria-label="카카오 지도"
        tabIndex={0}
      />

      {/* 로딩 오버레이 */}
      {finalMapState === 'loading' && (
        <Flex
          css={KakaoMapLoadingStyle}
          role="status"
          aria-label="지도 로딩 중"
          direction="column"
          alignItems="center"
        >
          <Text variant="caption" css={{ textAlign: 'center' }}>
            🗺️
          </Text>
          <Text variant="caption" css={{ textAlign: 'center' }}>
            지도를 불러오는 중...
          </Text>
        </Flex>
      )}

      {/* 에러 오버레이 */}
      {finalMapState === 'error' && (
        <Flex
          css={KakaoMapErrorStyle}
          direction="column"
          alignItems="center"
          gap={0.8}
          width="100%"
        >
          <Text variant="caption">⚠️</Text>
          <Text variant="caption">{finalError}</Text>
        </Flex>
      )}

      <Button
        variant="primary"
        width="10%"
        onClick={() => fitMapToMarkers(routiePlaces)}
        css={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1 }}
      >
        <Flex justifyContent="center" width="100%">
          <Text variant="subTitle" color="white">
            동선만 보기
          </Text>
        </Flex>
      </Button>
    </div>
  );
};

export default KakaoMap;
export type { KakaoMapProps };
