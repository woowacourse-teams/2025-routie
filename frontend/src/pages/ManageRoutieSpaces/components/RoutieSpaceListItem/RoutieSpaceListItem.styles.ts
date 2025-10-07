import { css } from '@emotion/react';

import theme from '@/styles/theme';

const RoutieSpaceListItemStyle = css`
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: space-between;

  box-sizing: border-box;
  width: 100%;
  padding: 1rem;
  border: 1px solid ${theme.colors.gray[50]};
  border-radius: ${theme.radius.sm};

  background-color: ${theme.colors.white};
  box-shadow: 2px 4px 4px 0 rgb(0 0 0 / 15%);

  &:hover {
    background-color: ${theme.colors.gray[25]};
  }
`;

export { RoutieSpaceListItemStyle };
