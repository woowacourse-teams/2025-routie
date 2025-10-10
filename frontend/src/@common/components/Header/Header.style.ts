import { css } from '@emotion/react';

import theme from '@/styles/theme';

const HeaderStyle = css`
  width: 100%;
  height: 8rem;
  background-color: ${theme.home.gray};
`;

const HomeButtonStyle = css`
  cursor: pointer;
  padding: 0;
  border: none;
  background: none;
`;

export { HeaderStyle, HomeButtonStyle };
