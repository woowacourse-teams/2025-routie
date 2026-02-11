import { css, keyframes } from '@emotion/react';

import theme from '@/styles/theme';

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const SkeletonBoxStyle = css`
  background: linear-gradient(
    90deg,
    ${theme.colors.gray[50]} 25%,
    ${theme.colors.gray[25]} 50%,
    ${theme.colors.gray[50]} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
  border-radius: 4px;
`;

export { SkeletonBoxStyle };
