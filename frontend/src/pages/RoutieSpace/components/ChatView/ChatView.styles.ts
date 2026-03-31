import { css } from '@emotion/react';

import theme from '@/styles/theme';

const chatIconButtonStyle = css`
  cursor: pointer;

  position: fixed;
  z-index: 100;
  right: 3rem;
  bottom: 3rem;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0.8rem;
  border: none;
  border-radius: 50%;

  background-color: ${theme.colors.white};
  box-shadow: 0 0.4rem 1.2rem rgb(0 0 0 / 20%);

  &:hover {
    transform: scale(1.08);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const chatPanelStyle = (isOpen: boolean) => css`
  pointer-events: ${isOpen ? 'auto' : 'none'};

  position: fixed;
  z-index: 99;
  right: 3rem;
  bottom: 3rem;
  transform: translateY(${isOpen ? '0' : '1rem'});

  overflow: hidden;
  display: flex;
  flex-direction: column;

  width: 34rem;
  height: 50rem;
  border: 0.5px solid ${theme.colors.gray[100]};
  border-radius: ${theme.radius.sm};

  opacity: ${isOpen ? 1 : 0};
  background-color: ${theme.colors.white};
  box-shadow: 2px 4px 12px 0 rgb(0 0 0 / 20%);

  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
`;

const chatPanelHeaderStyle = css`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 1.2rem 1.6rem;
  border-bottom: 1px solid ${theme.colors.gray[25]};
  border-radius: 0;

  background-color: ${theme.colors.blue[450]};
`;

const chatPanelHeaderTitleStyle = css`
  font-size: ${theme.font.size.body};
  font-weight: ${theme.font.weight.semibold};
  color: ${theme.colors.white};
`;

const chatPanelCloseButtonStyle = css`
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 1rem;
  height: 2.4rem;
  border: none;
  border-radius: 4px;

  font-size: ${theme.font.size.body};
  color: ${theme.colors.white};

  background-color: transparent;

  &:hover {
    background-color: rgb(255 255 255 / 20%);
  }
`;

const messageListStyle = css`
  overflow-y: auto;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 1.2rem;

  padding: 1.6rem;
`;

const emptyMessageStyle = css`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;

  font-size: ${theme.font.size.caption};
  color: ${theme.colors.gray[100]};
`;

export {
  chatIconButtonStyle,
  chatPanelStyle,
  chatPanelHeaderStyle,
  chatPanelHeaderTitleStyle,
  chatPanelCloseButtonStyle,
  messageListStyle,
  emptyMessageStyle,
};
