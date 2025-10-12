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

const ToggleButtonStyle = css`
  cursor: pointer;

  position: absolute;
  z-index: 1001;
  top: 50%;
  right: -2.4rem;
  transform: translateY(-50%);

  display: flex;
  align-items: center;
  justify-content: center;

  width: 3.6rem;
  height: 3.6rem;
  padding: 0;
  border: 1px solid ${theme.colors.gray[100]};
  border-radius: 50%;

  background-color: ${theme.colors.white};
  box-shadow: 0 2px 8px rgb(0 0 0 / 10%);

  transition: box-shadow 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
  }

  img {
    filter: invert(1);
  }
`;

export { SidebarContainerStyle, ToggleButtonStyle };
