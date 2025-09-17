import { useEffect, useRef, useState } from 'react';

import type { UseKakaoMapSDKReturnType } from '../types/api.types';

const MAX_ATTEMPTS = 10;
const RETRY_DELAY = 500;

const useKakaoMapSDK = (): UseKakaoMapSDKReturnType => {
  const [sdkReady, setSdkReady] = useState(false);
  const [sdkError, setSdkError] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);
  const attemptsRef = useRef(0);

  useEffect(() => {
    const loadSdk = () => {
      if (window.kakao?.maps) {
        window.kakao.maps.load(() => {
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

export { useKakaoMapSDK };
