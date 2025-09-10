import { keyframes, css } from '@emotion/react';

import type { ToastInfoProps } from '@/@common/components/Toast/Toast.types';
import theme from '@/styles/theme';

const slideIn = keyframes`
  from { transform: translateY(16px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const slideOut = keyframes`
  from { transform: translateY(0); opacity: 1; }
  to { transform: translateY(16px); opacity: 0; }
`;

const ToastContainerStyle = css`
  pointer-events: none;

  position: fixed;
  z-index: 10000;
  top: 16px;
  right: 5rem;

  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  align-items: center;
`;

const ToastItemWrapperStyle = (leaving?: boolean) => css`
  pointer-events: auto;

  display: flex;
  gap: 1.2rem;
  align-items: center;

  min-width: 32rem;
  max-width: min(94vw, 48rem);
  height: 4rem;
  padding: 1.6rem 2rem;
  border-radius: 12px;

  color: ${theme.colors.white};

  background: ${theme.colors.white};
  box-shadow: 0 0.8rem 2rem ${theme.colors.gray[200]};

  animation: ${leaving ? slideOut : slideIn} 0.35s ease;
`;

const ToastVariantColor: Record<ToastInfoProps['type'], string> = {
  success: theme.colors.green[100],
  error: theme.colors.red[100],
  warning: theme.colors.green[100],
  info: theme.colors.gray[200],
};

const ToastBadgeStyle = (type: ToastInfoProps['type']) => css`
  flex: 0 0 8px;

  width: 8px;
  height: 8px;
  border-radius: 999px;

  background: ${ToastVariantColor[type]};
`;

const ToastMessageStyle = css`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;

  word-break: break-all;
  white-space: pre-wrap;
`;

export {
  ToastContainerStyle,
  ToastItemWrapperStyle,
  ToastBadgeStyle,
  ToastMessageStyle,
};
