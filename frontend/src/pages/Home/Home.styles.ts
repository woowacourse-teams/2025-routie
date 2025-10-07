import { css } from '@emotion/react';

import theme from '@/styles/theme';

const HomepageStyle = css`
  background-color: ${theme.home.gray};

  @media (width <= 970px) {
    height: auto;
  }
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

const ButtonWrapperStyle = css`
  @media (width <= 970px) {
    flex-direction: column;
    gap: 2rem;
    max-width: 40rem;
  }
`;

const CreateButtonStyle = css`
  justify-content: center;
  max-width: 31rem;
  background-color: ${theme.home.violet};
  box-shadow: 0 8px 16px rgb(0 0 0 / 16%);
`;

const ContinueButtonStyle = css`
  justify-content: center;
  max-width: 31rem;
  background-color: ${theme.colors.white};
  box-shadow: 0 8px 16px rgb(0 0 0 / 16%);
`;

export {
  HomepageStyle,
  TitleTextStyle,
  SubTitleTextStyle,
  VioletTextStyle,
  ButtonWrapperStyle,
  CreateButtonStyle,
  ContinueButtonStyle,
};
