import { useSyncExternalStore } from 'react';

import { mapSdkLoader } from '../core/MapSdkLoader';

import type { LoaderStatus, LoaderSnapshot } from '../types/adapter.types';

/**
 * useMapSdkLoader 훅 반환 타입
 */
interface UseMapSdkLoaderReturn {
  /** 현재 로딩 상태 ('idle' | 'loading' | 'loaded' | 'error') */
  status: LoaderStatus;
  /** 에러 발생 시 에러 객체 */
  error: Error | null;
  /** SDK 로딩 완료 여부 */
  isLoaded: boolean;
  /** SDK 로딩 중 여부 */
  isLoading: boolean;
  /** 에러 발생 여부 */
  isError: boolean;
  /** SDK 로드 시작 함수 */
  load: () => Promise<void>;
  /** SDK 로드 재시도 함수 (에러 상태에서 사용) */
  retry: () => Promise<void>;
}

/**
 * 지도 SDK 로딩 상태를 구독하는 훅
 *
 * @description
 * useSyncExternalStore를 사용하여 SDK 로딩 상태를 React 상태로 동기화합니다.
 * SDK가 로드되기 전에는 isLoaded가 false이며, 로드 완료 후 true로 변경됩니다.
 *
 * @returns 로딩 상태 객체
 * @returns status - 현재 로딩 상태 ('idle' | 'loading' | 'loaded' | 'error')
 * @returns error - 에러 발생 시 에러 객체
 * @returns isLoaded - SDK 로딩 완료 여부
 * @returns isLoading - SDK 로딩 중 여부
 * @returns isError - 에러 발생 여부
 * @returns load - SDK 로드 시작 함수
 * @returns retry - SDK 로드 재시도 함수 (에러 상태에서 사용)
 *
 * @example
 * ```typescript
 * const { isLoaded, isLoading, isError, error, retry } = useMapSdkLoader();
 *
 * if (isLoading) return <Loading />;
 * if (isError) return <button onClick={retry}>다시 시도</button>;
 * if (isLoaded) return <Map />;
 * ```
 */
const useMapSdkLoader = (): UseMapSdkLoaderReturn => {
  const snapshot: LoaderSnapshot = useSyncExternalStore(
    mapSdkLoader.subscribe,
    mapSdkLoader.getSnapshot,
    mapSdkLoader.getServerSnapshot,
  );

  return {
    status: snapshot.status,
    error: snapshot.error,
    isLoaded: snapshot.status === 'loaded',
    isLoading: snapshot.status === 'loading',
    isError: snapshot.status === 'error',
    load: () => mapSdkLoader.load(),
    retry: () => mapSdkLoader.retry(),
  };
};

export { useMapSdkLoader };
export type { UseMapSdkLoaderReturn };
