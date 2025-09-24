import { css } from '@emotion/react';

import theme from '@/styles/theme';

const UserMenuIconStyle = css`
  cursor: pointer;

  padding: 0.4rem;
  border-radius: 50%;

  background-color: ${theme.colors.white};
  box-shadow: 0 0.4rem 0.8rem rgb(0 0 0 / 25%);
`;

const UserMenuButtonWrapperStyle = css`
  position: relative;
  display: inline-block;
`;

const UserMenuButtonAbsoluteStyle = css`
  position: absolute;
  z-index: 10;
  top: 1.6rem;
  right: 2rem;
`;

export {
  UserMenuIconStyle,
  UserMenuButtonWrapperStyle,
  UserMenuButtonAbsoluteStyle,
};
