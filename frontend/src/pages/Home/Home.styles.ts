import { css } from '@emotion/react';

import theme from '@/styles/theme';

const HomepageStyle = css`
  background-color: ${theme.home.gray};
`;

const TitleTextStyle = css`
  font-size: 4rem;
`;

const SubTitleTextStyle = css`
  font-size: 2.5rem;
`;

const VioletTextStyle = css`
  font-size: 2.5rem;
  color: ${theme.home.violet};
`;

const InfoCardsWrapperStyle = css`
  padding: 5rem 0;
`;

const CreateButtonStyle = css`
  justify-content: center;
  background-color: ${theme.home.violet};
  box-shadow: 0 8px 16px rgb(0 0 0 / 16%);
`;

const ContinueButtonStyle = css`
  justify-content: center;
  background-color: white;
  box-shadow: 0 8px 16px rgb(0 0 0 / 16%);
`;

export {
  HomepageStyle,
  TitleTextStyle,
  SubTitleTextStyle,
  VioletTextStyle,
  InfoCardsWrapperStyle,
  CreateButtonStyle,
  ContinueButtonStyle,
};
