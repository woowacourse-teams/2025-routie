import { useEffect, useRef, useState } from 'react';
import type { UseKakaoMapSDKReturn } from '../types/KaKaoMap.types';

export const useKakaoMapSDK = (): UseKakaoMapSDKReturn => {
  const [sdkReady, setSdkReady] = useState(false);
  const [sdkError, setSdkError] = useState<string | null>(null);

  const timersRef = useRef<Map<string, number>>(new Map());
  const attemptsRef = useRef(0);

  useEffect(() => {
    const loadSdk = () => {
      if (!window.kakao?.maps) {
        if (attemptsRef.current < 10) {
          attemptsRef.current += 1;
          setSdkError('카카오맵 불러오는 중 ...');

          const timeoutId = window.setTimeout(loadSdk, 500);
          timersRef.current.set(`retry_${attemptsRef.current}`, timeoutId);
        } else {
          setSdkError('카카오맵 불러오기 실패');
        }
        return;
      }

      window.kakao.maps.load(() => {
        setSdkReady(true);
        setSdkError(null);
      });
    };

    loadSdk();

    return () => {
      timersRef.current.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
      timersRef.current.clear();
    };
  }, []);

  return { sdkReady, sdkError };
};
