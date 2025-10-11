import { css } from '@emotion/react';

import theme from '@/styles/theme';

const HomeScrollContainerStyle = css`
  overflow-y: auto;
  height: calc(100dvh - 8.1rem);
`;

const HomeContentStyle = css`
  background-color: ${theme.colors.white};

  @media (width <= 1200px) {
    height: auto;
  }
`;

const MainContentWrapperStyle = css`
  position: relative;
  z-index: 10;

  @media (width <= 1200px) {
    flex-direction: column;
    height: auto;
    padding: 4rem 0;
  }
`;

const CircleStyle = css`
  position: fixed;
  z-index: 0;
  top: 57%;
  left: 40%;
  transform: translate(-50%, -50%);

  width: 50vw;
  min-width: 20rem;
  max-width: 50rem;
  height: 50vw;
  min-height: 20rem;
  max-height: 50rem;
  border-radius: 50%;

  background: ${theme.colors.blue[200]}50;
`;

const RectangleStyle = css`
  position: fixed;
  z-index: 0;
  top: 37%;
  left: 48%;
  transform: translate(-30%, -50%);

  width: 40vw;
  min-width: 18rem;
  max-width: 40rem;
  height: 55vw;
  min-height: 25rem;
  max-height: 55rem;

  background: ${theme.colors.blue[450]}60;
`;

const FeedbackTextStyle = css`
  z-index: 10;
`;

const FeedbackButtonStyle = css`
  position: relative;
  z-index: 10;

  display: flex;
  align-items: center;
  justify-content: center;

  box-sizing: border-box;
  width: 30rem;
  padding: 2rem;
  border-radius: ${theme.radius.sm};

  color: ${theme.colors.white};

  background-color: ${theme.colors.blue[450]};
  box-shadow: 0 0.8rem 1.6rem rgb(0 0 0 / 26%);

  &:hover {
    color: ${theme.colors.white};
    background-color: ${theme.colors.blue[200]};
  }

  @media (width <= 800px) {
    width: 100%;
    max-width: 28rem;
  }
`;

const linkStyle = css`
  color: inherit;
  text-decoration: none;

  &:focus-visible {
    outline: 2px solid ${theme.colors.blue[450]};
    outline-offset: 2px;
  }
`;

export {
  HomeScrollContainerStyle,
  HomeContentStyle,
  MainContentWrapperStyle,
  CircleStyle,
  RectangleStyle,
  FeedbackTextStyle,
  FeedbackButtonStyle,
  linkStyle,
};
