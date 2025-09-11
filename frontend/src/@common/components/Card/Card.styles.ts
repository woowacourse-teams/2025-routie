import { css, SerializedStyles } from '@emotion/react';

import theme from '@/styles/theme';

import type { CardVariantType } from './Card.types';

const cardVariant: Record<CardVariantType, SerializedStyles> = {
  default: css`
    border: 2px solid ${theme.colors.gray[50]};
    box-shadow: 2px 4px 4px 0 rgb(0 0 0 / 15%);
  `,

  defaultStatic: css`
    position: relative;

    padding: 0.8rem;
    border: 1px solid ${theme.colors.purple[50]};
    border-left: 4px solid ${theme.colors.purple[100]};

    box-shadow: 2px 4px 4px 0 rgb(0 0 0 / 25%);
  `,

  available: css`
    border: 2px solid #008b7e;
    box-shadow: 2px 4px 4px 0 rgb(0 0 0 / 15%);
  `,

  unavailable: css`
    border-left: 4px solid ${theme.colors.red[100]};
    background-color: ${theme.colors.red[50]};
  `,

  disabled: css`
    border-left: 4px solid ${theme.colors.gray[300]};
    background-color: ${theme.colors.gray[25]};
  `,

  valid: css`
    border-left: 4px solid #008b7e;
    background-color: ${theme.colors.green[50]};
    box-shadow: 2px 4px 4px 0 rgb(0 0 0 / 25%);
  `,

  invalid: css`
    position: relative;
    padding: 0.8rem;
    border: 0.4rem solid ${theme.colors.red[50]};
    box-shadow: 0.2rem 0.4rem 0.4rem 0 rgb(0 0 0 / 25%);
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
  padding: 1rem;
  border-radius: 12px;

  background-color: ${theme.colors.white};
  ${cardVariant[variant]}
`;

export { CardStyle };
