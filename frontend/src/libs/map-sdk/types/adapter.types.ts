import type { KakaoMap, KakaoLatLng } from '../../../../kakao.d';

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
};
