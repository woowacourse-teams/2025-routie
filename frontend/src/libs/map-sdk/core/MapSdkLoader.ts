import { kakaoMapAdapter } from '../adapters/kakaoMapAdapter';

import type {
  LoaderStatus,
  LoaderSnapshot,
  LoaderOptions,
  MapAdapter,
} from '../types/adapter.types';

/**
 * 구독자 콜백 함수 타입
 */
type Subscriber = () => void;

/**
 * 지도 SDK 로더 싱글톤 클래스
 *
 * @description
 * SDK 스크립트를 동적으로 로드하고 로딩 상태를 관리합니다.
 * useSyncExternalStore와 호환되는 subscribe/getSnapshot API를 제공합니다.
 * Adapter 패턴을 통해 다른 지도 SDK로 교체 가능합니다.
 *
 * @example
 * ```typescript
 * // 앱 초기화 시 (src/index.tsx)
 * mapSdkLoader.init({ appkey: 'YOUR_APP_KEY' });
 *
 * // React 컴포넌트에서 useMapSdkLoader 훅 사용
 * const { isLoaded, error } = useMapSdkLoader();
 * ```
 */
class MapSdkLoader {
  /** 싱글톤 인스턴스 */
  private static instance: MapSdkLoader | null = null;

  /** 현재 로딩 상태 */
  private status: LoaderStatus = 'idle';

  /** 에러 객체 */
  private error: Error | null = null;

  /** 구독자 목록 */
  private subscribers: Set<Subscriber> = new Set();

  /** 로딩 Promise (중복 로딩 방지) */
  private loadPromise: Promise<void> | null = null;

  /** API 앱 키 */
  private appkey: string = '';

  /** 추가 라이브러리 */
  private libraries: string[] = [];

  /** 캐시된 스냅샷 (useSyncExternalStore 무한 루프 방지) */
  private cachedSnapshot: LoaderSnapshot = { status: 'idle', error: null };

  /** SSR용 고정 스냅샷 */
  private static readonly SERVER_SNAPSHOT: LoaderSnapshot = {
    status: 'idle',
    error: null,
  };

  /** SDK Adapter */
  private adapter: MapAdapter;

  /**
   * 싱글톤 인스턴스 반환
   * @param adapter - 사용할 MapAdapter (기본값: kakaoMapAdapter)
   * @returns MapSdkLoader 인스턴스
   */
  static getInstance(adapter: MapAdapter = kakaoMapAdapter): MapSdkLoader {
    if (!MapSdkLoader.instance) {
      MapSdkLoader.instance = new MapSdkLoader(adapter);
    }
    return MapSdkLoader.instance;
  }

  /**
   * private 생성자 (싱글톤 패턴)
   * @param adapter - 사용할 MapAdapter
   */
  private constructor(adapter: MapAdapter) {
    this.adapter = adapter;
  }

  /**
   * 로더 초기화
   *
   * @description
   * 앱 시작 시 1회만 호출합니다.
   * 이후 load()가 자동으로 호출되어 SDK를 로드합니다.
   * 에러 상태에서 다시 호출하면 재시도합니다.
   *
   * @param options - 초기화 옵션
   * @param options.appkey - 지도 API 앱 키
   * @param options.libraries - 추가 라이브러리 배열 (선택)
   */
  init(options: LoaderOptions): void {
    // 로딩 중이거나 이미 로드된 경우 무시
    if (this.status === 'loading' || this.status === 'loaded') {
      return;
    }

    // 에러 상태인 경우 상태 초기화 후 재시도
    if (this.status === 'error') {
      this.resetError();
    }

    this.appkey = options.appkey;
    this.libraries = options.libraries ?? [];
    this.load();
  }

  /**
   * SDK 스크립트 동적 로드
   *
   * @description
   * Adapter를 통해 SDK 스크립트를 로드합니다.
   * 중복 호출 시 기존 Promise를 반환합니다.
   *
   * @returns 로딩 완료 Promise
   */
  load(): Promise<void> {
    // 이미 로딩 중이거나 완료된 경우 기존 Promise 반환
    if (this.loadPromise) {
      return this.loadPromise;
    }

    // 이미 SDK가 로드되어 있는 경우
    if (this.adapter.isLoaded()) {
      this.setStatus('loaded');
      this.loadPromise = Promise.resolve();
      return this.loadPromise;
    }

    this.setStatus('loading');

    this.loadPromise = this.adapter
      .load(this.appkey, this.libraries)
      .then(() => {
        this.setStatus('loaded');
      })
      .catch((error: Error) => {
        this.setError(error);
        // 재시도를 위해 loadPromise 초기화
        this.loadPromise = null;
        throw error;
      });

    return this.loadPromise;
  }

