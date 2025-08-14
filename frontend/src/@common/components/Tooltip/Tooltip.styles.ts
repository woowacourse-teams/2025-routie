import { css } from '@emotion/react';

import theme from '@/styles/theme';

export const TooltipContainerStyle = css`
  position: relative;
  display: inline-block;
`;

export const TooltipStyle = css`
  position: absolute;
  z-index: 10;
  top: calc(100% + 0.8rem);
  transform: translateX(-50%);

  padding: 0.6rem 1.4rem;
  border: 0.1rem solid ${theme.colors.gray[50]};
  border-radius: 1rem;

  color: ${theme.colors.black};
  white-space: nowrap;

  background-color: ${theme.colors.white};
`;
