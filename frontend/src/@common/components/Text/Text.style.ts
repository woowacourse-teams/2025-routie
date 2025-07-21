import { css } from '@emotion/react';

import theme from '@/styles/theme';

import { TextProps } from './Text';

export const textVariant = {
  title: css`
    font-size: ${theme.font.size.heading};
    font-weight: ${theme.font.weight.bold};
  `,
  subTitle: css`
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

const TextStyle = ({ color, variant }: TextProps) => css`
  box-sizing: border-box;
  max-width: 100%;
  color: ${color ? color : 'black'};

  ${variant && textVariant[variant]}
`;

export default TextStyle;
