import { css } from '@emotion/react';

import theme from '@/styles/theme';

const DividerStyle = css`
  width: 100%;
  height: 1px;
  opacity: 0.8;
  background: ${theme.colors.black};
`;

const UserMenuStyle = css`
  position: absolute;
  z-index: 10;
  top: 44px;
  right: 0;

  width: 18rem;
  padding: 1rem;
  border-radius: 8px;

  background-color: ${theme.colors.white};
`;

export { DividerStyle, UserMenuStyle };
