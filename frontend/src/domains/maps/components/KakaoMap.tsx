import { useRef } from 'react';

import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';

import { useKakaoMapInit } from '../hooks/useKakaoMapInit';
import { useKakaoMapSDK } from '../hooks/useKakaoMapSDK';

import {
  KakaoMapContainerStyle,
  KakaoMapErrorStyle,
  KakaoMapLoadingStyle,
  KakaoMapWrapperStyle,
} from './KakaoMap.styles';

// 카카오맵 타입 정의
type KakaoMap = InstanceType<typeof window.kakao.maps.Map>;

interface KakaoMapProps {
  lat?: number;
  lng?: number;
  level?: number;
  onMapReady?: (map: KakaoMap) => void;
}

const KakaoMap = ({
  lat = 37.5665,
  lng = 126.978,
  level = 3,
  onMapReady,
}: KakaoMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // 분리된 훅들 사용
  const { sdkReady, sdkError } = useKakaoMapSDK();

  const { mapRef, mapState, errorMessage } = useKakaoMapInit({
    containerRef: mapContainerRef,
    sdkReady,
    lat,
    lng,
    level,
    onMapReady,
  });

  const finalError = sdkError || errorMessage;
  const finalMapState = sdkError ? 'error' : mapState;

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
