import { css, SerializedStyles } from '@emotion/react';

import theme from '@/styles/theme';

import {
  IconButtonStyleProps,
  IconButtonVariantType,
} from './IconButton.types';

const iconButtonVariant: Record<IconButtonVariantType, SerializedStyles> = {
  delete: css`
    &:hover {
      background-color: ${theme.colors.red[50]};
    }
  `,

  select: css`
    width: 3rem;
    height: 3rem;
    padding: 0.4rem;
    border: 1px solid ${theme.colors.blue[450]};
  `,

  selected: css`
    pointer-events: none;

    width: 3rem;
    height: 3rem;
    padding: 0.4rem;
    border: 1px solid ${theme.colors.green[100]};

    background-color: ${theme.colors.green[50]};
  `,

  disable: css`
    cursor: not-allowed;

    &:hover {
      background-color: transparent;
    }

    & * {
      pointer-events: none;
    }
  `,
};

const IconButtonStyle = ({ variant }: IconButtonStyleProps) => css`
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 2.8rem;
  height: 2.8rem;
  padding: 0.5rem;
  border: none;
  border-radius: ${theme.radius.sm};

  background-color: transparent;

  &:hover {
    background-color: ${theme.colors.blue[200]};
  }

  ${variant && iconButtonVariant[variant]}
`;

export { IconButtonStyle };
