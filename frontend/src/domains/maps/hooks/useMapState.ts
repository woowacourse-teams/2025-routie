import { useMemo } from 'react';

import type { MapStateType } from '@/domains/maps/types/api.types';
import type {
  UseMapStateProps,
  UseMapStateReturn,
} from '@/domains/maps/types/map.types';
import { useMapSdk } from '@/libs/map-sdk/hooks/useMapSdk';

import { useKakaoMapInit } from './useKakaoMapInit';

const useMapState = ({ containerRef }: UseMapStateProps): UseMapStateReturn => {
  const { sdkReady, sdkError } = useMapSdk();
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
