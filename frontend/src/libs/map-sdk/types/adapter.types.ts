import type {
  KakaoMap,
  KakaoLatLng,
  KakaoMarker,
  KakaoCustomOverlay,
  KakaoEventListener,
  KakaoPolyline,
} from '../../../../kakao.d';

/**
 * 위경도 좌표 리터럴 타입
 */
interface LatLngLiteral {
  lat: number;
  lng: number;
}

/**
 * 지도 인스턴스 타입
 */
type MapInstanceType = KakaoMap;

/**
 * LatLng 인스턴스 타입
 */
type LatLngInstanceType = KakaoLatLng;

/**
 * 마커 인스턴스 타입
 */
type MarkerInstanceType = KakaoMarker;

/**
 * 이벤트 리스너 타입
 */
type EventListenerType = KakaoEventListener;

/**
 * 커스텀 오버레이 인스턴스 타입
 */
type CustomOverlayInstanceType = KakaoCustomOverlay;

/**
 * 폴리라인 인스턴스 타입
 */
type PolylineInstanceType = KakaoPolyline;

/**
 * 폴리라인 생성 옵션
 */
interface PolylineCreateOptions {
  /** 폴리라인 경로 좌표 배열 */
  path: LatLngLiteral[];
  /** 선 색상 @default '#F10000' */
  strokeColor?: string;
  /** 선 굵기 @default 3 */
  strokeWeight?: number;
  /** 선 투명도 (0~1) @default 0.6 */
  strokeOpacity?: number;
  /** z-index */
  zIndex?: number;
}

/**
 * 커스텀 오버레이 생성 옵션
 */
interface CustomOverlayCreateOptions {
  /** 오버레이 위치 */
  position: LatLngLiteral;
  /** 오버레이 내용 (HTML 요소) */
  content: HTMLElement;
  /** x축 기준점 (0~1) @default 0.5 */
  xAnchor?: number;
  /** y축 기준점 (0~1) @default 0.5 */
  yAnchor?: number;
  /** z-index */
  zIndex?: number;
}

/**
 * 마커 생성 옵션
 */
interface MarkerCreateOptions {
  /** 마커 위치 */
  position: LatLngLiteral;
  /** 마커 제목 (툴팁) */
  title?: string;
  /** 클릭 가능 여부 @default true */
  clickable?: boolean;
  /** 드래그 가능 여부 @default false */
  draggable?: boolean;
  /** 투명도 (0~1) */
  opacity?: number;
  /** z-index */
  zIndex?: number;
}

/**
 * 지도 생성 옵션
 */
interface MapCreateOptions {
  /** 지도 중심 좌표 */
  center: LatLngLiteral;
  /** 지도 확대 레벨 */
  level: number;
  /** 드래그 가능 여부 */
  draggable?: boolean;
  /** 스크롤 확대/축소 가능 여부 */
  scrollwheel?: boolean;
}

/**
 * 지도 SDK Adapter 인터페이스
 *
 * @description
 * 지도 SDK 벤더를 추상화하는 인터페이스입니다.
 * 카카오, 네이버 등 다른 지도 SDK로 교체 시 이 인터페이스를 구현합니다.
 */
interface MapAdapter {
  /**
   * SDK 로드 완료 여부 확인
   */
  isLoaded(): boolean;

  /**
   * SDK 스크립트 로드
   * @param appkey - API 앱 키
   * @param libraries - 추가 라이브러리 배열
   */
  load(appkey: string, libraries?: string[]): Promise<void>;

  /**
   * LatLng 객체 생성
   * @param lat - 위도
   * @param lng - 경도
   */
  createLatLng(lat: number, lng: number): LatLngInstanceType;

  /**
   * 지도 인스턴스 생성
   * @param container - 지도 컨테이너 DOM 요소
   * @param options - 지도 생성 옵션
   */
  createMap(container: HTMLElement, options: MapCreateOptions): MapInstanceType;

  /**
   * 지도 relayout 호출
   * @param map - 지도 인스턴스
   */
  relayout(map: MapInstanceType): void;

  /**
   * 마커 생성
   * @param map - 지도 인스턴스
   * @param options - 마커 생성 옵션
   */
  createMarker(map: MapInstanceType, options: MarkerCreateOptions): MarkerInstanceType;

  /**
   * 마커 제거
   * @param marker - 마커 인스턴스
   */
  removeMarker(marker: MarkerInstanceType): void;

  /**
   * 마커 위치 변경
   * @param marker - 마커 인스턴스
   * @param position - 새 위치
   */
  setMarkerPosition(marker: MarkerInstanceType, position: LatLngLiteral): void;

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
  ): void;

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
  ): void;

  /**
   * 커스텀 오버레이 생성
   * @param map - 지도 인스턴스
   * @param options - 오버레이 생성 옵션
   */
  createCustomOverlay(
    map: MapInstanceType,
    options: CustomOverlayCreateOptions,
  ): CustomOverlayInstanceType;

  /**
   * 커스텀 오버레이 제거
   * @param overlay - 오버레이 인스턴스
   */
  removeCustomOverlay(overlay: CustomOverlayInstanceType): void;

  /**
   * 커스텀 오버레이 위치 변경
   * @param overlay - 오버레이 인스턴스
   * @param position - 새 위치
   */
  setCustomOverlayPosition(
    overlay: CustomOverlayInstanceType,
    position: LatLngLiteral,
  ): void;

  /**
   * 폴리라인 생성
   * @param map - 지도 인스턴스
   * @param options - 폴리라인 생성 옵션
   */
  createPolyline(
    map: MapInstanceType,
    options: PolylineCreateOptions,
  ): PolylineInstanceType;

  /**
   * 폴리라인 제거
   * @param polyline - 폴리라인 인스턴스
   */
  removePolyline(polyline: PolylineInstanceType): void;

  /**
   * 폴리라인 경로 변경
   * @param polyline - 폴리라인 인스턴스
   * @param path - 새 경로
   */
  setPolylinePath(polyline: PolylineInstanceType, path: LatLngLiteral[]): void;

  /**
   * 폴리라인 스타일 옵션 변경
   * @param polyline - 폴리라인 인스턴스
   * @param options - 변경할 옵션
   */
  setPolylineOptions(
    polyline: PolylineInstanceType,
    options: Partial<Omit<PolylineCreateOptions, 'path'>>,
  ): void;
}

/**
 * SDK 로더 상태
 */
type LoaderStatus = 'idle' | 'loading' | 'loaded' | 'error';

/**
 * 로더 상태 스냅샷
 */
interface LoaderSnapshot {
  /** 현재 로딩 상태 */
  status: LoaderStatus;
  /** 에러 발생 시 에러 객체 */
  error: Error | null;
}

/**
 * 로더 초기화 옵션
 */
interface LoaderOptions {
  /** 지도 API 앱 키 */
  appkey: string;
  /** 추가 라이브러리 (예: 'services', 'clusterer', 'drawing') */
  libraries?: string[];
}

export type {
  LatLngLiteral,
  LatLngInstanceType,
  MapInstanceType,
  MapCreateOptions,
  MapAdapter,
  LoaderStatus,
  LoaderSnapshot,
  LoaderOptions,
  MarkerInstanceType,
  MarkerCreateOptions,
  EventListenerType,
  CustomOverlayInstanceType,
  CustomOverlayCreateOptions,
  PolylineInstanceType,
  PolylineCreateOptions,
};
