import { RefObject } from 'react';

import type { PlaceDataType } from '@/domains/places/types/place.types';

type KakaoMapType = InstanceType<typeof window.kakao.maps.Map>;
type MapStateType = 'loading' | 'ready' | 'error';
type MarkerType = InstanceType<typeof window.kakao.maps.Marker>;
type CustomOverlayType = InstanceType<typeof window.kakao.maps.CustomOverlay>;

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

interface DrawMarkerProps {
  place: {
    latitude: number;
    longitude: number;
    name: string;
  };
  routieSequence?: number;
  onClick?: () => void;
}

interface RoutiePlaceWithDetails extends PlaceDataType {
  sequence: number;
  routieId: number;
}

type MapRefType = RefObject<KakaoMapType>;

export type {
  KakaoMapType,
  MapStateType,
  MarkerType,
  CustomOverlayType,
  UseKakaoMapSDKReturnType,
  UseKakaoMapInitProps,
  UseKakaoMapInitReturnType,
  DrawMarkerProps,
  RoutiePlaceWithDetails,
  MapRefType,
};