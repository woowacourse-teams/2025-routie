import type { ReactNode } from 'react';

/**
 * KakaoMapLoadBoundary 컴포넌트 Props
 */
interface KakaoMapLoadBoundaryProps {
  /** SDK 로딩 완료 후 렌더링할 자식 컴포넌트 */
  children: ReactNode;
  /** SDK 로딩 중 표시할 컴포넌트 */
  fallback?: ReactNode;
  /** SDK 로딩 실패 시 표시할 컴포넌트 */
  errorFallback?: ReactNode | ((error: Error) => ReactNode);
}

export type { KakaoMapLoadBoundaryProps };
