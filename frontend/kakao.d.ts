declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void;
        LatLng: new (lat: number, lng: number) => any;
        Map: new (container: HTMLElement, options: any) => any;
        Marker: new (options: any) => any;
        LatLngBounds: new () => any;
        Polyline: new (options: any) => any;
        InfoWindow: new (options: any) => any;
        event: {
          addListener: (target: any, type: string, handler: () => void) => void;
          removeListener: (
            target: any,
            type: string,
            handler: () => void,
          ) => void;
        };
        RoutePriority: {
          WALKING: any;
        };
        services: {
          DirectionService: new () => any;
          Status: {
            OK: any;
          };
        };
        CustomOverlay: new (options: any) => any;
      };
    };
  }
}

export {};
