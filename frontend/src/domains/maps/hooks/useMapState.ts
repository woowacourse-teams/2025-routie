import { useMemo } from 'react';

import { useKakaoMapInit } from './useKakaoMapInit';
import { useKakaoMapSDK } from './useKakaoMapSDK';

import type { MapStateType } from '../types/api.types';
import type { UseMapStateProps, UseMapStateReturn } from '../types/map.types';

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
