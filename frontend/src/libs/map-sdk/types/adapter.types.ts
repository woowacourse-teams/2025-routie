interface LatLngLiteral {
  lat: number;
  lng: number;
}

type MapInstanceType = unknown;

type LatLngInstanceType = unknown;

interface MapCreateOptions {
  center: LatLngLiteral;
  level: number;
}

interface MapAdapter {
  isLoaded: () => boolean;
  load: (onLoad: () => void, onError?: () => void) => void;
  createLatLng: (lat: number, lng: number) => LatLngInstanceType;
  createMap: (
    container: HTMLDivElement,
    options: { center: LatLngInstanceType; level: number },
  ) => MapInstanceType;
  relayout: (map: MapInstanceType) => void;
}

export type {
  LatLngLiteral,
  MapInstanceType,
  LatLngInstanceType,
  MapCreateOptions,
  MapAdapter,
};
