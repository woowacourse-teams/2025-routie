import { css } from '@emotion/react';

import type { IconStyleProps } from './Icon.types';

const IconStyle = (props: IconStyleProps) => css`
  cursor: ${props.onClick ? 'pointer' : 'default'};
  flex-shrink: 0;
  width: ${props.size && props.size / 10}rem;
  height: ${props.size && props.size / 10}rem;
`;

export { IconStyle };
