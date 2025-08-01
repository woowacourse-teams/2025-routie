import { css } from '@emotion/react';

import theme from '@/styles/theme';

export const DateCheckboxInputStyle = css`
  display: none;
`;

export const DateCheckboxLabelStyle = (isChecked: boolean) => css`
  cursor: pointer;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 2rem;
  height: 2rem;
  padding: 0.2rem;
  border-radius: 2rem;

  color: ${theme.colors.black};

  background-color: ${isChecked
    ? theme.colors.purple[300]
    : theme.colors.gray[200]};
`;
