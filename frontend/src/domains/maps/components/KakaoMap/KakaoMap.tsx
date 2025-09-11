import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import PlaceOverlayCard from '@/domains/maps/components/PlaceOverlayCard/PlaceOverlayCard';
import { usePlaceListContext } from '@/domains/places/contexts/PlaceList/PlaceListContext';
import { PlaceFetchType } from '@/domains/places/types/place.types';
import { useRoutieContext } from '@/domains/routie/contexts/useRoutieContext';

import { useCustomOverlay } from '../../hooks/useCustomOverlay';
import { useKakaoMapInit } from '../../hooks/useKakaoMapInit';
import { useKakaoMapSDK } from '../../hooks/useKakaoMapSDK';
import { useMapMarker } from '../../hooks/useMapMarker';
import { usePolyline } from '../../hooks/usePolyline';

import {
  KakaoMapContainerStyle,
  KakaoMapErrorStyle,
  KakaoMapLoadingStyle,
  KakaoMapWrapperStyle,
} from './KakaoMap.styles';

const KakaoMap = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { placeList, newlyAddedPlace } = usePlaceListContext();
  const { routieIdList } = useRoutieContext();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const routiePlaces = useMemo(
    () =>
      [...placeList]
        .filter((place) => routieIdList.includes(place.id))
        .sort(
          (a, b) => routieIdList.indexOf(a.id) - routieIdList.indexOf(b.id),
        ),
    [placeList, routieIdList],
  );

  const { sdkReady, sdkError } = useKakaoMapSDK();
  const { mapRef, mapState, errorMessage } = useKakaoMapInit({
    containerRef: mapContainerRef,
    sdkReady,
  });
  const { fitMapToMarkers, drawMarkers, clearMarkers, fitMapToMarker } =
    useMapMarker(mapRef);
  const { loadPolyline, clearPolyline } = usePolyline(mapRef);
  const { containerEl, openAt, close } = useCustomOverlay(mapRef);
  const [selectedPlace, setSelectedPlace] = useState<PlaceFetchType | null>(
    null,
  );

  const finalError = sdkError || errorMessage;
  const finalMapState = sdkError ? 'error' : mapState;

  const handleMapClick = () => {
    setSelectedPlace(null);
    close();
  };

  useEffect(() => {
    if (mapState !== 'ready' || !mapRef.current) return;

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
  }, [mapState]);

  useEffect(() => {
    if (mapState !== 'ready' || !mapRef.current) return;

    const renderMapElements = () => {
      clearMarkers();
      placeList.forEach((place) => {
        const routieIndex = routieIdList.indexOf(place.id);
        const routieSequence = routieIndex !== -1 ? routieIndex + 1 : undefined;

        drawMarkers({
          place,
          routieSequence,
          onClick: () => {
            setSelectedPlace(place);
            openAt(place.latitude, place.longitude);
          },
        });
      });

      if (isInitialLoad && placeList.length > 0) {
        fitMapToMarkers(placeList);
        setIsInitialLoad(false);
      } else if (newlyAddedPlace) {
        fitMapToMarker(newlyAddedPlace.latitude, newlyAddedPlace.longitude);
      }

      clearPolyline();

      routiePlaces.forEach((place) => {
        loadPolyline(place.latitude, place.longitude);
      });
    };

    renderMapElements();
  }, [mapState, placeList, routiePlaces, newlyAddedPlace]);

  return (
    <div css={KakaoMapWrapperStyle}>
      <div
        ref={mapContainerRef}
        css={KakaoMapContainerStyle}
        role="img"
        aria-label="카카오 지도"
        tabIndex={0}
      />

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

      {containerEl &&
        selectedPlace &&
        createPortal(
          <PlaceOverlayCard place={selectedPlace} onClose={handleMapClick} />,
          containerEl,
        )}
    </div>
  );
};

export default KakaoMap;
