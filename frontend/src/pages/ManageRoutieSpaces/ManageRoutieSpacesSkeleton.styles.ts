import { css } from '@emotion/react';

import theme from '@/styles/theme';

const ManageRoutieSpacesSkeletonStyle = css`
  height: 100dvh;
  background-color: ${theme.colors.white};
`;

const HeaderSkeletonStyle = css`
  width: 100%;
  height: 8rem;
  padding: 0 1.6rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const GridSkeletonStyle = css`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  width: 70%;
  max-width: 1580px;
  margin: 0 auto;
  padding: 2rem 0;
`;

export {
  ManageRoutieSpacesSkeletonStyle,
  HeaderSkeletonStyle,
  GridSkeletonStyle,
};
