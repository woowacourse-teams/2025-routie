import { css } from '@emotion/react';

import theme from '@/styles/theme';

const ManageRoutieSpacesStyle = css`
  height: 100dvh;
  background-color: ${theme.colors.white};
`;

const RoutieSpaceListStyle = css`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 2rem;
  width: 100%;

  @media (width <= 2000px) {
    grid-template-columns: repeat(5, 1fr);
  }

  @media (width <= 1800px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (width <= 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (width <= 820px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (width <= 540px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

export { ManageRoutieSpacesStyle, RoutieSpaceListStyle };
