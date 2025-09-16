import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { useQueryClient } from '@tanstack/react-query';

import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import PlaceOverlayCard from '@/domains/maps/components/PlaceOverlayCard/PlaceOverlayCard';
import { usePlaceList } from '@/domains/places/hooks/usePlaceList';
import { PlaceDataType } from '@/domains/places/types/place.types';

import { useCustomOverlay } from '../../hooks/useCustomOverlay';
import { useMapMarker } from '../../hooks/useMapMarker';
import { useMapState } from '../../hooks/useMapState';
import { usePolyline } from '../../hooks/usePolyline';
import { useRoutePlacesWithDetails } from '../../hooks/useRoutePlacesWithDetails';

import {
  KakaoMapContainerStyle,
  KakaoMapErrorStyle,
  KakaoMapLoadingStyle,
  KakaoMapWrapperStyle,
} from './KakaoMap.styles';

const KakaoMap = () => {
  const queryClient = useQueryClient();
  const { placeList } = usePlaceList();
  const { routiePlacesWithDetails } = useRoutePlacesWithDetails();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const addedPlaceId = queryClient.getQueryData(['addedPlaceId']);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const { mapRef, finalMapState, finalError } = useMapState({
    containerRef: mapContainerRef,
  });
  const { fitMapToMarkers, drawMarkers, clearMarkers, fitMapToMarker } =
    useMapMarker(mapRef);
  const { loadPolyline, clearPolyline } = usePolyline(mapRef);
  const { containerEl, openAt, close } = useCustomOverlay(mapRef);
  const [selectedPlace, setSelectedPlace] = useState<PlaceDataType | null>(
    null,
  );

  const handleMapClick = () => {
    setSelectedPlace(null);
    close();
  };

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

    const renderMapElements = () => {
      clearMarkers();
      placeList?.forEach((place) => {
        const routiePlace = routiePlacesWithDetails.find(rp => rp.id === place.id);
        const routieSequence = routiePlace?.sequence;

        drawMarkers({
          place,
          routieSequence,
          onClick: () => {
            setSelectedPlace(place);
            openAt(place.latitude, place.longitude);
          },
        });
      });

      if (isInitialLoad && placeList && placeList.length > 0) {
        fitMapToMarkers(placeList);
        setIsInitialLoad(false);
      } else if (addedPlaceId && placeList) {
        const newPlace = placeList.find((place) => place.id === addedPlaceId);

        if (newPlace) {
          fitMapToMarker(newPlace.latitude, newPlace.longitude);
        }
      }

      clearPolyline();

      routiePlacesWithDetails.forEach((place) => {
        loadPolyline(place.latitude, place.longitude);
      });
    };

    renderMapElements();
  }, [finalMapState, placeList, routiePlacesWithDetails, addedPlaceId]);

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
        selectedPlace &&
        createPortal(
          <PlaceOverlayCard place={selectedPlace} onClose={handleMapClick} />,
          containerEl,
        )}
    </div>
  );
};

export default KakaoMap;
