import { css } from '@emotion/react';

import theme from '@/styles/theme';

const UserMenuIconStyle = css`
  cursor: pointer;
  padding: 0.8rem;
  border-radius: ${theme.radius.sm};

  &:hover {
    background-color: ${theme.colors.blue[200]};
  }
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
