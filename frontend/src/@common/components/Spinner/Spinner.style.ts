import { css, keyframes } from '@emotion/react';

import { SpinnerProps } from './Spinner.types';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerStyle = ({
  size,
  thickness,
  speed,
  color,
  trackColor,
}: SpinnerProps) => css`
  width: ${size}px;
  height: ${size}px;
  border: ${thickness}px solid ${trackColor};
  border-left-color: ${color};
  border-radius: 50%;

  animation: ${spin} ${speed}s linear infinite;
`;

export { SpinnerStyle };
