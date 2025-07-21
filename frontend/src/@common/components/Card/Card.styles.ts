import { css, SerializedStyles } from '@emotion/react';

import theme from '@/styles/theme';

import { CardVariantProps } from './Card.types';

const cardVariant: Record<CardVariantProps, SerializedStyles> = {
  default: css`
    border: 1px solid ${theme.colors.purple[50]};
    border-left: 4px solid ${theme.colors.purple[100]};
    background-color: ${theme.colors.white};

    &:hover {
      border-left: 4px solid ${theme.colors.purple[300]};
      background-color: ${theme.colors.purple[100]};
    }
  `,

  available: css`
    border-left: 4px solid ${theme.colors.green[100]};
    background-color: ${theme.colors.green[50]};
  `,
  unavailable: css`
    border-left: 4px solid ${theme.colors.red[100]};
    background-color: ${theme.colors.red[50]};
  `,
  disabled: css`
    border-left: 4px solid ${theme.colors.gray[300]};
    background-color: ${theme.colors.gray[50]};
  `,
};

const CardStyle = (variant: keyof typeof cardVariant) => css`
  padding: 1.6rem;
  border-radius: 8px;
  ${variant && cardVariant[variant]}
`;

export default CardStyle;
