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

const CircleStyle = css`
  pointer-events: none;

  position: absolute;
  z-index: 0;
  top: 340px;
  left: 600px;

  width: 45rem;
  height: 45rem;
  border-radius: 50%;

  background: ${theme.colors.blue[250]}40;
`;

const RectangleStyle = css`
  pointer-events: none;

  position: absolute;
  z-index: 0;
  top: 120px;
  left: 860px;

  width: 35rem;
  height: 50rem;

  background: ${theme.colors.blue[450]}70;
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
  z-index: 2;
  width: 30rem;
  padding: 2rem;
  box-shadow: 0 0.8rem 1.6rem rgb(0 0 0 / 26%);
`;

export {
  HomeScrollContainerStyle,
  HomeContentStyle,
  CircleStyle,
  RectangleStyle,
  BlueTextStyle,
  ButtonWrapperStyle,
  CreateButtonStyle,
  ContinueButtonStyle,
  FeedbackButtonStyle,
};
