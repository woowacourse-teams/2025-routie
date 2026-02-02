import { useKakaoLoader } from '@/domains/maps/hooks/useKakaoLoader';

import type { KakaoMapLoadBoundaryProps } from './KakaoMapLoadBoundary.types';

/**
 * 카카오 지도 SDK 로딩 상태를 관리하는 Boundary 컴포넌트
 *
 * @description
 * SDK 로딩 상태에 따라 children, fallback, errorFallback을 조건부 렌더링합니다.
 * SDK가 로드되기 전에는 fallback을 표시하고, 로드 실패 시 errorFallback을 표시합니다.
 *
 * @param props - 컴포넌트 Props
 * @param props.children - SDK 로딩 완료 후 렌더링할 자식 컴포넌트
 * @param props.fallback - SDK 로딩 중 표시할 컴포넌트 (선택)
 * @param props.errorFallback - SDK 로딩 실패 시 표시할 컴포넌트 (선택)
 *
 * @example
 * ```tsx
 * <KakaoMapLoadBoundary
 *   fallback={<div>로딩 중...</div>}
 *   errorFallback={(error) => <div>에러: {error.message}</div>}
 * >
 *   <Map center={{ lat: 37.5, lng: 127.0 }}>
 *     <MapContent />
 *   </Map>
 * </KakaoMapLoadBoundary>
 * ```
 */
const KakaoMapLoadBoundary = ({
  children,
  fallback = null,
  errorFallback = null,
}: KakaoMapLoadBoundaryProps) => {
  const { isLoaded, isLoading, isError, error } = useKakaoLoader();

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (isError && error) {
    if (typeof errorFallback === 'function') {
      return <>{errorFallback(error)}</>;
    }
    return <>{errorFallback}</>;
  }

  if (!isLoaded) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default KakaoMapLoadBoundary;
