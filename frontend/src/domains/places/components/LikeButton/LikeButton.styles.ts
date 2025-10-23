import { css } from '@emotion/react';

import theme from '@/styles/theme';

const LikeButtonStyle = (liked: boolean) => css`
  all: unset;

  cursor: pointer;

  padding: 0.2rem 0.5rem;
  border: 1px solid ${liked ? theme.colors.blue[300] : theme.colors.gray[100]};
  border-radius: ${theme.radius.sm};

  background-color: ${liked ? theme.colors.blue[50] : theme.colors.white};

  &:hover {
    background-color: ${liked ? theme.colors.blue[100] : theme.colors.gray[25]};
  }
`;

export { LikeButtonStyle };
