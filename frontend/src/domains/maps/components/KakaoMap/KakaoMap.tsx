import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import HashtagFilter from '@/domains/maps/components/HashtagFilter/HashtagFilter';
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
} from './KakaoMap.styles';

import type { KakaoMapProps } from './KakaoMap.types';

const KakaoMap = ({ isSidebarOpen }: KakaoMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

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
      <HashtagFilter isSidebarOpen={isSidebarOpen} />
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
