import { css } from '@emotion/react';

import theme from '@/styles/theme';

const DividerStyle = css`
  width: 100%;
  height: 0.1rem;
  opacity: 0.8;
  background: ${theme.colors.black};
`;

const UserMenuStyle = css`
  position: absolute;
  z-index: 10;
  top: 4.4rem;
  right: 0;

  width: 18rem;
  padding: 1rem;
  border-radius: ${theme.radius.sm};

  background-color: ${theme.colors.white};
`;

export { DividerStyle, UserMenuStyle };
