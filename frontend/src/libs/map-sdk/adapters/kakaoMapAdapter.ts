import type {
  LatLngInstanceType,
  MapAdapter,
  MapInstanceType,
} from '@/libs/map-sdk/types/adapter.types';

const kakaoMapAdapter: MapAdapter = {
  isLoaded: () => Boolean(window.kakao?.maps),
  load: (onLoad, onError) => {
    if (!window.kakao?.maps) {
      onError?.();
      return;
    }
    window.kakao.maps.load(onLoad);
  },
  createLatLng: (lat, lng) =>
    new window.kakao.maps.LatLng(lat, lng) as LatLngInstanceType,
  createMap: (container, options) =>
    new window.kakao.maps.Map(container, options) as MapInstanceType,
  relayout: (map) => {
    const mapInstance = map as { relayout?: () => void };
    mapInstance.relayout?.();
  },
};

export { kakaoMapAdapter };
