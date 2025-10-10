import { css, SerializedStyles } from '@emotion/react';

import theme from '@/styles/theme';

import type { ButtonProps, ButtonVariantType } from './Button.types';

const buttonVariant: Record<ButtonVariantType, SerializedStyles> = {
  primary: css`
    color: ${theme.colors.white};
    background-color: ${theme.colors.blue[450]};
  `,

  secondary: css`
    border: 1px solid ${theme.colors.gray[100]};
    color: ${theme.colors.gray[300]};
  `,

  danger: css`
    color: ${theme.colors.gray[300]};

    :hover {
      background-color: ${theme.colors.red[50]};
    }
  `,

  dangerSecondary: css`
    background-color: ${theme.colors.gray[100]};

    &:hover {
      background-color: ${theme.colors.red[100]};
    }
  `,
};

const ButtonStyle = ({ variant, width, padding, radius }: ButtonProps) => css`
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  box-sizing: border-box;
  width: ${width ? width : '100%'};
  max-width: 100%;
  padding: ${padding ? padding : '1rem 0.8rem'};
  border: none;
  border-radius: ${radius ? theme.radius[radius] : theme.radius.sm};

  background-color: ${theme.colors.white};

  &:hover {
    color: ${theme.colors.white};
    background-color: ${theme.colors.blue[200]};
  }

  ${variant && buttonVariant[variant]}

  :disabled {
    cursor: not-allowed;
    border: none;
    color: ${theme.colors.white};
    background-color: ${theme.colors.gray[100]};
  }
`;

export { ButtonStyle };
