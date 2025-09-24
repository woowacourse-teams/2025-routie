import { css } from '@emotion/react';

import theme from '@/styles/theme';

const UserMenuIconStyle = css`
  cursor: pointer;

  padding: 0.4rem;
  border-radius: 50%;

  background-color: ${theme.colors.white};
  box-shadow: 0 4px 8px rgb(0 0 0 / 25%);
`;

const UserMenuButtonWrapperStyle = css`
  position: relative;
  display: inline-block;
`;

const UserMenuButtonAbsoluteStyle = css`
  position: absolute;
  z-index: 10;
  top: 16px;
  right: 20px;
`;

export {
  UserMenuIconStyle,
  UserMenuButtonWrapperStyle,
  UserMenuButtonAbsoluteStyle,
};
