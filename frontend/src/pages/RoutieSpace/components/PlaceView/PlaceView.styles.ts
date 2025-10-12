import { css } from '@emotion/react';

import theme from '@/styles/theme';

const PlaceViewContainerStyle = css`
  overflow-y: auto;
  background-color: ${theme.colors.white};
`;

const PlaceListContainerStyle = css`
  overflow-y: auto;

  & > div:not(:last-child) {
    border-bottom: 1px solid ${theme.colors.gray[100]};
  }
`;

export { PlaceViewContainerStyle, PlaceListContainerStyle };
