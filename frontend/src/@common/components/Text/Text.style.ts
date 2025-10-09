import { css, SerializedStyles } from '@emotion/react';

import theme from '@/styles/theme';

import type { TextProps, TextVariantType } from './Text.types';

const textVariant: Record<TextVariantType, SerializedStyles> = {
  logo: css`
    font-size: ${theme.font.size.logo};
    font-weight: ${theme.font.weight.bold};
  `,
  title: css`
    font-size: ${theme.font.size.heading};
    font-weight: ${theme.font.weight.bold};
  `,
  subTitle: css`
    font-size: ${theme.font.size.subHeading};
    font-weight: ${theme.font.weight.semibold};
  `,
  body: css`
    font-size: ${theme.font.size.body};
    font-weight: ${theme.font.weight.semibold};
  `,
  caption: css`
    font-size: ${theme.font.size.caption};
    font-weight: ${theme.font.weight.medium};
  `,
  label: css`
    font-size: ${theme.font.size.label};
    font-weight: ${theme.font.weight.regular};
  `,
  description: css`
    font-size: ${theme.font.size.description};
    font-weight: ${theme.font.weight.light};
  `,
};

const ellipsisStyle = css`
  overflow: hidden;
  display: block;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TextStyle = ({ color, variant, ellipsis }: TextProps) => css`
  box-sizing: border-box;
  max-width: 100%;
  color: ${color ? color : theme.colors.gray[300]};

  ${variant && textVariant[variant]}
  ${ellipsis && ellipsisStyle}
`;

export { TextStyle };
