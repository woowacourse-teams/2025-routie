import { useEffect, useRef, useState } from 'react';
import type { UseKakaoMapSDKReturn } from '../types/KaKaoMap.types';

export const useKakaoMapSDK = (): UseKakaoMapSDKReturn => {
  const [sdkReady, setSdkReady] = useState(false);
  const [sdkError, setSdkError] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);
  const attemptsRef = useRef(0);

  useEffect(() => {
    const loadSdk = () => {
      if (!window.kakao?.maps) {
        if (attemptsRef.current < 10) {
          attemptsRef.current += 1;
          setSdkError('카카오맵 불러오는 중 ...');

          if (timerRef.current) {
            window.clearTimeout(timerRef.current);
          }
          timerRef.current = window.setTimeout(loadSdk, 500);
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
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { sdkReady, sdkError };
};
