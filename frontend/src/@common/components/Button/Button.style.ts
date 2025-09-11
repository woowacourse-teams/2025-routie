import { css, SerializedStyles } from '@emotion/react';

import theme from '@/styles/theme';

import type { ButtonProps, ButtonVariantType } from './Button.types';

const buttonVariant: Record<ButtonVariantType, SerializedStyles> = {
  primary: css`
    color: ${theme.colors.white};
    background-color: ${theme.colors.purple[400]};

    :hover {
      background-color: ${theme.colors.purple[300]};
    }
  `,

  secondary: css`
    border: 1px solid ${theme.colors.purple[400]};
    color: ${theme.colors.purple[400]};
    background-color: ${theme.colors.white};

    :hover {
      background-color: ${theme.colors.purple[200]};
    }
  `,
};

export const ButtonStyle = ({ variant, width }: ButtonProps) => css`
  cursor: pointer;

  display: flex;
  gap: 0.8rem;
  align-items: center;
  justify-content: space-between;

  box-sizing: border-box;
  width: ${width};
  max-width: 100%;
  padding: 1rem 0.8rem;
  border: none;
  border-radius: 8px;

  ${variant && buttonVariant[variant]}

  :disabled {
    cursor: not-allowed;
    border: none;
    color: ${theme.colors.white};
    background-color: ${theme.colors.gray[100]};
  }
`;
