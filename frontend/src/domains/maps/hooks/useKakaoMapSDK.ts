import { useEffect, useState } from 'react';

export interface UseKakaoMapSDKReturn {
  sdkReady: boolean;
  sdkError: string | null;
}

export const useKakaoMapSDK = (): UseKakaoMapSDKReturn => {
  const [sdkReady, setSdkReady] = useState(false);
  const [sdkError, setSdkError] = useState<string | null>(null);

  useEffect(() => {
    if (!window.kakao?.maps) {
      setSdkError('카카오맵 SDK를 찾을 수 없습니다.');
      return;
    }

    window.kakao.maps.load(() => {
      setSdkReady(true);
    });
  }, []);

  return {
    sdkReady,
    sdkError,
  };
};
