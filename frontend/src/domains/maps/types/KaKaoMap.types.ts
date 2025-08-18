export type KakaoMapType = InstanceType<typeof window.kakao.maps.Map>;
export type MapStateType = 'loading' | 'ready' | 'error';

export interface UseKakaoMapSDKReturn {
  sdkReady: boolean;
  sdkError: string | null;
}
export interface UseKakaoMapInitProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  sdkReady: boolean;
}

export interface UseKakaoMapInitReturn {
  mapRef: React.RefObject<KakaoMapType | null>;
  mapState: MapStateType;
  errorMessage: string | null;
  initializeMap: () => void;
}
