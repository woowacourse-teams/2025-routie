import { css } from '@emotion/react';

import theme from '@/styles/theme';

const LikeButtonStyle = css`
  all: unset;

  cursor: pointer;

  padding: 0.2rem 0.5rem;
  border: 1px solid ${theme.colors.gray[100]};
  border-radius: 8px;

  &:hover {
    background-color: #f5f5f5;
  }
`;

export { LikeButtonStyle };
