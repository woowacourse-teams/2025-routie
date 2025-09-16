import { useMemo } from 'react';

import { useKakaoMapInit } from './useKakaoMapInit';
import { useKakaoMapSDK } from './useKakaoMapSDK';

import type { MapStateType } from '../types/KaKaoMap.types';

interface UseMapStateProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

interface UseMapStateReturn {
  mapRef: React.RefObject<InstanceType<typeof window.kakao.maps.Map> | null>;
  finalMapState: MapStateType;
  finalError: string | null;
  initializeMap: () => void;
}

const useMapState = ({ containerRef }: UseMapStateProps): UseMapStateReturn => {
  const { sdkReady, sdkError } = useKakaoMapSDK();
  const { mapRef, mapState, errorMessage, initializeMap } = useKakaoMapInit({
    containerRef,
    sdkReady,
  });

  const finalError = useMemo(() => sdkError || errorMessage, [sdkError, errorMessage]);
  const finalMapState = useMemo<MapStateType>(
    () => (sdkError ? 'error' : mapState),
    [sdkError, mapState],
  );

  return {
    mapRef,
    finalMapState,
    finalError,
    initializeMap,
  };
};

export { useMapState };
export type { UseMapStateReturn, UseMapStateProps };