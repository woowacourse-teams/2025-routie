import { css } from '@emotion/react';

import theme from '@/styles/theme';

const HeaderStyle = css`
  width: 100%;
  height: 7rem;
  background-color: ${theme.colors.white};
`;

const HomeButtonStyle = css`
  cursor: pointer;
  padding: 0;
  border: none;
  background: none;
`;

export { HeaderStyle, HomeButtonStyle };
