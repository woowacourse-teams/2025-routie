import type { ReactNode } from 'react';

interface FallbackRenderProps {
  error: Error;
  resetErrorBoundary: () => void;
}

interface ErrorBoundaryBaseProps {
  children: ReactNode;
  resetKeys?: unknown[];
  onReset?: () => void;
}

type ErrorBoundaryProps = ErrorBoundaryBaseProps &
  (
    | { fallback: ReactNode; fallbackRender?: never }
    | { fallback?: never; fallbackRender: (props: FallbackRenderProps) => ReactNode }
  );

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export type { ErrorBoundaryProps, ErrorBoundaryState, FallbackRenderProps };
