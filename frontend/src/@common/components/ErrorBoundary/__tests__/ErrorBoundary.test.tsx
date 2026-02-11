import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ErrorBoundary from '../ErrorBoundary';

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>정상 렌더링</div>;
};

describe('ErrorBoundary', () => {
  it('에러 없을 시 children을 정상 렌더링한다', () => {
    render(
      <ErrorBoundary fallback={<div>에러 발생</div>}>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('정상 렌더링')).toBeInTheDocument();
  });

  it('자식 컴포넌트 에러 시 fallback을 렌더링한다', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary fallback={<div>에러 발생</div>}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('에러 발생')).toBeInTheDocument();
    expect(screen.queryByText('정상 렌더링')).not.toBeInTheDocument();

    vi.restoreAllMocks();
  });
});
