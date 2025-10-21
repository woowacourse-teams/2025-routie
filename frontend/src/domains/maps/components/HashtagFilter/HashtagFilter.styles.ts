import { css } from '@emotion/react';

import {
  SIDEBAR_WIDTH_CLOSED,
  SIDEBAR_WIDTH_OPEN,
} from '@/pages/RoutieSpace/components/Sidebar/width';
import theme from '@/styles/theme';

const ButtonStyle = (isAllSelected: boolean) => css`
  flex-shrink: 0;
  gap: 1rem;
  white-space: nowrap;
  ${isAllSelected && `border: 1px solid transparent;`}
`;

const ButtonContainerStyle = (isSidebarOpen: boolean) => css`
  position: absolute;
  z-index: 10;
  top: 1.6rem;
  right: 8rem;
  left: ${isSidebarOpen
    ? `calc(${SIDEBAR_WIDTH_OPEN} + 2rem)`
    : `calc(${SIDEBAR_WIDTH_CLOSED} + 2rem)`};

  transition: left 0.3s ease-in-out;
`;

const HashtagsContainerStyle = css`
  scrollbar-width: none;

  overflow: visible;
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  gap: 0.8rem;
  align-items: center;

  max-width: none;
  min-height: 4rem;

  &::-webkit-scrollbar {
    height: 0;
  }
`;

const DropdownWrapperStyle = css`
  position: relative;
`;

const DropdownButtonStyle = (isOpen: boolean) => css`
  min-width: 4rem;
  height: 4rem;
  border-radius: 50%;

  font-size: 1.4rem;
  color: ${isOpen ? theme.colors.white : theme.colors.gray[250]};

  background-color: ${isOpen ? theme.colors.blue[400] : theme.colors.white};
  box-shadow: 0 0.2rem 0.4rem rgb(0 0 0 / 10%);

  transition: all 0.2s;
`;

const DropdownContentStyle = (isOpen: boolean) => css`
  position: absolute;
  z-index: 1000;
  top: calc(100% + 0.8rem);
  left: -6rem;

  overflow-y: auto;
  display: ${isOpen ? 'flex' : 'none'};

  min-width: 16rem;
  max-height: 40rem;
  border-radius: ${theme.radius.md};

  background-color: ${theme.colors.white};
  box-shadow: 0 0.4rem 0.8rem rgb(0 0 0 / 15%);
`;

export {
  ButtonStyle,
  ButtonContainerStyle,
  HashtagsContainerStyle,
  DropdownWrapperStyle,
  DropdownButtonStyle,
  DropdownContentStyle,
};
