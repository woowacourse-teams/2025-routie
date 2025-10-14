import { css } from '@emotion/react';

import theme from '@/styles/theme';

const PlaceViewContainerStyle = css`
  overflow: hidden;
  background-color: ${theme.colors.white};
`;

const PlaceListContainerStyle = css`
  overflow: auto;
  display: flex;
  flex: 1;
  flex-direction: column;

  width: 100%;
  min-width: 0;
  min-height: 0;

  & > div:not(:last-child) {
    border-bottom: 1px solid ${theme.colors.gray[100]};
  }
`;
const PlaceCardContainerStyle = css`
  position: relative;
  width: 100%;
`;

export {
  PlaceViewContainerStyle,
  PlaceListContainerStyle,
  PlaceCardContainerStyle,
};
