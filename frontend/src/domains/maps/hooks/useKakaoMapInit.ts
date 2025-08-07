import { useCallback, useEffect, useRef, useState } from 'react';

type KakaoMap = InstanceType<typeof window.kakao.maps.Map>;
type MapState = 'loading' | 'ready' | 'error';

export interface UseKakaoMapInitReturn {
  mapRef: React.RefObject<KakaoMap | null>;
  mapState: MapState;
  errorMessage: string | null;
  initializeMap: () => void;
}

export interface UseKakaoMapInitProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  sdkReady: boolean;
  lat: number;
  lng: number;
  level: number;
}

export const useKakaoMapInit = ({
  containerRef,
  sdkReady,
  lat,
  lng,
  level,
}: UseKakaoMapInitProps): UseKakaoMapInitReturn => {
  const mapRef = useRef<KakaoMap | null>(null);
  const isInitializedRef = useRef(false);

  const [mapState, setMapState] = useState<MapState>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const initializeMap = useCallback(() => {
    if (!containerRef.current) {
      setMapState('error');
      setErrorMessage('지도 컨테이너를 찾을 수 없습니다.');
      return;
    }

    try {
      const options = {
        center: new window.kakao.maps.LatLng(lat, lng),
        level: level,
      };

      mapRef.current = new window.kakao.maps.Map(containerRef.current, options);
      isInitializedRef.current = true;
      setMapState('ready');
      setErrorMessage(null);

      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.relayout();
        }
      }, 100);
    } catch (error) {
      // 센트리 에러 던지기 추가 예정
      setMapState('error');
      setErrorMessage('지도를 생성하는데 실패했습니다.');
      throw new Error('지도를 생성하는데 실패했습니다.');
    }
  }, [containerRef, lat, lng, level]);

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
