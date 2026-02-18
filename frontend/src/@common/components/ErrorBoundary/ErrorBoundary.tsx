import { Component } from 'react';

import type { ErrorBoundaryProps, ErrorBoundaryState } from './ErrorBoundary.types';

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (!this.state.hasError || !this.props.resetKeys) return;

    const hasResetKeysChanged =
      prevProps.resetKeys !== undefined &&
      (this.props.resetKeys.length !== prevProps.resetKeys.length ||
        this.props.resetKeys.some(
          (key, index) => key !== prevProps.resetKeys![index],
        ));

    if (hasResetKeysChanged) {
      this.resetErrorBoundary();
    }
  }

  resetErrorBoundary = () => {
    this.props.onReset?.();
    this.setState({ hasError: false, error: null });
  };

  override render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallbackRender) {
        return this.props.fallbackRender({
          error: this.state.error,
          resetErrorBoundary: this.resetErrorBoundary,
        });
      }
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
