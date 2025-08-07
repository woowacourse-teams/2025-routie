import { css } from '@emotion/react';

import theme from '@/styles/theme';

export const listStyle = css`
  position: absolute;
  z-index: 10;
  top: 0;

  overflow-y: auto;

  width: 100%;
  max-height: 20rem;
  border: 1px solid ${theme.colors.gray[50]};

  background-color: ${theme.colors.white};
`;

export const itemButtonStyle = css`
  cursor: pointer;

  width: 100%;
  padding: 12px 16px;
  border: 0;
  border-radius: 0;

  &:hover {
    background: ${theme.colors.purple[50]};
  }
`;