  /**
   * 상태 변경 및 구독자 알림
   * @param status - 새로운 상태
   */
  private setStatus(status: LoaderStatus): void {
    this.status = status;
    this.updateCachedSnapshot();
    this.notifySubscribers();
  }

  /**
   * 에러 설정 및 구독자 알림
   * @param error - 에러 객체
   */
  private setError(error: Error): void {
    this.status = 'error';
    this.error = error;
    this.updateCachedSnapshot();
    this.notifySubscribers();
  }

  /**
   * 에러 상태 초기화
   * @description 재시도를 위해 에러 상태를 초기화합니다.
   */
  private resetError(): void {
    this.status = 'idle';
    this.error = null;
    this.loadPromise = null;
    this.updateCachedSnapshot();
    this.notifySubscribers();
  }

  /**
   * SDK 로드 재시도
   *
   * @description
   * 에러 상태에서 SDK 로드를 다시 시도합니다.
   * 에러 상태가 아닌 경우 기존 load()와 동일하게 동작합니다.
   * idle 중간 상태 없이 바로 loading 상태로 전이하여 불필요한 리렌더링을 방지합니다.
   *
   * @returns 로딩 완료 Promise
   *
   * @example
   * ```typescript
   * const { isError, retry } = useMapSdkLoader();
   *
   * if (isError) {
   *   return <button onClick={retry}>다시 시도</button>;
   * }
   * ```
   */
  retry(): Promise<void> {
    // 이미 로딩 중이면 기존 Promise 반환 (동시 retry 호출 방지)
    if (this.status === 'loading' && this.loadPromise) {
      return this.loadPromise;
    }

    // 이미 로드 완료면 즉시 resolve
    if (this.status === 'loaded') {
      return Promise.resolve();
    }

    // 에러 상태 초기화 (idle 중간 상태 없이 바로 loading으로 전이)
    this.error = null;
    this.loadPromise = null;

    return this.load();
  }

  /**
   * 캐시된 스냅샷 업데이트
   * 상태가 변경될 때만 새 객체를 생성하여 useSyncExternalStore 무한 루프 방지
   */
  private updateCachedSnapshot(): void {
    this.cachedSnapshot = {
      status: this.status,
      error: this.error,
    };
  }

  /**
   * 모든 구독자에게 상태 변경 알림
   */
  private notifySubscribers(): void {
    this.subscribers.forEach((callback) => callback());
  }

  /**
   * 상태 변경 구독 (useSyncExternalStore 호환)
   *
   * @description
   * React의 useSyncExternalStore와 함께 사용할 수 있는 구독 함수입니다.
   *
   * @param callback - 상태 변경 시 호출될 콜백
   * @returns 구독 해제 함수
   *
   * @example
   * ```typescript
   * const state = useSyncExternalStore(
   *   mapSdkLoader.subscribe,
   *   mapSdkLoader.getSnapshot,
   *   mapSdkLoader.getServerSnapshot
   * );
   * ```
   */
  subscribe = (callback: Subscriber): (() => void) => {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  };

  /**
   * 현재 상태 스냅샷 반환 (useSyncExternalStore 호환)
   *
   * @description
   * 캐시된 스냅샷을 반환하여 동일한 상태에서는 같은 객체 참조를 유지합니다.
   * 이를 통해 useSyncExternalStore의 무한 루프를 방지합니다.
   *
   * @returns 현재 로더 상태 스냅샷
   */
  getSnapshot = (): LoaderSnapshot => {
    return this.cachedSnapshot;
  };

  /**
   * 서버 사이드 렌더링용 스냅샷 반환 (useSyncExternalStore 호환)
   *
   * @description
   * SSR 환경에서는 항상 'idle' 상태를 반환합니다.
   * 항상 동일한 객체 참조를 반환합니다.
   *
   * @returns 서버 측 스냅샷
   */
  getServerSnapshot = (): LoaderSnapshot => {
    return MapSdkLoader.SERVER_SNAPSHOT;
  };

  /**
   * Adapter 반환
   * @returns 현재 사용 중인 MapAdapter
   */
  getAdapter(): MapAdapter {
    return this.adapter;
  }

  /**
   * 싱글톤 인스턴스 초기화 (테스트 전용)
   * @internal
   */
  static resetForTesting(): void {
    if (MapSdkLoader.instance) {
      MapSdkLoader.instance.subscribers.clear();
      MapSdkLoader.instance = null;
    }
  }
}

/**
 * 지도 SDK 로더 싱글톤 인스턴스
 *
 * @example
 * ```typescript
 * import { mapSdkLoader } from '@/libs/map-sdk';
 *
 * // 앱 초기화 시
 * mapSdkLoader.init({ appkey: process.env.REACT_APP_KAKAO_MAP_APPKEY || '' });
 * ```
 */
const mapSdkLoader = MapSdkLoader.getInstance();

export { mapSdkLoader, MapSdkLoader };
