import { css } from '@emotion/react';

import theme from '@/styles/theme';

const ToggleContainer = css`
  display: inline-block;
`;

const ToggleHiddenCheckbox = css`
  display: none;
`;

const ToggleStyle = (checked: boolean) => css`
  cursor: pointer;

  position: relative;

  display: inline-block;

  width: 4.4rem;
  height: 2.4rem;
  border-radius: 34px;

  background-color: ${checked ? theme.colors.blue[450] : theme.colors.gray[50]};

  transition: background-color 0.2s ease;

  &::after {
    content: '';

    position: absolute;
    top: 0.3rem;
    left: ${checked ? 'calc(100% - 2.2rem)' : '0.3rem'};

    width: 1.8rem;
    height: 1.8rem;
    border-radius: 50%;

    background-color: ${theme.colors.white};

    transition: left 0.2s ease;
  }
`;

export { ToggleContainer, ToggleHiddenCheckbox, ToggleStyle };
