import { css } from '@emotion/react';

import theme from '@/styles/theme';

const FeedbackSectionStyle = ({ isVisible }: { isVisible: boolean }) => css`
  pointer-events: ${isVisible ? 'auto' : 'none'};

  position: fixed;
  z-index: 99;
  right: 3rem;
  bottom: 10rem;

  border: 0.5px solid ${theme.colors.gray[100]};
  border-radius: ${theme.radius.sm};

  opacity: ${isVisible ? 1 : 0};
  background-color: ${theme.colors.white};
  box-shadow: 2px 4px 4px 0 rgb(0 0 0 / 15%);

  transition: opacity 0.3s ease;
`;

const FeedbackButtonStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 16rem;
  padding: 1.4rem;
  border-radius: ${theme.radius.sm};

  color: ${theme.colors.white};

  background-color: ${theme.colors.blue[450]};

  &:hover {
    background-color: ${theme.colors.blue[200]};
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

const FeedbackIconButtonStyle = css`
  position: fixed;
  z-index: 100;
  right: 3rem;
  bottom: 3rem;

  width: 4rem;
  height: 4rem;
  border-radius: 50%;

  background-color: ${theme.colors.white};
  box-shadow: 0 0.4rem 1.2rem rgb(0 0 0 / 30%);

  & img {
    width: 2rem;
    height: 2rem;
  }

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0.6rem 1.6rem rgb(0 0 0 / 35%);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const FeedbackOverlayStyle = css`
  position: fixed;
  z-index: 98;
  inset: 0;
  background: transparent;
`;

export {
  FeedbackSectionStyle,
  FeedbackButtonStyle,
  linkStyle,
  FeedbackIconButtonStyle,
  FeedbackOverlayStyle,
};
