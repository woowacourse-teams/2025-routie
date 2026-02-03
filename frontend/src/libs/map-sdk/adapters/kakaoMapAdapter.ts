import type {
  CustomOverlayCreateOptions,
  CustomOverlayInstanceType,
  EventListenerType,
  LatLngInstanceType,
  LatLngLiteral,
  MapAdapter,
  MapCreateOptions,
  MapInstanceType,
  MarkerCreateOptions,
  MarkerInstanceType,
  PolylineCreateOptions,
  PolylineInstanceType,
} from '../types/adapter.types';

/**
 * 카카오 지도 SDK Adapter
 *
 * @description
 * 카카오 지도 SDK를 MapAdapter 인터페이스로 추상화합니다.
 * 다른 지도 SDK로 교체 시 이 어댑터만 교체하면 됩니다.
 */
const kakaoMapAdapter: MapAdapter = {
  /**
   * SDK 로드 완료 여부 확인
   */
  isLoaded(): boolean {
    return !!(
      window.kakao?.maps?.Map && typeof window.kakao.maps.Map === 'function'
    );
  },

  /**
   * SDK 스크립트 로드
   * @param appkey - 카카오 지도 API 앱 키
   * @param libraries - 추가 라이브러리 배열
   */
  load(appkey: string, libraries: string[] = []): Promise<void> {
    return new Promise((resolve, reject) => {
      // 이미 로드된 경우
      if (this.isLoaded()) {
        resolve();
        return;
      }

      const script = document.createElement('script');

      const libraryParam =
        libraries.length > 0 ? `&libraries=${libraries.join(',')}` : '';
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appkey}&autoload=false${libraryParam}`;
      script.async = true;

      script.onload = () => {
        if (window.kakao?.maps?.load) {
          window.kakao.maps.load(() => {
            resolve();
          });
        } else {
          reject(new Error('카카오 지도 SDK 초기화에 실패했습니다.'));
        }
      };

      script.onerror = () => {
        reject(new Error('카카오 지도 SDK 스크립트 로드에 실패했습니다.'));
      };

      document.head.appendChild(script);
    });
  },

  /**
   * LatLng 객체 생성
   * @param lat - 위도
   * @param lng - 경도
   */
  createLatLng(lat: number, lng: number): LatLngInstanceType {
    return new window.kakao.maps.LatLng(lat, lng);
  },

  /**
   * 지도 인스턴스 생성
   * @param container - 지도 컨테이너 DOM 요소
   * @param options - 지도 생성 옵션
   */
  createMap(container: HTMLElement, options: MapCreateOptions): MapInstanceType {
    const kakaoOptions = {
      center: this.createLatLng(options.center.lat, options.center.lng),
      level: options.level,
      draggable: options.draggable ?? true,
      scrollwheel: options.scrollwheel ?? true,
    };

    return new window.kakao.maps.Map(container, kakaoOptions);
  },

  /**
   * 지도 relayout 호출
   * @param map - 지도 인스턴스
   */
  relayout(map: MapInstanceType): void {
    map.relayout();
  },

  /**
   * 마커 생성
   * @param map - 지도 인스턴스
   * @param options - 마커 생성 옵션
   */
  createMarker(map: MapInstanceType, options: MarkerCreateOptions): MarkerInstanceType {
    const position = this.createLatLng(options.position.lat, options.position.lng);

    const marker = new window.kakao.maps.Marker({
      position,
      title: options.title,
      clickable: options.clickable ?? true,
      draggable: options.draggable ?? false,
      opacity: options.opacity,
      zIndex: options.zIndex,
    });

    marker.setMap(map);
    return marker;
  },

  /**
   * 마커 제거
   * @param marker - 마커 인스턴스
   */
  removeMarker(marker: MarkerInstanceType): void {
    marker.setMap(null);
  },

  /**
   * 마커 위치 변경
   * @param marker - 마커 인스턴스
   * @param position - 새 위치
   */
  setMarkerPosition(marker: MarkerInstanceType, position: LatLngLiteral): void {
    const newPosition = this.createLatLng(position.lat, position.lng);
    marker.setPosition(newPosition);
  },

  /**
   * 마커 이벤트 리스너 등록
   * @param marker - 마커 인스턴스
   * @param event - 이벤트 타입
   * @param handler - 이벤트 핸들러
   */
  addMarkerListener(
    marker: MarkerInstanceType,
    event: string,
    handler: EventListenerType,
  ): void {
    window.kakao.maps.event.addListener(marker, event, handler);
  },

  /**
   * 마커 이벤트 리스너 제거
   * @param marker - 마커 인스턴스
   * @param event - 이벤트 타입
   * @param handler - 이벤트 핸들러
   */
  removeMarkerListener(
    marker: MarkerInstanceType,
    event: string,
    handler: EventListenerType,
  ): void {
    window.kakao.maps.event.removeListener(marker, event, handler);
  },

  /**
   * 커스텀 오버레이 생성
   * @param map - 지도 인스턴스
   * @param options - 오버레이 생성 옵션
   */
  createCustomOverlay(
    map: MapInstanceType,
    options: CustomOverlayCreateOptions,
  ): CustomOverlayInstanceType {
    const position = this.createLatLng(options.position.lat, options.position.lng);

    const overlay = new window.kakao.maps.CustomOverlay({
      position,
      content: options.content,
      xAnchor: options.xAnchor ?? 0.5,
      yAnchor: options.yAnchor ?? 0.5,
      zIndex: options.zIndex,
    });

    overlay.setMap(map);
    return overlay;
  },

  /**
   * 커스텀 오버레이 제거
   * @param overlay - 오버레이 인스턴스
   */
  removeCustomOverlay(overlay: CustomOverlayInstanceType): void {
    overlay.setMap(null);
  },

  /**
   * 커스텀 오버레이 위치 변경
   * @param overlay - 오버레이 인스턴스
   * @param position - 새 위치
   */
  setCustomOverlayPosition(
    overlay: CustomOverlayInstanceType,
    position: LatLngLiteral,
  ): void {
    const newPosition = this.createLatLng(position.lat, position.lng);
    overlay.setPosition(newPosition);
  },

  /**
   * 폴리라인 생성
   * @param map - 지도 인스턴스
   * @param options - 폴리라인 생성 옵션
   */
  createPolyline(
    map: MapInstanceType,
    options: PolylineCreateOptions,
  ): PolylineInstanceType {
    const path = options.path.map((p) => this.createLatLng(p.lat, p.lng));

    const polyline = new window.kakao.maps.Polyline({
      map,
      path,
      strokeColor: options.strokeColor ?? '#F10000',
      strokeWeight: options.strokeWeight ?? 3,
      strokeOpacity: options.strokeOpacity ?? 0.6,
      strokeStyle: options.strokeStyle ?? 'solid',
      zIndex: options.zIndex,
    });

    return polyline;
  },

  /**
   * 폴리라인 제거
   * @param polyline - 폴리라인 인스턴스
   */
  removePolyline(polyline: PolylineInstanceType): void {
    polyline.setMap(null);
  },

  /**
   * 폴리라인 경로 변경
   * @param polyline - 폴리라인 인스턴스
   * @param path - 새 경로
   */
  setPolylinePath(polyline: PolylineInstanceType, path: LatLngLiteral[]): void {
    const kakaoPath = path.map((p) => this.createLatLng(p.lat, p.lng));
    polyline.setPath(kakaoPath);
  },

  /**
   * 폴리라인 스타일 옵션 변경
   * @param polyline - 폴리라인 인스턴스
   * @param options - 변경할 옵션
   */
  setPolylineOptions(
    polyline: PolylineInstanceType,
    options: Partial<Omit<PolylineCreateOptions, 'path'>>,
  ): void {
    if (options.strokeColor !== undefined) {
      polyline.setStrokeColor(options.strokeColor);
    }
    if (options.strokeWeight !== undefined) {
      polyline.setStrokeWeight(options.strokeWeight);
    }
    if (options.strokeOpacity !== undefined) {
      polyline.setStrokeOpacity(options.strokeOpacity);
    }
    if (options.strokeStyle !== undefined) {
      polyline.setStrokeStyle(options.strokeStyle);
    }
    if (options.zIndex !== undefined) {
      polyline.setZIndex(options.zIndex);
    }
  },
};

export { kakaoMapAdapter };
