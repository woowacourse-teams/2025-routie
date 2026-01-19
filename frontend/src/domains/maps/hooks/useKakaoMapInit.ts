import { useCallback, useEffect, useRef, useState } from 'react';

import type {
  KakaoMapType,
  MapStateType,
  UseKakaoMapInitProps,
  UseKakaoMapInitReturnType,
} from '@/domains/maps/types/api.types';
import { createMap, relayout } from '@/libs/map-sdk/controllers/mapController';

const useKakaoMapInit = ({
  containerRef,
  sdkReady,
}: UseKakaoMapInitProps): UseKakaoMapInitReturnType => {
  const mapRef = useRef<KakaoMapType | null>(null);
  const isInitializedRef = useRef(false);
  const INITIAL_LAT_LNG = { lat: 37.554, lng: 126.97 };
  const INITIAL_LEVEL = 7;

  const [mapState, setMapState] = useState<MapStateType>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const initializeMap = useCallback(() => {
    if (!containerRef.current) {
      setMapState('error');
      setErrorMessage('지도 컨테이너를 찾을 수 없습니다.');
      return;
    }

    try {
      const mapInstance = createMap(
        containerRef.current,
        INITIAL_LAT_LNG,
        INITIAL_LEVEL,
      ) as KakaoMapType;

      mapRef.current = mapInstance;
      isInitializedRef.current = true;
      setMapState('ready');
      setErrorMessage(null);

      setTimeout(() => {
        if (mapRef.current) {
          relayout(mapRef.current);
        }
      }, 100);
    } catch (error) {
      // TODO: 센트리 에러 던지기 추가 예정
      setMapState('error');
      setErrorMessage('지도를 생성하는데 실패했습니다.');
    }
  }, [containerRef]);

  useEffect(() => {
    if (sdkReady && !isInitializedRef.current) {
      initializeMap();
    }
  }, [sdkReady, initializeMap]);

  return {
    mapRef,
    mapState,
    errorMessage,
    initializeMap,
  };
};

export { useKakaoMapInit };
