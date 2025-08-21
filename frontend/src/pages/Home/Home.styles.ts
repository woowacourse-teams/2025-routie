import { css } from '@emotion/react';

import theme from '@/styles/theme';

export const HomepageStyle = css`
  background-color: ${theme.home.gray};
`;

export const titleTextStyle = css`
  font-size: 4rem;
`;

export const subTitleTextStyle = css`
  font-size: 2.5rem;
`;

export const violetTextStyle = css`
  font-size: 2.5rem;
  color: ${theme.home.violet};
`;

export const infoCardsWrapperStyle = css`
  padding: 5rem 0;
`;

export const createButtonStyle = css`
  justify-content: center;
  background-color: ${theme.home.violet};
  box-shadow: 0 8px 16px rgb(0 0 0 / 16%);
`;

export const continueButtonStyle = css`
  justify-content: center;
  background-color: white;
  box-shadow: 0 8px 16px rgb(0 0 0 / 16%);
`;
