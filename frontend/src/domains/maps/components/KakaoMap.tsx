import { useEffect, useRef } from 'react';

import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';

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

// 카카오맵 타입 정의
type KakaoMap = InstanceType<typeof window.kakao.maps.Map>;

const mockPlaces = [
  {
    id: 1,
    name: '스타벅스 강남점',
    roadAddress: '서울특별시 강남구 강남대로 456',
    longitude: '127.0276',
    latitude: '37.4979',
    openAt: '07:00',
    closeAt: '23:00',
    closedDayOfWeeks: [],
  },
  {
    id: 2,
    name: '올리브영 강남본점',
    roadAddress: '서울특별시 강남구 강남대로 458',
    longitude: '127.0281',
    latitude: '37.4982',
    openAt: '10:00',
    closeAt: '22:00',
    closedDayOfWeeks: [],
  },
  {
    id: 3,
    name: '맥도날드 강남점',
    roadAddress: '서울특별시 강남구 강남대로 460',
    longitude: '127.0286',
    latitude: '37.4985',
    openAt: '06:00',
    closeAt: '24:00',
    closedDayOfWeeks: [],
  },
  {
    id: 4,
    name: '롯데리아 강남점',
    roadAddress: '서울특별시 강남구 강남대로 462',
    longitude: '127.0291',
    latitude: '37.4988',
    openAt: '06:30',
    closeAt: '23:30',
    closedDayOfWeeks: [],
  },
  {
    id: 5,
    name: 'GS25 강남점',
    roadAddress: '서울특별시 강남구 강남대로 464',
    longitude: '127.0296',
    latitude: '37.4991',
    openAt: '24:00',
    closeAt: '24:00',
    closedDayOfWeeks: [],
  },
  {
    id: 6,
    name: 'CU 강남점',
    roadAddress: '서울특별시 강남구 강남대로 466',
    longitude: '127.0301',
    latitude: '37.4994',
    openAt: '24:00',
    closeAt: '24:00',
    closedDayOfWeeks: [],
  },
  {
    id: 7,
    name: '이마트 강남점',
    roadAddress: '서울특별시 강남구 강남대로 468',
    longitude: '127.0306',
    latitude: '37.4997',
    openAt: '10:00',
    closeAt: '22:00',
    closedDayOfWeeks: ['SUNDAY'],
  },
  {
    id: 8,
    name: '홈플러스 강남점',
    roadAddress: '서울특별시 강남구 강남대로 470',
    longitude: '127.0311',
    latitude: '37.5000',
    openAt: '10:00',
    closeAt: '22:00',
    closedDayOfWeeks: ['SUNDAY'],
  },
  {
    id: 9,
    name: '롯데마트 강남점',
    roadAddress: '서울특별시 강남구 강남대로 472',
    longitude: '127.0316',
    latitude: '37.5003',
    openAt: '10:00',
    closeAt: '22:00',
    closedDayOfWeeks: ['SUNDAY'],
  },
  {
    id: 10,
    name: '코스트코 강남점',
    roadAddress: '서울특별시 강남구 강남대로 474',
    longitude: '127.0321',
    latitude: '37.5006',
    openAt: '10:00',
    closeAt: '21:00',
    closedDayOfWeeks: ['SUNDAY'],
  },
];

const mockRoutiePath = [
  {
    id: 1,
    name: '스타벅스 강남점',
    roadAddress: '서울특별시 강남구 강남대로 456',
    longitude: '127.0276',
    latitude: '37.4979',
    openAt: '07:00',
    closeAt: '23:00',
    closedDayOfWeeks: [],
  },
  {
    id: 2,
    name: '올리브영 강남본점',
    roadAddress: '서울특별시 강남구 강남대로 458',
    longitude: '127.0281',
    latitude: '37.4982',
    openAt: '10:00',
    closeAt: '22:00',
    closedDayOfWeeks: [],
  },
  {
    id: 3,
    name: '맥도날드 강남점',
    roadAddress: '서울특별시 강남구 강남대로 460',
    longitude: '127.0286',
    latitude: '37.4985',
    openAt: '06:00',
    closeAt: '24:00',
    closedDayOfWeeks: [],
  },
  {
    id: 4,
    name: '롯데리아 강남점',
    roadAddress: '서울특별시 강남구 강남대로 462',
    longitude: '127.0291',
    latitude: '37.4988',
    openAt: '06:30',
    closeAt: '23:30',
    closedDayOfWeeks: [],
  },
  {
    id: 5,
    name: 'GS25 강남점',
    roadAddress: '서울특별시 강남구 강남대로 464',
    longitude: '127.0296',
    latitude: '37.4991',
    openAt: '24:00',
    closeAt: '24:00',
    closedDayOfWeeks: [],
  },
];

interface KakaoMapProps {
  lat?: number;
  lng?: number;
  level?: number;
}

const KakaoMap = ({
  lat = 37.5665,
  lng = 126.978,
  level = 3,
}: KakaoMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

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
  const { loadPolyline } = usePolyline({
    map: mapRef,
  });

  const finalError = sdkError || errorMessage;
  const finalMapState = sdkError ? 'error' : mapState;

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    mockPlaces.forEach((place) => {
      drawMarkers(Number(place.latitude), Number(place.longitude));
    });
  }, [mapRef.current, drawMarkers]);

  useEffect(() => {
    fitMapToMarkers(mockPlaces);
    mockRoutiePath.forEach((place) => {
      loadPolyline(Number(place.latitude), Number(place.longitude));
    });
  }, [loadPolyline, fitMapToMarkers]);

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
    </div>
  );
};

export default KakaoMap;
export type { KakaoMapProps };
