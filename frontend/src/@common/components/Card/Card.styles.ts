import { css, SerializedStyles } from '@emotion/react';

import theme from '@/styles/theme';

import { CardVariantProps } from './Card.types';

const cardVariant: Record<CardVariantProps, SerializedStyles> = {
  default: css`
    border: 1px solid ${theme.colors.purple[50]};
    border-left: 4px solid ${theme.colors.purple[100]};
    background-color: ${theme.colors.white};
    box-shadow: 2px 4px 4px 0 rgb(0 0 0 / 25%);
  `,

  defaultStatic: css`
    padding: 0.8rem;
    border: 1px solid ${theme.colors.purple[50]};
    border-left: 4px solid ${theme.colors.purple[100]};

    background-color: ${theme.colors.white};
    box-shadow: 2px 4px 4px 0 rgb(0 0 0 / 25%);
  `,

  available: css`
    border-left: 4px solid ${theme.colors.green[100]};
    background-color: ${theme.colors.white};
    box-shadow: 2px 4px 4px 0 rgb(0 0 0 / 25%);
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

const CardStyle = (
  variant: keyof typeof cardVariant,
  width: string | undefined,
  height: string | undefined,
) => css`
  box-sizing: border-box;
  width: ${width ? width : '100%'};
  height: ${height ? height : 'auto'};
  padding: 1.6rem;
  border-radius: 8px;
  ${cardVariant[variant]}
`;

export default CardStyle;
