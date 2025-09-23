import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import Profile from '@/domains/auth/components/Profile/Profile';
import UserInfoCard from '@/domains/auth/components/UserInfoCard/UserInfoCard';
import PlaceOverlayCard from '@/domains/maps/components/PlaceOverlayCard/PlaceOverlayCard';
import { useClickedPlace } from '@/domains/maps/hooks/useClickedPlace';
import { useCustomOverlay } from '@/domains/maps/hooks/useCustomOverlay';
import { useMapRenderer } from '@/domains/maps/hooks/useMapRenderer';
import { useMapState } from '@/domains/maps/hooks/useMapState';

import {
  KakaoMapContainerStyle,
  KakaoMapErrorStyle,
  KakaoMapLoadingStyle,
  KakaoMapWrapperStyle,
  kakaoMapProfileStyle,
  kakaoMapUserInfoStyle,
} from './KakaoMap.styles';

const KakaoMap = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isUserInfoOpen, setIsUserInfoOpen] = useState(false);

  const { mapRef, finalMapState, finalError } = useMapState({
    containerRef: mapContainerRef,
  });
  const { containerEl, openAt, close } = useCustomOverlay(mapRef);
  const { clickedPlace, handleMapClick, handleMarkerClick } = useClickedPlace({
    openAt,
    close,
  });
  const { renderMapElements } = useMapRenderer({
    mapRef,
    isInitialLoad,
    setIsInitialLoad,
    handleMarkerClick,
  });

  useEffect(() => {
    if (finalMapState !== 'ready' || !mapRef.current) return;

    window.kakao.maps.event.addListener(
      mapRef.current,
      'click',
      handleMapClick,
    );

    return () => {
      if (mapRef.current) {
        window.kakao.maps.event.removeListener(
          mapRef.current,
          'click',
          handleMapClick,
        );
      }
    };
  }, [finalMapState]);

  useEffect(() => {
    if (finalMapState !== 'ready' || !mapRef.current) return;

    renderMapElements();
  }, [finalMapState, renderMapElements]);

  return (
    <div css={KakaoMapWrapperStyle}>
      <div
        ref={mapContainerRef}
        css={KakaoMapContainerStyle}
        role="img"
        aria-label="카카오 지도"
        tabIndex={0}
      />
      <div css={kakaoMapProfileStyle}>
        <Profile onClick={() => setIsUserInfoOpen((prev) => !prev)} />
      </div>
      {isUserInfoOpen && (
        <div css={kakaoMapUserInfoStyle}>
          <UserInfoCard
            userName="랜덤한 사자"
            onClick={() => alert('로그아웃 버튼 클릭됨!')}
          />
        </div>
      )}
      {finalMapState === 'loading' && (
        <Flex
          css={KakaoMapLoadingStyle}
          role="status"
          aria-label="지도 로딩 중"
          direction="column"
        >
          <Text variant="caption" css={{ textAlign: 'center' }}>
            🗺️
          </Text>
          <Text variant="caption" css={{ textAlign: 'center' }}>
            지도를 불러오는 중...
          </Text>
        </Flex>
      )}
      {finalMapState === 'error' && (
        <Flex css={KakaoMapErrorStyle} direction="column" gap={0.8}>
          <Text variant="caption">⚠️</Text>
          <Text variant="caption">{finalError}</Text>
        </Flex>
      )}
      {containerEl &&
        clickedPlace &&
        createPortal(
          <PlaceOverlayCard place={clickedPlace} onClose={handleMapClick} />,
          containerEl,
        )}
    </div>
  );
};

export default KakaoMap;
