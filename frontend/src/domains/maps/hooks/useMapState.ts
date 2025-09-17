import { useMemo } from 'react';

import type { MapStateType } from '@/domains/maps/types/api.types';
import type {
  UseMapStateProps,
  UseMapStateReturn,
} from '@/domains/maps/types/map.types';

import { useKakaoMapInit } from './useKakaoMapInit';
import { useKakaoMapSDK } from './useKakaoMapSDK';

const useMapState = ({ containerRef }: UseMapStateProps): UseMapStateReturn => {
  const { sdkReady, sdkError } = useKakaoMapSDK();
  const { mapRef, mapState, errorMessage, initializeMap } = useKakaoMapInit({
    containerRef,
    sdkReady,
  });

  const finalError = useMemo(
    () => sdkError || errorMessage,
    [sdkError, errorMessage],
  );
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
