import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('fallbackRender에 error 객체와 resetErrorBoundary 함수를 전달한다', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <div>
            <span>에러: {error.message}</span>
            <button onClick={resetErrorBoundary}>재시도</button>
          </div>
        )}
      >
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('에러: Test error')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '재시도' })).toBeInTheDocument();

    vi.restoreAllMocks();
  });

  it('resetErrorBoundary 호출 시 children을 재렌더링한다', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const user = userEvent.setup();

    let shouldThrow = true;

    const MaybeThrow = () => {
      if (shouldThrow) {
        throw new Error('Test error');
      }
      return <div>복구됨</div>;
    };

    render(
      <ErrorBoundary
        fallbackRender={({ resetErrorBoundary }) => (
          <button onClick={resetErrorBoundary}>재시도</button>
        )}
      >
        <MaybeThrow />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('button', { name: '재시도' })).toBeInTheDocument();

    shouldThrow = false;
    await user.click(screen.getByRole('button', { name: '재시도' }));

    expect(screen.getByText('복구됨')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '재시도' }),
    ).not.toBeInTheDocument();

    vi.restoreAllMocks();
  });

  it('resetKeys 변경 시 에러 상태를 자동 리셋한다', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    let shouldThrow = true;

    const MaybeThrow = () => {
      if (shouldThrow) {
        throw new Error('Test error');
      }
      return <div>복구됨</div>;
    };

    const { rerender } = render(
      <ErrorBoundary
        resetKeys={['tab1']}
        fallbackRender={({ error }) => <div>에러: {error.message}</div>}
      >
        <MaybeThrow />
      </ErrorBoundary>,
    );

    expect(screen.getByText('에러: Test error')).toBeInTheDocument();

    shouldThrow = false;
    rerender(
      <ErrorBoundary
        resetKeys={['tab2']}
        fallbackRender={({ error }) => <div>에러: {error.message}</div>}
      >
        <MaybeThrow />
      </ErrorBoundary>,
    );

    expect(screen.getByText('복구됨')).toBeInTheDocument();
    expect(screen.queryByText('에러: Test error')).not.toBeInTheDocument();

    vi.restoreAllMocks();
  });
});
