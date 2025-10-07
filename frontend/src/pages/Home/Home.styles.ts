import { css } from '@emotion/react';

import theme from '@/styles/theme';

const HomeScrollContainerStyle = css`
  overflow-y: auto;
  height: calc(100dvh - 7.1rem);
`;

const HomeContentStyle = css`
  background-color: ${theme.home.gray};

  @media (width <= 970px) {
    height: auto;
  }
`;

const BlueTextStyle = css`
  font-size: inherit;
  color: ${theme.colors.blue[450]};
`;

const ButtonWrapperStyle = css`
  align-self: flex-start;
  justify-content: flex-start;
  width: auto;

  @media (width <= 970px) {
    flex-direction: column;
    gap: 2rem;
    max-width: 40rem;
  }
`;

const CreateButtonStyle = css`
  justify-content: center;
  max-width: 31rem;
  box-shadow: 0 8px 16px rgb(0 0 0 / 16%);
`;

const ContinueButtonStyle = css`
  justify-content: center;
  max-width: 31rem;
  background-color: ${theme.colors.white};
  box-shadow: 0 8px 16px rgb(0 0 0 / 16%);
`;

const FeedbackButtonStyle = css`
  width: 30rem;
  padding: 2rem;
  box-shadow: 0 0.8rem 1.6rem rgb(0 0 0 / 26%);
`;

export {
  HomeScrollContainerStyle,
  HomeContentStyle,
  BlueTextStyle,
  ButtonWrapperStyle,
  CreateButtonStyle,
  ContinueButtonStyle,
  FeedbackButtonStyle,
};
