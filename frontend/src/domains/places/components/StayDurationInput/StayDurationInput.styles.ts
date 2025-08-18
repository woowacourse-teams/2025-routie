import { css } from '@emotion/react';

import theme from '@/styles/theme';

export const stayDurationButton = css`
  justify-content: center;

  :hover {
    color: ${theme.colors.white};
    background-color: ${theme.colors.purple[300]};
  }
`;

export const stayDurationContainer = css`
  flex: 0 0 auto;
`;

export const stayDurationInputContainer = css`
  flex: 0 0 auto;
`;
