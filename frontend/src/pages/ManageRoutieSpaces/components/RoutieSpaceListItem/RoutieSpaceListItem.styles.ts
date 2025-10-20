import { css } from '@emotion/react';

import theme from '@/styles/theme';

const RoutieSpaceListItemStyle = css`
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: space-between;

  box-sizing: border-box;
  width: 100%;
  max-width: 25rem;
  padding: 1rem;
  border: 1px solid ${theme.colors.gray[50]};
  border-radius: ${theme.radius.sm};

  background-color: ${theme.colors.white};
  box-shadow: 2px 4px 4px 0 rgb(0 0 0 / 15%);

  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 4px 8px 12px 0 rgb(0 0 0 / 20%);
  }

  @media (width <= 540px) {
    max-width: 100%;
  }
`;

export { RoutieSpaceListItemStyle };
