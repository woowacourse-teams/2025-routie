import { css } from '@emotion/react';

import type { FlexProps } from './Flex.types';

const FlexStyle = ({
  direction,
  alignItems,
  justifyContent,
  gap,
  margin,
  padding,
  width,
  maxWidth,
  minWidth,
  height,
  flex,
}: FlexProps) => css`
  display: flex;
  flex: ${typeof flex === 'number' ? flex : flex};
  flex-direction: ${direction ? direction : 'row'};
  gap: ${gap ? `${gap}rem` : '0'};
  align-items: ${alignItems ? alignItems : 'center'};
  justify-content: ${justifyContent ? justifyContent : 'center'};

  box-sizing: border-box;
  width: ${width ? width : '100%'};
  min-width: ${minWidth ? minWidth : 'auto'};
  max-width: ${maxWidth ? maxWidth : '100%'};
  height: ${height ? height : 'auto'};
  margin: ${typeof margin === 'number' ? `${margin}rem` : margin};
  padding: ${typeof padding === 'number' ? `${padding}rem` : padding};
`;

export { FlexStyle };
