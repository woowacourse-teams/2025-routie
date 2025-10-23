import { css } from '@emotion/react';

import theme from '@/styles/theme';

const HomeScrollContainerStyle = css`
  overflow-y: hidden;
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

export {
  HomeScrollContainerStyle,
  HomeContentStyle,
  MainContentWrapperStyle,
  CircleStyle,
  RectangleStyle,
};
