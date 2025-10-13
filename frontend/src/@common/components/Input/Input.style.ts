import { css, SerializedStyles } from '@emotion/react';

import theme from '@/styles/theme';

import type { InputStyleProps, InputVariantType } from './Input.types';

const blinkBackground = css`
  @keyframes blink-background {
    0%,
    100% {
      background-color: ${theme.colors.red[50]};
    }

    50% {
      background-color: ${theme.colors.white};
    }
  }

  animation: blink-background 0.3s ease-in-out 1;
`;

const inputVariant: Record<InputVariantType, SerializedStyles> = {
  primary: css`
    border-color: ${theme.colors.blue[450]};

    &:focus {
      border-color: ${theme.colors.blue[450]};
    }
  `,
  disabled: css`
    cursor: not-allowed;
    border: none;
    background-color: ${theme.colors.gray[50]};
  `,
  error: css`
    border-color: ${theme.colors.red[100]};
    color: ${theme.colors.red[100]};
    background-color: ${theme.colors.red[50]};

    &:focus {
      border-color: ${theme.colors.red[100]};
    }

    ${blinkBackground}
  `,
};

const InputStyle = ({ variant, icon }: InputStyleProps) => css`
  width: 100%;
  height: 3.5rem;
  padding: 0.4rem 1.2rem;
  border: 1px solid;
  border-radius: ${theme.radius.sm};
  ${icon ? 'padding-left: 2.5rem;' : ''}

  &::placeholder {
    font-size: ${theme.font.size.label};
    font-weight: ${theme.font.weight.medium};
    color: ${theme.colors.gray[150]};
  }

  &:focus {
    width: 100%;
    height: 3.5rem;
    padding: 0.4rem 1.2rem;
    border: 3px solid;
    ${icon ? 'padding-left: 2.5rem;' : ''}

    outline: none;
  }

  ${variant && inputVariant[variant]};
`;

const InputLabelStyle = css`
  font-size: ${theme.font.size.label};
  font-weight: ${theme.font.weight.medium};
  color: ${theme.colors.black};
`;

const InputIconStyle = css`
  pointer-events: none;

  position: absolute;
  top: 50%;
  left: 0.8rem;
  transform: translateY(-50%);

  width: 1.4rem;
  height: 1.4rem;
`;

const InputContainerStyle = css`
  position: relative;
  width: 100%;
`;

export { InputStyle, InputLabelStyle, InputIconStyle, InputContainerStyle };
