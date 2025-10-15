import { css } from '@emotion/react';

import theme from '@/styles/theme';

import { SIDEBAR_WIDTH_OPEN, SIDEBAR_WIDTH_CLOSED } from './width';

const SidebarContainerStyle = (isOpen: boolean) => css`
  position: absolute;
  z-index: 1000;
  top: 1rem;
  bottom: 1rem;
  left: 1rem;

  display: flex;
  flex-direction: column;

  width: ${isOpen ? SIDEBAR_WIDTH_OPEN : SIDEBAR_WIDTH_CLOSED};
  border-radius: ${theme.radius.sm};

  background-color: ${theme.colors.white};
  box-shadow: 0 0 1rem 0 rgb(0 0 0 / 20%);
`;

const SidebarContentContainerStyle = (isOpen: boolean) => css`
  display: ${isOpen ? 'flex' : 'none'};
  border-left: 1px solid ${theme.colors.gray[100]};
`;

const SidebarTabContainerStyle = (isOpen: boolean) => css`
  border-radius: ${isOpen
    ? `${theme.radius.sm}  0 0 ${theme.radius.sm}`
    : `${theme.radius.sm}`};
  background-color: ${theme.colors.white};
`;

export {
  SidebarContainerStyle,
  SidebarTabContainerStyle,
  SidebarContentContainerStyle,
};
