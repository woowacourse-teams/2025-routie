import { css } from '@emotion/react';

import theme from '@/styles/theme';

export const inputVariant = {
  primary: css`
    border-color: ${theme.colors.purple[400]};

    &:focus {
      border-color: ${theme.colors.purple[400]};
    }
  `,
  disabled: css`
    cursor: not-allowed;
    border-color: ${theme.colors.black};
    background-color: ${theme.colors.gray[100]};
  `,
  error: css`
    border-color: ${theme.colors.red[100]};
    color: ${theme.colors.red[100]};
    background-color: ${theme.colors.red[50]};

    &:focus {
      border-color: ${theme.colors.red[100]};
    }
  `,
};

const InputStyle = (variant: keyof typeof inputVariant) => css`
  width: 100%;
  height: 3rem;
  padding: 0.4rem 0.8rem;
  border: 1px solid;
  border-radius: 0.6rem;

  &::placeholder {
    font-size: ${theme.font.size.label};
    font-weight: ${theme.font.weight.medium};
    color: ${theme.colors.gray[50]};
  }

  &:focus {
    width: 100%;
    height: 3rem;
    padding: 0.4rem 0.8rem;
    border: 3px solid;
    border-radius: 0.6rem;

    outline: none;
  }

  ${variant && inputVariant[variant]};
`;

export const InputLabelStyle = css`
  font-size: ${theme.font.size.label};
  font-weight: ${theme.font.weight.medium};
  color: ${theme.colors.black};
`;

export default InputStyle;
