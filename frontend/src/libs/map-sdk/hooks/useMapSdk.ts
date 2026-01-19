import { useEffect, useRef, useState } from 'react';

import type { UseKakaoMapSDKReturnType } from '@/domains/maps/types/api.types';
import { kakaoMapAdapter } from '@/libs/map-sdk/adapters/kakaoMapAdapter';

const MAX_ATTEMPTS = 10;
const RETRY_DELAY = 500;

const useMapSdk = (): UseKakaoMapSDKReturnType => {
  const [sdkReady, setSdkReady] = useState(false);
  const [sdkError, setSdkError] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);
  const attemptsRef = useRef(0);

  useEffect(() => {
    const loadSdk = () => {
      if (kakaoMapAdapter.isLoaded()) {
        kakaoMapAdapter.load(() => {
          setSdkReady(true);
          setSdkError(null);
        });
        return;
      }
      if (attemptsRef.current < MAX_ATTEMPTS) {
        attemptsRef.current += 1;
        setSdkError('카카오맵 불러오는 중 ...');

        window.clearTimeout(timerRef.current ?? undefined);
        timerRef.current = window.setTimeout(loadSdk, RETRY_DELAY);
      } else {
        setSdkError('카카오맵 불러오기 실패');
      }
    };

    loadSdk();

    return () => {
      window.clearTimeout(timerRef.current ?? undefined);
    };
  }, []);

  return { sdkReady, sdkError };
};

export { useMapSdk };
