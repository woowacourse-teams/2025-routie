import { css, SerializedStyles } from '@emotion/react';

import theme from '@/styles/theme';

import { PillProps, PillVariantProps } from './Pill.types';

const pillVariant: Record<PillVariantProps, SerializedStyles> = {
  default: css`
    width: 100%;
    background-color: ${theme.colors.white};
  `,

  filled: css`
    background-color: ${theme.colors.purple[100]};
  `,
};

export const PillStyle = ({ variant = 'default' }: PillProps) => css`
  display: flex;
  gap: 0.8rem;
  align-items: center;
  
  width: fit-content;
  padding: 0.3rem 0.8rem;
  border: 1px solid ${theme.colors.gray[100]};
  border-radius: 0.8rem;

  color: ${theme.colors.purple[400]};
  
  ${pillVariant[variant]}
`;
