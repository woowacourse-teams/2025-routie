import { css } from '@emotion/react';

import theme from '@/styles/theme';

export const loadingCardStyle = css`
  font-size: ${theme.font.size.caption};
  animation: spin 2s linear infinite;
`;
