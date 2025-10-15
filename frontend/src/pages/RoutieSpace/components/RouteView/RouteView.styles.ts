import { css } from '@emotion/react';

import theme from '@/styles/theme';

const RouteViewContainerStyle = css`
  overflow-y: auto;
  background-color: ${theme.colors.white};
`;

const RoutieListContainerStyle = css`
  overflow-y: auto;
`;

export { RouteViewContainerStyle, RoutieListContainerStyle };
