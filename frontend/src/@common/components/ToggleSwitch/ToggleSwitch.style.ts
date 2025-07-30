import { css } from '@emotion/react';

import theme from '@/styles/theme';

export const toggleSwitchContainer = css`
  display: inline-block;
`;

export const hiddenCheckbox = css`
  display: none;
`;

export const toggleStyle = (checked: boolean) => css`
  cursor: pointer;

  position: relative;

  display: inline-block;

  width: 44px;
  height: 24px;
  border-radius: 34px;

  background-color: ${checked
    ? theme.colors.purple[400]
    : theme.colors.gray[50]};

  transition: background-color 0.2s ease;

  &::after {
    content: '';

    position: absolute;
    top: 3.4px;
    left: ${checked ? 'calc(100% - 22px)' : '3px'};

    width: 18px;
    height: 18px;
    border-radius: 50%;

    background-color: ${theme.colors.white};

    transition: left 0.2s ease;
  }
`;
