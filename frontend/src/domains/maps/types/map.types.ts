import type { PlaceDataType } from '@/domains/places/types/place.types';

import type { MapRefType } from './api.types';

interface UseMapNavigationProps {
  mapRef: MapRefType;
  isInitialLoad: boolean;
  setIsInitialLoad: (value: boolean) => void;
}

interface UseMapRendererProps {
  mapRef: MapRefType;
  isInitialLoad: boolean;
  setIsInitialLoad: (value: boolean) => void;
  handleMarkerClick: (place: PlaceDataType) => void;
}

interface UsePolylineRendererProps {
  mapRef: MapRefType;
}

interface UseMapStateProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

interface UseMapStateReturn {
  mapRef: React.RefObject<InstanceType<typeof window.kakao.maps.Map> | null>;
  finalMapState: 'loading' | 'ready' | 'error';
  finalError: string | null;
  initializeMap: () => void;
}

interface UseClickedPlaceProps {
  openAt: (lat: number, lng: number) => void;
  close: () => void;
}

interface UseClickedPlaceReturn {
  clickedPlace: PlaceDataType | null;
  handleMapClick: () => void;
  handleMarkerClick: (place: PlaceDataType) => void;
}

interface UseMarkerRendererProps {
  mapRef: MapRefType;
  handleMarkerClick: (place: PlaceDataType) => void;
}

interface PlaceOverlayCardProps {
  place: PlaceDataType;
  onClose: () => void;
}

interface HashtagFilterContextType {
  selectedHashtags: string[];
  toggleHashtag: (hashtag: string) => void;
}

export type {
  UseMapNavigationProps,
  UseMapRendererProps,
  UsePolylineRendererProps,
  UseMapStateProps,
  UseMapStateReturn,
  UseClickedPlaceProps,
  UseClickedPlaceReturn,
  UseMarkerRendererProps,
  PlaceOverlayCardProps,
  HashtagFilterContextType,
};
