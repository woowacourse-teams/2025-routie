import { css } from '@emotion/react';

import theme from '@/styles/theme';

const FeedbackSectionStyle = ({ isVisible }: { isVisible: boolean }) => css`
  pointer-events: ${isVisible ? 'auto' : 'none'};

  position: fixed;
  z-index: 99;
  right: 3rem;
  bottom: 10rem;

  display: flex;

  min-width: 20rem;
  padding: 2rem;
  border: 0.5px solid ${theme.colors.gray[100]};
  border-radius: ${theme.radius.sm};

  opacity: ${isVisible ? 1 : 0};
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

export { FeedbackSectionStyle, FeedbackButtonStyle, linkStyle };
