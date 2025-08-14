import { css } from '@emotion/react';

import { IconProps } from './Icon.types';

export const IconStyle = (props: IconProps) => css`
  cursor: ${props.onClick ? 'pointer' : 'default'};
  flex-shrink: 0;
  width: ${props.size && props.size / 10}rem;
  height: ${props.size && props.size / 10}rem;
`;
