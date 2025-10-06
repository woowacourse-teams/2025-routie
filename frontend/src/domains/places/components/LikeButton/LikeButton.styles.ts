import { css } from '@emotion/react';

import theme from '@/styles/theme';

const LikeButtonStyle = css`
  all: unset;

  cursor: pointer;

  padding: 0.2rem 0.5rem;
  border: 1px solid ${theme.colors.gray[100]};
  border-radius: ${theme.radius.sm};

  &:hover {
    background-color: ${theme.colors.gray[25]};
  }
`;

export { LikeButtonStyle };
