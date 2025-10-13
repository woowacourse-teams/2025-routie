import { css } from '@emotion/react';

import theme from '@/styles/theme';

const DragIconStyle = css`
  pointer-events: none;
  cursor: grab;
  user-select: none;
`;

const KebabMenuContainerStyle = css`
  position: relative;
`;

const KebabButtonStyle = css`
  cursor: pointer;
  user-select: none;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0.8rem;
  border: none;
  border-radius: ${theme.radius.sm};

  background: transparent;

  &:hover {
    background-color: ${theme.colors.gray[50]};
  }
`;

const KebabDropdownStyle = css`
  position: absolute;
  z-index: 10;
  top: 100%;
  right: 0;

  overflow: hidden;

  min-width: 12rem;
  margin-top: 0.4rem;
  border-radius: ${theme.radius.sm};

  background: ${theme.colors.white};
  box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
`;

const KebabIconTextStyle = css`
  user-select: none;
  font-size: 2rem;
  line-height: 1;
  color: ${theme.colors.gray[250]};
`;

const RoutiePlaceCardContainerStyle = css`
  border: 2px solid ${theme.colors.blue[200]};
  border-radius: ${theme.radius.sm};
  box-shadow: 2px 4px 4px 0 rgb(0 0 0 / 15%);

  &:hover {
    border-color: ${theme.colors.blue[450]};
    box-shadow: 2px 4px 4px 0 rgb(0 0 0 / 25%);
  }
`;

export {
  RoutiePlaceCardContainerStyle,
  DragIconStyle,
  KebabButtonStyle,
  KebabDropdownStyle,
  KebabIconTextStyle,
  KebabMenuContainerStyle,
};
