import { RefObject } from 'react';

type KakaoMapType = InstanceType<typeof window.kakao.maps.Map>;
type MapStateType = 'loading' | 'ready' | 'error';

interface UseKakaoMapSDKReturnType {
  sdkReady: boolean;
  sdkError: string | null;
}
interface UseKakaoMapInitProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  sdkReady: boolean;
}

interface UseKakaoMapInitReturnType {
  mapRef: React.RefObject<KakaoMapType | null>;
  mapState: MapStateType;
  errorMessage: string | null;
  initializeMap: () => void;
}

type MarkerType = InstanceType<typeof window.kakao.maps.Marker>;

interface DrawMarkerProps {
  place: {
    latitude: number;
    longitude: number;
    name: string;
  };
  routieSequence?: number;
  onClick?: () => void;
}

type MapRefType = RefObject<KakaoMapType>;

export type {
  UseKakaoMapSDKReturnType,
  UseKakaoMapInitProps,
  UseKakaoMapInitReturnType,
  KakaoMapType,
  MapStateType,
  MarkerType,
  DrawMarkerProps,
  MapRefType,
};
