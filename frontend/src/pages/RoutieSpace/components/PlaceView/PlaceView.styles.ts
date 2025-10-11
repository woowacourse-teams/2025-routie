import { css } from '@emotion/react';

import theme from '@/styles/theme';

const PlaceViewContainerStyle = css`
  overflow-y: auto;
  background-color: ${theme.colors.white};
`;

const PlaceListContainerStyle = css`
  overflow-y: auto;
`;

export { PlaceViewContainerStyle, PlaceListContainerStyle };
