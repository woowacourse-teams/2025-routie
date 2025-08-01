import { css } from '@emotion/react';

import FlexProps from './Flex.types';

const FlexStyle = ({
  direction,
  alignItems,
  justifyContent,
  gap,
  margin,
  padding,
  width,
  height,
}: FlexProps) => css`
  display: flex;
  flex-direction: ${direction ? direction : 'row'};
  gap: ${gap ? `${gap}rem` : '0'};
  align-items: ${alignItems ? alignItems : 'center'};
  justify-content: ${justifyContent ? justifyContent : 'center'};

  box-sizing: border-box;
  width: ${width ? width : 'auto'};
  max-width: 100%;
  height: ${height ? height : 'auto'};
  margin: ${margin ? `${margin}rem` : '0'};
  padding: ${padding ? `${padding}rem` : '0'};
`;

export default FlexStyle;
