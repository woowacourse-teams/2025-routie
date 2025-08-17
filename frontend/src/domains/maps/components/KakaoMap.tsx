import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import { PlaceCardProps } from '@/domains/places/components/PlaceCard/PlaceCard';
import { useRoutieContext } from '@/domains/routie/contexts/useRoutieContext';
import { usePlaceListContext } from '@/layouts/PlaceList/contexts/PlaceListContext';

import useCustomOverlay from '../hooks/useCustomOverlay';
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
import PlaceOverlayCard from './PlaceOverlayCard';

import createCustomMarkerElement from '../utils/createCustomMarkerElement';

import type { KakaoMapProps } from '../types/KaKaoMap.types';

const KakaoMap = ({ lat = 37.554, lng = 126.97, level = 7 }: KakaoMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { placeList } = usePlaceListContext();
  const { routieIdList } = useRoutieContext();

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
    lat,
    lng,
    level,
  });
  const { fitMapToMarker, fitMapToMarkers, drawMarkers, clearMarkers } =
    useMapMarker({
      map: mapRef,
      createCustomMarkerElement,
    });
  const { loadPolyline, clearPolyline } = usePolyline({
    map: mapRef,
  });
  const { containerEl, openAt, close } = useCustomOverlay({ map: mapRef });
  const [selectedPlace, setSelectedPlace] = useState<PlaceCardProps | null>(
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
          lat: place.latitude,
          lng: place.longitude,
          routieSequence,
          onClick: () => {
            setSelectedPlace(place);
            openAt(place.latitude, place.longitude);
            fitMapToMarker(place.latitude, place.longitude);
          },
        });
      });

      fitMapToMarkers(placeList);

      clearPolyline();

      routiePlaces.forEach((place) => {
        loadPolyline(place.latitude, place.longitude);
      });
    };

    renderMapElements();
  }, [mapState, placeList, routiePlaces]);

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
